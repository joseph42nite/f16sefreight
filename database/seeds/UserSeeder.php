<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

/**
 * The first ordinary user.
 *
 * 🔴 CREATE IF ABSENT, NEVER OVERWRITE. See `SuperSeeder` — `updateOrInsert()` would reset
 * a changed password back to `123456` on every re-seed, and `plan_expiry_date` back to a
 * date in the past.
 *
 * ⚠️ `roles` has no unique key on `email`, so a second run duplicates rather than fails.
 */
class UserSeeder extends Seeder
{
    private const EMAIL = 'user@gmail.com';

    public function run()
    {
        if (! DB::table('users')->where('email', self::EMAIL)->exists()) {
            // 🔴 A USER BELONGS TO A BRANCH, and this seeder predates tenancy entirely —
            // it never set `branch_name`, which is NOT NULL with no default, so it has
            // been unable to run since that column was added. Idempotence was not the only
            // thing wrong with it.
            //
            // ⚠️ It attaches to an EXISTING branch rather than creating one. Inventing a
            // company here would duplicate `FreightDemoSeeder`, which owns demo tenants
            // and builds them properly — two seeders minting companies is how a database
            // ends up with two half-configured ones.
            $branch = DB::table('agents_info')->orderBy('id')->first(['id', 'company_id']);

            if ($branch === null) {
                $this->command->warn(
                    'No branch exists, so ' . self::EMAIL . ' cannot be created — a user '
                    . 'must belong to one. Run FreightDemoSeeder first.'
                );

                return;
            }

            DB::table('users')->insert([
                'name' => 'dhiraj user',
                'email' => self::EMAIL,
                'password' => Hash::make('123456'),
                'is_active' => true,
                'origin_airport_code' => 'BLR',
                'plan_expiry_date' => '2025-03-26',
                // ⚠️ `company_name` and `branch_name` hold IDs, not names — see
                // LoginController, which resolves the tenant from them.
                'company_name' => $branch->company_id,
                'branch_name' => $branch->id,
            ]);
        }

        if (! DB::table('roles')->where('email', self::EMAIL)->where('role', 'user')->exists()) {
            DB::table('roles')->insert([
                'email' => self::EMAIL,
                'role'  => 'user',
            ]);
        }
    }
}
