<?php

namespace App\Http\Controllers;

use App\Contacts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function index(){
        return Contacts::all();
    }

    public function store(Request $request){
        $validator = Validator::make($request->all(),[
            'first_name' =>['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:100'],
            'phone' => ['required'],
            'message' => ['required'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $contact=new Contacts();
        $contact->first_name=$request->first_name;
        $contact->last_name=$request->last_name;
        $contact->email=$request->email;
        $contact->message=$request->message;
        $contact->phone=$request->phone;
        $contact->save();
        return response()->json([
            'message' => 'Thanks for contact us your request saccessfully saved',
        ])->setStatusCode(200);
    }
   
    public function delete($id){
        $contact=Contacts::find($id);
        $contact->delete();
        return "Contact deleted successful";
    }
}
