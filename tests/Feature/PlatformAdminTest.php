<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\SuperAdmin;
use App\SupportTicket;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Platform monitoring and the support desk — guide §5.6.
 *
 * 🔒 The boundary under test is the one the whole portal split exists for: superadmin
 * is F16s's own staff, `admin.` is a CLIENT's Boss, and neither may reach the other's
 * surface.
 */
class PlatformAdminTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $pricing;
    private SuperAdmin $staff;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Platform Co', 'code' => 'PLT', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);

        $this->pricing = User::create([
            'name' => 'pricing', 'email' => 'pricing-plt@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => 'pricing', 'is_active' => 1,
        ]);

        $this->staff = SuperAdmin::create([
            'name' => 'F16s Staff', 'email' => 'staff-plt@f16s.test', 'password' => Hash::make('x'),
        ]);
    }

    private function asUser(User $u): self
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u),
            'Accept' => 'application/json',
        ]);

        return $this;
    }

    private function asStaff(): self
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('superAdmin-api')->login($this->staff),
            'Accept' => 'application/json',
        ]);

        return $this;
    }

    private function url(string $path, string $host = 'superadmin.f16sefreight.com'): string
    {
        return "http://{$host}{$path}";
    }

    private function ticket(array $overrides = []): SupportTicket
    {
        return SupportTicket::create(array_merge([
            'agent_id' => $this->branch->id, 'user_id' => $this->pricing->id,
            'route' => '/kanban', 'description' => 'The board will not scroll.',
            'status' => 'open',
        ], $overrides));
    }

    // ─── Health ──────────────────────────────────────────────────────────────

    /**
     * 🔴 A HEALTH ENDPOINT MUST NEVER 500. Every probe is individually wrapped, so a
     * dead dependency is REPORTED rather than thrown — an endpoint that dies when a
     * dependency dies is useless at precisely the moment it is needed.
     */
    public function test_health_reports_every_subsystem(): void
    {
        $body = $this->asStaff()
            ->getJson($this->url('/api/admin/health'))
            ->assertOk()
            ->json();

        foreach (['database', 'redis', 'queues', 'ai_server', 'host'] as $subsystem) {
            $this->assertArrayHasKey($subsystem, $body);
            $this->assertArrayHasKey('status', $body[$subsystem],
                "{$subsystem} must report a status, up or down.");
        }

        $this->assertSame('up', $body['database']['status']);
    }

    /**
     * ⚠️ Queue depths are reported PER QUEUE, never as one total. A combined number
     * hides the failure the topology exists to prevent — `sync` at 400 with `ocr` at 2
     * is a different emergency from the reverse, and "402 pending" says neither.
     */
    public function test_queue_depths_are_reported_per_named_queue(): void
    {
        $queues = $this->asStaff()
            ->getJson($this->url('/api/admin/health'))
            ->assertOk()
            ->json('queues');

        if ($queues['status'] !== 'up') {
            $this->markTestSkipped('Redis is not reachable in this environment.');
        }

        foreach (['notifications', 'sync', 'mail-out', 'documents', 'ocr', 'backfill', 'analytics'] as $name) {
            $this->assertArrayHasKey($name, $queues['depths']);
        }
    }

    public function test_the_log_tail_is_capped_and_never_takes_a_path_from_the_caller(): void
    {
        $body = $this->asStaff()
            ->getJson($this->url('/api/admin/logs?lines=5000&file=/etc/passwd'))
            ->assertOk()
            ->json();

        // The cap is applied server-side...
        $this->assertLessThanOrEqual(500, count($body['lines']));
        // ...and the path is fixed, so `file=` is inert rather than a traversal.
        $this->assertStringEndsWith('logs/laravel.log', $body['path']);
    }

    public function test_the_classification_export_is_csv_with_a_header(): void
    {
        $response = $this->asStaff()
            ->get($this->url('/api/admin/classification-overrides/export'))
            ->assertOk();

        $this->assertStringContainsString('text/csv', $response->headers->get('Content-Type'));
        $this->assertStringStartsWith('created_at,agent_id,original,corrected', $response->getContent());
    }

    /**
     * One correction, so the summary and the purge have something real to act on.
     *
     * ⚠️ A real branch and a real thread. Both columns carry foreign keys, so hardcoded
     * ids fail on an empty test database — and a fixture that cannot be inserted proves
     * nothing about the endpoint it was written for.
     */
    private function override(array $overrides = []): void
    {
        $threadId = DB::table('email_threads')->insertGetId([
            'agent_id' => $this->branch->id,
            'thread_key' => 'thr_' . substr(uniqid('', false), -10),
            'status' => 'triaged',
            'classification' => 'airline',
            'latest_message_received_at' => now(),
            'created_at' => now(), 'updated_at' => now(),
        ]);

        DB::table('email_classification_overrides')->insert($overrides + [
            'agent_id' => $this->branch->id,
            'email_thread_id' => $threadId,
            'original_classification' => 'airline',
            'corrected_classification' => 'customer_enquiry',
            'email_subject' => 'RE: MAWB 176-10000004',
            'email_snippet' => 'Please quote 3 pallets BOM to HAM, 480kg.',
            'sender_domain' => 'lufthansa.test',
            'sender_email' => 'ops@lufthansa.test',
            // ⚠️ An OPERATOR, not platform staff. `corrected_by` references `users`, and
            // a correction is a tenant person disagreeing with the classifier — F16s staff
            // never touch the dropdown.
            'corrected_by' => $this->pricing->id,
            'created_at' => now(),
        ]);
    }

    /**
     * 🔴 The export answers "what was this one correction", 5,000 rows at a time. This
     * answers the question that comes first: *how often is the classifier wrong, and
     * about what* — which a 5,000-row CSV cannot be read as an answer to.
     */
    public function test_the_failure_summary_groups_corrections_and_repeat_domains(): void
    {
        // Three from the same domain: the shape that means a sender_domain_match rule is
        // waiting to be written, which is the cheapest rule type there is.
        $this->override();
        $this->override();
        $this->override();
        // A different mistake, so grouping has something to separate.
        $this->override([
            'original_classification' => 'customer_enquiry',
            'corrected_classification' => 'vendor_invoice',
            'sender_domain' => 'billing.test',
        ]);

        $body = $this->asStaff()
            ->getJson($this->url('/api/admin/classification-failures'))
            ->assertOk()
            ->json();

        $this->assertSame(4, $body['total']);
        $this->assertFalse($body['ready'], 'four corrections is not a reviewable sample');
        $this->assertCount(2, $body['by_correction']);

        // ⚠️ Only domains seen twice or more. A single mistake is a coincidence; the
        // threshold is what stops the list being every sender who ever wrote in.
        $this->assertCount(1, $body['repeat_domains']);
        $this->assertSame('lufthansa.test', $body['repeat_domains'][0]['sender_domain']);

        // The words the classifier read, so a pattern can be written from evidence.
        $this->assertStringContainsString('BOM to HAM', $body['samples'][0]['email_snippet']);
    }

    /**
     * 🔴 The purge clears the LEARNING RECORD and nothing else. Corrections are a working
     * set for tuning; once the rules change they measure a classifier that no longer
     * exists. No mail, thread or enquiry is touched — that distinction is the whole reason
     * this is safe to run.
     */
    public function test_purging_corrections_leaves_the_mail_alone(): void
    {
        $this->override();
        $this->override();

        $messages = DB::table('email_messages')->count();
        $threads  = DB::table('email_threads')->count();

        $this->asStaff()
            ->deleteJson($this->url('/api/admin/classification-overrides'))
            ->assertOk()
            ->assertJsonPath('cleared', 2);

        $this->assertSame(0, DB::table('email_classification_overrides')->count());
        $this->assertSame($messages, DB::table('email_messages')->count(), 'the purge deleted mail');
        $this->assertSame($threads, DB::table('email_threads')->count(), 'the purge deleted threads');
    }

    // ─── The portal boundary ─────────────────────────────────────────────────

    /**
     * 🔒 THE BOUNDARY THE WHOLE SPLIT EXISTS FOR. `admin.` is a CLIENT's Boss;
     * `superadmin.` is F16s's staff. A Boss reaching the platform monitor would be
     * reading another tenant's infrastructure.
     */
    public function test_a_tenant_user_cannot_reach_the_platform_endpoints(): void
    {
        foreach (['/api/admin/health', '/api/admin/logs', '/api/admin/tickets'] as $path) {
            $this->asUser($this->pricing)
                ->getJson($this->url($path, 'admin.f16sefreight.com'))
                ->assertUnauthorized();
        }
    }

    public function test_an_unauthenticated_caller_is_refused(): void
    {
        $this->withHeaders(['Accept' => 'application/json'])
            ->getJson($this->url('/api/admin/health'))
            ->assertUnauthorized();
    }

    // ─── The support desk ────────────────────────────────────────────────────

    /**
     * 🔴 agent_id and user_id come from the SESSION, never the request. A reporter who
     * could name their own agent_id could file against another tenant — and the desk
     * reads across all of them.
     */
    public function test_a_ticket_is_attributed_from_the_session_not_the_payload(): void
    {
        $other = Agent::create([
            'company_id' => $this->company->id, 'agent_name' => 'MAA', 'branch_code' => 'MAA',
        ]);

        $body = $this->asUser($this->pricing)
            ->postJson($this->url('/api/tickets', 'focusair.f16sefreight.com'), [
                'route' => '/kanban',
                'description' => 'Cards will not drag.',
                'element_selector' => '.fx-board__col:nth-child(2)',
                'console_logs' => ['TypeError: undefined is not a function'],
                // Both of these must be ignored.
                'agent_id' => $other->id,
                'user_id'  => 999999,
            ])
            ->assertStatus(201)
            ->json();

        $this->assertSame($this->branch->id, $body['agent_id']);
        $this->assertSame($this->pricing->id, $body['user_id']);
        $this->assertSame('open', $body['status']);
    }

    public function test_a_ticket_requires_a_route_and_a_description(): void
    {
        $this->asUser($this->pricing)
            ->postJson($this->url('/api/tickets', 'focusair.f16sefreight.com'), ['route' => '/kanban'])
            ->assertStatus(422);
    }

    /** The desk reads across tenants — superadmin is the one portal that is not bound. */
    public function test_the_desk_sees_tickets_from_every_tenant(): void
    {
        $otherCompany = Company::create(['name' => 'Other Co', 'code' => 'OTH', 'tier' => 'core']);
        $otherBranch = Agent::create([
            'company_id' => $otherCompany->id, 'agent_name' => 'DEL', 'branch_code' => 'DEL',
        ]);
        $otherUser = User::create([
            'name' => 'ops', 'email' => 'ops-oth@test.local', 'password' => Hash::make('x'),
            'company_name' => $otherCompany->id, 'branch_name' => $otherBranch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);

        $this->ticket();
        $this->ticket(['agent_id' => $otherBranch->id, 'user_id' => $otherUser->id]);

        $agents = collect($this->asStaff()->getJson($this->url('/api/admin/tickets'))->assertOk()->json('data'))
            ->pluck('agent_id')->unique();

        $this->assertTrue($agents->contains($this->branch->id));
        $this->assertTrue($agents->contains($otherBranch->id));
    }

    public function test_a_ticket_advances_through_its_statuses(): void
    {
        $ticket = $this->ticket();

        $this->asStaff()
            ->patchJson($this->url("/api/admin/tickets/{$ticket->id}"), ['status' => 'investigating'])
            ->assertOk()
            ->assertJsonPath('status', 'investigating');

        $this->asStaff()
            ->patchJson($this->url("/api/admin/tickets/{$ticket->id}"), ['status' => 'resolved'])
            ->assertOk()
            ->assertJsonPath('status', 'resolved');
    }

    /**
     * ⚠️ FORWARD ONLY. A resolved ticket silently returning to `open` destroys the one
     * queue metric that matters — how long a report waited before somebody looked —
     * because its clock would restart. A returning bug is a new report.
     */
    public function test_a_resolved_ticket_cannot_be_reopened(): void
    {
        $ticket = $this->ticket(['status' => 'resolved']);

        $this->asStaff()
            ->patchJson($this->url("/api/admin/tickets/{$ticket->id}"), ['status' => 'open'])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'backwards_transition');

        $this->assertDatabaseHas('support_tickets', ['id' => $ticket->id, 'status' => 'resolved']);
    }

    /** Oldest open first: newest-first buries the report that has waited longest. */
    public function test_the_queue_puts_open_tickets_before_resolved_ones(): void
    {
        $resolved = $this->ticket(['status' => 'resolved']);
        DB::table('support_tickets')->where('id', $resolved->id)
            ->update(['created_at' => now()->subDays(10)]);

        $open = $this->ticket();

        $ids = collect($this->asStaff()->getJson($this->url('/api/admin/tickets'))->assertOk()->json('data'))
            ->pluck('id')->all();

        $this->assertLessThan(
            array_search($resolved->id, $ids, true),
            array_search($open->id, $ids, true),
            'An open ticket outranks an older resolved one.'
        );
    }
}
