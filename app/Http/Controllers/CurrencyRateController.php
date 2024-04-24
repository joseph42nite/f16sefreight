<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\CurrencyRate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
class CurrencyRateController extends Controller
{
    //
    public function getCurrencyRate(){
        date_default_timezone_set('Asia/Kolkata');
        try {
            $response = Http::get('https://api.currencyfreaks.com/v2.0/rates/latest', [
                'apikey' => env('RATE_TOKEN'),
                'symbols' => 'USD,INR'
            ]);
            // EUR,AED
            if ($response->status() == 200) {
                $data=$response->body();
                $data=json_decode($data,true);
                $data=$data['rates'];
                foreach ($data as $key => $value) {
                    if($key!='INR')
                     $update_value=$data[$key]*$data['INR'];
                    else
                     $update_value=1;
                    $update_value=round($update_value, 2);
                    CurrencyRate::where('currency',$key)->update(['rate'=>$update_value]);
                }
            } else {
                echo 'Unexpected HTTP status: ' . $response->status() . ' ' . $response->body();
            }
        } catch (\Exception $e) {
            echo 'Error: ' . $e->getMessage();
        }
    }

    public function getCurrency(){
        return CurrencyRate::all(['currency','rate']);
    }
}
