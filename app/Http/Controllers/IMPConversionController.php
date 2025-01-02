<?php

namespace App\Http\Controllers;

use App\AirwayBills;
use App\HousewayBills;
use App\WayBillAddress;
use App\ConsignmentData;
use App\Agent;
use App\PaymentInfo;
use App\OtherCharge;
use App\OtherCustomInformation;
use App\Ams;
use App\Airline;
use Illuminate\Http\Request;
use DOMDocument;

class IMPConversionController extends Controller
{
    //
    public function WayBillConversion($awb_id = "12312345678")
    {
        // Fetch data from the database (this is just sample data for now)
        $waybill_data = AirwayBills::where([['id', $awb_id]])->first()->toArray();
        $waybill_address = WayBillAddress::where([['awb_id', $awb_id]])->limit(1)->first()->toArray();
        $consignment_data = ConsignmentData::where([['awb_id', $awb_id]])->limit(1)->first()->toArray();
        $agent_details = Agent::where('id', 1)->limit(1)->first()->toArray();
        $payment_details = PaymentInfo::where('awb_id', $awb_id)->limit(1)->first()->toArray();
        $other_charges = OtherCharge::where('awb_id', $awb_id)->get()->toArray();
        $custom_info = OtherCustomInformation::where('awb_id', $awb_id)->get()->toArray();

        $utc_current_date = gmdate("Y-m-d H:i:s");
        $time = time();

        // =========strat imp conversion==========
        //1
        $main_data = "FWB/17<br>";
        //2
        $main_data .= $waybill_data['awb_code'] . '-' . $waybill_data['awb_no'] . substr($waybill_data['departure_airport'], 0, 3) . substr($waybill_data['destination_airport'], 0, 3) . '/' . "T" . $consignment_data['pieces'] . "K" . $consignment_data['gross_weight'] . "<br>";
        //3
        $main_data .= "FLT/" . $waybill_data['by'] . $waybill_data['flight'] . "/" . substr($waybill_data['date'], 0, 2);
        if ($waybill_data['by_2'])
            $main_data .= "/" . $waybill_data['by_2'] . $waybill_data['flight_2'] . "/" . substr($waybill_data['date_2'], 0, 2);
        if ($waybill_data['by_3'])
            $main_data .= "/" . $waybill_data['by_3'] . $waybill_data['flight_3'] . "/" . substr($waybill_data['date_3'], 0, 2);
        $main_data .= "<br>";
        //4
        $main_data .= "RTG/" . substr($waybill_data['to'], 0, 3) . $waybill_data['by'];
        if ($waybill_data['to_2'])
            $main_data .= "/" . substr($waybill_data['to_2'], 0, 3) . $waybill_data['by_2'];
        if ($waybill_data['to_3'])
            $main_data .= "/" . substr($waybill_data['to_3'], 0, 3) . $waybill_data['by_3'];
        $main_data .= "<br>";
        //shiper address
        //5
        $main_data .= "SHP<br>";
        //6
        $main_data .= "NAM/" . $waybill_address['ship_name'] . "<br>";
        //7
        $main_data .= "ADR/" . $waybill_address['ship_address'] . "/" . $waybill_address['ship_address_line_2'] . "<br>";
        //8
        $main_data .= "LOC/" . $waybill_address['ship_city'] . "/" . substr($waybill_address['ship_state'], 0, 2) . "/" . substr($waybill_address['ship_country'], 0, 2) . "/" . $waybill_address['ship_post_code'] . "/" . "TE/" . $waybill_address['ship_telex'];
        $main_data .= "<br>";
        //consignee address
        //9
        $main_data .= "CNE<br>";
        //10
        $main_data .= "NAM/" . $waybill_address['cons_name'] . "<br>";
        //11
        $main_data .= "ADR/" . $waybill_address['cons_address'] . "/" . $waybill_address['cons_address_line_2'] . "<br>";
        //12
        $main_data .= "LOC/" . $waybill_address['cons_city'] . "/" . substr($waybill_address['cons_state'], 0, 2) . "/" . substr($waybill_address['cons_country'], 0, 2) . "/" . $waybill_address['cons_post_code'] . "/" . "TE/" . $waybill_address['cons_telex'];
        $main_data .= "<br>";
        //18//agent details
        $main_data .= 'AGT//' . $agent_details['iata_agent_code'] . '/' . $agent_details['iata_agent_cass'] . "<br>";
        //19
        $main_data .= '/' . $agent_details['agent_name'] . "<br>";
        //20
        $main_data .= '/' . substr($agent_details['agent_issue_loc_code'], 0, 17) . "<br>";
        //ssr
        if (!empty($waybill_data['special_service_request']))
            $main_data .= "SSR/" . $waybill_data['special_service_request'] . "<br>";
        //also notify
        if (!empty($waybill_address['also_name'])) {
            $main_data .= "NFY<br>";
            $main_data .= "NAM/" . $waybill_address['also_name'] . "<br>";
            $main_data .= "ADR/" . $waybill_address['also_address'] . "/" . $waybill_address['also_address_line_2'] . "<br>";
            $main_data .= "LOC/" . $waybill_address['also_city'] . "/" . substr($waybill_address['also_state'], 0, 2) . "/" . substr($waybill_address['also_country'], 0, 2) . "/" . $waybill_address['also_post_code'] . "/" . "TE/" . $waybill_address['also_telex'];
            $main_data .= "<br>";
        }
        //Accounting Information
        if (!empty($waybill_data['letter_credit']) && !empty($waybill_data['accounting_information'])) {
            $main_data .= "ACC/" . $waybill_data['letter_credit'] . "/" . substr($waybill_data['accounting_information'], 0, 32) . "<br>";
        }
        //21
        $main_data.="CVD/".$payment_details['currency']."/".$payment_details['type_of_payment']."/".$payment_details['declear_value_carriage']."/".$payment_details['declear_value_customs']."/".$payment_details['declear_value_insurance']."<br>";
        //22
        $main_data.="RTD/1/P".$consignment_data['pieces']."/K".$consignment_data['gross_weight']."/".$consignment_data['rate_class']."/W".$consignment_data['chargable_weight']."/R".$consignment_data['rate']."/T".$waybill_data['total_amount']."NC/".$consignment_data['description']."<br>";
        $main_data.="/2/ND//".

        echo $main_data;
    }
}