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
        $main_data .= "CVD/" . $payment_details['currency'] . "/" . $payment_details['type_of_payment'] . "/" . $payment_details['declear_value_carriage'] . "/" . $payment_details['declear_value_customs'] . "/" . $payment_details['declear_value_insurance'] . "<br>";
        //22
        $main_data .= "RTD/1/P" . $consignment_data['pieces'] . "/K" . $consignment_data['gross_weight'] . "/" . $consignment_data['rate_class'] . "/W" . $consignment_data['chargable_weight'] . "/R" . $consignment_data['rate'] . "/T" . $waybill_data['total_amount'] . "NC/" . $consignment_data['description'] . "<br>";
        //12 pieces information(dimsion) 
        $pieces_info = json_decode($consignment_data['pieces_info'], true);
        $main_data .= "/2/ND//" . ($pieces_info[0]['gross_weight'] ? 'K' . $pieces_info[0]['gross_weight'] . "/" : '') . $pieces_info[0]['unit'] . $pieces_info[0]['length'] . "-" . $pieces_info[0]['width'] . "-" . $pieces_info[0]['height'] . "/" . $pieces_info[0]['pcs'] . "<br>";

        if ($consignment_data['hs_code']) {
            $hs_code = json_decode($consignment_data['hs_code'], true);
            $main_data .= "/3/NH/" . $hs_code[0] . "<br>";
        }
        $main_data .= "/4/NO/" . $consignment_data['country_origin_goods'] . '/' . $consignment_data['service_code'] . "<br>";

        for ($i = 1; $i < sizeof($pieces_info); $i++) {
            $main_data .= "/" . (4 + $i) . "/ND//" . ($pieces_info[$i]['gross_weight'] ? 'K' . $pieces_info[$i]['gross_weight'] . "/" : '') . $pieces_info[$i]['unit'] . $pieces_info[$i]['length'] . "-" . $pieces_info[$i]['width'] . "-" . $pieces_info[$i]['height'] . "/" . $pieces_info[$i]['pcs'] . "<br>";
        }
        //13 other charges
        $main_data .= "OTH/" . $other_charges[0]['payment_type'] . "/";
        for ($i = 0; $i < sizeof($other_charges); $i++) {
            $main_data .= substr($other_charges[$i]['other_charge_code'], 0, 2) . $other_charges[$i]['due'] . $other_charges[$i]['amount'] . ".00";
        }
        $main_data .= "<br>";
        //14 total amount
        if ($payment_details['type_of_payment'] == 'P') {
            $prepaid_collect_text = "prepaid";
            $main_data .= "PPD";
        } else {
            //15
            $prepaid_collect_text = "collect";
            $main_data .= "COL";
        }
        $main_data .= "/" . "WT" . $payment_details['weight_charge'] . "/OC" . $payment_details['other_charges_due_carrier_' . $prepaid_collect_text];
        if ($payment_details['other_charges_due_agent_' . $prepaid_collect_text])
            $main_data .= "/OA" . $payment_details['other_charges_due_agent_' . $prepaid_collect_text];
        if ($payment_details['taxes'])
            $main_data .= "/TX" . $payment_details['taxes'];
        $main_data .= "/CT" . $payment_details['total_charges_' . $prepaid_collect_text];
        $main_data .= "<br>";
        //16
        $main_data .= "CER/" . substr($agent_details['agent_name'], 0, 20) . "<br>";
        //17
        $main_data .= "ISU/" . date("jMy") . "/" . substr($agent_details['agent_issue_loc_code'], 0, 3) . "/" . $agent_details['agent_issue_sign'] . "<br>";
        //18
        if (!empty($waybill_data['other_service_information']))
            $main_data .= "OSI/" . substr($waybill_data['other_service_information'], 0, 65) . "<br>";
        if (!empty(substr($waybill_data['other_service_information'], 65, 65)))
            $main_data .= "/" . substr($waybill_data['other_service_information'], 65, 65) . "<br>";
        if (!empty(substr($waybill_data['other_service_information'], 130, 65)))
            $main_data .= "/" . substr($waybill_data['other_service_information'], 130, 65) . "<br>";
        //20
        $main_data .= "REF///" . substr($agent_details['prticipant_identifer'], 0, 3) . "/" . substr(str_replace(' ', '', $agent_details['participant_code']), 0, 17) . "/" . substr($agent_details['participant_airport'], 0, 3) . "<br>";
        //21
        $main_data .= "COR/" . substr($waybill_data['customs_origin_code'], 0, 2) . "<br>";
        //25
        $main_data .= "SPH";
        $special_handling_info = json_decode($waybill_data['special_handling_info'], true);
        for ($i = 0; $i < sizeof($special_handling_info); $i++) {
            $main_data .= "/" . $special_handling_info[$i];
        }
        $main_data .= "<br>";
        //29
        if ($custom_info) {
            $main_data .= "OCI";
            for ($i = 0; $i < sizeof($custom_info); $i++) {
                $main_data .= "/" . $custom_info[$i]['country_code'] . "/" . $custom_info[$i]['info_identifier'] . "/" . $custom_info[$i]['custom_info_identifier'] . "/" . $custom_info[$i]['supplementary_info'] . "<br>";
            }
        }
        echo $main_data;
    }
    public function HouseWayBillConversion($hawb_no = '12345678')
    {
        // Fetch data from the database (this is just sample data for now)
        $house_data = HousewayBills::where([['id', $hawb_no]])->first()->toArray();
        $house_address = WayBillAddress::where([['awb_id', $hawb_no]])->limit(1)->first()->toArray();
        $consignment_data = ConsignmentData::where([['awb_id', $hawb_no]])->limit(1)->first()->toArray();
        $agent_details = Agent::where('id', 1)->limit(1)->first()->toArray();
        $payment_details = PaymentInfo::where('awb_id', $hawb_no)->limit(1)->first()->toArray();
        $other_charges = OtherCharge::where('awb_id', $hawb_no)->get()->toArray();
        $custom_info = OtherCustomInformation::where('awb_id', $hawb_no)->get()->toArray();

        $utc_current_date = gmdate("Y-m-d H:i:s");
        $time = time();
    }
}