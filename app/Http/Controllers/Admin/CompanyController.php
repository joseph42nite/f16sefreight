<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Company;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    //
    public function index($id = 0)
    {
        if ($id)
            $data = Company::where([['id', $id]])->limit(1)->get(['id','name'])->toArray();
        else
            $data = Company::all(['id','name'])->toArray();

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
        $company = new Company();
        $company->name = $request->name;
        $company->save();
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $company = Company::find($id);
        $company->name = $request->name;
        $company->save();
    }
}