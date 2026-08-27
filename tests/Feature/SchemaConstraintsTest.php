<?php

namespace Tests\Feature;

use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Locks in the database-level invariants built in Batch 1a/1b.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * Every constraint here was verified by hand while its migration was written. A manual
 * check proves the constraint works once and then evaporates — nothing re-runs it, so a
 * later edit to a migration breaks the guarantee silently. These are the assertions that
 * make that impossible.
 *
 * WHAT IT DELIBERATELY DOES NOT TEST
 * ----------------------------------
 * Application behaviour. There are no controllers or models for most of these tables yet.
 * This asserts only what the DATABASE enforces on its own — which is exactly the set of
 * rules the planning docs describe as "enforced by CHECK, not convention".
 *
 * Several assertions guard against a defect that was actually found, not a hypothetical:
 *   - status CHECKs silently accepted 'Lost' (case-insensitive collation)
 *   - email_messages.idempotency_key was never actually UNIQUE
 *   - tenant_policies could not be created at all (STORED gate + ON DELETE CASCADE)
 *   - VARCHAR(255) truncated a legal 34-character IBAN once encrypted
 */
class SchemaConstraintsTest extends TestCase
{
    use DatabaseTransactions;

    private int $companyId;
    private int $agentId;
    private int $userId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->companyId = DB::table('companies')->insertGetId([
            'name' => 'Constraint Test Co', 'code' => 'CTC', 'tier' => 'command',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->agentId = DB::table('agents_info')->insertGetId([
            'company_id' => $this->companyId, 'agent_name' => 'Constraint Branch',
            'branch_code' => 'CTB', 'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->userId = DB::table('users')->insertGetId([
            'name' => 'Constraint User', 'email' => 'constraint@test.local', 'password' => 'x',
            'company_name' => $this->companyId, 'branch_name' => $this->agentId,
            'designation' => 'pricing', 'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    /** Assert a write is refused, and that it is refused for the RIGHT reason. */
    private function assertRefused(string $expectedInMessage, callable $write): void
    {
        try {
            $write();
        } catch (QueryException $e) {
            $this->assertStringContainsString(
                $expectedInMessage, $e->getMessage(),
                "Write was refused, but not by {$expectedInMessage}."
            );
            return;
        }

        $this->fail("Write succeeded but should have been refused by {$expectedInMessage}.");
    }

    private function newEnquiry(array $overrides = []): int
    {
        return DB::table('enquiries')->insertGetId(array_merge([
            'agent_id' => $this->agentId, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-CTCCTB-26-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
            'created_at' => now(), 'updated_at' => now(),
        ], $overrides));
    }

    private function newJob(array $overrides = []): int
    {
        return DB::table('jobs')->insertGetId(array_merge([
            'agent_id' => $this->agentId, 'enquiry_id' => $this->newEnquiry(),
            'transport_mode' => 'air', 'created_at' => now(), 'updated_at' => now(),
        ], $overrides));
    }

    // ─── Lost lives only on enquiries; Cancelled only on jobs ─────────────────

    public function test_an_enquiry_can_never_hold_a_job_execution_state(): void
    {
        $id = $this->newEnquiry();

        $this->assertRefused('chk_enq_status', fn () => DB::table('enquiries')->where('id', $id)->update(['status' => 'Cancelled']));
    }

    public function test_a_job_can_never_be_marked_lost(): void
    {
        $id = $this->newJob();

        $this->assertRefused('chk_jobs_status', fn () => DB::table('jobs')->where('id', $id)->update(['status' => 'Lost']));
    }

    public function test_status_allow_lists_also_block_typos(): void
    {
        $id = $this->newEnquiry();

        $this->assertRefused('chk_enq_status', fn () => DB::table('enquiries')->where('id', $id)->update(['status' => 'quotedd']));
    }

    /**
     * REGRESSION. The columns collate utf8mb4_unicode_ci, which is case-INSENSITIVE, so
     * a plain `IN (...)` accepted 'Lost' while reporting the constraint as present. The
     * CHECKs force COLLATE utf8mb4_bin specifically to stop that. It matters because Vue
     * compares status with `===`, so a 'Lost' row passes every database guard and then
     * fails silently in every frontend badge and route guard.
     */
    public function test_status_checks_are_case_sensitive(): void
    {
        $enquiry = $this->newEnquiry();
        $job = $this->newJob();

        $this->assertRefused('chk_enq_status', fn () => DB::table('enquiries')->where('id', $enquiry)->update(['status' => 'Lost']));
        $this->assertRefused('chk_jobs_status', fn () => DB::table('jobs')->where('id', $job)->update(['status' => 'cancelled']));
    }

    public function test_valid_statuses_are_accepted_on_both_tables(): void
    {
        $enquiry = $this->newEnquiry();
        $job = $this->newJob();

        DB::table('enquiries')->where('id', $enquiry)->update(['status' => 'lost', 'lost_reason' => 'rates_high']);
        DB::table('jobs')->where('id', $job)->update(['status' => 'Cancelled', 'cancellation_reason' => 'client_cancelled']);

        $this->assertSame('lost', DB::table('enquiries')->where('id', $enquiry)->value('status'));
        $this->assertSame('Cancelled', DB::table('jobs')->where('id', $job)->value('status'));
    }

    // ─── transport_mode / number-prefix drift ─────────────────────────────────

    public function test_an_air_enquiry_cannot_carry_a_sea_number(): void
    {
        $this->assertRefused('chk_enq_mode_prefix', fn () => $this->newEnquiry([
            'transport_mode' => 'air', 'enquiry_no' => 'ENQS-CTCCTB-26-0001',
        ]));
    }

    public function test_transport_mode_itself_is_case_sensitive(): void
    {
        $this->assertRefused('chk_enq_mode_prefix', fn () => $this->newEnquiry([
            'transport_mode' => 'AIR', 'enquiry_no' => 'ENQA-CTCCTB-26-0002',
        ]));
    }

    /** Road was enabled 2026-08-27 while the CHECKs were being authored. */
    public function test_road_is_a_valid_transport_mode(): void
    {
        $id = $this->newEnquiry(['transport_mode' => 'road', 'enquiry_no' => 'ENQR-CTCCTB-26-0001']);

        $this->assertSame('road', DB::table('enquiries')->where('id', $id)->value('transport_mode'));
    }

    /** A job exists at Intake before its number is minted, so NULL must pass the guard. */
    public function test_a_job_may_exist_before_its_number_is_minted(): void
    {
        $id = $this->newJob(['execution_job_no' => null]);

        $this->assertNull(DB::table('jobs')->where('id', $id)->value('execution_job_no'));
    }

    // ─── Conversion integrity ────────────────────────────────────────────────

    /** One of only three ON DELETE RESTRICT foreign keys in the schema. */
    public function test_an_enquiry_that_produced_a_job_cannot_be_deleted(): void
    {
        $enquiry = $this->newEnquiry();
        $this->newJob(['enquiry_id' => $enquiry]);

        $this->assertRefused('foreign key constraint', fn () => DB::table('enquiries')->where('id', $enquiry)->delete());
    }

    // ─── job_entities partial uniqueness (the generated column) ──────────────

    private function addParty(int $jobId, string $role): int
    {
        return DB::table('job_entities')->insertGetId([
            'agent_id' => $this->agentId, 'job_id' => $jobId,
            'party_type' => 'customer', 'party_id' => 1, 'role' => $role,
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    public function test_a_job_may_have_many_notify_parties(): void
    {
        $job = $this->newJob();

        $this->addParty($job, 'notify_party');
        $this->addParty($job, 'notify_party');
        $this->addParty($job, 'notify_party');

        $this->assertSame(3, DB::table('job_entities')->where('job_id', $job)->where('role', 'notify_party')->count());
    }

    public function test_a_job_may_have_only_one_shipper(): void
    {
        $job = $this->newJob();
        $this->addParty($job, 'shipper');

        $this->assertRefused('uq_job_entities_role', fn () => $this->addParty($job, 'shipper'));
    }

    /**
     * The reason deleted_at is folded into the generated gate. Without it, soft-deleting
     * a shipper would PERMANENTLY prevent assigning a new one — an ordinary operation,
     * broken by a tombstone.
     */
    public function test_soft_deleting_a_shipper_frees_the_slot_for_a_replacement(): void
    {
        $job = $this->newJob();
        $first = $this->addParty($job, 'shipper');

        DB::table('job_entities')->where('id', $first)->update(['deleted_at' => now()]);
        $replacement = $this->addParty($job, 'shipper');

        $this->assertNotSame($first, $replacement);
        // ...but still only ONE live shipper.
        $this->assertRefused('uq_job_entities_role', fn () => $this->addParty($job, 'shipper'));
    }

    // ─── tenant_policies scope gate ──────────────────────────────────────────

    public function test_a_company_may_hold_only_one_company_wide_policy_row(): void
    {
        DB::table('tenant_policies')->insert([
            'company_id' => $this->companyId, 'agent_id' => null,
            'stale_enquiry_days' => 10, 'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->assertRefused('uq_tenant_policies_scope', fn () => DB::table('tenant_policies')->insert([
            'company_id' => $this->companyId, 'agent_id' => null,
            'undo_send_seconds' => 30, 'created_at' => now(), 'updated_at' => now(),
        ]));
    }

    public function test_a_branch_override_coexists_with_the_company_wide_row(): void
    {
        DB::table('tenant_policies')->insert([
            ['company_id' => $this->companyId, 'agent_id' => null, 'cass_weight_tolerance_pct' => 1.00, 'created_at' => now(), 'updated_at' => now()],
            ['company_id' => $this->companyId, 'agent_id' => $this->agentId, 'cass_weight_tolerance_pct' => 0.50, 'created_at' => now(), 'updated_at' => now()],
        ]);

        $this->assertSame(2, DB::table('tenant_policies')->where('company_id', $this->companyId)->count());
    }

    // ─── audit_logs append-only triggers ─────────────────────────────────────

    private function writeAuditRow(): int
    {
        DB::table('audit_logs')->insert([
            'agent_id' => $this->agentId, 'user_id' => $this->userId,
            'action' => 'job.status_changed', 'model_type' => 'App\Job', 'model_id' => 1,
            'created_at' => now(),
        ]);

        return (int) DB::getPdo()->lastInsertId();
    }

    public function test_an_audit_row_can_never_be_updated(): void
    {
        $id = $this->writeAuditRow();

        $this->assertRefused('append-only', fn () => DB::table('audit_logs')->where('id', $id)->update(['action' => 'nothing_happened']));
    }

    public function test_an_audit_row_can_never_be_deleted(): void
    {
        $id = $this->writeAuditRow();

        $this->assertRefused('append-only', fn () => DB::table('audit_logs')->where('id', $id)->delete());
    }

    /**
     * MySQL does not fire triggers for rows removed by ON DELETE CASCADE, so a CASCADE on
     * either foreign key would silently void the append-only guarantee while leaving the
     * triggers visibly in place.
     */
    public function test_audit_log_foreign_keys_are_not_cascading(): void
    {
        $rules = DB::select(
            'SELECT delete_rule FROM information_schema.referential_constraints
             WHERE constraint_schema = DATABASE() AND table_name = ?', ['audit_logs']
        );

        $this->assertNotEmpty($rules);

        foreach ($rules as $rule) {
            $this->assertNotSame('CASCADE', strtoupper($rule->delete_rule ?? $rule->DELETE_RULE));
        }
    }

    // ─── OCR credit ledger ───────────────────────────────────────────────────

    /**
     * The refund path exists for the failure case (the vision call times out after
     * reserving), and failure paths are exactly where retries happen. The UNIQUE index
     * makes a double refund physically impossible rather than merely discouraged.
     */
    public function test_a_reservation_cannot_be_refunded_twice(): void
    {
        $consumption = DB::table('ocr_credit_transactions')->insertGetId([
            'company_id' => $this->companyId, 'amount' => -1,
            'transaction_type' => 'consumption', 'created_at' => now(),
        ]);

        DB::table('ocr_credit_transactions')->insert([
            'company_id' => $this->companyId, 'amount' => 1, 'transaction_type' => 'refund',
            'reverses_transaction_id' => $consumption, 'created_at' => now(),
        ]);

        $this->assertRefused('reverses_transaction_id', fn () => DB::table('ocr_credit_transactions')->insert([
            'company_id' => $this->companyId, 'amount' => 1, 'transaction_type' => 'refund',
            'reverses_transaction_id' => $consumption, 'created_at' => now(),
        ]));
    }

    // ─── Client outreach consent ─────────────────────────────────────────────

    private function newCustomer(): int
    {
        return DB::table('customers')->insertGetId([
            'company_id' => $this->companyId, 'name' => 'Globex', 'email_domain' => 'globex.test',
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    /** Harvesting is automatic; being CC'd is always a human decision. */
    public function test_harvested_contacts_are_never_cc_able_by_default(): void
    {
        $customer = $this->newCustomer();

        DB::table('customer_contacts')->insert([
            'company_id' => $this->companyId, 'customer_id' => $customer,
            'email' => 'ops@globex.test', 'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->assertSame(0, (int) DB::table('customer_contacts')->where('customer_id', $customer)->value('include_in_cc'));
    }

    /** DPDP Act 2023: opting out overrides include_in_cc unconditionally. */
    public function test_an_opted_out_contact_drops_out_of_the_cc_list_even_when_flagged(): void
    {
        $customer = $this->newCustomer();

        // NOTE: both rows carry the same keys — Laravel's multi-row insert() builds one
        // statement from the first row's columns, so a differing key set silently
        // mismatches the column count.
        DB::table('customer_contacts')->insert([
            ['company_id' => $this->companyId, 'customer_id' => $customer, 'email' => 'ops@globex.test',
             'include_in_cc' => true, 'opted_out_at' => null, 'created_at' => now(), 'updated_at' => now()],
            ['company_id' => $this->companyId, 'customer_id' => $customer, 'email' => 'ceo@globex.test',
             'include_in_cc' => true, 'opted_out_at' => now(), 'created_at' => now(), 'updated_at' => now()],
        ]);

        $recipients = DB::table('customer_contacts')
            ->where('customer_id', $customer)->where('include_in_cc', true)->whereNull('opted_out_at')
            ->pluck('email')->all();

        $this->assertSame(['ops@globex.test'], $recipients);
    }

    public function test_the_same_contact_may_belong_to_two_branches_of_one_client(): void
    {
        $mumbai = $this->newCustomer();
        $chennai = $this->newCustomer();

        DB::table('customer_contacts')->insert([
            ['company_id' => $this->companyId, 'customer_id' => $mumbai, 'email' => 'ops@globex.test', 'created_at' => now(), 'updated_at' => now()],
            ['company_id' => $this->companyId, 'customer_id' => $chennai, 'email' => 'ops@globex.test', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $this->assertSame(2, DB::table('customer_contacts')->where('email', 'ops@globex.test')->count());
    }

    // ─── Document sharing ────────────────────────────────────────────────────

    private function newShareLink(array $overrides = []): int
    {
        $job = $this->newJob();

        $document = DB::table('job_documents')->insertGetId([
            'agent_id' => $this->agentId, 'job_id' => $job, 'document_type' => 'mawb',
            'file_name' => 'awb.pdf', 'file_path' => 's3://x/awb.pdf',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        return DB::table('document_share_links')->insertGetId(array_merge([
            'agent_id' => $this->agentId, 'job_document_id' => $document, 'job_id' => $job,
            'token_hash' => hash('sha256', 'token-' . random_int(1, 999999)),
            'created_by' => $this->userId, 'expires_at' => now()->addDays(14),
            'created_at' => now(), 'updated_at' => now(),
        ], $overrides));
    }

    public function test_a_share_link_stores_only_a_hash_of_its_token(): void
    {
        $raw = 'the-secret-token-that-lives-only-in-the-url';
        $id = $this->newShareLink(['token_hash' => hash('sha256', $raw)]);

        $stored = DB::table('document_share_links')->where('id', $id)->value('token_hash');

        $this->assertSame(64, strlen($stored));
        $this->assertStringNotContainsString($raw, $stored);
        $this->assertSame($id, DB::table('document_share_links')->where('token_hash', hash('sha256', $raw))->value('id'));
    }

    public function test_approval_status_is_a_closed_case_sensitive_set(): void
    {
        $id = $this->newShareLink();

        $this->assertRefused('chk_share_approval', fn () => DB::table('document_share_links')->where('id', $id)->update(['approval_status' => 'Approved']));
        $this->assertRefused('chk_share_approval', fn () => DB::table('document_share_links')->where('id', $id)->update(['approval_status' => 'rejected']));
    }

    // ─── Outbound mail ───────────────────────────────────────────────────────

    /**
     * REGRESSION. The schema doc marked idempotency_key as UK and called it the
     * double-send guard, but the runnable DDL declared no constraint — only a comment.
     * Sending a client the same message twice is unrecoverable.
     */
    public function test_a_retried_send_cannot_deliver_the_same_message_twice(): void
    {
        $mailbox = DB::table('mailbox_connections')->insertGetId([
            'agent_id' => $this->agentId, 'user_id' => $this->userId,
            'email_address' => 'asha' . random_int(1, 99999) . '@test.local', 'provider' => 'google',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        DB::table('email_threads')->insert([
            'agent_id' => $this->agentId, 'thread_key' => 'thr-' . random_int(1, 999999),
            'latest_message_received_at' => now(), 'created_at' => now(), 'updated_at' => now(),
        ]);
        $threadKey = DB::table('email_threads')->orderByDesc('id')->value('thread_key');

        $key = (string) \Illuminate\Support\Str::uuid();

        $send = fn (string $messageId) => DB::table('email_messages')->insert([
            'agent_id' => $this->agentId, 'mailbox_connection_id' => $mailbox,
            'thread_key' => $threadKey, 'direction' => 'outbound', 'idempotency_key' => $key,
            'message_id' => $messageId, 'from' => 'asha@test.local',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $send('<first@test>');

        $this->assertRefused('idempotency_key', fn () => $send('<retry@test>'));
    }

    // ─── Numbering ───────────────────────────────────────────────────────────

    public function test_a_counter_is_unique_per_branch_prefix_and_fiscal_year(): void
    {
        DB::table('sequence_counters')->insert([
            'agent_id' => $this->agentId, 'prefix' => 'INV', 'fiscal_year' => '26',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // Different prefix and different fiscal year are separate counters.
        DB::table('sequence_counters')->insert([
            ['agent_id' => $this->agentId, 'prefix' => 'ENQA', 'fiscal_year' => '26', 'created_at' => now(), 'updated_at' => now()],
            ['agent_id' => $this->agentId, 'prefix' => 'INV', 'fiscal_year' => '27', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $this->assertRefused('uq_counter_agent_prefix_fy', fn () => DB::table('sequence_counters')->insert([
            'agent_id' => $this->agentId, 'prefix' => 'INV', 'fiscal_year' => '26',
            'created_at' => now(), 'updated_at' => now(),
        ]));
    }

    public function test_two_branches_may_share_a_document_code_only_across_companies(): void
    {
        $this->assertRefused('uq_branch_code_per_company', fn () => DB::table('agents_info')->insert([
            'company_id' => $this->companyId, 'agent_name' => 'Duplicate Code Branch',
            'branch_code' => 'CTB', 'created_at' => now(), 'updated_at' => now(),
        ]));
    }

    // ─── Encrypted columns ───────────────────────────────────────────────────

    /**
     * REGRESSION. The schema doc gave two widths for this column, VARCHAR(50) and
     * VARCHAR(255), and both fail: a 10-character account number encrypts to 200 chars,
     * and a 34-character IBAN — the ISO 13616 maximum — to 256. VARCHAR(255) truncated a
     * legal IBAN by one character and lost it unrecoverably.
     */
    public function test_a_maximum_length_iban_survives_encryption_intact(): void
    {
        $iban = 'GB98MIDL07009312345678901234567890'; // 34 chars
        $this->assertSame(34, strlen($iban));

        $customer = DB::table('customers')->insertGetId([
            'company_id' => $this->companyId, 'name' => 'Bank Test',
            'bank_account_no' => Crypt::encryptString($iban),
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $stored = DB::table('customers')->where('id', $customer)->value('bank_account_no');

        $this->assertGreaterThan(255, strlen($stored), 'The encrypted payload should exceed VARCHAR(255).');
        $this->assertSame($iban, Crypt::decryptString($stored));
    }
}
