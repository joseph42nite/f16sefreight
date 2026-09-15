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

    /** 🔴 The Kanban for operations: only the shipments assigned to this operator, never a colleague's. */
    public function test_an_operations_board_shows_only_their_own_shipments(): void
    {
        [$mine] = $this->job('Airline Confirmed', '176-90000005');
        [$theirs] = $this->job('Airline Confirmed', '176-90000006');
        $colleague = User::create([
            'name' => 'ops3', 'email' => 'ops3-jbl@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->operator->company_name, 'branch_name' => $this->branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);
        DB::table('jobs')->where('id', $theirs)->update(['ops_id' => $colleague->id]);

        $board = $this->board();

        $this->assertArrayHasKey($mine, $board);
        $this->assertArrayNotHasKey($theirs, $board);
    }

    /**
     * 🔴 Operations claim from the unassigned pool (PRD §5.5), so they can list it — the board failed with
     * "Something went wrong" when this was pricing-only. The full enquiry list stays pricing's.
     */
    public function test_operations_can_list_the_unassigned_pool_but_not_every_enquiry(): void
    {
        $api = $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->operator),
            'Accept' => 'application/json',
        ]);

        $api->getJson('http://focusair.localhost/api/enquiries?unclaimed=1')->assertOk();
        $api->getJson('http://focusair.localhost/api/enquiries')->assertForbidden();
    }

    /** 🔴 A Kanban column loads only its own statuses, 50 a page, with the true total (user, 2026-09-15). */
    public function test_a_kanban_column_loads_its_statuses_fifty_a_page(): void
    {
        for ($i = 0; $i < 53; $i++) {
            $this->job('Completed', null);
        }
        $this->job('Intake', null);

        $api = $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->operator), 'Accept' => 'application/json']);
        $done = $api->getJson('http://focusair.localhost/api/jobs?statuses=' . urlencode('Completed,Cancelled'))->assertOk()->json();

        $this->assertSame([50, 53, 2], [count($done['data']), $done['total'], $done['last_page']]);
        $this->assertSame(['Completed'], array_values(array_unique(array_column($done['data'], 'status'))));
        $this->assertCount(3, $api->getJson('http://focusair.localhost/api/jobs?page=2&statuses=Completed,Cancelled')->json('data'));
    }

    /** Sales follow the whole branch's board — every operator's shipments (user, 2026-09-15). */
    public function test_sales_see_every_shipment_in_the_branch(): void
    {
        [$mine] = $this->job('Intake', null);
        $sales = User::create([
            'name' => 'sales', 'email' => 'sales-jbl@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->operator->company_name, 'branch_name' => $this->branch->id,
            'designation' => 'sales', 'is_active' => 1,
        ]);

        $ids = array_column($this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($sales), 'Accept' => 'application/json'])
            ->getJson('http://focusair.localhost/api/jobs')->assertOk()->json('data'), 'id');

        $this->assertContains($mine, $ids, "an operator's shipment is on the sales view of the board");
    }

    public function test_a_job_with_no_mail_has_no_thread(): void
    {
        [$jobId] = $this->job('Completed', null);

        $this->assertNull($this->board()[$jobId]['thread_id']);
    }

    /** An unclaimed pool enquiry from Globex, its mail received 3 hours ago, in a company on this tier. */
    private function poolEnquiry(string $tier): array
    {
        $company = Company::create(['name' => "Pool {$tier}", 'code' => strtoupper(substr($tier, 0, 3)) . 'P', 'tier' => $tier]);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $users = collect(['pricing', 'operations'])->mapWithKeys(fn ($d) => [$d => User::create([
            'name' => $d, 'email' => "{$d}-{$tier}-pool@test.local", 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => $d, 'is_active' => 1,
        ])]);
        $customer = \App\Customer::create(['company_id' => $company->id, 'name' => 'Globex Industries', 'email_domain' => 'globex.test']);
        $enquiryId = DB::table('enquiries')->insertGetId(['agent_id' => $branch->id, 'transport_mode' => 'air', 'status' => 'new',
            'customer_id' => $customer->id, 'enquiry_no' => 'ENQA-POOL-26-' . random_int(1000, 9999), 'created_at' => now(), 'updated_at' => now()]);
        $key = 'pool-' . random_int(1, 999999);
        DB::table('email_threads')->insert(['agent_id' => $branch->id, 'thread_key' => $key, 'classification' => 'customer_enquiry',
            'enquiry_id' => $enquiryId, 'latest_message_received_at' => now(), 'created_at' => now(), 'updated_at' => now()]);
        $mailbox = DB::table('mailbox_connections')->insertGetId(['agent_id' => $branch->id, 'user_id' => $users['pricing']->id,
            'email_address' => "desk-{$tier}-pool@test.local", 'provider' => 'outlook', 'is_active' => 1, 'auth_state' => 'connected', 'created_at' => now(), 'updated_at' => now()]);
        DB::table('email_messages')->insert(['agent_id' => $branch->id, 'mailbox_connection_id' => $mailbox, 'thread_key' => $key, 'direction' => 'inbound',
            'message_id' => '<' . $key . '@globex.test>', 'from' => 'shipping@globex.test', 'to' => 'desk@test.local', 'subject' => 'Quote',
            'received_at' => now()->subHours(3)->startOfMinute(), 'created_at' => now(), 'updated_at' => now()]);

        return [$users, $enquiryId];
    }

    private function pool(User $as): array
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($as), 'Accept' => 'application/json'])
            ->getJson('http://focusair.localhost/api/enquiries?unclaimed=1')->assertOk()->json('data');
    }

    /** Pool card, Tactical: the client's domain and when its mail came in (user, 2026-09-16). */
    public function test_tactical_pool_cards_show_the_domain_and_when_the_mail_came(): void
    {
        [$users] = $this->poolEnquiry('tactical');

        $card = $this->pool($users['operations'])[0];

        $this->assertSame('globex.test', $card['client_label']);
        $this->assertSame(now()->subHours(3)->startOfMinute()->toDateTimeString(), \Illuminate\Support\Carbon::parse($card['received_at'])->toDateTimeString());
    }

    /** Pool card, Command: the client's name. */
    public function test_command_pool_cards_show_the_client_name(): void
    {
        [$users] = $this->poolEnquiry('command');

        $this->assertSame('Globex Industries', $this->pool($users['pricing'])[0]['client_label']);
    }

    /** 🔴 Decline passes on it: gone from the pool of whoever declined, still in their colleague's. */
    public function test_declining_a_pool_enquiry_removes_it_only_for_that_person(): void
    {
        [$users, $enquiryId] = $this->poolEnquiry('tactical');

        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($users['pricing']), 'Accept' => 'application/json'])
            ->postJson("http://focusair.localhost/api/enquiries/{$enquiryId}/pass")->assertOk();

        $this->assertSame([], $this->pool($users['pricing']));
        $this->assertSame([$enquiryId], array_column($this->pool($users['operations']), 'id'));
    }

    /** The pool holds new enquiries only — a quoted one already has somebody working it. */
    public function test_the_pool_holds_only_new_enquiries(): void
    {
        [$users, $enquiryId] = $this->poolEnquiry('tactical');
        DB::table('enquiries')->where('id', $enquiryId)->update(['status' => 'quoted']);

        $this->assertSame([], $this->pool($users['pricing']));
    }

    /** 🔴 The Completed column lists only shipments whose "Delivered" mail still waits (user, 2026-09-16). */
    public function test_the_completed_column_lists_only_shipments_with_the_delivered_mail_waiting(): void
    {
        [$waiting, $waitingEnquiry] = $this->job('Completed', '176-20000001');
        [$sent, $sentEnquiry] = $this->job('Completed', '176-20000002');
        $this->thread(['job_id' => $waiting, 'enquiry_id' => $waitingEnquiry, 'classification' => 'customer_enquiry',
            'pending_client_notification' => json_encode(['stage' => 'delivered', 'title' => 'Delivered'])]);
        $this->thread(['job_id' => $sent, 'enquiry_id' => $sentEnquiry, 'classification' => 'customer_enquiry',
            'client_updates' => json_encode(['delivered' => ['decision' => 'sent']])]);

        $ids = collect($this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->operator), 'Accept' => 'application/json',
        ])->getJson('http://focusair.localhost/api/jobs?statuses=Completed,Cancelled&delivered_mail_waiting=1')->assertOk()->json('data'))->pluck('id')->all();

        $this->assertSame([$waiting], $ids);
    }
}
