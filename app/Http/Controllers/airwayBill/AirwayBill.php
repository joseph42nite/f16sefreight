<?php

namespace App\Http\Controllers\airwayBill;

use App\Agent;
use App\AirwayBills;
use App\Http\Controllers\Controller;
use App\PaymentInfo;
use App\WayBillAddress;
use App\SavedAddress;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AirwayBill extends Controller
{
    public function get_agent(){
        $data = Agent::where('user_id', 1)->get(['agent_name','agent_address','agent_issue_sign','agent_issue_loc_code','agent_issue_date','agent_pincode','agent_city','agent_account','office_airport','office_function_designator','office_company_designator','iata_agent_code','iata_agent_cass','office_file_reference','participant','participant_airport','prticipant_identifer','participant_code','participant_file_reference']);
        return json_encode($data);
    }
    public function store(){

    }
}