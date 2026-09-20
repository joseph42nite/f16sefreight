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
 * The client book (user, 2026-09-20): every branch's clients in one list, with a salesperson and a credit limit
 * attached to each.
 */
class ClientBookTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $mumbai;
    private Agent $chennai;
    private User $accounts;
    private User $rep;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Book Co', 'code' => 'BOK', 'tier' => 'command']);
        $this->mumbai = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM']);
        $this->chennai = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Chennai', 'branch_code' => 'MAA']);

        $this->accounts = $this->user('accounts', $this->mumbai);
        $this->rep = $this->user('sales', $this->chennai);
    }

    private function user(string $designation, Agent $branch, ?Company $company = null): User
    {
        $company ??= $this->company;

        return User::create(['name' => ucfirst($designation) . ' ' . $branch->branch_code,
            'email' => $designation . '-' . $branch->branch_code . '-' . random_int(1000, 9999) . '@test.local',
            'password' => Hash::make('x'), 'company_name' => $company->id, 'branch_name' => $branch->id,
            'designation' => $designation, 'is_active' => 1]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api' . $path;
    }

    /** A billed, unpaid invoice for a client. */
    private function owe(Customer $customer, float $total, float $paid = 0, string $type = 'invoice'): void
    {
        $enquiry = Enquiry::create(['agent_id' => $this->mumbai->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-BOKBOM-26-' . random_int(1000, 9999)]);
        $job = Job::create(['agent_id' => $this->mumbai->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-BOKBOM-26-' . random_int(1000, 9999)]);

        AccountsInvoice::create(['agent_id' => $this->mumbai->id, 'job_id' => $job->id, 'customer_id' => $customer->id,
            'billed_party_type' => 'customer', 'billed_party_id' => $customer->id, 'billed_party_role' => 'client',
            'invoice_no' => strtoupper(substr($type, 0, 3)) . '-BOK-' . random_int(1000, 9999), 'type' => $type,
            'document_date' => now()->toDateString(), 'status' => 'sent', 'currency' => 'INR', 'exchange_rate' => 1,
            'subtotal' => $total, 'tax_amount' => 0, 'grand_total' => $total, 'amount_paid' => $paid]);
    }

    public function test_onboarding_captures_every_column_and_attaches_a_branch_and_a_salesperson(): void
    {
        $body = $this->as($this->accounts)->postJson($this->url('/customers'), [
            'name' => 'Globex Chennai', 'email_domain' => 'globex.test', 'email' => 'ap@globex.test',
            'phone' => '+91 44 5555 0100', 'address' => '12 Rajaji Salai, Chennai 600001',
            'branch_id' => $this->chennai->id, 'sales_id' => $this->rep->id,
            'gst_no' => '33AAACG1003A1Z5', 'pan_no' => 'AAACG1003A', 'duns_no' => '650000123',
            'payment_terms_days' => 45, 'credit_limit' => 750000,
            'bank_name' => 'HDFC Bank', 'bank_account_no' => '50200012345678', 'bank_ifsc_code' => 'HDFC0000123',
        ])->assertCreated()->json();

        $customer = Customer::withoutTenantScope()->find($body['id']);

        $this->assertSame([$this->chennai->id, $this->rep->id, 45], [
            $customer->branch_id, $customer->sales_id, $customer->payment_terms_days,
        ]);
        $this->assertSame('33AAACG1003A1Z5', $customer->gst_no);
        $this->assertSame(750000.0, (float) $customer->credit_limit);
        // 🔐 Written, encrypted, and never returned.
        $this->assertSame('50200012345678', $customer->bank_account_no);
        $this->assertArrayNotHasKey('bank_account_no', $body);
        $this->assertNotSame('50200012345678',
            DB::table('customers')->where('id', $customer->id)->value('bank_account_no'));
    }

    public function test_a_salesperson_or_branch_from_another_company_is_refused(): void
    {
        $other = Company::create(['name' => 'Rival Co', 'code' => 'RIV', 'tier' => 'command']);
        $theirBranch = Agent::create(['company_id' => $other->id, 'agent_name' => 'Delhi', 'branch_code' => 'DEL']);
        $theirRep = $this->user('sales', $theirBranch, $other);

        // 🔴 `exists:users,id` passes for any user on the platform, and sales_id is the scoping key for the whole
        // client book — the client would appear in their rep's book and vanish from ours.
        $this->as($this->accounts)->postJson($this->url('/customers'),
            ['name' => 'Stolen Client', 'sales_id' => $theirRep->id])->assertStatus(422);

        $this->postJson($this->url('/customers'),
            ['name' => 'Stolen Client', 'branch_id' => $theirBranch->id])->assertStatus(422);

        $this->assertSame(0, Customer::withoutTenantScope()->where('name', 'Stolen Client')->count());
    }

    public function test_the_book_shows_every_branch_with_the_rep_and_what_each_client_owes(): void
    {
        $chennai = Customer::create(['company_id' => $this->company->id, 'name' => 'Globex Chennai',
            'email_domain' => 'globex.test', 'branch_id' => $this->chennai->id, 'sales_id' => $this->rep->id,
            'credit_limit' => 100000]);
        $mumbai = Customer::create(['company_id' => $this->company->id, 'name' => 'Globex Mumbai',
            'email_domain' => 'globex.test', 'branch_id' => $this->mumbai->id, 'credit_limit' => 50000]);

        $this->owe($chennai, 40000);
        $this->owe($chennai, 30000, 10000);   // 20,000 still owed
        $this->owe($chennai, 15000, 0, 'credit_note');   // gives 15,000 back
        $this->owe($mumbai, 80000);           // over their 50,000 limit

        $rows = collect($this->as($this->accounts)->getJson($this->url('/customers'))->assertOk()->json('data'))
            ->keyBy('name');

        // 40,000 + 20,000 − 15,000: a credit note subtracts, the same rule as the ageing and the credit gate.
        $this->assertSame(45000.0, (float) $rows['Globex Chennai']['exposure']);
        $this->assertSame(55000.0, (float) $rows['Globex Chennai']['available']);
        $this->assertFalse($rows['Globex Chennai']['on_hold']);
        $this->assertSame(['Chennai', 'Sales MAA'], [$rows['Globex Chennai']['branch'], $rows['Globex Chennai']['salesperson']]);

        $this->assertTrue($rows['Globex Mumbai']['on_hold'], 'owed more than their limit');
        // ⚠️ A client with nobody on it is in nobody's book, so the screen has to be able to say so.
        $this->assertNull($rows['Globex Mumbai']['salesperson']);
    }

    public function test_a_client_with_no_limit_is_not_a_client_with_a_limit_of_zero(): void
    {
        $noLimit = Customer::create(['company_id' => $this->company->id, 'name' => 'Not Configured',
            'branch_id' => $this->mumbai->id]);
        $zero = Customer::create(['company_id' => $this->company->id, 'name' => 'Zero Limit',
            'branch_id' => $this->mumbai->id, 'credit_limit' => 0]);

        $this->owe($noLimit, 900000);
        $this->owe($zero, 1);

        $rows = collect($this->as($this->accounts)->getJson($this->url('/customers'))->json('data'))->keyBy('name');

        // 🔴 NULL does not block, however much they owe; 0.00 blocks on the first rupee.
        $this->assertSame([null, null, false], [$rows['Not Configured']['credit_limit'],
            $rows['Not Configured']['available'], $rows['Not Configured']['on_hold']]);
        $this->assertTrue($rows['Zero Limit']['on_hold']);
    }

    public function test_the_book_filters_by_branch_by_rep_and_by_what_is_missing(): void
    {
        Customer::create(['company_id' => $this->company->id, 'name' => 'Chennai Client',
            'branch_id' => $this->chennai->id, 'sales_id' => $this->rep->id, 'credit_limit' => 100000]);
        Customer::create(['company_id' => $this->company->id, 'name' => 'Orphan Client',
            'branch_id' => $this->mumbai->id]);

        $this->assertSame(['Chennai Client'], collect($this->as($this->accounts)
            ->getJson($this->url("/customers?branch_id={$this->chennai->id}"))->json('data'))->pluck('name')->all());

        $this->assertSame(['Chennai Client'], collect($this->getJson($this->url("/customers?sales_id={$this->rep->id}"))
            ->json('data'))->pluck('name')->all());

        $this->assertSame(['Orphan Client'], collect($this->getJson($this->url('/customers?unassigned=1'))
            ->json('data'))->pluck('name')->all());

        $this->assertSame(['Orphan Client'], collect($this->getJson($this->url('/customers?no_limit=1'))
            ->json('data'))->pluck('name')->all());
    }

    public function test_the_form_is_offered_our_own_branches_and_reps_only(): void
    {
        $other = Company::create(['name' => 'Rival Co', 'code' => 'RVL', 'tier' => 'command']);
        $theirBranch = Agent::create(['company_id' => $other->id, 'agent_name' => 'Theirs', 'branch_code' => 'XXX']);
        $this->user('sales', $theirBranch, $other);

        $options = $this->as($this->accounts)->getJson($this->url('/customers'))->assertOk()->json('options');

        $this->assertSame(['Chennai', 'Mumbai'], collect($options['branches'])->pluck('name')->sort()->values()->all());
        $this->assertSame([$this->rep->id], collect($options['salespeople'])->pluck('id')->all());
    }

    public function test_the_port_picker_searches_the_locode_directory(): void
    {
        DB::table('ports')->insert([
            ['locode' => 'INMAA', 'port_name' => 'Chennai (ex Madras)', 'country_code' => 'IN', 'port_type' => 'sea',
             'is_active' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['locode' => 'DEHAM', 'port_name' => 'Hamburg', 'country_code' => 'DE', 'port_type' => 'sea',
             'is_active' => 1, 'created_at' => now(), 'updated_at' => now()],
        ]);

        $byCode = $this->as($this->accounts)->getJson($this->url('/customers/ports?q=INMA'))->assertOk()->json('ports');
        $this->assertSame('INMAA', $byCode[0]['locode']);

        $byName = $this->getJson($this->url('/customers/ports?q=hambur'))->json('ports');
        $this->assertSame('DEHAM', $byName[0]['locode']);
    }

    public function test_below_command_a_client_carries_no_credit_terms_at_all(): void
    {
        $tactical = Company::create(['name' => 'Tactical Co', 'code' => 'TCT', 'tier' => 'tactical']);
        $branch = Agent::create(['company_id' => $tactical->id, 'agent_name' => 'Kochi', 'branch_code' => 'COK']);
        $user = $this->user('pricing', $branch, $tactical);

        Customer::create(['company_id' => $tactical->id, 'name' => 'Tactical Client',
            'branch_id' => $branch->id, 'credit_limit' => 500000]);

        $body = $this->as($user)->getJson('http://focusair.localhost/api/customers')->assertOk()->json();

        $this->assertFalse($body['with_accounts']);
        $this->assertArrayNotHasKey('credit_limit', $body['data'][0]);
        $this->assertArrayNotHasKey('exposure', $body['data'][0], 'no exposure below Command either');
    }
}
