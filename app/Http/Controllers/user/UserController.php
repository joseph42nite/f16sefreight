<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use App\User;
use App\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index($id = 0)
    {
        if ($id)
            $data = User::where([['id', $id]])->limit(1)->get()->toArray();
        else
            $data = User::orderBy('created_at', 'desc')->get()->toArray();

        return json_encode($data);
    }
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'origin_airport_code' => ['required', 'string', 'max:100'],
            'company_name' => ['required', 'max:100'],
            'branch_name' => ['required', 'max:50'],
            'email' => ['required', 'string', 'email', 'max:100', 'unique:users'],
            'password' => ['required', 'string', 'min:4'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $current_date = date("Y-m-d");
        $current_date = date("Y-m-d", strtotime($current_date . " +1 week"));
        $user = new User();
        $user->name = $request->name;
        $user->origin_airport_code = $request->origin_airport_code;
        $user->company_name = $request->company_name;
        $user->branch_name = $request->branch_name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->plan_expiry_date = $current_date;
        $user->pima_address = $request->pima_address;
        $user->save();

        $role = new Role();
        $role->email = $request->email;
        $role->role = 'user';
        $role->save();

        if ($user) {
            return response()->json(['user' => $user, 'status' => true]);
        } else {
            return response()->json(['status' => false]);
        }
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'company_name' => ['required', 'string', 'max:100'],
            'plan_expiry_date' => ['required'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $user = User::find($id);
        $user->name = $request->name;
        $user->company_name = $request->company_name;
        $user->origin_airport_code = $request->origin_airport_code;
        // $user->daily_login_count=$request->daily_login_count;
        // $user->plan_expiry_date=$request->plan_expiry_date;
        $user->is_active = $request->is_active;
        $user->pima_address = $request->pima_address;
        if (!empty($request->password))
            $user->password = Hash::make($request->password);
        $user->save();
        if ($user) {
            return response()->json(['status' => true]);
        } else {
            return response()->json(['status' => false]);
        }
    }


    public function personal_update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $id = auth()->guard('user-api')->user()->id;
        $user = User::find($id);
        $user->name = $request->name;
        $user->save();
        if ($user) {
            return response()->json(['status' => true]);
        } else {
            return response()->json(['status' => false]);
        }
    }
    public function update_password(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => ['required', 'confirmed', 'min:4'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $id = auth()->guard('user-api')->user()->id;
        User::where('id', $id)->update(['password' => Hash::make($request->password)]);
        return json_encode(['status' => true, 'message' => "Password updated successful"]);
    }
    public function me(Request $request)
    {
        $user_data = auth()->guard('user-api')->user();
        if ($request->token == $user_data->latest_token) {
            return response()->json($user_data);
        } else {
            auth()->guard('user-api')->logout();
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function logout()
    {
        auth()->guard('user-api')->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'token' => $token,
            'token_type' => 'bearer',
        ]);
    }
    public function delete($id)
    {
        $user = User::find($id);
        Role::where(['email' => $user['email'], 'role' => 'user'])->delete();
        $user->delete();
        return "User deleted";
    }
}