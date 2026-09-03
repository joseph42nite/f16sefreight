<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enquiry;
use App\Job;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Triage — guide §5.1.
 *
 * Classification is a LIFECYCLE EVENT, not a label: promotion mints a numbered
 * enquiry and demotion strands one. Both directions are asserted, because a test that
 * only checks the label would pass while the enquiry side did nothing.
 */
class InboxTriageTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $pricing;
    private int $connectionId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Inbox Co', 'code' => 'IBX', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->pricing = $this->user('pricing');

        $this->connectionId = DB::table('mailbox_connections')->insertGetId([
            'agent_id' => $this->branch->id, 'user_id' => $this->pricing->id,
            'email_address' => 'inbox-ibx-' . uniqid('', true) . '@test.local',
            'provider' => 'gmail', 'is_active' => 1, 'auth_state' => 'connected',
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function user(string $designation, string $suffix = ''): User
    {
        return User::create([
            'name' => $designation, 'email' => "{$designation}{$suffix}-ibx@test.local",
            'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => $designation, 'is_active' => 1,
        ]);
    }

    private function api(User $as): self
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($as),
            'Accept' => 'application/json',
        ]);

        return $this;
    }

    private function url(string $path, string $host = 'focusair.f16sefreight.com'): string
    {
        return "http://{$host}{$path}";
    }

    private function thread(array $overrides = []): int
    {
        $key = 'thr_' . uniqid('', true);

        $id = DB::table('email_threads')->insertGetId(array_merge([
            'agent_id' => $this->branch->id,
            'thread_key' => $key,
            'status' => 'unread',
            'classification' => 'airline',
            'latest_message_received_at' => now()->subHours(2),
            'created_at' => now()->subHours(3), 'updated_at' => now()->subHours(3),
        ], $overrides));

        DB::table('email_messages')->insert([
            'agent_id' => $this->branch->id,
            'mailbox_connection_id' => $this->connectionId,
            'thread_key' => DB::table('email_threads')->where('id', $id)->value('thread_key'),
            'direction' => 'inbound',
            'message_id' => '<' . uniqid('', true) . '@mail.test>',
            'from' => 'ops@client.test', 'to' => $this->pricing->email,
            'subject' => 'Quote request', 'body_snippet' => 'Please quote.',
            'received_at' => now()->subHours(3),
            'created_at' => now()->subHours(3), 'updated_at' => now()->subHours(3),
        ]);

        return $id;
    }

    // ─── Who the enquiry is from ─────────────────────────────────────────────

    /**
     * 🔗 Promotion resolves the CLIENT from the sender's domain.
     *
     * `customers.email_domain` existed precisely for this and nothing used it: every
     * promoted enquiry was created with no `customer_id` at all, so sales attribution,
     * credit exposure and the client group had nothing to hang on.
     */
    public function test_promotion_resolves_the_client_from_the_sender_domain(): void
    {
        $customer = \App\Customer::create([
            'company_id' => $this->company->id, 'name' => 'Client Test Ltd',
            'email_domain' => 'client.test',
        ]);

        $id = $this->thread(['classification' => 'airline']);

        $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'customer_enquiry'])
            ->assertOk();

        $enquiryId = DB::table('email_threads')->where('id', $id)->value('enquiry_id');

        $this->assertSame((int) $customer->id,
            (int) DB::table('enquiries')->where('id', $enquiryId)->value('customer_id'));
    }

    /**
     * ⚠️ An UNKNOWN domain leaves `customer_id` NULL, which is a real state — a brand-new
     * prospect has no customer row yet. Inventing one at triage would create a client
     * nobody onboarded, with no GST number and no credit terms.
     */
    public function test_an_unknown_domain_leaves_the_client_unset(): void
    {
        $id = $this->thread(['classification' => 'airline']);

        $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'customer_enquiry'])
            ->assertOk();

        $enquiryId = DB::table('email_threads')->where('id', $id)->value('enquiry_id');

        $this->assertNull(DB::table('enquiries')->where('id', $enquiryId)->value('customer_id'));
    }

    // ─── The learning loop ───────────────────────────────────────────────────

    /**
     * 🔴 EVERY CORRECTION IS RECORDED, because the dropdown is the ONLY place a human
     * tells the system a rule was wrong.
     *
     * `recordOverride()` existed, wrote the row and incremented `override_count` — and
     * nothing called it, while `AdminHealthController` already read the table. The
     * reporting end was reporting on data nothing wrote, so the rules could never be
     * measured, only guessed at.
     */
    public function test_a_reclassification_is_recorded_as_an_override(): void
    {
        $id = $this->thread(['classification' => 'airline']);

        $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'clearance'])
            ->assertOk();

        $row = DB::table('email_classification_overrides')->where('email_thread_id', $id)->first();

        $this->assertNotNull($row, 'The correction was not recorded.');
        $this->assertSame('airline', $row->original_classification);
        $this->assertSame('clearance', $row->corrected_classification);
        $this->assertSame($this->pricing->id, (int) $row->corrected_by);
    }

    /**
     * ⚠️ The SENDER DOMAIN is captured, because that is what a future `domain_blocklist`
     * rule is written against. Precomputing it makes "which domains do we keep getting
     * wrong?" a query rather than a script.
     */
    public function test_the_override_captures_the_domain_a_rule_would_be_written_against(): void
    {
        $id = $this->thread(['classification' => 'airline']);

        $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'trucking_road'])
            ->assertOk();

        $row = DB::table('email_classification_overrides')->where('email_thread_id', $id)->first();

        $this->assertSame('client.test', $row->sender_domain);
        $this->assertSame('ops@client.test', $row->sender_email);
        $this->assertSame('Quote request', $row->email_subject);
    }

    /** ⚠️ Choosing the classification it already has is not a correction. */
    public function test_selecting_the_same_classification_records_nothing(): void
    {
        $id = $this->thread(['classification' => 'airline']);

        $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'airline'])
            ->assertOk();

        $this->assertSame(0, DB::table('email_classification_overrides')
            ->where('email_thread_id', $id)->count());
    }

    // ─── Promotion and demotion ──────────────────────────────────────────────

    /** 🔴 Promotion MINTS a numbered enquiry, not a flag. */
    public function test_promoting_a_thread_mints_an_enquiry(): void
    {
        $id = $this->thread();

        $body = $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'customer_enquiry'])
            ->assertOk()
            ->assertJsonPath('classification', 'customer_enquiry')
            ->json();

        $this->assertNotNull($body['enquiry'], 'An enquiry must exist.');
        $this->assertStringStartsWith('ENQA-IBXBOM-', $body['enquiry']['enquiry_no']);
        $this->assertSame('new', $body['enquiry']['status']);
    }

    /** Re-promoting must not mint a SECOND number for the same conversation. */
    public function test_promoting_twice_does_not_mint_a_second_enquiry(): void
    {
        $id = $this->thread();

        $first = $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'customer_enquiry'])
            ->json('enquiry.id');

        $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'airline'])
            ->assertOk();

        $second = $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'customer_enquiry'])
            ->assertOk()
            ->json('enquiry.id');

        $this->assertSame($first, $second, 'The same conversation keeps its number.');
    }

    /**
     * 🔴 Demotion marks the enquiry LOST, never deletes it. Lost lives on enquiries,
     * and nothing here hard-deletes a numbered document — the number was issued.
     */
    public function test_demoting_marks_the_orphaned_enquiry_lost(): void
    {
        $id = $this->thread();

        $enquiryId = $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'customer_enquiry'])
            ->json('enquiry.id');

        $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'clearance'])
            ->assertOk()
            ->assertJsonPath('classification', 'clearance');

        $this->assertDatabaseHas('enquiries', ['id' => $enquiryId, 'status' => 'lost']);
    }

    /**
     * ⚠️ **422 ONCE A JOB EXISTS.** By then a shipment is moving against that enquiry;
     * re-labelling the conversation would strand a live job whose origin nobody can
     * explain.
     */
    public function test_demoting_is_refused_when_a_job_already_exists(): void
    {
        $id = $this->thread();

        $enquiryId = $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'customer_enquiry'])
            ->json('enquiry.id');

        Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiryId, 'transport_mode' => 'air',
        ]);

        $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'airline'])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'has_job');

        // And the enquiry is untouched by the refusal. It reads 'converted' — not
        // 'new' — because JobObserver advanced it when the job was created, which is
        // exactly the state that makes demotion unsafe in the first place.
        $this->assertDatabaseHas('enquiries', ['id' => $enquiryId, 'status' => 'converted']);
    }

    public function test_an_unknown_classification_is_rejected(): void
    {
        $id = $this->thread();

        $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'spam'])
            ->assertStatus(422);
    }

    // ─── The claim race ──────────────────────────────────────────────────────

    /** 🔴 409, decided in the database — not by reading then writing. */
    public function test_a_thread_cannot_be_claimed_twice(): void
    {
        $id = $this->thread();
        $ops = $this->user('operations');

        $this->api($ops)->postJson($this->url("/api/inbox/threads/{$id}/claim"))
            ->assertOk()
            ->assertJsonPath('assigned_ops.id', $ops->id);

        $this->api($this->user('operations', '-b'))
            ->postJson($this->url("/api/inbox/threads/{$id}/claim"))
            ->assertStatus(409)
            ->assertJsonPath('reason', 'already_claimed');
    }

    // ─── The SLA pair ────────────────────────────────────────────────────────

    /**
     * 🔴 TRIAGE IS NOT A RESPONSE. `first_triage_at` is somebody looking;
     * `first_response_at` is something being SENT. Conflating them reports an SLA the
     * client never experienced, because nothing left the building.
     */
    public function test_triage_stamps_first_triage_at_and_never_first_response_at(): void
    {
        $id = $this->thread();

        $body = $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'customer_enquiry'])
            ->assertOk()
            ->json();

        $this->assertNotNull($body['first_triage_at']);
        $this->assertNull($body['first_response_at'], 'Nothing was sent.');
    }

    // ─── Listing and gates ───────────────────────────────────────────────────

    public function test_the_unassigned_pool_lists_only_unclaimed_threads(): void
    {
        $this->thread();
        $this->thread(['assigned_ops_id' => $this->user('operations')->id]);

        $rows = $this->api($this->pricing)
            ->getJson($this->url('/api/inbox/threads?unassigned=1'))
            ->assertOk()
            ->json('data');

        $this->assertCount(1, $rows);
        $this->assertNull($rows[0]['assigned_ops']);
    }

    /** 🔒 Operations reads and claims; only pricing may re-classify. */
    public function test_operations_may_read_the_inbox_but_not_reclassify(): void
    {
        $id = $this->thread();
        $ops = $this->user('operations');

        $this->api($ops)->getJson($this->url('/api/inbox/threads'))->assertOk();
        $this->api($ops)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'customer_enquiry'])
            ->assertForbidden();
    }

    /** 🔒 The inbox is operational — accounts has no business in it. */
    public function test_accounts_is_refused_the_inbox(): void
    {
        $accounts = $this->user('accounts');

        $this->api($accounts)
            ->getJson($this->url('/api/inbox/threads', 'accounts.f16sefreight.com'))
            ->assertForbidden();
    }

    /** The conversation returns its messages in arrival order. */
    public function test_a_thread_returns_its_messages_oldest_first(): void
    {
        $id = $this->thread();
        $key = DB::table('email_threads')->where('id', $id)->value('thread_key');

        DB::table('email_messages')->insert([
            'agent_id' => $this->branch->id, 'mailbox_connection_id' => $this->connectionId,
            'thread_key' => $key, 'direction' => 'outbound',
            'message_id' => '<' . uniqid('', true) . '@mail.test>',
            'from' => $this->pricing->email, 'to' => 'ops@client.test',
            'subject' => 'RE: Quote request', 'body_snippet' => 'Our rate attached.',
            'received_at' => now()->subHour(),
            'created_at' => now()->subHour(), 'updated_at' => now()->subHour(),
        ]);

        $messages = $this->api($this->pricing)
            ->getJson($this->url("/api/inbox/threads/{$id}"))
            ->assertOk()
            ->json('messages');

        $this->assertCount(2, $messages);
        $this->assertSame('inbound', $messages[0]['direction']);
        $this->assertSame('outbound', $messages[1]['direction']);
    }
}
