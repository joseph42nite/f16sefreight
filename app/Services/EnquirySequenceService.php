<?php

namespace App\Services;

use App\Agent;
use Illuminate\Support\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * The SINGLE centralized path for every document number in the product.
 *
 * Enquiry, job, invoice, debit/credit note, brokerage, consol, purchase voucher, cargo
 * arrival notice, cover letter and manifest filing numbers all come from here
 * (PRD.md §6.3). There is no second counter anywhere.
 *
 * ═══ FORMAT ═════════════════════════════════════════════════════════════════
 *     {PREFIX}-{agent_code}-{fiscal_year}-{sequence}
 *     ENQA    - F16BOM     - 26          - 0001
 *
 * `agent_code` is `companies.code` + `agents_info.branch_code`, concatenated with NO
 * inner separator — an inner hyphen would make the number five parts and break every
 * parser and the chk_*_mode_prefix constraints.
 *
 * ═══ CONCURRENCY ════════════════════════════════════════════════════════════
 * Increment is a SINGLE atomic `UPDATE` taking an exclusive row lock. Redis locks are
 * deliberately NOT used: the database row lock is authoritative and simpler, and Redis
 * locks are reserved for non-database concerns (Plaid webhook dedup, API idempotency).
 *
 * 🔴 **It is not `SELECT … FOR UPDATE`, and that is the whole point.** The obvious
 * shape — ensure the row exists, lock it, read it, write it back — deadlocks reliably
 * under concurrent load, because `insertOrIgnore` on an existing row takes a SHARED lock
 * that the subsequent `FOR UPDATE` must upgrade to EXCLUSIVE. Concurrent minters all
 * hold S and all want X. Measured: six of eight parallel processes failed with
 * SQLSTATE 40001. See the comment on increment() and EnquirySequenceConcurrencyTest.
 *
 * ═══ FISCAL YEAR ════════════════════════════════════════════════════════════
 * April 1st rollover for Indian GST. February 2027 emits `26`, not `27` — the whole
 * reason this helper exists rather than `date('y')`.
 */
class EnquirySequenceService
{
    /** Zero-padding width of the sequence segment. */
    private const PAD = 4;

    /**
     * How many times a caller should replay a transaction that mints a number, after a
     * deadlock.
     *
     * 🔴 **The retry belongs to the CALLER, not to this service.** A deadlock aborts the
     * whole transaction, so increment() cannot retry inside one it does not own — see the
     * catch in increment(). Every `DB::transaction()` that mints a number passes this.
     */
    public const DEADLOCK_ATTEMPTS = 3;

    /**
     * Reserve the next number for a scope and return the formatted document number.
     *
     * @param  int     $agentId  the branch — counters are per-branch, so two branches
     *                           both issuing INV-…-26-0001 is correct, not a collision
     * @param  string  $prefix   ENQA | ENQS | ENQR | JOBA | JOBS | JOBR | INV | DN | CN
     *                           | BRK | CSINV | PV | CAN | CL | MF
     */
    public function next(int $agentId, string $prefix, ?Carbon $at = null): string
    {
        $fiscalYear = $this->fiscalYear($at);
        $agentCode = $this->agentCode($agentId);

        $value = $this->increment($agentId, $prefix, $fiscalYear);

        return sprintf(
            '%s-%s-%s-%s',
            $prefix,
            $agentCode,
            $fiscalYear,
            str_pad((string) $value, self::PAD, '0', STR_PAD_LEFT)
        );
    }

