<?php

namespace App\Services;

use App\Agent;
use Illuminate\Support\Carbon;
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
 * Increment runs inside a transaction holding a row-level write lock. Redis locks are
 * deliberately NOT used: the database row lock is authoritative and simpler, and Redis
 * locks are reserved for non-database concerns (Plaid webhook dedup, API idempotency).
 *
 * ⚠️ **The row is created BEFORE it is locked, and that is not incidental.**
 * `SELECT … FOR UPDATE` on a row that does not exist takes a GAP lock rather than a row
 * lock, and two branches minting their first number of a fiscal year concurrently can
 * deadlock on it — on April 1st, under load, which is exactly when nobody is watching.
 * `insertOrIgnore` first means the row always exists by the time we lock it, so the lock
 * is a plain row lock. The UNIQUE key makes the insert safe to race.
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
        return DB::transaction(function () use ($agentId, $prefix, $fiscalYear) {
            // Ensure the row exists BEFORE locking — see the class docblock on gap locks.
            // Racing inserts collide on uq_counter_agent_prefix_fy and are ignored.
            DB::table('sequence_counters')->insertOrIgnore([
                'agent_id'      => $agentId,
                'prefix'        => $prefix,
                'fiscal_year'   => $fiscalYear,
                'current_value' => 0,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);

            $row = DB::table('sequence_counters')
                ->where('agent_id', $agentId)
                ->where('prefix', $prefix)
                ->where('fiscal_year', $fiscalYear)
                ->lockForUpdate()
                ->first();

            $next = (int) $row->current_value + 1;

            DB::table('sequence_counters')
                ->where('id', $row->id)
                ->update(['current_value' => $next, 'updated_at' => now()]);

            return $next;
        });
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
