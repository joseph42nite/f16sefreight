<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetRequestController;
use App\Http\Controllers\Admin\SuperAdminController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\BranchController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\TemplateController;
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
use App\Http\Controllers\Admin\BlogController;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// =================user section==========================
//user register
Route::post('/register', [UserController::class, 'register']);
Route::get('/get-location', [LocationController::class, 'getLocation']);

Route::group(['middleware' => 'auth:user-api', 'prefix' => 'user'], function () {
    Route::post('logout', [UserController::class, 'logout']);
    Route::post('verify', [UserController::class, 'me']);
    Route::post('get-rate', [RateController::class, 'index']);
    Route::get('get-location', [LocationController::class, 'getLocation']);
    Route::get('get-currency-rate', [CurrencyRateController::class, 'getCurrency']);
    Route::get('get-notice', [SettingController::class, 'getNotice']);
    Route::get('get-ams/{origin}', [AmsController::class, 'getAms']);
    Route::post('report', [ReportController::class, 'insert']);

    //=========for the airway bill operations====
    //airway bills route
    Route::post('/create-focusair', [AirwayBillController::class, 'store']);
    Route::post('/get-consignment-error', [AirwayBillController::class, 'getConsignmentError']);
    Route::get('/agent-info', [AirwayBillController::class, 'get_agent']);
    Route::get('/waybill/{awb_id?}', [ConversionController::class, 'WayBillConversion']);
    Route::get('/get-shippers', [AirwayBillController::class, 'getShippers']);
    Route::get('/get-shipper-address', [AirwayBillController::class, 'getShipperAddress']);
    Route::get('/get-consignee-address', [AirwayBillController::class, 'getConsigneeAddress']);
    Route::get('/get-alsonotify-address', [AirwayBillController::class, 'getAlsoNotifyAddress']);
    Route::get('/get-airway-bills/{status}', [AirwayBillController::class, 'getAirwayBills']);
    Route::put('/update-airway-bill/{id}', [AirwayBillController::class, 'update']);
    Route::get('/airway-bill/{id}', [AirwayBillController::class, 'show']);
    Route::get('/get-awbcode-prefix/{code}', [AirwayBillController::class, 'getAwbPrefixData']);
    Route::get('/load-awb', [AirwayBillController::class, 'loadAWB']);

    Route::get('/all-consolidation', [ConsolidationController::class, 'index']);
    Route::put('/update-consolidation/{id}', [ConsolidationController::class, 'update']);
    Route::post('/search-house-way-bills', [ConsolidationController::class, 'searchHouseWayBills']);
    Route::get('/fetch-airwaybill-data', [ConsolidationController::class, 'fetchTableData']);
    Route::get('/manifest-send/{awb_id}', [ConsolidationController::class, 'manifestSend']);

    Route::get('/get-location', [LocationController::class, 'getLocation']);

    //-------houseWaybills-----
    Route::post('/create-houseway-bill', [HousewayBillController::class, 'store']);
    Route::put('/update-houseway-bill/{id}', [HousewayBillController::class, 'update']);
    Route::post('/get-house-consignment-error', [HousewayBillController::class, 'getConsignmentError']);
    Route::get('/get-country', [HousewayBillController::class, 'getCountry']);
    Route::get('/other-charges', [HousewayBillController::class, 'getOtherCharges']);
    Route::get('/get-oci-data', [HousewayBillController::class, 'getOCIData']);
    Route::get('/houseway-bill/{id}', [HousewayBillController::class, 'show']);
    Route::get('/get-houseway-bills/{status}', [HousewayBillController::class, 'getAllHawb']);

    //message Log 
    Route::get('/all-airway-bill', [MessageLogController::class,'getAllAirwayBill']);
    Route::get('/house-way-bills/{awb_code}/{awb_no}', [MessageLogController::class,'getHouseWayBills']);
    Route::get('/get-master-awbs-with-housewaybills', [MessageLogController::class,'getMasterAwbsWithHouseWaybills']);
    Route::delete('/house-way-bills/{id}', [MessageLogController::class, 'deleteHouseWayBill']);
    Route::post('/search-airway-bills', [MessageLogController::class, 'searchBills']);
    //========end of the  airway bill operation=====
    Route::get('/get-xml/{awb_id}', [GLNResponseController::class, 'get_awb']);

    //File Upload API
    Route::post('/upload-awb-file', [OcrController::class, 'extract'])->middleware('throttle:60,1');
    Route::get('/ocr-status/{jobId}', [OcrController::class, 'status']);
    Route::get('/ocr-history', [OcrController::class, 'history']);
    Route::post('/get-airport-by-airport-code', [AirwayBillController::class, 'get_airport_by_airport_code']);
    Route::get('/company-templates', [UserController::class, 'getCompanyTemplates']);
});

