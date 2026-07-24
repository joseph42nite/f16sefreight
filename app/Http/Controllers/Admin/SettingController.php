<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Setting;

class SettingController extends Controller
{
    public function getNotice(){
        return Setting::all(['carrier_code','user_notice_1']);
    }

    public function insert(Request $request){
        $request->validate([
            'message' => ['required', 'string'],
            'airline' => ['required', 'string', 'max:10'],
        ]);

        $setting=new Setting();
        $setting->carrier_code=$request->airline;
        $setting->user_notice_1=$request->message;
        $setting->save();

        return response()->json(['status'=>true]);
    }

    public function update(Request $request){
        $request->validate([
            'user_notice_1' => ['required', 'string', 'max:500'],
        ]);
        Setting::where('id',1)->update(['user_notice_1'=>$request->user_notice_1]);
        return "success";
    }

    public function delete(Request $request){
        $request->validate([
            'carrier_code' => ['required', 'string', 'max:10'],
        ]);
        Setting::where('carrier_code',$request->carrier_code)->delete();
        return "delete done";
    }
}
