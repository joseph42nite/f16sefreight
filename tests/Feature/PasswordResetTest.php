<?php

namespace Tests\Feature;

use App\Mail\ResetCodeMailable;
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

    /** A portal's sign-in page resets by a mailed six-digit code (owner, 2026-11-21). */
    public function test_a_mailed_code_sets_a_new_password_once(): void
    {
        Mail::fake();
        $staff = $this->staff('staff-code@test.local');
        $reset = fn (string $code) => $this->postJson('/api/forgot-password/reset', [
            'email' => $staff->email, 'code' => $code, 'password' => 'new-pass-1', 'password_confirmation' => 'new-pass-1',
        ]);

        $this->postJson('/api/forgot-password/code', ['email' => $staff->email])->assertOk()
            ->assertJsonPath('data', 'If that address has an account, a 6-digit code is on its way. It works for 10 minutes.');
        $code = $this->mailedCode();
        $this->assertMatchesRegularExpression('/^\d{6}$/', $code);

        // The code is not a link token, and a link token is not a code.
        $this->postJson('/api/ForgotpasswordActual', ['email' => $staff->email, 'token' => $code, 'password' => 'new-pass-1', 'password_confirmation' => 'new-pass-1'])->assertStatus(401);

        $reset($code === '000000' ? '000001' : '000000')->assertStatus(401);
        $this->assertTrue(Hash::check('old-pass', $staff->fresh()->password));

        $reset($code)->assertOk();
        $this->assertTrue(Hash::check('new-pass-1', $staff->fresh()->password));
        $reset($code)->assertStatus(401); // used once
    }

    public function test_a_code_dies_after_five_wrong_guesses_and_after_ten_minutes(): void
    {
        Mail::fake();
        $staff = $this->staff('staff-guess@test.local');
        $reset = fn (string $code) => $this->withServerVariables(['REMOTE_ADDR' => '10.9.' . random_int(1, 250) . '.' . random_int(1, 250)])
            ->postJson('/api/forgot-password/reset', ['email' => $staff->email, 'code' => $code, 'password' => 'new-pass-1', 'password_confirmation' => 'new-pass-1']);

        $this->postJson('/api/forgot-password/code', ['email' => $staff->email])->assertOk();
        $code = $this->mailedCode();
        $wrong = $code === '000000' ? '000001' : '000000';

        // Guesses are counted by address, from wherever they come.
        for ($i = 0; $i < 5; $i++) {
            $reset($wrong)->assertStatus(401);
        }
        $reset($code)->assertStatus(401);
        $this->assertTrue(Hash::check('old-pass', $staff->fresh()->password));

        // A new code starts the count again; ten minutes on, it is no good.
        $this->postJson('/api/forgot-password/code', ['email' => $staff->email])->assertOk();
        $code = $this->mailedCode();
        $this->travel(11)->minutes();
        $reset($code)->assertStatus(401);
        $this->assertTrue(Hash::check('old-pass', $staff->fresh()->password));
    }

    public function test_asking_for_a_code_reveals_nothing_and_cannot_flood_a_mailbox(): void
    {
        Mail::fake();

        $nobody = $this->postJson('/api/forgot-password/code', ['email' => 'nobody-here@test.local'])->assertOk()->json('data');
        Mail::assertNothingSent();

        $staff = $this->staff('staff-flood@test.local');
        for ($i = 0; $i < 5; $i++) {
            $this->assertSame($nobody, $this->postJson('/api/forgot-password/code', ['email' => $staff->email])->assertOk()->json('data'));
        }
        Mail::assertSent(ResetCodeMailable::class, 3);
    }

    private function staff(string $email): SuperAdmin
    {
        $staff = SuperAdmin::create(['name' => 'Staff', 'email' => $email, 'password' => Hash::make('old-pass')]);
        DB::table('roles')->insert(['email' => $email, 'role' => 'superAdmin', 'created_at' => now(), 'updated_at' => now()]);
        \Illuminate\Support\Facades\RateLimiter::clear('reset-code-sends:' . sha1($email));
        \Illuminate\Support\Facades\RateLimiter::clear('reset-code-tries:' . sha1($email));

        return $staff;
    }

    /** The code in the newest mail. */
    private function mailedCode(): string
    {
        $code = '';
        Mail::assertSent(ResetCodeMailable::class, function ($mail) use (&$code) {
            $code = $mail->code;

            return true;
        });

        return $code;
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
