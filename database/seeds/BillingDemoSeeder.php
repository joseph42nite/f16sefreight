<?php

use App\AccountsInvoice;
use App\AccountsReceipt;
use App\Company;
use App\Partner;
use App\Services\EnquirySequenceService;
use App\Support\BillingDocuments;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Billing data you can click through (user, 2026-09-19: "put demo data to test all this so we know all this works").
 *
 *     php artisan db:seed --class=BillingDemoSeeder
 *
 * Every register on the billing page ends up with something in it: all five document types, in two branches and two
 * currencies, receipts that settle in full and in part, and one invoice that has been through the IRP and one that
 * has not.
 *
 * 🔴 **The DEMO tenant only.** It finds the company by code `DEMO` and touches nothing else — the live tenant's
 * financial rows are not a seeder's to write. Re-running deletes what it made last time (notes, brokerage, consol
 * and receipts of that tenant) and makes it again; ordinary invoices seeded by FreightDemoSeeder are left alone.
 */
class BillingDemoSeeder extends Seeder
{
    private EnquirySequenceService $sequences;

    public function run(): void
    {
        $this->sequences = app(EnquirySequenceService::class);
        $company = Company::withoutGlobalScopes()->where('code', 'DEMO')->first();

        if ($company === null) {
            $this->command->warn('No DEMO tenant — run FreightDemoSeeder first.');

            return;
        }

        $branches = DB::table('agents_info')->where('company_id', $company->id)->pluck('id')->all();
        $this->clear($branches);
        $this->openPeriods($branches);

        $agent = $this->overseasAgent($company->id, $branches[0]);
        $made = ['debit_note' => 0, 'credit_note' => 0, 'brokerage' => 0, 'consol_invoice' => 0, 'receipts' => 0, 'chases' => 0, 'vouchers' => 0, 'payments' => 0, 'costsheets' => 0, 'postings' => 0];

        foreach ($branches as $branch) {
            // Give the invoices already there the columns a bill register prints.
            $this->describeExisting($branch);

            // A branch with no bills of its own has an empty register, which demonstrates nothing.
            $this->billSomeShipments($branch);
            $this->billOneSeaShipment($branch);

            $billed = AccountsInvoice::withoutGlobalScopes()->where('agent_id', $branch)->where('type', 'invoice')
                ->whereNotIn('status', ['draft', 'void'])->orderByDesc('id')->limit(6)->get();

            if ($billed->isEmpty()) {
                continue;
            }

            // A weight correction after the bill went out, and a rate dispute settled — the two notes actually happen.
            if ($parent = $billed->first()) {
                $this->note($parent, 'debit_note', 'Weight corrected at acceptance', 'Reweigh 42 kg at 95.00', 3990, 18);
                $made['debit_note']++;
            }

            if ($parent = $billed->skip(1)->first()) {
                $this->note($parent, 'credit_note', 'Rate billed above the quoted slab',
                    'Rate difference 6.00/kg', min(2400, (float) $parent->grand_total * 0.15), 18);
                $made['credit_note']++;
            }

            // Commission we bill an overseas agent, and the consol settlement with them.
            if ($job = $billed->first()?->job_id) {
                $this->partnerBill($branch, $job, $agent, 'brokerage', 'percentage_of_freight',
                    'Booking commission 5% on nomination', 'Sales commission — nominated shipment', 18500);
                $made['brokerage']++;

                $this->partnerBill($branch, $job, $agent, 'consol_invoice', 'flat_rate',
                    'Profit share, consol MAA-DXB week 38', 'Consol profit share', 42000);
                $made['consol_invoice']++;
            }

            $made['receipts'] += $this->receipts($branch, $billed);
            $made['chases'] += $this->chases($branch);
            $made['vouchers'] += $this->costSome($branch);
            $made['payments'] += $this->paySome($branch);
            $made['costsheets'] += $this->costSheets($branch);
            $made['postings'] += $this->postSome($branch);
        }

        $this->creditLimits($branches);

        // One invoice through the IRP and the rest waiting, so the e-invoice register shows both states.
        $registered = AccountsInvoice::withoutGlobalScopes()->whereIn('agent_id', $branches)
            ->where('type', 'invoice')->whereNotIn('status', ['draft', 'void'])->latest('id')->first();

        $registered?->update(['irn' => hash('sha256', $registered->invoice_no), 'irn_status' => 'generated',
            'ack_no' => '112' . random_int(100000000, 999999999), 'ack_date' => now()->subDays(2)]);

        $this->command->info(sprintf(
            'Billing demo: %d debit notes, %d credit notes, %d brokerage, %d consol, %d receipts, %d chases, '
                . '%d purchase vouchers, %d supplier payments, %d cost sheets waiting, %d documents posted to the ledger '
                . 'across %d branches.',
            $made['debit_note'], $made['credit_note'], $made['brokerage'], $made['consol_invoice'],
            $made['receipts'], $made['chases'], $made['vouchers'], $made['payments'], $made['costsheets'],
            $made['postings'],
            count($branches)
        ));
    }

