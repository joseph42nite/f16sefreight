<?php

use App\Http\Controllers\airwayBill\AirwayBill;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConversionController;

use App\Http\Controllers\GenerateAwbPdfController;
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

Route::get('download-awb-pdf/{id}', [GenerateAwbPdfController::class, 'downloadPdf']);
Route::get('download-multiple-awb-pdf/{id}', [GenerateAwbPdfController::class, 'downloadMultipleAwbPdf']);
Route::get('download-multiple-both-page-awb-pdf/{id}', [GenerateAwbPdfController::class, 'downloadMultipleWithBackAwbPdf']);
Route::get('download-hawb-pdf/{id}', [GenerateHawbPdfController::class, 'downloadHawbPdf']);
Route::get('download-multiple-hawb-pdf/{id}', [GenerateHawbPdfController::class, 'downloadMultipleHawbPdf']);
Route::get('download-multiple-both-page-hawb-pdf/{id}', [GenerateHawbPdfController::class, 'downloadMultipleWithBackHawbPdf']);
Route::get('download-consolidation-pdf/{awb_code}/{awb_no}', [GenerateConsolidationPdfController::class, 'downloadConsolidationPdf']);
Route::get('download-multiple-consolidation-pdf/{awb_code}/{awb_no}', [GenerateConsolidationPdfController::class, 'downloadMultipleConsolidationPdf']);

Route::get('{any}', function () {
    return view('welcome');
})->where('any', '(?!generate-pdf)(?!test-route)(?!test-route1)(?!generic-message)(?!message-response)(?!house-message)(?!direct-data).*$');
