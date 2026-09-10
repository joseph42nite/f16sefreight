<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * The platform's first super admin.
 *
 * 🔴 CREATE IF ABSENT, NEVER OVERWRITE — and `updateOrInsert()` is the wrong tool here for
 * exactly that reason. It would rewrite the row it finds, so re-running the seeder on an
 * environment where somebody had changed the admin password would silently reset it to
 * `123456`. A seeder that can hand an account back to a known default is worse than one
 * that errors.
 *
 * ⚠️ `roles` has NO unique key on `email` (verified against the schema). A plain insert
 * there does not fail on a second run, it DUPLICATES — silently, with nothing to notice
 * until something reads the role and finds two.
 */
class SuperSeeder extends Seeder
{
    private const EMAIL = 'admin@gmail.com';

    public function run()
    {
        if (! DB::table('super_admins')->where('email', self::EMAIL)->exists()) {
            DB::table('super_admins')->insert([
                'name' => 'dhiraj admin',
                'email' => self::EMAIL,
                'password' => Hash::make('123456'),
                'is_active' => true,
            ]);
        }

        if (! DB::table('roles')->where('email', self::EMAIL)->where('role', 'superAdmin')->exists()) {
            DB::table('roles')->insert([
                'email' => self::EMAIL,
                'role'  => 'superAdmin',
            ]);
        }
    }
}
