<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Company;
use App\Agent;
use App\AirwayBills;
use App\HousewayBills;
use App\ConsignmentData;

class ClientShipmentsSeeder extends Seeder
{
    public function run()
    {
        Company::unguard();
        Agent::unguard();
        AirwayBills::unguard();
        ConsignmentData::unguard();
        HousewayBills::unguard();
        // 1. Create Companies
        $acme = Company::updateOrCreate(
            ['name' => 'Acme Logistics'],
            ['templates_config' => ['allowed_templates' => [], 'default_focus_air' => '', 'default_house_air' => '']]
        );

        $globex = Company::updateOrCreate(
            ['name' => 'Globex Freight'],
            ['templates_config' => ['allowed_templates' => [], 'default_focus_air' => '', 'default_house_air' => '']]
        );

        // 2. Create Agents
        $acmeAgent = Agent::updateOrCreate(
            ['agent_name' => 'Acme HQ'],
            [
                'company_id' => $acme->id,
                'agent_address' => '100 Acme Way, New York, NY',
                'agent_city' => 'New York',
                'agent_country' => 'US',
            ]
        );

        $globexAgent = Agent::updateOrCreate(
            ['agent_name' => 'Globex NY'],
            [
                'company_id' => $globex->id,
                'agent_address' => '200 Globex Blvd, Los Angeles, CA',
                'agent_city' => 'Los Angeles',
                'agent_country' => 'US',
            ]
        );

        // Clear existing test airway bills to avoid conflict
        AirwayBills::whereIn('agent_id', [$acmeAgent->id, $globexAgent->id])->delete();
        ConsignmentData::whereIn('awb_id', ['12345678901', '12345678902', '99911112222'])->delete();
        HousewayBills::whereIn('agent_id', [$acmeAgent->id, $globexAgent->id])->delete();

        // 3. Create Airway Bills for Acme
        // AWB 1
        $awb1 = new AirwayBills();
        $awb1->id = '12345678901';
        $awb1->awb_code = '123';
        $awb1->awb_no = '45678901';
        $awb1->departure_airport = 'JFK';
        $awb1->destination_airport = 'LHR';
        $awb1->agent_id = $acmeAgent->id;
        $awb1->created_at = now();
        $awb1->save();

        $c1 = new ConsignmentData();
        $c1->awb_id = $awb1->id;
        $c1->pieces = 10;
        $c1->gross_weight = '250';
        $c1->weight_code = 'K';
        $c1->save();

        // HAWB for AWB 1
        $h1 = new HousewayBills();
        $h1->id = 'H-ACME-01';
        $h1->awb_code = 123;
        $h1->awb_no = 45678901;
        $h1->agent_id = $acmeAgent->id;
        $h1->departure_airport = 'JFK';
        $h1->destination_airport = 'LHR';
        $h1->save();

        $h2 = new HousewayBills();
        $h2->id = 'H-ACME-02';
        $h2->awb_code = 123;
        $h2->awb_no = 45678901;
        $h2->agent_id = $acmeAgent->id;
        $h2->departure_airport = 'JFK';
        $h2->destination_airport = 'LHR';
        $h2->save();

        // AWB 2
        $awb2 = new AirwayBills();
        $awb2->id = '12345678902';
        $awb2->awb_code = '123';
        $awb2->awb_no = '45678902';
        $awb2->departure_airport = 'JFK';
        $awb2->destination_airport = 'CDG';
        $awb2->agent_id = $acmeAgent->id;
        $awb2->created_at = now()->subDay();
        $awb2->save();

        $c2 = new ConsignmentData();
        $c2->awb_id = $awb2->id;
        $c2->pieces = 5;
        $c2->gross_weight = '120';
        $c2->weight_code = 'K';
        $c2->save();

        $h3 = new HousewayBills();
        $h3->id = 'H-ACME-03';
        $h3->awb_code = 123;
        $h3->awb_no = 45678902;
        $h3->agent_id = $acmeAgent->id;
        $h3->departure_airport = 'JFK';
        $h3->destination_airport = 'CDG';
        $h3->save();

        // 4. Create Airway Bills for Globex
        // AWB 3
        $awb3 = new AirwayBills();
        $awb3->id = '99911112222';
        $awb3->awb_code = '999';
        $awb3->awb_no = '11112222';
        $awb3->departure_airport = 'LAX';
        $awb3->destination_airport = 'HND';
        $awb3->agent_id = $globexAgent->id;
        $awb3->created_at = now();
        $awb3->save();

        $c3 = new ConsignmentData();
        $c3->awb_id = $awb3->id;
        $c3->pieces = 20;
        $c3->gross_weight = '500';
        $c3->weight_code = 'K';
        $c3->save();

        $h4 = new HousewayBills();
        $h4->id = 'H-GLOB-01';
        $h4->awb_code = 999;
        $h4->awb_no = 11112222;
        $h4->agent_id = $globexAgent->id;
        $h4->departure_airport = 'LAX';
        $h4->destination_airport = 'HND';
        $h4->save();

        $h5 = new HousewayBills();
        $h5->id = 'H-GLOB-02';
        $h5->awb_code = 999;
        $h5->awb_no = 11112222;
        $h5->agent_id = $globexAgent->id;
        $h5->departure_airport = 'LAX';
        $h5->destination_airport = 'HND';
        $h5->save();

        $h6 = new HousewayBills();
        $h6->id = 'H-GLOB-03';
        $h6->awb_code = 999;
        $h6->awb_no = 11112222;
        $h6->agent_id = $globexAgent->id;
        $h6->departure_airport = 'LAX';
        $h6->destination_airport = 'HND';
        $h6->save();
    }
}
