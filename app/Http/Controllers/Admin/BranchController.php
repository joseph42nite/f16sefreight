<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Agent;

class BranchController extends Controller
{
    /** Agent columns written on both create and update. */
    private const FIELDS = [
        'agent_name', 'agent_address', 'agent_pincode', 'agent_city', 'company_id', 'branch_code', 'gst_no',
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
        $agent->branch_code = strtoupper((string) $agent->branch_code);
        $agent->save();

        return response()->json(['status' => true, 'agent' => $agent]);
    }

    public function update(Request $request, $id)
    {
        $request->validate($this->rules((int) $id));

        $agent = Agent::findOrFail($id);
        $this->fillAgent($agent, $request);
        $agent->branch_code = strtoupper((string) $agent->branch_code);
        $agent->save();

        return response()->json(['status' => true]);
    }

    /**
     * Validation rules shared by register() and update().
     *
     * Walk 7 (owner, 2026-10-11: "the branch making process sorted out"): the BRANCH CODE is the second half of every
     * enquiry and job number (ENQA-{company}{branch}-26-0001) and was not asked for at all, so a branch made here could
     * number nothing; it is required now, letters only, one per company. The GSTIN is asked for here (it decides CGST +
     * SGST vs IGST on every bill). The IATA agent code, CASS and the air waybill signing details are an air branch's
     * only — a sea-only branch has none — so they are optional, but checked when given. `company_id` was `max:100`,
     * a ceiling on the company's NUMBER; it must simply be a company that exists.
     */
    private function rules(?int $id = null): array
    {
        $companyId = (int) request('company_id');

        return [
            'company_id' => ['required', 'integer', 'exists:companies,id'],
            'agent_name' => ['required', 'string', 'max:100'],
            'branch_code' => ['required', 'regex:/^[A-Za-z]{2,5}$/', \Illuminate\Validation\Rule::unique('agents_info', 'branch_code')
                ->where(fn ($q) => $q->where('company_id', $companyId))->ignore($id)],
            'gst_no' => ['nullable', 'regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/'],
            'agent_address' => ['required', 'string', 'max:255'],
            'agent_pincode' => ['required', 'string', 'max:10'],
            'agent_city' => ['required', 'string', 'max:100'],
            'agent_issue_sign' => ['nullable', 'string', 'max:100'],
            'agent_issue_loc_code' => ['nullable', 'string', 'max:100'],
            'agent_issue_date' => ['nullable', 'date'],
            'agent_account' => ['nullable', 'string', 'max:100'],
            'iata_agent_code' => ['nullable', 'regex:/^[0-9]{7}$/'],
            'iata_agent_cass' => ['nullable', 'regex:/^[0-9]{4}$/'],
            'participant_airport' => ['nullable', 'string', 'max:100'],
            'prticipant_identifer' => ['nullable', 'string', 'max:100'],
            'participant_code' => ['nullable', 'string', 'max:100'],
            'participant_file_reference' => ['nullable', 'string', 'max:100'],
            'office_airport' => ['nullable', 'string', 'max:100'],
            'office_function_designator' => ['nullable', 'string', 'max:100'],
            'office_company_designator' => ['nullable', 'string', 'max:100'],
            'office_file_reference' => ['nullable', 'string', 'max:100'],
            'ho_name' => ['nullable', 'string', 'max:100'],
            'ho_address' => ['nullable', 'string', 'max:200'],
            'ho_city' => ['nullable', 'string', 'max:100'],
            'ho_pincode' => ['nullable', 'string', 'max:20'],
            'ho_state' => ['nullable', 'string', 'max:100'],
            'ho_country' => ['nullable', 'string', 'max:100'],
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
