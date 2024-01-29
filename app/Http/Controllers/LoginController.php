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
        return json_encode(['token'=>$token,'user'=>auth()->guard($guard)->user(),'role'=>$role]);
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
