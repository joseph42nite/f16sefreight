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

    public function clientAwbs(Request $request)
    {
        $query = \App\PdfProcessingJob::with('user');

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->input('from_date'));
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->input('to_date'));
        }

        $jobs = $query->orderBy('created_at', 'desc')->get();

        $data = $jobs->map(function ($job) {
            $user = $job->user;
            return [
                'id' => $job->id,
                'company_name' => $user ? $user->company_name : 'Unknown',
                'operator_name' => $user ? $user->name : 'Unknown',
                'original_filename' => $job->original_filename,
                'document_type' => $job->document_type,
                'status' => $job->status,
                'created_at' => $job->created_at ? $job->created_at->toDateTimeString() : null,
                'completed_at' => $job->completed_at ? $job->completed_at->toDateTimeString() : null,
            ];
        });

        return response()->json(['status' => true, 'data' => $data]);
    }
}
