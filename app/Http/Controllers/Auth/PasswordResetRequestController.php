<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\User;
use App\Admin;
use App\Role;
use App\SuperAdmin;
use App\Mail\ResetPasswordMailable;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;  // this is for make a Random token in that time User wanna send special Token to his Gmail
use Illuminate\Support\Facades\Validator;

class PasswordResetRequestController extends Controller
{
    
    public function sendEmail(Request $request)  // this is most important function to send mail and inside of that there are another function
    {
        $userTypeDemo=Role::where([['email',$request->email]])->select('role')->first()->toArray()['role'];
        if($userTypeDemo=='user')
        $userType='users';
        elseif($userTypeDemo=='admin')
        $userType='admins';
        else
        $userType='super_admins';
        if (!$this->validateEmail($request->email,$userType)) {  // this is validate to fail send mail or true
            return $this->failedResponse();
        }
        $this->send($request->email,$userType);  //this is a function to send mail 
        return $this->successResponse();
    }

    public function send($email,$userType)  //this is a function to send mail 
    {
        $token = $this->createToken($email);
        Mail::to($email)->send(new ResetPasswordMailable($token, $email, $userType));  // token is important in send mail 
    }

    public function createToken($email)  // this is a function to get your request email that there are or not to send mail
    {
        DB::table('password_resets')->where('email', $email)->delete();

        $token = Str::random(40);     // create a random to send 
        $this->saveToken($token, $email);   // Save token and email 
        return $token;
    }


    public function saveToken($token, $email)  // this function save new password in password_resets of table
    {
        date_default_timezone_set("Asia/Calcutta");
        DB::table('password_resets')->insert([
            'email' => $email,
            'token' => $token,
            'created_at' => Carbon::now()
        ]);
    }



    public function validateEmail($email,$userType)  //this is a function to get your email from database
    {
        $checkUserValid = DB::table($userType)->where('email', $email)->first();

        if ($checkUserValid) {
            return true;
        }
        else{
            return false;
        }
    }
	
// frome here two Function to Success or Failed send Request 	

    public function failedResponse()
    {
        return response()->json([
            'error' => 'Email does\'t found on our database'
        ], Response::HTTP_NOT_FOUND);
    }

    public function successResponse()
    {
        return response()->json([
            'data' => 'Reset Email is send successfully, please check your inbox.'
        ], Response::HTTP_OK);
    }
    public function check_token(Request $request){
        $email=$request->email;
        $token=$request->token;
        $count = DB::select( DB::raw("SELECT * FROM password_resets WHERE email = :email and token=:token and created_at > (NOW() - INTERVAL 30 MINUTE) limit 1"), array('email' => $email,'token'=>$token));
        if(!empty($count)){
            return response(['status'=>true,'data'=>$count],200);
        }
        else{
            return response(['status'=>false],401);
        }
    }
    public function forgot_password_actual(Request $request){
        $validator = Validator::make($request->all(), [
            "email" => 'required|email',
            "userType" => 'required|string',
            'password' => 'required|min:6|max:25|confirmed',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        DB::table($request->userType)->where('email', $request->email)->update(['password'=>Hash::make($request->password)]);
        return response(['status'=>true],200);
    }
}
