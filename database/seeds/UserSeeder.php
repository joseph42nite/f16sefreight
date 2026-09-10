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

    /**
     * The base account's OWN tenant.
     *
     * 🔴 It used to attach to whatever branch happened to be first by id, which put
     * `user@gmail.com` inside someone else's demo company — an operations user in
     * "Curl Co", with access to that tenant's shipments. A shared login sitting inside a
     * demo tenant is the kind of thing that is fine until the demo tenant is a real one.
     *
     * ⚠️ `code` is UNIQUE on `companies`, so this value must not collide with a tenant's.
     * `BASE` is reserved for this and used nowhere else.
     */
    private const COMPANY = ['name' => 'F16s Base', 'code' => 'BASE', 'tier' => 'tactical'];

    private const BRANCH = ['agent_name' => 'Base', 'branch_code' => 'BAS'];

    public function run()
    {
        if (! DB::table('users')->where('email', self::EMAIL)->exists()) {
            // 🔴 A USER BELONGS TO A BRANCH, and this seeder predates tenancy entirely —
            // it never set `branch_name`, which is NOT NULL with no default, so it has
            // been unable to run since that column was added. Idempotence was not the only
            // thing wrong with it.
            $branch = $this->baseBranch();

            DB::table('users')->insert([
                'name' => 'dhiraj user',
                'email' => self::EMAIL,
                'password' => Hash::make('123456'),
                'is_active' => true,
                'origin_airport_code' => 'BLR',
                'plan_expiry_date' => '2025-03-26',
                // ⚠️ SET EXPLICITLY, though the column defaults to it. A designation
                // decides which portals open and which controls appear; leaning on a
                // schema default for that means the answer changes if the default ever
                // does, silently and everywhere.
                'designation' => 'operations',
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
    /**
     * The base tenant's branch, created on first run.
     *
     * ⚠️ Idempotent like everything else here: an existing company is reused, never
     * rewritten. A tenant that has since been renamed or moved to another tier keeps both.
     */
    private function baseBranch(): object
    {
        $companyId = DB::table('companies')->where('code', self::COMPANY['code'])->value('id');

        if ($companyId === null) {
            $companyId = DB::table('companies')->insertGetId(self::COMPANY + [
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $branch = DB::table('agents_info')
            ->where('company_id', $companyId)
            ->where('branch_code', self::BRANCH['branch_code'])
            ->first(['id', 'company_id']);

        if ($branch !== null) {
            return $branch;
        }

        $branchId = DB::table('agents_info')->insertGetId(self::BRANCH + [
            'company_id' => $companyId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return (object) ['id' => $branchId, 'company_id' => $companyId];
    }
}
