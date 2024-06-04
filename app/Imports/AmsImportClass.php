<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use App\Ams;
use SebastianBergmann\Environment\Console;
class AmsImportClass implements ToCollection
{
    /**
    * @param Collection $collection
    */
    public function collection(Collection $collection)
    {
        //
        $headers = $collection->shift()->toArray();
        foreach ($collection as $col) {
            $data = array_combine($headers, $col->toArray());
            $insert_data=[
                'carrier_code'=>$data['Carrier_Code'],
                'carrier_prefix'=>$data['Carrier_Prefix'],
                'origin'=>$data['origin'],
                'region'=>$data['Region'],
                'dest_airport_code'=>$data['Destination_Airport_Code'],
                'dest_country'=>$data['Destination_Country'],
                'country_code'=>$data['Country_Code'],
                'haul'=>$data['Haul'],
                'fsc'=>$data['fsc'],
                'scc'=>$data['scc'],
                'xray'=>$data['xray'],
                'misc'=>$data['misc'],
                'ctg'=>$data['ctg'],
                'awb_fee'=>$data['awb_fee'],
                'fe'=>$data['fe'],
                'mawb'=>$data['mawb'],
                'hawb'=>$data['hawb'],
                'dg_fee'=>$data['dg_fee'],
            ];
            if(!empty($data['Carrier_Code']))
            Ams::create($insert_data);
        }
    }
}
