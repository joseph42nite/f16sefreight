<?php

namespace App\Services;

use App\SequenceCounter;
use Illuminate\Support\Facades\DB;

/**
 * EnquirySequenceService
 *
 * This is the single, centralized transaction path for all sequence generation
 * (enquiry numbers, job numbers) across the application.
 *
 * Uses database row-level FOR UPDATE locking to prevent race conditions in
 * concurrent multi-process environments. All sequence generation MUST route
 * through this service — never generate sequences inline.
 *
 * Concurrency Safety: Verified via parallel-process concurrency testing
 * (see tests/Feature/EnquirySequenceConcurrencyTest.php).
 */
class EnquirySequenceService
{
    /**
     * Generate the next sequential enquiry number for a given agent and mode.
     *
     * Format:
     *   - Air Export: ENQA-{YY}-{NNNN}  (e.g. ENQA-26-0001)
     *   - Sea Export: ENQS-{YY}-{NNNN}  (e.g. ENQS-26-0001)
     *
     * @param  int    $agentId
     * @param  string $transportMode   'air' | 'sea'
     * @return string
     */
    public function nextEnquiryNumber(int $agentId, string $transportMode): string
    {
        $prefix     = $transportMode === 'air' ? 'ENQA' : 'ENQS';
        $fiscalYear = now()->format('y'); // Two-digit year

        return $this->generateSequence($agentId, $prefix, $fiscalYear);
    }

    /**
     * Generate the next execution job number for a given agent and mode.
     *
     * Format:
     *   - Air: JOBA-{YY}-{NNNN}  (e.g. JOBA-26-0001)
     *   - Sea: JOBS-{YY}-{NNNN}  (e.g. JOBS-26-0001)
     *
     * @param  int    $agentId
     * @param  string $transportMode   'air' | 'sea'
     * @return string
     */
    public function nextExecutionJobNumber(int $agentId, string $transportMode): string
    {
        $prefix     = $transportMode === 'air' ? 'JOBA' : 'JOBS';
        $fiscalYear = now()->format('y');

        return $this->generateSequence($agentId, $prefix, $fiscalYear);
    }

    /**
     * Core sequence generation with row-level locking.
     *
     * Wrapped in a DB transaction with SELECT ... FOR UPDATE to guarantee
     * no two concurrent processes can claim the same sequence number.
     *
     * @param  int    $agentId
     * @param  string $prefix
     * @param  string $fiscalYear  Two-digit year string (e.g. '26')
     * @return string
     */
    private function generateSequence(int $agentId, string $prefix, string $fiscalYear): string
    {
        return DB::transaction(function () use ($agentId, $prefix, $fiscalYear) {
            // Row-level lock prevents any other transaction from reading this
            // row until we commit, eliminating duplicate sequence generation.
            $counter = SequenceCounter::where('agent_id', $agentId)
                ->where('prefix', $prefix)
                ->where('fiscal_year', $fiscalYear)
                ->lockForUpdate()
                ->first();

            if (!$counter) {
                $counter = SequenceCounter::create([
                    'agent_id'      => $agentId,
                    'prefix'        => $prefix,
                    'fiscal_year'   => $fiscalYear,
                    'current_value' => 0,
                ]);
            }

            $counter->increment('current_value');
            $counter->refresh();

            // Format: PREFIX-YY-NNNN (zero-padded to 4 digits)
            return sprintf('%s-%s-%04d', $prefix, $fiscalYear, $counter->current_value);
        });
    }
}
