<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\EmailThread;
use App\Enums\JobStatus;
use App\Job;
use App\Services\ClientNotificationService;
use App\Services\Mail\MessageIngestor;
use App\Services\Mail\NormalisedMessage;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Automated client updates, approved by a person (user, 2026-09-16): claimed, shipment confirmed, draft AWB ready,
 * booked with the airline, departed, delivered — and the claim that comes from the first reply.
 */
class ClientUpdatesTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $pricing;
    private int $connectionId;
    private array $sent = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Update Co', 'code' => 'UPD', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->pricing = $this->user('pricing');

        $this->connectionId = DB::table('mailbox_connections')->insertGetId([
            'agent_id' => $this->branch->id, 'user_id' => $this->pricing->id, 'email_address' => 'desk-upd-' . uniqid('', true) . '@test.local',
            'provider' => 'outlook', 'is_active' => 1, 'auth_state' => 'connected', 'created_at' => now(), 'updated_at' => now(),
        ]);

        // Graph: a plain reply, or a draft with an attachment. Every call is kept to look at.
        Http::fake(function ($request) {
            $this->sent[] = $request;

            return str_contains($request->url(), '/createReply')
                ? Http::response(['id' => 'draft-1', 'body' => ['content' => '<html><body></body></html>']], 201)
                : Http::response(['id' => 'x'], 202);
        });
    }

    private function user(string $designation, string $suffix = ''): User
    {
        return User::create([
            'name' => ucfirst($designation) . $suffix, 'email' => "{$designation}{$suffix}-upd@test.local", 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id, 'designation' => $designation, 'is_active' => 1,
        ]);
    }

    private function api(User $as): self
    {
        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($as), 'Accept' => 'application/json']);

        return $this;
    }

    private function url(string $path): string
    {
        return "http://focusair.localhost{$path}";
    }

    /** A client enquiry conversation, with its enquiry. */
    private function thread(array $overrides = []): EmailThread
    {
        $enquiryId = DB::table('enquiries')->insertGetId([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'new', 'origin_code' => 'BOM', 'dest_code' => 'FRA',
            'extracted_pieces' => 4, 'extracted_weight' => 120.5, 'enquiry_no' => 'ENQA-UPD-26-' . random_int(1000, 9999),
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $key = 'thr_' . uniqid('', true);

        $id = DB::table('email_threads')->insertGetId(array_merge([
            'agent_id' => $this->branch->id, 'thread_key' => $key, 'status' => 'triaged', 'classification' => 'customer_enquiry',
            'enquiry_id' => $enquiryId, 'latest_message_received_at' => now()->subHour(), 'created_at' => now(), 'updated_at' => now(),
        ], $overrides));

        DB::table('email_messages')->insert([
            'agent_id' => $this->branch->id, 'mailbox_connection_id' => $this->connectionId, 'thread_key' => $key, 'direction' => 'inbound',
            'message_id' => '<' . uniqid('', true) . '@client.test>', 'provider_message_id' => 'graph-' . uniqid('', false),
            'provider_thread_id' => null, 'from' => 'ops@client.test', 'to' => 'desk@test.local', 'subject' => 'Rates BOM-FRA',
            'received_at' => now()->subHour(), 'created_at' => now(), 'updated_at' => now(),
        ]);

        return EmailThread::withoutGlobalScopes()->find($id);
    }

    private function jobFor(EmailThread $thread, array $attributes = []): Job
    {
        return Job::create($attributes + [
            'agent_id' => $this->branch->id, 'enquiry_id' => $thread->enquiry_id, 'transport_mode' => 'air', 'pricing_id' => $this->pricing->id,
            'execution_job_no' => 'JOBA-UPD-26-' . random_int(1000, 9999),
        ]);
    }

    private function pending(EmailThread $thread): ?array
    {
        return $thread->fresh()->pending_client_notification;
    }

    /** What the reply to the client said. */
    private function mailed(): string
    {
        return collect($this->sent)->map(fn ($r) => json_encode($r->data()))->implode(' ');
    }

    /** 🔴 Claiming shows the acknowledgement first; it goes as the person edited it, and is offered once. */
    public function test_claiming_shows_the_acknowledgement_and_sends_it_as_edited(): void
    {
        $thread = $this->thread();

        $draft = $this->api($this->pricing)->getJson($this->url("/api/inbox/threads/{$thread->id}/client-update/preview?stage=claimed"))
            ->assertOk()->json('draft');
        $this->assertSame([['ops@client.test'], 'Re: Rates BOM-FRA'], [$draft['to'], $draft['subject']]);
        $this->assertStringContainsString('Thank you for your enquiry', $draft['body']);

        $this->api($this->pricing)->postJson($this->url("/api/inbox/threads/{$thread->id}/claim"), [
            'client_update' => ['decision' => 'send', 'body' => "Hello,\n\nThanks — Priya here, rates by noon."],
        ])->assertOk()->assertJsonPath('assigned_ops.id', $this->pricing->id)->assertJsonPath('client_update_result.ok', true);

        $this->assertStringContainsString('rates by noon', $this->mailed());
        $this->assertSame('sent', $thread->fresh()->client_updates['claimed']['decision']);
        $this->api($this->pricing)->getJson($this->url("/api/inbox/threads/{$thread->id}/client-update/preview?stage=claimed"))
            ->assertJsonPath('draft', null);
    }

    public function test_claiming_without_the_email_sends_nothing(): void
    {
        $thread = $this->thread();

        $this->api($this->pricing)->postJson($this->url("/api/inbox/threads/{$thread->id}/claim"), ['client_update' => ['decision' => 'skip']])
            ->assertOk();

        $this->assertSame([], $this->sent);
        $this->assertSame('skipped', $thread->fresh()->client_updates['claimed']['decision']);
    }

    /**
     * 🔴 Confirming prepares "shipment confirmed" as a card on the conversation and a pinned bell for the owner.
     * Nothing goes until they send it; the job number never appears.
     */
    public function test_confirming_prepares_an_update_that_waits_for_the_owner(): void
    {
        $thread = $this->thread(['assigned_ops_id' => $this->pricing->id]);
        $job = $this->jobFor($thread);

        $draft = $this->pending($thread);
        $this->assertSame('confirmed', $draft['stage']);
        $this->assertStringContainsString('from BOM to FRA (4 pcs, 120.5 kg)', $draft['body']);
        $this->assertStringNotContainsString($job->execution_job_no, $draft['body'] . $draft['subject']);
        $this->assertSame([], $this->sent);

        $bell = DB::table('notifications')->where('type', ClientNotificationService::BELL_TYPE)->where('notifiable_id', $this->pricing->id)->first();
        $this->assertSame($thread->id, json_decode($bell->data, true)['thread_id']);

        $this->api($this->pricing)->postJson($this->url("/api/inbox/threads/{$thread->id}/client-update"), ['stage' => 'confirmed', 'decision' => 'send'])
            ->assertOk()->assertJsonPath('client_update', null);

        $this->assertStringContainsString('Thank you for confirming', $this->mailed());
        $this->assertSame(0, DB::table('notifications')->where('type', ClientNotificationService::BELL_TYPE)->count());

        // Sent once: a second send finds nothing waiting.
        $this->api($this->pricing)->postJson($this->url("/api/inbox/threads/{$thread->id}/client-update"), ['stage' => 'confirmed', 'decision' => 'send'])
            ->assertStatus(409);
    }

    /** A newer moment replaces a draft nobody sent, and each moment is prepared once. */
    public function test_later_moments_replace_an_unsent_draft_and_come_once(): void
    {
        $thread = $this->thread(['assigned_ops_id' => $this->pricing->id]);
        $job = $this->jobFor($thread, ['awb_number' => '176-10000008']);

        $job->update(['status' => JobStatus::PdfGenerated]);
        $this->assertSame('draft_awb', $this->pending($thread)['stage']);
        $this->assertStringContainsString(ClientNotificationService::REVIEW_LINK, $this->pending($thread)['body']);

        $job->update(['status' => JobStatus::SentToAirline]);
        $this->assertSame('booked', $this->pending($thread)['stage']);
        $this->assertSame('superseded', $thread->fresh()->client_updates['draft_awb']['decision']);

        $this->api($this->pricing)->postJson($this->url("/api/inbox/threads/{$thread->id}/client-update"), ['stage' => 'booked', 'decision' => 'skip'])
            ->assertOk();
        $job->update(['status' => JobStatus::AirlineConfirmed]);
        $this->assertNull($this->pending($thread), 'booked was already dealt with');
    }

    /** 🔴 The secure review link is made only when the draft AWB mail is sent, and asks the client to approve. */
    public function test_the_review_link_is_made_when_the_draft_awb_mail_is_sent(): void
    {
        Storage::fake();
        Storage::put('documents/awb/1.pdf', '%PDF-1.4 awb');
        $thread = $this->thread(['assigned_ops_id' => $this->pricing->id]);
        $job = $this->jobFor($thread, ['awb_number' => '176-10000008']);
        \App\JobDocument::create(['agent_id' => $this->branch->id, 'job_id' => $job->id, 'document_type' => 'awb',
            'file_name' => 'AWB-176-10000008.pdf', 'file_path' => 'documents/awb/1.pdf', 'mime_type' => 'application/pdf', 'file_size' => 12]);
        $job->update(['status' => JobStatus::PdfGenerated]);

        $this->assertSame(0, DB::table('document_share_links')->where('job_id', $job->id)->count());

        $this->api($this->pricing)->postJson($this->url("/api/inbox/threads/{$thread->id}/client-update"), ['stage' => 'draft_awb', 'decision' => 'send'])
            ->assertOk();

        $this->assertSame(1, (int) DB::table('document_share_links')->where('job_id', $job->id)->value('requires_approval'));
        $this->assertStringContainsString('\/api\/d\/', $this->mailed());
        $this->assertStringNotContainsString(ClientNotificationService::REVIEW_LINK, $this->mailed());
    }

    /** The airline's cargo status prepares departed and delivered; a completed job without an AWB prepares nothing. */
    public function test_the_airlines_cargo_status_prepares_departed_and_delivered(): void
    {
        $thread = $this->thread(['assigned_ops_id' => $this->pricing->id]);
        $job = $this->jobFor($thread, ['awb_number' => '176-10000008']);
        DB::table('email_threads')->where('id', $thread->id)->update(['pending_client_notification' => null]);

        $status = fn (string $code) => $this->call('POST', 'http://localhost/api/gln-response', [], [], [], ['CONTENT_TYPE' => 'application/xml'],
            '<rsm:Response xmlns:rsm="iata:response:3" xmlns:ram="iata:datamodel:3"><rsm:MessageHeaderDocument><ram:ID>m1</ram:ID>'
            . '<ram:Name>Cargo Status</ram:Name></rsm:MessageHeaderDocument><rsm:BusinessHeaderDocument><ram:ID>17610000008' . $code
            . '</ram:ID></rsm:BusinessHeaderDocument></rsm:Response>')->assertOk();

        $status('DEP');
        $this->assertSame('departed', $this->pending($thread)['stage']);
        $this->assertStringContainsString('AWB 176-10000008 has departed from BOM', $this->pending($thread)['body']);

        $status('DLV');
        $this->assertSame('delivered', $this->pending($thread)['stage']);

        // 🔒 With a token configured, a post without it changes nothing.
        config(['services.gln.token' => 'gln-secret']);
        $this->call('POST', 'http://localhost/api/gln-response', [], [], [], ['CONTENT_TYPE' => 'application/xml'], '<x/>')->assertForbidden();

        $other = $this->thread();
        $this->jobFor($other)->update(['status' => JobStatus::Completed]);
        $this->assertSame('confirmed', $this->pending($other)['stage'], 'no AWB, so no delivered mail');
    }

    /** 🔴 A first reply typed in Outlook claims the conversation for the pricing member who sent it. */
    public function test_a_reply_sent_from_outlook_claims_for_the_pricing_sender(): void
    {
        $thread = $this->thread();
        $connection = \App\MailboxConnection::find($this->connectionId);
        $reply = fn (string $from, EmailThread $t) => app(MessageIngestor::class)->ingest($connection, [new NormalisedMessage(
            messageId: '<out-' . uniqid('', false) . '@test.local>', threadId: null, from: $from, to: ['ops@client.test'], cc: [], bcc: [],
            subject: 'Re: Rates BOM-FRA', snippet: 'Received, rates to follow.', receivedAt: now(), direction: 'outbound',
            references: [DB::table('email_messages')->where('thread_key', $t->thread_key)->value('message_id')],
        )]);

        $reply($this->pricing->email, $thread);
        $fresh = $thread->fresh();
        $this->assertSame([$this->pricing->id, 'replied'], [$fresh->assigned_ops_id, $fresh->client_updates['claimed']['decision']]);

        // An address that is not a pricing member of the branch claims nothing.
        $other = $this->thread();
        $reply($this->user('operations')->email, $other);
        $this->assertNull($other->fresh()->assigned_ops_id);
    }
}
