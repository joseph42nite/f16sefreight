<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Agent;

class BranchController extends Controller
{
    /** Agent columns written on both create and update. */
    private const FIELDS = [
        'agent_name', 'agent_address', 'agent_pincode', 'agent_city', 'company_id',
        'agent_issue_sign', 'agent_issue_loc_code', 'agent_issue_date', 'agent_account',
        'iata_agent_code', 'iata_agent_cass',
        'participant_airport', 'prticipant_identifer', 'participant_code', 'participant_file_reference',
        'office_airport', 'office_function_designator', 'office_company_designator', 'office_file_reference',
        'ho_name', 'ho_address', 'ho_city', 'ho_pincode', 'ho_state', 'ho_country',
    ];

    public function index($id = 0)
    {
        if ($id)
            $data = Agent::with(['companyName'])->where([['id', $id]])->limit(1)->get()->toArray();
        else
            $data = Agent::with(['companyName'])->get()->toArray();

        return json_encode($data);
    }

    public function getCompanyBranch($company_id)
    {
        $data = Agent::where([['company_id', $company_id]])->select(['id', 'agent_city'])->get()->toArray();
        return json_encode($data);
    }

    public function register(Request $request)
    {
        $request->validate($this->rules());

        $agent = $this->fillAgent(new Agent(), $request);
        $agent->save();

        return response()->json(['status' => true, 'agent' => $agent]);
    }

    public function update(Request $request, $id)
    {
        $request->validate($this->rules());

        $agent = Agent::findOrFail($id);
        $this->fillAgent($agent, $request);
        $agent->save();

        return response()->json(['status' => true]);
    }

    /** Validation rules shared by register() and update(). */
    private function rules(): array
    {
        return [
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
        ];
    }

    /** Copy the request payload onto an Agent instance. */
    private function fillAgent(Agent $agent, Request $request): Agent
    {
        foreach (self::FIELDS as $field) {
            $agent->{$field} = $request->{$field};
        }
        return $agent;
    }
}
