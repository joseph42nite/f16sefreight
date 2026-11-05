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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * GAPS #51 — a correction counts against the rule that filed the thread.
 *
 * 🔴 `matched_rule_id` was NULL on every override: the classifier knew which rule fired and nothing kept it,
 * so `override_count` never moved and a rule that is wrong 180 times in 200 looked exactly like a good one.
 */
class ClassificationRuleAttributionTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $pricing;
    private MailboxConnection $mailbox;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Rule Co', 'code' => 'RLC', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->pricing = User::create(['name' => 'Asha', 'email' => 'asha@forwarder-rlc.test', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $this->mailbox = MailboxConnection::withoutGlobalScopes()->create(['agent_id' => $this->branch->id, 'user_id' => $this->pricing->id,
            'email_address' => 'asha@forwarder-rlc.test', 'provider' => 'outlook', 'is_active' => 1, 'auth_state' => 'connected',
            'backfill_status' => 'completed']);
    }

    private function rule(): int
    {
        return DB::table('email_classification_rules')->insertGetId([
            'agent_id' => $this->branch->id, 'rule_name' => 'Customs in the subject', 'rule_type' => 'subject_keyword',
            'pattern' => 'customs', 'target_classification' => 'clearance', 'priority' => 1, 'is_active' => 1,
            'hit_count' => 0, 'override_count' => 0, 'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function receive(string $subject): EmailThread
    {
        $id = '<' . uniqid('', true) . '@rlc.test>';
        app(MessageIngestor::class)->ingest($this->mailbox, [new NormalisedMessage(
            messageId: $id, threadId: null, from: 'desk@broker-rlc.test', to: [$this->mailbox->email_address], cc: [], bcc: [],
            subject: $subject, snippet: 'See attached.', receivedAt: now(), direction: 'inbound',
        )]);

        return EmailThread::withoutGlobalScopes()->where('thread_key', DB::table('email_messages')->where('message_id', $id)->value('thread_key'))->first();
    }

    public function test_the_thread_keeps_the_rule_that_filed_it(): void
    {
        $rule = $this->rule();

        $thread = $this->receive('Customs query on 176-12345675');

        $this->assertSame('clearance', $thread->classification);
        $this->assertSame('rule', $thread->auto_classification_source);
        $this->assertSame($rule, (int) $thread->auto_classification_rule_id);
    }

    public function test_a_correction_counts_against_that_rule(): void
    {
        $rule = $this->rule();
        $thread = $this->receive('Customs query on 176-12345675');

        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->pricing), 'Accept' => 'application/json'])
            ->postJson("http://focusair.f16sefreight.com/api/inbox/threads/{$thread->id}/classify", ['classification' => 'airline'])
            ->assertOk();

        $this->assertSame($rule, (int) DB::table('email_classification_overrides')->where('email_thread_id', $thread->id)->value('matched_rule_id'));
        $this->assertSame(1, (int) DB::table('email_classification_rules')->where('id', $rule)->value('override_count'));
    }
}
