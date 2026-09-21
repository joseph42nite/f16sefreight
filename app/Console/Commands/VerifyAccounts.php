<?php

namespace App\Console\Commands;

use App\Company;
use App\User;
use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Check every money figure against a hand-computed answer (user, 2026-09-20).
 *
 *     php artisan db:seed --class=AccountsRegressionSeeder
 *     php artisan accounts:verify
 *
 * 🔴 **THE EXPECTED NUMBERS ARE WRITTEN HERE, BY HAND, AND NOT DERIVED FROM THE CODE UNDER TEST.** Every figure
 * below was worked out on paper from the fixture in `AccountsRegressionSeeder`. A verifier that recomputed them
 * with the same services it is checking would agree with any bug in those services — it would prove the code is
 * consistent with itself, which is exactly what it is not for.
 *
 * ⚠️ Cross-tenant isolation is checked by ARITHMETIC, not by counting rows: the two tenants deal in figures that
 * cannot be confused (multiples of 1,000 against multiples of 7,777), so a leak turns a total into a number that
 * is not in this file rather than into a screen that merely looks busier.
 */
class VerifyAccounts extends Command
{
    protected $signature = 'accounts:verify';

    protected $description = 'Check every accounts figure against the regression fixture';

    private int $passed = 0;

    /** @var list<string> */
    private array $failures = [];

    public function handle(): int
    {
        $reg = $this->accountsUserOf('REG');
        $rival = $this->accountsUserOf('RIV');

        if ($reg === null || $rival === null) {
            $this->error('Fixture missing. Run: php artisan db:seed --class="\AccountsRegressionSeeder"');

            return self::FAILURE;
        }

        // ⚠️ Every due date in the fixture is relative to the day it was seeded, so a fixture built yesterday is
        // genuinely a day older today — "100 days overdue" becomes 101, and the ageing buckets eventually shift.
        // Refusing to run on a stale fixture keeps every assertion exact instead of loosening them all.
        $seeded = DB::table('accounts_invoices')
            ->whereIn('agent_id', DB::table('agents_info')->where('company_id', $reg->company_name)->pluck('id'))
            ->max('created_at');

        if ($seeded !== null && ! \Illuminate\Support\Carbon::parse($seeded)->isToday()) {
            $this->error('The fixture was built on ' . \Illuminate\Support\Carbon::parse($seeded)->toDateString()
                . ' and its ages have drifted. Re-seed it: php artisan db:seed --class="\AccountsRegressionSeeder"');

            return self::FAILURE;
        }

        $this->as($reg);
        $this->line('');
        $this->info('── Regression Freight ──────────────────────────────────────────');
        $this->profitability();
        $this->ageing();
        $this->credit();
        $this->today();
        $this->ledger();
        $this->crossChecks();

        $this->as($rival);
        $this->line('');
        $this->info('── Rival Freight, and what it must NOT see ─────────────────────');
        $this->rival();

        $this->line('');

        if ($this->failures === []) {
            $this->info("All {$this->passed} figures agree with the fixture.");

            return self::SUCCESS;
        }

        $this->error(count($this->failures) . ' figure(s) are wrong out of ' . ($this->passed + count($this->failures)) . ':');

        foreach ($this->failures as $failure) {
            $this->line('  ' . $failure);
        }

        return self::FAILURE;
    }

    /* ── What each shipment, client and lane made ─────────────────────────── */

