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

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Real Co', 'code' => 'RLM', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->pricing = User::create(['name' => 'Joseph', 'email' => 'joseph@forwarder-rlm.test', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $this->mailbox = MailboxConnection::withoutGlobalScopes()->create(['agent_id' => $this->branch->id, 'user_id' => $this->pricing->id,
            'email_address' => 'joseph@forwarder-rlm.test', 'provider' => 'outlook', 'is_active' => 1, 'auth_state' => 'connected', 'backfill_status' => 'completed']);
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
     * Nothing else matching, a mail whose cargo figures the patterns read with high confidence is a customer enquiry;
     * a low-confidence read is Other (user, 2026-09-17 — the real "Ex BLR RMG 400/18 tons JFK" mail).
     */
    public function test_confidently_read_cargo_files_a_customer_enquiry_and_a_guess_files_other(): void
    {
        $shipment = "Dear Sir,\nPlease share the confirmed booking schedule\nAgreed rate 350++\nPcs 400\nGross wgt 17400kgs\nCh wt 18000 kgs";
        $this->assertSame('customer_enquiry', $this->receive('deepanjan@unknown-rlm.test', $shipment)->classification);
        $this->assertSame('other', $this->receive('someone@unknown-rlm.test', 'about 480 kg')->classification, 'unlabelled weight: low confidence');
        $this->assertSame('other', $this->receive('news@unknown-rlm.test', 'Join our webinar next week')->classification);
    }

    public function test_claiming_or_choosing_customer_enquiry_again_creates_the_enquiry(): void
    {
        $api = $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->pricing), 'Accept' => 'application/json']);

        // A known client's mail is filed as an enquiry; an unknown sender's goes to Other (user, 2026-09-17).
        \App\Customer::create(['company_id' => $this->branch->company_id, 'name' => 'Globex', 'email_domain' => 'globex.test']);
        $claimed = $this->receive('buyer@globex.test');
        $this->assertSame('customer_enquiry', $claimed->classification);
        $api->postJson("http://focusair.localhost/api/inbox/threads/{$claimed->id}/claim")->assertOk();
        $this->assertNotNull($claimed->fresh()->enquiry_id);

        $filed = $this->receive('ops@initech.test', 'Can we talk tomorrow?');
        $this->assertSame('other', $filed->classification, 'nothing matched: Other');
        $api->postJson("http://focusair.localhost/api/inbox/threads/{$filed->id}/classify", ['classification' => 'customer_enquiry'])
            ->assertOk()->assertJsonPath('enquiry.status', 'new');
        $this->assertNotNull($filed->fresh()->enquiry_id);
    }
}
