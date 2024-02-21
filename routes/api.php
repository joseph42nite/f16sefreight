<?php
// auth()->guard('admin-api')->user()->id;
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
Route::post('/register', [UserController::class,'register']);
Route::get('/get-location', [LocationController::class,'getLocation']);


Route::group(['middleware' => 'auth:user-api','prefix' => 'user'], function () {
    Route::post('logout', [UserController::class,'logout']);
    Route::post('verify', [UserController::class,'me']);
    Route::post('get-rate', [RateController::class,'index']);
    Route::get('get-location', [LocationController::class,'getLocation']);
    Route::get('get-notice', [SettingController::class,'getNotice']);
    Route::get('/get-ams', [AmsController::class,'getAms']);
});

// =================superAdmin section==========================
//superAdmin login and register
Route::post('superadmin/register', [SuperAdminController::class,'register']);
Route::group(['middleware' => 'auth:superAdmin-api','prefix' => 'superadmin'], function () {
    Route::post('logout', [SuperAdminController::class,'logout']);
    Route::post('verify', [SuperAdminController::class,'me']);
    Route::put('upadte-detail', [SuperAdminController::class,'update']);
    Route::put('update-password', [SuperAdminController::class,'update_password']);
    //user related work by admin
    Route::post('/create-user', [UserController::class,'register']);
    Route::put('/edit-user/{id}', [UserController::class,'update']);
    Route::get('/all-user/{id?}', [UserController::class,'index']);
    Route::delete('/user/{id?}', [UserController::class,'delete']);
    //rate related work by admin
    Route::post('/import-excel', [RateController::class,'rateImport']);
    Route::get('/get-airline-list', [RateController::class,'getAirlineList']);
    Route::delete('/delete-rate/{carrier_code}/{carrier_prefix}', [RateController::class,'deleteRate']);

    //loctaion related work
    Route::post('/import-loctaion', [LocationController::class,'importData']);
    Route::get('/get-location', [LocationController::class,'getLocation']);

    //ams related work
    Route::post('/import-ams', [AmsController::class,'importData']);
    Route::delete('/delete-ams', [AmsController::class,'delete']);

    Route::get('get-notice', [SettingController::class,'getNotice']);
    Route::post('add-notice', [SettingController::class,'insert']);
    Route::post('delete-notice', [SettingController::class,'delete']);
});

Route::post('/Forgotpassword',[PasswordResetRequestController::class,'sendEmail']);
Route::post('/check-forgot-token',[PasswordResetRequestController::class,'check_token']);
Route::post('ForgotpasswordActual',[PasswordResetRequestController::class,'forgot_password_actual']);

//common login
Route::post('/login', [LoginController::class,'login']);





