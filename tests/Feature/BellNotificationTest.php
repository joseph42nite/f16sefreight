<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enquiry;
use App\Job;
use App\Services\BellNotificationService;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The bell and the handover lifecycle — ui_ux_guide §5.6, schema doc #45.
 *
 * The rule under test that is easy to get wrong: a withdrawn handover HARD-DELETES its
 * notification. Marking it resolved would leave a row the owner re-reads and re-dismisses
 * every time they open the bell, and after a few of those they stop reading it at all.
 */
class BellNotificationTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $pricing;
    private User $ops;
    private User $other;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Bell Co', 'code' => 'BEL', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->pricing = $this->user('pricing');
        $this->ops = $this->user('operations');
        $this->other = $this->user('operations', '-b');
    }

    private function user(string $designation, string $suffix = ''): User
    {
        return User::create([
            'name' => ucfirst($designation) . $suffix, 'email' => "{$designation}{$suffix}-bel@test.local",
            'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => $designation, 'is_active' => 1,
        ]);
    }

    private function api(User $as): self
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($as),
            'Accept' => 'application/json',
        ]);

        return $this;
    }

    private function url(string $path, string $host = 'focusair.f16sefreight.com'): string
    {
        return "http://{$host}{$path}";
    }

    private function job(): Job
    {
        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-BELBOM-26-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
        ]);

        return Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'ops_id' => $this->ops->id, 'pricing_id' => $this->pricing->id,
            'execution_job_no' => 'JOBA-BELBOM-26-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
            'status' => 'Verification',
        ]);
    }

    private function bell(): BellNotificationService
    {
        return app(BellNotificationService::class);
    }

    // ─── Raising ─────────────────────────────────────────────────────────────

    /** A handover request notifies the PRICING owner — the person who grants it. */
    public function test_requesting_a_handover_pins_a_notification_for_the_owner(): void
    {
        $job = $this->job();

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/request"), ['ops_id' => $this->other->id])
            ->assertStatus(202);

        $bell = $this->api($this->pricing)
            ->getJson($this->url('/api/notifications'))
            ->assertOk()
            ->json();

        $this->assertSame(1, $bell['unread']);
        $this->assertTrue($bell['notifications'][0]['pinned'], 'An approval request pins.');
        $this->assertSame($job->id, $bell['notifications'][0]['data']['job_id']);
    }

    /**
     * 🔴 `priority DESC, created_at DESC`. An approval must sit above routine alerts
     * however many arrive after it — sorting by date alone buries the one thing that
     * is actually waiting on a decision.
     */
    public function test_an_approval_outranks_newer_routine_alerts(): void
    {
        $job = $this->job();

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/request"), ['ops_id' => $this->other->id])
            ->assertStatus(202);

        // Three routine alerts, all NEWER than the approval.
        foreach (range(1, 3) as $i) {
            $this->bell()->notify($this->branch->id, $this->pricing->id, 'App\\Notifications\\Routine', ['n' => $i]);
        }

        $rows = $this->api($this->pricing)
            ->getJson($this->url('/api/notifications'))
            ->assertOk()
            ->json('notifications');

        $this->assertCount(4, $rows);
        $this->assertTrue($rows[0]['pinned'], 'The approval is still first.');
        $this->assertSame(BellNotificationService::REASSIGNMENT, $rows[0]['type']);
    }

    // ─── Auto-dissolve ───────────────────────────────────────────────────────

    /**
     * 🔴 WITHDRAWAL HARD-DELETES. No "cancelled" tombstone — the row is gone and the
     * list reflows, because a bell is a list of things still needing a decision.
     */
    public function test_withdrawing_a_handover_removes_the_notification_entirely(): void
    {
        $job = $this->job();

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/request"), ['ops_id' => $this->other->id])
            ->assertStatus(202);

        $this->assertSame(1, $this->bell()->unreadCount($this->pricing->id));

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/withdraw"))
            ->assertOk()
            ->assertJsonPath('notifications_dissolved', 1);

        $this->assertSame(0, $this->bell()->unreadCount($this->pricing->id));
        $this->assertCount(0, $this->bell()->forUser($this->pricing->id), 'No tombstone is left behind.');

        // ...and the live assignment is untouched — staging never moved it.
        $this->assertSame($this->ops->id, $job->fresh()->ops_id);
        $this->assertNull($job->fresh()->pending_ops_id);
    }

    /**
     * ⚠️ ONLY THE UNREAD ONE DISSOLVES. If the owner already read it — and possibly
     * already acted — removing it would erase the record of something they saw. A read
     * notification is history, and history is not the bell's to rewrite.
     */
    public function test_a_read_notification_survives_withdrawal(): void
    {
        $job = $this->job();

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/request"), ['ops_id' => $this->other->id])
            ->assertStatus(202);

        $id = $this->bell()->forUser($this->pricing->id)[0]['id'];
        $this->api($this->pricing)->postJson($this->url("/api/notifications/{$id}/read"))->assertOk();

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/withdraw"))
            ->assertOk()
            ->assertJsonPath('notifications_dissolved', 0);

        $this->assertCount(1, $this->bell()->forUser($this->pricing->id));
    }

    /** 🔒 Only the operator who ASKED may withdraw — not a colleague keeping the work. */
    public function test_another_operator_cannot_withdraw_someone_elses_request(): void
    {
        $job = $this->job();

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/request"), ['ops_id' => $this->other->id])
            ->assertStatus(202);

        $this->api($this->other)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/withdraw"))
            ->assertStatus(403)
            ->assertJsonPath('reason', 'not_requester');
    }

    public function test_withdrawing_with_nothing_staged_is_refused(): void
    {
        $job = $this->job();

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/withdraw"))
            ->assertStatus(422)
            ->assertJsonPath('reason', 'nothing_pending');
    }

    // ─── Accept / reject ─────────────────────────────────────────────────────

    /** Accepting moves the live assignment and dissolves the row. */
    public function test_accepting_a_handover_moves_the_job_and_clears_the_bell(): void
    {
        $job = $this->job();

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/request"), ['ops_id' => $this->other->id])
            ->assertStatus(202);

        $this->api($this->pricing)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/resolve"), ['decision' => 'accept'])
            ->assertOk()
            ->assertJsonPath('ops_id', $this->other->id);

        $this->assertCount(0, $this->bell()->forUser($this->pricing->id));
    }

    /**
     * 🔴 REJECTION LEAVES THE JOB EXACTLY WHERE IT WAS. Staging exists precisely so a
     * request cannot move work on its own.
     */
    public function test_rejecting_a_handover_leaves_the_job_untouched(): void
    {
        $job = $this->job();

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/request"), ['ops_id' => $this->other->id])
            ->assertStatus(202);

        $this->api($this->pricing)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/resolve"), ['decision' => 'reject'])
            ->assertOk()
            ->assertJsonPath('ops_id', $this->ops->id)
            ->assertJsonPath('pending_ops_id', null);

        $this->assertCount(0, $this->bell()->forUser($this->pricing->id));
    }

    /** 🔒 Operations may ASK; only the owner ANSWERS. That asymmetry is why it stages. */
    public function test_operations_cannot_resolve_its_own_request(): void
    {
        $job = $this->job();

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/request"), ['ops_id' => $this->other->id])
            ->assertStatus(202);

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/resolve"), ['decision' => 'accept'])
            ->assertForbidden();
    }

    // ─── The bell itself ─────────────────────────────────────────────────────

    /** A bell is per person. One user must never see another's. */
    public function test_a_user_only_sees_their_own_notifications(): void
    {
        $this->bell()->notify($this->branch->id, $this->pricing->id, 'App\\Notifications\\Routine', ['x' => 1]);

        $this->assertCount(1, $this->bell()->forUser($this->pricing->id));
        $this->assertCount(0, $this->bell()->forUser($this->ops->id));

        $this->api($this->ops)
            ->getJson($this->url('/api/notifications'))
            ->assertOk()
            ->assertJsonPath('unread', 0);
    }

    /** ⚠️ Marking read is idempotent — a double-click or a second tab is not an error. */
    public function test_marking_read_twice_is_not_an_error(): void
    {
        $this->bell()->notify($this->branch->id, $this->pricing->id, 'App\\Notifications\\Routine', ['x' => 1]);
        $id = $this->bell()->forUser($this->pricing->id)[0]['id'];

        $this->api($this->pricing)->postJson($this->url("/api/notifications/{$id}/read"))
            ->assertOk()->assertJsonPath('unread', 0);
        $this->api($this->pricing)->postJson($this->url("/api/notifications/{$id}/read"))
            ->assertOk()->assertJsonPath('unread', 0);
    }

    /** You cannot mark someone else's notification read. */
    public function test_a_user_cannot_mark_anothers_notification_read(): void
    {
        $this->bell()->notify($this->branch->id, $this->pricing->id, 'App\\Notifications\\Routine', ['x' => 1]);
        $id = $this->bell()->forUser($this->pricing->id)[0]['id'];

        $this->api($this->ops)->postJson($this->url("/api/notifications/{$id}/read"))->assertOk();

        $this->assertSame(1, $this->bell()->unreadCount($this->pricing->id), 'Still unread for its owner.');
    }
}
