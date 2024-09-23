<?php

namespace App\Http\Controllers;

use App\Agent;
use App\AirwayBills;
use App\WayBillAddress;
use App\ConsignmentData;
use Illuminate\Http\Request;
use DOMDocument;

class ConversionController extends Controller
{
    //
    public function WayBillConversion($awb_id = 6543154)
    {
        $waybill_data = AirwayBills::where([['id', $awb_id]])->limit(1)->get()->toArray();
        $waybill_address = WayBillAddress::where([['awb_id', $awb_id]])->limit(1)->get()->toArray();
        $consignment_data = ConsignmentData::where([['awb_id', $awb_id]])->limit(1)->get()->toArray();
        
        //start conversion
        $xml = new DOMDocument('1.0', 'UTF-8');
        $xml->formatOutput = true;
        $waybill = $xml->createElementNS('iata:waybill:1', 'rsm:Waybill');
        $waybill->setAttribute('xmlns:xsd', 'http://www.w3.org/2001/XMLSchema');
        $waybill->setAttribute('xmlns:ccts', 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:2');
        $waybill->setAttribute('xmlns:udt', 'urn:un:unece:uncefact:data:standard:UnqualifiedDataType:8');
        $waybill->setAttribute('xmlns:ram', 'iata:datamodel:5');
        $waybill->setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        $waybill->setAttribute('xsi:schemaLocation', 'iata:waybill:1 Waybill_1.xsd');
        
    }
}
