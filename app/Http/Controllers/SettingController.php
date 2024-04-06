<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Setting;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
class SettingController extends Controller
{
    //
    public function getNotice(){
        return Setting::all(['carrier_code','user_notice_1']);
    }
    public function insert(Request $request){
        $validator = Validator::make($request->all(), [
            'message' => ['required', 'string'],
            'airline' => ['required', 'string', 'max:10'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $setting=new Setting();
        $setting->carrier_code=$request->airline;
        $setting->user_notice_1=$request->message;
        $setting->save();

        if($setting){
            return response()->json(['status'=>true]);
        }
        else{
           return response()->json(['status'=>false]);
        }
    }
    public function update(Request $request){
        $validator = Validator::make($request->all(), [
            'user_notice_1' => ['required', 'string', 'max:500'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        Setting::where('id',1)->update(['user_notice_1'=>$request->user_notice_1]);
        return "success";
    }
    public function delete(Request $request){
        $validator = Validator::make($request->all(), [
            'carrier_code' => ['required', 'string', 'max:10'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        Setting::where('carrier_code',$request->carrier_code)->delete();
        return "delete done";
    }
}
