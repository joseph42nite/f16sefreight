<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\SuperAdmin;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Connect to Support Agent (PRD §5.10, user 2026-09-14): a ticket in the support desk, and a live chat
 * on it. Messages are checked every 3 s by both sides; a chat nobody answered stays a ticket in the queue.
 */
class SupportChatTest extends TestCase
{
    use DatabaseTransactions;

    private User $user;
    private User $colleague;
    private SuperAdmin $staff;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Chat Co', 'code' => 'CHT', 'tier' => 'tactical']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $make = fn ($email) => User::create([
            'name' => 'Ops', 'email' => $email, 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'operations', 'is_active' => 1,
        ]);

        $this->user = $make('ops-chat@test.local');
        $this->colleague = $make('ops2-chat@test.local');
        $this->staff = SuperAdmin::create(['name' => 'Agent', 'email' => 'agent-chat@f16s.test', 'password' => Hash::make('x')]);
    }

    private function as(User $user): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user), 'Accept' => 'application/json']);
    }

    private function asAgent(): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('superAdmin-api')->login($this->staff), 'Accept' => 'application/json']);
    }

    private function portal(string $path): string
    {
        return 'http://focusair.localhost/api' . $path;
    }

    private function desk(string $path): string
    {
        return 'http://superadmin.f16sefreight.com/api/admin' . $path;
    }

    private function start(): int
    {
        return $this->as($this->user)->postJson($this->portal('/support/chats'), [
            'route' => '/inbox',
            'help_transcript' => [['question' => 'Where do I enter an arrival notice?', 'answer' => "I couldn't find this."]],
        ])->assertCreated()->json('id');
    }

    /** 🔴 Connecting raises a ticket in the desk queue, with the help conversation that led to it. */
    public function test_connecting_raises_a_chat_ticket(): void
    {
        $id = $this->start();

        $ticket = DB::table('support_tickets')->find($id);
        $this->assertSame('chat', $ticket->channel);
        $this->assertSame('open', $ticket->status);
        $this->assertSame('/inbox', $ticket->route);
        $this->assertStringContainsString('arrival notice', $ticket->help_transcript);
        $this->assertSame('system', DB::table('support_ticket_messages')->where('support_ticket_id', $id)->value('sender'));
    }

    public function test_one_open_chat_per_user(): void
    {
        $id = $this->start();

        $this->as($this->user)->postJson($this->portal('/support/chats'), [])->assertOk()->assertJsonPath('id', $id);
    }

    /** The whole round: the user writes, the desk sees it waiting, an agent answers, the user sees the reply. */
    public function test_a_message_reaches_the_desk_and_the_reply_reaches_the_user(): void
    {
        $id = $this->start();

        $this->as($this->user)->postJson($this->portal("/support/chats/{$id}/messages"), ['body' => 'The notice is a PDF from the airline.'])
            ->assertCreated();

        $row = collect($this->asAgent()->getJson($this->desk('/tickets'))->assertOk()->json('data'))->firstWhere('id', $id);
        $this->assertSame(1, $row['waiting_messages']);

        $this->asAgent()->getJson($this->desk("/tickets/{$id}/messages"))->assertOk()
            ->assertJsonPath('messages.1.body', 'The notice is a PDF from the airline.');
        $row = collect($this->asAgent()->getJson($this->desk('/tickets'))->json('data'))->firstWhere('id', $id);
        $this->assertSame(0, $row['waiting_messages'], 'Read by the desk, so no longer waiting.');

        $reply = $this->asAgent()->postJson($this->desk("/tickets/{$id}/messages"), ['body' => 'Open the job and use Documents.'])
            ->assertCreated()->json('id');
        $this->assertSame('investigating', DB::table('support_tickets')->where('id', $id)->value('status'));

        $this->as($this->user)->getJson($this->portal('/support/chats/current'))->assertOk()->assertJsonPath('chat.unread', 1);
        $this->as($this->user)->getJson($this->portal("/support/chats/{$id}/messages?after_id=" . ($reply - 1)))
            ->assertOk()->assertJsonPath('messages.0.body', 'Open the job and use Documents.');
        $this->as($this->user)->getJson($this->portal('/support/chats/current'))->assertJsonPath('chat.unread', 0);
    }

    /** 🔒 A colleague in the same branch cannot read or write someone else's chat. */
    public function test_a_chat_is_its_users_only(): void
    {
        $id = $this->start();

        $this->as($this->colleague)->getJson($this->portal("/support/chats/{$id}/messages"))->assertNotFound();
        $this->as($this->colleague)->postJson($this->portal("/support/chats/{$id}/messages"), ['body' => 'x'])->assertNotFound();
    }

    public function test_resolving_closes_the_chat_and_says_so(): void
    {
        $id = $this->start();
        $this->asAgent()->patchJson($this->desk("/tickets/{$id}"), ['status' => 'investigating'])->assertOk();
        $this->asAgent()->patchJson($this->desk("/tickets/{$id}"), ['status' => 'resolved'])->assertOk();

        $this->assertStringContainsString('closed this chat', DB::table('support_ticket_messages')->where('support_ticket_id', $id)->orderByDesc('id')->value('body'));
        $this->as($this->user)->postJson($this->portal("/support/chats/{$id}/messages"), ['body' => 'one more'])
            ->assertStatus(422)->assertJsonPath('reason', 'closed');
    }

    public function test_a_bug_report_has_no_conversation(): void
    {
        $id = $this->as($this->user)->postJson($this->portal('/tickets'), ['route' => '/inbox', 'description' => 'broken'])->json('id');

        $this->asAgent()->postJson($this->desk("/tickets/{$id}/messages"), ['body' => 'hi'])->assertStatus(422)->assertJsonPath('reason', 'not_a_chat');
    }
}
