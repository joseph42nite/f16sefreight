<?php
// auth()->guard('admin-api')->user()->id;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\user\UserController;
use App\Http\Controllers\superAdmin\SuperAdminController;
use App\Http\Controllers\PasswordResetRequestController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RateController;
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
//user login and register
Route::post('/register', [UserController::class,'register']);
Route::group(['middleware' => 'auth:user-api','prefix' => 'user'], function () {
    Route::post('logout', [UserController::class,'logout']);
    Route::post('verify', [UserController::class,'me']);
    Route::post('get-rate', [RateController::class,'index']);
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
});

Route::post('/Forgotpassword12',[PasswordResetRequestController::class,'sendEmail']);
Route::post('/check-forgot-token',[PasswordResetRequestController::class,'check_token']);
Route::post('ForgotpasswordActual',[PasswordResetRequestController::class,'forgot_password_actual']);

//common login
Route::post('/login', [LoginController::class,'login']);





