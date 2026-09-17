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

    private function receive(string $from): EmailThread
    {
        $id = '<' . uniqid('', true) . '@rlm.test>';
        app(MessageIngestor::class)->ingest($this->mailbox, [new NormalisedMessage(
            messageId: $id, threadId: null, from: $from, to: [$this->mailbox->email_address], cc: [], bcc: [],
            subject: 'Rates BOM to FRA', snippet: '2 pallets, 480 kg', receivedAt: now(), direction: 'inbound',
        )]);

        return EmailThread::withoutGlobalScopes()->where('thread_key', \DB::table('email_messages')->where('message_id', $id)->value('thread_key'))->first();
    }

    public function test_claiming_or_choosing_customer_enquiry_again_creates_the_enquiry(): void
    {
        $api = $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->pricing), 'Accept' => 'application/json']);

        $claimed = $this->receive('buyer@globex.test');
        $api->postJson("http://focusair.localhost/api/inbox/threads/{$claimed->id}/claim")->assertOk();
        $this->assertNotNull($claimed->fresh()->enquiry_id);

        $filed = $this->receive('ops@initech.test');
        $api->postJson("http://focusair.localhost/api/inbox/threads/{$filed->id}/classify", ['classification' => 'customer_enquiry'])
            ->assertOk()->assertJsonPath('enquiry.status', 'new');
        $this->assertNotNull($filed->fresh()->enquiry_id);
    }
}