    /**
     * Credit limits with room to work in, and ONE client deliberately over.
     *
     * 🔴 A demo where every client is over their limit cannot demonstrate anything: the gate refuses every
     * finalize and the flow stops at the first click. So each client's limit is set from what they actually owe
     * — comfortable headroom for most, and the largest debtor left ON HOLD on purpose, because a gate nobody
     * ever sees fire is a gate nobody trusts.
     */
    private function creditLimits(array $branches): void
    {
        $owed = AccountsInvoice::withoutGlobalScopes()->whereIn('agent_id', $branches)
            ->whereIn('status', \App\Services\AgeingService::OWED)
            // ⚠️ Brokerage and consol bills are addressed to a PARTNER and carry no customer at all (PRD §6.2);
            // grouping them would try to set a credit limit on nobody.
            ->whereNotNull('customer_id')
            ->selectRaw('customer_id, SUM(CASE WHEN type = ? THEN -1 ELSE 1 END * (grand_total - amount_paid)) AS owed',
                ['credit_note'])
            ->groupBy('customer_id')->pluck('owed', 'customer_id');

        $biggest = $owed->sortDesc()->keys()->first();

        foreach ($owed as $customerId => $balance) {
            $balance = max(0, round((float) $balance, 2));

            DB::table('customers')->where('id', $customerId)->update([
                // The biggest debtor sits at 70% of what they owe: on hold, and visibly so.
                'credit_limit' => $customerId === $biggest
                    ? round($balance * 0.7, -3)
                    : round($balance * 2.5 + 500000, -5),
                'updated_at' => now(),
            ]);
        }

        // ⚠️ One client keeps NO limit at all, because "not configured" and "zero" must look different on screen.
        $noLimit = $owed->keys()->last();
        if ($noLimit !== null && $noLimit !== $biggest) {
            DB::table('customers')->where('id', $noLimit)->update(['credit_limit' => null, 'updated_at' => now()]);
        }
    }

    /** Last run's documents, so re-running does not stack six credit notes on one invoice. */
    private function clear(array $branches): void
    {
        // 🔴 Everything this seeder can recreate, so re-running is IDEMPOTENT. Without the drafts in this list
        // every run stacked another set of cost sheets on the queue — 4 waiting became 12 in three runs, and a
        // demo whose figures move every time you rebuild it is a demo nobody can check anything against.
        // ⚠️ Drafts are safe to drop wholesale: no client has ever seen one, and nothing points at them.
        $ids = AccountsInvoice::withoutGlobalScopes()->whereIn('agent_id', $branches)
            ->where(fn ($q) => $q->whereIn('type', ['debit_note', 'credit_note', 'brokerage', 'consol_invoice'])
                ->orWhere('status', 'draft'))
            ->pluck('id');

        // 🔴 Foreign-key checks OFF for the clear, for the reason the regression seeder does it (GAPS #380):
        // every new financial table adds another pointer at the vouchers and invoices this deletes, and a
        // hand-maintained order is wrong the first time one arrives. It broke exactly that way the day payments
        // landed — `accounts_payment_allocations` pointed at a voucher and the seeder could no longer clear
        // itself. ⚠️ Safe HERE only: this removes the financial rows of a DEMO tenant it owns and recreates.
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        try {
            DB::table('collection_follow_ups')->whereIn('agent_id', $branches)->delete();

            $receipts = DB::table('accounts_receipts')->whereIn('agent_id', $branches)->pluck('id');
            $payments = DB::table('accounts_payments')->whereIn('agent_id', $branches)->pluck('id');
            $vouchers = DB::table('accounts_purchase_vouchers')->whereIn('agent_id', $branches)->pluck('id');

            // 🔴 Branch-scoped like the ledger it feeds: left behind, a stale deduction is one the register
            // still counts against a ledger this reseed is about to empty and rebuild — exactly the "ledger
            // disagrees with the register" the TDS screen warns about, except here the disagreement is the
            // seeder's own doing, not a posting that went missing.
            DB::table('tds_entries')->whereIn('agent_id', $branches)->delete();

            DB::table('accounts_receipt_allocations')->whereIn('receipt_id', $receipts)->delete();
            DB::table('accounts_receipts')->whereIn('agent_id', $branches)->delete();
            DB::table('accounts_payment_allocations')->whereIn('payment_id', $payments)->delete();
            DB::table('accounts_payments')->whereIn('agent_id', $branches)->delete();

            DB::table('accounts_invoice_items')->whereIn('invoice_id', $ids)->delete();
            DB::table('accounts_invoice_brokerage_details')->whereIn('invoice_id', $ids)->delete();
            DB::table('accounts_invoice_consol_details')->whereIn('invoice_id', $ids)->delete();
            AccountsInvoice::withoutGlobalScopes()->whereIn('id', $ids)->delete();

            DB::table('accounts_purchase_items')->whereIn('purchase_voucher_id', $vouchers)->delete();
            DB::table('accounts_purchase_vouchers')->whereIn('agent_id', $branches)->delete();

            // Last: receipts, payments and statement lines all point at a bank account.
            DB::table('bank_transactions')->whereIn('agent_id', $branches)->update(['bank_account_id' => null]);
            DB::table('bank_accounts')->whereIn('agent_id', $branches)->delete();

            // The ledger of a DEMO tenant is the seeder's to rebuild; on a live one it would never be touched.
            DB::table('accounts_ledger_entries')->whereIn('agent_id', $branches)->delete();
            // The register is rebuilt with the ledger it mirrors. Left behind, every reseed re-posts the same
            // invoices and doubles their rows — harmless only for as long as nothing ever wrote one.
            DB::table('gst_ledger_entries')->whereIn('agent_id', $branches)->delete();
            DB::table('unposted_transactions_queue')->whereIn('agent_id', $branches)->delete();
        } finally {
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
        }
        AccountsInvoice::withoutGlobalScopes()->whereIn('agent_id', $branches)->update(['is_posted' => false]);

        // Whatever those receipts had settled goes back to being owed.
        AccountsInvoice::withoutGlobalScopes()->whereIn('agent_id', $branches)->where('amount_paid', '>', 0)
            ->update(['amount_paid' => 0, 'status' => DB::raw("CASE WHEN status IN ('paid','partially_paid') THEN 'sent' ELSE status END")]);
    }

