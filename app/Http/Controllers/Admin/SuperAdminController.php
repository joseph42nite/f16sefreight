<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\SuperAdmin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
class SuperAdminController extends Controller
{
    public function register(Request $request){
        $superadmin=new SuperAdmin();
        $superadmin->name=$request->name;
        $superadmin->email=$request->email;
        $superadmin->password=Hash::make($request->password);
        $superadmin->save();
        if($superadmin){
            return response()->json(['user'=>$superadmin,'status'=>true]);
        }
        else{
           return response()->json(['status'=>false]);
        }
    }

    public function me()
    {
        return response()->json(auth()->guard('superAdmin-api')->user());
    }

    public function logout()
    {
        auth()->guard('superAdmin-api')->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }
    protected function respondWithToken($token)
    {
        return response()->json([
            'token' => $token,
            'token_type' =>  'bearer',
        ]);
    }

    public function update(Request $request){
        $id=auth()->guard('superAdmin-api')->user()->id;
        SuperAdmin::where('id',$id)->update(['name'=>$request->name]);
        return json_encode(['status'=>true,'message'=>"Data updated successful"]);
    }
    public function update_password(Request $request){
        $validator = Validator::make($request->all(), [
            'password' => ['required', 'confirmed','min:4'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $id=auth()->guard('superAdmin-api')->user()->id;
        SuperAdmin::where('id', $id)->update(['password'=>Hash::make($request->password)]);
        return json_encode(['status'=>true,'message'=>"Password updated successful"]);
    }
}