// =================superAdmin section==========================
//superAdmin login and register
Route::post('superadmin/register', [SuperAdminController::class, 'register']);
Route::group(['middleware' => 'auth:superAdmin-api', 'prefix' => 'superadmin'], function () {
    Route::post('logout', [SuperAdminController::class, 'logout']);
    Route::post('verify', [SuperAdminController::class, 'me']);
    Route::put('upadte-detail', [SuperAdminController::class, 'update']);
    Route::put('update-password', [SuperAdminController::class, 'update_password']);
    //user related work by admin
    Route::post('/create-user', [UserController::class, 'register']);
    Route::put('/edit-user/{id}', [UserController::class, 'update']);
    Route::get('/all-user/{id?}', [UserController::class, 'index']);
    Route::delete('/user/{id?}', [UserController::class, 'delete']);

    Route::get('get-notice', [SettingController::class, 'getNotice']);
    Route::post('add-notice', [SettingController::class, 'insert']);
    Route::post('delete-notice', [SettingController::class, 'delete']);

    //company related work by admin
    Route::post('/create-company', [CompanyController::class, 'register']);
    Route::put('/edit-company/{id}', [CompanyController::class, 'update']);
    Route::get('/all-company/{id?}', [CompanyController::class, 'index']);
    Route::delete('/company/{id?}', [CompanyController::class, 'delete']);
    Route::get('/available-templates', [CompanyController::class, 'getAvailableTemplates']);

    // Coordinate System Management
    Route::get('/system-templates', [TemplateController::class, 'index']);
    Route::post('/system-templates/save', [TemplateController::class, 'save']);
    Route::delete('/system-templates/{id}', [TemplateController::class, 'delete']);

    //branch related work by admin
    Route::post('/create-branch', [BranchController::class, 'register']);
    Route::put('/edit-branch/{id}', [BranchController::class, 'update']);
    Route::get('/all-branch/{id?}', [BranchController::class, 'index']);
    Route::get('/get-company-branch/{company_id?}', [BranchController::class, 'getCompanyBranch']);
    Route::delete('/branch/{id?}', [BranchController::class, 'delete']);

    // Blog dynamic management
    Route::post('/create-blog', [BlogController::class, 'store']);
    Route::put('/edit-blog/{id}', [BlogController::class, 'update']);
    Route::get('/all-blogs-internal', [BlogController::class, 'index']);
    Route::delete('/delete-blog/{id}', [BlogController::class, 'destroy']);

    // Shipments per client
    Route::get('/client-shipments', [SuperAdminController::class, 'getClientShipments']);
    Route::get('/shipment-xml/{awb_id}', [SuperAdminController::class, 'getShipmentXml']);
    Route::get('/get-location', [LocationController::class, 'getLocation']);
});

Route::post('/Forgotpassword', [PasswordResetRequestController::class, 'sendEmail']);
Route::post('/check-forgot-token', [PasswordResetRequestController::class, 'check_token']);
Route::post('ForgotpasswordActual', [PasswordResetRequestController::class, 'forgot_password_actual']);

//common login
Route::post('/login', [LoginController::class, 'login']);
Route::post('/auth/login', [LoginController::class, 'login']);
Route::post('/contact', [ContactController::class, 'store']);
Route::get('/all-contacts', [ContactController::class, 'index']);
Route::delete('/delete-contact/{id?}', [ContactController::class, 'delete']);

//gln response url
Route::post('/gln-response', [GLNResponseController::class, 'store']);
Route::get('/check', [GLNResponseController::class, 'check']);

// Public Blog Feed
Route::get('/get-public-blogs', [BlogController::class, 'index']);
Route::get('/get-public-blog/{slug}', [BlogController::class, 'show']);

// OpenClaw Integration Routes
Route::post('/openclaw/webhook', [\App\Http\Controllers\OpenClawController::class, 'webhook'])->middleware('openclaw.verify');
Route::post('/openclaw/telegram-callback', [\App\Http\Controllers\OpenClawController::class, 'telegramCallback']);
Route::get('/openclaw/pending', [\App\Http\Controllers\OpenClawController::class, 'getPendingActions']);