    private function openPeriods(array $branches): void
    {
        foreach ($branches as $branch) {
            if (! DB::table('accounting_periods')->where('agent_id', $branch)->where('status', 'open')->exists()) {
                DB::table('accounting_periods')->insert([
                    'agent_id' => $branch, 'period_name' => 'FY' . now()->format('y'),
                    'start_date' => now()->startOfYear()->toDateString(), 'end_date' => now()->endOfYear()->toDateString(),
                    'status' => 'open', 'created_at' => now(), 'updated_at' => now(),
                ]);
            }
        }
    }

    /** The overseas agent brokerage and consol bills are addressed to. */
    private function overseasAgent(int $companyId, int $branchId): Partner
    {
        return Partner::withoutGlobalScopes()->firstOrCreate(
            ['company_id' => $companyId, 'name' => 'Skyline Logistics DXB'],
            ['agent_id' => $branchId, 'partner_type' => 'agent', 'email' => 'accounts@skyline-dxb.test',
             'phone' => '+971 4 555 0100', 'address' => 'Cargo Village, Dubai']
        );
    }

    /**
     * Bill one sea shipment, so the lane report has a sea lane in it.
     *
     * ⚠️ Sea lanes are quoted as five-character LOCODEs — INNSA → DEHAM — and they read from `ports`, not from
     * `locations`. With only air shipments billed, nothing on the demo exercises that half (GAPS #376).
     */
    private function billOneSeaShipment(int $branch): void
    {
        // Once per branch, ever — not once per run, which would bill a new sea shipment each time.
        if (AccountsInvoice::withoutGlobalScopes()->where('agent_id', $branch)
            ->where('transport_mode', 'sea')->whereNotIn('status', ['draft', 'void'])->exists()) {
            return;
        }

        $job = DB::table('jobs as j')->join('enquiries as e', 'e.id', '=', 'j.enquiry_id')
            ->where('j.agent_id', $branch)->where('j.transport_mode', 'sea')
            ->whereNotNull('e.origin_code')
            ->whereNotIn('j.id', AccountsInvoice::withoutGlobalScopes()->where('agent_id', $branch)->select('job_id'))
            ->orderByDesc('j.id')->first(['j.id', 'e.customer_id']);

        if ($job === null) {
            return;
        }

        $customer = $job->customer_id ?? DB::table('customers')
            ->where('company_id', DB::table('agents_info')->where('id', $branch)->value('company_id'))->value('id');

        if ($customer === null) {
            return;
        }

        $freight = 285000;
        $tax = round($freight * 0.05, 2);   // ocean freight on an export leg

        $invoice = AccountsInvoice::withoutGlobalScopes()->create([
            'agent_id' => $branch, 'job_id' => $job->id, 'transport_mode' => 'sea',
            'customer_id' => $customer, 'billed_party_type' => 'customer', 'billed_party_id' => $customer,
            'billed_party_role' => 'client', 'invoice_no' => $this->sequences->next($branch, 'INV'),
            'type' => 'invoice', 'document_date' => now()->subDays(18)->toDateString(),
            'due_date' => now()->addDays(12)->toDateString(), 'status' => 'sent',
            'narration' => 'Ocean freight and terminal handling',
            'currency' => 'INR', 'exchange_rate' => 1,
            'subtotal' => $freight, 'tax_amount' => $tax, 'grand_total' => $freight + $tax,
        ]);

        $invoice->items()->create(['charge_type' => 'freight', 'description' => 'Ocean freight, 1 x 40HC',
            'hsn_sac_code' => '996521', 'quantity' => 1, 'rate' => $freight, 'amount' => $freight,
            'tax_percentage' => 5, 'tax_amount' => $tax, 'net_amount' => $freight + $tax]);
    }

