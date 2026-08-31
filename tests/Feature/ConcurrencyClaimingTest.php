<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\Support\SpawnsChildProcesses;
use Tests\TestCase;

/**
 * Simultaneous claiming — guide §8.1: *"Simultaneous claims — the loser receives 409"*.
 *
 * 🔴 **Two operators must never both believe a job is theirs.** The consequence is not a
 * database inconsistency — `ops_id` holds exactly one value either way — it is that both
 * people work the shipment, one files against the other's filing, and neither knows until
 * a customs broker asks which of the two submissions is real.
 *
 * ⚠️ **This test does NOT use `DatabaseTransactions`.** Child processes have their own
 * connections and cannot see rows held in an uncommitted transaction. Rows are cleaned up
 * by hand, and the tenant is REUSED rather than recreated: `claim` writes an
 * `audit_logs` row, that table is append-only by trigger, and it carries foreign keys to
 * `agents_info` and `users` — so a tenant created here could never be deleted again. A
 * stable fixture is the only shape that does not accumulate garbage on every run.
 */
class ConcurrencyClaimingTest extends TestCase
{
    use SpawnsChildProcesses;

    private Agent $branch;
    private User $alice;
    private User $bob;
    private array $jobIds = [];
    private array $enquiryIds = [];

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::firstOrCreate(
            ['code' => 'CCT'],
            ['name' => 'Claim Test Co', 'tier' => 'command']
        );

        $this->branch = Agent::withoutGlobalScopes()->firstOrCreate(
            ['company_id' => $company->id, 'branch_code' => 'CCB'],
            ['agent_name' => 'Claim Branch']
        );

        $this->alice = $this->operator('alice-cct@test.local', $company);
        $this->bob = $this->operator('bob-cct@test.local', $company);
    }

    protected function tearDown(): void
    {
        DB::table('jobs')->whereIn('id', $this->jobIds)->delete();
        DB::table('enquiries')->whereIn('id', $this->enquiryIds)->delete();

        parent::tearDown();
    }

    private function operator(string $email, Company $company): User
    {
        return User::withoutGlobalScopes()->firstOrCreate(
            ['email' => $email],
            [
                'name' => $email, 'password' => Hash::make('x'),
                'company_name' => $company->id, 'branch_name' => $this->branch->id,
                'designation' => 'operations', 'is_active' => 1,
            ]
        );
    }

    private function unclaimedJob(string $mode = 'air'): int
    {
        $enquiryId = DB::table('enquiries')->insertGetId([
            'agent_id' => $this->branch->id, 'transport_mode' => $mode,
            'enquiry_no' => 'ENQ' . strtoupper($mode[0]) . '-CCT-26-' . random_int(1000, 9999),
            'status' => 'converted', 'created_at' => now(), 'updated_at' => now(),
        ]);
        $this->enquiryIds[] = $enquiryId;

        $jobId = DB::table('jobs')->insertGetId([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiryId,
            'transport_mode' => $mode, 'status' => 'Intake', 'ops_id' => null,
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $this->jobIds[] = $jobId;

        return $jobId;
    }

    private function token(User $user): string
    {
        return auth()->guard('user-api')->login($user);
    }

    /** Fire N claims on one job from N separate OS processes; return their status codes. */
    private function raceClaims(int $jobId, array $users, string $host = 'focusair.localhost'): array
    {
        $commands = array_map(
            fn (User $u) => $this->httpChild('POST', "http://{$host}/api/jobs/{$jobId}/claim", $this->token($u)),
            $users
        );

        [$outputs, $stderr] = $this->runInParallel($commands);

        $results = [];

        foreach ($outputs as $out) {
            if (preg_match('/^(\d{3})/', trim($out), $m)) {
                $results[] = (int) $m[1];
            }
        }

        $this->assertCount(count($users), $results,
            "Not every child completed, so the race proves nothing. stderr:\n" . $stderr);

        return $results;
    }

    // ─── The race itself ─────────────────────────────────────────────────────

    /**
     * 🔴 SIX PROCESSES, ONE WINNER. `claim` is a conditional UPDATE — `WHERE ops_id IS
     * NULL` — so the database decides, not the application. The read-then-write shape
     * this replaces would let all six read NULL and all six believe they won.
     */
    public function test_simultaneous_claims_produce_exactly_one_winner(): void
    {
        $jobId = $this->unclaimedJob();

        $users = [$this->alice, $this->bob, $this->alice, $this->bob, $this->alice, $this->bob];
        $codes = $this->raceClaims($jobId, $users);

        $this->assertSame(1, count(array_keys($codes, 200)),
            'Exactly one claim must succeed. Got: ' . implode(', ', $codes));

        $this->assertSame(count($users) - 1, count(array_keys($codes, 409)),
            'Every loser must receive 409, not 500 or 200. Got: ' . implode(', ', $codes));
    }

    /** The winner is recorded, and it is one of the two racers — never NULL, never both. */
    public function test_the_winner_is_the_one_recorded_on_the_job(): void
    {
        $jobId = $this->unclaimedJob();

        $this->raceClaims($jobId, [$this->alice, $this->bob, $this->alice, $this->bob]);

        $opsId = DB::table('jobs')->where('id', $jobId)->value('ops_id');

        $this->assertNotNull($opsId, 'The job is unowned after four claims.');
        $this->assertContains((int) $opsId, [$this->alice->id, $this->bob->id]);
    }

    /**
     * ⚠️ The loser's 409 must be a REASON, not a bare status. The Kanban shows it to a
     * person who is about to lose the card they just clicked; "already claimed" is the
     * difference between an explanation and a bug report.
     */
    public function test_the_loser_is_told_why(): void
    {
        $jobId = $this->unclaimedJob();

        $this->withHeaders(['Authorization' => 'Bearer ' . $this->token($this->alice), 'Accept' => 'application/json'])
            ->postJson("http://focusair.localhost/api/jobs/{$jobId}/claim")->assertOk();

        $this->withHeaders(['Authorization' => 'Bearer ' . $this->token($this->bob), 'Accept' => 'application/json'])
            ->postJson("http://focusair.localhost/api/jobs/{$jobId}/claim")
            ->assertStatus(409)
            ->assertJsonPath('reason', 'already_claimed');
    }

    /**
     * ⚠️ Re-claiming a job you ALREADY own is still 409, not a silent success. It reads
     * as harmless, but a 200 here would mean the endpoint is not really testing
     * `ops_id IS NULL`, and the same weakness is what lets a second operator in.
     */
    public function test_claiming_a_job_you_already_own_is_also_refused(): void
    {
        $jobId = $this->unclaimedJob();
        $headers = ['Authorization' => 'Bearer ' . $this->token($this->alice), 'Accept' => 'application/json'];

        $this->withHeaders($headers)->postJson("http://focusair.localhost/api/jobs/{$jobId}/claim")->assertOk();
        $this->withHeaders($headers)->postJson("http://focusair.localhost/api/jobs/{$jobId}/claim")->assertStatus(409);
    }
}
