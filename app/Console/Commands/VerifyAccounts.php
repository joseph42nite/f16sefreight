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
        $this->moneyIn();
        $this->closeMonth();
        $this->gstReturns();
        $this->tds();
        $this->moneyOut();
        $this->banks();
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

    /**
     * The five stages, which must agree with the registers they were merged from.
     *
     * 🔴 This is the assertion that proves the merge changed nothing: every figure here is one already checked
     * above by the screen that used to own it.
     */
    private function moneyIn(): void
    {
        $stages = collect(json_decode(app(\App\Http\Controllers\Freight\MoneyInController::class)
            ->stages(new Request())->getContent(), true)['stages'])->keyBy('key');

        // ① The draft pricing handed over — the same document the Today card counts.
        $this->check('money in ①: to bill', 75000.0, $stages['to_bill']['amount']);
        $this->check('money in ①: to bill count', 1, $stages['to_bill']['count']);
        // ② Nothing was raised on this desk and left unfinalized.
        $this->check('money in ②: own drafts', 0, $stages['drafts']['count']);
        // ③ Four invoices and two notes: 118,000 + 236,000 + 59,000 + 300,000 + 23,600 − 11,800.
        $this->check('money in ③: issued', 724800.0, $stages['issued']['amount']);
        $this->check('money in ③: issued count', 6, $stages['issued']['count']);
        // ④ Three receipts totalling 268,000, and one bank line nobody has placed.
        $this->check('money in ④: received', 266000.0, $stages['money_in']['amount']);
        $this->check('money in ④: still to place', 40000.0, $stages['money_in']['unplaced']['amount']);
        // ⑤ The same overdue figure the ageing, the queue and the Today card report.
        $this->check('money in ⑤: overdue', 206800.0, $stages['overdue']['amount']);
        $this->check('money in ⑤: clients', 2, $stages['overdue']['count']);
    }

    /**
     * The six steps of a month-end, against a period that is deliberately NOT ready to close.
     *
     * ⚠️ The fixture is built mid-month on purpose: one shipment unbilled, one document unposted. A checklist is
     * only worth testing in the state where it says no.
     */
    private function closeMonth(): void
    {
        $body = json_decode(app(\App\Http\Controllers\Freight\CloseMonthController::class)
            ->index(new Request())->getContent(), true);
        $steps = collect($body['steps'])->keyBy('key');

        // ① The fifth shipment carries only a draft, and a draft is not billed.
        $this->check('close ①: unbilled shipments', 1, $steps['billed']['count']);
        // ② Every billed shipment has its cost booked.
        $this->check('close ②: uncosted shipments', 0, $steps['costed']['count']);
        // ③ That same draft is the one document outside the ledger — and this is the step that blocks.
        $this->check('close ③: unposted documents', 1, $steps['posted']['count']);
        $this->check('close ③: blocks the close', true, $steps['posted']['blocking']);
        // ④ Five B2B documents await an IRN; the export invoice to a client with no GSTIN never needs one.
        $this->check('close ④: awaiting an IRN', 5, $steps['gst']['count']);
        // 18,000 + 36,000 + 9,000 + 3,600 − 1,800 = 64,800 charged, net of the credit note.
        $this->check('close ④: tax charged', 64800.0, $steps['gst']['tax_charged']);
        // ⑤ Refused, and it says which step to clear.
        $this->check('close ⑤: cannot close yet', false, $body['can_close']);
        $this->check('close ⑤: names the blocker', 'Everything posted?', $body['blocked_by']);
        // ⑥ The ledger balances and proves the same profit as every other screen.
        $this->check('close ⑥: ledger balances', true, $steps['statements']['balanced']);
        $this->check('close ⑥: net profit', 170000.0, $steps['statements']['figures']['net']);
    }

    /** The buy side: four stages, one voucher settled and three still open. */
    private function moneyOut(): void
    {
        $stages = collect(json_decode(app(\App\Http\Controllers\Freight\MoneyOutController::class)
            ->stages(new Request())->getContent(), true)['stages'])->keyBy('key');

        // ① Every billed shipment is costed, so this warning must be silent.
        $this->check('money out ①: nothing uncosted', 0, $stages['to_cost']['count']);
        // ② Four vouchers, gross of input tax: 82,600 + 177,000 + 70,800 + 210,000.
        $this->check('money out ②: vouchers booked', 540400.0, $stages['vouchers']['amount']);
        $this->check('money out ②: voucher count', 4, $stages['vouchers']['count']);
        $this->check('money out ③: statements to check', 0, $stages['statements']['count']);
        // ④ 540,400 booked less the 82,600 paid, across the three vouchers still open — one supplier.
        $this->check('money out ④: still owed', 457800.0, $stages['due']['amount']);
        $this->check('money out ④: open vouchers', 3, $stages['due']['vouchers']);
        $this->check('money out ④: suppliers', 1, $stages['due']['count']);
    }

    /** The bank accounts master: two accounts, two balances, and the statements that belong to each. */
    /**
     * GSTR-1 and GSTR-3B, every figure worked out on paper first.
     *
     * The fixture's own GSTIN is 27 (Maharashtra). Northstar is 27 → CGST + SGST; Harbour is 33 → IGST;
     * Cashflow has none at all and its only document carries no tax, so it can be filed under no section.
     *
     * 🔴 **The window is the whole fixture span, not a month.** Production files a calendar month — see
     * `GstReturnService::gstr1()` — but the fixture's documents are back-dated across four of them so the
     * ageing buckets land where they must, and asserting one month would assert a quarter of the arithmetic.
     * A one-month call is checked separately below, which is what proves the window is honoured at all.
     */
    private function gstReturns(): void
    {
        $period = DB::table('accounting_periods')
            ->whereIn('agent_id', $this->branchIds())->where('status', 'open')->first();
        $service = app(\App\Services\GstReturnService::class);

        $r1 = $service->gstr1((int) $period->agent_id, $period->start_date, $period->end_date);

        $this->check('gstr1: our own GSTIN is set', '27AAACR1000A1Z5', $r1['gstin']);
        $this->check('gstr1: the return can be filed', true, $r1['filable']);

        // Three invoices to registered clients. The export to Cashflow is not one: no GSTIN, so no section.
        $this->check('gstr1: B2B invoices', 3, count($r1['b2b']));
        $this->check('gstr1: CDNR notes', 2, count($r1['cdnr']));

        $b2b = collect($r1['b2b'])->keyBy('document_no');
        $notes = collect($r1['cdnr'])->keyBy('document_no');

        // 🔴 inv1: 100,000 at 18% to a client in OUR state — 18,000 halved into two heads, not IGST.
        $this->check('gstr1: inv1 is intrastate', 'intrastate', $b2b['INV-REGBOM-26-0001']['supply'] ?? null);
        $this->check('gstr1: inv1 CGST', 9000.0, $b2b['INV-REGBOM-26-0001']['cgst'] ?? null);
        $this->check('gstr1: inv1 SGST', 9000.0, $b2b['INV-REGBOM-26-0001']['sgst'] ?? null);
        $this->check('gstr1: inv1 no IGST', 0.0, $b2b['INV-REGBOM-26-0001']['igst'] ?? null);
        // 🔴 inv3: 50,000 at 18% to a client in 33 — the SAME 9,000 of tax, entirely as IGST.
        $this->check('gstr1: inv3 is interstate', 'interstate', $b2b['INV-REGBOM-26-0003']['supply'] ?? null);
        $this->check('gstr1: inv3 IGST', 9000.0, $b2b['INV-REGBOM-26-0003']['igst'] ?? null);
        $this->check('gstr1: inv3 no CGST', 0.0, $b2b['INV-REGBOM-26-0003']['cgst'] ?? null);
        $this->check('gstr1: inv3 place of supply', '33', $b2b['INV-REGBOM-26-0003']['place_of_supply'] ?? null);
        // The note letters the portal uses.
        $this->check('gstr1: the credit note is a C', 'C', $notes['CN-REGBOM-26-0001']['note_type'] ?? null);
        $this->check('gstr1: the debit note is a D', 'D', $notes['DN-REGBOM-26-0001']['note_type'] ?? null);

        // 🔴 100,000 + 200,000 + 50,000 + 20,000 (debit note) − 10,000 (credit note) = 360,000.
        $this->check('gstr1: taxable value', 360000.0, $r1['totals']['taxable_value']);
        // CGST: 9,000 + 18,000 + 1,800 − 900 = 27,900. SGST the same. IGST is Harbour's 9,000 alone.
        $this->check('gstr1: CGST', 27900.0, $r1['totals']['cgst']);
        $this->check('gstr1: SGST', 27900.0, $r1['totals']['sgst']);
        $this->check('gstr1: IGST', 9000.0, $r1['totals']['igst']);
        $this->check('gstr1: tax filed', 64800.0, $r1['totals']['tax']);
        $this->check('gstr1: documents filed', 5, $r1['totals']['documents']);

        // The HSN summary must agree with the sections above it or the file disagrees with itself.
        $this->check('gstr1: one HSN line (996531 at 18%)', 1, count($r1['hsn']));
        $this->check('gstr1: HSN taxable value', 360000.0, $r1['hsn'][0]['taxable_value'] ?? null);
        $this->check('gstr1: HSN CGST', 27900.0, $r1['hsn'][0]['cgst'] ?? null);

        // 🔴 The export: 300,000 with no tax and no counterparty GSTIN. Not filed, and NAMED.
        $this->check('gstr1: documents not filed', 1, count($r1['exceptions']));
        $this->check('gstr1: and it is the export', 'INV-REGBOM-26-0004', $r1['exceptions'][0]['document_no'] ?? null);
        $this->check('gstr1: why it cannot be filed', 'zero_rated_needs_classification', $r1['exceptions'][0]['reason'] ?? null);
        $this->check('gstr1: its value is still reported', 300000.0, $r1['exceptions'][0]['taxable_value'] ?? null);
        // Nothing disagrees with the register, because nothing in the fixture wrote one.
        $this->check('gstr1: no register disagreements', 0, count($r1['warnings']));

        // ⚠️ The window is honoured: one month holds less than the whole span.
        [$from, $to] = \App\Services\GstReturnService::month(date('Y-m'));
        $month = $service->gstr1((int) $period->agent_id, $from, $to);
        $this->check('gstr1: a single month is a subset', true, $month['totals']['tax'] < $r1['totals']['tax']);
        $this->check('gstr1: the filing period is MMYYYY', date('mY'), $month['filing_period']);

        // ── 3B ──────────────────────────────────────────────────────────────
        $r3 = $service->gstr3b((int) $period->agent_id, $period->start_date, $period->end_date);

        $this->check('gstr3b: 3.1(a) taxable value', 360000.0, $r3['outward']['taxable_value']);
        $this->check('gstr3b: 3.1(a) tax', 64800.0, $r3['outward']['tax']);
        // 🔴 Input credit: the carrier is registered in 27 too, so 12,600 + 27,000 + 10,800 = 50,400 of tax
        // splits 25,200 a head. The fourth voucher carries no tax and contributes nothing.
        $this->check('gstr3b: 4(A)(5) input CGST', 25200.0, $r3['input_credit']['cgst']);
        $this->check('gstr3b: 4(A)(5) input SGST', 25200.0, $r3['input_credit']['sgst']);
        $this->check('gstr3b: 4(A)(5) no input IGST', 0.0, $r3['input_credit']['igst']);
        $this->check('gstr3b: vouchers claimed', 4, $r3['input_credit']['vouchers']);
        // 27,900 − 25,200 = 2,700 a head; IGST has no credit against it at all.
        $this->check('gstr3b: CGST difference', 2700.0, $r3['difference']['cgst']);
        $this->check('gstr3b: SGST difference', 2700.0, $r3['difference']['sgst']);
        $this->check('gstr3b: IGST difference', 9000.0, $r3['difference']['igst']);
        $this->check('gstr3b: total difference', 14400.0, $r3['difference']['total']);
        // And it carries what GSTR-1 left out rather than reporting a quietly smaller month.
        $this->check('gstr3b: names what GSTR-1 left out', 300000.0, $r3['excluded']['value']);
    }

    /**
     * TDS, both directions, every figure worked out on paper first.
     *
     * 🔴 **The two directions are a LIABILITY and an ASSET and are never netted.** We withheld 1,400 from
     * the airline and owe it to the government; a client withheld 2,000 from us and we claim it back. A
     * system that reported one "TDS" figure of 600 would be describing a position nobody holds.
     */
    private function tds(): void
    {
        [$financialYear, $quarter] = \App\Services\TdsService::period(now()->toDateString());

        $body = json_decode(app(\App\Http\Controllers\Freight\TdsController::class)
            ->index(new Request(['financial_year' => $financialYear, 'quarter' => $quarter]))->getContent(), true);

        // 🔴 OUTWARD. j1's voucher is 70,000 net of GST; the carrier is 194C at 2% and has a PAN, so the
        // ordinary rate applies rather than the 20% s.206AA penalty. 2% of 70,000 = 1,400.
        $this->check('tds: withheld from vendors', 1400.0, $body['payable']['total']);
        $this->check('tds: on a base net of GST', 70000.0, $body['payable']['base']);
        $this->check('tds: one deduction made', 1, $body['payable']['deductions']);
        $this->check('tds: under 194C', '194C', $body['payable']['by_section'][0]['section'] ?? null);
        $this->check('tds: every deductee has a PAN', 0, $body['payable']['without_pan']);

        // 🔴 INWARD. The client deducted 2% of inv1's 1,00,000 SUBTOTAL — not of the 1,18,000 they paid
        // against, because tax is deducted on the service and never on the GST charged on it.
        $this->check('tds: withheld from us', 2000.0, $body['receivable']['total']);
        $this->check('tds: on the invoice subtotal', 100000.0, $body['receivable']['base']);

        // 🔴 The register and the ledger are written in one transaction, so a difference is not a lag.
        $this->check('tds: ledger payable agrees', 1400.0, $body['ledger']['payable']);
        $this->check('tds: ledger receivable agrees', 2000.0, $body['ledger']['receivable']);

        // ⚠️ NEVER netted: 1,400 owed and 2,000 claimable are not 600 of anything.
        $this->check('tds: the two are not netted', true,
            $body['payable']['total'] !== $body['receivable']['total']);

        // The invoice the client deducted from is PAID, not part-paid — they did nothing wrong.
        $this->check('tds: the deducted invoice is settled', 'paid',
            DB::table('accounts_invoices')->whereIn('agent_id', $this->branchIds())
                ->where('type', 'invoice')->orderBy('id')->value('status'));

        // And the vendor's payable cleared by the GROSS, so nothing is left owing on that voucher.
        $this->check('tds: the paid voucher owes nothing', 'paid',
            DB::table('accounts_purchase_vouchers')->whereIn('agent_id', $this->branchIds())
                ->orderBy('id')->value('status'));
    }

    private function banks(): void
    {
        $body = json_decode(app(\App\Http\Controllers\Freight\BankAccountController::class)
            ->index(new Request())->getContent(), true);
        $accounts = collect($body['accounts'])->keyBy('name');

        $this->check('banks: accounts on the master', 2, count($body['accounts']));
        $this->check('banks: Collections balance', 266000.0, $accounts['Collections']['balance'] ?? null);
        $this->check('banks: Payouts balance', -81200.0, $accounts['Payouts']['balance'] ?? null);
        // ⚠️ Nothing was posted before the master existed in this fixture, so the legacy account is empty.
        $this->check('banks: nothing left undifferentiated', 0.0, $body['legacy_balance']);
        // 🔐 The number is encrypted and never returned; the last four are, so a statement can be matched by eye.
        $this->check('banks: account number withheld', false, array_key_exists('account_no', $accounts['Collections']));
        $this->check('banks: last four shown', '4321', $accounts['Collections']['last_four'] ?? null);
        // 694,000 of assets, of which the two banks hold 184,800 between them.
        $this->check('banks: the two together', 184800.0,
            round((float) $accounts['Collections']['balance'] + (float) $accounts['Payouts']['balance'], 2));
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
        // 1,556,800 of billing and receipts, plus the 82,600 payment on both sides.
        $this->check('ledger: total debits', 1639400.0, $tb['totals']['debit']);
        $this->check('ledger: total credits', 1639400.0, $tb['totals']['credit']);

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
        $this->check('ledger: payables raised', 540400.0, $accounts['2100-AP']['credit'] ?? null);
        // 🔴 The other half of the ledger: a payment brings the payable DOWN and takes cash out.
        $this->check('ledger: payables settled', 82600.0, $accounts['2100-AP']['debit'] ?? null);
        // 🔴 TWO bank accounts, told apart — the whole reason the master exists. Money in lands in Collections;
        // the payment leaves Payouts. On a single `1100-Bank` these were one indistinguishable balance.
        $this->check('ledger: into Collections', 266000.0, $accounts['1100-Bank-HDFCBANK-4321']['debit'] ?? null);
        $this->check('ledger: out of Payouts', 81200.0, $accounts['1100-Bank-ICICIBANK-9876']['credit'] ?? null);
        $this->check('ledger: nothing on the undifferentiated bank', null, $accounts['1100-Bank'] ?? null);

        $pl = json_decode($reports->profitAndLoss(new Request(['period_id' => $period]))->getContent(), true);
        $this->check('P&L: revenue', 660000.0, $pl['revenue']['total']);
        $this->check('P&L: expense', 490000.0, $pl['expense']['total']);
        $this->check('P&L: net', 170000.0, $pl['net']);

        $bs = json_decode($reports->balanceSheet(new Request(['period_id' => $period]))->getContent(), true);
        // AR 456,800 + GST input 50,400 + bank (266,000 − 81,200 = 184,800) + TDS receivable 2,000.
        // ⚠️ TDS moves NOTHING here in total: the 2,000 a client withheld is 2,000 less cash and 2,000 more
        // receivable, which is exactly what makes it an asset rather than a loss.
        $this->check('balance sheet: assets', 694000.0, $bs['assets']['total']);
        // GST output 64,800 + payables (540,400 − 82,600 = 457,800) + TDS payable 1,400.
        // 🔴 The payable came down by the GROSS 82,600 even though only 81,200 left the bank: the airline's
        // invoice really is settled in full, and the 1,400 is now owed to the government instead.
        $this->check('balance sheet: liabilities', 524000.0, $bs['liabilities']['total']);
        $this->check('balance sheet: retained earnings', 170000.0, $bs['equity']);

        $book = json_decode(app(\App\Http\Controllers\Freight\JournalController::class)
            ->index(new Request())->getContent(), true);
        $this->check('journal: debits equal credits', $book['totals']['debits'], $book['totals']['credits']);
        // 17 sales lines (three documents with tax, one export without, plus both notes), 11 purchase lines
        // (three with input tax, one without) and 6 receipt lines — 34.
        // 34, plus the payment's two.
        $this->check('journal: postings', 38, $book['totals']['count']);
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

        // 🔴 THE GST CROSS-CHECK. Close-the-month ④ sums the tax off the document HEADERS; the return sums it
        // off the LINE ITEMS, splits each one into heads, and nets the credit note. Two different tables, two
        // different computations, one answer — and the day they disagree, a document's lines have drifted from
        // its total, which is the one way a filed return can be wrong while every screen still looks right.
        $close = json_decode(app(\App\Http\Controllers\Freight\CloseMonthController::class)
            ->index(new Request())->getContent(), true);
        $gstStep = collect($close['steps'])->firstWhere('key', 'gst');
        $filed = app(\App\Services\GstReturnService::class)
            ->gstr1((int) DB::table('accounting_periods')->whereIn('agent_id', $this->branchIds())
                ->where('status', 'open')->value('agent_id'), '2000-01-01', '2100-01-01');

        // ⚠️ The excepted export carries no tax, so the two figures must agree to the paisa even though one
        // of them counts a document the other refuses to file.
        $this->check('cross: tax charged == tax filed', $gstStep['tax_charged'], $filed['totals']['tax']);
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
        // Their GST return: 139,860 of tax on a 07-to-07 supply, so 69,930 a head — and 27,900 (Regression's
        // figure) must appear nowhere in it.
        $rivalPeriod = DB::table('accounting_periods')->whereIn('agent_id', $this->branchIds())
            ->where('status', 'open')->first();
        $rivalReturn = app(\App\Services\GstReturnService::class)
            ->gstr1((int) $rivalPeriod->agent_id, $rivalPeriod->start_date, $rivalPeriod->end_date);
        $this->check('rival: GSTIN is their own', '07AAACV1000A1Z5', $rivalReturn['gstin']);
        $this->check('rival: taxable value', 777000.0, $rivalReturn['totals']['taxable_value']);
        $this->check('rival: CGST', 69930.0, $rivalReturn['totals']['cgst']);
        $this->check('rival: SGST', 69930.0, $rivalReturn['totals']['sgst']);
        $this->check('rival: no Regression tax leaked', true, $rivalReturn['totals']['cgst'] !== 27900.0);

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