    /** Bill a few of this branch's shipments, if nobody has billed any. */
    private function billSomeShipments(int $branch): void
    {
        if (AccountsInvoice::withoutGlobalScopes()->where('agent_id', $branch)->whereNotIn('status', ['draft', 'void'])->exists()) {
            return;
        }

        $customers = DB::table('customers')
            ->where('company_id', DB::table('agents_info')->where('id', $branch)->value('company_id'))
            ->pluck('id')->all();

        if ($customers === []) {
            return;
        }

        $jobs = DB::table('jobs')->where('agent_id', $branch)->orderByDesc('id')->limit(4)->get(['id', 'transport_mode', 'awb_number']);

        foreach ($jobs as $index => $job) {
            $freight = round(random_int(48, 210) * 1000 / 100) * 100;
            $handling = round($freight * 0.08, 2);
            $subtotal = round($freight + $handling, 2);
            $tax = round($subtotal * 0.18, 2);

            $invoice = AccountsInvoice::withoutGlobalScopes()->create([
                'agent_id' => $branch, 'job_id' => $job->id, 'transport_mode' => $job->transport_mode ?: 'air',
                'customer_id' => $customers[$index % count($customers)],
                'billed_party_type' => 'customer', 'billed_party_id' => $customers[$index % count($customers)],
                'billed_party_role' => 'client',
                'invoice_no' => $this->sequences->next($branch, 'INV'),
                'type' => 'invoice', 'document_date' => now()->subDays(30 - $index * 7)->toDateString(),
                'due_date' => now()->addDays($index * 7)->toDateString(),
                'status' => $index === 0 ? 'finalized' : 'sent',
                'narration' => trim(ucfirst((string) ($job->transport_mode ?: 'air')) . ' freight and local charges'
                    . ($job->awb_number ? ' — ' . $job->awb_number : '')),
                'currency' => 'INR', 'exchange_rate' => 1,
                'subtotal' => $subtotal, 'tax_amount' => $tax, 'grand_total' => round($subtotal + $tax, 2),
            ]);

            foreach ([['Air freight', $freight, '996531'], ['Handling and documentation', $handling, '996719']] as [$what, $amount, $hsn]) {
                $invoice->items()->create(['charge_type' => 'freight', 'description' => $what, 'hsn_sac_code' => $hsn,
                    'quantity' => 1, 'rate' => $amount, 'amount' => $amount, 'tax_percentage' => 18,
                    'tax_amount' => round($amount * 0.18, 2), 'net_amount' => round($amount * 1.18, 2)]);
            }
        }
    }

    /**
     * Cost sheets in flight, so the hand-over from pricing is visible on both sides.
     *
     * 🔴 **Without these, Money in ① is empty and the flow cannot be seen.** Pricing builds a sheet with a sell
     * side and a buy side and presses *Send to accounts*; accounts then see it waiting to be billed. Two per
     * branch are sent (accounts' queue) and one is left unsent (pricing's own work in progress).
     */
    private function costSheets(int $branch): int
    {
        $company = DB::table('agents_info')->where('id', $branch)->value('company_id');
        $customers = DB::table('customers')->where('company_id', $company)->pluck('id')->all();
        $carrier = Partner::withoutGlobalScopes()->where('company_id', $company)
            ->where('partner_type', 'airline')->value('id');
        $pricing = DB::table('users')->where('branch_name', $branch)->where('designation', 'pricing')->value('id');

        if ($customers === [] || $carrier === null) {
            return 0;
        }

        // Shipments that nobody has billed at all — a cost sheet belongs to a job with no invoice yet.
        $jobs = DB::table('jobs')->where('agent_id', $branch)->whereNull('deleted_at')
            ->whereNotIn('id', AccountsInvoice::withoutGlobalScopes()->where('agent_id', $branch)->select('job_id'))
            ->orderByDesc('id')->limit(3)->pluck('id')->all();

        $made = 0;

        foreach ($jobs as $index => $jobId) {
            $freight = 120000 + $index * 35000;
            $handling = round($freight * 0.09, 2);
            $cost = round($freight * 0.74, 2);

            $invoice = AccountsInvoice::withoutGlobalScopes()->create([
                'agent_id' => $branch, 'job_id' => $jobId, 'transport_mode' => 'air',
                'customer_id' => $customers[$index % count($customers)],
                'billed_party_type' => 'customer', 'billed_party_id' => $customers[$index % count($customers)],
                'billed_party_role' => 'client', 'created_by' => $pricing,
                'invoice_no' => AccountsInvoice::placeholderNumber($jobId), 'type' => 'invoice',
                'document_date' => now()->toDateString(), 'due_date' => now()->addDays(30)->toDateString(),
                'status' => 'draft', 'currency' => 'INR', 'exchange_rate' => 1,
                'narration' => 'Air freight and local charges',
                'subtotal' => $freight + $handling, 'tax_amount' => round(($freight + $handling) * 0.18, 2),
                'grand_total' => round(($freight + $handling) * 1.18, 2),
                // ⚠️ The LAST one stays unsent: that is pricing's work in progress, not accounts' queue.
                'sent_to_accounts_at' => $index < 2 ? now()->subDays($index + 1) : null,
                'sent_to_accounts_by' => $index < 2 ? $pricing : null,
            ]);

            foreach ([['Air freight', $freight, '996531'], ['Handling and documentation', $handling, '996719']] as [$what, $amount, $hsn]) {
                $invoice->items()->create(['charge_type' => 'freight', 'description' => $what, 'hsn_sac_code' => $hsn,
                    'quantity' => 1, 'rate' => $amount, 'amount' => $amount, 'tax_percentage' => 18,
                    'tax_amount' => round($amount * 0.18, 2), 'net_amount' => round($amount * 1.18, 2)]);
            }

            // The buy side of the same sheet, so the margin on it is real before it is ever billed.
            $voucherId = DB::table('accounts_purchase_vouchers')->insertGetId([
                'agent_id' => $branch, 'job_id' => $jobId, 'vendor_id' => $carrier, 'transport_mode' => 'air',
                'voucher_no' => $this->sequences->next($branch, 'PV'), 'document_date' => now()->toDateString(),
                'status' => 'unpaid', 'created_by' => $pricing, 'created_at' => now(), 'updated_at' => now(),
            ]);
            DB::table('accounts_purchase_items')->insert(['purchase_voucher_id' => $voucherId,
                'charge_type' => 'freight', 'description' => 'Air freight cost', 'quantity' => 1,
                'rate' => $cost, 'amount' => $cost, 'tax_percentage' => 18,
                'tax_amount' => round($cost * 0.18, 2), 'net_amount' => round($cost * 1.18, 2),
                'created_at' => now(), 'updated_at' => now()]);

            $made++;
        }

        return $made;
    }

