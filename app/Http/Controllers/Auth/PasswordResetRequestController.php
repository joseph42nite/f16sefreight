<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\ResetPasswordMailable;
use App\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

/**
 * Forgot password: a mailed link carries a one-time token; the new password is accepted only with that token.
 *
 * 🔴 Security (2026-09-16 audit): the reset used to change ANY account's password — superadmin included — from an
 * email address alone, with the table name taken from the request. Now the token is required, it is stored hashed,
 * it expires after 30 minutes and is used once, and the account table comes from `roles`, never the request.
 * The request for a link answers the same whether or not the address exists, so it cannot be used to find accounts.
 */
class PasswordResetRequestController extends Controller
{
    private const VALID_MINUTES = 30;

    public function sendEmail(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        $table = $this->accountTable($request->email);

        if ($table !== null && DB::table($table)->where('email', $request->email)->exists()) {
            $token = Str::random(40);
            DB::table('password_resets')->where('email', $request->email)->delete();
            DB::table('password_resets')->insert(['email' => $request->email, 'token' => hash('sha256', $token), 'created_at' => now()]);

            Mail::to($request->email)->send(new ResetPasswordMailable($token, $request->email, $table));
        }

        return response()->json(['data' => 'If that address has an account, a reset link is on its way.']);
    }

    public function check_token(Request $request)
    {
        return $this->validToken($request->email, $request->token)
            ? response()->json(['status' => true])
            : response()->json(['status' => false], 401);
    }

    public function forgot_password_actual(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'min:6', 'max:25', 'confirmed'],
        ]);

        $table = $this->accountTable($request->email);

        if ($table === null || ! $this->validToken($request->email, $request->token)) {
            return response()->json(['status' => false, 'error' => 'This reset link is invalid or has expired.'], 401);
        }

        DB::table($table)->where('email', $request->email)->update(['password' => Hash::make($request->password)]);
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['status' => true]);
    }

    /** `users` or `super_admins`, from the address's role; NULL for an address with no account. */
    private function accountTable(?string $email): ?string
    {
        $role = Role::where('email', $email)->value('role');

        return match ($role) {
            'user' => 'users',
            'superAdmin' => 'super_admins',
            default => null,
        };
    }

    private function validToken(?string $email, ?string $token): bool
    {
        return filled($email) && filled($token) && DB::table('password_resets')
            ->where('email', $email)
            ->where('token', hash('sha256', $token))
            ->where('created_at', '>', now()->subMinutes(self::VALID_MINUTES))
            ->exists();
    }
}
