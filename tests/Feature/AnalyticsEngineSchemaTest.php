<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Batch 1d — the analytics engine tables and the funnel views.
 *
 * Every assertion here is BEHAVIOURAL: rows that must be refused are inserted and the
 * refusal is caught. A constraint that `information_schema` reports as present is not
 * a constraint that works — `chk_enq_status` existed, reported present, and silently
 * accepted `'Lost'` because the column collated case-insensitively.
 */
class AnalyticsEngineSchemaTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private Customer $customer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Analytics Co', 'code' => 'ANL', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->customer = Customer::create([
            'company_id' => $this->company->id, 'name' => 'Globex', 'email_domain' => 'globex.test',
        ]);
    }

    private function action(array $overrides = []): int
    {
        return DB::table('sales_action_queue')->insertGetId(array_merge([
            'agent_id' => $this->branch->id, 'customer_id' => $this->customer->id,
            'transport_mode' => 'air', 'audience' => 'internal',
            'action_type' => 'churn_outreach', 'priority_score' => 91.5,
            'fact_packet' => json_encode(['gap_days' => 41, 'expected' => 18]),
            'created_at' => now(), 'updated_at' => now(),
        ], $overrides));
    }

    private function enquiry(string $status, string $mode = 'air', ?string $at = null): Enquiry
    {
        // chk_enq_mode_prefix refuses a sea enquiry numbered ENQA- — the prefix and the
        // mode are one fact, and the constraint caught this helper getting it wrong.
        $prefix = ['air' => 'ENQA', 'sea' => 'ENQS', 'road' => 'ENQR'][$mode];

        $e = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => $mode, 'status' => $status,
            'enquiry_no' => "{$prefix}-ANLBOM-26-" . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
        ]);

        if ($at !== null) {
            DB::table('enquiries')->where('id', $e->id)->update(['created_at' => $at]);
        }

        return $e;
    }

    // ─── The audience firewall ───────────────────────────────────────────────

    /**
     * 🔴 AN INTERNAL FINDING CAN NEVER CARRY A CLIENT-FACING DRAFT. The failure this
     * prevents is emailing a client our own analysis of them — "this account is
     * at-risk, renegotiate the rate" arriving at the account itself. Enforced at the
     * database because no amount of application care makes that recoverable.
     */
    public function test_an_internal_action_cannot_carry_a_client_draft(): void
    {
        $this->expectException(QueryException::class);

        $this->action(['audience' => 'internal', 'draft_subject' => 'Your recent shipments']);
    }

    public function test_an_internal_action_cannot_carry_a_draft_body_either(): void
    {
        $this->expectException(QueryException::class);

        $this->action(['audience' => 'internal', 'draft_body' => 'We noticed you have not shipped...']);
    }

    /** A client-audience row is exactly what the draft columns are for. */
    public function test_a_client_action_may_carry_a_draft(): void
    {
        $id = $this->action([
            'audience' => 'client',
            'draft_subject' => 'Checking in on your Mumbai–Hamburg lane',
            'draft_body' => 'Hello,',
            'draft_to' => json_encode(['ops@globex.test']),
        ]);

        $this->assertDatabaseHas('sales_action_queue', ['id' => $id, 'audience' => 'client']);
    }

    /** An internal row with NO draft is the ordinary case and must pass. */
    public function test_an_internal_action_without_a_draft_is_fine(): void
    {
        $this->assertIsInt($this->action());
    }

    /**
     * ⚠️ THE CASE-SENSITIVITY REGRESSION. Without `COLLATE utf8mb4_bin` inside the
     * expression the CHECK reports as present and accepts `'Client'` — MySQL's reads
     * stay case-insensitive, but the value serialises to JSON and `audience ===
     * 'client'` in Vue is case-SENSITIVE. The row passes every database check and
     * then fails in every frontend guard.
     */
    public function test_the_audience_check_is_case_sensitive(): void
    {
        $this->expectException(QueryException::class);

        $this->action(['audience' => 'Client']);
    }

    public function test_an_unknown_audience_is_refused(): void
    {
        $this->expectException(QueryException::class);

        $this->action(['audience' => 'partner']);
    }

    // ─── Mode partitioning ───────────────────────────────────────────────────

    /**
     * 🔴 NO ROW EVER BLENDS MODES. The unique key is (customer_id, transport_mode,
     * snapshot_date) — one customer legitimately has an air row AND a sea row for the
     * same day, and neither may be collapsed into the other.
     */
    public function test_one_customer_holds_a_separate_snapshot_per_mode(): void
    {
        foreach (['air', 'sea'] as $mode) {
            DB::table('customer_performance_snapshots')->insert([
                'agent_id' => $this->branch->id, 'customer_id' => $this->customer->id,
                'transport_mode' => $mode, 'snapshot_date' => now()->toDateString(),
                'tonnage_mtd' => 12.500, 'last_computed_at' => now(),
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        $this->assertSame(2, DB::table('customer_performance_snapshots')
            ->where('customer_id', $this->customer->id)->count());
    }

    /** …but the same (customer, mode, date) twice is a double-counted rollup. */
    public function test_a_duplicate_snapshot_for_one_mode_and_day_is_refused(): void
    {
        $row = [
            'agent_id' => $this->branch->id, 'customer_id' => $this->customer->id,
            'transport_mode' => 'air', 'snapshot_date' => now()->toDateString(),
            'last_computed_at' => now(), 'created_at' => now(), 'updated_at' => now(),
        ];

        DB::table('customer_performance_snapshots')->insert($row);

        $this->expectException(QueryException::class);
        DB::table('customer_performance_snapshots')->insert($row);
    }

    // ─── The funnel views ────────────────────────────────────────────────────

    /**
     * 🔴 THE FAN-OUT TRAP, ASSERTED. An enquiry may carry SEVERAL threads. A LEFT JOIN
     * would multiply rows and inflate `enquiries_raised`, silently improving every
     * conversion rate. Three enquiries across four threads must still count 3.
     */
    public function test_several_threads_on_one_enquiry_do_not_inflate_the_count(): void
    {
        $enquiries = collect(['converted', 'lost', 'new'])->map(fn ($s) => $this->enquiry($s));

        // Four threads across three enquiries — the first carries two.
        $threads = [
            [$enquiries[0]->id, now()], [$enquiries[0]->id, now()],
            [$enquiries[1]->id, now()], [$enquiries[2]->id, null],
        ];

        foreach ($threads as $i => [$enquiryId, $responded]) {
            DB::table('email_threads')->insert([
                'agent_id' => $this->branch->id, 'enquiry_id' => $enquiryId,
                'thread_key' => 'thr_' . uniqid('', true), 'first_response_at' => $responded,
                'latest_message_received_at' => now(), // NOT NULL — a thread exists because a message arrived
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        $row = DB::table('dsr_funnel_view')
            ->where('agent_id', $this->branch->id)->where('transport_mode', 'air')
            ->first();

        $this->assertSame(3, (int) $row->enquiries_raised, 'Four threads must not become four enquiries.');
        $this->assertSame(2, (int) $row->enquiries_replied);
        $this->assertSame(1, (int) $row->enquiries_converted);
    }

    /**
     * 🔴 NULL, NEVER 0%, ON AN EMPTY DENOMINATOR. "Nothing came in" and "everything
     * was lost" are opposite facts; rendering both as 0% tells a sales manager the
     * team failed when in truth there was nothing to win.
     */
    public function test_a_period_with_only_losses_reports_zero_but_a_rate_still_exists(): void
    {
        $this->enquiry('lost');
        $this->enquiry('lost');

        $row = DB::table('dsr_funnel_view')
            ->where('agent_id', $this->branch->id)->where('transport_mode', 'air')->first();

        // Two enquiries, none won: a real 0.00, because the denominator is not empty.
        $this->assertSame(2, (int) $row->enquiries_lost);
        $this->assertSame('0.00', (string) $row->conversion_rate_pct);

        // And a branch with no enquiries at all produces NO ROW — not a row of zeroes.
        $empty = Agent::create([
            'company_id' => $this->company->id, 'agent_name' => 'DEL', 'branch_code' => 'DEL',
        ]);
        $this->assertNull(DB::table('dsr_funnel_view')->where('agent_id', $empty->id)->first());
    }

    /** Modes are separated in the funnel too — an air rate never includes sea. */
    public function test_the_funnel_separates_transport_modes(): void
    {
        $this->enquiry('converted', 'air');
        $this->enquiry('lost', 'sea');

        $rows = DB::table('dsr_funnel_view')->where('agent_id', $this->branch->id)
            ->get()->keyBy('transport_mode');

        $this->assertSame(1, (int) $rows['air']->enquiries_raised);
        $this->assertSame(1, (int) $rows['sea']->enquiries_raised);
        $this->assertSame('100.00', (string) $rows['air']->conversion_rate_pct);
        $this->assertSame('0.00', (string) $rows['sea']->conversion_rate_pct);
    }

    /**
     * ⚠️ THE FISCAL/CALENDAR SPLIT. A March-2026 enquiry belongs to fiscal 2025-04-01
     * and calendar 2026-01-01 — different twelve-month windows. The fiscal basis lines
     * up with EnquirySequenceService, so a yearly report and a document number agree.
     */
    public function test_the_yearly_view_emits_both_bases_for_a_january_to_march_enquiry(): void
    {
        $this->enquiry('converted', 'air', '2026-03-15 10:00:00');

        $rows = DB::table('ysr_funnel_view')
            ->where('agent_id', $this->branch->id)->where('transport_mode', 'air')
            ->get()->keyBy('period_basis');

        $this->assertSame('2026-01-01', (string) $rows['calendar']->period_start);
        $this->assertSame('2025-04-01', (string) $rows['fiscal']->period_start);
    }

    /**
     * 🔴 `period_basis` MUST BE IN EVERY WHERE CLAUSE. Without it the same enquiry
     * returns twice under two year labels, silently doubling every count. Asserted so
     * the trap is documented in a test rather than only in a comment.
     */
    public function test_querying_the_yearly_view_without_a_basis_double_counts(): void
    {
        $this->enquiry('converted', 'air', '2026-03-15 10:00:00');

        $unfiltered = DB::table('ysr_funnel_view')
            ->where('agent_id', $this->branch->id)->sum('enquiries_raised');
        $filtered = DB::table('ysr_funnel_view')
            ->where('agent_id', $this->branch->id)->where('period_basis', 'fiscal')
            ->sum('enquiries_raised');

        $this->assertSame(2, (int) $unfiltered, 'One enquiry, counted under both bases.');
        $this->assertSame(1, (int) $filtered);
    }

    /** A soft-deleted enquiry must not inflate the denominator. */
    public function test_soft_deleted_enquiries_are_excluded(): void
    {
        $this->enquiry('converted');
        $lost = $this->enquiry('lost');
        $lost->delete();

        $row = DB::table('dsr_funnel_view')
            ->where('agent_id', $this->branch->id)->where('transport_mode', 'air')->first();

        $this->assertSame(1, (int) $row->enquiries_raised);
        $this->assertSame('100.00', (string) $row->conversion_rate_pct);
    }
}
