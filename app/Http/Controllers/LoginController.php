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
        $role=Role::where('email',$credentials['email'])->select('role')->first()->toArray()['role'];
        $guard=$role.'-api';
        if (! $token = auth()->guard($guard)->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $user_data=auth()->guard($guard)->user();
        $current_date=date("Y-m-d");
        //for user valid login check
        // ($user_data->is_active==0 || $user_data->daily_login_count>2) && $role=='user'
        if(($user_data->is_active==0 || $user_data->daily_login_count>2) && $role=='user'){
            auth()->guard($guard)->logout();
            return response()->json(['error' => 'Blocked'], 401);
        }
        if($role=='user' && $user_data->plan_expiry_date<$current_date){
            auth()->guard($guard)->logout();
            return response()->json(['error' => 'Expired'], 401);
        }
        
        //for stope multiple login
        if($current_date==$user_data->current_date && $role=='user')
            User::where('id',$user_data->id)->update(['latest_token'=>$token,'daily_login_count'=>$user_data->daily_login_count+1,'current_date'=>$current_date]);
        elseif($role=='user')
            User::where('id',$user_data->id)->update(['latest_token'=>$token,'daily_login_count'=>1,'current_date'=>$current_date]);

        return json_encode(['token'=>$token,'user'=>$user_data,'role'=>$role]);
    }
    public function login_superadmin()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth()->guard('superAdmin-api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return $this->respondWithToken($token);
    }
}