    private function profitability(): void
    {
        $c = app(\App\Http\Controllers\Freight\ProfitabilityController::class);

        $jobs = json_decode($c->jobs(new Request())->getContent(), true);
        $byLane = collect(json_decode($c->lanes(new Request())->getContent(), true)['groups'])->keyBy('name');
        $byClient = collect(json_decode($c->clients(new Request())->getContent(), true)['groups'])->keyBy('name');

        // 100,000 + 200,000 + 50,000 + 300,000 + 20,000 (debit note) − 10,000 (credit note) = 660,000, net of tax.
        $this->check('profit: shipments counted', 4, $jobs['totals']['count']);
        $this->check('profit: revenue', 660000.0, $jobs['totals']['revenue']);
        $this->check('profit: cost', 490000.0, $jobs['totals']['cost']);
        $this->check('profit: margin', 170000.0, $jobs['totals']['margin']);
        $this->check('profit: margin %', 25.76, $jobs['totals']['margin_pct']);

        // The loss-making shipment sorts first: billed 50,000 against 60,000 of cost.
        $this->check('profit: worst shipment first', -10000.0, $jobs['jobs'][0]['margin']);
        $this->check('profit: worst shipment lane', 'DEL → LHR', $jobs['jobs'][0]['lane']);

        $this->check('profit: BOM→FRA margin', 20000.0, $byLane['BOM → FRA']['margin'] ?? null);
        $this->check('profit: BOM→JFK margin', 70000.0, $byLane['BOM → JFK']['margin'] ?? null);
        $this->check('profit: DEL→LHR margin', -10000.0, $byLane['DEL → LHR']['margin'] ?? null);
        // The sea lane resolves to port names, not to bare LOCODEs.
        $this->check('profit: sea lane margin', 90000.0, $byLane['INNSA → DEHAM']['margin'] ?? null);
        $this->check('profit: sea lane named', 'Hamburg', $byLane['INNSA → DEHAM']['dest_name'] ?? null);

        $this->check('profit: Northstar margin', 90000.0, $byClient['Northstar Exports']['margin'] ?? null);
        $this->check('profit: Northstar margin %', 29.03, $byClient['Northstar Exports']['margin_pct'] ?? null);
        $this->check('profit: Cashflow margin %', 30.0, $byClient['Cashflow Corp']['margin_pct'] ?? null);

        // Nothing is flagged: every billed shipment has a cost booked, and nothing is costed but unbilled.
        $this->check('profit: uncosted shipments', 0, $jobs['totals']['no_cost_booked']);
    }

    /* ── Who owes what, and for how long ──────────────────────────────────── */

    private function ageing(): void
    {
        $c = app(\App\Http\Controllers\Freight\CollectionsController::class);
        $body = json_decode($c->ageing(new Request())->getContent(), true);
        $parties = collect($body['parties'])->keyBy('name');
        $t = $body['totals'];

        // inv4 is not due yet; inv2's balance and the debit note are 1–30 days over; the credit note sits in
        // 31–60 and SUBTRACTS; inv3 is over 90. inv1 was settled in full and has left the ageing entirely.
        $this->check('ageing: not due', 300000.0, $t['not_due']);
        $this->check('ageing: 1–30 days', 159600.0, $t['d1_30']);
        $this->check('ageing: 31–60 days (a credit note)', -11800.0, $t['d31_60']);
        $this->check('ageing: 61–90 days', 0.0, $t['d61_90']);
        $this->check('ageing: over 90 days', 59000.0, $t['d90_plus']);
        $this->check('ageing: total owed', 506800.0, $t['total']);
        $this->check('ageing: overdue', 206800.0, $t['overdue']);

        $this->check('ageing: Northstar total', 147800.0, $parties['Northstar Exports']['total'] ?? null);
        $this->check('ageing: Harbour oldest days', 100, $parties['Harbour Traders']['oldest_days'] ?? null);
        $this->check('ageing: Cashflow nothing overdue', 0.0, $parties['Cashflow Corp']['overdue'] ?? null);

        $queue = json_decode($c->queue(new Request())->getContent(), true);
        $this->check('collections: clients to chase', 2, $queue['summary']['parties']);
        $this->check('collections: overdue matches the ageing', 206800.0, $queue['summary']['overdue']);
    }

    /* ── The gate that stops cargo ────────────────────────────────────────── */

