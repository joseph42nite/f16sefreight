<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Role;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * One session per person: signing in again ends the earlier session (`users.latest_token`). Walk 4 #38: the earlier
 * browser then dropped to the sign-in page with no word about why. The check now says the account signed in elsewhere.
 */
class SingleSessionTest extends TestCase
{
    use DatabaseTransactions;

    public function test_the_older_session_is_told_it_was_replaced_by_a_newer_sign_in(): void
    {
        $company = Company::create(['name' => 'Session Co', 'code' => 'SES', 'tier' => 'tactical']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $user = User::create(['name' => 'Ses', 'email' => 'ses-' . uniqid() . '@test.local', 'password' => Hash::make('secret1234'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        Role::forceCreate(['email' => $user->email, 'role' => 'user']);

        $signIn = fn () => $this->postJson('/api/login', ['email' => $user->email, 'password' => 'secret1234'])->assertOk()->json('token');
        // Each request on its own: a guard kept from the sign-in still holds the user as they were before it.
        $verify = fn (string $token) => $this->forgetGuards()->withHeaders(['Authorization' => "Bearer {$token}", 'Accept' => 'application/json'])
            ->postJson('/api/user/verify', ['token' => $token]);

        $first = $signIn();
        $verify($first)->assertOk();

        // Unlike the first, the second token must differ: JWTs issued in the same second can be identical.
        $this->travel(2)->seconds();
        $second = $signIn();

        // The newer one first: in one test process the JWT library keeps the token the refusal below logs out.
        $verify($second)->assertOk();
        $verify($first)->assertStatus(401)->assertJsonPath('error', 'Signed_In_Elsewhere');
    }

    private function forgetGuards(): self
    {
        $this->app['auth']->forgetGuards();

        return $this;
    }
}
