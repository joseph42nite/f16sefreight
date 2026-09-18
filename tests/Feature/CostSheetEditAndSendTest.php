<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enquiry;
use App\Job;
use App\Partner;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/** Cost sheet lines can be changed, and pricing hands the sheet to accounts (user, 2026-09-18). */
class CostSheetEditAndSendTest extends TestCase
{
    use DatabaseTransactions;

    private Job $job;
    private Agent $branch;
    private User $pricing;
    private User $accounts;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Sheet Co', 'code' => 'SHT', 'tier' => 'command']);
        $this->branch = $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $user = fn (string $role) => User::create(['name' => ucfirst($role), 'email' => "{$role}-sht@test.local", 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => $role, 'is_active' => 1]);
        $this->pricing = $user('pricing');
        $this->accounts = $user('accounts');
        $enquiry = Enquiry::create(['agent_id' => $branch->id, 'transport_mode' => 'air', 'status' => 'converted', 'enquiry_no' => 'ENQA-SHTBOM-26-0001']);
        $this->job = Job::create(['agent_id' => $branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-SHTBOM-26-0001', 'status' => 'Intake']);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path = ''): string
    {
        return "http://focusair.localhost/api/jobs/{$this->job->id}/cost-sheet{$path}";
    }

    public function test_lines_are_added_changed_and_the_sheet_is_sent_to_accounts(): void
    {
        $sheet = $this->as($this->pricing)->postJson($this->url('/lines'), ['side' => 'sell', 'charge_type' => 'air_freight',
            'description' => 'Air freight', 'quantity' => 100, 'rate' => 80, 'tax_percentage' => 18])->assertCreated()->json();
        $line = $sheet['sell']['lines'][0];
        $this->assertSame(9440.0, (float) $sheet['sell']['total']);

        // Changed in place: 120 × 85, tax 18%.
        $changed = $this->putJson($this->url("/sell/{$line['id']}"), ['charge_type' => 'air_freight',
            'description' => 'Air freight — revised', 'quantity' => 120, 'rate' => 85, 'tax_percentage' => 18])->assertOk()->json();

        $this->assertSame('Air freight — revised', $changed['sell']['lines'][0]['description']);
        $this->assertSame(12036.0, (float) $changed['sell']['total']);

        // A buy line, and it can be changed too.
        $vendor = Partner::create(['company_id' => $this->branch->company_id, 'name' => 'Skylink', 'partner_type' => 'agent']);
        $withBuy = $this->postJson($this->url('/lines'), ['side' => 'buy', 'charge_type' => 'air_freight', 'description' => 'Carrier',
            'quantity' => 120, 'rate' => 60, 'vendor_id' => $vendor->id])->assertCreated()->json();
        $buyLine = $withBuy['buy']['lines'][0];

        $afterBuy = $this->putJson($this->url("/buy/{$buyLine['id']}"), ['charge_type' => 'air_freight',
            'description' => 'Carrier — agreed', 'quantity' => 120, 'rate' => 55])->assertOk()->json();
        $this->assertSame(6600.0, (float) $afterBuy['buy']['total']);
        $this->assertSame(5436.0, (float) $afterBuy['margin']['value']);

        // Nothing reaches accounts until it is sent.
        $this->assertNull($afterBuy['sent_to_accounts']);
        $sent = $this->postJson($this->url('/send'))->assertOk()->json();
        $this->assertSame('Pricing', $sent['sent_to_accounts']['by']);
        $this->assertNotNull($sent['sent_to_accounts']['at']);

        // Sending does NOT post it: accounts still finalize.
        $this->assertSame('draft', DB::table('accounts_invoices')->where('job_id', $this->job->id)->value('status'));
        $this->assertFalse((bool) DB::table('accounts_invoices')->where('job_id', $this->job->id)->value('is_posted'));
    }

    /** An empty sheet has nothing to send, and operations cannot change anyone's figures. */
    public function test_an_empty_sheet_is_refused_and_only_pricing_or_accounts_may_edit(): void
    {
        $this->as($this->pricing)->postJson($this->url('/send'))->assertStatus(422)->assertJsonPath('reason', 'nothing_to_send');

        $sheet = $this->postJson($this->url('/lines'), ['side' => 'sell', 'charge_type' => 'cartage', 'description' => 'Cartage',
            'quantity' => 1, 'rate' => 2000])->assertCreated()->json();
        $line = $sheet['sell']['lines'][0];

        $operations = User::create(['name' => 'Ops', 'email' => 'ops-sht@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->branch->company_id, 'branch_name' => $this->branch->id, 'designation' => 'operations', 'is_active' => 1]);

        $this->as($operations)->putJson($this->url("/sell/{$line['id']}"), ['charge_type' => 'cartage',
            'description' => 'Cartage', 'quantity' => 1, 'rate' => 1])->assertForbidden();
        $this->postJson($this->url('/send'))->assertForbidden();
    }

    /**
     * A buy line with no vendor is owed to the airline the WAYBILL names — its first three digits (user, 2026-09-18:
     * "we have an airline table … you will get to know from the 3 letter code of the AWB number which airline it is").
     */
    public function test_a_buy_line_is_owed_to_the_airline_the_awb_prefix_names(): void
    {
        DB::table('airlines')->updateOrInsert(['prefix' => '176'], ['name' => 'Emirates SkyCargo', 'code' => 'EK', 'is_active' => 1]);
        $this->job->forceFill(['awb_number' => '176-12345678'])->save();

        $sheet = $this->as($this->pricing)->postJson($this->url('/lines'), ['side' => 'buy', 'charge_type' => 'air_freight',
            'description' => 'Air freight', 'quantity' => 102, 'rate' => 150])->assertCreated()->json();

        $this->assertSame(15300.0, (float) $sheet['buy']['total']);
        $this->assertSame(['Emirates SkyCargo', 'EK', '176'], [$sheet['awb_airline']['name'], $sheet['awb_airline']['code'], $sheet['awb_airline']['prefix']]);

        // The airline is kept as this company's partner, so the voucher accounts will pay points at somebody real.
        $vendorId = DB::table('accounts_purchase_vouchers')->where('job_id', $this->job->id)->value('vendor_id');
        $this->assertSame('Emirates SkyCargo', DB::table('partners')->where('id', $vendorId)->value('name'));
        $this->assertSame('airline', DB::table('partners')->where('id', $vendorId)->value('partner_type'));

        // A second line does not create a second partner for the same airline.
        $this->postJson($this->url('/lines'), ['side' => 'buy', 'charge_type' => 'miscellaneous',
            'description' => 'Fuel surcharge', 'quantity' => 1, 'rate' => 2000])->assertCreated();
        $this->assertSame(1, DB::table('partners')->where('company_id', $this->branch->company_id)->where('name', 'Emirates SkyCargo')->count());

        // A prefix the directory does not know still asks for a vendor — on a shipment with no supplier yet.
        $unknown = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $this->job->enquiry_id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-SHTBOM-26-0002', 'awb_number' => '999-12345678', 'status' => 'Intake']);

        $this->postJson("http://focusair.localhost/api/jobs/{$unknown->id}/cost-sheet/lines", ['side' => 'buy',
            'charge_type' => 'cartage', 'description' => 'Cartage', 'quantity' => 1, 'rate' => 500])->assertStatus(422);
    }

    /** Each supplier is paid against its own voucher (user, 2026-09-18), and every buy line says who is owed it. */
    public function test_each_supplier_has_its_own_voucher(): void
    {
        DB::table('airlines')->updateOrInsert(['prefix' => '176'], ['name' => 'Emirates SkyCargo', 'code' => 'EK', 'is_active' => 1]);
        $this->job->forceFill(['awb_number' => '176-12345678'])->save();
        $trucker = Partner::create(['company_id' => $this->branch->company_id, 'name' => 'Blue Dart Surface', 'partner_type' => 'transporter']);

        // The airline, off the waybill; then the trucker, chosen.
        $this->as($this->pricing)->postJson($this->url('/lines'), ['side' => 'buy', 'charge_type' => 'air_freight',
            'description' => 'Air freight', 'quantity' => 102, 'rate' => 150])->assertCreated();
        $sheet = $this->postJson($this->url('/lines'), ['side' => 'buy', 'charge_type' => 'cartage',
            'description' => 'Cartage to the airport', 'quantity' => 1, 'rate' => 2500, 'vendor_id' => $trucker->id])->assertCreated()->json();

        $vouchers = DB::table('accounts_purchase_vouchers as v')->join('partners as p', 'p.id', '=', 'v.vendor_id')
            ->where('v.job_id', $this->job->id)->orderBy('p.name')->pluck('p.name');

        $this->assertSame(['Blue Dart Surface', 'Emirates SkyCargo'], $vouchers->all());
        $this->assertSame(['Blue Dart Surface', 'Emirates SkyCargo'], collect($sheet['buy']['lines'])->pluck('vendor')->all());
        $this->assertSame(17800.0, (float) $sheet['buy']['total']);

        // A second line for the same supplier joins that supplier's voucher rather than opening another.
        $this->postJson($this->url('/lines'), ['side' => 'buy', 'charge_type' => 'miscellaneous',
            'description' => 'Fuel surcharge', 'quantity' => 1, 'rate' => 2000])->assertCreated();
        $this->assertSame(2, DB::table('accounts_purchase_vouchers')->where('job_id', $this->job->id)->count());
    }
}
