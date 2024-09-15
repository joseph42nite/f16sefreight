<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AirwayBills extends Model
{
    //
    protected $table = 'air_way_bills';
    
    protected $fillable = [
        'awb_code',
        'awb_no',
        'consolidated_MAWB',
        'awb',
        'departure_airport',
        'destination_airport',
        'customs_origin_code',
        'from', 'to', 'by','flight', 'date', 
        'from_2','to_2','by_2','flight_2','date_2',
        'from_3','to_3', 'by_3','flight_3','date_3',
        'customs_origin_code',
        'accounting_information',
        'special_handling_code',
        'special_service_request',
        'other_service_information',
        'oci_country_code',//Other Customs Information(OCI)
        'oci_info_identifier',
        'oci_custom_info_identifier',
        'oci_supplementary_info',
        'shipment_ref_no',
        'supplementary_shipment_Info',
    ];
}
