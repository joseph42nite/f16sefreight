<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\RateImportClass;

class RateController extends Controller
{
    //
    public function rateImport(Request $request)
    {
        $file = $request->file('file');
        Excel::import(new RateImportClass, $file);
    }
}
