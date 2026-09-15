<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\MailboxConnection;
use App\Services\Sales\ClientFindings;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * Client emails on the Sales page, and the sales inbox (user, 2026-09-15; PRD §7.3.7).
 */
class SalesOutreachTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $rep;

    protected function setUp(): void
    {
        parent::setUp();

        // Tactical on purpose: client emails work from the saved client domain on every tier.
        $this->company = Company::create(['name' => 'Outreach Co', 'code' => 'OUT', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->rep = $this->user('sales');

        // Drafts use the plain template here: no call leaves the test.
        config(['services.openrouter.key' => null]);
    }

    private function user(string $designation, string $suffix = ''): User
    {
        return User::create([
            'name' => ucfirst($designation), 'email' => "{$designation}{$suffix}-out@test.local", 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => $designation, 'is_active' => 1,
        ]);
    }

    private function api(User $as): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($as), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://focusair.localhost' . $path;
    }

    private function customer(?int $salesId, string $name = 'Globex'): Customer
    {
        return Customer::create(['company_id' => $this->company->id, 'name' => $name, 'email_domain' => strtolower($name) . '.test', 'sales_id' => $salesId]);
    }

    private function clientEmail(Customer $c, string $type = 'client_reactivation', ?int $salesId = null, string $audience = 'client'): int
    {
        return DB::table('sales_action_queue')->insertGetId([
            'agent_id' => $this->branch->id, 'customer_id' => $c->id, 'transport_mode' => 'air',
            'sales_id' => $salesId ?? $this->rep->id, 'audience' => $audience, 'action_type' => $type,
            'priority_score' => 60, 'status' => 'open',
            'fact_packet' => json_encode(['usually_ships_every_days' => 9, 'days_since_last_shipment' => 26, 'usual_lanes' => ['BOM → FRA']]),
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function contact(Customer $c, string $box, bool $primary = false, bool $cc = false, bool $optedOut = false): void
    {
        DB::table('customer_contacts')->insert([
            'company_id' => $this->company->id, 'customer_id' => $c->id, 'email' => "{$box}@{$c->email_domain}",
            'source' => 'manual', 'is_primary' => $primary, 'include_in_cc' => $cc,
            'opted_out_at' => $optedOut ? now() : null, 'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    // ─── Findings ────────────────────────────────────────────────────────────

    /** 🔴 A client who stopped shipping gets a check-in, built only from their own figures. */
    public function test_a_dormant_client_gets_a_reactivation_email_from_their_own_figures(): void
    {
        $profile = (object) ['risk_band' => 'DORMANT', 'overdue_ratio' => 2.9, 'expected_gap_days' => 9,
            'last_shipment_at' => now()->subDays(26)->startOfDay()];
        $shipment = (object) ['day' => now()->subDays(26)->startOfDay(), 'lane' => 'BOM → FRA', 'weight' => 400.0];

        $findings = app(ClientFindings::class)->for($profile, -0.4, ['price_loss_rate' => null, 'service_loss_rate' => 80.0],
            collect([$shipment]), collect(), collect(), now()->startOfDay());

        $this->assertSame(['client_reactivation'], array_column($findings, 'action_type'),
            'a falling volume email is not sent on top of a check-in, and a service problem is never a client email');
        $this->assertSame(['usually_ships_every_days' => 9, 'days_since_last_shipment' => 26, 'usual_lanes' => ['BOM → FRA']], $findings[0]['facts']);
    }

    public function test_falling_and_growing_volume_are_findings_of_their_own(): void
    {
        $steady = (object) ['risk_band' => 'LOW'];
        $none = ['price_loss_rate' => null, 'service_loss_rate' => null];
        $find = fn (float $trend) => app(ClientFindings::class)->for($steady, $trend, $none, collect(), collect(), collect(), now());

        $this->assertSame('client_volume_drop', $find(-0.31)[0]['action_type']);
        $this->assertSame('client_volume_growth', $find(0.4)[0]['action_type']);
        $this->assertSame([], $find(0.1));
    }

    // ─── The Sales page ──────────────────────────────────────────────────────

    /** 🔒 A rep sees their own clients' emails only — never another rep's, never an internal finding. */
    public function test_a_rep_sees_only_their_own_client_emails(): void
    {
        $mine = $this->clientEmail($this->customer($this->rep->id));
        $colleague = $this->user('sales', '2');
        $this->clientEmail($this->customer($colleague->id, 'Contoso'), 'client_new_lanes', $colleague->id);
        $this->clientEmail($this->customer($this->rep->id, 'Northwind'), 'service_escalation', null, 'internal');

        $emails = $this->api($this->rep)->getJson($this->url('/api/sales/outreach'))->assertOk()->json('emails');

        $this->assertSame([$mine], array_column($emails, 'id'));
        // Tactical: the domain, never the client's name (PRD §2.3.3).
        $this->assertNull($emails[0]['client']);
        $this->assertSame('globex.test', $emails[0]['domain']);

        $this->company->update(['tier' => 'command']);
        $this->assertSame('Globex', $this->api($this->rep)->getJson($this->url('/api/sales/outreach'))->json('emails.0.client'));
    }

    /** To the primary contact, copying only who was chosen for it, and never an opted-out address. */
    public function test_a_draft_is_addressed_from_the_clients_contacts(): void
    {
        $c = $this->customer($this->rep->id);
        $this->contact($c, 'shipping', primary: true);
        $this->contact($c, 'accounts', cc: true);
        $this->contact($c, 'old', cc: true, optedOut: true);
        $this->contact($c, 'broker');
        $id = $this->clientEmail($c);

        $draft = $this->api($this->rep)->postJson($this->url("/api/sales/outreach/{$id}/draft"))->assertOk()->json();

        $this->assertSame(['shipping@globex.test'], $draft['to']);
        $this->assertSame(['accounts@globex.test'], $draft['cc']);
        $this->assertSame('template', $draft['written_by']);
        $this->assertStringContainsString('26 days', $draft['body']);
        // Tactical: the rep writes the company name in.
        $this->assertStringContainsString('[Company name]', $draft['body']);
        $this->assertStringNotContainsString('Globex', $draft['body']);
        $this->assertNotNull(DB::table('sales_action_queue')->where('id', $id)->value('draft_generated_at'));
    }

    /** 🔴 Never sent with the name left for the rep to fill in. */
    public function test_a_draft_with_the_company_name_still_to_fill_in_is_not_sent(): void
    {
        $id = $this->clientEmail($this->customer($this->rep->id));

        $this->api($this->rep)->postJson($this->url("/api/sales/outreach/{$id}/send"), [
            'to' => ['shipping@globex.test'], 'subject' => 'Hello', 'body' => '<p>Dear [Company name] team,</p>',
        ])->assertStatus(422)->assertJsonPath('reason', 'name_missing');
    }

    public function test_without_their_own_mailbox_the_rep_is_told_to_connect_it(): void
    {
        $id = $this->clientEmail($this->customer($this->rep->id));

        $this->api($this->rep)->postJson($this->url("/api/sales/outreach/{$id}/send"), [
            'to' => ['shipping@globex.test'], 'subject' => 'Hello', 'body' => '<p>Hi</p>',
        ])->assertStatus(422)->assertJsonPath('reason', 'no_mailbox');

        $this->assertSame('open', DB::table('sales_action_queue')->where('id', $id)->value('status'));
    }

    /** 🔴 Sent from the rep's own mailbox, exactly as they edited it, and the card is done. */
    public function test_sending_goes_from_the_reps_mailbox_and_closes_the_card(): void
    {
        $id = $this->clientEmail($this->customer($this->rep->id));
        MailboxConnection::create([
            'agent_id' => $this->branch->id, 'user_id' => $this->rep->id, 'email_address' => 'sales-out@test.local',
            'provider' => 'outlook', 'access_token' => 'token', 'is_active' => true, 'auth_state' => 'connected',
        ]);
        Http::fake(['*' => Http::response('', 202)]);

        $this->api($this->rep)->postJson($this->url("/api/sales/outreach/{$id}/send"), [
            'to' => ['shipping@globex.test'], 'cc' => ['accounts@globex.test'],
            'subject' => 'Checking in', 'body' => '<p>Edited by the rep</p>',
        ])->assertOk();

        Http::assertSent(fn ($request) => str_ends_with($request->url(), '/me/sendMail')
            && $request['message']['subject'] === 'Checking in'
            && $request['message']['toRecipients'][0]['emailAddress']['address'] === 'shipping@globex.test');

        $row = DB::table('sales_action_queue')->find($id);
        $this->assertSame('acted', $row->status);
        $this->assertSame($this->rep->id, (int) $row->sent_by);
        $this->assertSame('<p>Edited by the rep</p>', $row->draft_body);
    }

    public function test_a_rep_cannot_touch_another_reps_email(): void
    {
        $colleague = $this->user('sales', '2');
        $id = $this->clientEmail($this->customer($colleague->id), 'client_reactivation', $colleague->id);

        $this->api($this->rep)->postJson($this->url("/api/sales/outreach/{$id}/dismiss"), ['reason' => 'already_in_touch'])->assertNotFound();
        $this->api($colleague)->postJson($this->url("/api/sales/outreach/{$id}/dismiss"), ['reason' => 'already_in_touch'])->assertOk();
        $this->assertSame('dismissed', DB::table('sales_action_queue')->where('id', $id)->value('status'));
    }

    /** 🔴 Every dismissal keeps why, and who, so F16s can improve the suggestions. "Other" needs a note. */
    public function test_a_dismissal_records_its_reason(): void
    {
        $id = $this->clientEmail($this->customer($this->rep->id));
        $dismiss = fn (array $body) => $this->api($this->rep)->postJson($this->url("/api/sales/outreach/{$id}/dismiss"), $body);

        $dismiss([])->assertStatus(422);
        $dismiss(['reason' => 'other'])->assertStatus(422);
        $dismiss(['reason' => 'other', 'note' => 'They moved this lane to sea freight'])->assertOk();

        $row = DB::table('sales_action_queue')->find($id);
        $this->assertSame(['other', 'They moved this lane to sea freight', $this->rep->id],
            [$row->dismissed_reason, $row->dismissed_note, (int) $row->dismissed_by]);
        $this->assertNotNull($row->dismissed_at);
    }

    /** A rep sees their own dismissals; the Boss sees every rep's in the company. */
    public function test_a_rep_sees_their_own_dismissals_and_the_boss_sees_all(): void
    {
        $colleague = $this->user('sales', '2');
        foreach ([[$this->rep, 'Globex'], [$colleague, 'Contoso']] as [$who, $name]) {
            $id = $this->clientEmail($this->customer($who->id, $name), 'client_reactivation', $who->id);
            $this->api($who)->postJson($this->url("/api/sales/outreach/{$id}/dismiss"), ['reason' => 'figures_wrong'])->assertOk();
        }

        $mine = $this->api($this->rep)->getJson($this->url('/api/sales/outreach/dismissed'))->assertOk()->json();
        $this->assertCount(1, $mine['dismissed']);
        $this->assertSame('figures_wrong', $mine['dismissed'][0]['reason']);

        // The Boss works from the admin portal.
        $boss = $this->api($this->user('boss'))->getJson('http://admin.localhost/api/sales/outreach/dismissed')->assertOk()->json();
        $this->assertCount(2, $boss['dismissed']);
        $this->assertSame(2, $boss['by_reason']['figures_wrong']);
    }

    /** 🔒 Superadmin sees sent vs dismissed and why, with the figures — never the client's name or domain. */
    public function test_superadmin_sees_the_feedback_without_client_names(): void
    {
        $c = $this->customer($this->rep->id);
        $sent = $this->clientEmail($c);
        DB::table('sales_action_queue')->where('id', $sent)->update(['status' => 'acted', 'sent_at' => now()]);
        $dismissed = $this->clientEmail($c);
        $this->api($this->rep)->postJson($this->url("/api/sales/outreach/{$dismissed}/dismiss"), ['reason' => 'not_a_good_time'])->assertOk();

        $staff = \App\SuperAdmin::create(['name' => 'Staff', 'email' => 'staff-out@test.local', 'password' => Hash::make('x')]);
        $response = $this->actingAs($staff, 'superAdmin-api')->getJson('/api/superadmin/suggestion-feedback')->assertOk();

        $type = collect($response->json('by_type'))->firstWhere('type', 'client_reactivation');
        $this->assertSame([1, 1, 50], [$type['sent'], $type['dismissed'], $type['dismissed_percent']]);
        $this->assertSame(1, $response->json('reasons_by_type.client_reactivation.not_a_good_time'));
        $this->assertSame('Outreach Co', collect($response->json('recent'))->firstWhere('id', $dismissed)['company']);
        $this->assertStringNotContainsString('globex', strtolower($response->getContent()));
    }

    // ─── The sales inbox ─────────────────────────────────────────────────────

    private function thread(string $cc): int
    {
        $key = 'out-' . random_int(1, 999999);
        $connection = DB::table('mailbox_connections')->insertGetId([
            'agent_id' => $this->branch->id, 'user_id' => $this->rep->id, 'email_address' => $key . '@desk.test',
            'provider' => 'outlook', 'is_active' => 1, 'auth_state' => 'connected', 'created_at' => now(), 'updated_at' => now(),
        ]);
        $id = DB::table('email_threads')->insertGetId([
            'agent_id' => $this->branch->id, 'thread_key' => $key, 'classification' => 'customer_enquiry',
            'latest_message_received_at' => now(), 'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('email_messages')->insert([
            'agent_id' => $this->branch->id, 'mailbox_connection_id' => $connection, 'thread_key' => $key,
            'direction' => 'inbound', 'message_id' => "<{$key}@mail.test>", 'from' => 'ops@globex.test',
            'to' => 'desk@desk.test', 'cc' => $cc, 'subject' => 'Rates', 'received_at' => now(),
            'created_at' => now(), 'updated_at' => now(),
        ]);

        return $id;
    }

    /** 🔒 Sales see the mail they are on — to, cc, bcc or from them — and nothing else; they do not claim. */
    public function test_sales_see_only_mail_they_are_on(): void
    {
        $theirs = $this->thread('broker@globex.test, ' . $this->rep->email);
        $other = $this->thread('broker@globex.test');

        $ids = array_column($this->api($this->rep)->getJson($this->url('/api/inbox/threads'))->assertOk()->json('data'), 'id');

        $this->assertContains($theirs, $ids);
        $this->assertNotContains($other, $ids);
        $this->api($this->rep)->getJson($this->url("/api/inbox/threads/{$other}"))->assertNotFound();
        $this->api($this->rep)->postJson($this->url("/api/inbox/threads/{$theirs}/claim"))->assertForbidden();

        // Pricing still works the whole branch inbox.
        $this->assertContains($other, array_column($this->api($this->user('pricing'))->getJson($this->url('/api/inbox/threads'))->json('data'), 'id'));
    }
}
