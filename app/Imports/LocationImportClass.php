<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use App\Location;

class LocationImportClass implements ToCollection
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
                'destination'=>$data['destination'],
                'iata_code'=>$data['iata_code'],
            ];
            if(!empty($data['destination']) && !empty($data['iata_code']))
            Location::create($insert_data);
        }
    }
}
