<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use App\Ams;
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
                'carrier_code'=>$data['carrier_code'],
                'carrier_prefix'=>$data['carrier_prefix'],
                'fsc'=>$data['fsc'],
                'scc'=>$data['scc'],
                'xray'=>$data['xray'],
                'misc'=>$data['misc'],
                'ctg'=>$data['ctg'],
                'awb_fee'=>$data['awb_fee'],
                'mawb'=>$data['mawb'],
                'hawb'=>$data['hawb'],
            ];
            if(!empty($data['carrier_code']) && !empty($data['mawb']))
            Ams::create($insert_data);
        }
    }
}
