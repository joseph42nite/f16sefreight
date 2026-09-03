<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\SavedAddress;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The branch address book is private to its branch.
 *
 * 🔴 **`SavedAddress` carried NO tenant scope at all until 2026-09-03**, and
 * `getAddressByType()` fetched by raw id with no filter — so any authenticated user could
 * read any branch's, and any TENANT's, saved shipper or consignee by guessing an id. The
 * table happened to be empty, so nothing leaked; the endpoint was live and both AWB forms
 * call it.
 *
 * ⚠️ Branch and not company: an address book is what one desk types every day, and a
 * Chennai desk's consignee list is not Mumbai's to browse.
 */
class SavedAddressScopeTest extends TestCase
{
    use DatabaseTransactions;

    private function branchWithUser(string $code, string $email): array
    {
        $company = Company::create(['name' => "Addr {$code}", 'code' => $code, 'tier' => 'command']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => $code, 'branch_code' => 'BOM']);

        $user = User::create([
            'name' => 'Ops', 'email' => $email, 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);

        return [$branch, $user];
    }

    private function address(Agent $branch): SavedAddress
    {
        return SavedAddress::withoutGlobalScopes()->create([
            'agent_id' => $branch->id, 'address_type' => 'shipper_address',
            'name' => 'Globex Exports', 'address' => 'Plot 42/A, MIDC',
            'city' => 'Mumbai', 'state' => 'Maharashtra',
            'post_code' => '400093', 'country' => 'IN',
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

    public function test_a_branch_can_read_its_own_saved_address(): void
    {
        [$branch, $user] = $this->branchWithUser('AD1', 'ops-ad1@test.local');
        $address = $this->address($branch);

        $this->api($user)
            ->getJson("http://focusair.localhost/api/user/get-shipper-address?id={$address->id}")
            ->assertOk()
            ->assertJsonPath('ship_name', 'Globex Exports');
    }

    /**
     * 🔴 THE LEAK THAT WAS THERE. A raw id from another tenant returned that tenant's
     * shipper — name, address, everything — to anybody holding a valid token.
     */
    public function test_another_tenant_cannot_read_it_by_id(): void
    {
        [$branch] = $this->branchWithUser('AD2', 'ops-ad2@test.local');
        $address = $this->address($branch);

        [, $intruder] = $this->branchWithUser('AD3', 'ops-ad3@test.local');

        $this->api($intruder)
            ->getJson("http://focusair.localhost/api/user/get-shipper-address?id={$address->id}")
            ->assertNotFound();
    }

    /**
     * ⚠️ And a sibling BRANCH of the same company cannot either. An address book is one
     * desk's working set; sharing it across branches was never the intent, and the
     * partner rules are branch-level for the same reason.
     */
    public function test_a_sibling_branch_cannot_read_it(): void
    {
        $company = Company::create(['name' => 'Two Branch Co', 'code' => 'AD4', 'tier' => 'command']);

        $bom = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $maa = Agent::create(['company_id' => $company->id, 'agent_name' => 'MAA', 'branch_code' => 'MAA']);

        $address = $this->address($bom);

        $chennai = User::create([
            'name' => 'Ops', 'email' => 'ops-ad4@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $maa->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);

        $this->api($chennai)
            ->getJson("http://focusair.localhost/api/user/get-shipper-address?id={$address->id}")
            ->assertNotFound();
    }

    /**
     * ⚠️ An address belonging to NO branch belongs to nobody. Worth pinning: it is the
     * shape existing rows may be in, and "invisible" is the correct answer rather than
     * "everybody's".
     */
    public function test_an_unattributed_address_is_readable_by_nobody(): void
    {
        [, $user] = $this->branchWithUser('AD5', 'ops-ad5@test.local');

        $orphan = SavedAddress::withoutGlobalScopes()->create([
            'agent_id' => null, 'address_type' => 'shipper_address',
            'name' => 'Unattributed Party', 'city' => 'Nowhere',
        ]);

        $this->api($user)
            ->getJson("http://focusair.localhost/api/user/get-shipper-address?id={$orphan->id}")
            ->assertNotFound();
    }
}
