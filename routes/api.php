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
use App\Http\Controllers\Logistics\AddressBookController;
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

    // Address Book Management
    Route::get('/saved-addresses', [AddressBookController::class, 'index']);
    Route::put('/saved-addresses/{id}', [AddressBookController::class, 'update']);
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
    Route::get('/mawb-hawbs/{awb_code}/{awb_no}', [SuperAdminController::class, 'getMawbHawbs']);
    Route::get('/hawb-xml/{hawb_id}', [SuperAdminController::class, 'getHawbXml']);
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
/*
|--------------------------------------------------------------------------
| Freight OS — lifecycle (guide §5.2)
|--------------------------------------------------------------------------
|
| 🔴 Every route here is behind `auth:user-api`, and that is load-bearing rather than
| conventional: TenantScope passes through UNFILTERED when no user is resolved (so that
| queue workers and console commands are not silently broken), which means an
| unauthenticated route touching a scoped model returns EVERY tenant's rows. Auth
| middleware is what closes that.
|
| `portal` additionally refuses a user on a subdomain their designation does not belong
| to, and checks TIER BEFORE ROLE so a Core tenant cannot reach a role-scoped endpoint by
| writing a designation straight into the database.
*/
Route::middleware(['auth:user-api', 'portal'])->group(function () {

    // ── Pre-conversion ──────────────────────────────────────────────────────
    Route::get('/enquiries', [\App\Http\Controllers\Freight\EnquiryController::class, 'index']);
    Route::post('/enquiries', [\App\Http\Controllers\Freight\EnquiryController::class, 'store']);
    Route::post('/enquiries/{enquiry}/lost', [\App\Http\Controllers\Freight\EnquiryController::class, 'markLost']);
    Route::post('/enquiries/{enquiry}/reopen', [\App\Http\Controllers\Freight\EnquiryController::class, 'reopen']);
    // The ONLY path that creates a jobs row.
    Route::post('/enquiries/{enquiry}/convert', [\App\Http\Controllers\Freight\EnquiryController::class, 'convert']);

    // ── Post-conversion ─────────────────────────────────────────────────────
    Route::get('/jobs', [\App\Http\Controllers\Freight\JobController::class, 'index']);
    Route::put('/jobs/{job}/status', [\App\Http\Controllers\Freight\JobController::class, 'updateStatus']);
    Route::post('/jobs/{job}/cancel', [\App\Http\Controllers\Freight\JobController::class, 'cancel']);
    Route::post('/jobs/{job}/reinitiate', [\App\Http\Controllers\Freight\JobController::class, 'reinitiate']);
    Route::post('/jobs/{job}/claim', [\App\Http\Controllers\Freight\JobController::class, 'claim']);
    Route::post('/jobs/{job}/reassign', [\App\Http\Controllers\Freight\JobController::class, 'reassign']);
    Route::post('/jobs/{job}/reassign/request', [\App\Http\Controllers\Freight\JobController::class, 'requestReassignment']);

    // ── Directories ─────────────────────────────────────────────────────────
    // Tenant-wide, NOT branch-scoped: customers.branch_id is an advisory managing
    // branch, not an isolation boundary (PRD.md §1.2).
    Route::get('/customers', [\App\Http\Controllers\Freight\CustomerController::class, 'index']);
    Route::post('/customers', [\App\Http\Controllers\Freight\CustomerController::class, 'store']);
    Route::get('/customers/{customer}/group', [\App\Http\Controllers\Freight\CustomerController::class, 'group']);

    Route::get('/partners', [\App\Http\Controllers\Freight\PartnerController::class, 'index']);
    Route::post('/partners', [\App\Http\Controllers\Freight\PartnerController::class, 'store']);
    Route::get('/partner-types', [\App\Http\Controllers\Freight\PartnerController::class, 'types']);

    // ── Financial (guide §5.3) ──────────────────────────────────────────────
    // ── Customs (§5.4). Tactical, because a manifest is operational work, not a
    // Command-tier report — a Tactical branch still files with customs.
    Route::get('/manifest-filings', [\App\Http\Controllers\Freight\ManifestFilingController::class, 'index']);
    // A DRY RUN. Read-only and open to everyone who may view the manifest.
    Route::get('/jobs/{job}/manifest-check', [\App\Http\Controllers\Freight\ManifestFilingController::class, 'check']);
    Route::post('/jobs/{job}/manifest-filings', [\App\Http\Controllers\Freight\ManifestFilingController::class, 'store']);

    // 🔒 Gated per action, not per group: viewFinancials admits boss read-only, while
    // finalizeInvoice and postLedger are `accounts` ONLY — not even the Boss. The role
    // that sets targets must not book the revenue those targets are measured in.
    // `tier:command` because below Command there is no ledger to run.
    Route::middleware('tier:command')->group(function () {
        Route::get('/invoices', [\App\Http\Controllers\Freight\InvoiceController::class, 'index']);
        Route::post('/invoices/{invoice}/finalize', [\App\Http\Controllers\Freight\InvoiceController::class, 'finalize']);
        Route::post('/invoices/{invoice}/post', [\App\Http\Controllers\Freight\InvoiceController::class, 'post']);
        // The journal the post WILL write. `viewFinancials`, so the Boss can read the
        // consequence of a posting they are not allowed to perform.
        Route::get('/invoices/{invoice}/posting-preview', [\App\Http\Controllers\Freight\InvoiceController::class, 'postingPreview']);
        Route::get('/customers/{customer}/credit', [\App\Http\Controllers\Freight\InvoiceController::class, 'creditStanding']);

        // ── The buy side. Same segregation: viewFinancials reads, postLedger commits.
        Route::get('/vouchers', [\App\Http\Controllers\Freight\PurchaseVoucherController::class, 'index']);
        Route::get('/vouchers/{voucher}/posting-preview', [\App\Http\Controllers\Freight\PurchaseVoucherController::class, 'postingPreview']);
        Route::post('/vouchers/{voucher}/post', [\App\Http\Controllers\Freight\PurchaseVoucherController::class, 'post']);

        // ── Bank reconciliation. `reconcile` is accounts-only; the Boss reads only.
        Route::get('/reconciliation', [\App\Http\Controllers\Freight\ReconciliationController::class, 'index']);
        Route::get('/reconciliation/{transaction}/candidates', [\App\Http\Controllers\Freight\ReconciliationController::class, 'candidates']);
        Route::post('/reconciliation/{transaction}/match', [\App\Http\Controllers\Freight\ReconciliationController::class, 'match']);
        Route::post('/reconciliation/{transaction}/unmatch', [\App\Http\Controllers\Freight\ReconciliationController::class, 'unmatch']);
    });
});
