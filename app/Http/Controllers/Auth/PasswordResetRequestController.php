<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\ResetCodeMailable;
use App\Mail\ResetPasswordMailable;
use App\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
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

    /** A mailed code is six digits, so it lives for less time than a link and dies after a few wrong tries. */
    private const CODE_MINUTES = 10;
    private const CODE_TRIES = 5;
    private const CODES_PER_ADDRESS = 3;

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

    /**
     * Forgot password on a portal's sign-in page (owner, 2026-11-21): a six-digit code by mail, typed back on the same
     * page with the new password. For every account with an address, platform staff included.
     *
     * 🔒 The same answer whether or not the address has an account. At most three codes per address in ten minutes,
     * counted by address and not by caller, so the mailbox cannot be flooded from many places.
     */
    public function sendCode(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        $email = strtolower($request->email);
        $table = $this->accountTable($email);
        $sends = 'reset-code-sends:' . sha1($email);

        if ($table !== null && DB::table($table)->where('email', $email)->exists() && ! RateLimiter::tooManyAttempts($sends, self::CODES_PER_ADDRESS)) {
            RateLimiter::hit($sends, self::CODE_MINUTES * 60);
            RateLimiter::clear($this->triesKey($email));

            $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            DB::table('password_resets')->where('email', $email)->delete();
            DB::table('password_resets')->insert(['email' => $email, 'token' => $this->codeHash($email, $code), 'created_at' => now()]);

            Mail::to($email)->send(new ResetCodeMailable($code, self::CODE_MINUTES));
        }

        return response()->json(['data' => 'If that address has an account, a 6-digit code is on its way. It works for ' . self::CODE_MINUTES . ' minutes.']);
    }

    /**
     * 🔒 A code is one in a million, so guesses are counted per ADDRESS: after five wrong ones the code is thrown away
     * and a new one must be asked for. A code cannot be used on the link's endpoint, and a link's token cannot be
     * used here: the two are hashed differently.
     */
    public function resetWithCode(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'digits:6'],
            'password' => ['required', 'min:6', 'max:25', 'confirmed'],
        ]);

        $email = strtolower($request->email);
        $table = $this->accountTable($email);
        $refused = response()->json(['status' => false, 'error' => 'That code is wrong or has expired. Ask for a new one.'], 401);

        if ($table === null) {
            return $refused;
        }

        if (RateLimiter::tooManyAttempts($this->triesKey($email), self::CODE_TRIES)) {
            DB::table('password_resets')->where('email', $email)->delete();

            return $refused;
        }

        $matches = DB::table('password_resets')
            ->where('email', $email)
            ->where('token', $this->codeHash($email, $request->code))
            ->where('created_at', '>', now()->subMinutes(self::CODE_MINUTES))
            ->exists();

        if (! $matches) {
            RateLimiter::hit($this->triesKey($email), self::CODE_MINUTES * 60);

            return $refused;
        }

        DB::table($table)->where('email', $email)->update(['password' => Hash::make($request->password)]);
        DB::table('password_resets')->where('email', $email)->delete();
        RateLimiter::clear($this->triesKey($email));

        return response()->json(['status' => true]);
    }

    private function codeHash(string $email, string $code): string
    {
        return hash('sha256', 'code|' . $email . '|' . $code);
    }

    private function triesKey(string $email): string
    {
        return 'reset-code-tries:' . sha1($email);
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
