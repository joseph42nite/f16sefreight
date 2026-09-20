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
        $made = ['debit_note' => 0, 'credit_note' => 0, 'brokerage' => 0, 'consol_invoice' => 0, 'receipts' => 0];

        foreach ($branches as $branch) {
            // Give the invoices already there the columns a bill register prints.
            $this->describeExisting($branch);

            // A branch with no bills of its own has an empty register, which demonstrates nothing.
            $this->billSomeShipments($branch);

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
        }

        // One invoice through the IRP and the rest waiting, so the e-invoice register shows both states.
        $registered = AccountsInvoice::withoutGlobalScopes()->whereIn('agent_id', $branches)
            ->where('type', 'invoice')->whereNotIn('status', ['draft', 'void'])->latest('id')->first();

        $registered?->update(['irn' => hash('sha256', $registered->invoice_no), 'irn_status' => 'generated',
            'ack_no' => '112' . random_int(100000000, 999999999), 'ack_date' => now()->subDays(2)]);

        $this->command->info(sprintf(
            'Billing demo: %d debit notes, %d credit notes, %d brokerage, %d consol, %d receipts across %d branches.',
            $made['debit_note'], $made['credit_note'], $made['brokerage'], $made['consol_invoice'], $made['receipts'], count($branches)
        ));
    }

    /** Last run's documents, so re-running does not stack six credit notes on one invoice. */
    private function clear(array $branches): void
    {
        $ids = AccountsInvoice::withoutGlobalScopes()->whereIn('agent_id', $branches)
            ->whereIn('type', ['debit_note', 'credit_note', 'brokerage', 'consol_invoice'])->pluck('id');

        DB::table('accounts_receipt_allocations')
            ->whereIn('receipt_id', DB::table('accounts_receipts')->whereIn('agent_id', $branches)->select('id'))->delete();
        DB::table('accounts_receipts')->whereIn('agent_id', $branches)->delete();
        DB::table('accounts_invoice_items')->whereIn('invoice_id', $ids)->delete();
        DB::table('accounts_invoice_brokerage_details')->whereIn('invoice_id', $ids)->delete();
        DB::table('accounts_invoice_consol_details')->whereIn('invoice_id', $ids)->delete();
        DB::table('accounts_ledger_entries')->whereIn('source_id', $ids)->where('source_type', 'invoice')->delete();
        AccountsInvoice::withoutGlobalScopes()->whereIn('id', $ids)->delete();

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
