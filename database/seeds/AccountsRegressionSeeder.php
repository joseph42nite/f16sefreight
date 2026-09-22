<?php

use App\AccountsInvoice;
use App\AccountsReceipt;
use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\Job;
use App\Partner;
use App\Services\EnquirySequenceService;
use App\Services\LedgerPostingService;
use App\Support\BillingDocuments;
use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * A money fixture whose every figure is known in advance (user, 2026-09-20: "build a regression demo seeder and
 * check all the numbers, be extremely careful as this is all money related").
 *
 *     php artisan db:seed --class=AccountsRegressionSeeder
 *     php artisan accounts:verify
 *
 * 🔴 **THE NUMBERS ARE THE POINT.** Every amount here is a round figure chosen so that each derived total — the
 * ageing buckets, the credit exposure, the margin, the trial balance, the P&L, the balance sheet — can be worked
 * out on paper and asserted exactly. `accounts:verify` holds those hand-computed answers and compares. A seeder
 * of random amounts proves the code runs; this one proves it is RIGHT.
 *
 * 🔴 **TWO TENANTS, DELIBERATELY DIFFERENT ARITHMETIC.** Regression Freight deals in multiples of 1,000; Rival
 * Freight in multiples of 7,777. Any figure leaking across the tenant boundary makes a total non-round, so a
 * leak shows up as a WRONG NUMBER rather than as a screen that looks plausible. Cross-tenant isolation is the one
 * thing a financial system cannot be slightly wrong about.
 *
 * ⚠️ Re-running wipes both tenants by company code and rebuilds them. It touches nothing else.
 */
class AccountsRegressionSeeder extends Seeder
{
    public const PASSWORD = 'regress1234';

    /** The fixture, in full. Every figure is net of tax unless it says otherwise. */
    private const FIXTURE = [
        'code' => 'REG', 'name' => 'Regression Freight',
        // State 27 (Maharashtra). Northstar is 27 → CGST + SGST; Harbour is 33 → IGST; Cashflow has none at all.
        'gstin' => '27AAACR1000A1Z5',
        // The carrier we buy from is registered in 27 too, so input credit splits CGST + SGST.
        'vendor_gstin' => '27AAACR9001A1Z5',
        'clients' => [
            // limit 500,000 — comfortably inside it
            ['key' => 'northstar', 'name' => 'Northstar Exports', 'domain' => 'northstar.test', 'limit' => 500000,
             'terms' => 30, 'gst_no' => '27AAACN1001A1Z5'],
            // limit 50,000 against 59,000 owed — ON HOLD, so the gate and the Today exception are exercised
            ['key' => 'harbour', 'name' => 'Harbour Traders', 'domain' => 'harbour.test', 'limit' => 50000,
             'terms' => 15, 'gst_no' => '33AAACH1002A1Z5'],
            // no limit at all — NULL is "not configured" and must never block, whatever they owe
            // No GSTIN: billed B2C, so it never goes to the invoice registration portal at all.
            ['key' => 'cashflow', 'name' => 'Cashflow Corp', 'domain' => 'cashflow.test', 'limit' => null,
             'terms' => 45, 'gst_no' => null],
        ],
        'shipments' => [
            ['key' => 'j1', 'client' => 'northstar', 'mode' => 'air', 'from' => 'BOM', 'to' => 'FRA'],
            ['key' => 'j2', 'client' => 'northstar', 'mode' => 'air', 'from' => 'BOM', 'to' => 'JFK'],
            ['key' => 'j3', 'client' => 'harbour', 'mode' => 'air', 'from' => 'DEL', 'to' => 'LHR'],
            ['key' => 'j4', 'client' => 'cashflow', 'mode' => 'sea', 'from' => 'INNSA', 'to' => 'DEHAM'],
            ['key' => 'j5', 'client' => 'northstar', 'mode' => 'air', 'from' => 'BOM', 'to' => 'FRA'],
        ],
        // due_in is days from today: negative is overdue, and each one lands in a named ageing bucket.
        'invoices' => [
            ['key' => 'inv1', 'job' => 'j1', 'net' => 100000, 'tax' => 18000, 'due_in' => -40],   // d31_60, settled in full
            ['key' => 'inv2', 'job' => 'j2', 'net' => 200000, 'tax' => 36000, 'due_in' => -10],   // d1_30, part paid
            ['key' => 'inv3', 'job' => 'j3', 'net' => 50000, 'tax' => 9000, 'due_in' => -100],    // d90_plus
            ['key' => 'inv4', 'job' => 'j4', 'net' => 300000, 'tax' => 0, 'due_in' => 20],        // not due; export, no GST
        ],
        'notes' => [
            ['key' => 'cn1', 'parent' => 'inv1', 'type' => 'credit_note', 'net' => 10000, 'tax' => 1800, 'due_in' => -40,
             'reason' => 'Rate billed above the quoted slab'],
            ['key' => 'dn1', 'parent' => 'inv2', 'type' => 'debit_note', 'net' => 20000, 'tax' => 3600, 'due_in' => -10,
             'reason' => 'Weight corrected at acceptance'],
        ],
        // The draft pricing handed over ten days ago: both "to bill" and, being unposted, on the ledger queue.
        'draft' => ['job' => 'j5', 'net' => 75000, 'tax' => 0, 'sent_days_ago' => 10],
        'costs' => [
            ['job' => 'j1', 'net' => 70000, 'tax' => 12600],
            ['job' => 'j2', 'net' => 150000, 'tax' => 27000],
            ['job' => 'j3', 'net' => 60000, 'tax' => 10800],   // sold at a LOSS: billed 50,000, cost 60,000
            ['job' => 'j4', 'net' => 210000, 'tax' => 0],
        ],
        // The voucher settled in the fixture: j1's, at 70,000 + 12,600 = 82,600 gross.
        'paid_voucher' => 'j1',
        // 🔴 Two bank accounts, so the trial balance has to tell them apart: money comes IN to one and goes OUT
        // of the other, which is exactly the case a single `1100-Bank` could not represent.
        'banks' => [
            ['key' => 'collections', 'name' => 'Collections', 'bank' => 'HDFC Bank', 'number' => '50200012344321'],
            ['key' => 'payouts', 'name' => 'Payouts', 'bank' => 'ICICI Bank', 'number' => '00112233449876'],
        ],
        'receipts' => [
            ['key' => 'r1', 'client' => 'northstar', 'amount' => 118000, 'against' => 'inv1'],   // settles it in full
            ['key' => 'r2', 'client' => 'northstar', 'amount' => 100000, 'against' => 'inv2'],   // part payment
            ['key' => 'r3', 'client' => 'cashflow', 'amount' => 50000, 'against' => null],       // on account
        ],
        // Arrived and not yet placed against anything — the "money to place" card.
        'bank' => ['amount' => 40000, 'reference' => 'UTR-REG-UNPLACED'],
    ];

    /** The second tenant. Different arithmetic on purpose — see the class docblock. */
    private const RIVAL = ['code' => 'RIV', 'name' => 'Rival Freight', 'net' => 777000, 'tax' => 139860, 'cost' => 555000,
        // 🔴 State 07 (Delhi), against Regression's 27 — so a document leaking across the tenant boundary lands
        // under the WRONG HEADS as well as in the wrong total, and shows up twice over.
        'gstin' => '07AAACV1000A1Z5'];

    private EnquirySequenceService $sequences;
    private LedgerPostingService $ledger;

    public function run(): void
    {
        $this->sequences = app(EnquirySequenceService::class);
        $this->ledger = app(LedgerPostingService::class);

        $this->places();
        $this->wipe(self::FIXTURE['code']);
        $this->wipe(self::RIVAL['code']);

        $this->buildFixture();
        $this->buildRival();

        $this->command->info('Accounts regression fixture built. Now run: php artisan accounts:verify');
    }

    /**
     * The places this fixture's lanes name, so it does not depend on the full directories being loaded.
     *
     * ⚠️ A regression fixture that needs `PortSeeder` to have run first is a fixture that fails on a clean test
     * database for a reason that has nothing to do with money — which is exactly how a real failure gets ignored.
     * Three characters is IATA and reads from `locations`; five is a UN/LOCODE and reads from `ports`.
     */
    private function places(): void
    {
        $airports = ['BOM' => 'bombay', 'FRA' => 'frankfurt', 'JFK' => 'john f. kennedy',
                     'DEL' => 'delhi', 'LHR' => 'heathrow', 'DXB' => 'dubai'];

        foreach ($airports as $code => $name) {
            if (! DB::table('locations')->where('iata_code', $code)->exists()) {
                DB::table('locations')->insert(['destination' => $name, 'iata_code' => $code, 'is_active' => 1,
                    'created_at' => now(), 'updated_at' => now()]);
            }
        }

        $ports = ['INNSA' => ['Jawaharlal Nehru (Nhava Sheva)', 'IN'], 'DEHAM' => ['Hamburg', 'DE']];

        foreach ($ports as $locode => [$name, $country]) {
            if (! DB::table('ports')->where('locode', $locode)->exists()) {
                DB::table('ports')->insert(['locode' => $locode, 'port_name' => $name, 'country_code' => $country,
                    'port_type' => 'sea', 'is_active' => 1, 'created_at' => now(), 'updated_at' => now()]);
            }
        }
    }

    /**
     * Everything belonging to one tenant.
     *
     * 🔴 **Foreign-key checks are OFF for the duration, deliberately.** This table graph has ~130 foreign keys
     * into `jobs`, `users`, `customers` and `accounts_invoices`, including two self-references
     * (`accounts_invoices.parent_invoice_id`, `jobs.parent_job_id`) that MySQL evaluates row by row — so no single
     * delete order exists that survives the next observer writing a new child row. Hand-ordering it was wrong
     * twice in five minutes.
     *
     * ⚠️ Safe HERE and nowhere else: this removes a whole tenant, so when the checks come back on there is
     * nothing left that could point at anything removed. Every child table the fixture can reach is still listed
     * explicitly, because switching the checks off hides a missed table rather than fixing it.
     */
    private function wipe(string $code): void
    {
        $company = Company::withoutGlobalScopes()->where('code', $code)->first();

        if ($company === null) {
            return;
        }

        $branches = DB::table('agents_info')->where('company_id', $company->id)->pluck('id');
        $invoices = DB::table('accounts_invoices')->whereIn('agent_id', $branches)->pluck('id');
        $vouchers = DB::table('accounts_purchase_vouchers')->whereIn('agent_id', $branches)->pluck('id');
        $jobs = DB::table('jobs')->whereIn('agent_id', $branches)->pluck('id');
        $statements = DB::table('vendor_statements')->whereIn('agent_id', $branches)->pluck('id');
        $receipts = DB::table('accounts_receipts')->whereIn('agent_id', $branches)->pluck('id');
        $emails = DB::table('users')->where('company_name', $company->id)->pluck('email');

        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        try {
            // Children, by the id of whatever they hang off.
            foreach ([['accounts_invoice_items', 'invoice_id', $invoices],
                      ['accounts_invoice_brokerage_details', 'invoice_id', $invoices],
                      ['accounts_invoice_consol_details', 'invoice_id', $invoices],
                      ['accounts_receipt_allocations', 'invoice_id', $invoices],
                      ['accounts_receipt_allocations', 'receipt_id', $receipts],
                      ['accounts_purchase_items', 'purchase_voucher_id', $vouchers],
                      ['vendor_statement_lines', 'vendor_statement_id', $statements],
                      ['job_entities', 'job_id', $jobs],
                      ['milestone_performance_logs', 'job_id', $jobs]] as [$table, $column, $ids]) {
                DB::table($table)->whereIn($column, $ids)->delete();
            }

            // Everything scoped to a branch.
            foreach (['accounts_ledger_entries', 'gst_ledger_entries', 'unposted_transactions_queue',
                      'accounts_receipts', 'accounts_invoices', 'accounts_purchase_vouchers',
                      'vendor_statements', 'collection_follow_ups', 'bank_transactions', 'bank_accounts',
                      'chart_of_accounts',
                      'accounting_periods', 'rate_cards', 'audit_logs', 'notifications',
                      'jobs', 'enquiries', 'sequence_counters'] as $table) {
                DB::table($table)->whereIn('agent_id', $branches)->delete();
            }

            // And to the tenant itself.
            DB::table('customer_contacts')->where('company_id', $company->id)->delete();
            DB::table('customers')->where('company_id', $company->id)->delete();
            DB::table('partners')->where('company_id', $company->id)->delete();
            DB::table('roles')->whereIn('email', $emails)->delete();
            DB::table('users')->where('company_name', $company->id)->delete();
            DB::table('agents_info')->whereIn('id', $branches)->delete();
            DB::table('companies')->where('id', $company->id)->delete();
        } finally {
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
        }
    }

    private function buildFixture(): void
    {
        $f = self::FIXTURE;
        [$company, $branch, $accounts] = $this->tenant($f['code'], $f['name'], 'Mumbai', 'BOM', $f['gstin']);

        $carrier = Partner::withoutGlobalScopes()->create(['company_id' => $company->id, 'agent_id' => $branch->id,
            'name' => 'Regression Air', 'partner_type' => 'airline', 'email' => 'cass@regression-air.test',
            'gst_no' => $f['vendor_gstin']]);

        $banks = [];
        foreach ($f['banks'] as $b) {
            $lastFour = \App\BankAccount::lastFour($b['number']);
            $banks[$b['key']] = \App\BankAccount::withoutGlobalScopes()->create([
                'agent_id' => $branch->id, 'name' => $b['name'], 'bank_name' => $b['bank'],
                'account_no' => $b['number'], 'ifsc_code' => 'HDFC0000123', 'currency' => 'INR',
                'account_code' => \App\BankAccount::codeFor($b['bank'], $lastFour, $b['name']),
                'last_four' => $lastFour, 'is_default' => $b['key'] === 'collections', 'is_active' => true,
            ]);
        }

        $clients = [];
        foreach ($f['clients'] as $c) {
            $clients[$c['key']] = Customer::withoutGlobalScopes()->create([
                'company_id' => $company->id, 'name' => $c['name'], 'email_domain' => $c['domain'],
                'branch_id' => $branch->id, 'credit_limit' => $c['limit'], 'payment_terms_days' => $c['terms'],
                'gst_no' => $c['gst_no'] ?? null,
            ]);
            DB::table('customer_contacts')->insert(['company_id' => $company->id, 'customer_id' => $clients[$c['key']]->id,
                'email' => 'ap@' . $c['domain'], 'source' => 'inbound_harvest', 'message_count' => 5,
                'created_at' => now(), 'updated_at' => now()]);
        }

        $jobs = [];
        foreach ($f['shipments'] as $s) {
            $jobs[$s['key']] = $this->shipment($branch, $clients[$s['client']], $s['mode'], $s['from'], $s['to']);
        }

        $period = DB::table('accounting_periods')->insertGetId([
            'agent_id' => $branch->id, 'period_name' => 'FY' . now()->format('y'),
            'start_date' => now()->subYear()->toDateString(), 'end_date' => now()->addMonths(3)->toDateString(),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now(),
        ]);

        $documents = [];

        foreach ($f['invoices'] as $i) {
            $job = $jobs[$i['job']];
            $documents[$i['key']] = $this->sell($branch, $job, $job->customer_id, 'invoice', $i['net'], $i['tax'], $i['due_in'], $accounts);
        }

        foreach ($f['notes'] as $n) {
            $parent = $documents[$n['parent']];
            $documents[$n['key']] = $this->sell($branch, $jobs[collect($f['invoices'])->firstWhere('key', $n['parent'])['job']],
                $parent->customer_id, $n['type'], $n['net'], $n['tax'], $n['due_in'], $accounts, $parent, $n['reason']);
        }

        // The draft: raised, handed over, never finalized. It carries a placeholder number, not a real one.
        $draftJob = $jobs[$f['draft']['job']];
        $draft = AccountsInvoice::withoutGlobalScopes()->create([
            'agent_id' => $branch->id, 'job_id' => $draftJob->id, 'transport_mode' => 'air',
            'customer_id' => $draftJob->customer_id, 'billed_party_type' => 'customer',
            'billed_party_id' => $draftJob->customer_id, 'billed_party_role' => 'client', 'created_by' => $accounts->id,
            'invoice_no' => AccountsInvoice::placeholderNumber($draftJob->id), 'type' => 'invoice',
            'document_date' => now()->toDateString(), 'status' => 'draft', 'currency' => 'INR', 'exchange_rate' => 1,
            'subtotal' => $f['draft']['net'], 'tax_amount' => $f['draft']['tax'],
            'grand_total' => $f['draft']['net'] + $f['draft']['tax'],
            'sent_to_accounts_at' => now()->subDays($f['draft']['sent_days_ago']), 'sent_to_accounts_by' => $accounts->id,
            'narration' => 'Waiting to be billed',
        ]);
        $draft->items()->create(['charge_type' => 'freight', 'description' => 'Air freight', 'quantity' => 1,
            'rate' => $f['draft']['net'], 'amount' => $f['draft']['net'], 'tax_percentage' => 0,
            'tax_amount' => $f['draft']['tax'], 'net_amount' => $f['draft']['net'] + $f['draft']['tax']]);

        $bought = [];
        foreach ($f['costs'] as $c) {
            $bought[$c['job']] = $this->buy($branch, $jobs[$c['job']], $carrier, $c['net'], $c['tax'], $period, $accounts);
        }

        // One voucher paid in full — 70,000 plus 12,600 of input tax — so the payable comes down and the bank
        // shows both sides. The rest stay open, which is what stage ④ of Money out is for.
        $this->pay($branch, $carrier, $bought[$f['paid_voucher']], $accounts, $banks['payouts']);

        // Every rupee in lands in Collections; the payment goes out of Payouts.
        foreach ($f['receipts'] as $r) {
            $this->receive($branch, $clients[$r['client']], $r['amount'],
                $r['against'] ? $documents[$r['against']] : null, $period, $accounts, $banks['collections']);
        }

        DB::table('bank_transactions')->insert([
            'agent_id' => $branch->id, 'provider' => 'manual',
            'plaid_transaction_id' => $f['bank']['reference'], 'reference' => $f['bank']['reference'],
            'amount' => $f['bank']['amount'], 'value_date' => now()->toDateString(), 'direction' => 'credit',
            'narration' => 'NEFT UNIDENTIFIED', 'reconciliation_status' => 'unreconciled', 'currency' => 'INR',
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    /** The second tenant: one of everything, in figures that cannot be mistaken for the first's. */
    private function buildRival(): void
    {
        $r = self::RIVAL;
        [$company, $branch, $accounts] = $this->tenant($r['code'], $r['name'], 'Delhi', 'DEL', $r['gstin']);

        // Registered in 07 like the branch itself, so their tax splits CGST + SGST — and 139,860 halves to
        // 69,930 a head, a figure that appears nowhere in Regression Freight's arithmetic.
        $client = Customer::withoutGlobalScopes()->create(['company_id' => $company->id, 'name' => 'Rival Client',
            'email_domain' => 'rivalclient.test', 'branch_id' => $branch->id, 'credit_limit' => 1000000,
            'gst_no' => '07AAACR2000A1Z5']);
        $carrier = Partner::withoutGlobalScopes()->create(['company_id' => $company->id, 'agent_id' => $branch->id,
            'name' => 'Rival Air', 'partner_type' => 'airline']);

        $job = $this->shipment($branch, $client, 'air', 'DEL', 'DXB');

        $period = DB::table('accounting_periods')->insertGetId([
            'agent_id' => $branch->id, 'period_name' => 'FY' . now()->format('y'),
            'start_date' => now()->subYear()->toDateString(), 'end_date' => now()->addMonths(3)->toDateString(),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->sell($branch, $job, $client->id, 'invoice', $r['net'], $r['tax'], -55, $accounts);
        $this->buy($branch, $job, $carrier, $r['cost'], 0, $period, $accounts);
    }

    /** A company, one branch, and the accounts login that works it. */
    private function tenant(string $code, string $name, string $branchName, string $branchCode, string $gstin): array
    {
        $company = Company::withoutGlobalScopes()->create(['name' => $name, 'code' => $code, 'tier' => 'command']);
        // 🔴 OUR OWN GSTIN — state 27, Maharashtra. Every figure in the GST return depends on it: the same 18%
        // is CGST 9 + SGST 9 against a 27-state client and IGST 18 against a 33-state one, and with no GSTIN
        // here `GstSplitService` refuses to guess and the whole return is empty (GAPS #36, closed 2026-09-22).
        $branch = Agent::withoutGlobalScopes()->create(['company_id' => $company->id,
            'agent_name' => $branchName, 'branch_code' => $branchCode, 'gst_no' => $gstin]);

        $email = 'accounts@' . strtolower($code) . '.test';
        $user = User::withoutGlobalScopes()->create(['name' => 'Accounts ' . $branchCode, 'email' => $email,
            'password' => Hash::make(self::PASSWORD), 'company_name' => $company->id, 'branch_name' => $branch->id,
            'designation' => 'accounts', 'is_active' => 1]);

        // 🔴 A login needs its `roles` row: LoginController resolves the guard from there before it reads `users`.
        DB::table('roles')->insert(['email' => $email, 'role' => 'user', 'created_at' => now(), 'updated_at' => now()]);

        return [$company, $branch, $user];
    }

    private function shipment(Agent $branch, Customer $client, string $mode, string $from, string $to): Job
    {
        $marker = ['air' => 'A', 'sea' => 'S', 'road' => 'R'][$mode];

        $enquiry = Enquiry::withoutGlobalScopes()->create(['agent_id' => $branch->id, 'transport_mode' => $mode,
            'status' => 'converted', 'enquiry_no' => $this->sequences->next($branch->id, 'ENQ' . $marker),
            'customer_id' => $client->id, 'origin_code' => $from, 'dest_code' => $to]);

        return Job::withoutGlobalScopes()->create(['agent_id' => $branch->id, 'enquiry_id' => $enquiry->id,
            'transport_mode' => $mode, 'execution_job_no' => $this->sequences->next($branch->id, 'JOB' . $marker),
            'customer_id' => $client->id, 'completed_at' => now()->subDays(30)]);
    }

    /** A finalized, posted sales document. */
    private function sell(Agent $branch, Job $job, ?int $customerId, string $type, float $net, float $tax,
        int $dueIn, User $by, ?AccountsInvoice $parent = null, ?string $reason = null): AccountsInvoice
    {
        $invoice = AccountsInvoice::withoutGlobalScopes()->create([
            'agent_id' => $branch->id, 'job_id' => $job->id, 'transport_mode' => $job->transport_mode,
            'customer_id' => $customerId, 'billed_party_type' => 'customer', 'billed_party_id' => $customerId,
            'billed_party_role' => 'client', 'parent_invoice_id' => $parent?->id, 'created_by' => $by->id,
            'invoice_no' => $this->sequences->next($branch->id, BillingDocuments::prefix($type)),
            'type' => $type, 'document_date' => now()->subDays(abs($dueIn) + 5)->toDateString(),
            'due_date' => now()->addDays($dueIn)->toDateString(), 'status' => 'sent', 'reason' => $reason,
            'currency' => 'INR', 'exchange_rate' => 1,
            'subtotal' => $net, 'tax_amount' => $tax, 'grand_total' => $net + $tax,
            'narration' => BillingDocuments::label($type) . ' — regression fixture',
        ]);

        $invoice->items()->create(['charge_type' => 'freight', 'description' => 'Freight', 'hsn_sac_code' => '996531',
            'quantity' => 1, 'rate' => $net, 'amount' => $net,
            'tax_percentage' => $net > 0 ? round($tax / $net * 100, 2) : 0,
            'tax_amount' => $tax, 'net_amount' => $net + $tax]);

        $this->post($this->ledger->linesForInvoice($invoice), $branch->id, $invoice->document_date, $invoice->id, 'invoice');
        $invoice->update(['is_posted' => true]);

        return $invoice->fresh();
    }

    private function buy(Agent $branch, Job $job, Partner $vendor, float $net, float $tax, int $period, User $by): \App\AccountsPurchaseVoucher
    {
        $voucher = \App\AccountsPurchaseVoucher::withoutGlobalScopes()->create([
            'agent_id' => $branch->id, 'job_id' => $job->id, 'vendor_id' => $vendor->id,
            'transport_mode' => $job->transport_mode, 'voucher_no' => $this->sequences->next($branch->id, 'PV'),
            'document_date' => now()->subDays(25)->toDateString(), 'status' => 'unpaid', 'created_by' => $by->id,
        ]);

        $voucher->items()->create(['charge_type' => 'freight', 'description' => 'Freight cost', 'quantity' => 1,
            'rate' => $net, 'amount' => $net, 'tax_percentage' => $net > 0 ? round($tax / $net * 100, 2) : 0,
            'tax_amount' => $tax, 'net_amount' => $net + $tax]);

        $this->post($this->ledger->linesForVoucher($voucher->fresh()), $branch->id,
            $voucher->document_date, $voucher->id, 'purchase_voucher');

        return $voucher->fresh();
    }

    /** A payment against one voucher, in full, posted — the mirror of a receipt. */
    private function pay(Agent $branch, Partner $vendor, \App\AccountsPurchaseVoucher $voucher, User $by,
        ?\App\BankAccount $from = null): void
    {
        $gross = round((float) $voucher->items()->sum('net_amount'), 2);

        $payment = \App\AccountsPayment::withoutGlobalScopes()->create([
            'agent_id' => $branch->id, 'payee_type' => 'partner', 'payee_id' => $vendor->id,
            'payment_no' => $this->sequences->next($branch->id, 'PAY'),
            'payment_date' => now()->subDays(2)->toDateString(), 'mode' => 'bank_transfer',
            'reference' => 'UTR-REG-PAYOUT', 'amount' => $gross, 'currency' => 'INR', 'exchange_rate' => 1,
            'run_ref' => 'RUN-FIXTURE', 'is_posted' => true, 'created_by' => $by->id,
            'bank_account_id' => $from?->id,
        ]);

        $payment->allocations()->create(['purchase_voucher_id' => $voucher->id, 'amount' => $gross]);
        $voucher->update(['amount_paid' => $gross, 'status' => 'paid']);

        $this->post($this->ledger->linesForPayment($gross, $from), $branch->id,
            $payment->payment_date, $payment->id, 'payment');
    }

    private function receive(Agent $branch, Customer $client, float $amount, ?AccountsInvoice $against,
        int $period, User $by, ?\App\BankAccount $into = null): void
    {
        $receipt = AccountsReceipt::withoutGlobalScopes()->create([
            'agent_id' => $branch->id, 'payer_type' => 'customer', 'payer_id' => $client->id,
            'receipt_no' => $this->sequences->next($branch->id, 'RCPT'),
            'receipt_date' => now()->subDays(3)->toDateString(), 'mode' => 'bank_transfer',
            'reference' => 'UTR-REG-' . $client->id . '-' . (int) $amount, 'amount' => $amount,
            'currency' => 'INR', 'exchange_rate' => 1, 'is_posted' => true, 'created_by' => $by->id,
            'bank_account_id' => $into?->id,
        ]);

        if ($against !== null) {
            $receipt->allocations()->create(['invoice_id' => $against->id, 'amount' => $amount]);

            $paid = round((float) DB::table('accounts_receipt_allocations')->where('invoice_id', $against->id)->sum('amount'), 2);
            $against->update(['amount_paid' => $paid,
                'status' => $paid + 0.009 >= (float) $against->grand_total ? 'paid' : 'partially_paid']);
        }

        $this->post($this->ledger->linesForReceipt($amount, into: $into), $branch->id,
            $receipt->receipt_date, $receipt->id, 'receipt');
    }

    /** Post through the SAME service the controllers use — a seeder writing its own journal proves nothing. */
    private function post(array $lines, int $agentId, $date, int $sourceId, string $type): void
    {
        $period = $this->ledger->openPeriodFor($agentId, $date);

        if ($period === null) {
            throw new RuntimeException("No open period covers {$date} for branch {$agentId} — the fixture is wrong.");
        }

        $this->ledger->write($lines, $agentId, $period->id, $sourceId, $type);
    }
}
