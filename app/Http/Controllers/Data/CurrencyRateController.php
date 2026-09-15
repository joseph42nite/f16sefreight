<?php

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\CurrencyRate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
class CurrencyRateController extends Controller
{

    public function getCurrency(){
        return CurrencyRate::all(['currency','rate']);
    }
}
