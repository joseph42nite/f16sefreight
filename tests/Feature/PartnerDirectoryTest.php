<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Partner;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The partner page, like the client page (user, 2026-09-26): accounts figures only on Command. Tactical has no
 * accounts, so a partner there is a name, a type and contact details — never a GSTIN, a PAN, a TDS section or an
 * s.197 rate. Stripped from the JSON, not merely hidden in the table.
 */
class PartnerDirectoryTest extends TestCase
{
    use DatabaseTransactions;

    private const ACCOUNTS_FIELDS = ['gst_no', 'pan_no', 'tds_section', 'tds_rate_override'];

    private function tenant(string $tier): array
    {
        $company = Company::create(['name' => "Ptn {$tier}", 'code' => strtoupper(substr($tier, 0, 3)) . 'P', 'tier' => $tier]);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $partner = Partner::create(['company_id' => $company->id, 'agent_id' => $branch->id, 'name' => 'BlueDart Trucking',
            'partner_type' => 'transporter', 'gst_no' => '27AAACG1001A1Z5', 'pan_no' => 'AAACG1001A',
            'tds_section' => '194C', 'tds_rate_override' => 1.5]);

        return [$company, $branch, $partner];
    }

    private function as(Company $company, Agent $branch, string $designation): self
    {
        $user = User::create(['name' => $designation, 'email' => "{$designation}-{$company->code}-ptn@test.local", 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => $designation, 'is_active' => 1]);
        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user), 'Accept' => 'application/json']);

        return $this;
    }

    public function test_tactical_lists_partners_without_any_tax_figure(): void
    {
        [$company, $branch] = $this->tenant('tactical');

        $row = $this->as($company, $branch, 'pricing')->getJson('http://focusair.localhost/api/partners')
            ->assertOk()->assertJsonPath('with_accounts', false)->json('data.0');

        $this->assertSame('BlueDart Trucking', $row['name']);
        foreach (self::ACCOUNTS_FIELDS as $field) {
            $this->assertArrayNotHasKey($field, $row, "{$field} must not reach a Tactical user at all");
        }
    }

    public function test_a_tax_number_sent_on_tactical_is_not_stored(): void
    {
        [$company, $branch] = $this->tenant('tactical');

        $created = $this->as($company, $branch, 'pricing')->postJson('http://focusair.localhost/api/partners', [
            'name' => 'Konkan Clearing', 'partner_type' => 'customs_broker', 'gst_no' => '27AAACG1002A1Z5', 'pan_no' => 'AAACG1002A',
        ])->assertCreated()->json();

        foreach (self::ACCOUNTS_FIELDS as $field) {
            $this->assertArrayNotHasKey($field, $created);
        }
        $this->assertDatabaseHas('partners', ['name' => 'Konkan Clearing', 'gst_no' => null, 'pan_no' => null]);
    }

    public function test_command_shows_and_stores_the_tax_figures(): void
    {
        [$company, $branch] = $this->tenant('command');

        $this->as($company, $branch, 'accounts')->getJson('http://accounts.localhost/api/partners')
            ->assertOk()->assertJsonPath('with_accounts', true)
            ->assertJsonPath('data.0.gst_no', '27AAACG1001A1Z5')
            ->assertJsonPath('data.0.tds_section', '194C');

        $this->as($company, $branch, 'pricing')->postJson('http://focusair.localhost/api/partners', [
            'name' => 'Konkan Clearing', 'partner_type' => 'customs_broker', 'gst_no' => '27AAACG1002A1Z5',
        ])->assertCreated()->assertJsonPath('gst_no', '27AAACG1002A1Z5');
    }
}
