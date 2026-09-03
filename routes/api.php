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
    // 🔒 The single point at which an OCR credit is ever spent — see OcrController::consent.
    Route::post('/ocr-consent/{jobId}', [OcrController::class, 'consent']);

    // ── Mailbox connections (guide §4.2) ─────────────────────────────────────
    // The callback is registered OUTSIDE this group — it has no bearer token.
    Route::get('/mailboxes', [\App\Http\Controllers\Freight\MailboxController::class, 'index']);
    Route::post('/mailboxes/connect', [\App\Http\Controllers\Freight\MailboxController::class, 'connect']);
    Route::post('/mailboxes/{mailbox}/disconnect', [\App\Http\Controllers\Freight\MailboxController::class, 'disconnect']);
    Route::post('/mailboxes/{mailbox}/sync', [\App\Http\Controllers\Freight\MailboxController::class, 'syncNow']);

    // ── Document share links ─────────────────────────────────────────────────
    Route::get('/documents/{document}/links', [\App\Http\Controllers\Freight\DocumentShareController::class, 'index']);
    Route::post('/documents/{document}/share', [\App\Http\Controllers\Freight\DocumentShareController::class, 'create']);
    Route::post('/share-links/{link}/revoke', [\App\Http\Controllers\Freight\DocumentShareController::class, 'revoke']);
    Route::post('/get-airport-by-airport-code', [AirwayBillController::class, 'get_airport_by_airport_code']);
    Route::get('/company-templates', [UserController::class, 'getCompanyTemplates']);

    // Address Book Management
    Route::get('/saved-addresses', [AddressBookController::class, 'index']);
    Route::put('/saved-addresses/{id}', [AddressBookController::class, 'update']);
});

// ── Platform monitoring & support desk (§5.6) ───────────────────────────────
// 🔒 superadmin ONLY — F16s's own staff, not a client's Boss. Those are different
// portals precisely so this surface is unreachable from a tenant login.
Route::group(['middleware' => 'auth:superAdmin-api', 'prefix' => 'admin'], function () {
    Route::get('/health', [\App\Http\Controllers\Platform\AdminHealthController::class, 'health']);
    Route::get('/logs', [\App\Http\Controllers\Platform\AdminHealthController::class, 'logs']);
    Route::get('/classification-overrides/export', [\App\Http\Controllers\Platform\AdminHealthController::class, 'classificationOverrides']);

    Route::get('/tickets', [\App\Http\Controllers\Platform\SupportTicketController::class, 'index']);
    Route::get('/tickets/{ticket}', [\App\Http\Controllers\Platform\SupportTicketController::class, 'show']);
    Route::patch('/tickets/{ticket}', [\App\Http\Controllers\Platform\SupportTicketController::class, 'update']);
});

