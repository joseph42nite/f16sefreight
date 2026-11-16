<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Contacts;
use App\Support\WorkEmail;
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

    /**
     * The landing page's "Talk to us" form (2026-11-16): work emails only, with the company and the person's
     * designation, so the team can filter who to call. Free mailboxes (Gmail, Outlook…) and domains that can't receive
     * mail are refused here, whatever the browser checked. Rate limited in routes/api.php.
     */
    public function storeLead(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:150', function ($attribute, $value, $fail) {
                if (WorkEmail::isFreeProvider((string) $value)) {
                    $fail(WorkEmail::MESSAGE);
                } elseif (!WorkEmail::domainIsReal((string) $value)) {
                    $fail(WorkEmail::NOT_REAL);
                }
            }],
            'company' => ['required', 'string', 'max:150'],
            'designation' => ['required', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:30'],
            'message' => ['nullable', 'string', 'max:2000'],
        ], [], ['email' => 'work email']);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $name = trim(preg_replace('/\s+/', ' ', $request->name));
        [$first, $last] = array_pad(explode(' ', $name, 2), 2, '');

        Contacts::create([
            'first_name' => $first,
            'last_name' => $last,
            'email' => strtolower(trim($request->email)),
            'company' => trim($request->company),
            'designation' => trim($request->designation),
            'phone' => $request->phone ? trim($request->phone) : null,
            'message' => $request->message ? trim($request->message) : null,
            'source' => 'landing',
        ]);

        return response()->json(['message' => 'Thanks. Our team will be in touch soon.']);
    }

    public function delete($id){
        $contact=Contacts::find($id);
        $contact->delete();
        return "Contact deleted successful";
    }




}
