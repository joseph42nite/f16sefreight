<?php

namespace Tests\Feature;

use App\Agent;
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
 * The HBL/MBL party mapping — PRD.md §5.8.
 *
 * 🔴 THE RULE: the same ROLE means a DIFFERENT COMPANY depending on which document is
 * being written. `shipper` on a house is the actual exporter; on a master it is the
 * FORWARDER BRANCH ITSELF. Copying one onto the other prints the exporter's name where
 * the carrier expects the forwarder — a bill of lading naming the wrong contracting
 * party, which is exactly the sort of error that survives a proofread.
 */
class JobEntityTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $ops;
    private Customer $exporter;
    private Partner $agent;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Entity Co', 'code' => 'ENT', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->ops = $this->user('operations');

        $this->exporter = Customer::create([
            'company_id' => $this->company->id, 'name' => 'Acme Exports', 'email_domain' => 'acme.test',
        ]);
        $this->agent = Partner::create([
            'company_id' => $this->company->id, 'name' => 'Hamburg Agent GmbH', 'partner_type' => 'agent',
        ]);
    }

    private function user(string $designation): User
    {
        return User::create([
            'name' => $designation, 'email' => "{$designation}-ent@test.local", 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => $designation, 'is_active' => 1,
        ]);
    }

    private function job(bool $isMaster = false): Job
    {
        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => 'sea',
            'enquiry_no' => 'ENQS-ENTBOM-26-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
        ]);

        return Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id,
            'transport_mode' => 'sea', 'is_consolidation' => $isMaster,
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

    private function url(string $path, string $host = 'focussea.f16sefreight.com'): string
    {
        return "http://{$host}{$path}";
    }

    // ─── The mapping ─────────────────────────────────────────────────────────

    /** On a HOUSE, the shipper is the actual exporter — a customer. */
    public function test_a_house_shipper_is_a_customer(): void
    {
        $house = $this->job();

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$house->id}/entities"), [
                'role' => 'shipper', 'party_type' => 'customer', 'party_id' => $this->exporter->id,
            ])
            ->assertStatus(201)
            ->assertJsonPath('entities.0.name', 'Acme Exports');
    }

    /**
     * 🔴 On a MASTER, the shipper is the FORWARDER BRANCH — a partner, not the
     * exporter. Sending the exporter is refused, with the reason stated in words.
     */
    public function test_a_master_shipper_cannot_be_the_exporter(): void
    {
        $master = $this->job(true);

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$master->id}/entities"), [
                'role' => 'shipper', 'party_type' => 'customer', 'party_id' => $this->exporter->id,
            ])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'party_type_mismatch')
            ->assertJsonPath('expected.party_type', 'partner')
            ->assertJsonPath('expected.description', 'the forwarder branch itself');
    }

    /** …and the same role with the right party type is accepted. */
    public function test_a_master_shipper_may_be_a_partner(): void
    {
        $master = $this->job(true);

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$master->id}/entities"), [
                'role' => 'shipper', 'party_type' => 'partner', 'party_id' => $this->agent->id,
            ])
            ->assertStatus(201);
    }

    /** The mirror case: a house consignee is the overseas buyer, not an agent. */
    public function test_a_house_consignee_cannot_be_a_partner(): void
    {
        $house = $this->job();

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$house->id}/entities"), [
                'role' => 'consignee', 'party_type' => 'partner', 'party_id' => $this->agent->id,
            ])
            ->assertStatus(422)
            ->assertJsonPath('expected.description', 'the overseas buyer');
    }

    /** The form reads the matrix from the server rather than hard-coding it. */
    public function test_the_expected_parties_differ_by_document_kind(): void
    {
        $house = $this->job();
        $master = $this->job(true);

        $this->api($this->ops)->getJson($this->url("/api/jobs/{$house->id}/entities"))
            ->assertOk()
            ->assertJsonPath('document', 'house')
            ->assertJsonPath('expected.shipper.party_type', 'customer');

        $this->api($this->ops)->getJson($this->url("/api/jobs/{$master->id}/entities"))
            ->assertOk()
            ->assertJsonPath('document', 'master')
            ->assertJsonPath('expected.shipper.party_type', 'partner');
    }

    /** A job with a parent is a house, whatever else it is flagged as. */
    public function test_a_child_job_is_always_a_house(): void
    {
        $master = $this->job(true);
        $child = $this->job(true);
        $child->update(['parent_job_id' => $master->id]);

        $this->api($this->ops)->getJson($this->url("/api/jobs/{$child->id}/entities"))
            ->assertOk()
            ->assertJsonPath('document', 'house');
    }

    // ─── Role uniqueness ─────────────────────────────────────────────────────

    /** ⚠️ A bill of lading names ONE shipper. The second is refused in words. */
    public function test_a_shipment_cannot_have_two_shippers(): void
    {
        $house = $this->job();
        $other = Customer::create([
            'company_id' => $this->company->id, 'name' => 'Globex', 'email_domain' => 'globex.test',
        ]);

        $this->api($this->ops)->postJson($this->url("/api/jobs/{$house->id}/entities"), [
            'role' => 'shipper', 'party_type' => 'customer', 'party_id' => $this->exporter->id,
        ])->assertStatus(201);

        $this->api($this->ops)->postJson($this->url("/api/jobs/{$house->id}/entities"), [
            'role' => 'shipper', 'party_type' => 'customer', 'party_id' => $other->id,
        ])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'role_taken');
    }

    /**
     * ⚠️ …but notify_party MAY repeat. `unique_role_gate` is NULL for exactly this
     * role, which is what lets a shipment notify a buyer AND their broker.
     */
    public function test_notify_party_may_repeat(): void
    {
        $house = $this->job();
        $broker = Customer::create([
            'company_id' => $this->company->id, 'name' => 'Local Broker', 'email_domain' => 'broker.test',
        ]);

        foreach ([$this->exporter->id, $broker->id] as $id) {
            $this->api($this->ops)->postJson($this->url("/api/jobs/{$house->id}/entities"), [
                'role' => 'notify_party', 'party_type' => 'customer', 'party_id' => $id,
            ])->assertStatus(201);
        }

        $this->assertSame(2, DB::table('job_entities')
            ->where('job_id', $house->id)->where('role', 'notify_party')->whereNull('deleted_at')->count());
    }

    /** Removing a party frees the role — the generated gate releases with the row. */
    public function test_removing_a_shipper_frees_the_role(): void
    {
        $house = $this->job();

        $body = $this->api($this->ops)->postJson($this->url("/api/jobs/{$house->id}/entities"), [
            'role' => 'shipper', 'party_type' => 'customer', 'party_id' => $this->exporter->id,
        ])->assertStatus(201)->json();

        $id = $body['entities'][0]['id'];
        $this->api($this->ops)->deleteJson($this->url("/api/jobs/{$house->id}/entities/{$id}"))->assertOk();

        $this->api($this->ops)->postJson($this->url("/api/jobs/{$house->id}/entities"), [
            'role' => 'shipper', 'party_type' => 'customer', 'party_id' => $this->exporter->id,
        ])->assertStatus(201);
    }

    // ─── Guards ──────────────────────────────────────────────────────────────

    /** A custom role without a label is unreadable on the document. */
    public function test_a_custom_role_needs_a_label(): void
    {
        $house = $this->job();

        $this->api($this->ops)->postJson($this->url("/api/jobs/{$house->id}/entities"), [
            'role' => 'other', 'party_type' => 'customer', 'party_id' => $this->exporter->id,
        ])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'label_required');
    }

    /** A party from another tenant cannot be attached by guessing an id. */
    public function test_a_party_from_another_tenant_is_refused(): void
    {
        $otherCompany = Company::create(['name' => 'Other', 'code' => 'OTH2', 'tier' => 'core']);
        $foreign = Customer::create([
            'company_id' => $otherCompany->id, 'name' => 'Foreign Ltd', 'email_domain' => 'foreign.test',
        ]);

        $this->api($this->ops)->postJson($this->url("/api/jobs/{$this->job()->id}/entities"), [
            'role' => 'shipper', 'party_type' => 'customer', 'party_id' => $foreign->id,
        ])
            ->assertStatus(404)
            ->assertJsonPath('reason', 'party_not_found');
    }

    /** 🔒 Pricing reads the parties; only operations writes them. */
    public function test_pricing_can_read_but_not_add_parties(): void
    {
        $house = $this->job();
        $pricing = $this->user('pricing');

        $this->api($pricing)->getJson($this->url("/api/jobs/{$house->id}/entities"))->assertOk();
        $this->api($pricing)->postJson($this->url("/api/jobs/{$house->id}/entities"), [
            'role' => 'shipper', 'party_type' => 'customer', 'party_id' => $this->exporter->id,
        ])->assertForbidden();
    }
}
