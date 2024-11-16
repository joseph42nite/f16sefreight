<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConversionController;

use App\Http\Controllers\GeneratePdfController;
use App\Http\Controllers\GenerateConsolidationPdfController;
use App\Http\Controllers\GenerateHawbPdfController;

use App\Http\Controllers\airwayBill\HousewayBill;

// Route::get('test-route', [ConversionController::class, 'WayBillConversion']);
Route::get('test-route1', [ConversionController::class, 'HouseWayBillConversion']);
Route::get('message-response', [ConversionController::class, 'ResponseMessage']);
Route::get('generic-message', [ConversionController::class, 'GenericRequestMessage']);
Route::get('house-message', [ConversionController::class, 'HouseManifestMessage']);
Route::get('direct-data', [ConversionController::class, 'DirectDataMessage']);
Route::get('create-partner', [ConversionController::class, 'CreatePartner']);
Route::get('test-route', [HousewayBill::class,'getCountry']);

Route::get('download-pdf', [GeneratePdfController::class, 'downloadPdf']);
Route::get('download-consolidation-pdf', [GenerateConsolidationPdfController::class, 'downloadConsolidationPdf']);
Route::get('download-hawb-pdf', [GenerateHawbPdfController::class, 'downloadHawbPdf']);

Route::get('{any}', function () {
    return view('welcome');
})->where('any', '(?!generate-pdf)(?!test-route)(?!test-route1)(?!generic-message)(?!message-response)(?!house-message)(?!direct-data).*$');
