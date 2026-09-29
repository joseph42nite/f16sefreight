<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\Job;
use App\Partner;
use App\Services\BlPdf;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The printed bill of lading — guide Step 12.3 (GAPS #433). The LAYOUT is proposed and awaits the owner; what is
 * asserted here is that the right document prints for the right people with the form's own figures.
 */
class BlPrintTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private Customer $client;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Print Co', 'code' => 'PRC', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM',
            'agent_city' => 'Mumbai', 'agent_country' => 'India']);
        $this->client = Customer::create(['company_id' => $this->company->id, 'name' => 'Exporter Ltd', 'address' => "1 Dock Road\nMumbai"]);
    }

    private function user(string $designation): User
    {
        return User::create(['name' => $designation, 'email' => "{$designation}-prc@test.local", 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id, 'designation' => $designation, 'is_active' => 1]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path, string $portal = 'focussea'): string
    {
        return "http://{$portal}.f16sefreight.com/api{$path}";
    }

    private function job(string $mode = 'sea', array $attrs = []): Job
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => $mode,
            'enquiry_no' => ($mode === 'sea' ? 'ENQS' : 'ENQA') . '-PRCBOM-26-' . random_int(1000, 9999), 'customer_id' => $this->client->id]);

        return Job::create(array_merge(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => $mode,
            'customer_id' => $this->client->id, 'execution_job_no' => ($mode === 'sea' ? 'JOBS' : 'JOBA') . '-PRCBOM-26-' . random_int(1000, 9999)], $attrs));
    }

    private function details(Job $job, array $attrs = []): void
    {
        DB::table('sea_shipment_details')->insert(array_merge([
            'job_id' => $job->id, 'vessel_name' => 'MV Test', 'voyage_no' => 'V1', 'pol_code' => 'INNSA', 'pod_code' => 'DEHAM',
            'commodity_description' => 'Cotton yarn', 'piece_count' => 12, 'package_code' => 'CTN',
            'gross_weight' => 4500.5, 'volume_cbm' => 18.25, 'freight_terms' => 'prepaid',
            'created_at' => now(), 'updated_at' => now(),
        ], $attrs));
    }

    public function test_a_house_prints_as_a_pdf_with_the_forms_own_figures(): void
    {
        $house = $this->job();
        $this->details($house, ['hbl_number' => 'HBL0001']);
        DB::table('job_entities')->insert(['agent_id' => $this->branch->id, 'job_id' => $house->id, 'party_type' => 'customer',
            'party_id' => $this->client->id, 'role' => 'shipper', 'created_at' => now(), 'updated_at' => now()]);
        DB::table('sea_containers')->insert(['agent_id' => $this->branch->id, 'job_id' => $house->id,
            'container_number' => 'CSQU3054383', 'container_type' => '40HC', 'seal_number' => 'SL1', 'created_at' => now(), 'updated_at' => now()]);

        $this->as($this->user('operations'))->get($this->url("/jobs/{$house->id}/bl.pdf"))
            ->assertOk()->assertHeader('Content-Type', 'application/pdf');

        $bl = app(BlPdf::class)->shape($house);
        $this->assertSame('House Bill of Lading', $bl['title']);
        $this->assertSame('HBL0001', $bl['number']);
        $this->assertFalse($bl['draft']);
        $this->assertSame('Exporter Ltd', $bl['shipper']['name']);
        $this->assertSame('CSQU3054383', $bl['containers'][0]->container_number);
        $this->assertSame('MV Test / V1', $bl['vessel']);
    }

    /** A master's shipper is the branch, and an unnumbered bill prints as a DRAFT. */
    public function test_an_unnumbered_master_prints_as_a_draft_with_the_branch_as_shipper(): void
    {
        $master = $this->job('sea', ['enquiry_id' => null, 'customer_id' => null, 'is_consolidation' => true]);
        $this->details($master);
        $this->job('sea', ['parent_job_id' => $master->id, 'is_sub_shipment' => true]);
        DB::table('job_entities')->insert(['agent_id' => $this->branch->id, 'job_id' => $master->id, 'party_type' => 'branch',
            'party_id' => $this->branch->id, 'role' => 'shipper', 'created_at' => now(), 'updated_at' => now()]);
        $carrier = Partner::create(['company_id' => $this->company->id, 'agent_id' => $this->branch->id,
            'name' => 'Maersk Line', 'partner_type' => 'shipping_line']);
        DB::table('sea_shipment_details')->where('job_id', $master->id)->update(['carrier_id' => $carrier->id]);

        $bl = app(BlPdf::class)->shape($master);

        $this->assertSame('Master Bill of Lading', $bl['title']);
        $this->assertTrue($bl['draft']);
        $this->assertSame('Print Co — Mumbai', $bl['shipper']['name']);
        $this->assertSame('Maersk Line', $bl['carrier']);
        $this->assertSame(1, $bl['houses']);
    }

    public function test_an_air_job_has_no_bill_of_lading(): void
    {
        $air = $this->job('air');

        $this->as($this->user('operations'))->getJson($this->url("/jobs/{$air->id}/bl.pdf", 'focusair'))
            ->assertNotFound()->assertJsonPath('message', 'Only a sea shipment has a bill of lading.');
    }

    public function test_sales_may_not_print_a_bill_of_lading(): void
    {
        $house = $this->job();
        $this->details($house);

        $this->as($this->user('sales'))->get($this->url("/jobs/{$house->id}/bl.pdf"))->assertForbidden();
    }
}
