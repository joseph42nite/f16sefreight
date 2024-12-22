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
        $main_data="FWB/17<br>";
        $main_data.=$waybill_data['awb_code'].'-'.$waybill_data['awb_no'].$waybill_data['departure_airport'].$waybill_data['destination_airport'].'/'."T".$consignment_data['pieces']."K".$consignment_data['gross_weight']."<br>";

        echo $main_data;
    }
}