// =================superAdmin section==========================
//superAdmin login and register
Route::post('superadmin/register', [SuperAdminController::class, 'register']);
Route::group(['middleware' => 'auth:superAdmin-api', 'prefix' => 'superadmin'], function () {

    // ── The platform's shared domain directory (guide §5.6) ──────────────────
    // 🔴 Nothing the platform LEARNS applies itself. One wrong entry misfiles mail for
    // every tenant at once, and the tenant it hurts cannot see why — so approval is a
    // decision a person makes with the evidence in front of them.
    Route::get('/domain-directory', [\App\Http\Controllers\Platform\DomainDirectoryController::class, 'index']);
    Route::post('/domain-directory/{id}/approve', [\App\Http\Controllers\Platform\DomainDirectoryController::class, 'approve']);
    Route::post('/domain-directory/{id}/reject', [\App\Http\Controllers\Platform\DomainDirectoryController::class, 'reject']);
    Route::post('/domain-directory/promote', [\App\Http\Controllers\Platform\DomainDirectoryController::class, 'promote']);

    // ── The platform airline list (prefix · name · domain) ───────────────────
    // Reference data curated by F16s: `176` is Emirates whoever is looking, so no tenant
    // should be re-keying it — and a mistyped prefix is a waybill filed under the wrong
    // airline.
    Route::get('/airlines', [\App\Http\Controllers\Platform\AirlineDirectoryController::class, 'index']);
    Route::post('/airlines', [\App\Http\Controllers\Platform\AirlineDirectoryController::class, 'store']);
    Route::put('/airlines/{airline}', [\App\Http\Controllers\Platform\AirlineDirectoryController::class, 'update']);
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

// 🔴 UNAUTHENTICATED BY NECESSITY. Microsoft redirects a BROWSER here with no
// Authorization header, so the acting user is carried in `state` — a random key into a
// short-lived cache entry, consumed on use. See MailboxController::callback.
Route::get('/user/mailboxes/callback', [\App\Http\Controllers\Freight\MailboxController::class, 'callback']);

// ── Public document links (guide §5.4) ───────────────────────────────────────
// 🔴 UNAUTHENTICATED BY DESIGN — the client is not a system user, and the 48-character
// token IS the boundary. Rate-limited because an unauthenticated route that reads a token
// is the one place a stranger can guess at. Every refusal is the same 404: distinguishing
// expired from revoked from never-existed tells a prober which tokens were once real.
Route::middleware('throttle:30,1')->group(function () {
    Route::get('/d/{token}', [\App\Http\Controllers\Freight\DocumentShareController::class, 'download']);
    Route::post('/d/{token}/respond', [\App\Http\Controllers\Freight\DocumentShareController::class, 'respond']);
});
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
    // The cross-staff clearance matrix. 🔒 pricing/boss only — PRD §9.4 says the
    // matrix is ABSENT for operations, not disabled.
    // The handover lifecycle. Operations ASKS; pricing or boss ANSWERS; only the
    // requester may withdraw. Each ending dissolves the bell row rather than
    // marking it resolved — see BellNotificationService.
    Route::post('/jobs/{job}/reassign/withdraw', [\App\Http\Controllers\Freight\JobController::class, 'withdrawReassignment']);
    Route::post('/jobs/{job}/reassign/resolve', [\App\Http\Controllers\Freight\JobController::class, 'resolveReassignment']);

    // The bell itself.
    Route::get('/notifications', [\App\Http\Controllers\Freight\NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\Freight\NotificationController::class, 'markRead']);

    Route::get('/jobs/staff-load', [\App\Http\Controllers\Freight\JobController::class, 'staffLoad']);
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
    // Partners a sibling branch already has — name and address only, never their GSTIN.
    Route::get('/partners/siblings', [\App\Http\Controllers\Freight\PartnerController::class, 'siblings']);
    Route::get('/partner-types', [\App\Http\Controllers\Freight\PartnerController::class, 'types']);

    // ── Financial (guide §5.3) ──────────────────────────────────────────────
    // ── Support reporting (§5.6). The REPORTER is an ordinary tenant user
    // (PRD.md §5.10); only the desk that works the queue is superadmin-only.
    Route::post('/tickets', [\App\Http\Controllers\Platform\SupportTicketController::class, 'store']);

    // ── Triage (§5.1). Threads, never individual messages: a conversation is the
    // unit of work, and classifying one message of five mints a second enquiry.
    Route::get('/inbox/threads', [\App\Http\Controllers\Freight\EmailInboxController::class, 'index']);
    Route::get('/inbox/threads/{thread}', [\App\Http\Controllers\Freight\EmailInboxController::class, 'show']);
    Route::post('/inbox/threads/{thread}/classify', [\App\Http\Controllers\Freight\EmailInboxController::class, 'classify']);
    Route::post('/inbox/threads/{thread}/claim', [\App\Http\Controllers\Freight\EmailInboxController::class, 'claim']);

    // ── Analytics (§5.5). 🔴 Every endpoint reads the funnel views and the engine
    // tables. NOTHING here aggregates `jobs` or `enquiries` live — PRD.md §2242.
    Route::get('/analytics/funnel', [\App\Http\Controllers\Freight\AnalyticsController::class, 'funnel']);

    // The sales cockpit. Tactical reports at branch level with NO client attribution;
    // Command partitions the same numbers by customers.sales_id. That gap is the upsell.
    Route::get('/sales/dashboard', [\App\Http\Controllers\Freight\SalesDashboardController::class, 'dashboard']);
    // Cross-branch, cross-mode — the Boss view. Crosses both partitions the rest of
    // the product maintains, and is still tenant-bound.
    Route::get('/sales/branches', [\App\Http\Controllers\Freight\SalesDashboardController::class, 'branches']);
    Route::get('/sales/charts', [\App\Http\Controllers\Freight\SalesDashboardController::class, 'charts']);
    Route::get('/sales/actions', [\App\Http\Controllers\Freight\SalesDashboardController::class, 'actions']);
    Route::get('/sales/accounts', [\App\Http\Controllers\Freight\SalesDashboardController::class, 'accounts']);

    // ── The Job Cost Sheet (§6.7). Tactical, because a cost sheet is operational
    // pricing work — the LEDGER it eventually feeds is what needs Command.
    // 🔴 Nothing here writes to a manifest table: rates move, declarations do not.
    Route::get('/jobs/{job}/cost-sheet', [\App\Http\Controllers\Freight\JobCostSheetController::class, 'show']);
    Route::post('/jobs/{job}/cost-sheet/lines', [\App\Http\Controllers\Freight\JobCostSheetController::class, 'storeLine']);
    Route::delete('/jobs/{job}/cost-sheet/{side}/{lineId}', [\App\Http\Controllers\Freight\JobCostSheetController::class, 'destroyLine']);

    // ── FocusSea (§5.8). The cargo-type matrix and ISO 6346 are enforced here,
    // not in the Vue watcher — see SeaShipmentController.
    Route::get('/jobs/{job}/sea-shipment', [\App\Http\Controllers\Freight\SeaShipmentController::class, 'show']);
    Route::post('/jobs/{job}/sea-shipment', [\App\Http\Controllers\Freight\SeaShipmentController::class, 'save']);

    // ── Consolidation (§5.8). The routing cascade and the piece reconciliation are
    // customs concerns, not display ones — see ConsolidationService.
    Route::get('/jobs/unassociated', [\App\Http\Controllers\Freight\ConsolidationController::class, 'unassociated']);
    Route::get('/jobs/{master}/consol', [\App\Http\Controllers\Freight\ConsolidationController::class, 'show']);
    Route::post('/jobs/{master}/link-hbl', [\App\Http\Controllers\Freight\ConsolidationController::class, 'link']);
    Route::delete('/jobs/{master}/link-hbl/{house}', [\App\Http\Controllers\Freight\ConsolidationController::class, 'unlink']);
    Route::post('/jobs/{master}/stuff', [\App\Http\Controllers\Freight\ConsolidationController::class, 'stuff']);

    // ── Parties on a shipment (§5.8 tab 1). The HBL/MBL mapping is enforced here:
    // the same role means a DIFFERENT company on each document.
    Route::get('/jobs/{job}/entities', [\App\Http\Controllers\Freight\JobEntityController::class, 'index']);
    Route::post('/jobs/{job}/entities', [\App\Http\Controllers\Freight\JobEntityController::class, 'store']);
    Route::delete('/jobs/{job}/entities/{entityId}', [\App\Http\Controllers\Freight\JobEntityController::class, 'destroy']);

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
        // ── Financial reports (§6.8). Strict period lockout: a report runs over a
        // PERIOD, never a free date range — half a period is a number nobody can
        // reconcile against anything they have filed.
        Route::get('/reports/periods', [\App\Http\Controllers\Freight\FinancialReportController::class, 'periods']);
        Route::get('/reports/profit-and-loss', [\App\Http\Controllers\Freight\FinancialReportController::class, 'profitAndLoss']);
        Route::get('/reports/balance-sheet', [\App\Http\Controllers\Freight\FinancialReportController::class, 'balanceSheet']);
        Route::get('/reports/trial-balance', [\App\Http\Controllers\Freight\FinancialReportController::class, 'trialBalance']);

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
