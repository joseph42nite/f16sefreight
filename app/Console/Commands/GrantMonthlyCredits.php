<?php

namespace App\Console\Commands;

use App\Company;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Refill every active tenant's OCR credit balance. Monthly, on the 1st.
 *
 * ⚠️ **NOTHING ELSE REFILLS A BALANCE.** `companies.ocr_credits_monthly_allowance` and
 * the `monthly_grant` transaction type both existed from the start, but no command ever
 * applied them — so balances only ever decreased and every tenant would eventually
 * hard-stop and never recover (GAPS.md, found while sizing allowances).
 *
 * Three rules, each of which is a real failure if broken:
 *
 * 1. **RESET to the allowance, never add to it.** Adding would let an unused month
 *    accumulate into an open-ended liability. The negative `ocr_credits_limit` floor is
 *    what stops a busy month failing mid-shipment, not a savings balance.
 *
 * 2. **NULL on the company means "follow the tier" — never treat it as zero.** A NULL
 *    allowance resolves from `config/f16s.php`; a non-NULL value is a deliberate
 *    superadmin override pinned to that tenant. Reading NULL as 0 would silently strip
 *    every ordinary tenant of their credits.
 *
 * 3. **Idempotent.** Skips any company already granted its allowance this calendar
 *    month. Without that, a re-run — a retried deploy, a double-fired scheduler —
 *    doubles everyone's balance.
 *
 * 4. **A company never waits for the 1st** (2026-09-17: F16s Base, created on the 10th,
 *    showed 0 credits). Runs hourly: a company with no grant this month gets its full
 *    allowance, and one granted less than its allowance (moved up a plan mid-month) gets
 *    the difference added.
 */
class GrantMonthlyCredits extends Command
{
    protected $signature = 'credits:grant-monthly
                            {--dry-run : Report what would change without writing}';

    protected $description = 'Reset every tenant OCR credit balance to its monthly allowance';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $monthStart = now()->startOfMonth();

        $granted = 0;
        $skipped = 0;

        // withoutGlobalScopes: this is a platform-wide command with no acting user.
        Company::withoutGlobalScopes()->whereNull('deleted_at')->orderBy('id')
            ->chunkById(100, function ($companies) use (&$granted, &$skipped, $monthStart, $dryRun) {
                foreach ($companies as $company) {
                    // NULL => follow the tier. Never 0.
                    $allowance = $company->creditAllowance();
                    $grantedSoFar = $this->grantedThisMonth($company->id, $monthStart);

                    if ($grantedSoFar !== null && $grantedSoFar >= $allowance) {
                        $skipped++;
                        $this->line("  skip  {$company->name} — already granted this month");

                        continue;
                    }

                    // First grant of the month resets to the allowance; a later one adds what a plan change is owed.
                    $amount = $grantedSoFar === null ? $allowance : $allowance - $grantedSoFar;
                    // round(): the balance is DECIMAL(12,2) now and carries fractions spent on mail.
                    $newBalance = $grantedSoFar === null ? $allowance : round($company->ocr_credits_balance + $amount, 2);

                    if ($dryRun) {
                        $this->line("  would {$company->name}: {$company->ocr_credits_balance} -> {$newBalance}");
                        $granted++;

                        continue;
                    }

                    DB::transaction(function () use ($company, $amount, $allowance, $newBalance, $grantedSoFar) {
                        DB::table('ocr_credit_transactions')->insert([
                            'company_id'       => $company->id,
                            'amount'           => $amount,
                            'transaction_type' => 'monthly_grant',
                            'notes'            => $grantedSoFar === null
                                ? "Monthly reset to {$allowance} ({$company->tier} tier)"
                                : "Topped up by {$amount} to this month's {$allowance} ({$company->tier} tier)",
                            'created_at'       => now(),
                        ]);

                        Company::withoutGlobalScopes()->whereKey($company->id)
                            ->update(['ocr_credits_balance' => $newBalance, 'updated_at' => now()]);
                    });

                    $granted++;
                    $this->line("  grant {$company->name}: {$amount} credits ({$company->tier})");
                }
            });

        $this->info(sprintf(
            '%s%d tenant(s) granted, %d skipped as already granted this month.',
            $dryRun ? '[dry run] ' : '',
            $granted,
            $skipped
        ));

        return self::SUCCESS;
    }

    /** What this month's grants add up to, or null when there has been none — rules 3 and 4. */
    private function grantedThisMonth(int $companyId, $monthStart): ?float
    {
        $grants = DB::table('ocr_credit_transactions')
            ->where('company_id', $companyId)
            ->where('transaction_type', 'monthly_grant')
            ->where('created_at', '>=', $monthStart);

        return $grants->exists() ? (float) $grants->sum('amount') : null;
    }
}
