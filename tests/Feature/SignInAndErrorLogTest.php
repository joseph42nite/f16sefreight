<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Role;
use App\SuperAdmin;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The Overview's last two graphs (owner, 2026-10-16: "for super admin add 1"): people signed in per day, and errors per
 * day. Neither was recorded — only each user's latest token was kept, and server errors went to a log file — so each
 * successful sign-in and each unhandled server error is now written to a small table the Overview reads.
 */
class SignInAndErrorLogTest extends TestCase
{
    use DatabaseTransactions;

    private function tenantUser(): User
    {
        $company = Company::create(['name' => 'Log Co', 'code' => 'LOG', 'tier' => 'tactical']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $user = User::create(['name' => 'Lia', 'email' => 'lia-' . uniqid() . '@test.local', 'password' => Hash::make('secret1234'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        Role::forceCreate(['email' => $user->email, 'role' => 'user']);

        return $user;
    }

    public function test_a_sign_in_is_recorded_and_a_failed_one_is_not(): void
    {
        $user = $this->tenantUser();

        $this->postJson('http://focusair.localhost/api/login', ['email' => $user->email, 'password' => 'wrong'])->assertStatus(401);
        $this->assertSame(0, DB::table('sign_in_events')->where('account_id', $user->id)->count());

        $this->postJson('http://focusair.localhost/api/login', ['email' => $user->email, 'password' => 'secret1234'])->assertOk();

        $row = DB::table('sign_in_events')->where('guard', 'user')->where('account_id', $user->id)->first();
        $this->assertNotNull($row);
        $this->assertSame([(int) $user->company_name, (int) $user->branch_name, 'focusair'], [(int) $row->company_id, (int) $row->agent_id, $row->portal]);
    }

    public function test_platform_staff_sign_ins_are_recorded_apart_from_tenants(): void
    {
        $admin = SuperAdmin::firstOrCreate(['email' => 'log-staff-' . uniqid() . '@f16s.test'], ['name' => 'Staff', 'password' => Hash::make('secret1234')]);
        DB::table('roles')->insert(['email' => $admin->email, 'role' => 'superAdmin', 'created_at' => now(), 'updated_at' => now()]);

        $this->postJson('http://superadmin.localhost/api/login', ['email' => $admin->email, 'password' => 'secret1234'])->assertOk();

        $this->assertDatabaseHas('sign_in_events', ['guard' => 'superAdmin', 'account_id' => $admin->id, 'company_id' => null]);
    }

    public function test_an_unhandled_server_error_is_recorded_and_a_not_found_is_not(): void
    {
        \Illuminate\Support\Facades\Route::get('/api/test-boom-' . ($k = uniqid()), fn () => throw new \RuntimeException('Boom in the test'));

        $this->getJson('/api/test-boom-' . $k)->assertStatus(500);
        $this->getJson('/api/no-such-route-' . $k)->assertNotFound();

        $row = DB::table('server_errors')->where('message', 'like', 'Boom in the test%')->first();
        $this->assertNotNull($row);
        $this->assertSame(['RuntimeException', 'api/test-boom-' . $k], [$row->exception, $row->path]);
        $this->assertSame(0, DB::table('server_errors')->where('path', 'like', 'api/no-such-route-%')->count());
    }

    public function test_the_overview_draws_sign_ins_and_errors(): void
    {
        $user = $this->tenantUser();
        $this->postJson('http://focusair.localhost/api/login', ['email' => $user->email, 'password' => 'secret1234'])->assertOk();
        DB::table('server_errors')->insert(['exception' => 'RuntimeException', 'message' => 'x', 'path' => 'api/x', 'created_at' => now()]);

        $admin = SuperAdmin::firstOrCreate(['email' => 'overview-log@f16s.test'], ['name' => 'Staff', 'password' => Hash::make('x')]);
        $this->app['auth']->forgetGuards();
        $data = $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('superAdmin-api')->login($admin), 'Accept' => 'application/json'])
            ->getJson('http://superadmin.localhost/api/superadmin/overview')->assertOk()->json();

        $today = now()->toDateString();
        $logCo = collect($data['signins']['series'])->firstWhere('name', 'Log Co');
        $this->assertSame(1, collect($logCo['data'])->firstWhere('x', $today)['y'], 'people signed in, each counted once a day');
        $server = collect($data['errors']['series'])->firstWhere('name', 'Server errors');
        $this->assertGreaterThanOrEqual(1, collect($server['data'])->firstWhere('x', $today)['y']);
        $this->assertNotNull(collect($data['errors']['series'])->firstWhere('name', 'Failed background jobs'));
    }
}
