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
                'destination'=>$data['Destionation_Airport_name'],
                'iata_code'=>$data['Destionation_Airport_Code'],
                'country_code'=>$data['Country_Code'],
                'region'=>$data['Region'],
                'zone'=>$data['Zone'],
            ];
            if(!empty($data['Destionation_Airport_name']) && !empty($data['Destionation_Airport_Code']))
            Location::create($insert_data);
        }
    }
}
