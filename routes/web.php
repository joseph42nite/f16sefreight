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
use App\Http\Controllers\Data\RateController;
use App\Http\Controllers\Data\LocationController;
use App\Http\Controllers\Data\AmsController;
use App\Http\Controllers\Data\ReportController;
use App\Http\Controllers\Data\CurrencyRateController;
use App\Http\Controllers\Generators\GenerateAwbPdfController;
use App\Http\Controllers\Generators\GenerateHawbPdfController;
use App\Http\Controllers\Generators\GenerateConsolidationPdfController;


use Illuminate\Support\Facades\Route;

// 🔒 2026-09-16 audit: the public test and conversion routes (air-waybill, message-response, generic-message,
// house-message, direct-data, create-partner, test-route, test-route1) and the public /ocr upload tool are gone —
// they ran customs conversions and paid OCR for anyone. The same work runs behind sign-in under /api/user.

// Waybill PDFs open in a new tab, which carries no sign-in token, so each link is a short-lived signed URL issued
// by POST /api/pdf-link after checking the waybill is the caller's (PdfLinkController).
Route::middleware('signed')->group(function () {
    Route::get('download-awb-pdf/{id}', [GenerateAwbPdfController::class, 'downloadPdf'])->name('pdf.awb');
    Route::get('download-multiple-awb-pdf/{id}', [GenerateAwbPdfController::class, 'downloadMultipleAwbPdf'])->name('pdf.awb-multiple');
    Route::get('download-multiple-both-page-awb-pdf/{id}', [GenerateAwbPdfController::class, 'downloadMultipleWithBackAwbPdf'])->name('pdf.awb-multiple-both');
    Route::get('download-hawb-pdf/{id}', [GenerateHawbPdfController::class, 'downloadHawbPdf'])->name('pdf.hawb');
    Route::get('download-multiple-hawb-pdf/{id}', [GenerateHawbPdfController::class, 'downloadMultipleHawbPdf'])->name('pdf.hawb-multiple');
    Route::get('download-multiple-both-page-hawb-pdf/{id}', [GenerateHawbPdfController::class, 'downloadMultipleWithBackHawbPdf'])->name('pdf.hawb-multiple-both');
    Route::get('download-consolidation-pdf/{awb_code}/{awb_no}', [GenerateConsolidationPdfController::class, 'downloadConsolidationPdf'])->name('pdf.consolidation');
    Route::get('download-multiple-consolidation-pdf/{awb_code}/{awb_no}', [GenerateConsolidationPdfController::class, 'downloadMultipleConsolidationPdf'])->name('pdf.consolidation-multiple');
});
use App\Blog;

Route::get('blog/{slug}', function ($slug) {
    $blog = Blog::where('slug', $slug)->first();
    return view('welcome', compact('blog'));
});

Route::get('/login', function () {
    return view('welcome');
})->name('login');

Route::get('{any}', function () {
    return view('welcome');
})->where('any', '(?!api/)(?!download-).*$');
