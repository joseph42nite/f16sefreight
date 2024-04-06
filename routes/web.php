<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CurrencyRateController;
Route::get('test-route', [CurrencyRateController::class, 'getCurrencyRate']);

Route::get('{any}', function () {
    return view('welcome');
})->where('any', '(?!generate-pdf)(?!test-route).*$');