    /**
     * The counter increment itself. Returns the new value.
     *
     * Callers should normally use next(); this is exposed for the rare case of reserving
     * a value without formatting it.
     */
    public function increment(int $agentId, string $prefix, string $fiscalYear): int
    {
        // ═══ WHY THIS IS NOT `SELECT … FOR UPDATE` ══════════════════════════════
        // 🔴 The obvious implementation — insertOrIgnore, then lockForUpdate, then
        // update — DEADLOCKS under real concurrency, and it was measured doing so:
        // six of eight parallel minters died with SQLSTATE 40001 (see
        // EnquirySequenceConcurrencyTest).
        //
        // The mechanism: when `insertOrIgnore` hits an existing row, InnoDB takes a
        // SHARED lock on it to check the duplicate key. `lockForUpdate` then asks to
        // upgrade that S lock to EXCLUSIVE. Every concurrent minter is holding S and
        // waiting for X, so none can proceed — a lock-upgrade deadlock, guaranteed
        // rather than occasional.
        //
        // A single `UPDATE` takes X directly. There is no S lock to upgrade from and
        // therefore no upgrade deadlock. `LAST_INSERT_ID(expr)` stores the new value
        // for retrieval on this connection, so the increment and the read of what we
        // got are one atomic statement rather than two racing ones.
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $affected = DB::update(
                'UPDATE sequence_counters
                    SET current_value = LAST_INSERT_ID(current_value + 1),
                        updated_at = ?
                  WHERE agent_id = ? AND prefix = ? AND fiscal_year = ?',
                [now(), $agentId, $prefix, $fiscalYear]
            );

            if ($affected === 1) {
                // ⚠️ `useReadPdo: false` is required, not stylistic. LAST_INSERT_ID() is
                // per-connection state; on a read/write-split configuration a default
                // SELECT goes to the replica and returns another connection's value —
                // or zero. The number must be read back on the connection that set it.
                return (int) DB::select('SELECT LAST_INSERT_ID() AS v', [], false)[0]->v;
            }

            // No row yet: the FIRST number of this fiscal year for this scope. Create it
            // already claiming 1.
            //
            // 🔴 This insert genuinely can deadlock, and the retry is why the loop exists.
            // An INSERT against a key that does not exist takes an insert-intention lock
            // on the gap; several processes creating the same missing row contend on that
            // gap and MySQL kills one. Unlike the update path this cannot be designed
            // away — the row has to be created by somebody — so it is caught and retried.
            //
            // ⚠️ Only reachable on the first mint of a (branch, prefix, fiscal year):
            // April 1st, and the first document of every newly-created branch. Precisely
            // when the least attention is being paid. It surfaced in the full suite and
            // NOT in an isolated run, because an earlier run had already created the row.
            try {
                $created = DB::table('sequence_counters')->insertOrIgnore([
                    'agent_id'      => $agentId,
                    'prefix'        => $prefix,
                    'fiscal_year'   => $fiscalYear,
                    'current_value' => 1,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ]);

                if ($created === 1) {
                    return 1;
                }
            } catch (QueryException $e) {
                // 🔴 **A deadlock aborts the whole TRANSACTION, not just this statement.**
                // If a caller owns that transaction, retrying here would run the next
                // attempt inside a transaction MySQL has already rolled back — which
                // fails as "There is no active transaction" and hides the real cause.
                // The retry has to happen at the transaction boundary, so rethrow and let
                // the owner replay its unit of work. Every caller passes an attempt count
                // to DB::transaction() for exactly this.
                if (DB::transactionLevel() > 0 || ! $this->isRetryable($e)) {
                    throw $e;
                }
            }

            // A short jittered pause, so retries do not re-collide in lockstep.
            usleep(random_int(1_000, 10_000));
        }

        // Five failures means the row can neither be updated nor created, which is not
        // contention. Refusing beats returning a number nobody reserved.
        throw new RuntimeException(
            "Could not reserve a {$prefix} number for branch #{$agentId} in fiscal year {$fiscalYear}."
        );
    }

    /**
     * Deadlock (1213) and lock-wait timeout (1205) are CONTENTION, not failure — the
     * work is still valid and retrying is the correct response. A duplicate key (1062)
     * means somebody else created the row first, which is a win for us: loop and take
     * the UPDATE path.
     */
    private function isRetryable(QueryException $e): bool
    {
        return in_array((int) ($e->errorInfo[1] ?? 0), [1213, 1205, 1062], true);
    }

    /**
     * `companies.code` + `agents_info.branch_code`.
     *
     * 🔴 **Fails loudly rather than emitting a malformed number.** Both columns are
     * nullable and were empty when they were introduced (GAPS.md #2). A missing code
     * would silently produce `ENQA--26-0001`, and a document number is not something to
     * discover is wrong after it has been sent to a client or filed with customs.
     */
    public function agentCode(int $agentId): string
    {
        $row = Agent::withoutGlobalScopes()
            ->join('companies', 'companies.id', '=', 'agents_info.company_id')
            ->where('agents_info.id', $agentId)
            ->first(['agents_info.branch_code', 'companies.code as company_code', 'agents_info.agent_name']);

        if ($row === null) {
            throw new RuntimeException("Cannot build a document number: branch #{$agentId} does not exist.");
        }

        $missing = [];

        if (blank($row->company_code)) {
            $missing[] = 'companies.code';
        }

        if (blank($row->branch_code)) {
            $missing[] = 'agents_info.branch_code';
        }

        if ($missing !== []) {
            throw new RuntimeException(sprintf(
                'Cannot build a document number for branch #%d (%s): %s %s not set. '
                . 'Both are required to form the {agent_code} segment — see GAPS.md #2.',
                $agentId,
                $row->agent_name ?? 'unnamed',
                implode(' and ', $missing),
                count($missing) === 1 ? 'is' : 'are'
            ));
        }

        return $row->company_code . $row->branch_code;
    }

    /**
     * Two-digit FISCAL year. April 1st rollover (Indian GST).
     *
     * Any month from April onwards belongs to the year that just started; January to
     * March still belong to the previous one. This is what makes a February 2027 document
     * read `26`, matching the fiscal year the accounts are kept in.
     */
    public function fiscalYear(?Carbon $at = null): string
    {
        $now = $at ? $at->copy() : now();

        return $now->month >= 4 ? $now->format('y') : $now->subYear()->format('y');
    }

    /** Read the current value without reserving one. Never use this to mint a number. */
    public function peek(int $agentId, string $prefix, ?string $fiscalYear = null): int
    {
        return (int) DB::table('sequence_counters')
            ->where('agent_id', $agentId)
            ->where('prefix', $prefix)
            ->where('fiscal_year', $fiscalYear ?? $this->fiscalYear())
            ->value('current_value');
    }
}