    private function credit(): void
    {
        $c = app(\App\Http\Controllers\Freight\CustomerController::class);
        $clients = collect(json_decode($c->index(new Request())->getContent(), true)['data'])->keyBy('name');

        $this->check('credit: Northstar owed', 147800.0, $clients['Northstar Exports']['exposure'] ?? null);
        $this->check('credit: Northstar left of limit', 352200.0, $clients['Northstar Exports']['available'] ?? null);
        $this->check('credit: Northstar not on hold', false, $clients['Northstar Exports']['on_hold'] ?? null);

        // 59,000 owed against a 50,000 limit.
        $this->check('credit: Harbour on hold', true, $clients['Harbour Traders']['on_hold'] ?? null);
        $this->check('credit: Harbour over by', -9000.0, $clients['Harbour Traders']['available'] ?? null);

        // 🔴 NULL is "not configured" and never blocks, however much they owe.
        // ⚠️ `array_key_exists`, not `??`: the coalesce fires on a NULL VALUE as well as on a missing key, so it
        // reports "the column is absent" for exactly the case being tested.
        $this->check('credit: Cashflow has no limit', true,
            array_key_exists('credit_limit', $clients['Cashflow Corp'] ?? []) && $clients['Cashflow Corp']['credit_limit'] === null);
        $this->check('credit: Cashflow not on hold at 300,000', false, $clients['Cashflow Corp']['on_hold'] ?? null);
    }

    /* ── The home screen ──────────────────────────────────────────────────── */

    private function today(): void
    {
        $body = json_decode(app(\App\Http\Controllers\Freight\AccountsTodayController::class)
            ->index(new Request())->getContent(), true);
        $cards = collect($body['cards'])->keyBy('key');
        $kinds = collect($body['exceptions'])->pluck('kind')->all();

        $this->check('today: to bill', 75000.0, $cards['to_bill']['amount']);
        $this->check('today: to bill count', 1, $cards['to_bill']['count']);
        $this->check('today: money to place', 40000.0, $cards['to_place']['amount']);
        $this->check('today: overdue', 206800.0, $cards['overdue']['amount']);
        // 🔴 The queue nothing ever wrote to: the draft is raised and not in the ledger.
        $this->check('today: not posted', 75000.0, $cards['unposted']['amount']);
        $this->check('today: not posted count', 1, $cards['unposted']['count']);

        $this->check('today: flags the credit hold', true, in_array('credit_hold', $kinds, true));
        $this->check('today: flags the stale draft', true, in_array('stale_draft', $kinds, true));
        // Every billed shipment is costed, so that warning must NOT be raised.
        $this->check('today: no uncosted warning', false, in_array('no_cost_booked', $kinds, true));
    }

    /* ── The books themselves ─────────────────────────────────────────────── */

