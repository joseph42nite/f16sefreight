<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    //
    protected $table = 'agents_info';
    
    protected $fillable = [
        'agent_name',
        'agent_address',
        'agent_issue_sign',
        'agent_issue_loc_code',
        'agent_issue_date',
        'agent_account',
        'office_airport',
        'office_function_designator', //2
        'office_company_designator', //2
        'iata_agent_code' => 'nullable|numeric|size:7',  //7
        'iata_agent_cass' => 'nullable|numeric|size:4', //4
        'office_file_reference:' => '',	 
        'iata_agent_code' => 'nullable|numeric|size:7',  //7
        'iata_agent_cass' => 'nullable|numeric|size:4', //4
        'participant_airport' => '',
        'prticipant_identifer' => '',
        'participant_code' => '',
        'participant_file_reference:' => '',
    ];
}
