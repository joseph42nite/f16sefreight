<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use App\Rate;

class RateImportClass implements ToCollection
{
    /**
     * @param Collection $collection
     */
    public function collection(Collection $collection)
    {
        $headers = $collection->shift()->toArray();
        foreach ($collection as $col) {
            $data = array_combine($headers, $col->toArray());
            if (!empty($data['Carrier_Prefix']) || !empty($data['Currency_Code'])) {
                $rate_data_arr = $data;
                $currencyCodeIndex = array_search('Currency_Code', array_keys($rate_data_arr));
                $rate_data = array_slice($rate_data_arr, ($currencyCodeIndex + 1));
                $rate_data = array_filter($rate_data);
                $insert_data = [
                    "dest_airport_code" => $data['Destionation_Airport_Code'],
                    "zone" => $data['Zone'],
                    "carrier_code" => $data['Carrier_Code'],
                    "carrier_prefix" => $data['Carrier_Prefix'],
                    "product_name" => $data['Product_Name'],
                    "online_offline" => $data['Online_Offline'],
                    "dgr" => $data['DGR'],
                    "origin_country_code" => $data['Origin_Country_Code'],
                    "origin_airport_code" => $data['Origin_Airport_Code'],
                    "currency_code" => $data['Currency_Code'],
                    "rate_range" => json_encode($rate_data),
                ];
                Rate::create($insert_data);
            }
        }
    }
}
