<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConversionController;
Route::get('test-route', [ConversionController::class, 'WayBillConversion']);

Route::get('{any}', function () {
    return view('welcome');
})->where('any', '(?!generate-pdf)(?!test-route).*$');