    private function ledger(): void
    {
        $reports = app(\App\Http\Controllers\Freight\FinancialReportController::class);
        $period = DB::table('accounting_periods')
            ->whereIn('agent_id', $this->branchIds())->where('status', 'open')->value('id');

        $tb = json_decode($reports->trialBalance(new Request(['period_id' => $period]))->getContent(), true);
        $accounts = collect($tb['accounts'])->keyBy('code');

        $this->check('ledger: trial balance is balanced', true, $tb['balanced']);
        $this->check('ledger: total debits', 1556800.0, $tb['totals']['debit']);
        $this->check('ledger: total credits', 1556800.0, $tb['totals']['credit']);

        // Dr 736,600 raised against Cr 279,800 credited and received.
        $this->check('ledger: AR debits', 736600.0, $accounts['1200-AR']['debit'] ?? null);
        $this->check('ledger: AR credits', 279800.0, $accounts['1200-AR']['credit'] ?? null);
        $this->check('ledger: revenue', 670000.0, $accounts['4000-Freight-Revenue']['credit'] ?? null);
        // 🔴 A credit note is a sales ADJUSTMENT, never negative revenue.
        $this->check('ledger: sales adjustments', 10000.0, $accounts['4900-Sales-Adjustments']['debit'] ?? null);
        // 🔴 GST output is a LIABILITY, and the credit note takes 1,800 back off it.
        $this->check('ledger: GST output credited', 66600.0, $accounts['2200-GST-Output']['credit'] ?? null);
        $this->check('ledger: GST output debited', 1800.0, $accounts['2200-GST-Output']['debit'] ?? null);
        $this->check('ledger: direct costs', 490000.0, $accounts['5000-Direct-Costs']['debit'] ?? null);
        // 🔴 GST input is an ASSET, reclaimable — never an expense.
        $this->check('ledger: GST input', 50400.0, $accounts['1300-GST-Input']['debit'] ?? null);
        $this->check('ledger: payables', 540400.0, $accounts['2100-AP']['credit'] ?? null);
        $this->check('ledger: bank', 268000.0, $accounts['1100-Bank']['debit'] ?? null);

        $pl = json_decode($reports->profitAndLoss(new Request(['period_id' => $period]))->getContent(), true);
        $this->check('P&L: revenue', 660000.0, $pl['revenue']['total']);
        $this->check('P&L: expense', 490000.0, $pl['expense']['total']);
        $this->check('P&L: net', 170000.0, $pl['net']);

        $bs = json_decode($reports->balanceSheet(new Request(['period_id' => $period]))->getContent(), true);
        $this->check('balance sheet: assets', 775200.0, $bs['assets']['total']);
        $this->check('balance sheet: liabilities', 605200.0, $bs['liabilities']['total']);
        $this->check('balance sheet: retained earnings', 170000.0, $bs['equity']);

        $book = json_decode(app(\App\Http\Controllers\Freight\JournalController::class)
            ->index(new Request())->getContent(), true);
        $this->check('journal: debits equal credits', $book['totals']['debits'], $book['totals']['credits']);
        // 17 sales lines (three documents with tax, one export without, plus both notes), 11 purchase lines
        // (three with input tax, one without) and 6 receipt lines — 34.
        $this->check('journal: postings', 34, $book['totals']['count']);
    }

    /**
     * The checks that catch a whole class of error: two screens that must agree, built by different code.
     *
     * ⚠️ These are the most valuable assertions in the file. A single figure can be wrong and plausible; two
     * figures derived along different paths cannot be wrong in the same direction by accident.
     */
    private function crossChecks(): void
    {
        $period = DB::table('accounting_periods')
            ->whereIn('agent_id', $this->branchIds())->where('status', 'open')->value('id');
        $reports = app(\App\Http\Controllers\Freight\FinancialReportController::class);

        $pl = json_decode($reports->profitAndLoss(new Request(['period_id' => $period]))->getContent(), true);
        $profit = json_decode(app(\App\Http\Controllers\Freight\ProfitabilityController::class)
            ->jobs(new Request())->getContent(), true);

        // The ledger and the margin report are built from different tables by different code.
        $this->check('cross: P&L net == profitability margin', $pl['net'], $profit['totals']['margin']);
        $this->check('cross: P&L revenue == profitability revenue', $pl['revenue']['total'], $profit['totals']['revenue']);
        $this->check('cross: P&L expense == profitability cost', $pl['expense']['total'], $profit['totals']['cost']);

        $bs = json_decode($reports->balanceSheet(new Request(['period_id' => $period]))->getContent(), true);
        $this->check('cross: assets − liabilities == net profit',
            round($bs['assets']['total'] - $bs['liabilities']['total'], 2), $pl['net']);

        // The receivable in the ledger, plus money received and not yet placed, is what the ageing says is owed.
        $ar = round((float) DB::table('accounts_ledger_entries as l')
            ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->whereIn('l.agent_id', $this->branchIds())->where('c.account_code', '1200-AR')
            ->sum(DB::raw('l.debit_amount - l.credit_amount')), 2);

        $onAccount = round((float) DB::table('accounts_receipts as r')
            ->whereIn('r.agent_id', $this->branchIds())
            ->whereNotExists(fn ($q) => $q->select(DB::raw(1))->from('accounts_receipt_allocations as a')
                ->whereColumn('a.receipt_id', 'r.id'))
            ->sum('r.amount'), 2);

        $ageing = json_decode(app(\App\Http\Controllers\Freight\CollectionsController::class)
            ->ageing(new Request())->getContent(), true);

        $this->check('cross: AR ledger + money on account == ageing total',
            round($ar + $onAccount, 2), $ageing['totals']['total']);
    }

