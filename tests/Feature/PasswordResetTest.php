<?php

namespace Tests\Feature;

use App\Mail\ResetPasswordMailable;
use App\SuperAdmin;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

/** 🔒 Forgot password needs the mailed token; public sign-up is gone (2026-09-16 security audit). */
class PasswordResetTest extends TestCase
{
    use DatabaseTransactions;

    public function test_a_password_cannot_be_changed_without_the_mailed_token(): void
    {
        Mail::fake();
        $staff = SuperAdmin::create(['name' => 'Staff', 'email' => 'staff-reset@test.local', 'password' => Hash::make('old-pass')]);
        DB::table('roles')->insert(['email' => $staff->email, 'role' => 'superAdmin', 'created_at' => now(), 'updated_at' => now()]);
        $reset = fn (array $extra) => $this->postJson('/api/ForgotpasswordActual', $extra + [
            'email' => $staff->email, 'userType' => 'super_admins', 'password' => 'new-pass-1', 'password_confirmation' => 'new-pass-1',
        ]);

        // The old attack: an address and a table name, no token.
        $reset([])->assertStatus(422);
        $reset(['token' => 'guessed'])->assertStatus(401);
        $this->assertTrue(Hash::check('old-pass', $staff->fresh()->password));

        $this->postJson('/api/Forgotpassword', ['email' => $staff->email])->assertOk();
        $token = null;
        Mail::assertSent(ResetPasswordMailable::class, function ($mail) use (&$token) {
            $token = $mail->token;

            return true;
        });

        $reset(['token' => $token])->assertOk();
        $this->assertTrue(Hash::check('new-pass-1', $staff->fresh()->password));
        $reset(['token' => $token])->assertStatus(401); // used once
    }

    public function test_asking_for_a_link_does_not_reveal_whether_an_account_exists(): void
    {
        Mail::fake();

        $this->postJson('/api/Forgotpassword', ['email' => 'nobody-here@test.local'])->assertOk();
        Mail::assertNothingSent();
    }

    public function test_nobody_can_sign_up_as_superadmin_or_user(): void
    {
        $this->assertGreaterThanOrEqual(400, $this->postJson('/api/superadmin/register', ['name' => 'x', 'email' => 'x@test.local', 'password' => 'x'])->status());
        $this->assertGreaterThanOrEqual(400, $this->postJson('/api/register', ['name' => 'x', 'email' => 'y@test.local', 'password' => 'xxxx'])->status());
        $this->assertDatabaseMissing('super_admins', ['email' => 'x@test.local']);
        $this->assertDatabaseMissing('users', ['email' => 'y@test.local']);
        $this->assertGreaterThanOrEqual(400, $this->getJson('/api/all-contacts')->status());
    }
}
