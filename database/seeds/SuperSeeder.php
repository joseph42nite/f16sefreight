<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
class SuperSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('super_admins')->insert([
            'name' => 'dhiraj admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('123456'),
            'is_active' => true,
        ]);
        DB::table('roles')->insert([
            'email' => 'admin@gmail.com',
            'role'  => 'superAdmin',
        ]);
    }
}
