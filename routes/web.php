<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConversionController;

use App\Http\Controllers\GeneratePdfController;
use App\Http\Controllers\GenerateConsolidationPdfController;

Route::get('test-route', [ConversionController::class, 'WayBillConversion']);
Route::get('test-route1', [ConversionController::class, 'HouseWayBillConversion']);
Route::get('message-response', [ConversionController::class, 'ResponseMessage']);
Route::get('generic-message', [ConversionController::class, 'GenericRequestMessage']);

Route::view('/generate-pdf', 'generate-pdf');
Route::get('download-pdf', [GeneratePdfController::class, 'downloadPdf']);
Route::view('/consolidation-pdf', 'consolidation-pdf');
Route::get('download-consolidation-pdf', [GenerateConsolidationPdfController::class, 'downloadConsolidationPdf']);

Route::get('{any}', function () {
    return view('welcome');
})->where('any', '(?!generate-pdf)(?!test-route)(?!test-route1)(?!generic-message)(?!message-response).*$');
