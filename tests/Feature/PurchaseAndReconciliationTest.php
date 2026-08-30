<?php

namespace Tests\Feature;

use App\AccountsInvoice;
use App\AccountsInvoiceItem;
use App\AccountsPurchaseItem;
use App\AccountsPurchaseVoucher;
use App\Agent;
use App\BankTransaction;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\Job;
use App\Partner;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The buy side and bank reconciliation — guide §5.3, PRD.md §6.4.
 *
 * ⚠️ Never `actingAs()`. It bypasses both JWT and the Host-derived portal scope, so
 * the suite would pass while air users saw sea data in production. And the Host must
 * go in an ABSOLUTE URL — Symfony's Request::create overrides HTTP_HOST from the URI
 * and silently discards a Host header.
 */
class PurchaseAndReconciliationTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $accounts;
    private Job $job;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Recon Co', 'code' => 'RCN', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = $this->user('accounts');

        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-RCNBOM-26-0001',
        ]);
        $this->job = Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
        ]);

        $this->openPeriod();
    }

    private function user(string $designation): User
    {
        return User::create([
            'name' => $designation, 'email' => "{$designation}-rcn@test.local", 'password' => Hash::make('x'),
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

    private function openPeriod(): void
    {
        DB::table('accounting_periods')->insert([
            'agent_id' => $this->branch->id, 'period_name' => 'FY26',
            'start_date' => now()->startOfYear()->toDateString(),
            'end_date' => now()->endOfYear()->toDateString(),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function voucher(float $net, float $tax = 0.0): AccountsPurchaseVoucher
    {
        $vendor = Partner::create([
            'company_id' => $this->company->id, 'name' => 'Carrier ' . random_int(1, 99999),
            'partner_type' => 'airline',
        ]);

        $voucher = AccountsPurchaseVoucher::create([
            'agent_id' => $this->branch->id, 'job_id' => $this->job->id, 'transport_mode' => 'air',
            'vendor_id' => $vendor->id, 'document_date' => now()->toDateString(),
            'voucher_no' => 'PV-RCNBOM-26-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
            'status' => 'unpaid',
        ]);

        AccountsPurchaseItem::create([
            'purchase_voucher_id' => $voucher->id, 'charge_type' => 'air_freight',
            'description' => 'Airline cost', 'quantity' => 1,
            'rate' => $net, 'amount' => $net,
            'tax_amount' => $tax, 'net_amount' => $net + $tax,
        ]);

        return $voucher;
    }

    private function invoice(float $total, float $paid = 0.0, string $status = 'finalized'): AccountsInvoice
    {
        $customer = Customer::create([
            'company_id' => $this->company->id, 'name' => 'Acme ' . random_int(1, 99999),
            'email_domain' => 'acme.test',
        ]);

        $invoice = AccountsInvoice::create([
            'agent_id' => $this->branch->id, 'job_id' => $this->job->id, 'customer_id' => $customer->id,
            'invoice_no' => 'INV-RCNBOM-26-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
            'type' => 'invoice', 'document_date' => now()->toDateString(), 'status' => $status,
            'subtotal' => $total, 'grand_total' => $total, 'amount_paid' => $paid,
        ]);

        AccountsInvoiceItem::create([
            'invoice_id' => $invoice->id, 'charge_type' => 'air_freight', 'description' => 'Freight',
            'quantity' => 1, 'rate' => $total, 'amount' => $total, 'net_amount' => $total,
        ]);

        return $invoice;
    }

    private function bankRow(float $amount): BankTransaction
    {
        return BankTransaction::create([
            'agent_id' => $this->branch->id, 'amount' => $amount,
            'plaid_transaction_id' => 'txn_' . uniqid('', true),
        ]);
    }

    private function journalOf(string $type, int $id): array
    {
        return DB::table('accounts_ledger_entries as l')
            ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->where('l.source_type', $type)->where('l.source_id', $id)
            ->get(['c.account_code', 'l.debit_amount', 'l.credit_amount'])
            ->keyBy('account_code')
            ->map(fn ($r) => ['dr' => (float) $r->debit_amount, 'cr' => (float) $r->credit_amount])
            ->all();
    }

    // ─── The buy side ────────────────────────────────────────────────────────

    /**
     * 🔴 The MIRROR of the sell side: input GST is an ASSET (reclaimable), not an
     * expense. Folding it into cost understates the reclaim and overstates the cost
     * of every shipment — while balancing perfectly, which is why the accounts are
     * asserted rather than just the totals.
     */
    public function test_posting_a_voucher_debits_cost_and_input_gst_separately(): void
    {
        $voucher = $this->voucher(80000.00, 14400.00);

        $this->api($this->accounts)
            ->postJson($this->url("/api/vouchers/{$voucher->id}/post"))
            ->assertOk()
            ->assertJsonPath('is_posted', true);

        $journal = $this->journalOf('purchase_voucher', $voucher->id);

        $this->assertSame(80000.00, $journal['5000-Direct-Costs']['dr'], 'Cost is net of tax.');
        $this->assertSame(14400.00, $journal['1300-GST-Input']['dr'], 'Input tax is a reclaimable ASSET.');
        $this->assertSame(94400.00, $journal['2100-AP']['cr'], 'The vendor is owed the gross.');
    }

    /**
     * 🔴 THE BUY RATE MUST NEVER REACH A RESPONSE. Stripped server-side, because a
     * field omitted from a Vue template still arrives in the JSON.
     */
    public function test_the_buy_rate_never_appears_in_the_register_response(): void
    {
        $this->voucher(80000.00, 14400.00);

        $body = $this->api($this->accounts)
            ->getJson($this->url('/api/vouchers'))
            ->assertOk()
            ->getContent();

        $this->assertStringNotContainsString('"rate"', $body);
        // The line total DOES belong — it is the cost side of the margin.
        $this->assertStringContainsString('"amount"', $body);
    }

    /** A voucher with no lines asserts a liability of nothing. */
    public function test_a_voucher_with_no_items_cannot_be_posted(): void
    {
        $voucher = $this->voucher(1000.00);
        $voucher->items()->delete();

        $this->api($this->accounts)
            ->postJson($this->url("/api/vouchers/{$voucher->id}/post"))
            ->assertStatus(422)
            ->assertJsonPath('reason', 'no_items');
    }

    public function test_a_voucher_cannot_be_posted_twice(): void
    {
        $voucher = $this->voucher(5000.00);

        $this->api($this->accounts)->postJson($this->url("/api/vouchers/{$voucher->id}/post"))->assertOk();
        $this->api($this->accounts)
            ->postJson($this->url("/api/vouchers/{$voucher->id}/post"))
            ->assertStatus(422)
            ->assertJsonPath('reason', 'already_posted');
    }

    /** 🔒 Segregation of duties is not a sell-side-only concept. */
    public function test_a_boss_may_read_vouchers_but_not_post_them(): void
    {
        $boss = $this->user('boss');
        $admin = 'admin.f16sefreight.com';
        $voucher = $this->voucher(5000.00);

        $this->api($boss)->getJson($this->url('/api/vouchers', $admin))->assertOk();
        $this->api($boss)->postJson($this->url("/api/vouchers/{$voucher->id}/post", $admin))->assertForbidden();
    }

    // ─── Reconciliation ──────────────────────────────────────────────────────

    /** An exact amount is HIGH confidence only when it is the only one. */
    public function test_a_unique_exact_amount_is_high_confidence(): void
    {
        $invoice = $this->invoice(118000.00);
        $txn = $this->bankRow(118000.00);

        $this->api($this->accounts)
            ->getJson($this->url("/api/reconciliation/{$txn->id}/candidates"))
            ->assertOk()
            ->assertJsonPath('candidates.0.confidence', 'high')
            ->assertJsonPath('candidates.0.invoice.id', $invoice->id);
    }

    /**
     * 🔴 TWO INVOICES FOR THE SAME AMOUNT ARE BOTH `medium`, NEVER one `high`.
     * A coin flip presented as a confident match is worse than no suggestion, because
     * the accountant stops checking. The memo would separate them — and the bank feed
     * does not carry one (see BankReconciliationService).
     */
    public function test_two_identical_amounts_are_never_promoted_to_high(): void
    {
        $this->invoice(50000.00);
        $this->invoice(50000.00);
        $txn = $this->bankRow(50000.00);

        $body = $this->api($this->accounts)
            ->getJson($this->url("/api/reconciliation/{$txn->id}/candidates"))
            ->assertOk()
            ->json();

        $this->assertCount(2, $body['candidates']);
        foreach ($body['candidates'] as $c) {
            $this->assertSame('medium', $c['confidence']);
        }
    }

    /** A full settlement closes the invoice and moves cash, not just a flag. */
    public function test_matching_writes_a_receipt_journal_and_closes_the_invoice(): void
    {
        $invoice = $this->invoice(100000.00);
        $txn = $this->bankRow(100000.00);

        $this->api($this->accounts)
            ->postJson($this->url("/api/reconciliation/{$txn->id}/match"), ['invoice_id' => $invoice->id])
            ->assertOk()
            ->assertJsonPath('invoice.status', 'paid')
            ->assertJsonPath('transaction.reconciliation_status', 'matched');

        $journal = $this->journalOf('receipt', $invoice->id);

        $this->assertSame(100000.00, $journal['1100-Bank']['dr'], 'Cash up.');
        $this->assertSame(100000.00, $journal['1200-AR']['cr'], 'Receivable down.');
    }

    /**
     * A write-off closes the invoice for LESS cash, and the difference lands in an
     * expense account where it can be reported on. Netting it against the receivable
     * instead would hide the cost entirely.
     */
    public function test_a_write_off_closes_the_invoice_and_books_the_shortfall(): void
    {
        $invoice = $this->invoice(100000.00);
        $txn = $this->bankRow(99500.00); // 500 short — bank charges deducted in transit.

        $this->api($this->accounts)
            ->postJson($this->url("/api/reconciliation/{$txn->id}/match"), [
                'invoice_id' => $invoice->id, 'resolution' => 'write_off',
            ])
            ->assertOk()
            ->assertJsonPath('invoice.status', 'paid')
            ->assertJsonPath('shortfall', 500);

        $journal = $this->journalOf('receipt', $invoice->id);

        $this->assertSame(99500.00, $journal['1100-Bank']['dr']);
        $this->assertSame(500.00, $journal['5100-Bank-Charges']['dr'], 'The absorbed cost is visible.');
        $this->assertSame(100000.00, $journal['1200-AR']['cr'], 'The receivable clears in FULL.');
    }

    /** short_paid is the default and the only resolution that leaves money owed. */
    public function test_a_short_payment_left_open_stays_partially_paid(): void
    {
        $invoice = $this->invoice(100000.00);
        $txn = $this->bankRow(60000.00);

        $this->api($this->accounts)
            ->postJson($this->url("/api/reconciliation/{$txn->id}/match"), [
                'invoice_id' => $invoice->id, 'resolution' => 'short_paid',
            ])
            ->assertOk()
            ->assertJsonPath('invoice.status', 'partially_paid');

        $this->assertSame(0, count(array_filter(
            array_keys($this->journalOf('receipt', $invoice->id)),
            fn ($code) => $code === '5100-Bank-Charges'
        )), 'Nothing is written off when the balance stays open.');
    }

    /**
     * ⚠️ An OVERPAYMENT is refused, not absorbed. A duplicate transfer, a wrong
     * invoice and an advance are different events with different correct answers;
     * pushing amount_paid past grand_total picks one at random and hides it.
     */
    public function test_an_overpayment_is_refused(): void
    {
        $invoice = $this->invoice(50000.00);
        $txn = $this->bankRow(75000.00);

        $this->api($this->accounts)
            ->postJson($this->url("/api/reconciliation/{$txn->id}/match"), ['invoice_id' => $invoice->id])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'overpayment');
    }

    /**
     * 🔴 THE RACE IS DECIDED IN THE DATABASE. Two accountants must not settle the
     * same money against two invoices — the second attempt loses, and says so.
     */
    public function test_the_same_bank_row_cannot_be_matched_twice(): void
    {
        $first = $this->invoice(40000.00);
        $second = $this->invoice(40000.00);
        $txn = $this->bankRow(40000.00);

        $this->api($this->accounts)
            ->postJson($this->url("/api/reconciliation/{$txn->id}/match"), ['invoice_id' => $first->id])
            ->assertOk();

        $this->api($this->accounts)
            ->postJson($this->url("/api/reconciliation/{$txn->id}/match"), ['invoice_id' => $second->id])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'already_reconciled');
    }

    /** A posted receipt is reversed with a contra entry, never by unmatching. */
    public function test_a_matched_row_cannot_be_unmatched_once_its_receipt_is_posted(): void
    {
        $invoice = $this->invoice(30000.00);
        $txn = $this->bankRow(30000.00);

        $this->api($this->accounts)
            ->postJson($this->url("/api/reconciliation/{$txn->id}/match"), ['invoice_id' => $invoice->id])
            ->assertOk();

        $this->api($this->accounts)
            ->postJson($this->url("/api/reconciliation/{$txn->id}/unmatch"))
            ->assertStatus(422)
            ->assertJsonPath('reason', 'receipt_posted');
    }

    /** 🔒 The Boss reads the reconciliation queue; only accounts settles against it. */
    public function test_a_boss_cannot_reconcile(): void
    {
        $boss = $this->user('boss');
        $admin = 'admin.f16sefreight.com';
        $invoice = $this->invoice(10000.00);
        $txn = $this->bankRow(10000.00);

        $this->api($boss)->getJson($this->url('/api/reconciliation', $admin))->assertOk();
        $this->api($boss)
            ->postJson($this->url("/api/reconciliation/{$txn->id}/match", $admin), ['invoice_id' => $invoice->id])
            ->assertForbidden();
    }
}