    /**
     * The buy side, so a margin is a margin.
     *
     * ⚠️ Without vouchers every shipment reads 100% and the profitability report is a revenue report with a
     * warning on every row. The costs here are shaped like real ones — most of it the carrier, a little trucking
     * and clearance — and one shipment in six is deliberately a LOSS, because a report where nothing ever loses
     * money is one nobody opens twice.
     */
    /**
     * Settle some of what we owe, withholding TDS where a vendor is classified for it.
     *
     * 🔴 **Without this the demo has 66 unpaid vouchers and no payments at all**, so the TDS register is
     * empty, step ⑤ reads "nothing was withheld", and neither the deduction nor the 20% no-PAN case is
     * visible anywhere a person can look. The whole point of the demo is that the cases exist.
     *
     * ⚠️ It goes through `TdsService` rather than hardcoding a figure, so what the demo shows is what the
     * code would actually do — a seeded number that agreed with nothing would be worse than no demo.
     */
    private function paySome(int $branch): int
    {
        $tds = app(\App\Services\TdsService::class);
        $tds->seedRatesFor($branch);

        $bank = \App\BankAccount::withoutGlobalScopes()->where('agent_id', $branch)->orderBy('id')->first();
        $made = 0;

        // A handful per vendor, so each classification shows up: 194J with a PAN, 194C with one, and 194C
        // without — which is the 20% s.206AA rate, visible rather than described.
        foreach (\App\AccountsPurchaseVoucher::withoutGlobalScopes()->where('agent_id', $branch)
            ->where('status', 'unpaid')->orderBy('id')->limit(9)->get()->groupBy('vendor_id') as $vendorId => $group) {

            $vendor = DB::table('partners')->where('id', $vendorId)
                ->first(['id', 'name', 'pan_no', 'tds_section', 'tds_rate_override']);

            if ($vendor === null) {
                continue;
            }

            $date = now()->subDays(6)->toDateString();
            $gross = 0.0;
            $net = 0.0;

            foreach ($group as $voucher) {
                $gross = round($gross + (float) $voucher->items()->sum('net_amount'), 2);
                $net = round($net + (float) $voucher->items()->sum('amount'), 2);
            }

            if ($gross <= 0) {
                continue;
            }

            $decision = $tds->forVendor($vendor, $branch, $net,
                $tds->paidThisYear($branch, (int) $vendorId, $date),
                $tds->deductedThisYear($branch, (int) $vendorId, $date, $vendor->tds_section));

            $payment = \App\AccountsPayment::withoutGlobalScopes()->create([
                'agent_id' => $branch, 'payee_type' => 'partner', 'payee_id' => (int) $vendorId,
                'payment_no' => $this->sequences->next($branch, 'PAY'),
                'payment_date' => $date, 'mode' => 'bank_transfer',
                'reference' => 'UTR-DEMO-' . $vendorId, 'amount' => $gross,
                'tds_amount' => $decision['amount'], 'tds_section' => $decision['section'],
                'tds_rate' => $decision['deduct'] ? $decision['rate'] : null,
                'currency' => 'INR', 'exchange_rate' => 1, 'run_ref' => 'RUN-DEMO',
                'bank_account_id' => $bank?->id, 'is_posted' => true,
                'created_by' => DB::table('users')->where('branch_name', $branch)
                    ->where('designation', 'accounts')->value('id'),
            ]);

            foreach ($group as $voucher) {
                $amount = round((float) $voucher->items()->sum('net_amount'), 2);
                $payment->allocations()->create(['purchase_voucher_id' => $voucher->id, 'amount' => $amount]);
                $voucher->update(['amount_paid' => $amount, 'status' => 'paid']);
            }

            $ledger = app(\App\Services\LedgerPostingService::class);
            $period = $ledger->openPeriodFor($branch, $date);

            if ($period === null) {
                // Dated outside every open period — the posting gate doing its job, not a seeder failure.
                $payment->update(['is_posted' => false]);

                continue;
            }

            $ledger->write($ledger->linesForPayment($gross, $bank, $decision['amount']),
                $branch, $period->id, $payment->id, 'payment');

            if ($decision['amount'] > 0) {
                $tds->record([
                    'agent_id' => $branch,
                    'company_id' => DB::table('agents_info')->where('id', $branch)->value('company_id'),
                    'direction' => \App\Services\TdsService::OUTWARD,
                    'counterparty_type' => 'partner', 'counterparty_id' => (int) $vendorId,
                    'counterparty_pan' => $vendor->pan_no, 'section' => $decision['section'],
                    'rate' => $decision['rate'], 'base_amount' => $net, 'tds_amount' => $decision['amount'],
                    'source_id' => $payment->id, 'source_type' => 'payment', 'deducted_on' => $date,
                ]);
            }

            $made++;
        }

        return $made;
    }

