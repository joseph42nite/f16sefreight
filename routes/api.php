<?php
// auth()->guard('admin-api')->user()->id;

use App\Airline;
use App\Http\Controllers\airwayBill\AirwayBill;
use App\Http\Controllers\airwayBill\ConsolidationController;
use App\Http\Controllers\airwayBill\HousewayBill;
use App\Http\Controllers\airwayBill\MessageLog;
use App\Http\Controllers\ContactController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\user\UserController;
use App\Http\Controllers\superAdmin\SuperAdminController;
use App\Http\Controllers\PasswordResetRequestController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RateController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\AmsController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\CurrencyRateController;
use App\Http\Controllers\ConversionController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\BranchController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
    Route::post('/create-webdoc', [AirwayBill::class, 'store']);
    Route::post('/get-consignment-error', [AirwayBill::class, 'getConsignmentError']);
    Route::get('/agent-info', [AirwayBill::class, 'get_agent']);
    Route::get('/waybill/{awb_id?}', [ConversionController::class, 'WayBillConversion']);
    Route::get('/get-shippers', [AirwayBill::class, 'getShippers']);
    Route::get('/get-shipper-address', [AirwayBill::class, 'getShipperAddress']);
    Route::get('/get-consignee-address', [AirwayBill::class, 'getConsigneeAddress']);
    Route::get('/get-alsonotify-address', [AirwayBill::class, 'getAlsoNotifyAddress']);
    Route::get('/all-airway-bill', [AirwayBill::class, 'getAllawb']);
    Route::put('/update-airway-bill/{id}', [AirwayBill::class, 'update']);
    Route::get('/airway-bill/{id}', [AirwayBill::class, 'show']);
    Route::get('/get-awbcode-prefix/{code}', [AirwayBill::class, 'getAwbPrefixData']);
    Route::get('/load-awb', [AirwayBill::class, 'loadAWB']);

    Route::get('/all-consolidation', [ConsolidationController::class, 'index']);
    Route::put('/update-consolidation/{id}', [ConsolidationController::class, 'update']);
    Route::post('/search-house-way-bills', [ConsolidationController::class, 'searchHouseWayBills']);
    Route::get('/fetch-airwaybill-data', [ConsolidationController::class, 'fetchTableData']);

    Route::get('/get-location', [LocationController::class, 'getLocation']);



    //-------houseWaybills-----
    Route::post('/create-houseway-bill', [HousewayBill::class, 'store']);
    Route::put('/update-houseway-bill/{id}', [HousewayBill::class, 'update']);

    Route::post('/get-house-consignment-error', [HousewayBill::class, 'getConsignmentError']);
    Route::get('/get-country', [HousewayBill::class, 'getCountry']);
    Route::get('/other-charges', [HousewayBill::class, 'getOtherCharges']);
    Route::get('/get-oci-data', [HousewayBill::class, 'getOCIData']);

    Route::put('/update-houseway-bill/{id}', [HousewayBill::class, 'update']);
    Route::get('/houseway-bill/{id}', [HousewayBill::class, 'show']);
    Route::get('/all-houseway-bill', [HousewayBill::class, 'getAllHawb']);

    Route::get('/get-shippers', [HousewayBill::class, 'getShippers']);
    Route::get('/get-shipper-address', [HousewayBill::class, 'getShipperAddress']);
    Route::get('/get-consignee-address', [HousewayBill::class, 'getConsigneeAddress']);
    Route::get('/get-alsonotify-address', [HousewayBill::class, 'getAlsoNotifyAddress']);


    //message Log 
    Route::get('/house-way-bills/{awb_code}/{awb_no}', [MessageLog::class,'getHouseWayBills']);
    Route::get('/get-all-airwaybill', [MessageLog::class,'getAllAirwaybills']);
    Route::delete('/house-way-bills/{id}', [MessageLog::class, 'deleteHouseWayBill']);
    
    //========end of the  airway bill operation=====

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
    //rate related work by admin
    Route::post('/import-excel', [RateController::class, 'rateImport']);
    Route::get('/get-airline-list/{source?}', [RateController::class, 'getAirlineList']);
    Route::get('/get-source-list', [RateController::class, 'getSourceList']);
    Route::delete('/delete-rate/{carrier_code}/{carrier_prefix}/{source}', [RateController::class, 'deleteRate']);
    Route::get('/get-airline-list', [RateController::class, 'getAirlineList']);
    Route::delete('/delete-rate/{carrier_code}/{carrier_prefix}', [RateController::class, 'deleteRate']);

    //loctaion related work
    Route::post('/import-loctaion', [LocationController::class, 'importData']);
    Route::get('/get-location', [LocationController::class, 'getLocation']);
    Route::delete('/delete-location', [LocationController::class, 'delete']);

    //ams related work
    Route::post('/import-ams', [AmsController::class, 'importData']);
    Route::get('/get-ams-list/{source}', [AmsController::class, 'getAmsList']);
    Route::delete('/delete-ams/{source}', [AmsController::class, 'delete']);

    Route::get('get-notice', [SettingController::class, 'getNotice']);
    Route::post('add-notice', [SettingController::class, 'insert']);
    Route::post('delete-notice', [SettingController::class, 'delete']);

    //company related work by admin
    Route::post('/create-company', [CompanyController::class, 'register']);
    Route::put('/edit-company/{id}', [CompanyController::class, 'update']);
    Route::get('/all-company/{id?}', [CompanyController::class, 'index']);
    Route::delete('/company/{id?}', [CompanyController::class, 'delete']);

    //branch related work by admin
    Route::post('/create-branch', [BranchController::class, 'register']);
    Route::put('/edit-branch/{id}', [BranchController::class, 'update']);
    Route::get('/all-branch/{id?}', [BranchController::class, 'index']);
    Route::get('/get-company-branch/{company_id?}', [BranchController::class, 'getCompanyBranch']);
    Route::delete('/branch/{id?}', [BranchController::class, 'delete']);
});

Route::post('/Forgotpassword', [PasswordResetRequestController::class, 'sendEmail']);
Route::post('/check-forgot-token', [PasswordResetRequestController::class, 'check_token']);
Route::post('ForgotpasswordActual', [PasswordResetRequestController::class, 'forgot_password_actual']);

//common login
Route::post('/login', [LoginController::class, 'login']);
Route::post('/contact', [ContactController::class, 'store']);
Route::get('/all-contacts', [ContactController::class, 'index']);
Route::delete('/delete-contact/{id?}', [ContactController::class, 'delete']);