    /* ── The other tenant ─────────────────────────────────────────────────── */

    private function rival(): void
    {
        $profit = json_decode(app(\App\Http\Controllers\Freight\ProfitabilityController::class)
            ->jobs(new Request())->getContent(), true);
        $ageing = json_decode(app(\App\Http\Controllers\Freight\CollectionsController::class)
            ->ageing(new Request())->getContent(), true);
        $today = json_decode(app(\App\Http\Controllers\Freight\AccountsTodayController::class)
            ->index(new Request())->getContent(), true);

        // Their own figures, in multiples of 7,777 — nothing here is a multiple of 1,000 by accident.
        $this->check('rival: shipments', 1, $profit['totals']['count']);
        $this->check('rival: revenue', 777000.0, $profit['totals']['revenue']);
        $this->check('rival: cost', 555000.0, $profit['totals']['cost']);
        $this->check('rival: margin', 222000.0, $profit['totals']['margin']);
        $this->check('rival: owed (incl. GST)', 916860.0, $ageing['totals']['total']);

        // 🔴 NONE of Regression Freight's figures may appear here, and their branch is not on this list.
        $this->check('rival: sees one branch only', 1, count($today['branches']));
        $this->check('rival: that branch is theirs', 'Delhi', $today['branches'][0]->name ?? $today['branches'][0]['name'] ?? null);
        $this->check('rival: no Regression revenue leaked', true, $profit['totals']['revenue'] !== 660000.0);
        $this->check('rival: no Regression client visible', 0, collect(json_decode(
            app(\App\Http\Controllers\Freight\CustomerController::class)->index(new Request())->getContent(), true)['data'])
            ->whereIn('name', ['Northstar Exports', 'Harbour Traders', 'Cashflow Corp'])->count());

        $book = json_decode(app(\App\Http\Controllers\Freight\JournalController::class)
            ->index(new Request())->getContent(), true);
        // One invoice and one voucher: 3 sales lines + 2 cost lines (no GST on the rival's purchase).
        $this->check('rival: journal postings', 5, $book['totals']['count']);
        $this->check('rival: journal balances', $book['totals']['debits'], $book['totals']['credits']);
    }

    /* ── Plumbing ─────────────────────────────────────────────────────────── */

    private function accountsUserOf(string $code): ?User
    {
        $company = Company::withoutGlobalScopes()->where('code', $code)->first();

        return $company === null ? null : User::withoutGlobalScopes()
            ->where('company_name', $company->id)->where('designation', 'accounts')->first();
    }

    private function as(User $user): void
    {
        auth()->guard('user-api')->setUser($user);
        auth()->shouldUse('user-api');
    }

    private function branchIds(): array
    {
        return DB::table('agents_info')
            ->where('company_id', \App\Support\UserContext::for(auth()->user())->companyId)
            ->pluck('id')->all();
    }

    /** One assertion. Money is compared to the paisa, never loosely. */
    private function check(string $what, $expected, $actual): void
    {
        $same = is_float($expected) || is_float($actual)
            ? abs((float) $expected - (float) $actual) < 0.005
            : $expected === $actual;

        if ($expected === null || $actual === null) {
            $same = $expected === $actual;
        }

        if ($same) {
            $this->passed++;
            $this->line('  <fg=green>✓</> ' . $what);

            return;
        }

        $this->failures[] = sprintf('%s — expected %s, got %s', $what,
            $this->show($expected), $this->show($actual));
        $this->line('  <fg=red>✗</> ' . $what . ' <fg=red>expected ' . $this->show($expected)
            . ', got ' . $this->show($actual) . '</>');
    }

    private function show($value): string
    {
        return match (true) {
            $value === null => 'null',
            is_bool($value) => $value ? 'true' : 'false',
            is_float($value) || is_int($value) => number_format((float) $value, 2),
            default => '"' . $value . '"',
        };
    }
}
