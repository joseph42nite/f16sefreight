<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Role;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * users.company_name stores the company ID, not the name — the admin user form's
 * dropdown saves companies.id while displaying the name. LoginController used to
 * look it up by name, so it matched nothing and templates_config came back null
 * on every single login.
 *
 * Nothing errored, which is why it went unnoticed: a null config is
 * indistinguishable from a company that simply has no templates configured.
 */
class LoginCompanyResolutionTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(string $companyRef): array
    {
        // Assigned rather than mass-created: neither model declares $fillable
        // for these columns, and the test must not depend on that changing.
        $company = new Company();
        $company->name = 'Globex Freight';
        $company->templates_config = json_encode(['ksr' => ['enabled' => true]]);
        $company->save();

        // Every user has a branch — users.branch_name is NOT NULL with an FK to
        // agents_info as of 2026_08_27_000000. A user without one is not a valid
        // fixture, because it could not exist in production either.
        $agent = new Agent();
        $agent->company_id = $company->id;
        $agent->agent_name = 'CHENNAI';
        $agent->save();

        $user = new User();
        $user->branch_name = $agent->id;
        $user->name = 'Ops Ravi';
        $user->email = 'ravi@globex.test';
        $user->password = Hash::make('secret1234');
        $user->company_name = $companyRef === 'id' ? (string) $company->id : $company->name;
        $user->save();

        $role = new Role();
        $role->email = $user->email;
        $role->role = 'user';
        $role->save();

        return [$company, $user];
    }

    /** The real-world case: the column holds the company ID. */
    public function test_company_resolves_when_company_name_holds_an_id(): void
    {
        Cache::flush();
        [$company] = $this->makeUser('id');

        $response = $this->postJson('/api/login', [
            'email' => 'ravi@globex.test',
            'password' => 'secret1234',
        ]);

        $response->assertOk();
        $this->assertNotNull(
            $response->json('user.templates_config'),
            'templates_config was null — the company lookup failed for an ID-valued company_name.'
        );
    }

    /** Older rows may hold a literal name; the fallback must still resolve them. */
    public function test_company_still_resolves_for_a_legacy_name_value(): void
    {
        Cache::flush();
        $this->makeUser('name');

        $response = $this->postJson('/api/login', [
            'email' => 'ravi@globex.test',
            'password' => 'secret1234',
        ]);

        $response->assertOk();
        $this->assertNotNull(
            $response->json('user.templates_config'),
            'templates_config was null — the legacy name fallback regressed.'
        );
    }
}
