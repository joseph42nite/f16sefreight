<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Role;
use App\User;
use App\Company;
use Illuminate\Support\Facades\Cache;

class LoginController extends Controller
{
    //
    public function login()
    {
        $credentials = request(['email', 'password']);
        $roleRecord = Role::where('email', $credentials['email'])->select('role')->first();
        
        if (!$roleRecord) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        $role = $roleRecord->role;
        $guard = $role . '-api';
        
        if (!$token = auth()->guard($guard)->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $user_data = auth()->guard($guard)->user();
        $current_date = date("Y-m-d");

        $userDataArray = $user_data->toArray();

        if ($role == 'user') {
            User::where('id', $user_data->id)->update(['latest_token' => $token]);
            
            // EAGER CACHED CONFIGURATION
            //
            // users.company_name stores the company ID, not the name: the admin user form's
            // dropdown saves companies.id while displaying the name (NewUsers.vue). Looking it
            // up by name therefore matched nothing and templates_config came back null on every
            // login. Resolve by id, falling back to name for any older row that holds a literal
            // name. See docs/plan/CONTEXT.md §6.
            $companyRef = $user_data->company_name;
            $templatesConfig = Cache::remember(
                "company_templates_{$companyRef}",
                3600,
                fn() => optional(
                    is_numeric($companyRef)
                        ? Company::find($companyRef)
                        : Company::where('name', $companyRef)->first()
                )->templates_config
            );
            
            $userDataArray['templates_config'] = $templatesConfig;
        }

        return response()->json(['token' => $token, 'user' => $userDataArray, 'role' => $role]);
    }

    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email', // Validate email
        ]);

        $user = User::where('email', $request->email)->first();

        // Generate OTP
        $otp = rand(100000, 999999);
        $user->otp = $otp;
        $user->otp_expiration = now()->addMinutes(10); // Set expiration time
        $user->save();

        // Send OTP to the user's email
        Mail::to($user->email)->send(new OtpMail($otp)); // Assuming you have the OtpMail mailable

        return response()->json(['message' => 'OTP sent successfully']);
    }
    public function login_superadmin()
    {
        $credentials = request(['email', 'password']);

        if (!$token = auth()->guard('superAdmin-api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return $this->respondWithToken($token);
    }
}