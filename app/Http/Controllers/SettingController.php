<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Setting;
use Illuminate\Support\Facades\Validator;
class SettingController extends Controller
{
    //
    public function getNotice(){
        return Setting::all();
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
}
