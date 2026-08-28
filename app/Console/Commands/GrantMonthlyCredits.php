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
 * 3. **Idempotent.** Skips any company that already has a `monthly_grant` row this
 *    calendar month. Without that, a re-run — a retried deploy, a double-fired
 *    scheduler — doubles everyone's balance.
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
                    if ($this->alreadyGrantedThisMonth($company->id, $monthStart)) {
                        $skipped++;
                        $this->line("  skip  {$company->name} — already granted this month");

                        continue;
                    }

                    // NULL => follow the tier. Never 0.
                    $allowance = $company->creditAllowance();

                    if ($dryRun) {
                        $this->line("  would {$company->name}: {$company->ocr_credits_balance} -> {$allowance}");
                        $granted++;

                        continue;
                    }

                    DB::transaction(function () use ($company, $allowance) {
                        DB::table('ocr_credit_transactions')->insert([
                            'company_id'       => $company->id,
                            'amount'           => $allowance,
                            'transaction_type' => 'monthly_grant',
                            'notes'            => "Monthly reset to {$allowance} ({$company->tier} tier)",
                            'created_at'       => now(),
                        ]);

                        // RESET, not increment.
                        Company::withoutGlobalScopes()->whereKey($company->id)
                            ->update(['ocr_credits_balance' => $allowance, 'updated_at' => now()]);
                    });

                    $granted++;
                    $this->line("  grant {$company->name}: {$allowance} credits ({$company->tier})");
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

    /** The idempotency guard — see rule 3. */
    private function alreadyGrantedThisMonth(int $companyId, $monthStart): bool
    {
        return DB::table('ocr_credit_transactions')
            ->where('company_id', $companyId)
            ->where('transaction_type', 'monthly_grant')
            ->where('created_at', '>=', $monthStart)
            ->exists();
    }
}
