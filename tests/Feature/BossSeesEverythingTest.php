<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Partner;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/** The Boss sees every branch of his company — and never another company's (user, 2026-09-16). */
class BossSeesEverythingTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $bom;
    private Agent $maa;
    private User $boss;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'All Co', 'code' => 'ALL', 'tier' => 'command']);
        $this->bom = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM']);
        $this->maa = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Chennai', 'branch_code' => 'MAA']);
        $this->boss = $this->user('boss', $this->bom);
    }

    private function user(string $designation, Agent $branch, string $suffix = ''): User
    {
        return User::create(['name' => ucfirst($designation) . $suffix, 'email' => "{$designation}{$suffix}-all@test.local", 'password' => Hash::make('x'),
            'company_name' => $branch->company_id, 'branch_name' => $branch->id, 'designation' => $designation, 'is_active' => 1]);
    }

    private function api(User $as): self
    {
        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($as), 'Accept' => 'application/json']);

        return $this;
    }

    /** A conversation in a branch, with one inbound mail addressed as given. */
    private function thread(Agent $branch, string $to, string $cc = ''): int
    {
        $key = 'all-' . uniqid('', true);
        $id = DB::table('email_threads')->insertGetId(['agent_id' => $branch->id, 'thread_key' => $key, 'classification' => 'customer_enquiry',
            'latest_message_received_at' => now(), 'created_at' => now(), 'updated_at' => now()]);
        $mailbox = DB::table('mailbox_connections')->insertGetId(['agent_id' => $branch->id, 'user_id' => $this->boss->id,
            'email_address' => "desk-{$key}@all.test", 'provider' => 'outlook', 'is_active' => 1, 'auth_state' => 'connected', 'created_at' => now(), 'updated_at' => now()]);
        DB::table('email_messages')->insert(['agent_id' => $branch->id, 'mailbox_connection_id' => $mailbox, 'thread_key' => $key, 'direction' => 'inbound',
            'message_id' => "<{$key}@client.test>", 'from' => 'ops@client.test', 'to' => $to, 'cc' => $cc ?: null, 'subject' => 'Rates',
            'received_at' => now(), 'created_at' => now(), 'updated_at' => now()]);

        return $id;
    }

    /** 🔴 The Boss's inbox: the mail he is on, from any branch — not the rest. He replies and assigns, he does not claim. */
    public function test_the_boss_inbox_holds_the_mail_he_is_on_from_every_branch(): void
    {
        $copiedInChennai = $this->thread($this->maa, 'desk@all.test', $this->boss->email);
        $notOnIt = $this->thread($this->bom, 'desk@all.test');

        $ids = collect($this->api($this->boss)->getJson('http://admin.localhost/api/inbox/threads')->assertOk()->json('data'))->pluck('id')->all();

        $this->assertSame([$copiedInChennai], $ids);
        $this->api($this->boss)->getJson("http://admin.localhost/api/inbox/threads/{$notOnIt}")->assertNotFound();
        $this->api($this->boss)->postJson("http://admin.localhost/api/inbox/threads/{$copiedInChennai}/claim")->assertForbidden();

        $pricing = $this->user('pricing', $this->maa);
        $this->api($this->boss)->postJson("http://admin.localhost/api/inbox/threads/{$copiedInChennai}/assign", ['user_id' => $pricing->id])
            ->assertOk()->assertJsonPath('assigned_ops.id', $pricing->id);
    }

    /** Clients & Partners: the Boss reads every branch's partners, each named with its branch; a branch user only theirs. */
    public function test_the_boss_reads_every_branchs_partners(): void
    {
        foreach ([[$this->bom, 'BlueDart'], [$this->maa, 'Konkan Clearing']] as [$branch, $name]) {
            Partner::withoutGlobalScopes()->create(['company_id' => $this->company->id, 'agent_id' => $branch->id, 'name' => $name, 'partner_type' => 'transporter']);
        }
        $other = Company::create(['name' => 'Other', 'code' => 'OTH', 'tier' => 'command']);
        $elsewhere = Agent::create(['company_id' => $other->id, 'agent_name' => 'Delhi', 'branch_code' => 'DEL']);
        Partner::withoutGlobalScopes()->create(['company_id' => $other->id, 'agent_id' => $elsewhere->id, 'name' => 'Not Ours', 'partner_type' => 'transporter']);

        $rows = collect($this->api($this->boss)->getJson('http://admin.localhost/api/partners')->assertOk()->json('data'));
        $this->assertSame(['BlueDart' => 'Mumbai', 'Konkan Clearing' => 'Chennai'], $rows->pluck('branch', 'name')->all());

        $pricing = $this->user('pricing', $this->bom, '-bom');
        $this->assertSame(['BlueDart'], collect($this->api($pricing)->getJson('http://focusair.localhost/api/partners')->json('data'))->pluck('name')->all());
    }

    /** 🔴 The assign list is the CONVERSATION's branch pricing staff — a Chennai conversation offers Chennai's people. */
    public function test_the_assign_list_is_the_conversations_branch_pricing_staff(): void
    {
        $chennaiPricing = $this->user('pricing', $this->maa, '-maa');
        $this->user('pricing', $this->bom, '-bom');
        $this->user('sales', $this->maa, '-maa');
        $thread = $this->thread($this->maa, 'desk@all.test', $this->boss->email);

        $names = collect($this->api($this->boss)->getJson("http://admin.localhost/api/inbox/threads/{$thread}/assignees")->assertOk()->json('assignees'))->pluck('id')->all();
        $this->assertSame([$chennaiPricing->id], $names);

        // Pricing never sees themselves; operations do not assign.
        $this->assertSame([], $this->api($chennaiPricing)->getJson("http://focusair.localhost/api/inbox/threads/{$thread}/assignees")->assertOk()->json('assignees'));
        $this->api($this->user('operations', $this->maa))->getJson("http://focusair.localhost/api/inbox/threads/{$thread}/assignees")->assertForbidden();
    }
}
