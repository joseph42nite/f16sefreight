<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * ✅ CHECKPOINT 8 — guide §8.4's four audit checks.
 *
 * The guide asks for these to be "confirmed manually against the running database". They
 * were, on 2026-09-01, and all four passed — but a manual pass proves the database was
 * right ONCE. Every one of these properties is a single migration away from silently
 * disappearing: a trigger dropped, a `softDeletes()` added to a ledger, a cast removed, a
 * foreign key recreated without its RESTRICT. None of those announce themselves.
 *
 * ⚠️ Check 1 (`audit_logs` rejects UPDATE/DELETE) lives in `SchemaConstraintsTest` and is
 * not repeated here. The other three are below.
 *
 * 🔴 A lesson from running these by hand: the first attempt at check 1 inserted a probe row
 * that FAILED on a missing `company_id`, so the UPDATE and DELETE that followed matched
 * nothing and "succeeded". A verification that touches no rows proves nothing, and it looks
 * exactly like a verification that passed.
 */
class Checkpoint8AuditTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Every table holding money or its audit trail. Listed explicitly rather than matched
     * by prefix: a new financial table with the wrong name would silently escape a pattern.
     */
    private const FINANCIAL_TABLES = [
        'accounting_periods',
        'accounts_cass_statements',
        'accounts_invoice_brokerage_details',
        'accounts_invoice_consol_details',
        'accounts_invoice_items',
        'accounts_invoices',
        'accounts_ledger_entries',
        'accounts_purchase_items',
        'accounts_purchase_vouchers',
        'bank_transactions',
        'chart_of_accounts',
        'gst_ledger_entries',
        'ocr_credit_transactions',
    ];

    // ─── Check 2: financial tables carry no `deleted_at` ─────────────────────

    /**
     * 🔴 **A FINANCIAL ROW IS NEVER SOFT-DELETED.** A soft delete hides a row from the
     * application while leaving it in the table, so a ledger with `deleted_at` can be made
     * to balance by hiding an entry rather than reversing it — and the reversal is the part
     * an auditor needs to see. Corrections are voids and credit notes, which are new rows.
     */
    public function test_no_financial_table_carries_a_deleted_at_column(): void
    {
        $offenders = DB::table('information_schema.COLUMNS')
            ->where('TABLE_SCHEMA', DB::getDatabaseName())
            ->where('COLUMN_NAME', 'deleted_at')
            ->whereIn('TABLE_NAME', self::FINANCIAL_TABLES)
            ->pluck('TABLE_NAME')
            ->all();

        $this->assertSame([], $offenders,
            'These financial tables can now hide rows instead of reversing them: '
            . implode(', ', $offenders));
    }

    /** ⚠️ And the list is real — every table named above still exists to be checked. */
    public function test_every_financial_table_in_the_list_exists(): void
    {
        $present = DB::table('information_schema.TABLES')
            ->where('TABLE_SCHEMA', DB::getDatabaseName())
            ->whereIn('TABLE_NAME', self::FINANCIAL_TABLES)
            ->pluck('TABLE_NAME')
            ->all();

        $missing = array_diff(self::FINANCIAL_TABLES, $present);

        $this->assertSame([], array_values($missing),
            'The check above passed vacuously for: ' . implode(', ', $missing));
    }

    // ─── Check 3: bank columns are unreadable in a raw SELECT ────────────────

    /**
     * 🔴 **ENCRYPTED AT REST, verified by READING THE RAW COLUMN.** Asserting the model
     * returns what was written proves only that a cast round-trips — it passes identically
     * with no encryption at all. The only assertion that means anything is the one that
     * looks at the bytes on disk.
     */
    public function test_bank_details_are_unreadable_in_a_raw_select(): void
    {
        $company = Company::create(['name' => 'Audit Co', 'code' => 'AUD', 'tier' => 'command']);

        $account = '1234567890123456';
        $ifsc = 'HDFC0001234';

        $customer = Customer::create([
            'company_id' => $company->id, 'name' => 'Audit Client',
            'email_domain' => 'audit.test',
            'bank_account_no' => $account,
            'bank_ifsc_code' => $ifsc,
        ]);

        $raw = DB::table('customers')->where('id', $customer->id)
            ->first(['bank_account_no', 'bank_ifsc_code']);

        $this->assertStringNotContainsString($account, $raw->bank_account_no,
            'The account number is stored in plaintext.');
        $this->assertStringNotContainsString($ifsc, $raw->bank_ifsc_code,
            'The IFSC code is stored in plaintext.');

        // …and it is genuinely recoverable, so the encryption is not merely destroying it.
        $this->assertSame($account, $customer->fresh()->bank_account_no);
    }

    /**
     * ⚠️ AND HIDDEN FROM SERIALISATION. Encryption at rest does nothing if the decrypted
     * value rides out in an API response — `$hidden` is the other half of the same rule.
     */
    public function test_bank_details_never_appear_in_a_serialised_model(): void
    {
        $company = Company::create(['name' => 'Audit Co2', 'code' => 'AU2', 'tier' => 'command']);

        $customer = Customer::create([
            'company_id' => $company->id, 'name' => 'Audit Client 2',
            'email_domain' => 'audit2.test',
            'bank_account_no' => '9876543210987654',
            'bank_ifsc_code' => 'ICIC0004321',
        ]);

        $json = json_encode($customer->fresh()->toArray());

        $this->assertStringNotContainsString('9876543210987654', $json);
        $this->assertStringNotContainsString('bank_account_no', $json);
        $this->assertStringNotContainsString('bank_ifsc_code', $json);
    }

    // ─── Check 4: RESTRICT fires on a job carrying financials ────────────────

    /**
     * 🔴 **A JOB WITH AN INVOICE CANNOT BE ERASED.** The invoice was issued to a client and
     * filed; deleting the shipment under it would leave a document referring to a job that
     * never existed. `RESTRICT` is the database refusing, not the application remembering.
     */
    public function test_a_job_carrying_an_invoice_cannot_be_hard_deleted(): void
    {
        ['jobId' => $jobId] = $this->jobWithPostedInvoice();

        $this->expectException(QueryException::class);

        DB::table('jobs')->where('id', $jobId)->delete();
    }

    /**
     * ⚠️ **RESTRICT guards the HARD delete only, and `jobs` uses soft deletes.** The
     * application's ordinary delete path sets `deleted_at` and never trips this constraint
     * — which is correct, because the row survives and the invoice still points at
     * something real. Written down because "RESTRICT protects the job" is easy to
     * over-read into "the app cannot remove a billed job", which is a different claim.
     */
    public function test_the_same_job_may_still_be_soft_deleted(): void
    {
        ['jobId' => $jobId] = $this->jobWithPostedInvoice();

        DB::table('jobs')->where('id', $jobId)->update(['deleted_at' => now()]);

        $this->assertNotNull(DB::table('jobs')->where('id', $jobId)->value('deleted_at'));
        $this->assertSame(1, DB::table('accounts_invoices')->where('job_id', $jobId)->count(),
            'The invoice must survive its job being soft-deleted.');
    }

    /** Once the financials are gone, the job deletes — so the refusal was the FK. */
    public function test_the_job_deletes_once_its_financials_are_removed(): void
    {
        ['jobId' => $jobId, 'invoiceId' => $invoiceId] = $this->jobWithPostedInvoice();

        DB::table('accounts_invoices')->where('id', $invoiceId)->delete();
        DB::table('jobs')->where('id', $jobId)->delete();

        $this->assertSame(0, DB::table('jobs')->where('id', $jobId)->count());
    }

    /** ⚠️ The purchase-voucher side is RESTRICT too — the cost, not just the revenue. */
    public function test_a_job_carrying_a_purchase_voucher_cannot_be_hard_deleted(): void
    {
        ['agentId' => $agentId, 'jobId' => $jobId, 'companyId' => $companyId] = $this->jobWithPostedInvoice();

        $vendorId = DB::table('partners')->insertGetId([
            'company_id' => $companyId, 'name' => 'Audit Vendor', 'partner_type' => 'vendor',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        DB::table('accounts_purchase_vouchers')->insert([
            'agent_id' => $agentId, 'job_id' => $jobId, 'vendor_id' => $vendorId,
            'voucher_no' => 'PV-RSTBOM-26-' . random_int(1000, 9999),
            'document_date' => now()->toDateString(),
            'status' => 'draft', 'created_at' => now(), 'updated_at' => now(),
        ]);

        // The invoice goes first, so the ONLY thing left holding this job is the voucher.
        DB::table('accounts_invoices')->where('job_id', $jobId)->delete();

        // ⚠️ `expectException` comes LAST on purpose. Declared at the top of the method it
        // would also be satisfied by a broken fixture — an insert failing on a missing
        // column throws QueryException too, and the test would pass having never reached
        // the delete. That is exactly what happened on the first run of this file.
        $this->expectException(QueryException::class);

        DB::table('jobs')->where('id', $jobId)->delete();
    }

    /** @return array{agentId:int, jobId:int, invoiceId:int, companyId:int} */
    private function jobWithPostedInvoice(): array
    {
        $company = Company::create(['name' => 'Restrict Co', 'code' => 'RST', 'tier' => 'command']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);

        $enquiryId = DB::table('enquiries')->insertGetId([
            'agent_id' => $branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-RSTBOM-26-' . random_int(1000, 9999),
            'status' => 'converted', 'created_at' => now(), 'updated_at' => now(),
        ]);

        $jobId = DB::table('jobs')->insertGetId([
            'agent_id' => $branch->id, 'enquiry_id' => $enquiryId, 'transport_mode' => 'air',
            'status' => 'Intake', 'created_at' => now(), 'updated_at' => now(),
        ]);

        $invoiceId = DB::table('accounts_invoices')->insertGetId([
            'agent_id' => $branch->id, 'job_id' => $jobId,
            'invoice_no' => 'INV-RSTBOM-26-' . random_int(1000, 9999),
            'type' => 'invoice', 'document_date' => now()->toDateString(),
            'status' => 'finalized', 'is_posted' => 1,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        return ['agentId' => $branch->id, 'jobId' => $jobId, 'invoiceId' => $invoiceId,
                'companyId' => $company->id];
    }
}
