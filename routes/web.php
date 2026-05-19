<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetRequestController;
use App\Http\Controllers\Admin\SuperAdminController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\BranchController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Logistics\AirwayBillController;
use App\Http\Controllers\Logistics\HousewayBillController;
use App\Http\Controllers\Logistics\MessageLogController;
use App\Http\Controllers\Logistics\ConsolidationController;
use App\Http\Controllers\Logistics\GLNResponseController;
use App\Http\Controllers\Logistics\ConversionController;
use App\Http\Controllers\Logistics\IMPConversionController;
use App\Http\Controllers\Logistics\OcrController;
use App\Http\Controllers\Data\RateController;
use App\Http\Controllers\Data\LocationController;
use App\Http\Controllers\Data\AmsController;
use App\Http\Controllers\Data\ReportController;
use App\Http\Controllers\Data\CurrencyRateController;
use App\Http\Controllers\Generators\GenerateAwbPdfController;
use App\Http\Controllers\Generators\GenerateHawbPdfController;
use App\Http\Controllers\Generators\GenerateConsolidationPdfController;


use Illuminate\Support\Facades\Route;

// Route::get('test-route', [ConversionController::class, 'WayBillConversion']);
Route::get('air-waybill', [ConversionController::class, 'WayBillConversion']);
Route::get('test-route1', [IMPConversionController::class, 'ConsolidationConversion']);
Route::get('message-response', [ConversionController::class, 'ResponseMessage']);
Route::get('generic-message', [ConversionController::class, 'GenericRequestMessage']);
Route::get('house-message', [ConversionController::class, 'HouseManifestMessage']);
Route::get('direct-data', [ConversionController::class, 'DirectDataMessage']);
Route::get('create-partner', [ConversionController::class, 'CreatePartner']);
Route::get('/test-route', function () {
    return view('email/awb_reject_status');
});
Route::get('download-awb-pdf/{id}', [GenerateAwbPdfController::class, 'downloadPdf']);
Route::get('download-multiple-awb-pdf/{id}', [GenerateAwbPdfController::class, 'downloadMultipleAwbPdf']);
Route::get('download-multiple-both-page-awb-pdf/{id}', [GenerateAwbPdfController::class, 'downloadMultipleWithBackAwbPdf']);
Route::get('download-hawb-pdf/{id}', [GenerateHawbPdfController::class, 'downloadHawbPdf']);
Route::get('download-multiple-hawb-pdf/{id}', [GenerateHawbPdfController::class, 'downloadMultipleHawbPdf']);
Route::get('download-multiple-both-page-hawb-pdf/{id}', [GenerateHawbPdfController::class, 'downloadMultipleWithBackHawbPdf']);
Route::get('download-consolidation-pdf/{awb_code}/{awb_no}', [GenerateConsolidationPdfController::class, 'downloadConsolidationPdf']);
Route::get('download-multiple-consolidation-pdf/{awb_code}/{awb_no}', [GenerateConsolidationPdfController::class, 'downloadMultipleConsolidationPdf']);
Route::get('/ocr', fn() => view('tools.ocr.upload'));
Route::post('/ocr-extract', [OcrController::class, 'extract'])->name('ocr.extract');
use App\Blog;

Route::get('blog/{slug}', function ($slug) {
    $blog = Blog::where('slug', $slug)->first();
    return view('welcome', compact('blog'));
});

Route::get('{any}', function () {
    return view('welcome');
})->where('any', '(?!ocr)(?!ocr-extract)(?!generate-pdf)(?!test-route)(?!test-route1)(?!generic-message)(?!message-response)(?!house-message)(?!direct-data).*$');
