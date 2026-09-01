<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Job;
use App\Services\AwbJobLinker;
use App\Support\AwbNumber;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Joining the two halves of FocusAir — GAPS #39 and #40.
 *
 * 🔴 **`air_way_bills.job_id` was written by NOTHING.** The column existed, its foreign key
 * existed, and `JobController::cancel` even cleared it — releasing a link no code path had
 * ever made. So the operational half (enquiry → job → cost sheet → invoice → analytics, on
 * `jobs.id`) and the document half (MAWB, HAWB, consolidation, PDF, XML, addresses, on
 * `air_way_bills.id`) were two systems sharing a number as loose text.
 *
 * 🔴 **And they did not agree on the number's format.** `jobs.awb_number` is `176-10000008`;
 * `air_way_bills.id` is `17610000008`. `AwbNumber` is the one place that reconciles them.
 */
class AwbJobLinkTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private Agent $otherBranch;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Awb Co', 'code' => 'AWL', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->otherBranch = Agent::create(['company_id' => $company->id, 'agent_name' => 'MAA', 'branch_code' => 'MAA']);
    }

    private function job(?string $awbNumber, ?Agent $branch = null): Job
    {
        $branch = $branch ?? $this->branch;

        $enquiryId = DB::table('enquiries')->insertGetId([
            'agent_id' => $branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-AWLBOM-26-' . random_int(1000, 9999),
            'status' => 'converted', 'created_at' => now(), 'updated_at' => now(),
        ]);

        return Job::create([
            'agent_id' => $branch->id, 'enquiry_id' => $enquiryId, 'transport_mode' => 'air',
            'awb_number' => $awbNumber,
        ]);
    }

    private function waybill(string $code, string $serial, ?Agent $branch = null): int
    {
        $id = (int) ($code . $serial);

        DB::table('air_way_bills')->insert([
            'id' => $id, 'awb_code' => $code, 'awb_no' => $serial,
            'agent_id' => ($branch ?? $this->branch)->id, 'status' => 'generate_pdf',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        return $id;
    }

    // ─── AwbNumber: one format, reconciled ───────────────────────────────────

    /** 🔴 The canonical form is what IATA prints and what customs expects. */
    public function test_the_canonical_number_carries_the_hyphen_after_three_digits(): void
    {
        $this->assertSame('176-10000008', AwbNumber::canonical('176', '10000008'));
        $this->assertSame('176-10000008', AwbNumber::normalise('17610000008'));
        $this->assertSame('176-10000008', AwbNumber::normalise('176-10000008'));
        $this->assertSame('176-10000008', AwbNumber::normalise('176 10000008'));
    }

    /** ⚠️ And the numeric key is recoverable from any of those shapes. */
    public function test_the_primary_key_is_the_digits_of_any_shape(): void
    {
        $this->assertSame(17610000008, AwbNumber::key('176-10000008'));
        $this->assertSame(17610000008, AwbNumber::key('17610000008'));
    }

    /**
     * 🔴 A number of the wrong LENGTH is not an AWB. Eleven digits exactly — a truncated
     * OCR read or a typo must not be silently reformatted into something plausible.
     */
    public function test_a_wrong_length_number_is_refused_not_reshaped(): void
    {
        foreach (['176-1000000', '1761000000812', '', 'ABC-12345678'] as $bad) {
            $this->assertNull(AwbNumber::normalise($bad), "'{$bad}' is not an AWB number");
            $this->assertFalse(AwbNumber::isValid($bad));
        }
    }

    // ─── Linking, both directions ────────────────────────────────────────────

    /** The document comes first, then the job claims its number. */
    public function test_a_waybill_links_to_the_job_that_holds_its_number(): void
    {
        $id = $this->waybill('176', '10000008');
        $job = $this->job('176-10000008');

        $this->assertSame($job->id, app(AwbJobLinker::class)->link($id));
        $this->assertSame($job->id, (int) DB::table('air_way_bills')->where('id', $id)->value('job_id'));
    }

    /**
     * 🔗 The other direction, hooked on the OBSERVER so every writer of `awb_number` is
     * covered — imports and console commands included, not just controllers.
     */
    public function test_giving_a_job_its_number_links_an_existing_waybill(): void
    {
        $id = $this->waybill('176', '10000009');
        $job = $this->job(null);

        $this->assertNull(DB::table('air_way_bills')->where('id', $id)->value('job_id'));

        $job->update(['awb_number' => '176-10000009']);

        $this->assertSame($job->id, (int) DB::table('air_way_bills')->where('id', $id)->value('job_id'));
    }

    /**
     * 🔴 **THE MATCH IS SCOPED BY BRANCH.** An airline prefix plus serial is unique per
     * airline, not per forwarder, and nothing stops two branches recording the same number.
     * A cross-branch match would attach one tenant's document to another tenant's job.
     */
    public function test_a_waybill_never_links_to_another_branchs_job(): void
    {
        $id = $this->waybill('176', '10000010', $this->branch);
        $this->job('176-10000010', $this->otherBranch);

        $this->assertNull(app(AwbJobLinker::class)->link($id));
        $this->assertNull(DB::table('air_way_bills')->where('id', $id)->value('job_id'));
    }

    /**
     * ⚠️ An unmatched waybill is NORMAL, not an error. Documents are routinely raised
     * before the job exists, or for shipments that never become one.
     */
    public function test_a_waybill_with_no_matching_job_stays_unlinked_quietly(): void
    {
        $id = $this->waybill('176', '10000011');

        $this->assertNull(app(AwbJobLinker::class)->link($id));
        $this->assertNull(DB::table('air_way_bills')->where('id', $id)->value('job_id'));
    }

    /** ⚠️ Linking twice must not churn the row — saves are repeated constantly. */
    public function test_linking_is_idempotent(): void
    {
        $id = $this->waybill('176', '10000012');
        $job = $this->job('176-10000012');

        $linker = app(AwbJobLinker::class);
        $this->assertSame($job->id, $linker->link($id));
        $this->assertSame($job->id, $linker->link($id));

        $this->assertSame(1, DB::table('air_way_bills')->where('id', $id)->where('job_id', $job->id)->count());
    }

    /** A sea job never claims an AWB, so nothing links to one. */
    public function test_only_air_jobs_are_linked(): void
    {
        $id = $this->waybill('176', '10000013');

        $enquiryId = DB::table('enquiries')->insertGetId([
            'agent_id' => $this->branch->id, 'transport_mode' => 'sea',
            'enquiry_no' => 'ENQS-AWLBOM-26-' . random_int(1000, 9999),
            'status' => 'converted', 'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('jobs')->insert([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiryId,
            'transport_mode' => 'sea', 'status' => 'Intake', 'awb_number' => '176-10000013',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->assertNull(app(AwbJobLinker::class)->link($id));
    }

    /**
     * The reconciliation pass, for documents created while nothing wrote `job_id` at all.
     *
     * ⚠️ The link is CLEARED first, deliberately. Creating the job already links it through
     * `JobObserver`, so without this the backfill has nothing left to do and returns 0 —
     * which is what happened on the first run of this test and read like a broken backfill.
     * What is being reproduced here is the pre-fix state of the live database: rows that
     * exist with no link because no code path ever wrote one.
     */
    public function test_backfill_links_everything_it_can_and_leaves_the_rest(): void
    {
        $matched = $this->waybill('176', '10000014');
        $orphan = $this->waybill('176', '10000015');
        $job = $this->job('176-10000014');

        DB::table('air_way_bills')->whereIn('id', [$matched, $orphan])->update(['job_id' => null]);

        $this->assertSame(1, app(AwbJobLinker::class)->backfill($this->branch->id));

        $this->assertSame($job->id, (int) DB::table('air_way_bills')->where('id', $matched)->value('job_id'));
        $this->assertNull(DB::table('air_way_bills')->where('id', $orphan)->value('job_id'));
    }
}
