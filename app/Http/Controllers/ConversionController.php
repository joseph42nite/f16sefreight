<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ConversionController extends Controller
{
    //
    public function WayBillConversion($awb_id=6543154){
        return "hello i am here $awb_id";
    }
}
