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
 * The handover lifecycle — guide §8.1: *"Request pins with elevated priority; withdraw
 * hard-deletes the notification; accept promotes pending → live"*.
 *
 * ⚠️ Those three clauses are already asserted in `BellNotificationTest`
 * (`test_requesting_a_handover_pins_a_notification_for_the_owner`,
 * `test_withdrawing_a_handover_removes_the_notification_entirely`,
 * `test_accepting_a_handover_moves_the_job_and_clears_the_bell`). Rather than restate
 * them, this file covers the ways a staged handover can be left **stranded** — the paths
 * that end with a request nobody can answer, or a bell card for a request that no longer
 * exists. Every one of them looks fine from the acting user's side.
 */
class ReassignmentFlowTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $pricing;
    private User $ops;
    private User $target;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Handover Co', 'code' => 'HND', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);

        $this->pricing = $this->user('pricing');
        $this->ops = $this->user('operations');
        $this->target = $this->user('operations', '-t');
    }

    private function user(string $designation, string $suffix = ''): User
    {
        return User::create([
            'name' => ucfirst($designation) . $suffix, 'email' => "{$designation}{$suffix}-hnd@test.local",
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

    private function url(string $path): string
    {
        return 'http://focusair.localhost' . $path;
    }

    private function job(?int $pricingId = null): Job
    {
        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-HNDBOM-26-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
        ]);

        return Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'ops_id' => $this->ops->id,
            'pricing_id' => func_num_args() > 0 ? $pricingId : $this->pricing->id,
            'execution_job_no' => 'JOBA-HNDBOM-26-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
            'status' => 'Verification',
        ]);
    }

    private function bellCount(Job $job): int
    {
        return DB::table('notifications')
            ->where('type', BellNotificationService::REASSIGNMENT)
            ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.job_id')) = ?", [(string) $job->id])
            ->count();
    }

    private function request(Job $job): void
    {
        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/request"), ['ops_id' => $this->target->id])
            ->assertStatus(202);
    }

    // ─── 1. A direct reassignment while a request is pending ─────────────────

    /**
     * 🔴 THE STALE CARD. Pricing can assign directly at any time, including while an
     * operations request is staged. `reassign()` clears `pending_ops_id`, so the request
     * is gone from the job — but the bell card survives, still offering [Accept] /
     * [Reject] for a handover that no longer exists. Answering it returns
     * `422 nothing_pending`, which reads to the owner as the product being broken.
     */
    public function test_a_direct_reassignment_clears_the_pending_bell_card(): void
    {
        $job = $this->job();
        $this->request($job);

        $this->assertSame(1, $this->bellCount($job), 'The request raised a card.');

        $this->api($this->pricing)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign"), ['ops_id' => $this->target->id])
            ->assertOk();

        $this->assertSame(0, $this->bellCount($job),
            'A direct reassignment left a bell card for a request that no longer exists.');
    }

    /**
     * ⚠️ And it clears the whole staging record, not two thirds of it.
     * `pending_ops_requested_at` left behind is a timestamp for a request that is gone —
     * every "how long has this been waiting?" query counts it forever.
     */
    public function test_a_direct_reassignment_leaves_no_partial_staging_behind(): void
    {
        $job = $this->job();
        $this->request($job);

        $this->api($this->pricing)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign"), ['ops_id' => $this->target->id])
            ->assertOk();

        $fresh = $job->fresh();

        $this->assertNull($fresh->pending_ops_id);
        $this->assertNull($fresh->pending_ops_requested_by);
        $this->assertNull($fresh->pending_ops_requested_at,
            'A staging timestamp survived the request it belonged to.');
    }

    // ─── 2. A request nobody can answer ──────────────────────────────────────

    /**
     * 🔴 AN UNOWNED JOB HAS NOBODY TO ASK. `requestReassignment` only notifies when
     * `pricing_id` is set; on an unowned job the request is staged and NO notification is
     * raised, so it waits for a decision nobody will ever be asked to make. The operator
     * who asked sees their request accepted (202) and hears nothing again.
     *
     * The endpoint must not accept a request it cannot deliver.
     */
    public function test_requesting_a_handover_on_an_unowned_job_is_refused(): void
    {
        $job = $this->job(null);

        $response = $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/request"), ['ops_id' => $this->target->id]);

        $this->assertSame(422, $response->getStatusCode(),
            'A handover request with no owner to approve it must be refused, not silently staged.');
        $this->assertSame('no_owner', $response->json('reason'));

        $this->assertNull($job->fresh()->pending_ops_id,
            'A refused request must not leave staging behind.');
    }

    // ─── 3. The clauses §8.1 names, at their edges ───────────────────────────

    /** Accept promotes pending → live, and the staging record is fully cleared. */
    public function test_accepting_promotes_the_pending_operator(): void
    {
        $job = $this->job();
        $this->request($job);

        $this->api($this->pricing)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/resolve"), ['decision' => 'accept'])
            ->assertOk();

        $fresh = $job->fresh();

        $this->assertSame($this->target->id, (int) $fresh->ops_id);
        $this->assertNull($fresh->pending_ops_id);
        $this->assertSame(0, $this->bellCount($job));
    }

    /**
     * ⚠️ Reject leaves the ORIGINAL operator in place. Staging exists precisely so a
     * request cannot move work on its own; a reject that still moved it would make the
     * approval decorative.
     */
    public function test_rejecting_leaves_the_original_operator_in_place(): void
    {
        $job = $this->job();
        $this->request($job);

        $this->api($this->pricing)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/resolve"), ['decision' => 'reject'])
            ->assertOk();

        $this->assertSame($this->ops->id, (int) $job->fresh()->ops_id);
        $this->assertSame(0, $this->bellCount($job));
    }

    /**
     * 🔴 Resolving a request that has already been answered is `422`, not a second
     * promotion. Two owners clicking [Accept] on the same pinned card — which is exactly
     * what a pinned card invites — must not apply twice.
     */
    public function test_resolving_twice_is_refused(): void
    {
        $job = $this->job();
        $this->request($job);

        $this->api($this->pricing)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/resolve"), ['decision' => 'accept'])
            ->assertOk();

        $this->api($this->pricing)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/resolve"), ['decision' => 'accept'])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'nothing_pending');
    }

    /** A superseding request replaces the first rather than stacking two cards. */
    public function test_a_second_request_does_not_stack_a_second_card(): void
    {
        $job = $this->job();

        $this->request($job);
        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign/request"), ['ops_id' => $this->ops->id])
            ->assertStatus(202);

        $this->assertSame(1, $this->bellCount($job),
            'Two pinned cards for one job make the owner answer a request that is no longer current.');
    }
}
