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
 * Microsoft Graph mailbox ingestion — guide §4.2.
 *
 * 🟢 **Graph ships before Gmail because of what each provider demands.** Google's `gmail.*`
 * scopes are restricted and need a third-party CASA audit with annual recertification
 * (GAPS #15); Microsoft needs only the tenant admin's consent.
 *
 * ⚠️ Graph is FAKED here, and that is the right level. What these tests are for is the
 * provider-agnostic half — thread matching, echo suppression, the SLA clock, cursor
 * persistence — which is exactly the machinery that must survive Gmail arriving later.
 * Hitting the real API would test Microsoft's uptime, not our rules.
 */
class MailboxSyncTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private MailboxConnection $mailbox;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('services.graph.client_id', 'test-client');
        config()->set('services.graph.client_secret', 'test-secret');
        config()->set('services.graph.redirect', 'http://accounts.localhost/api/user/mailboxes/callback');

        $company = Company::create(['name' => 'Mail Co', 'code' => 'MBX', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);

        $user = User::create([
            'name' => 'Ops', 'email' => 'ops-mbx@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);

        $this->mailbox = MailboxConnection::withoutGlobalScopes()->create([
            'agent_id' => $this->branch->id, 'user_id' => $user->id,
            'email_address' => 'ops@f16s.test', 'provider' => 'outlook',
            'access_token' => 'valid-token', 'refresh_token' => 'refresh-token',
            'expires_at' => now()->addHour(), 'auth_state' => 'connected', 'is_active' => true,
        ]);

        $this->installFake();
    }

    /**
     * The next Graph delta page, and the next token response.
     *
     * 🔴 **ONE `Http::fake()` FOR THE WHOLE TEST, reading mutable state.** `Http::fake()`
     * ACCUMULATES stubs and the FIRST matching one wins — so calling it a second time in
     * one test does not replace the first, it is silently ignored and the original page is
     * replayed. That cost an hour: the second message came back with the first's
     * `message_id`, was correctly suppressed as an echo, and the failure read exactly like
     * a thread-merge bug in `ThreadMatcher`.
     */
    private array $nextDelta = ['value' => [], '@odata.deltaLink' => 'https://graph.microsoft.com/v1.0/me/messages/delta?$deltatoken=NEXT'];

    private ?array $nextToken = null;

    private int $graphStatus = 200;

    private function installFake(): void
    {
        Http::fake(function ($request) {
            if (str_contains($request->url(), 'login.microsoftonline.com')) {
                return Http::response($this->nextToken ?? [
                    'access_token' => 'fresh-token', 'refresh_token' => 'new-refresh', 'expires_in' => 3600,
                ], 200);
            }

            if ($this->graphStatus !== 200) {
                return Http::response('upstream exploded', $this->graphStatus);
            }

            return Http::response($this->nextDelta, 200);
        });
    }

    /** One Graph delta page. */
    private function fakeDelta(array $messages, ?string $deltaLink = 'https://graph.microsoft.com/v1.0/me/messages/delta?$deltatoken=NEXT'): void
    {
        $this->nextDelta = ['value' => $messages, '@odata.deltaLink' => $deltaLink];
    }

    /**
     * ⚠️ A COUNTER, not `uniqid()`. `uniqid()` is microtime-based and returns the SAME
     * value when called twice inside one microsecond — which two fixture messages built
     * back to back reliably do. The duplicate `message_id` was then correctly suppressed
     * as an echo, and the test failed reporting a thread-merge bug that did not exist.
     */
    private static int $seq = 0;

    private function graphMessage(array $overrides = []): array
    {
        $n = ++self::$seq;

        return array_merge([
            'id' => "AAMk{$n}",
            'internetMessageId' => "<msg-{$n}@client.test>",
            'conversationId' => "conv-{$n}",
            'subject' => 'Quote request BOM to HAM',
            'from' => ['emailAddress' => ['address' => 'buyer@client.test']],
            'toRecipients' => [['emailAddress' => ['address' => 'ops@f16s.test']]],
            'receivedDateTime' => now()->toIso8601String(),
            'bodyPreview' => '2 pallets, 480kg, ready Friday.',
            'hasAttachments' => false,
            'internetMessageHeaders' => [],
        ], $overrides);
    }

    private function sync(): array
    {
        return app(MailboxSyncService::class)->sync($this->mailbox->fresh());
    }

    // ─── Ingestion ───────────────────────────────────────────────────────────

    public function test_a_delta_page_creates_a_thread_and_a_message(): void
    {
        $this->fakeDelta([$this->graphMessage()]);

        $result = $this->sync();

        $this->assertTrue($result['ok'], $result['error'] ?? '');
        $this->assertSame(1, $result['ingested']);
        $this->assertSame(1, $result['threads_created']);
        $this->assertSame(1, DB::table('email_threads')->where('agent_id', $this->branch->id)->count());
    }

    /**
     * 🔴 CC SURVIVES THE WHOLE PIPELINE. It has to be asked for in the Graph `$select`,
     * carried on `NormalisedMessage`, and written to a column that exists — and it was
     * missing at all three layers, which is why reply-all could not be built.
     *
     * ⚠️ Asserted end to end rather than per layer: each one silently degrades to an
     * empty list, so a unit test on any single layer passes while the chain drops it.
     */
    public function test_cc_survives_from_the_provider_to_the_database(): void
    {
        $this->fakeDelta([$this->graphMessage([
            'ccRecipients' => [
                ['emailAddress' => ['address' => 'Broker@Client.test']],
                ['emailAddress' => ['address' => 'desk@airline.test']],
            ],
        ])]);

        $this->sync();

        $row = DB::table('email_messages')->where('agent_id', $this->branch->id)->first();

        // Lower-cased and comma-joined, in the order they were sent.
        $this->assertSame('broker@client.test, desk@airline.test', $row->cc);

        // ⚠️ A message with no CC stores NULL, not an empty string — "nobody was copied"
        // and "we did not capture it" must not look identical to whatever reads this next.
        $this->fakeDelta([$this->graphMessage(['id' => 'm-2', 'internetMessageId' => '<m-2@test>'])]);
        $this->sync();

        $plain = DB::table('email_messages')->where('message_id', '<m-2@test>')->first();
        $this->assertNull($plain->cc);
    }

    /**
     * `to` was varchar(255) holding a comma-joined list. Six addresses at ~30 characters
     * each already reached the ceiling, and past it MySQL truncates or errors depending
     * on strict mode — losing who was on the conversation.
     */
    public function test_a_long_recipient_list_is_not_truncated(): void
    {
        $many = array_map(
            fn ($i) => ['emailAddress' => ['address' => "recipient-{$i}@averylongclientdomain.test"]],
            range(1, 12)
        );

        $this->fakeDelta([$this->graphMessage(['toRecipients' => $many])]);
        $this->sync();

        $row = DB::table('email_messages')->where('agent_id', $this->branch->id)->first();

        $this->assertCount(12, explode(', ', $row->to));
        $this->assertGreaterThan(255, strlen($row->to), 'the fixture must exceed the old limit to prove anything');
    }

    /**
     * 🔴 Ingestion never classifies and never mints an enquiry. PRD §5.2.3: regex stages,
     * the OPERATOR mints — auto-minting here inflates the conversion denominator with
     * conversations nobody ever treated as an enquiry.
     */
    public function test_ingestion_does_not_classify_or_mint_an_enquiry(): void
    {
        $this->fakeDelta([$this->graphMessage()]);
        $this->sync();

        $thread = DB::table('email_threads')->where('agent_id', $this->branch->id)->first();

        $this->assertSame('unclassified', $thread->classification);
        $this->assertNull($thread->enquiry_id);
    }

    // ─── Echo suppression ────────────────────────────────────────────────────

    /**
     * 🔴 THE SAME MESSAGE TWICE IS ONE ROW. A message sent through the portal lands in Sent
     * Items and returns on the next sync; without the UNIQUE upsert every reply we send
     * duplicates itself.
     */
    public function test_the_same_message_id_is_ingested_once(): void
    {
        $message = $this->graphMessage();

        $this->fakeDelta([$message]);
        $this->sync();

        $this->fakeDelta([$message]);
        $second = $this->sync();

        $this->assertSame(0, $second['ingested']);
        $this->assertSame(1, $second['echoes']);
        $this->assertSame(1, DB::table('email_messages')
            ->where('message_id', $message['internetMessageId'])->count());
    }

    /**
     * 🔴 AND THE ECHO MUST NOT MOVE THE CLOCK. Re-reading our own sent reply must not look
     * like the client chasing us again — that would reset the staleness signal and make
     * every answered thread appear freshly unanswered.
     */
    public function test_an_echo_does_not_move_the_thread_clock(): void
    {
        $message = $this->graphMessage(['receivedDateTime' => now()->subDays(3)->toIso8601String()]);

        $this->fakeDelta([$message]);
        $this->sync();

        $before = DB::table('email_threads')->where('agent_id', $this->branch->id)
            ->value('latest_message_received_at');

        $this->fakeDelta([$message]);
        $this->sync();

        $this->assertSame($before, DB::table('email_threads')
            ->where('agent_id', $this->branch->id)->value('latest_message_received_at'));
    }

    // ─── Thread matching, three tiers ────────────────────────────────────────

    /** Tier 1 — the provider already decided the grouping. */
    public function test_a_shared_conversation_id_joins_the_same_thread(): void
    {
        $conversation = 'conv-shared';

        $this->fakeDelta([
            $this->graphMessage(['conversationId' => $conversation, 'subject' => 'Quote request']),
            $this->graphMessage(['conversationId' => $conversation, 'subject' => 'Totally different subject']),
        ]);

        $this->sync();

        $this->assertSame(1, DB::table('email_threads')->where('agent_id', $this->branch->id)->count(),
            'A shared conversationId must produce ONE thread whatever the subjects say.');
    }

    /** Tier 2 — the RFC 5322 reply chain, which survives a cross-provider reply. */
    public function test_a_reply_chain_joins_the_same_thread_without_a_conversation_id(): void
    {
        $first = $this->graphMessage(['conversationId' => 'conv-a', 'subject' => 'Rates please']);

        $this->fakeDelta([$first]);
        $this->sync();

        $reply = $this->graphMessage([
            'conversationId' => 'conv-b', // a different provider grouping
            'subject' => 'Something unrelated',
            'internetMessageHeaders' => [
                ['name' => 'In-Reply-To', 'value' => $first['internetMessageId']],
            ],
        ]);

        $this->fakeDelta([$reply]);
        $this->sync();

        $this->assertSame(1, DB::table('email_threads')->where('agent_id', $this->branch->id)->count());
    }

    /**
     * 🔴 TIER 3 MUST NEVER OVERRIDE TIERS 1–2. Freight subjects are formulaic — half an
     * inbox is "Quote request" — so a heuristic that outranked the provider's own grouping
     * would merge two separate enquiries from one client, and one of them would stop
     * existing as an enquiry at all.
     */
    public function test_an_identical_subject_does_not_merge_distinct_conversations(): void
    {
        $this->fakeDelta([
            $this->graphMessage([
                'conversationId' => 'conv-1', 'subject' => 'Quote request',
                'from' => ['emailAddress' => ['address' => 'a@client.test']],
            ]),
        ]);
        $this->sync();

        $this->fakeDelta([
            $this->graphMessage([
                'conversationId' => 'conv-2', 'subject' => 'Quote request',
                'from' => ['emailAddress' => ['address' => 'b@other.test']],
            ]),
        ]);
        $this->sync();

        $this->assertSame(2, DB::table('email_threads')->where('agent_id', $this->branch->id)->count(),
            'Two clients sharing a subject were merged into one thread.');
    }

    // ─── Direction and the SLA clock ─────────────────────────────────────────

    /**
     * 🟢 THE RETROACTIVE FILL. A reply typed in Outlook never touches the Inbox, so an
     * inbox-scoped sync would lose it — and with it every measurement of response latency.
     * Syncing the whole mailbox makes `first_response_at` fill itself.
     */
    public function test_a_reply_sent_from_outlook_fills_first_response_at(): void
    {
        $inbound = $this->graphMessage([
            'conversationId' => 'conv-x',
            'receivedDateTime' => now()->subHours(5)->toIso8601String(),
        ]);

        $outbound = $this->graphMessage([
            'conversationId' => 'conv-x',
            'from' => ['emailAddress' => ['address' => 'ops@f16s.test']],
            'toRecipients' => [['emailAddress' => ['address' => 'buyer@client.test']]],
            'receivedDateTime' => now()->subHours(2)->toIso8601String(),
        ]);

        $this->fakeDelta([$inbound, $outbound]);
        $this->sync();

        $thread = DB::table('email_threads')->where('agent_id', $this->branch->id)->first();

        $this->assertNotNull($thread->first_response_at,
            'An operator reply typed in Outlook did not register as a response.');

        $this->assertSame('outbound', DB::table('email_messages')
            ->where('message_id', $outbound['internetMessageId'])->value('direction'),
            'Direction comes from WHO SENT IT, not which folder it was in.');
    }

    /** ⚠️ An outbound reply must not move `latest_message_received_at`. */
    public function test_an_outbound_reply_does_not_reset_the_staleness_clock(): void
    {
        $inbound = $this->graphMessage([
            'conversationId' => 'conv-y',
            'receivedDateTime' => now()->subDays(4)->toIso8601String(),
        ]);

        $this->fakeDelta([$inbound]);
        $this->sync();

        $before = DB::table('email_threads')->where('agent_id', $this->branch->id)
            ->value('latest_message_received_at');

        $this->fakeDelta([$this->graphMessage([
            'conversationId' => 'conv-y',
            'from' => ['emailAddress' => ['address' => 'ops@f16s.test']],
            'receivedDateTime' => now()->toIso8601String(),
        ])]);
        $this->sync();

        $this->assertSame($before, DB::table('email_threads')
            ->where('agent_id', $this->branch->id)->value('latest_message_received_at'));
    }

    // ─── Cursors ─────────────────────────────────────────────────────────────

    /**
     * 🔴 ONLY A deltaLink BECOMES THE STANDING CURSOR. Storing a nextLink there would
     * replay the same page on every run and the mailbox would never advance.
     */
    public function test_only_the_delta_link_is_stored_as_the_sync_cursor(): void
    {
        $this->fakeDelta([$this->graphMessage()],
            'https://graph.microsoft.com/v1.0/me/messages/delta?$deltatoken=FINAL');

        $this->sync();

        $this->assertSame('https://graph.microsoft.com/v1.0/me/messages/delta?$deltatoken=FINAL',
            $this->mailbox->fresh()->sync_cursor);
        $this->assertNull($this->mailbox->fresh()->backfill_page_cursor);
        $this->assertNotNull($this->mailbox->fresh()->last_synced_at);
    }

    // ─── Tokens ──────────────────────────────────────────────────────────────

    /**
     * 🔴 A REFRESH RESPONSE WITHOUT A NEW REFRESH TOKEN MUST KEEP THE OLD ONE. Overwriting
     * it with NULL is how a mailbox silently stops syncing an hour after connecting, with
     * nothing in the logs until a 401 much later.
     */
    public function test_a_refresh_without_a_new_refresh_token_keeps_the_existing_one(): void
    {
        $this->mailbox->forceFill(['expires_at' => now()->subMinute()])->save();

        // No `refresh_token` in the response — the case that blanks it if mishandled.
        $this->nextToken = ['access_token' => 'fresh-token', 'expires_in' => 3600];
        $this->fakeDelta([]);

        $this->sync();

        $fresh = $this->mailbox->fresh();

        $this->assertSame('fresh-token', $fresh->access_token);
        $this->assertSame('refresh-token', $fresh->refresh_token, 'The refresh token was blanked.');
    }

    /** A mailbox with no refresh token is marked for re-auth rather than retried forever. */
    public function test_a_mailbox_with_no_refresh_token_is_marked_for_reauth(): void
    {
        $this->mailbox->forceFill(['expires_at' => now()->subMinute(), 'refresh_token' => null])->save();

        $result = $this->sync();

        $this->assertFalse($result['ok']);
        $this->assertSame('reauth_required', $this->mailbox->fresh()->auth_state);
    }

    /** ⚠️ One mailbox failing must not throw — the sweep has other tenants to serve. */
    public function test_a_provider_failure_is_reported_not_thrown(): void
    {
        $this->graphStatus = 503;

        $result = $this->sync();

        $this->assertFalse($result['ok']);
        $this->assertStringContainsString('503', $result['error']);
    }
}
