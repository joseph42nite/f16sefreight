<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Role;
use App\User;

class LoginController extends Controller
{
    //
    public function login()
    {
        $credentials = request(['email', 'password']);
        $role = Role::where('email', $credentials['email'])->select('role')->first()->toArray()['role'];
        $guard = $role . '-api';
        if (!$token = auth()->guard($guard)->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $user_data = auth()->guard($guard)->user();
        $current_date = date("Y-m-d");

        if ($role == 'user')
            User::where('id', $user_data->id)->update(['latest_token' => $token]);

            //for stope multiple login
            // if($current_date==$user_data->current_date && $role=='user')
            //     User::where('id',$user_data->id)->update(['latest_token'=>$token,'daily_login_count'=>$user_data->daily_login_count+1,'current_date'=>$current_date]);
            // elseif($role=='user')
            //     User::where('id',$user_data->id)->update(['latest_token'=>$token,'daily_login_count'=>1,'current_date'=>$current_date]);

            // for user valid login check
            // $daily_login_count=User::where('id',$user_data->id)->first()->daily_login_count; 
            // if($user_data->is_active==0 && $role=='user'){
            //     auth()->guard($guard)->logout();
            //     return response()->json(['error' => 'Blocked'], 401);
            // }
            // if($daily_login_count>3 && $role=='user'){
            //     auth()->guard($guard)->logout();
            //     return response()->json(['error' => 'Daily_Limit'], 401);
            // }
            // if($role=='user' && $user_data->plan_expiry_date<$current_date){
            //     auth()->guard($guard)->logout();
            //     return response()->json(['error' => 'Expired'], 401);
            // }

        return response()->json(['token' => $token, 'user' => $user_data, 'role' => $role]);
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