    private function costSome(int $branch): int
    {
        $company = DB::table('agents_info')->where('id', $branch)->value('company_id');

        // ⚠️ The carrier needs a GSTIN of its own or every voucher against it claims NO input credit, and
        // 15 vouchers of unclaimed credit in a demo reads as a defect in GSTR-3B rather than as reference
        // data nobody filled in. A carrier flying out of Mumbai is registered in 27 like the branch.
        $carrier = Partner::withoutGlobalScopes()->firstOrCreate(
            ['company_id' => $company, 'name' => 'Emirates SkyCargo'],
            ['agent_id' => $branch, 'partner_type' => 'airline', 'email' => 'cass@emirates-skycargo.test',
             'gst_no' => '27AAACE1700A1Z5']
        );

        if ($carrier->gst_no === null) {
            $carrier->update(['gst_no' => '27AAACE1700A1Z5']);
        }
        $trucker = Partner::withoutGlobalScopes()->where('company_id', $company)
            ->where('partner_type', 'transporter')->first() ?? $carrier;
        $broker = Partner::withoutGlobalScopes()->where('company_id', $company)
            ->where('partner_type', 'customs_broker')->first() ?? $carrier;

        // Only shipments that have actually been billed: a cost against an unbilled job is work in progress.
        $billed = AccountsInvoice::withoutGlobalScopes()->where('agent_id', $branch)
            ->whereNotIn('status', ['draft', 'void'])->where('type', 'invoice')
            ->selectRaw('job_id, SUM(subtotal * exchange_rate) AS revenue')->groupBy('job_id')->get();

        // The most recently billed shipment's supplier invoice has not arrived yet (user, 2026-09-26) — the ordinary
        // way a billed shipment ends up with no cost, and what Money out ① "Cost to book" exists to catch. Left
        // uncosted so the queue has something real in it, and Close-the-month ② says so too.
        $waiting = AccountsInvoice::withoutGlobalScopes()->where('agent_id', $branch)
            ->whereNotIn('status', ['draft', 'void'])->where('type', 'invoice')
            ->orderByDesc('document_date')->orderByDesc('id')->value('job_id');

        $made = 0;

        foreach ($billed as $index => $job) {
            $revenue = (float) $job->revenue;

            if ($revenue <= 0 || (int) $job->job_id === (int) $waiting) {
                continue;
            }

            // Most shipments earn 12–30%; every fifth one is sold below cost.
            $share = $index % 5 === 4 ? 1.09 : (0.70 + ($index % 4) * 0.055);

            foreach ([[$carrier, 'Air freight', 0.78], [$trucker, 'Pickup and delivery', 0.13],
                      [$broker, 'Customs clearance', 0.09]] as [$vendor, $what, $slice]) {
                $amount = round($revenue * $share * $slice, 2);

                if ($amount <= 0) {
                    continue;
                }

                $voucherId = DB::table('accounts_purchase_vouchers')->insertGetId([
                    'agent_id' => $branch, 'job_id' => $job->job_id, 'vendor_id' => $vendor->id,
                    'transport_mode' => 'air', 'voucher_no' => $this->sequences->next($branch, 'PV'),
                    'document_date' => now()->subDays(random_int(5, 40))->toDateString(), 'status' => 'unpaid',
                    'created_at' => now(), 'updated_at' => now(),
                ]);

                DB::table('accounts_purchase_items')->insert([
                    'purchase_voucher_id' => $voucherId, 'charge_type' => 'freight', 'description' => $what,
                    'quantity' => 1, 'rate' => $amount, 'amount' => $amount, 'tax_percentage' => 18,
                    'tax_amount' => round($amount * 0.18, 2), 'net_amount' => round($amount * 1.18, 2),
                    'created_at' => now(), 'updated_at' => now(),
                ]);
                $made++;
            }
        }

        return $made;
    }

