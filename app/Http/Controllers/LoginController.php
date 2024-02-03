<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Role;
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
        if($user_data->is_active!=1){
            auth()->guard($guard)->logout();
            return response()->json(['error' => 'Unauthorized'], 401);
        }
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
