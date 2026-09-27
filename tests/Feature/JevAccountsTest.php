<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * Jev in accounts (user, 2026-09-26: "a Jev-driven accounts system, safe … not make mistakes anywhere"; §11.7;
 * GAPS #412). The safety rules, each pinned: it chooses only among options PHP built; it suggests and a person
 * confirms; under its floor it is silent; it is asked once, charged once, refunded on failure; what it saw is
 * encrypted; and what the person did is recorded against it.
 *
 * Two open bills of ₹50,000 — INV-A to Globex, INV-B to Initech — and money from GLOBEX that the amount alone
 * cannot place.
 */
class JevAccountsTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $accounts;
    private int $billA;
    private int $billB;

    /** What the fake answers, per question: [choice, confidence]. One fake reading this, never re-faked per case. */
    private array $reply = [];

    /** The provider failing — read by the same fake, because a second Http::fake() would never be reached. */
    private bool $failing = false;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Jev Co', 'code' => 'JEV', 'tier' => 'command', 'ocr_credits_balance' => 50]);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-jev@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);
        DB::table('accounting_periods')->insert(['agent_id' => $this->branch->id, 'period_name' => 'FY26',
            'start_date' => now()->startOfYear()->toDateString(), 'end_date' => now()->endOfYear()->toDateString(),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now()]);

        $bill = function (string $no, string $client) {
            $customer = Customer::create(['company_id' => $this->company->id, 'name' => $client, 'email_domain' => strtolower($client) . '.test']);

            return DB::table('accounts_invoices')->insertGetId(['agent_id' => $this->branch->id, 'customer_id' => $customer->id,
                'billed_party_type' => 'customer', 'billed_party_id' => $customer->id, 'invoice_no' => $no, 'type' => 'invoice',
                'document_date' => now()->subDays(10)->toDateString(), 'status' => 'sent', 'currency' => 'INR', 'exchange_rate' => 1,
                'subtotal' => 50000, 'tax_amount' => 0, 'grand_total' => 50000, 'is_posted' => 1,
                'created_at' => now(), 'updated_at' => now()]);
        };
        $this->billA = $bill('INV-A', 'Globex');
        $this->billB = $bill('INV-B', 'Initech');

        config(['accounts_decisions.enabled' => true, 'services.openrouter.key' => 'test-key']);
        Http::fake(['*/decisions' => function ($request) {
            if ($this->failing) {
                return Http::response(['error' => ['message' => 'overloaded']], 529);
            }

            $answers = [];
            foreach (array_keys($request->data()['questions'] ?? []) as $q) {
                if (isset($this->reply[$q])) {
                    [$choice, $confidence] = $this->reply[$q];
                    $answers[$q] = ['type' => 'choice', 'choice' => $choice, 'confidence' => $confidence];
                }
            }

            return Http::response(['model' => 'typesafe/jev-1.13', 'answers' => $answers,
                'usage' => ['input_tokens' => 650, 'output_tokens' => 20, 'cost' => 0.000027]]);
        }]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api' . $path;
    }

    private function bankLine(float $amount, string $narration = 'NEFT GLOBEX LTD INV-A SEP'): int
    {
        return DB::table('bank_transactions')->insertGetId(['agent_id' => $this->branch->id, 'provider' => 'manual',
            'plaid_transaction_id' => 'UTR-' . uniqid(), 'reference' => 'UTR123', 'amount' => $amount,
            'value_date' => now()->toDateString(), 'direction' => 'credit', 'narration' => $narration, 'counterparty' => 'GLOBEX LTD',
            'reconciliation_status' => 'unreconciled', 'currency' => 'INR', 'created_at' => now(), 'updated_at' => now()]);
    }

    private function credits(): float
    {
        return (float) DB::table('companies')->where('id', $this->company->id)->value('ocr_credits_balance');
    }

    private function decision(string $question): object
    {
        return DB::table('ai_decisions')->where('company_id', $this->company->id)->where('question', $question)->first();
    }

    // ─── ① Which bill ────────────────────────────────────────────────────────

    public function test_it_suggests_the_bill_and_records_that_the_person_took_it(): void
    {
        $this->reply = ['bank_match' => ["bill_{$this->billA}", 0.91]];
        $line = $this->bankLine(50000);

        $jev = $this->as($this->accounts)->getJson($this->url("/reconciliation/{$line}/candidates"))->assertOk()->json('jev.bill');
        $this->assertSame([true, $this->billA], [$jev['suggested'], $jev['invoice_id']]);

        // Offered only what the amount found, plus "none" — and charged 0.1 credit, once.
        $sent = Http::recorded()[0][0]->data();
        $this->assertSame(["bill_{$this->billA}", "bill_{$this->billB}", 'none_of_these'],
            array_keys($sent['questions']['bank_match']['criteria']));
        $this->assertSame(49.9, $this->credits());

        // 🔒 What it saw is kept — encrypted, not readable in the table.
        $row = $this->decision('bank_match');
        $this->assertStringNotContainsString('GLOBEX', $row->state);
        $this->assertSame('GLOBEX LTD', json_decode(Crypt::decryptString($row->state), true)['payer']);

        // The person settles it — Jev posted nothing; Settle did — and the outcome is written against the suggestion.
        $this->assertSame('unreconciled', DB::table('bank_transactions')->where('id', $line)->value('reconciliation_status'));
        $this->postJson($this->url("/reconciliation/{$line}/match"), ['invoice_id' => $this->billA, 'bill_decision_id' => $jev['id']])->assertOk();
        $this->assertSame(['accepted', "bill_{$this->billA}"], [$this->decision('bank_match')->outcome, $this->decision('bank_match')->outcome_value]);
    }

    public function test_it_is_asked_once_and_charged_once(): void
    {
        $this->reply = ['bank_match' => ["bill_{$this->billA}", 0.91]];
        $line = $this->bankLine(50000);

        $this->as($this->accounts)->getJson($this->url("/reconciliation/{$line}/candidates"))->assertOk();
        $again = $this->getJson($this->url("/reconciliation/{$line}/candidates"))->assertOk()->json('jev.bill');

        Http::assertSentCount(1);
        $this->assertSame([49.9, $this->billA], [$this->credits(), $again['invoice_id']]);
    }

    public function test_under_its_floor_it_is_silent_and_a_different_choice_is_recorded_as_changed(): void
    {
        $this->reply = ['bank_match' => ["bill_{$this->billA}", 0.40]];   // floor 0.55
        $line = $this->bankLine(50000);

        $jev = $this->as($this->accounts)->getJson($this->url("/reconciliation/{$line}/candidates"))->json('jev.bill');
        $this->assertSame([false, null], [$jev['suggested'], $jev['invoice_id']]);

        $this->postJson($this->url("/reconciliation/{$line}/match"), ['invoice_id' => $this->billB, 'bill_decision_id' => $jev['id']])->assertOk();
        $this->assertSame('changed', $this->decision('bank_match')->outcome);
    }

    /** An answer that is not one of the options offered is no answer — it can never introduce a bill. */
    public function test_an_answer_outside_the_options_is_ignored(): void
    {
        $this->reply = ['bank_match' => ['bill_999999', 0.99]];
        $line = $this->bankLine(50000);

        $jev = $this->as($this->accounts)->getJson($this->url("/reconciliation/{$line}/candidates"))->json('jev.bill');

        $this->assertSame([false, null], [$jev['suggested'], $jev['answer']]);
    }

    // ─── ③ Why it is short ───────────────────────────────────────────────────

    public function test_a_short_payment_pre_selects_tds_from_a_fact_php_computed(): void
    {
        $this->reply = ['bank_match' => ["bill_{$this->billA}", 0.9], 'short_payment' => ['client_deducted_tds', 0.88]];
        $line = $this->bankLine(49500, 'NEFT GLOBEX LTD INV-A LESS TDS');

        $jev = $this->as($this->accounts)->getJson($this->url("/reconciliation/{$line}/candidates"))->assertOk()->json('jev');
        $this->assertSame(['client_deducted_tds', 'tds'], [$jev['short']['answer'], $jev['short']['resolution']]);

        // The share is PHP's arithmetic, handed to Jev as a fact: ₹500 of ₹50,000 before tax.
        $this->assertSame('1.00%', Http::recorded()[1][0]->data()['state']['short_by_share_of_bill_before_tax']);

        $this->postJson($this->url("/reconciliation/{$line}/match"), ['invoice_id' => $this->billA, 'resolution' => 'tds',
            'bill_decision_id' => $jev['bill']['id'], 'short_decision_id' => $jev['short']['id']])->assertOk();
        $this->assertSame('accepted', $this->decision('short_payment')->outcome);
    }

    /** 🔴 "Can't tell" and "disputed" never become a write-off: they pre-select nothing, which is STILL OWED. */
    public function test_a_disputed_shortfall_is_left_still_owed(): void
    {
        $this->reply = ['bank_match' => ["bill_{$this->billA}", 0.9], 'short_payment' => ['disputed', 0.95]];
        $line = $this->bankLine(49500);

        $jev = $this->as($this->accounts)->getJson($this->url("/reconciliation/{$line}/candidates"))->json('jev.short');

        $this->assertSame([true, null], [$jev['suggested'], $jev['resolution']]);
    }

    // ─── ② Money that fits no bill ───────────────────────────────────────────

    public function test_money_that_fits_no_bill_is_read_before_anyone_mails_a_client(): void
    {
        $this->reply = ['unidentified' => ['bank_interest', 0.83]];
        $line = $this->bankLine(1234.56, 'INT CREDIT QTR SEP');   // fits no bill

        $row = collect($this->as($this->accounts)->getJson($this->url('/reconciliation/differences'))->assertOk()->json('differences'))
            ->firstWhere('transaction_id', $line);
        $this->assertSame(['unidentified', 'bank_interest', true], [$row['kind'], $row['jev']['answer'], $row['jev']['suggested']]);

        // Asked anyway: that treats it as a client's money — recorded as a change from Jev's reading.
        $this->postJson($this->url("/reconciliation/{$line}/draft-query"), ['kind' => 'unidentified']);
        $this->assertSame(['changed', 'client_payment'], [$this->decision('unidentified')->outcome, $this->decision('unidentified')->outcome_value]);
    }

    /** Money that fits an open bill is bank matching's question — never asked "what is this?", never billed twice. */
    public function test_a_line_that_fits_a_bill_is_not_read_as_unmatched_money(): void
    {
        $this->reply = ['unidentified' => ['client_payment', 0.9]];
        $line = $this->bankLine(50000);   // fits INV-A and INV-B

        $row = collect($this->as($this->accounts)->getJson($this->url('/reconciliation/differences'))->json('differences'))
            ->firstWhere('transaction_id', $line);

        $this->assertArrayNotHasKey('jev', $row);
        Http::assertNothingSent();
    }

    // ─── ④ A remittance advice ───────────────────────────────────────────────

    public function test_a_payment_mail_is_read_for_which_bills_it_pays_and_the_receipt_is_the_persons(): void
    {
        $connection = DB::table('mailbox_connections')->insertGetId(['agent_id' => $this->branch->id, 'user_id' => $this->accounts->id,
            'email_address' => 'accounts-jev@test.local', 'provider' => 'outlook', 'is_active' => 1, 'auth_state' => 'connected',
            'created_at' => now(), 'updated_at' => now()]);
        $thread = DB::table('email_threads')->insertGetId(['agent_id' => $this->branch->id, 'thread_key' => 'thr-remit-1',
            'classification' => 'payment_advice', 'status' => 'open', 'latest_message_received_at' => now(),
            'created_at' => now(), 'updated_at' => now()]);
        DB::table('email_messages')->insert(['agent_id' => $this->branch->id, 'mailbox_connection_id' => $connection,
            'thread_key' => 'thr-remit-1', 'message_id' => '<remit-1@globex.test>', 'direction' => 'inbound',
            'from' => 'Payables <payables@globex.test>', 'to' => 'accounts-jev@test.local', 'subject' => 'Payment advice',
            'body_snippet' => 'We have transferred INR 50,000 today against your invoice INV-A.', 'received_at' => now(),
            'created_at' => now(), 'updated_at' => now()]);
        $this->reply = ["item_{$this->billA}" => ['paid', 0.9]];
        $globex = DB::table('accounts_invoices')->where('id', $this->billA)->value('customer_id');
        DB::table('accounts_invoices')->insert(['agent_id' => $this->branch->id, 'customer_id' => $globex, 'parent_invoice_id' => $this->billA,
            'billed_party_type' => 'customer', 'billed_party_id' => $globex, 'invoice_no' => 'CN-A', 'type' => 'credit_note',
            'document_date' => now()->toDateString(), 'status' => 'sent', 'currency' => 'INR', 'exchange_rate' => 1,
            'subtotal' => 5000, 'tax_amount' => 0, 'grand_total' => 5000, 'created_at' => now(), 'updated_at' => now()]);

        $remittance = $this->as($this->accounts)->getJson($this->url("/inbox/threads/{$thread}"))->assertOk()->json('remittance');

        // Only Globex's bills — the sender's domain — and never a credit note, which is money WE owe them.
        $this->assertSame([$this->billA], collect($remittance['bills'])->pluck('id')->all());
        $this->assertSame([$this->billA], $remittance['jev']['bill_ids']);

        // The receipt is entered and saved by the person; what they allocated is recorded against the reading.
        $this->postJson($this->url('/receipts'), ['agent_id' => $this->branch->id, 'payer_type' => 'customer',
            'payer_id' => $remittance['bills'][0]['customer_id'], 'receipt_date' => now()->toDateString(), 'mode' => 'bank_transfer',
            'amount' => 50000, 'allocations' => [['invoice_id' => $this->billA, 'amount' => 50000]],
            'remittance_decision_id' => $remittance['jev']['id']])->assertCreated();
        $this->assertSame(['accepted', (string) $this->billA], [$this->decision('remittance')->outcome, $this->decision('remittance')->outcome_value]);
    }

    // ─── ⑤ A supplier-statement line ─────────────────────────────────────────

    /** A voucher of ₹$amount from $vendor on a fresh shipment. */
    private function voucher(\App\Partner $vendor, float $amount, string $awb): int
    {
        $enquiry = \App\Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-JEV-26-' . random_int(1000, 9999)]);
        $job = \App\Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-JEV-26-' . random_int(1000, 9999), 'awb_number' => $awb]);
        $id = DB::table('accounts_purchase_vouchers')->insertGetId(['agent_id' => $this->branch->id, 'job_id' => $job->id,
            'vendor_id' => $vendor->id, 'transport_mode' => 'air', 'voucher_no' => 'PV-JEV-' . random_int(1000, 9999),
            'document_date' => now()->subDays(5)->toDateString(), 'status' => 'unpaid', 'created_at' => now(), 'updated_at' => now()]);
        DB::table('accounts_purchase_items')->insert(['purchase_voucher_id' => $id, 'charge_type' => 'freight', 'description' => 'Freight',
            'quantity' => 1, 'rate' => $amount, 'amount' => $amount, 'tax_percentage' => 0, 'tax_amount' => 0, 'net_amount' => $amount,
            'created_at' => now(), 'updated_at' => now()]);

        return $id;
    }

    public function test_an_unmatched_statement_line_is_linked_by_a_person_on_jevs_pick_and_stays_linked(): void
    {
        $airline = \App\Partner::create(['company_id' => $this->company->id, 'agent_id' => $this->branch->id, 'name' => 'Emirates SkyCargo', 'partner_type' => 'airline']);
        $other = \App\Partner::create(['company_id' => $this->company->id, 'agent_id' => $this->branch->id, 'name' => 'BlueDart', 'partner_type' => 'transporter']);
        $right = $this->voucher($airline, 42000, '17612345675');
        $this->voucher($airline, 42000, '17612345686');
        $theirs = $this->voucher($other, 42000, '17612345690');

        $statement = DB::table('vendor_statements')->insertGetId(['agent_id' => $this->branch->id, 'vendor_id' => $airline->id,
            'vendor_type' => 'airline', 'period' => 'September 2026', 'statement_date' => now()->toDateString(), 'statement_no' => 'EK-0926',
            'status' => 'imported', 'their_total' => 42000, 'currency' => 'INR', 'created_at' => now(), 'updated_at' => now()]);
        // A reference that names no shipment: the comparison leaves it unmatched and never guesses from the amount.
        $line = DB::table('vendor_statement_lines')->insertGetId(['vendor_statement_id' => $statement, 'reference' => 'DXB-ORD-5675',
            'description' => 'AWB 176-1234 5675 BOM-DXB', 'their_amount' => 42000, 'state' => 'unmatched', 'created_at' => now(), 'updated_at' => now()]);
        $this->reply = ['statement_line' => ["voucher_{$right}", 0.8]];

        $shown = collect($this->as($this->accounts)->getJson($this->url("/vendor-statements/{$statement}"))->assertOk()->json('lines'))->firstWhere('id', $line);
        $this->assertSame([true, "voucher_{$right}"], [$shown['jev']['suggested'], $shown['jev']['answer']]);
        // Only this supplier's vouchers were offered.
        $this->assertArrayNotHasKey("voucher_{$theirs}", $shown['jev_options']);

        // Nothing linked until the person says so; another supplier's voucher is refused.
        $this->assertNull(DB::table('vendor_statement_lines')->where('id', $line)->value('matched_voucher_id'));
        $this->postJson($this->url("/vendor-statements/{$statement}/lines/{$line}/link"), ['voucher_id' => $theirs])->assertStatus(422);

        $this->postJson($this->url("/vendor-statements/{$statement}/lines/{$line}/link"),
            ['voucher_id' => $right, 'decision_id' => $shown['jev']['id']])->assertOk();
        $this->assertSame(['agreed', 'accepted'], [DB::table('vendor_statement_lines')->where('id', $line)->value('state'),
            $this->decision('statement_line')->outcome]);

        // Comparing again keeps what the person decided.
        $this->postJson($this->url("/vendor-statements/{$statement}/compare"))->assertOk();
        $this->assertSame(['agreed', $right], [DB::table('vendor_statement_lines')->where('id', $line)->value('state'),
            (int) DB::table('vendor_statement_lines')->where('id', $line)->value('matched_voucher_id')]);
    }

    // ─── ⑥ A supplier's TDS section ──────────────────────────────────────────

    public function test_a_suppliers_tds_section_is_suggested_on_demand_from_the_branchs_own_table(): void
    {
        app(\App\Services\TdsService::class)->seedRatesFor($this->branch->id);
        $trucker = \App\Partner::create(['company_id' => $this->company->id, 'agent_id' => $this->branch->id,
            'name' => 'Sharma Roadlines Pvt Ltd', 'partner_type' => 'transporter', 'pan_no' => 'AAACS1234F']);
        $this->reply = ['vendor_tds' => ['194C', 0.82]];

        $jev = $this->as($this->accounts)->postJson($this->url("/partners/{$trucker->id}/tds-suggestion"))->assertOk()->json('jev');
        $this->assertSame([true, '194C'], [$jev['suggested'], $jev['answer']]);

        // The options were the branch's own sections — no tax law written by us — and the PAN's fact was PHP's.
        $sent = Http::recorded()[0][0]->data();
        $this->assertSame(['194C', '194C-IND', '194H', '194I', '194I-B', '194J', 'none', 'not_sure'],
            array_keys($sent['questions']['vendor_tds']['criteria']));
        $this->assertSame('a company', $sent['state']['pan_holder_is']);

        // Suggested, not set: the section is still empty until the person saves.
        $this->assertNull($trucker->fresh()->tds_section);
        $this->postJson($this->url("/partners/{$trucker->id}/tds"), ['tds_section' => '194C', 'decision_id' => $jev['id']])->assertOk();
        $this->assertSame(['194C', 'accepted'], [$trucker->fresh()->tds_section, $this->decision('vendor_tds')->outcome]);
    }

    // ─── Switches, money, failure ────────────────────────────────────────────

    public function test_switched_off_it_asks_nothing_and_costs_nothing(): void
    {
        $this->as($this->accounts)->postJson($this->url('/finance-settings/jev'), ['question' => 'bank_match', 'enabled' => false])
            ->assertOk()->assertJsonPath('jev.0.enabled', false);
        $line = $this->bankLine(50000);

        $this->assertNull($this->getJson($this->url("/reconciliation/{$line}/candidates"))->assertOk()->json('jev.bill'));
        Http::assertNothingSent();
        $this->assertSame(50.0, $this->credits());
    }

    public function test_a_failed_call_is_refunded_and_forgotten_so_it_can_be_asked_again(): void
    {
        $this->failing = true;
        $line = $this->bankLine(50000);

        $this->assertNull($this->as($this->accounts)->getJson($this->url("/reconciliation/{$line}/candidates"))->assertOk()->json('jev.bill'));

        $this->assertSame(50.0, $this->credits());
        $this->assertSame(0, DB::table('ai_decisions')->where('company_id', $this->company->id)->count());
    }

    public function test_at_the_credit_floor_nothing_is_asked(): void
    {
        DB::table('companies')->where('id', $this->company->id)->update(['ocr_credits_balance' => -20, 'ocr_credits_limit' => -20]);
        $line = $this->bankLine(50000);

        $this->assertNull($this->as($this->accounts)->getJson($this->url("/reconciliation/{$line}/candidates"))->assertOk()->json('jev.bill'));
        Http::assertNothingSent();
    }

    /** 🔒 The settings list is the company's own, and a person from another company cannot record against it. */
    public function test_outcomes_and_counts_stay_inside_the_company(): void
    {
        $this->reply = ['bank_match' => ["bill_{$this->billA}", 0.91]];
        $line = $this->bankLine(50000);
        $id = $this->as($this->accounts)->getJson($this->url("/reconciliation/{$line}/candidates"))->json('jev.bill.id');

        app(\App\Services\Accounts\JevDecisions::class)->record($id, $this->company->id + 999, 'bill_1', $this->accounts->id);
        $this->assertNull($this->decision('bank_match')->outcome);

        $point = collect($this->getJson($this->url('/finance-settings'))->assertOk()->json('jev'))->firstWhere('question', 'bank_match');
        $this->assertSame([1, 1, true], [$point['asked'], $point['suggested'], $point['enabled']]);
    }
}
