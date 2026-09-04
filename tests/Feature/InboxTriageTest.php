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

    /**
     * 🔗 enquiry -> job -> waybill on the thread itself.
     *
     * The drawer used to fire a second GET /jobs?enquiry_id= for this, which meant the
     * LIST could never show a job number. Asserting the shape, not the drawer, is what
     * keeps both surfaces honest.
     */
    public function test_a_thread_carries_the_job_its_enquiry_converted_into(): void
    {
        $id = $this->thread();

        $enquiryId = $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'customer_enquiry'])
            ->json('enquiry.id');

        // Before conversion there is a number to quote, but no job behind it.
        $this->api($this->pricing)
            ->getJson($this->url("/api/inbox/threads/{$id}"))
            ->assertJsonPath('thread.job', null)
            ->assertJsonPath('thread.job_count', 0);

        $job = Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiryId, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-IBX-26-0001', 'awb_number' => '176-10000008',
        ]);

        $this->api($this->pricing)
            ->getJson($this->url("/api/inbox/threads/{$id}"))
            ->assertJsonPath('thread.job.id', $job->id)
            ->assertJsonPath('thread.job.execution_job_no', 'JOBA-IBX-26-0001')
            ->assertJsonPath('thread.job.awb_number', '176-10000008')
            // The enquiry number is still carried — it is history, not deleted.
            ->assertJsonPath('thread.enquiry.enquiry_no', fn ($no) => filled($no));
    }

    /**
     * ONE enquiry, SEVERAL jobs — a consol splitting into house shipments. The thread
     * names the newest, matching JobController@index's `latest()`, and says how many
     * others there are rather than silently picking one.
     */
    public function test_a_split_enquiry_names_the_newest_job_and_counts_the_rest(): void
    {
        $id = $this->thread();

        $enquiryId = $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'customer_enquiry'])
            ->json('enquiry.id');

        foreach (['JOBA-IBX-26-0007', 'JOBA-IBX-26-0008'] as $no) {
            Job::create([
                'agent_id' => $this->branch->id, 'enquiry_id' => $enquiryId,
                'transport_mode' => 'air', 'execution_job_no' => $no,
            ]);
        }

        $this->api($this->pricing)
            ->getJson($this->url("/api/inbox/threads/{$id}"))
            ->assertJsonPath('thread.job.execution_job_no', 'JOBA-IBX-26-0008')
            ->assertJsonPath('thread.job_count', 2);
    }

    /**
     * 🔴 THE OUTCOME GATE. A waybill is a document for a shipment that is HAPPENING, so
     * the drawer refuses to draft one until somebody says the enquiry confirmed. The UI
     * decides that from `thread.job`, so what is asserted here is that the field only
     * appears once the outcome has actually been recorded.
     */
    public function test_confirming_a_shipment_is_what_opens_awb_drafting(): void
    {
        $id = $this->thread();

        $enquiryId = $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'customer_enquiry'])
            ->json('enquiry.id');

        // No job -> the drawer shows the gate, not the extraction panel.
        $this->api($this->pricing)
            ->getJson($this->url("/api/inbox/threads/{$id}"))
            ->assertJsonPath('thread.job', null);

        // "Confirmed" is not a status flag — it is the existence of a job.
        $this->api($this->pricing)
            ->postJson($this->url("/api/enquiries/{$enquiryId}/convert"), [])
            ->assertStatus(201);

        $this->api($this->pricing)
            ->getJson($this->url("/api/inbox/threads/{$id}"))
            ->assertJsonPath('thread.job.execution_job_no', fn ($no) => filled($no))
            ->assertJsonPath('thread.enquiry.status', 'converted');
    }

    /**
     * The other half of the gate. A loss is a DECLARATION with a reason — the reason is
     * the whole point of recording it, so the API requires one and the drawer asks.
     */
    public function test_a_lost_enquiry_carries_its_reason_onto_the_thread(): void
    {
        $id = $this->thread();

        $enquiryId = $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'customer_enquiry'])
            ->json('enquiry.id');

        // No reason, no loss: the funnel would record a loss it cannot explain.
        $this->api($this->pricing)
            ->postJson($this->url("/api/enquiries/{$enquiryId}/lost"), [])
            ->assertStatus(422);

        $this->api($this->pricing)
            ->postJson($this->url("/api/enquiries/{$enquiryId}/lost"), ['lost_reason' => 'rates_high'])
            ->assertStatus(200);

        // The drawer says WHY it is lost, not merely that it is — so lost_reason must ride along.
        $this->api($this->pricing)
            ->getJson($this->url("/api/inbox/threads/{$id}"))
            ->assertJsonPath('thread.enquiry.status', 'lost')
            ->assertJsonPath('thread.enquiry.lost_reason', 'rates_high')
            ->assertJsonPath('thread.job', null);

        // Stamped by EnquiryObserver, not the controller — the controller never sets it.
        $this->assertNotNull(Enquiry::find($enquiryId)->lost_at);

        // Reopening keeps the ORIGINAL number: it was already quoted to a client.
        $before = Enquiry::find($enquiryId)->enquiry_no;
        $this->api($this->pricing)
            ->postJson($this->url("/api/enquiries/{$enquiryId}/reopen"), [])
            ->assertStatus(200);

        $after = Enquiry::find($enquiryId)->fresh();
        $this->assertSame($before, $after->enquiry_no);
        // 🔴 The loss must be UNWOUND, not merely overwritten by the new status. A revived
        // enquiry that keeps lost_at sits in the open funnel and counts as a loss at the
        // same time. This is what caught EnquiryObserver comparing a CAST original
        // against a raw string, which had made the whole reopen branch dead code.
        $this->assertNull($after->lost_at);
        $this->assertNull($after->lost_reason);
        $this->assertNotNull($after->reopened_at);
    }

    /**
     * 🔴 CLAIMING AN ENQUIRY IS A PRICING ACT. The inbox claim means "I have taken this
     * enquiry over" while the shipment is still in the enquiry phase — there is nothing
     * for an operator to execute yet — so the claimer becomes the job's `pricing_id`.
     *
     * ⚠️ `ops_id` is a SEPARATE decision, made at confirmation from the operator
     * dropdown, and NULL is a real answer: pricing may run the shipment themselves.
     */
    public function test_confirming_keeps_the_person_who_claimed_the_thread(): void
    {
        $id = $this->thread();

        $enquiryId = $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'customer_enquiry'])
            ->json('enquiry.id');

        $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/claim"), [])
            ->assertOk();

        $job = $this->api($this->pricing)
            ->postJson($this->url("/api/enquiries/{$enquiryId}/convert"), [])
            ->assertStatus(201)
            ->json('job');

        $this->assertSame($this->pricing->id, $job['pricing_id'], 'the claim was dropped at conversion');

        // ⚠️ Read back from the DATABASE, not the create response: an attribute that was
        // never set is simply absent from the fresh model, so asserting on the payload
        // would be asserting that the key is missing rather than that nobody owns it.
        $this->assertNull(
            \App\Job::withoutGlobalScopes()->find($job['id'])->ops_id,
            'nobody was picked, so no operator owns it yet'
        );
    }

    /**
     * Confirmation is also where the shipment is handed to an operator, with a clearance
     * date — the two facts the OLI dropdown exists to inform.
     */
    public function test_confirming_can_assign_an_operator_and_a_clearance_date(): void
    {
        $id = $this->thread();

        $enquiryId = $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'customer_enquiry'])
            ->json('enquiry.id');

        $this->api($this->pricing)->postJson($this->url("/api/inbox/threads/{$id}/claim"), [])->assertOk();

        $ops = \App\User::create([
            'name' => 'Ops', 'email' => 'ops-' . substr(uniqid('', false), -8) . '@test.local',
            'password' => \Illuminate\Support\Facades\Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);

        $job = $this->api($this->pricing)
            ->postJson($this->url("/api/enquiries/{$enquiryId}/convert"), [
                'ops_id' => $ops->id,
                'planned_clearance_date' => '2026-09-05',
            ])
            ->assertStatus(201)->json('job');

        // Two different people, which is the point: pricing owns the enquiry, operations
        // executes the shipment.
        $this->assertSame($this->pricing->id, $job['pricing_id']);
        $this->assertSame($ops->id, $job['ops_id']);
        $this->assertStringStartsWith('2026-09-05', $job['planned_clearance_date']);
    }

    /**
     * 🔴 THE WHOLE LADDER, in the order a shipment earns the rungs:
     *
     *     claimed in the inbox  →  enquiry_no
     *     confirmed in the workspace  →  execution_job_no
     *     waybill raised  →  awb_number, and air_way_bills.job_id pointing back
     *
     * Each rung is covered on its own elsewhere. This asserts they are ONE chain — the
     * property that actually matters to an operator, and the one that breaks silently
     * because every individual step still passes.
     */
    public function test_the_identifiers_form_one_chain_from_enquiry_to_waybill(): void
    {
        $id = $this->thread();

        $enquiry = $this->api($this->pricing)
            ->postJson($this->url("/api/inbox/threads/{$id}/classify"), ['classification' => 'customer_enquiry'])
            ->json('enquiry');

        $this->assertStringStartsWith('ENQA-', $enquiry['enquiry_no']);

        $this->api($this->pricing)->postJson($this->url("/api/inbox/threads/{$id}/claim"), [])->assertOk();

        $job = $this->api($this->pricing)
            ->postJson($this->url("/api/enquiries/{$enquiry['id']}/convert"), [])
            ->assertStatus(201)->json('job');

        $this->assertStringStartsWith('JOBA-', $job['execution_job_no']);
        $this->assertSame($enquiry['id'], $job['enquiry_id'], 'the job lost its enquiry');
        $this->assertSame($this->pricing->id, $job['pricing_id'], 'the claim was dropped');

        // The waybill, raised against the number the shipment now carries.
        $canonical = '176-10000008';
        \App\Job::withoutGlobalScopes()->where('id', $job['id'])->update(['awb_number' => $canonical]);

        $awbKey = (int) str_replace('-', '', $canonical);
        \Illuminate\Support\Facades\DB::table('air_way_bills')->insert([
            'id' => $awbKey, 'agent_id' => $this->branch->id,
            'awb_code' => '176', 'awb_no' => '10000008',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $linkedTo = app(\App\Services\AwbJobLinker::class)->link($awbKey);

        // 🔴 The last rung closes the loop: the DOCUMENT half points back at the
        // OPERATIONAL half. Without this the two are a shared string, not a link.
        $this->assertSame($job['id'], $linkedTo);
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
