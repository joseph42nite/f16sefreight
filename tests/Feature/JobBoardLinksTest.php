<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\StatusReponse;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * What a Kanban card links to (user, 2026-09-15): the mail it came from, and the airline's Cargo Status
 * codes for its AWB, which draw the In Transit progress bar.
 */
class JobBoardLinksTest extends TestCase
{
    use DatabaseTransactions;

    private User $operator;
    private Agent $branch;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Board Co', 'code' => 'JBL', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->operator = User::create([
            'name' => 'ops', 'email' => 'ops-jbl@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);
    }

    private function job(string $status, ?string $awb): array
    {
        $enquiryId = DB::table('enquiries')->insertGetId([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-JBL-26-' . random_int(1000, 9999),
            'status' => 'converted', 'created_at' => now(), 'updated_at' => now(),
        ]);

        $jobId = DB::table('jobs')->insertGetId([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiryId, 'transport_mode' => 'air',
            'status' => $status, 'awb_number' => $awb, 'ops_id' => $this->operator->id,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        return [$jobId, $enquiryId];
    }

    private function thread(array $link): int
    {
        return DB::table('email_threads')->insertGetId($link + [
            'agent_id' => $this->branch->id, 'thread_key' => 'jbl-' . random_int(1, 999999),
            'latest_message_received_at' => now(), 'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function board(): array
    {
        $rows = $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->operator),
            'Accept' => 'application/json',
        ])->getJson('http://focusair.localhost/api/jobs')->assertOk()->json('data');

        return collect($rows)->keyBy('id')->all();
    }

    public function test_a_card_carries_its_thread_and_its_cargo_status_codes(): void
    {
        [$transit] = $this->job('Sent to Airline', '176-90000001');
        $threadId = $this->thread(['job_id' => $transit]);

        foreach (['RCS', 'MAN', 'DEP'] as $code) {
            StatusReponse::create(['business_id' => '176-90000001', 'business_status_code' => 'Cargo Status', 'condition_code' => $code]);
        }
        // The waybill's own accept/reject reply is not a movement, and another AWB's status is not this one's.
        StatusReponse::create(['business_id' => '176-90000001', 'business_status_code' => 'Acknowledged', 'condition_code' => 'XYZ']);
        StatusReponse::create(['business_id' => '176-90000002', 'business_status_code' => 'Cargo Status', 'condition_code' => 'DLV']);

        $card = $this->board()[$transit];

        $this->assertSame($threadId, $card['thread_id']);
        $this->assertSame(['RCS', 'MAN', 'DEP'], $card['cargo_statuses']);
    }

    public function test_a_job_without_its_own_thread_links_to_its_enquirys(): void
    {
        [$jobId, $enquiryId] = $this->job('Intake', null);
        $threadId = $this->thread(['enquiry_id' => $enquiryId]);

        $card = $this->board()[$jobId];

        $this->assertSame($threadId, $card['thread_id']);
        $this->assertSame([], $card['cargo_statuses']);
    }

    public function test_tracking_lists_the_awbs_cargo_status_messages_with_their_descriptions(): void
    {
        [$jobId] = $this->job('Airline Confirmed', '176-90000003');
        StatusReponse::create(['business_id' => '176-90000003', 'business_status_code' => 'Cargo Status', 'condition_code' => 'RCS', 'issue_date_time' => '2026-09-10T08:00:00']);
        StatusReponse::create(['business_id' => '176-90000003', 'business_status_code' => 'Cargo Status', 'condition_code' => 'DEP', 'reason' => 'Departed on EK 511']);
        StatusReponse::create(['business_id' => '176-90000003', 'business_status_code' => 'Rejected', 'condition_code' => 'X']);

        $body = $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->operator),
            'Accept' => 'application/json',
        ])->getJson("http://focusair.localhost/api/jobs/{$jobId}/tracking")->assertOk()->json();

        $this->assertSame('176-90000003', $body['awb_number']);
        $this->assertSame(['RCS', 'DEP'], array_column($body['statuses'], 'code'));
        // No reason stored: the code's own description stands in.
        $this->assertSame('Received from shipper and ready for carriage', $body['statuses'][0]['description']);
        $this->assertSame('2026-09-10T08:00:00', $body['statuses'][0]['at']);
        $this->assertSame('Departed on EK 511', $body['statuses'][1]['description']);
    }

    /** 🔒 Another operator's shipment is not on this operator's board, so it is not trackable from it either. */
    public function test_tracking_refuses_a_job_that_is_not_on_the_callers_board(): void
    {
        [$jobId] = $this->job('Airline Confirmed', '176-90000004');
        $other = User::create([
            'name' => 'ops2', 'email' => 'ops2-jbl@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->operator->company_name, 'branch_name' => $this->branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);

        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($other),
            'Accept' => 'application/json',
        ])->getJson("http://focusair.localhost/api/jobs/{$jobId}/tracking")->assertNotFound();
    }

    public function test_a_job_with_no_mail_has_no_thread(): void
    {
        [$jobId] = $this->job('Completed', null);

        $this->assertNull($this->board()[$jobId]['thread_id']);
    }
}
