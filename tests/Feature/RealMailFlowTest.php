<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\MailboxConnection;
use App\Services\Mail\MailboxSyncService;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * The whole path the user tested by hand on joseph@f16sefreight.com (2026-09-17), end to end through the API with
 * Outlook faked: a quote request arrives → filed as a customer enquiry with its number → in the Kanban pool → the mail
 * shows only itself → Claim sends the acknowledgement and makes the claimer the owner → Confirm shipment creates the
 * job with its operator, puts it on the Kanban and adds the client → a New mail goes out.
 */
class RealMailFlowTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $pricing;
    private User $ops;
    private MailboxConnection $mailbox;
    private array $inbox = [];
    private int $seq = 0;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('services.graph.client_id', 'test-client');
        config()->set('services.graph.client_secret', 'test-secret');
        $company = Company::create(['name' => 'Flow Forwarders', 'code' => 'FLOW', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'Base', 'branch_code' => 'BAS']);
        $this->pricing = User::create(['name' => 'Joseph George', 'email' => 'joseph@flow-fwd.test', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $this->ops = User::create(['name' => 'Dhiraj', 'email' => 'dhiraj@flow-fwd.test', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'operations', 'is_active' => 1]);
        $this->mailbox = MailboxConnection::withoutGlobalScopes()->create(['agent_id' => $this->branch->id, 'user_id' => $this->pricing->id,
            'email_address' => 'joseph@flow-fwd.test', 'provider' => 'outlook', 'access_token' => 't', 'refresh_token' => 'r',
            'expires_at' => now()->addHour(), 'auth_state' => 'connected', 'is_active' => 1, 'backfill_status' => 'completed']);

        Http::fake(function ($request) {
            $url = urldecode($request->url());
            if (str_contains($url, '/delta')) {
                $page = ['value' => str_contains($url, 'inbox') ? $this->inbox : [], '@odata.deltaLink' => $url . '#done'];
                if (str_contains($url, 'inbox')) {
                    $this->inbox = [];
                }

                return Http::response($page);
            }
            if (preg_match('#/me/messages/[^/?]+\?#', $url)) {
                return Http::response(['body' => ['contentType' => 'html', 'content' => '<div><b>Requesting quotation</b><br>PCS : 21</div>'
                    . '<div id="appendonsend"></div><hr><b>From:</b> earlier mail']]);
            }

            return Http::response('', 202); // reply, sendMail
        });
    }

    private function arrives(string $from, string $subject, string $body): object
    {
        $n = ++$this->seq;
        $this->inbox[] = ['id' => "AAMk-flow-{$n}", 'internetMessageId' => "<flow-{$n}@client>", 'conversationId' => "flow-conv-{$n}",
            'subject' => $subject, 'from' => ['emailAddress' => ['address' => $from]], 'toRecipients' => [['emailAddress' => ['address' => 'joseph@flow-fwd.test']]],
            'receivedDateTime' => now()->toIso8601String(), 'bodyPreview' => $body, 'hasAttachments' => false, 'internetMessageHeaders' => []];
        app(MailboxSyncService::class)->sync($this->mailbox->fresh());

        return DB::table('email_threads')->where('provider_thread_id', "flow-conv-{$n}")->first();
    }

    private function as(User $user): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://focusair.localhost/api' . $path;
    }

    public function test_from_a_quote_request_to_a_confirmed_shipment_with_its_client(): void
    {
        // 1. A quote request arrives: filed as a customer enquiry, numbered, in the Kanban pool.
        $thread = $this->arrives('buyer@acme-flow.test', 'blr-ord', "hi,\nRequesting quotation for :\nBLR-ORD\nPCS : 21\nWEIGHT : 300 kgs\nDimensions : 60 x 30 x20");
        $this->assertSame('customer_enquiry', $thread->classification);
        $this->assertNotNull($thread->enquiry_id);
        $pool = collect($this->as($this->pricing)->getJson($this->url('/enquiries?unclaimed=1'))->assertOk()->json('data'))->pluck('id');
        $this->assertContains($thread->enquiry_id, $pool);

        // 2. The mail shows only itself — not the earlier mail quoted under it.
        $message = DB::table('email_messages')->where('thread_key', $thread->thread_key)->value('id');
        $html = $this->getJson($this->url("/inbox/messages/{$message}/body"))->assertOk()->json('html');
        $this->assertStringContainsString('<b>Requesting quotation</b>', $html);
        $this->assertStringNotContainsString('earlier mail', $html);

        // 3. Claim with the acknowledgement: it is sent as a reply; the claimer owns the conversation and the enquiry.
        $preview = $this->getJson($this->url("/inbox/threads/{$thread->id}/client-update/preview?stage=claimed"))->assertOk()->json('draft');
        $this->postJson($this->url("/inbox/threads/{$thread->id}/claim"), ['client_update' => ['decision' => 'send',
            'to' => $preview['to'], 'subject' => $preview['subject'], 'body' => $preview['body']]])
            ->assertOk()->assertJsonPath('client_update_result.ok', true);
        Http::assertSent(fn ($r) => str_ends_with(urldecode($r->url()), '/reply'));
        $this->assertSame($this->pricing->id, (int) DB::table('email_threads')->where('id', $thread->id)->value('assigned_ops_id'));
        $this->assertSame($this->pricing->id, (int) DB::table('enquiries')->where('id', $thread->enquiry_id)->value('pricing_id'));
        $this->assertNotContains($thread->enquiry_id, collect($this->getJson($this->url('/enquiries?unclaimed=1'))->json('data'))->pluck('id'));
        $this->assertContains($thread->enquiry_id, collect($this->getJson($this->url('/enquiries'))->assertOk()->json('data'))->pluck('id'));

        // 4. Confirm the shipment, handing it to operations: a job on the Kanban, its operator set, the client added.
        $job = $this->postJson($this->url("/enquiries/{$thread->enquiry_id}/convert"), ['ops_id' => $this->ops->id])->assertCreated()->json('job');
        $this->assertSame($this->ops->id, (int) $job['ops_id']);
        $processing = collect($this->getJson($this->url('/jobs?page=1&statuses=' . urlencode('Intake,AI Extraction,Verification,Generation')))->assertOk()->json('data'))->pluck('id');
        $this->assertContains($job['id'], $processing);
        $this->assertSame($this->ops->id, (int) $this->getJson($this->url("/inbox/threads/{$thread->id}"))->assertOk()->json('thread.job.ops_id'));

        $client = DB::table('customers')->where('email_domain', 'acme-flow.test')->first();
        $this->assertNotNull($client, 'the client was added to Clients & Partners');
        $this->assertSame($client->id, (int) $job['customer_id']);
        $this->assertTrue(DB::table('customer_contacts')->where('customer_id', $client->id)->where('email', 'buyer@acme-flow.test')->exists());
        $this->assertContains('acme-flow.test', collect($this->getJson($this->url('/customers'))->assertOk()->json('data'))->pluck('email_domain'));

        // 5. A new mail goes out from the person's own Outlook.
        $this->postJson($this->url('/inbox/compose'), ['to' => ['buyer@acme-flow.test'], 'subject' => 'Rates BLR-ORD', 'body' => '<p>Our rate</p><p></p><p>Thanks</p>'])->assertOk();
        Http::assertSent(fn ($r) => str_ends_with($r->url(), '/me/sendMail') && str_contains($r['message']['body']['content'], '<p style="margin:0 0 10px;"><br /></p>'));
    }

    /** A Gmail sender becomes a client under their address; a colleague forwarding a request adds no client. */
    public function test_free_mail_and_colleague_senders_when_confirmed(): void
    {
        $gmail = $this->arrives('jomy.flow@gmail.com', 'blr-ord', 'Requesting quotation for BLR-ORD, PCS : 21');
        $this->as($this->pricing)->postJson($this->url("/enquiries/{$gmail->enquiry_id}/convert"), [])->assertCreated();
        $this->assertSame('jomy.flow@gmail.com', DB::table('customers')->where('id', DB::table('enquiries')->where('id', $gmail->enquiry_id)->value('customer_id'))->value('name'));

        $colleague = $this->arrives('deepanjan@flow-fwd.test', 'Ex BLR 400 pcs JFK', 'Please share the confirmed booking schedule. Pcs 400, Gross wgt 17400kgs');
        $this->postJson($this->url("/enquiries/{$colleague->enquiry_id}/convert"), [])->assertCreated();
        $this->assertNull(DB::table('enquiries')->where('id', $colleague->enquiry_id)->value('customer_id'));
        $this->assertFalse(DB::table('customers')->where('email_domain', 'flow-fwd.test')->exists());
    }

    /** Re-filing a customer enquiry as something else removes its number; it is not marked lost. */
    public function test_refiling_away_removes_the_enquiry(): void
    {
        $thread = $this->arrives('buyer@acme-flow.test', 'Rate request', 'Kindly share your best rates to DXB');
        $this->as($this->pricing)->postJson($this->url("/inbox/threads/{$thread->id}/classify"), ['classification' => 'other'])->assertOk();

        $this->assertDatabaseMissing('enquiries', ['id' => $thread->enquiry_id]);
        $this->assertNull(DB::table('email_threads')->where('id', $thread->id)->value('enquiry_id'));
    }

    /**
     * A shipment confirmed by mistake (user, 2026-09-17): re-filing is refused while it is live, Cancel shipment takes a
     * reason, and afterwards the conversation can be filed as something else — the cancelled shipment is kept.
     */
    public function test_a_shipment_is_cancelled_with_a_reason_and_the_conversation_can_then_be_refiled(): void
    {
        $thread = $this->arrives('awb1@skylink-flow.test', 'RE: 125-23736134', 'Please quote the best rate. Attached AWB copy.');
        $job = $this->as($this->pricing)->postJson($this->url("/enquiries/{$thread->enquiry_id}/convert"), [])->assertCreated()->json('job');

        $this->postJson($this->url("/inbox/threads/{$thread->id}/classify"), ['classification' => 'other'])
            ->assertStatus(422)->assertJsonPath('reason', 'has_job');

        $this->postJson($this->url("/jobs/{$job['id']}/cancel"), [])->assertStatus(422);
        $this->postJson($this->url("/jobs/{$job['id']}/cancel"), ['cancellation_reason' => 'other'])->assertStatus(422);
        $this->postJson($this->url("/jobs/{$job['id']}/cancel"), ['cancellation_reason' => 'duplicate'])->assertOk()->assertJsonPath('status', 'Cancelled');

        $this->postJson($this->url("/inbox/threads/{$thread->id}/classify"), ['classification' => 'other'])->assertOk();
        $this->assertNull(DB::table('email_threads')->where('id', $thread->id)->value('enquiry_id'));
        $this->assertSame('Cancelled', DB::table('jobs')->where('id', $job['id'])->value('status'), 'kept for review');
        $this->assertTrue(DB::table('enquiries')->where('id', $thread->enquiry_id)->exists());
    }

    /**
     * The waybill number drafted from Extraction reaches the shipment, which is what links the waybill to it — and
     * generating the PDF then prepares the draft-AWB mail with the approval link (user, 2026-09-18).
     */
    public function test_the_drafted_waybill_number_joins_the_shipment_and_generation_prepares_the_client_mail(): void
    {
        $thread = $this->arrives('buyer@acme-flow.test', 'Rates BLR-ORD', 'Please quote the best rate. PCS : 21, WEIGHT : 300 kgs');
        $job = $this->as($this->pricing)->postJson($this->url("/enquiries/{$thread->enquiry_id}/convert"), [])->assertCreated()->json('job');
        $this->assertNull(DB::table('jobs')->where('id', $job['id'])->value('awb_number'));

        $this->putJson($this->url("/jobs/{$job['id']}/awb-number"), ['awb_number' => '17'])->assertStatus(422)->assertJsonPath('reason', 'not_an_awb');
        $this->putJson($this->url("/jobs/{$job['id']}/awb-number"), ['awb_number' => '176-12345678'])
            ->assertOk()->assertJsonPath('awb_number', '176-12345678');

        // A second shipment cannot take the same number.
        $other = $this->arrives('buyer@acme-flow.test', 'Another', 'Please quote the best rate, 2 pallets');
        $second = $this->postJson($this->url("/enquiries/{$other->enquiry_id}/convert"), [])->assertCreated()->json('job');
        $this->putJson($this->url("/jobs/{$second['id']}/awb-number"), ['awb_number' => '176-12345678'])
            ->assertStatus(422)->assertJsonPath('reason', 'already_used');

        // Generating the PDF moves the shipment on, and the client's draft-AWB mail is waiting on the conversation.
        $this->putJson($this->url("/jobs/{$job['id']}/status"), ['status' => 'PDF Generated'])->assertOk();
        $update = $this->getJson($this->url("/inbox/threads/{$thread->id}"))->assertOk()->json('thread.client_update');
        $this->assertSame('draft_awb', $update['stage']);
        $this->assertStringContainsString('[review link]', $update['body']);
    }
}
