<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * To and CC suggestions in the inbox (owner, 2026-10-10): "when I write @name it shows a small dropdown of all the saved
 * options … otherwise they write the full email." The suggestions are colleagues and the addresses this branch has
 * mailed or heard from — the most used first. Never another company's people or mail.
 */
class AddressBookTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $pricing;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Book Co', 'code' => 'ABK', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->pricing = $this->user($company, $this->branch, 'Priya Nair', 'priya-abk@test.local', 'pricing');
        $this->user($company, $this->branch, 'Rahul Iyer', 'rahul-abk@test.local', 'operations');

        // Another company: neither its staff nor its mail is ours to suggest.
        $rival = Company::create(['name' => 'Rival Co', 'code' => 'ABR', 'tier' => 'command']);
        $rivalBranch = Agent::create(['company_id' => $rival->id, 'agent_name' => 'DEL', 'branch_code' => 'DEL']);
        $this->user($rival, $rivalBranch, 'Rahul Rival', 'rahul-rival@test.local', 'pricing');
        $this->mail($rivalBranch->id, 'Rajesh Secret <rajesh@secret.test>', 'desk@rival.test');

        // Our mail: Northwind's shipping desk three times, their finance once, and a reply we sent.
        foreach (range(1, 3) as $i) {
            $this->mail($this->branch->id, 'Northwind Shipping <shipping@northwind.test>', 'desk@abk.test');
        }
        $this->mail($this->branch->id, 'finance@northwind.test', 'desk@abk.test');
        $this->mail($this->branch->id, 'desk@abk.test', 'Raj Contoso <raj@contoso.test>, shipping@northwind.test', 'outbound');
    }

    private function user(Company $company, Agent $branch, string $name, string $email, string $designation): User
    {
        return User::create(['name' => $name, 'email' => $email, 'password' => Hash::make('x'), 'company_name' => $company->id,
            'branch_name' => $branch->id, 'designation' => $designation, 'is_active' => 1]);
    }

    private array $mailboxes = [];

    private function mail(int $agentId, string $from, string $to, string $direction = 'inbound'): void
    {
        $this->mailboxes[$agentId] ??= DB::table('mailbox_connections')->insertGetId(['agent_id' => $agentId,
            'user_id' => DB::table('users')->where('branch_name', $agentId)->value('id'), 'email_address' => 'desk-' . uniqid('', true) . '@abk.test', 'provider' => 'outlook', 'is_active' => 1,
            'auth_state' => 'connected', 'created_at' => now(), 'updated_at' => now()]);

        $key = 'abk-' . uniqid('', true);
        DB::table('email_threads')->insert(['agent_id' => $agentId, 'thread_key' => $key, 'status' => 'triaged',
            'latest_message_received_at' => now(), 'created_at' => now(), 'updated_at' => now()]);

        DB::table('email_messages')->insert(['agent_id' => $agentId, 'mailbox_connection_id' => $this->mailboxes[$agentId],
            'provider_message_id' => 'g-' . uniqid('', true), 'thread_key' => $key, 'direction' => $direction,
            'message_id' => '<' . uniqid('', true) . '@abk.test>', 'from' => $from, 'to' => $to, 'subject' => 'Rates',
            'received_at' => now(), 'created_at' => now(), 'updated_at' => now()]);
    }

    private function suggest(string $q): array
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->pricing), 'Accept' => 'application/json'])
            ->getJson('http://focusair.localhost/api/inbox/address-book?q=' . urlencode($q))->assertOk()->json('suggestions');
    }

    public function test_a_name_finds_colleagues_and_people_we_have_mailed(): void
    {
        $this->assertSame([['name' => 'Rahul Iyer', 'email' => 'rahul-abk@test.local', 'kind' => 'colleague']], $this->suggest('rah'));
        $this->assertSame([['name' => 'Raj Contoso', 'email' => 'raj@contoso.test', 'kind' => 'mailed']], $this->suggest('@raj'));
    }

    public function test_the_most_used_address_comes_first(): void
    {
        $this->assertSame(['shipping@northwind.test', 'finance@northwind.test'], array_column($this->suggest('northwind'), 'email'));
        $this->assertSame('Northwind Shipping', $this->suggest('northwind')[0]['name']);
    }

    public function test_another_companys_people_and_mail_are_never_offered(): void
    {
        $this->assertSame([], $this->suggest('secret'));
        $this->assertNotContains('rahul-rival@test.local', array_column($this->suggest('rahul'), 'email'));
    }
}
