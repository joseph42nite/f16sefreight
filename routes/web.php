<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConversionController;
use App\Http\Controllers\GeneratePdfController;
Route::get('test-route', [ConversionController::class, 'WayBillConversion']);
// Route::get('generate-pdf', function(){
//     return view('generate-pdf');
// });
Route::view('/generate-pdf', 'generate-pdf');
Route::get('download-pdf', [GeneratePdfController::class, 'downloadPdf']);

Route::get('{any}', function () {
    return view('welcome');
})->where('any', '(?!generate-pdf)(?!download-pdf)(?!test-route).*$');
