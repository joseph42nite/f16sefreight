<?php

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

class ReportController extends Controller
{
    //
    public function insert(Request $request){
        return $request->all();
    }
}
