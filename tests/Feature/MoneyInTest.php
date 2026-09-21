<?php

namespace Tests\Feature;

use App\AccountsInvoice;
use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\Job;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Money in (guide §11.2): the five stages a rupee travels, and the register slices they name.
 */
class MoneyInTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Customer $client;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Pipeline Co', 'code' => 'PIP', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-pip@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);
        $this->client = Customer::create(['company_id' => $company->id, 'name' => 'Globex', 'email_domain' => 'globex.test']);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api' . $path;
    }

    private function invoice(array $attributes = []): AccountsInvoice
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-PIPBOM-26-' . random_int(1000, 9999)]);
        $job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-PIPBOM-26-' . random_int(1000, 9999)]);

        return AccountsInvoice::create(array_merge([
            'agent_id' => $this->branch->id, 'job_id' => $job->id, 'customer_id' => $this->client->id,
            'billed_party_type' => 'customer', 'billed_party_id' => $this->client->id, 'billed_party_role' => 'client',
            'invoice_no' => 'INV-PIP-' . random_int(1000, 9999), 'type' => 'invoice',
            'document_date' => now()->toDateString(), 'status' => 'sent', 'currency' => 'INR', 'exchange_rate' => 1,
            'subtotal' => 10000, 'tax_amount' => 0, 'grand_total' => 10000,
        ], $attributes));
    }

    private function stages(): array
    {
        return collect($this->as($this->accounts)->getJson($this->url('/money-in/stages'))->assertOk()->json('stages'))
            ->keyBy('key')->all();
    }

    public function test_a_draft_handed_over_and_a_draft_raised_here_are_different_stages(): void
    {
        $handedOver = $this->invoice(['status' => 'draft', 'grand_total' => 48000, 'sent_to_accounts_at' => now()]);
        $ownDraft = $this->invoice(['status' => 'draft', 'grand_total' => 12000]);
        $this->invoice(['grand_total' => 30000]);

        $stages = $this->stages();

        // ① is pricing's hand-over; ② is what this desk started and has not finished. Lumping them together
        // hides whose move it is.
        $this->assertSame([1, 48000.0], [$stages['to_bill']['count'], (float) $stages['to_bill']['amount']]);
        $this->assertSame([1, 12000.0], [$stages['drafts']['count'], (float) $stages['drafts']['amount']]);
        $this->assertSame([1, 30000.0], [$stages['issued']['count'], (float) $stages['issued']['amount']]);

        // The register slices the same way, so the stage and the list under it cannot disagree.
        $this->assertSame([$handedOver->invoice_no],
            collect($this->getJson($this->url('/billing?awaiting=1'))->json('rows'))->pluck('invoice_no')->all());
        $this->assertSame([$ownDraft->invoice_no],
            collect($this->getJson($this->url('/billing?own_drafts=1'))->json('rows'))->pluck('invoice_no')->all());
    }

    public function test_a_credit_note_takes_money_off_the_issued_stage(): void
    {
        $this->invoice(['grand_total' => 100000]);
        $this->invoice(['type' => 'credit_note', 'grand_total' => 15000]);

        // 🔴 Its face is positive; in a total it gives money back — the same rule as every other register.
        $this->assertSame(85000.0, (float) $this->stages()['issued']['amount']);
        $this->assertSame(2, $this->stages()['issued']['count']);
    }

    public function test_stage_four_separates_what_arrived_from_what_is_still_to_place(): void
    {
        DB::table('accounts_receipts')->insert([
            'agent_id' => $this->branch->id, 'payer_type' => 'customer', 'payer_id' => $this->client->id,
            'receipt_no' => 'RCPT-PIP-1', 'receipt_date' => now()->toDateString(), 'mode' => 'bank_transfer',
            'amount' => 60000, 'currency' => 'INR', 'exchange_rate' => 1, 'is_posted' => 0,
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('bank_transactions')->insert([
            'agent_id' => $this->branch->id, 'provider' => 'manual', 'plaid_transaction_id' => 'UTR-PIP-1',
            'reference' => 'UTR-PIP-1', 'amount' => 25000, 'value_date' => now()->toDateString(),
            'direction' => 'credit', 'reconciliation_status' => 'unreconciled', 'currency' => 'INR',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $stage = $this->stages()['money_in'];

        $this->assertSame(60000.0, (float) $stage['amount'], 'what has been receipted');
        $this->assertSame(25000.0, (float) $stage['unplaced']['amount'], 'what is still sitting in the bank');
        $this->assertStringContainsString('1 payment(s) still to place', $stage['note']);
    }

    public function test_a_branch_sees_only_its_own_company_in_every_stage(): void
    {
        $other = Company::create(['name' => 'Rival Pipe', 'code' => 'RVP', 'tier' => 'command']);
        $theirBranch = Agent::create(['company_id' => $other->id, 'agent_name' => 'DEL', 'branch_code' => 'DEL']);
        $theirClient = Customer::create(['company_id' => $other->id, 'name' => 'Theirs', 'email_domain' => 'theirs.test']);

        $enquiry = Enquiry::create(['agent_id' => $theirBranch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-RVPDEL-26-1111']);
        $job = Job::create(['agent_id' => $theirBranch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-RVPDEL-26-1111']);
        AccountsInvoice::create(['agent_id' => $theirBranch->id, 'job_id' => $job->id, 'customer_id' => $theirClient->id,
            'billed_party_type' => 'customer', 'billed_party_id' => $theirClient->id, 'billed_party_role' => 'client',
            'invoice_no' => 'INV-RVP-1', 'type' => 'invoice', 'document_date' => now()->toDateString(),
            'status' => 'sent', 'currency' => 'INR', 'exchange_rate' => 1,
            'subtotal' => 999000, 'tax_amount' => 0, 'grand_total' => 999000]);

        $this->invoice(['grand_total' => 10000]);

        // 🔴 Their 999,000 must not appear in any stage of ours.
        $this->assertSame(10000.0, (float) $this->stages()['issued']['amount']);
        $this->assertSame(1, $this->stages()['issued']['count']);
    }

    public function test_pricing_cannot_read_the_pipeline(): void
    {
        $pricing = User::create(['name' => 'Pricing', 'email' => 'pricing-pip@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->branch->company_id, 'branch_name' => $this->branch->id,
            'designation' => 'pricing', 'is_active' => 1]);

        $this->as($pricing)->getJson('http://focusair.localhost/api/money-in/stages')->assertForbidden();
    }
}
