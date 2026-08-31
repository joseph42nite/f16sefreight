<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enquiry;
use App\Job;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * The Lost/Cancelled split and the mode partition — guide §8.1 `LifecycleSplitTest`.
 *
 * 🔴 `PRD.md`'s first load-bearing rule: **Lost lives on enquiries, Cancelled on jobs,
 * enforced by DB CHECK, not convention.** The split is what stops a converted-then-
 * aborted shipment polluting the conversion funnel — a lost deal and a failed execution
 * are different business facts, and collapsing them makes both numbers meaningless.
 *
 * ⚠️ The guide is specific that the constraint must be confirmed PRESENT before it is
 * trusted: **MySQL below 8.0.16 parses `CHECK` and silently ignores it**, so a suite
 * asserting the rejection would pass on a database that enforces nothing.
 */
class LifecycleSplitTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Split Co', 'code' => 'SPL', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
    }

    private function enquiry(string $mode = 'air', array $attrs = []): Enquiry
    {
        $prefix = ['air' => 'ENQA', 'sea' => 'ENQS', 'road' => 'ENQR'][$mode];

        return Enquiry::create(array_merge([
            'agent_id' => $this->branch->id, 'transport_mode' => $mode,
            'enquiry_no' => "{$prefix}-SPLBOM-26-" . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
        ], $attrs));
    }

    // ─── (a) 'Lost' is rejected BY THE DATABASE ──────────────────────────────

    /**
     * The guide's own precondition: confirm the constraint EXISTS before trusting a
     * rejection. A silently-dropped CHECK is worse than none, because it grants false
     * confidence — and the assertion below would pass either way if the insert failed
     * for some unrelated reason.
     */
    public function test_the_jobs_status_check_constraint_is_actually_present(): void
    {
        $ddl = collect(DB::select('SHOW CREATE TABLE jobs'))->first();
        $sql = (array) $ddl;

        $this->assertStringContainsString(
            'chk_jobs_status',
            implode(' ', $sql),
            'MySQL below 8.0.16 parses CHECK and ignores it — verify the server version.'
        );
    }

    /** 🔴 Lost is an ENQUIRY state. The database refuses it on a job. */
    public function test_a_job_cannot_be_marked_lost(): void
    {
        $enquiry = $this->enquiry();

        $this->expectException(QueryException::class);

        DB::table('jobs')->insert([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id,
            'transport_mode' => 'air', 'status' => 'Lost',
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    /** …and Cancelled is a JOB state, refused on an enquiry. */
    public function test_an_enquiry_cannot_be_marked_cancelled(): void
    {
        $this->expectException(QueryException::class);

        DB::table('enquiries')->insert([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-SPLBOM-26-9998', 'status' => 'Cancelled',
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    // ─── (b) jobs.enquiry_id is never NULL ───────────────────────────────────

    /**
     * A job exists BECAUSE an enquiry converted. One with no enquiry has no origin, no
     * quoted rate and no place in the funnel — it is a shipment nobody can explain.
     */
    public function test_a_job_cannot_exist_without_an_enquiry(): void
    {
        $this->expectException(QueryException::class);

        DB::table('jobs')->insert([
            'agent_id' => $this->branch->id, 'enquiry_id' => null,
            'transport_mode' => 'air', 'status' => 'Intake',
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    // ─── (c) converting twice yields TWO jobs on one enquiry ─────────────────

    /**
     * ⚠️ One enquiry can legitimately become several shipments — a client splitting a
     * booking across two flights is one negotiation and two jobs. The relationship is
     * one-to-MANY on purpose, and a UNIQUE key here would break that.
     */
    public function test_one_enquiry_can_carry_two_jobs(): void
    {
        $enquiry = $this->enquiry();

        foreach (range(1, 2) as $_) {
            Job::create([
                'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id,
                'transport_mode' => 'air', 'status' => 'Intake',
            ]);
        }

        $this->assertSame(2, Job::withoutTenantScope()->where('enquiry_id', $enquiry->id)->count());
    }

    // ─── (d) a sea job carries no air details and no AWB ─────────────────────

    /**
     * 🔴 An AWB number on a sea shipment is a document reference that cannot exist. The
     * mode partition is not a display filter — it decides which tables and which
     * identifiers apply at all.
     */
    public function test_a_sea_job_has_no_air_details_and_no_awb(): void
    {
        $job = Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $this->enquiry('sea')->id,
            'transport_mode' => 'sea', 'status' => 'Intake',
        ]);

        DB::table('sea_shipment_details')->insert([
            'job_id' => $job->id, 'piece_count' => 10,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->assertNull($job->fresh()->awb_number);
        $this->assertSame(0, DB::table('air_shipment_details')->where('job_id', $job->id)->count());
        $this->assertSame(1, DB::table('sea_shipment_details')->where('job_id', $job->id)->count());
    }

    // ─── (e) declared cargo is never mutated by verification ─────────────────

    /**
     * 🔴 THE DECLARED-VS-ACTUAL VARIANCE DEPENDS ON THIS. `enquiries.extracted_*` is
     * what the CLIENT told us; `*_shipment_details` is what we VERIFIED. Overwriting the
     * first with the second destroys the only evidence of a mis-declaration — and
     * declaration accuracy is a scored signal in the sales engine.
     */
    public function test_verifying_a_shipment_never_rewrites_the_declared_cargo(): void
    {
        $enquiry = $this->enquiry('air', ['extracted_pieces' => 12, 'extracted_weight' => 450.500]);
        $job = Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id,
            'transport_mode' => 'air', 'status' => 'Verification',
        ]);

        // The verified reality differs from the declaration — which is the whole point.
        DB::table('air_shipment_details')->insert([
            'job_id' => $job->id, 'piece_count' => 15, 'gross_weight' => 612.750,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $declared = $enquiry->fresh();
        $this->assertSame(12, (int) $declared->extracted_pieces, 'The declaration stands.');
        $this->assertSame('450.500', (string) $declared->extracted_weight);

        // ...and the variance is therefore computable.
        $actual = DB::table('air_shipment_details')->where('job_id', $job->id)->first();
        $this->assertSame(3, (int) $actual->piece_count - (int) $declared->extracted_pieces);
    }

    // ─── (f) the mode prefix constraints ─────────────────────────────────────

    /** An air enquiry numbered ENQS- is refused — the prefix and the mode are one fact. */
    public function test_an_air_enquiry_cannot_carry_a_sea_number(): void
    {
        $this->expectException(QueryException::class);

        DB::table('enquiries')->insert([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQS-SPLBOM-26-9997', 'status' => 'new',
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    public function test_a_sea_job_cannot_carry_an_air_number(): void
    {
        $enquiry = $this->enquiry('sea');

        $this->expectException(QueryException::class);

        DB::table('jobs')->insert([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id,
            'transport_mode' => 'sea', 'execution_job_no' => 'JOBA-SPLBOM-26-9996',
            'status' => 'Intake', 'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    /**
     * ⚠️ THE CASE-SENSITIVITY REGRESSION, RE-ASSERTED HERE. Without `COLLATE
     * utf8mb4_bin` the CHECK reports present and accepts `'cancelled'` — MySQL reads
     * case-insensitively, but the value serialises to JSON and `status === 'Cancelled'`
     * in Vue is case-SENSITIVE. The row passes every database check and fails in every
     * frontend guard.
     */
    public function test_the_status_vocabulary_is_case_sensitive(): void
    {
        $enquiry = $this->enquiry();

        $this->expectException(QueryException::class);

        DB::table('jobs')->insert([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id,
            'transport_mode' => 'air', 'status' => 'cancelled',   // lowercase
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }
}
