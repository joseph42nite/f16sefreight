<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * P&L · Balance Sheet · Trial Balance — PRD.md §6.8.
 *
 * 🔴 The rule these exist for: **a report runs over a PERIOD, never a free date range.**
 * A period is the unit an accountant signs off. A P&L for "1–15 August" is a number
 * nobody can reconcile against anything they have ever filed — and it gets believed,
 * because it looks like a report.
 */
class FinancialReportsTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $accounts;
    private int $periodId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Report Co', 'code' => 'RPT', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = $this->user('accounts');

        $this->periodId = DB::table('accounting_periods')->insertGetId([
            'agent_id' => $this->branch->id, 'period_name' => 'FY26 Q1',
            'start_date' => now()->startOfYear()->toDateString(),
            'end_date' => now()->endOfYear()->toDateString(),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function user(string $designation): User
    {
        return User::create([
            'name' => $designation, 'email' => "{$designation}-rpt@test.local", 'password' => Hash::make('x'),
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

    private function url(string $path, string $host = 'accounts.f16sefreight.com'): string
    {
        return "http://{$host}{$path}";
    }

    /**
     * ⚠️ Resolve-or-create. `uq_coa_agent_code (agent_id, account_code)` means one row
     * per code per branch — posting twice to Freight Revenue must reuse the account,
     * not create a second one, and the constraint caught this helper doing the latter.
     */
    private function account(string $code, string $name): int
    {
        $id = DB::table('chart_of_accounts')
            ->where('agent_id', $this->branch->id)->where('account_code', $code)->value('id');

        return $id ?: DB::table('chart_of_accounts')->insertGetId([
            'agent_id' => $this->branch->id, 'account_code' => $code, 'account_name' => $name,
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function entry(string $code, string $name, float $debit, float $credit, ?int $periodId = null): void
    {
        DB::table('accounts_ledger_entries')->insert([
            'agent_id' => $this->branch->id,
            'chart_of_account_id' => $this->account($code, $name),
            'accounting_period_id' => $periodId ?? $this->periodId,
            'posting_date' => now()->toDateString(),
            'debit_amount' => $debit, 'credit_amount' => $credit,
            'source_id' => 1, 'source_type' => 'invoice',
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    /** A sale and its cost, as the ledger would carry them. */
    private function seedLedger(): void
    {
        $this->entry('1200-AR', 'Accounts Receivable', 118000, 0);
        $this->entry('4000-Freight-Revenue', 'Freight Revenue', 0, 100000);
        $this->entry('2200-GST-Output', 'GST Output', 0, 18000);
        $this->entry('5000-Direct-Costs', 'Direct Costs', 60000, 0);
        $this->entry('2100-AP', 'Accounts Payable', 0, 60000);
    }

    // ─── The lockout ─────────────────────────────────────────────────────────

    /** 🔴 A report needs a PERIOD. No period id, no report. */
    public function test_a_report_without_a_period_is_refused(): void
    {
        $this->api($this->accounts)
            ->getJson($this->url('/api/reports/trial-balance'))
            ->assertStatus(422);
    }

    /** 🔒 A period id from another branch is not theirs to report on, and ids guess easily. */
    public function test_a_period_from_another_branch_is_refused(): void
    {
        $other = Agent::create([
            'company_id' => $this->company->id, 'agent_name' => 'MAA', 'branch_code' => 'MAA',
        ]);
        $foreign = DB::table('accounting_periods')->insertGetId([
            'agent_id' => $other->id, 'period_name' => 'Theirs',
            'start_date' => now()->startOfYear()->toDateString(),
            'end_date' => now()->endOfYear()->toDateString(),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->api($this->accounts)
            ->getJson($this->url("/api/reports/trial-balance?period_id={$foreign}"))
            ->assertStatus(404)
            ->assertJsonPath('reason', 'period_not_found');
    }

    /**
     * ⚠️ Scoped by `accounting_period_id`, NOT by posting date. An entry posted late but
     * belonging to an earlier period must appear in THAT period's report — which is why
     * the ledger carries the period as a foreign key at all.
     */
    public function test_entries_are_scoped_by_period_not_by_posting_date(): void
    {
        $older = DB::table('accounting_periods')->insertGetId([
            'agent_id' => $this->branch->id, 'period_name' => 'FY25',
            'start_date' => now()->subYear()->startOfYear()->toDateString(),
            'end_date' => now()->subYear()->endOfYear()->toDateString(),
            'status' => 'closed', 'created_at' => now(), 'updated_at' => now(),
        ]);

        // Posted TODAY, but belonging to last year's period.
        $this->entry('4000-Freight-Revenue', 'Freight Revenue', 0, 5000, $older);
        $this->seedLedger();

        $thisYear = $this->api($this->accounts)
            ->getJson($this->url("/api/reports/profit-and-loss?period_id={$this->periodId}"))
            ->assertOk()->json('revenue.total');

        $lastYear = $this->api($this->accounts)
            ->getJson($this->url("/api/reports/profit-and-loss?period_id={$older}"))
            ->assertOk()->json('revenue.total');

        $this->assertSame(100000.0, (float) $thisYear);
        $this->assertSame(5000.0, (float) $lastYear, 'The late entry lands in ITS period.');
    }

    // ─── Profit & loss ───────────────────────────────────────────────────────

    /**
     * 🔴 SIGNED BY NATURE, NOT BY COLUMN. A revenue balance is credits minus debits; an
     * expense balance is debits minus credits. Summing raw columns across both would
     * report a loss on a profitable month.
     */
    public function test_the_profit_and_loss_signs_each_account_by_its_nature(): void
    {
        $this->seedLedger();

        $body = $this->api($this->accounts)
            ->getJson($this->url("/api/reports/profit-and-loss?period_id={$this->periodId}"))
            ->assertOk()
            ->json();

        $this->assertSame(100000.0, (float) $body['revenue']['total']);
        $this->assertSame(60000.0, (float) $body['expense']['total']);
        $this->assertSame(40000.0, (float) $body['net']);
        $this->assertSame(40.0, (float) $body['margin_pct']);
    }

    /**
     * ⚠️ GST NEVER APPEARS IN THE P&L. It is a 2xxx liability, not 4xxx revenue — the
     * fix from the earlier posting defect, now visible in the report that would have
     * shown it inflated.
     */
    public function test_output_gst_is_excluded_from_revenue(): void
    {
        $this->seedLedger();

        $codes = collect($this->api($this->accounts)
            ->getJson($this->url("/api/reports/profit-and-loss?period_id={$this->periodId}"))
            ->assertOk()->json('revenue.lines'))->pluck('code');

        $this->assertTrue($codes->contains('4000-Freight-Revenue'));
        $this->assertFalse($codes->contains('2200-GST-Output'), 'Tax collected is not income.');
    }

    /** 🔴 NULL, never 0%, on a period that billed nothing. */
    public function test_a_period_with_no_revenue_has_a_null_margin(): void
    {
        $this->entry('5000-Direct-Costs', 'Direct Costs', 500, 0);

        $body = $this->api($this->accounts)
            ->getJson($this->url("/api/reports/profit-and-loss?period_id={$this->periodId}"))
            ->assertOk()->json();

        $this->assertSame(-500.0, (float) $body['net'], 'The loss is real...');
        $this->assertNull($body['margin_pct'], '...but a margin on nothing is undefined.');
    }

    // ─── Balance sheet ───────────────────────────────────────────────────────

    public function test_the_balance_sheet_separates_assets_from_liabilities(): void
    {
        $this->seedLedger();

        $body = $this->api($this->accounts)
            ->getJson($this->url("/api/reports/balance-sheet?period_id={$this->periodId}"))
            ->assertOk()->json();

        $this->assertSame(118000.0, (float) $body['assets']['total'], 'AR is an asset.');
        $this->assertSame(78000.0, (float) $body['liabilities']['total'], 'AP + GST output.');
        $this->assertSame(40000.0, (float) $body['equity'], 'The residual matches the P&L net.');
    }

    // ─── Trial balance ───────────────────────────────────────────────────────

    /** 🔴 `balanced` IS THE WHOLE REPORT — the one question it exists to answer. */
    public function test_the_trial_balance_proves_the_ledger_balances(): void
    {
        $this->seedLedger();

        $this->api($this->accounts)
            ->getJson($this->url("/api/reports/trial-balance?period_id={$this->periodId}"))
            ->assertOk()
            ->assertJsonPath('balanced', true)
            ->assertJsonPath('difference', 0);
    }

    /**
     * ⚠️ A one-sided entry is REPORTED with its exact difference, not hidden. If this is
     * false, no other report from the period can be trusted.
     */
    public function test_a_one_sided_entry_shows_as_out_of_balance(): void
    {
        $this->seedLedger();
        $this->entry('5100-Bank-Charges', 'Bank Charges', 250, 0);   // no matching credit

        $body = $this->api($this->accounts)
            ->getJson($this->url("/api/reports/trial-balance?period_id={$this->periodId}"))
            ->assertOk()
            ->assertJsonPath('balanced', false)
            ->json();

        $this->assertSame(250.0, (float) $body['difference']);
    }

    // ─── Gates ───────────────────────────────────────────────────────────────

    /** 👁️ The Boss reads every financial report — §2.3 says read, never post. */
    public function test_the_boss_can_read_the_reports(): void
    {
        $this->seedLedger();

        $this->api($this->user('boss'))
            ->getJson($this->url("/api/reports/trial-balance?period_id={$this->periodId}", 'admin.f16sefreight.com'))
            ->assertOk();
    }

    /** 🔒 Pricing has no business in the ledger. */
    public function test_pricing_cannot_read_the_reports(): void
    {
        $this->api($this->user('pricing'))
            ->getJson($this->url("/api/reports/trial-balance?period_id={$this->periodId}", 'focusair.f16sefreight.com'))
            ->assertForbidden();
    }
}