    /**
     * Post some of it, so the day book, the reports and the drill-through have something in them.
     *
     * ⚠️ Through the same service the controllers use. A seeder that wrote its own journal lines would put figures
     * in the ledger that the product itself would never produce — and the trial balance would prove nothing.
     */
    private function postSome(int $branch): int
    {
        $ledger = app(\App\Services\LedgerPostingService::class);
        // 🔴 `write()` alone is the ledger only. `InvoiceController::post()` also writes the GST register row
        // — found by checking Financials → GST register on a freshly reseeded demo and finding it empty
        // everywhere, because this loop never called it (2026-09-26).
        $invoices = app(\App\Http\Controllers\Freight\InvoiceController::class);
        // The buy-side mirror — vouchers write a register row too now (GAPS #396).
        $vouchers = app(\App\Http\Controllers\Freight\PurchaseVoucherController::class);
        $posted = 0;

        $post = function ($lines, $date, $sourceId, $type) use ($ledger, $branch, &$posted) {
            $period = $ledger->openPeriodFor($branch, $date);

            if ($period === null) {
                return false;   // dated outside every open period — exactly what the posting gate is for
            }

            $ledger->write($lines, $branch, $period->id, $sourceId, $type);
            $posted++;

            return true;
        };

        foreach (AccountsInvoice::withoutGlobalScopes()->where('agent_id', $branch)
            ->whereNotIn('status', ['draft', 'void'])->orderByDesc('id')->limit(10)->get() as $invoice) {
            if ($post($ledger->linesForInvoice($invoice), $invoice->document_date, $invoice->id, 'invoice')) {
                $invoice->update(['is_posted' => true]);
                $invoices->writeGstRegister($invoice);
            }
        }

        foreach (\App\AccountsPurchaseVoucher::withoutGlobalScopes()->where('agent_id', $branch)
            ->orderByDesc('id')->limit(6)->get() as $voucher) {
            if ($post($ledger->linesForVoucher($voucher), $voucher->document_date, $voucher->id, 'purchase_voucher')) {
                $vouchers->writeGstRegister($voucher);
            }
        }

        foreach (AccountsReceipt::withoutGlobalScopes()->where('agent_id', $branch)->get() as $receipt) {
            if ($post($ledger->linesForReceipt((float) $receipt->amount), $receipt->receipt_date, $receipt->id, 'receipt')) {
                $receipt->update(['is_posted' => true]);
            }
        }

        return $posted;
    }

    /** A due date and a narration on the invoices already there — the columns the register prints. */
    private function describeExisting(int $branch): void
    {
        foreach (AccountsInvoice::withoutGlobalScopes()->where('agent_id', $branch)->whereNull('narration')->get() as $invoice) {
            $job = DB::table('jobs')->where('id', $invoice->job_id)->first(['execution_job_no', 'awb_number', 'transport_mode']);

            $invoice->update([
                'due_date' => $invoice->document_date?->copy()->addDays(30)?->toDateString(),
                'narration' => trim(sprintf('%s freight and local charges%s',
                    ucfirst((string) ($job->transport_mode ?? 'air')),
                    $job?->awb_number ? ' — ' . $job->awb_number : '')),
            ]);
        }
    }

    /** A debit or credit note against a real invoice, finalized so it carries a real number. */
    private function note(AccountsInvoice $parent, string $type, string $reason, string $line, float $amount, float $taxPercent): void
    {
        $amount = round($amount, 2);
        $tax = round($amount * $taxPercent / 100, 2);

        $note = AccountsInvoice::withoutGlobalScopes()->create([
            'agent_id' => $parent->agent_id, 'job_id' => $parent->job_id, 'transport_mode' => $parent->transport_mode,
            'customer_id' => $parent->customer_id, 'billed_party_type' => $parent->billed_party_type,
            'billed_party_id' => $parent->billed_party_id, 'billed_party_role' => $parent->billed_party_role,
            'parent_invoice_id' => $parent->id, 'created_by' => $parent->created_by,
            'invoice_no' => $this->sequences->next($parent->agent_id, BillingDocuments::prefix($type)),
            'type' => $type, 'document_date' => now()->subDays(random_int(1, 12))->toDateString(),
            'due_date' => now()->addDays(15)->toDateString(), 'status' => 'finalized',
            'reason' => $reason,
            'narration' => ($type === 'debit_note' ? 'Additional charge on ' : 'Adjustment on ')
                . (DB::table('jobs')->where('id', $parent->job_id)->value('execution_job_no') ?: $parent->invoice_no),
            'currency' => $parent->currency, 'exchange_rate' => $parent->exchange_rate,
            'subtotal' => $amount, 'tax_amount' => $tax, 'grand_total' => round($amount + $tax, 2),
        ]);

        $note->items()->create(['charge_type' => 'other', 'description' => $line, 'hsn_sac_code' => '996531',
            'quantity' => 1, 'rate' => $amount, 'amount' => $amount, 'tax_percentage' => $taxPercent,
            'tax_amount' => $tax, 'net_amount' => round($amount + $tax, 2)]);
    }

    /** A brokerage or consol bill to a partner — no customer debtor (PRD §6.2). */
    private function partnerBill(int $branch, int $jobId, Partner $partner, string $type, string $basis,
        string $line, string $narration, float $amount): void
    {
        $invoice = AccountsInvoice::withoutGlobalScopes()->create([
            'agent_id' => $branch, 'job_id' => $jobId, 'transport_mode' => 'air',
            'customer_id' => null, 'billed_party_type' => 'partner', 'billed_party_id' => $partner->id,
            'billed_party_role' => $type === 'brokerage' ? 'broker' : 'agent', 'created_by' => null,
            'invoice_no' => $this->sequences->next($branch, BillingDocuments::prefix($type)),
            'type' => $type, 'document_date' => now()->subDays(random_int(2, 20))->toDateString(),
            'due_date' => now()->addDays(30)->toDateString(), 'status' => 'sent', 'narration' => $narration,
            // An overseas agent is billed in dollars; that is what makes the two amount columns differ.
            'currency' => 'USD', 'exchange_rate' => 83.25,
            'subtotal' => $amount, 'tax_amount' => 0, 'grand_total' => $amount,
        ]);

        $invoice->items()->create(['charge_type' => 'other', 'description' => $line, 'quantity' => 1,
            'rate' => $amount, 'amount' => $amount, 'tax_percentage' => 0, 'tax_amount' => 0, 'net_amount' => $amount]);

        $table = $type === 'brokerage' ? 'accounts_invoice_brokerage_details' : 'accounts_invoice_consol_details';
        $column = $type === 'brokerage' ? 'brokerage_basis' : 'consol_basis';

        DB::table($table)->insert(['invoice_id' => $invoice->id, 'partner_agent_id' => $partner->id,
            $column => $basis, 'created_at' => now(), 'updated_at' => now()]);
    }

