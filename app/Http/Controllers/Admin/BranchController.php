<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Agent;
use Illuminate\Support\Facades\Validator;

class BranchController extends Controller
{
    //
    public function index($id = 0)
    {
        if ($id)
            $data = Agent::with(['companyName'])->where([['id', $id]])->limit(1)->get()->toArray();
        else
            $data = Agent::with(['companyName'])->get()->toArray();

        return json_encode($data);
    }
    public function getCompanyBranch($company_id){
        $data = Agent::where([['company_id', $company_id]])->select(['id','agent_city'])->get()->toArray();
        return json_encode($data);
    }
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'agent_name' => ['required', 'string', 'max:50'],
            'agent_address' => ['required', 'string', 'max:50'],
            'agent_pincode' => ['required', 'string', 'max:7'],
            'agent_city' => ['required', 'string', 'max:50'],
            'company_id' => ['required', 'numeric', 'max:100'],
            'agent_issue_sign' => ['required', 'string', 'max:100'],
            'agent_issue_loc_code' => ['required', 'string', 'max:100'],
            'agent_issue_date' => ['required', 'date'],
            'agent_account' => ['nullable', 'string', 'max:100'],
            // 'iata_agent_code' => ['required', 'numeric', 'max:10'],
            // 'iata_agent_cass' => ['required', 'numeric', 'max:10'],
            'iata_agent_code' => ['required', 'regex:/^[0-9]+$/', 'size:7'],
            'iata_agent_cass' => ['required', 'regex:/^[0-9]+$/', 'size:4'],
            'participant_airport' => ['string', 'max:100'],
            'prticipant_identifer' => ['string', 'max:100'],
            'participant_code' => ['string', 'max:100'],
            'participant_file_reference' => ['string', 'max:100'],
            'office_airport' => ['string', 'max:100'],
            'office_function_designator' => ['string', 'max:100'],
            'office_company_designator' => ['string', 'max:100'],
            'office_file_reference' => ['string', 'max:100'],
            'ho_name' => ['string', 'max:100'],
            'ho_address' => ['string', 'max:100'],
            'ho_city' => ['string', 'max:100'],
            'ho_pincode' => ['string', 'max:100'],
            'ho_state' => ['string', 'max:100'],
            'ho_country' => ['string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $agent = new Agent();
        $agent->agent_name = $request->agent_name;
        $agent->agent_address = $request->agent_address;
        $agent->agent_pincode = $request->agent_pincode;
        $agent->agent_city = $request->agent_city;
        $agent->company_id = $request->company_id;
        $agent->agent_issue_sign = $request->agent_issue_sign;
        $agent->agent_issue_loc_code = $request->agent_issue_loc_code;
        $agent->agent_issue_date = $request->agent_issue_date;
        $agent->agent_account = $request->agent_account;
        $agent->iata_agent_code = $request->iata_agent_code;
        $agent->iata_agent_cass = $request->iata_agent_cass;
        $agent->participant_airport = $request->participant_airport;
        $agent->prticipant_identifer = $request->prticipant_identifer;
        $agent->participant_code = $request->participant_code;
        $agent->participant_file_reference = $request->participant_file_reference;
        $agent->office_airport = $request->office_airport;
        $agent->office_function_designator = $request->office_function_designator;
        $agent->office_company_designator = $request->office_company_designator;
        $agent->office_file_reference = $request->office_file_reference;
        $agent->ho_name = $request->ho_name;
        $agent->ho_address = $request->ho_address;
        $agent->ho_city = $request->ho_city;
        $agent->ho_pincode = $request->ho_pincode;
        $agent->ho_state = $request->ho_state;
        $agent->ho_country = $request->ho_country;
        $agent->save();
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'agent_name' => ['required', 'string', 'max:50'],
            'agent_address' => ['required', 'string', 'max:50'],
            'agent_pincode' => ['required', 'string', 'max:7'],
            'agent_city' => ['required', 'string', 'max:50'],
            'company_id' => ['required', 'numeric', 'max:100'],
            'agent_issue_sign' => ['required', 'string', 'max:100'],
            'agent_issue_loc_code' => ['required', 'string', 'max:100'],
            'agent_issue_date' => ['required', 'date'],
            'agent_account' => ['nullable', 'string', 'max:100'],
            'iata_agent_code' => ['required', 'regex:/^[0-9]+$/', 'size:7'],
            // 'iata_agent_cass' => ['required', 'numeric', 'max:10'],nullable|regex:/^[0-9]+$/|size:7
            'iata_agent_cass' => ['required', 'regex:/^[0-9]+$/', 'size:4'],
            'participant_airport' => ['string', 'max:100'],
            'prticipant_identifer' => ['string', 'max:100'],
            'participant_code' => ['string', 'max:100'],
            'participant_file_reference' => ['string', 'max:100'],
            'office_airport' => ['string', 'max:100'],
            'office_function_designator' => ['string', 'max:100'],
            'office_company_designator' => ['string', 'max:100'],
            'office_file_reference' => ['string', 'max:100'],
            'ho_name' => ['string', 'max:100'],
            'ho_address' => ['string', 'max:100'],
            'ho_city' => ['string', 'max:100'],
            'ho_pincode' => ['string', 'max:100'],
            'ho_state' => ['string', 'max:100'],
            'ho_country' => ['string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $agent = Agent::find($id);
        $agent->agent_name = $request->agent_name;
        $agent->agent_address = $request->agent_address;
        $agent->agent_pincode = $request->agent_pincode;
        $agent->agent_city = $request->agent_city;
        $agent->company_id = $request->company_id;
        $agent->agent_issue_sign = $request->agent_issue_sign;
        $agent->agent_issue_loc_code = $request->agent_issue_loc_code;
        $agent->agent_issue_date = $request->agent_issue_date;
        $agent->agent_account = $request->agent_account;
        $agent->iata_agent_code = $request->iata_agent_code;
        $agent->iata_agent_cass = $request->iata_agent_cass;
        $agent->participant_airport = $request->participant_airport;
        $agent->prticipant_identifer = $request->prticipant_identifer;
        $agent->participant_code = $request->participant_code;
        $agent->participant_file_reference = $request->participant_file_reference;
        $agent->office_airport = $request->office_airport;
        $agent->office_function_designator = $request->office_function_designator;
        $agent->office_company_designator = $request->office_company_designator;
        $agent->office_file_reference = $request->office_file_reference;
        $agent->ho_name = $request->ho_name;
        $agent->ho_address = $request->ho_address;
        $agent->ho_city = $request->ho_city;
        $agent->ho_pincode = $request->ho_pincode;
        $agent->ho_state = $request->ho_state;
        $agent->ho_country = $request->ho_country;
        $agent->save();
    }
}