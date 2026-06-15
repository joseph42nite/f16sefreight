<?php

use Illuminate\Database\Seeder;
use App\Port;

class PortSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $ports = [
            [
                'locode' => 'SGSIN',
                'port_name' => 'Singapore Port',
                'country_code' => 'SG',
                'port_type' => 'multi',
                'is_active' => true,
            ],
            [
                'locode' => 'INBLR',
                'port_name' => 'Kempegowda International Airport (Bangalore)',
                'country_code' => 'IN',
                'port_type' => 'air',
                'is_active' => true,
            ],
            [
                'locode' => 'INMAA',
                'port_name' => 'Chennai Port',
                'country_code' => 'IN',
                'port_type' => 'sea',
                'is_active' => true,
            ],
            [
                'locode' => 'INBOM',
                'port_name' => 'Nhava Sheva (Mumbai)',
                'country_code' => 'IN',
                'port_type' => 'sea',
                'is_active' => true,
            ],
            [
                'locode' => 'AEDXB',
                'port_name' => 'Dubai Port / Airport',
                'country_code' => 'AE',
                'port_type' => 'multi',
                'is_active' => true,
            ],
            [
                'locode' => 'USLAX',
                'port_name' => 'Los Angeles Port / Airport',
                'country_code' => 'US',
                'port_type' => 'multi',
                'is_active' => true,
            ],
            [
                'locode' => 'USJFK',
                'port_name' => 'John F. Kennedy International Airport (New York)',
                'country_code' => 'US',
                'port_type' => 'air',
                'is_active' => true,
            ],
            [
                'locode' => 'NLRTM',
                'port_name' => 'Rotterdam Port',
                'country_code' => 'NL',
                'port_type' => 'sea',
                'is_active' => true,
            ],
            [
                'locode' => 'NLAMS',
                'port_name' => 'Schiphol Airport (Amsterdam)',
                'country_code' => 'NL',
                'port_type' => 'air',
                'is_active' => true,
            ],
            [
                'locode' => 'GBLHR',
                'port_name' => 'London Heathrow Airport',
                'country_code' => 'GB',
                'port_type' => 'air',
                'is_active' => true,
            ],
            [
                'locode' => 'DEFRA',
                'port_name' => 'Frankfurt Airport',
                'country_code' => 'DE',
                'port_type' => 'air',
                'is_active' => true,
            ],
            [
                'locode' => 'DEHAM',
                'port_name' => 'Hamburg Port',
                'country_code' => 'DE',
                'port_type' => 'sea',
                'is_active' => true,
            ],
            [
                'locode' => 'CNPVG',
                'port_name' => 'Shanghai Pudong International Airport',
                'country_code' => 'CN',
                'port_type' => 'air',
                'is_active' => true,
            ],
            [
                'locode' => 'CNSHA',
                'port_name' => 'Shanghai Port',
                'country_code' => 'CN',
                'port_type' => 'sea',
                'is_active' => true,
            ],
        ];

        foreach ($ports as $portData) {
            Port::updateOrCreate(
                ['locode' => $portData['locode']],
                $portData
            );
        }
    }
}