    /**
     * Chases against the two most overdue clients: one promise already broken, one still in hand.
     *
     * The collections queue is only worth looking at when it shows the three states side by side — a promise that
     * was not kept, a promise not yet due, and somebody nobody has called at all.
     */
    private function chases(int $branch): int
    {
        $overdue = app(\App\Services\AgeingService::class)->byParty([$branch])
            ->filter(fn ($p) => $p['overdue'] > 0 && $p['party_type'] === 'customer')->values();

        if ($overdue->isEmpty()) {
            return 0;
        }

        $chases = [
            // A date already past that nothing has arrived against: a BROKEN promise, top of the queue.
            ['channel' => 'email', 'logged' => -11, 'promised' => -4, 'next' => 0,
             'note' => 'Emailed a statement of account; their finance desk confirmed it would be paid by month end.'],
            // A promise still in hand — asked, committed to, not yet due.
            ['channel' => 'call', 'logged' => -2, 'promised' => 6, 'next' => 5,
             'note' => 'Called Ravi in their AP team; he said the payment run goes out on Friday.'],
        ];

        // ONE party per branch, and never one somebody is already chasing — so the queue shows all three states at
        // once: a broken promise, a promise in hand, and somebody nobody has called.
        $already = DB::table('collection_follow_ups')->pluck('party_id')->all();
        $party = $overdue->first(fn ($p) => ! in_array($p['party_id'], $already, true));

        if ($party === null) {
            return 0;
        }

        $chase = $chases[count($already) === 0 ? 0 : 1];

        DB::table('collection_follow_ups')->insert([
            'agent_id' => $branch, 'party_type' => 'customer', 'party_id' => $party['party_id'],
            'channel' => $chase['channel'], 'note' => $chase['note'],
            'promised_date' => now()->addDays($chase['promised'])->toDateString(),
            'promised_amount' => round($party['overdue'] * 0.6, 2),
            'next_action_date' => now()->addDays($chase['next'])->toDateString(),
            'state' => 'open', 'created_at' => now()->addDays($chase['logged']), 'updated_at' => now(),
        ]);

        return 1;
    }

    /** One settled in full, one part paid, and one advance nobody has placed yet. */
    private function receipts(int $branch, $invoices): int
    {
        $open = $invoices->filter(fn ($i) => $i->customer_id !== null)->values();

        if ($open->isEmpty()) {
            return 0;
        }

        $made = 0;
        $modes = ['bank_transfer', 'cheque', 'upi'];

        foreach ([[0, 1.0], [1, 0.4]] as $index => [$position, $share]) {
            $invoice = $open->get($position);

            if ($invoice === null) {
                continue;
            }

            $amount = round((float) $invoice->grand_total * $share, 2);
            $receipt = $this->receipt($branch, $invoice->customer_id, $amount, $modes[$index],
                'NEFT ' . strtoupper(str_pad((string) random_int(1, 999999), 6, '0', STR_PAD_LEFT)),
                $share >= 1 ? 'Settled in full' : 'Part payment, balance to follow');

            $receipt->allocations()->create(['invoice_id' => $invoice->id, 'amount' => $amount]);

            $paid = round((float) DB::table('accounts_receipt_allocations')->where('invoice_id', $invoice->id)->sum('amount'), 2);
            $invoice->update(['amount_paid' => $paid,
                'status' => $paid + 0.009 >= (float) $invoice->grand_total ? 'paid' : 'partially_paid']);
            $made++;
        }

        // Money on account: received, identified, not yet placed against anything.
        $this->receipt($branch, $open->first()->customer_id, 50000, 'bank_transfer',
            'RTGS ADVANCE ' . random_int(1000, 9999), 'Advance against forthcoming shipments');

        return $made + 1;
    }

    private function receipt(int $branch, ?int $payerId, float $amount, string $mode, string $reference, string $narration): AccountsReceipt
    {
        return AccountsReceipt::withoutGlobalScopes()->create([
            'agent_id' => $branch, 'payer_type' => 'customer', 'payer_id' => $payerId,
            'receipt_no' => $this->sequences->next($branch, 'RCPT'),
            'receipt_date' => now()->subDays(random_int(0, 9))->toDateString(),
            'mode' => $mode, 'reference' => $reference, 'amount' => $amount,
            'currency' => 'INR', 'exchange_rate' => 1, 'narration' => $narration,
        ]);
    }
}
