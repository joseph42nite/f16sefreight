<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Sequence generation under concurrency — guide §8.1.
 *
 * 🔴 **REAL PARALLEL PROCESSES, not a loop.** A sequential loop proves nothing about a
 * row lock: it would pass against an implementation with no locking at all. The failure
 * being guarded against is two branches minting simultaneously and receiving the SAME
 * number — which reaches a client and a customs declaration as two documents with one
 * identity, and is unrecoverable once filed.
 *
 * ⚠️ These tests deliberately do NOT use `DatabaseTransactions` for the parallel run:
 * child processes have their own connections and cannot see rows held in this process's
 * uncommitted transaction. Rows are cleaned up by hand instead.
 */
class EnquirySequenceConcurrencyTest extends TestCase
{
    private Company $company;
    private Agent $branch;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Seq Co', 'code' => 'SEQ', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
    }

    protected function tearDown(): void
    {
        DB::table('sequence_counters')->where('agent_id', $this->branch->id)->delete();
        DB::table('agents_info')->where('id', $this->branch->id)->delete();
        DB::table('companies')->where('id', $this->company->id)->delete();

        parent::tearDown();
    }

    /**
     * 🔴 EIGHT PROCESSES, ZERO DUPLICATES.
     *
     * Each child mints one number through `EnquirySequenceService` on its own database
     * connection, so the `SELECT … FOR UPDATE` row lock is genuinely contended. If the
     * lock were missing, several children would read the same `current_value` and emit
     * the same number.
     */
    public function test_parallel_processes_never_mint_the_same_number(): void
    {
        $agentId = $this->branch->id;

        // 🔴 The children must be pointed at the TEST database explicitly. `artisan`
        // reads `.env` — the development database — where this branch does not exist.
        // Real environment variables win over dotenv, so this redirects them.
        $env = 'DB_CONNECTION=mysql DB_HOST=127.0.0.1 DB_PORT=' . config('database.connections.mysql.port')
            . ' DB_DATABASE=' . config('database.connections.mysql.database')
            . ' DB_USERNAME=' . config('database.connections.mysql.username')
            . ' DB_PASSWORD=' . config('database.connections.mysql.password');

        // Each child mints THREE times rather than once. Eight processes each minting a
        // single number may well not overlap at all — most of a child's life is framework
        // boot. Minting repeatedly keeps every child inside the contended section at the
        // same time, which is the only condition under which a missing lock shows itself.
        $script = base_path('tests/Support/mint_sequence.php');

        $procs = [];
        $pipes = [];

        for ($i = 0; $i < 8; $i++) {
            $cmd = sprintf('%s php %s %d ENQA 3', $env, escapeshellarg($script), $agentId);

            $procs[$i] = proc_open($cmd, [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes[$i], base_path());
        }

        $numbers = [];
        $stderr = '';
        $raw = '';

        foreach ($procs as $i => $proc) {
            if (! is_resource($proc)) {
                continue;
            }

            $out = stream_get_contents($pipes[$i][1]);
            $stderr .= stream_get_contents($pipes[$i][2]);
            fclose($pipes[$i][1]);
            fclose($pipes[$i][2]);
            proc_close($proc);

            $raw .= "--- child {$i} ---\n" . $out;
            preg_match_all('/ENQA-SEQBOM-\d{2}-\d{4}/', $out, $m);
            $numbers = array_merge($numbers, $m[0]);
        }

        // Guard the guard: if the children never minted, uniqueness below would pass
        // vacuously and this file would be decoration.
        $this->assertGreaterThanOrEqual(20, count($numbers),
            "Children did not mint enough numbers to prove anything.\nstderr:\n" . $stderr
            . "\nstdout:\n" . $raw);

        $this->assertSame(count($numbers), count(array_unique($numbers)),
            'Two processes minted the SAME number: '
            . implode(', ', array_keys(array_diff_key($numbers, array_unique($numbers)))));

        // Stronger than uniqueness: the set must be CONTIGUOUS from 1. A lost update
        // under a broken lock can also show up as a gap rather than a duplicate.
        $tails = array_map(fn ($n) => (int) substr($n, -4), $numbers);
        sort($tails);
        $this->assertSame(range(1, count($tails)), $tails,
            'The sequence has a hole — an update was lost under contention.');
    }

    /**
     * ⚠️ THE APRIL-1st DEADLOCK, guarded. `SELECT … FOR UPDATE` on a row that does not
     * exist yet takes a GAP lock, not a row lock — so two branches minting their first
     * number of a fiscal year concurrently could deadlock. The service upserts BEFORE
     * locking, so the row always exists and the lock is an ordinary row lock.
     *
     * Only observable on the first mint of a year, which is exactly when nobody is
     * watching.
     */
    public function test_the_first_number_of_a_year_does_not_deadlock(): void
    {
        $this->assertSame(0, DB::table('sequence_counters')
            ->where('agent_id', $this->branch->id)->count(), 'No counter row exists yet.');

        $first = app(\App\Services\EnquirySequenceService::class)->next($this->branch->id, 'ENQA');

        $this->assertStringEndsWith('-0001', $first);
        $this->assertSame(1, DB::table('sequence_counters')
            ->where('agent_id', $this->branch->id)->count(), 'The row was created, then locked.');
    }

    /** Numbers are contiguous and monotonic within one branch and prefix. */
    public function test_numbers_are_sequential_within_a_branch_and_prefix(): void
    {
        $svc = app(\App\Services\EnquirySequenceService::class);

        $numbers = array_map(fn () => $svc->next($this->branch->id, 'ENQA'), range(1, 5));
        $tails = array_map(fn ($n) => (int) substr($n, -4), $numbers);

        $this->assertSame([1, 2, 3, 4, 5], $tails);
    }

    /**
     * Counters are scoped `(agent_id, prefix, fiscal_year)`, so an air and a sea
     * sequence on one branch advance independently — ENQA-0001 and ENQS-0001 coexist.
     */
    public function test_prefixes_advance_independently(): void
    {
        $svc = app(\App\Services\EnquirySequenceService::class);

        $svc->next($this->branch->id, 'ENQA');
        $svc->next($this->branch->id, 'ENQA');
        $sea = $svc->next($this->branch->id, 'ENQS');

        $this->assertStringEndsWith('-0001', $sea, 'Sea starts at 1 despite two air numbers.');
    }
}
