<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\EmailThread;
use App\MailboxConnection;
use App\Services\Mail\MessageIngestor;
use App\Services\Mail\NormalisedMessage;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * What the first real mailbox showed (joseph@f16sefreight.com, 2026-09-17): a conversation the classifier had filed as a
 * customer enquiry could never get its enquiry number.
 */
class RealMailboxFixesTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $pricing;
    private MailboxConnection $mailbox;

    /** @var array{0: string, 1: string, 2: float} sender, intent and the confidence on both */
    private array $answer = ['outsider', 'nothing_for_us', 0.92];

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Real Co', 'code' => 'RLM', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->pricing = User::create(['name' => 'Joseph', 'email' => 'joseph@forwarder-rlm.test', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $this->mailbox = MailboxConnection::withoutGlobalScopes()->create(['agent_id' => $this->branch->id, 'user_id' => $this->pricing->id,
            'email_address' => 'joseph@forwarder-rlm.test', 'provider' => 'outlook', 'is_active' => 1, 'auth_state' => 'connected', 'backfill_status' => 'completed']);

        // The model is off across the suite (phpunit.xml): it is a paid endpoint on a real host.
        // Switched on here with a fake that answers from a table, so each mail's verdict is stated
        // in the test rather than fetched — what is under test is the chain around the answer.
        config(['mail_intent.enabled' => true, 'services.openrouter.key' => 'rlm-test-key']);

        // ⚠️ ONE fake, reading `$answer` when the request is made. Http::fake() APPENDS and the
        // FIRST matching stub wins, so re-faking per mail would silently keep answering with
        // whatever the first test line set up — which is how this test passed the wrong way once.
        Http::preventStrayRequests();
        Http::fake(function () {
            [$sender, $intent, $confidence] = $this->answer;

            return Http::response([
                'model' => 'typesafe/jev-1.13-20260917', 'provider' => 'TypeSafe',
                'answers' => [
                    'sender' => ['type' => 'choice', 'choice' => $sender,
                        'probabilities' => [$sender => $confidence, 'outsider' => 1 - $confidence], 'confidence' => $confidence],
                    'intent' => ['type' => 'choice', 'choice' => $intent,
                        'probabilities' => [$intent => $confidence, 'nothing_for_us' => 1 - $confidence], 'confidence' => $confidence],
                ],
                'usage' => ['input_tokens' => 1300, 'output_tokens' => 40, 'cost' => 0.000055],
            ]);
        });
    }

    /**
     * What the model answers for every mail from here on.
     *
     * ⚠️ Stated by the test rather than keyed on the body: the `state` the classifier sends is its
     * own business, and a fake that inspected it would fail the day the state gains a field.
     */
    private function modelAnswers(string $sender, string $intent, float $confidence = 0.92): void
    {
        $this->answer = [$sender, $intent, $confidence];
    }

    private function receive(string $from, string $snippet = '2 pallets, 480 kg'): EmailThread
    {
        $id = '<' . uniqid('', true) . '@rlm.test>';
        app(MessageIngestor::class)->ingest($this->mailbox, [new NormalisedMessage(
            messageId: $id, threadId: null, from: $from, to: [$this->mailbox->email_address], cc: [], bcc: [],
            subject: 'Rates BOM to FRA', snippet: $snippet, receivedAt: now(), direction: 'inbound',
        )]);

        return EmailThread::withoutGlobalScopes()->where('thread_key', \DB::table('email_messages')->where('message_id', $id)->value('thread_key'))->first();
    }

    /**
     * Nothing else matching, the MODEL decides — and what it says is what the thread is filed as.
     *
     * 🔴 This used to read "a mail whose cargo figures the patterns read with high confidence is a
     * customer enquiry" (user, 2026-09-17 — the real "Ex BLR RMG 400/18 tons JFK" mail). That rule is
     * gone with the regex: high-confidence cargo was a proxy for "somebody is asking us to move
     * something", and it fired on every airline notice that quoted a weight. The figures are still
     * read and still staged; they no longer decide the folder.
     */
    public function test_the_model_decides_when_nothing_else_has(): void
    {
        $shipment = "Dear Sir,\nPlease share the confirmed booking schedule\nAgreed rate 350++\nPcs 400\nGross wgt 17400kgs\nCh wt 18000 kgs";

        $this->modelAnswers('client', 'wants_a_price');
        $enquiry = $this->receive('deepanjan@unknown-rlm.test', $shipment);
        $this->assertSame('customer_enquiry', $enquiry->classification);
        $this->assertSame('model', $enquiry->auto_classification_source);
        // The cargo regexes still ran: the figures are staged for the operator to confirm.
        $this->assertStringContainsString('17400', (string) $enquiry->staged_cargo);

        $this->modelAnswers('outsider', 'nothing_for_us');
        $this->assertSame('other', $this->receive('news@unknown-rlm.test', 'Join our webinar next week')->classification);

        // Below the confidence floor the answer is not acted on, however plausible the choice.
        $this->modelAnswers('client', 'wants_a_price', 0.05);
        $unsure = $this->receive('someone@unknown-rlm.test', 'about 480 kg');
        $this->assertSame('other', $unsure->classification, 'a coin toss is not a filing');
        $this->assertSame('model', $unsure->auto_classification_source);
    }

    public function test_claiming_or_choosing_customer_enquiry_again_creates_the_enquiry(): void
    {
        $api = $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->pricing), 'Accept' => 'application/json']);

        // A known client's mail is filed as an enquiry; an unknown sender's goes to Other (user, 2026-09-17).
        \App\Customer::create(['company_id' => $this->branch->company_id, 'name' => 'Globex', 'email_domain' => 'globex.test']);
        $claimed = $this->receive('buyer@globex.test');
        $this->assertSame('customer_enquiry', $claimed->classification);
        // 🔴 The CLIENT decided it, not the model: a domain we already invoice is a fact and is
        // checked first. The model was never asked, which is also why a settled mailbox is cheap.
        $this->assertSame('client', $claimed->auto_classification_source);
        $api->postJson("http://focusair.localhost/api/inbox/threads/{$claimed->id}/claim")->assertOk();
        $this->assertNotNull($claimed->fresh()->enquiry_id);
        // The pricing member who claims it owns the enquiry, not only the conversation.
        $this->assertSame($this->pricing->id, (int) \App\Enquiry::withoutGlobalScopes()->find($claimed->fresh()->enquiry_id)->pricing_id);
        $this->assertSame($this->pricing->id, (int) $claimed->fresh()->assigned_ops_id);

        $this->modelAnswers('outsider', 'nothing_for_us');
        $filed = $this->receive('ops@initech.test', 'Can we talk tomorrow?');
        $this->assertSame('other', $filed->classification, 'nothing matched: Other');
        $api->postJson("http://focusair.localhost/api/inbox/threads/{$filed->id}/classify", ['classification' => 'customer_enquiry'])
            ->assertOk()->assertJsonPath('enquiry.status', 'new');
        $this->assertNotNull($filed->fresh()->enquiry_id);
    }
}
