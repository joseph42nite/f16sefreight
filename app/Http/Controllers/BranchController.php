<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Agent;
use Illuminate\Support\Facades\Validator;

class BranchController extends Controller
{
    //
    public function index($id = 0)
    {
        if ($id)
            $data = Agent::where([['id', $id]])->limit(1)->get()->toArray();
        else
            $data = Agent::all()->toArray();

        return json_encode($data);
    }
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $Agent = new Agent();
        $Agent->name = $request->name;
        $Agent->save();
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $Agent = Agent::find($id);
        $Agent->name = $request->name;
        $Agent->save();
    }
}