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
// 🔒 No public sign-up: users are created by superadmin (/superadmin/create-user).
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
    // A short-lived signed link for a waybill PDF opened in a new tab (web routes `pdf.*`).
    Route::post('/pdf-link', \App\Http\Controllers\Logistics\PdfLinkController::class);

    //File Upload API
    Route::post('/upload-awb-file', [OcrController::class, 'extract'])->middleware('throttle:60,1');
    Route::get('/ocr-status/{jobId}', [OcrController::class, 'status']);
    Route::get('/ocr-history', [OcrController::class, 'history']);
    // Readings still running (or just finished), so the panel picks them up again (user, 2026-09-18).
    Route::get('/ocr-running', [OcrController::class, 'running']);
    // Removing a document deletes the file and what was read from it (user, 2026-09-18).
    Route::delete('/ocr-jobs/{jobId}', [OcrController::class, 'destroy'])->whereNumber('jobId');
    // Credits per document for the workspace (user, 2026-09-14): balance, rates, this month, recent.
    Route::get('/credits', [\App\Http\Controllers\Freight\CreditsController::class, 'index']);
    // 🔒 The single point at which an OCR credit is ever spent — see OcrController::consent.
    Route::post('/ocr-consent/{jobId}', [OcrController::class, 'consent']);

    // ── Mailbox connections (guide §4.2) ─────────────────────────────────────
    // The callback is registered OUTSIDE this group — it has no bearer token.
    Route::get('/mailboxes', [\App\Http\Controllers\Freight\MailboxController::class, 'index']);
    Route::post('/mailboxes/connect', [\App\Http\Controllers\Freight\MailboxController::class, 'connect']);
    Route::post('/mailboxes/{mailbox}/disconnect', [\App\Http\Controllers\Freight\MailboxController::class, 'disconnect']);
    Route::post('/mailboxes/{mailbox}/sync', [\App\Http\Controllers\Freight\MailboxController::class, 'syncNow']);
    Route::post('/mailboxes/{mailbox}/import', [\App\Http\Controllers\Freight\MailboxController::class, 'import']);
    Route::put('/mailboxes/{mailbox}/signature', [\App\Http\Controllers\Freight\MailboxController::class, 'updateSignature']);
    Route::post('/mailboxes/{mailbox}/signature-image', [\App\Http\Controllers\Freight\MailboxController::class, 'uploadSignatureImage']);
    Route::delete('/mailboxes/{mailbox}/signature-image', [\App\Http\Controllers\Freight\MailboxController::class, 'removeSignatureImage']);
    Route::put('/signature', [\App\Http\Controllers\Freight\MailboxController::class, 'updateMySignature']);
    // Your own name, as clients read it on the automated updates.
    Route::put('/profile', [\App\Http\Controllers\Freight\ProfileController::class, 'update']);
    Route::post('/mailbox-prompt/later', [\App\Http\Controllers\Freight\ProfileController::class, 'mailboxLater']);

    // ── Document share links ─────────────────────────────────────────────────
    // Render the waybill, store it, and file it as a job document — the step that makes
    // a share link possible at all. A streamed PDF persists nothing.
    Route::post('/documents/awb/{id}/publish', [\App\Http\Controllers\Generators\GenerateAwbPdfController::class, 'publish']);
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
    // How often the classifier was wrong and about what — the question the 5,000-row
    // export cannot answer.
    Route::get('/classification-failures', [\App\Http\Controllers\Platform\AdminHealthController::class, 'classificationFailures']);
    // How well the regex files mail, per company and period (user, 2026-09-17).
    Route::get('/mail-filing', [\App\Http\Controllers\Platform\MailFilingController::class, 'index']);
    // Clears the LEARNING RECORD once the rules have been changed. No mail is touched.
    Route::delete('/classification-overrides', [\App\Http\Controllers\Platform\AdminHealthController::class, 'purgeClassificationOverrides']);

    Route::get('/tickets', [\App\Http\Controllers\Platform\SupportTicketController::class, 'index']);
    Route::get('/tickets/{ticket}', [\App\Http\Controllers\Platform\SupportTicketController::class, 'show']);
    Route::patch('/tickets/{ticket}', [\App\Http\Controllers\Platform\SupportTicketController::class, 'update']);
    // The live chat on a `chat` ticket (Connect to Support Agent).
    Route::get('/tickets/{ticket}/messages', [\App\Http\Controllers\Platform\SupportTicketController::class, 'messages']);
    Route::post('/tickets/{ticket}/messages', [\App\Http\Controllers\Platform\SupportTicketController::class, 'reply']);
});

// =================superAdmin section==========================
// 🔒 No public superadmin sign-up — it created platform staff for anyone who asked.
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

    // ── What the hosted model costs (Gemma 4 on OpenRouter) ─────────────────
    // The month's spend against the budget, per customer and per user, and the per-user limit.
    Route::get('/ai-usage', [\App\Http\Controllers\Platform\AiUsageController::class, 'index']);
    // How reps respond to suggested client emails — sent, dismissed and why — to improve the suggestions.
    Route::get('/suggestion-feedback', [\App\Http\Controllers\Platform\SuggestionFeedbackController::class, 'index']);
    Route::put('/ai-usage/settings', [\App\Http\Controllers\Platform\AiUsageController::class, 'updateSettings']);
    // A company's monthly AI limit in ₹; null follows the plan (user, 2026-09-15).
    Route::put('/ai-usage/companies/{company}/limit', [\App\Http\Controllers\Platform\AiUsageController::class, 'updateCompanyLimit'])->whereNumber('company');

    // ── The help library the copilot answers from: one .md or .docx per page ──
    Route::get('/help-documents', [\App\Http\Controllers\Platform\HelpDocumentController::class, 'index']);
    Route::post('/help-documents', [\App\Http\Controllers\Platform\HelpDocumentController::class, 'store']);
    Route::post('/help-documents/{document}', [\App\Http\Controllers\Platform\HelpDocumentController::class, 'update']);
    Route::delete('/help-documents/{document}', [\App\Http\Controllers\Platform\HelpDocumentController::class, 'destroy']);
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
    Route::get('/companies/{company}/outlook-approval-link', [CompanyController::class, 'outlookApprovalLink'])->whereNumber('company');
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

    // The website's contact form submissions — read and deleted by F16s staff only.
    Route::get('/all-contacts', [ContactController::class, 'index']);
    Route::delete('/delete-contact/{id}', [ContactController::class, 'delete']);
    // OpenClaw blog actions waiting for approval.
    Route::get('/openclaw/pending', [\App\Http\Controllers\OpenClawController::class, 'getPendingActions']);
});

// 🔒 Sign-in and password reset are rate limited: they are where a stranger guesses.
Route::middleware('throttle:10,1')->group(function () {
Route::post('/Forgotpassword', [PasswordResetRequestController::class, 'sendEmail']);
Route::post('/check-forgot-token', [PasswordResetRequestController::class, 'check_token']);
Route::post('ForgotpasswordActual', [PasswordResetRequestController::class, 'forgot_password_actual']);

//common login
Route::post('/login', [LoginController::class, 'login']);
Route::post('/auth/login', [LoginController::class, 'login']);
Route::post('/contact', [ContactController::class, 'store']);
});

//gln response url
Route::post('/gln-response', [GLNResponseController::class, 'store'])->middleware('gln.token');

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

    // 🔴 The shell's context, for a page load that is not a login.
    //
    // `designation`, `tier` and `portal` reach the browser ONLY on the login response and
    // live in localStorage after that. Lose that entry — cleared storage, a new browser,
    // a token restored without it — and the rail has no idea who is looking at it: every
    // role-scoped item disappears and the user is left staring at a near-empty sidebar
    // while still perfectly authenticated. The context module's docblock has always said
    // "before /me returns"; this is that endpoint, finally built.
    Route::get('/me', [\App\Http\Controllers\Auth\LoginController::class, 'me']);

    // ── Pre-conversion ──────────────────────────────────────────────────────
    Route::get('/enquiries', [\App\Http\Controllers\Freight\EnquiryController::class, 'index']);
    Route::post('/enquiries', [\App\Http\Controllers\Freight\EnquiryController::class, 'store']);
    Route::post('/enquiries/{enquiry}/lost', [\App\Http\Controllers\Freight\EnquiryController::class, 'markLost']);
    Route::post('/enquiries/{enquiry}/pass', [\App\Http\Controllers\Freight\EnquiryController::class, 'pass']);
    Route::post('/enquiries/{enquiry}/reopen', [\App\Http\Controllers\Freight\EnquiryController::class, 'reopen']);
    // The ONLY path that creates a jobs row.
    Route::post('/enquiries/{enquiry}/convert', [\App\Http\Controllers\Freight\EnquiryController::class, 'convert']);
    // Commit the cargo the mail parser staged, once an operator has checked it.
    Route::patch('/enquiries/{enquiry}/cargo', [\App\Http\Controllers\Freight\EnquiryController::class, 'updateCargo']);

    // ── Post-conversion ─────────────────────────────────────────────────────
    Route::get('/jobs', [\App\Http\Controllers\Freight\JobController::class, 'index']);
    Route::put('/jobs/{job}/status', [\App\Http\Controllers\Freight\JobController::class, 'updateStatus']);
    // The waybill number the shipment is drafted on — it links the waybill to the job (user, 2026-09-18).
    Route::put('/jobs/{job}/awb-number', [\App\Http\Controllers\Freight\JobController::class, 'setAwbNumber']);
    Route::get('/jobs/{job}/tracking', [\App\Http\Controllers\Freight\JobController::class, 'tracking']);
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
    // Names of the branch's operators, for the workspace's operator dropdown.
    Route::get('/jobs/branch-operators', [\App\Http\Controllers\Freight\JobController::class, 'branchOperators']);
    Route::post('/jobs/{job}/reassign', [\App\Http\Controllers\Freight\JobController::class, 'reassign']);
    Route::post('/jobs/{job}/reassign/request', [\App\Http\Controllers\Freight\JobController::class, 'requestReassignment']);

    // ── Directories ─────────────────────────────────────────────────────────
    // Tenant-wide, NOT branch-scoped: customers.branch_id is an advisory managing
    // branch, not an isolation boundary (PRD.md §1.2).
    Route::get('/customers', [\App\Http\Controllers\Freight\CustomerController::class, 'index']);
    Route::post('/customers', [\App\Http\Controllers\Freight\CustomerController::class, 'store']);
    Route::put('/customers/{customer}', [\App\Http\Controllers\Freight\CustomerController::class, 'update']);
    Route::get('/customers/{customer}/contacts', [\App\Http\Controllers\Freight\CustomerController::class, 'contacts']);
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
    // The help copilot (PRD §5.10): answers from the uploaded help documents.
    Route::post('/help/ask', [\App\Http\Controllers\Freight\HelpController::class, 'ask']);
    // Connect to Support Agent: a chat ticket, and its messages (checked every 3 s while open).
    Route::post('/support/chats', [\App\Http\Controllers\Freight\SupportChatController::class, 'start']);
    Route::get('/support/chats/current', [\App\Http\Controllers\Freight\SupportChatController::class, 'current']);
    Route::get('/support/chats/{ticket}/messages', [\App\Http\Controllers\Freight\SupportChatController::class, 'messages']);
    Route::post('/support/chats/{ticket}/messages', [\App\Http\Controllers\Freight\SupportChatController::class, 'send']);

    // ── Triage (§5.1). Threads, never individual messages: a conversation is the
    // unit of work, and classifying one message of five mints a second enquiry.
    Route::get('/inbox/threads', [\App\Http\Controllers\Freight\EmailInboxController::class, 'index']);
    Route::post('/inbox/compose', [\App\Http\Controllers\Freight\EmailInboxController::class, 'compose']);
    Route::get('/inbox/threads/{thread}', [\App\Http\Controllers\Freight\EmailInboxController::class, 'show']);
    Route::get('/inbox/messages/{message}/body', [\App\Http\Controllers\Freight\EmailInboxController::class, 'messageBody']);
    Route::get('/inbox/attachments/{attachment}', [\App\Http\Controllers\Freight\EmailAttachmentController::class, 'show']);
    Route::post('/inbox/threads/{thread}/classify', [\App\Http\Controllers\Freight\EmailInboxController::class, 'classify']);
    Route::post('/inbox/threads/{thread}/claim', [\App\Http\Controllers\Freight\EmailInboxController::class, 'claim']);
    Route::post('/inbox/threads/{thread}/assign', [\App\Http\Controllers\Freight\EmailInboxController::class, 'assign']);
    Route::get('/inbox/threads/{thread}/assignees', [\App\Http\Controllers\Freight\EmailInboxController::class, 'assignees']);
    Route::get('/inbox/threads/{thread}/client-update/preview', [\App\Http\Controllers\Freight\EmailInboxController::class, 'previewClientUpdate']);
    Route::post('/inbox/threads/{thread}/client-update', [\App\Http\Controllers\Freight\EmailInboxController::class, 'decideClientUpdate']);
    // Reply, reply-all and forward are one endpoint — they differ only in the recipient
    // list the caller sends, which is the operator's decision and not the server's.
    Route::post('/inbox/threads/{thread}/reply', [\App\Http\Controllers\Freight\EmailInboxController::class, 'reply']);

    // ── Analytics (§5.5). 🔴 Every endpoint reads the funnel views and the engine
    // tables. NOTHING here aggregates `jobs` or `enquiries` live — PRD.md §2242.
    Route::get('/analytics/funnel', [\App\Http\Controllers\Freight\AnalyticsController::class, 'funnel']);

    // The sales cockpit. Tactical reports at branch level with NO client attribution;
    // Command partitions the same numbers by customers.sales_id. That gap is the upsell.
    Route::get('/sales/dashboard', [\App\Http\Controllers\Freight\SalesDashboardController::class, 'dashboard']);
    // Cross-branch, cross-mode — the Boss view. Crosses both partitions the rest of
    // the product maintains, and is still tenant-bound.
    Route::get('/sales/branches', [\App\Http\Controllers\Freight\SalesDashboardController::class, 'branches']);
    // The Boss's mails to his team, suggested from the figures (user, 2026-09-16).
    Route::get('/boss/mails', [\App\Http\Controllers\Freight\BossMailController::class, 'index']);
    Route::post('/boss/mails/{id}/draft', [\App\Http\Controllers\Freight\BossMailController::class, 'draft'])->whereNumber('id');
    Route::post('/boss/mails/{id}/send', [\App\Http\Controllers\Freight\BossMailController::class, 'send'])->whereNumber('id');
    Route::post('/boss/mails/{id}/dismiss', [\App\Http\Controllers\Freight\BossMailController::class, 'dismiss'])->whereNumber('id');
    // How each person is doing — the Boss's staff view (user, 2026-09-16).
    Route::get('/sales/staff', [\App\Http\Controllers\Freight\SalesDashboardController::class, 'staff']);
    // Monthly targets per branch and mode, set by the Boss (user, 2026-09-15).
    Route::get('/sales/targets', [\App\Http\Controllers\Freight\SalesTargetController::class, 'index']);
    Route::put('/sales/targets', [\App\Http\Controllers\Freight\SalesTargetController::class, 'update']);
    Route::get('/sales/charts', [\App\Http\Controllers\Freight\SalesDashboardController::class, 'charts']);
    Route::get('/sales/actions', [\App\Http\Controllers\Freight\SalesDashboardController::class, 'actions']);
    Route::get('/sales/accounts', [\App\Http\Controllers\Freight\SalesDashboardController::class, 'accounts']);
    // Client emails: findings from the client's own trends, drafted by Gemma, sent by the rep (PRD §7.3.7).
    // The Boss's view of the company's AI use against its limit (user, 2026-09-15).
    Route::get('/ai-usage/company', [\App\Http\Controllers\Freight\CompanyAiUsageController::class, 'show']);
    Route::get('/sales/outreach', [\App\Http\Controllers\Freight\SalesOutreachController::class, 'index']);
    Route::get('/sales/outreach/dismissed', [\App\Http\Controllers\Freight\SalesOutreachController::class, 'dismissed']);
    Route::post('/sales/outreach/{id}/draft', [\App\Http\Controllers\Freight\SalesOutreachController::class, 'draft'])->whereNumber('id');
    Route::post('/sales/outreach/{id}/send', [\App\Http\Controllers\Freight\SalesOutreachController::class, 'send'])->whereNumber('id');
    Route::post('/sales/outreach/{id}/dismiss', [\App\Http\Controllers\Freight\SalesOutreachController::class, 'dismiss'])->whereNumber('id');

    // ── The Job Cost Sheet (§6.7). Tactical, because a cost sheet is operational
    // pricing work — the LEDGER it eventually feeds is what needs Command.
    // 🔴 Nothing here writes to a manifest table: rates move, declarations do not.
    Route::get('/jobs/{job}/cost-sheet', [\App\Http\Controllers\Freight\JobCostSheetController::class, 'show']);
    Route::post('/jobs/{job}/cost-sheet/lines', [\App\Http\Controllers\Freight\JobCostSheetController::class, 'storeLine']);
    Route::put('/jobs/{job}/cost-sheet/{side}/{lineId}', [\App\Http\Controllers\Freight\JobCostSheetController::class, 'updateLine']);
    Route::delete('/jobs/{job}/cost-sheet/{side}/{lineId}', [\App\Http\Controllers\Freight\JobCostSheetController::class, 'destroyLine']);
    // Pricing hands the finished sheet to accounts; the screen confirms the figures first (user, 2026-09-18).
    Route::post('/jobs/{job}/cost-sheet/send', [\App\Http\Controllers\Freight\JobCostSheetController::class, 'sendToAccounts']);

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
        // 🔒 accounts alone: opening and closing a period is what lets anything be posted into it (user, 2026-09-18).
        Route::post('/reports/periods', [\App\Http\Controllers\Freight\FinancialReportController::class, 'openPeriod']);
        Route::post('/reports/periods/{period}/close', [\App\Http\Controllers\Freight\FinancialReportController::class, 'closePeriod']);
        Route::get('/reports/profit-and-loss', [\App\Http\Controllers\Freight\FinancialReportController::class, 'profitAndLoss']);
        Route::get('/reports/balance-sheet', [\App\Http\Controllers\Freight\FinancialReportController::class, 'balanceSheet']);
        Route::get('/reports/trial-balance', [\App\Http\Controllers\Freight\FinancialReportController::class, 'trialBalance']);

        Route::get('/customers/{customer}/credit', [\App\Http\Controllers\Freight\InvoiceController::class, 'creditStanding']);

        // ── The buy side. Same segregation: viewFinancials reads, postLedger commits.
        Route::get('/vouchers', [\App\Http\Controllers\Freight\PurchaseVoucherController::class, 'index']);
        // The registers accounts read: tax charged per document, and what has not reached the ledger (user, 2026-09-18).
        Route::get('/registers/gst', [\App\Http\Controllers\Freight\RegisterController::class, 'gst']);
        Route::get('/registers/unposted', [\App\Http\Controllers\Freight\RegisterController::class, 'unposted']);
        Route::get('/vouchers/{voucher}/posting-preview', [\App\Http\Controllers\Freight\PurchaseVoucherController::class, 'postingPreview']);
        Route::post('/vouchers/{voucher}/post', [\App\Http\Controllers\Freight\PurchaseVoucherController::class, 'post']);

        // ── Bank reconciliation. `reconcile` is accounts-only; the Boss reads only.
        // Settings → Finance: the chart of accounts and the rate cards (user, 2026-09-18).
        Route::get('/finance-settings', [\App\Http\Controllers\Freight\FinanceSettingsController::class, 'index']);
        Route::post('/finance-settings/accounts', [\App\Http\Controllers\Freight\FinanceSettingsController::class, 'saveAccount']);
        Route::post('/finance-settings/rate-cards', [\App\Http\Controllers\Freight\FinanceSettingsController::class, 'saveRateCard']);
        Route::delete('/finance-settings/rate-cards/{id}', [\App\Http\Controllers\Freight\FinanceSettingsController::class, 'destroyRateCard'])->whereNumber('id');

        // ── Ageing and collections (user, 2026-09-20): who owes what, for how long, and what has been done.
        Route::get('/ageing', [\App\Http\Controllers\Freight\CollectionsController::class, 'ageing']);
        Route::get('/ageing/export', [\App\Http\Controllers\Freight\CollectionsController::class, 'export']);
        Route::get('/ageing/{partyType}/{partyId}', [\App\Http\Controllers\Freight\CollectionsController::class, 'party'])->whereNumber('partyId');
        Route::post('/ageing/{partyType}/{partyId}/draft-chase', [\App\Http\Controllers\Freight\CollectionsController::class, 'draftChase'])->whereNumber('partyId');
        Route::get('/collections', [\App\Http\Controllers\Freight\CollectionsController::class, 'queue']);
        Route::post('/collections/follow-ups', [\App\Http\Controllers\Freight\CollectionsController::class, 'logFollowUp']);
        Route::post('/collections/follow-ups/{id}/close', [\App\Http\Controllers\Freight\CollectionsController::class, 'closeFollowUp'])->whereNumber('id');

        // ── The billing desk (user, 2026-09-19). One register over the five sales documents, plus receipts,
        // multiple bill printing, data export and the e-invoice register.
        Route::get('/billing', [\App\Http\Controllers\Freight\BillingController::class, 'index']);
        Route::get('/billing/export', [\App\Http\Controllers\Freight\BillingController::class, 'export']);
        Route::post('/billing/print', [\App\Http\Controllers\Freight\BillingController::class, 'print']);
        Route::post('/billing/mail', [\App\Http\Controllers\Freight\BillingController::class, 'mail']);
        Route::post('/billing/documents', [\App\Http\Controllers\Freight\BillingController::class, 'store']);
        Route::get('/billing/e-invoice', [\App\Http\Controllers\Freight\BillingController::class, 'eInvoice']);
        Route::post('/billing/{id}/irn', [\App\Http\Controllers\Freight\BillingController::class, 'recordIrn'])->whereNumber('id');
        Route::get('/billing/{id}/credit-room', [\App\Http\Controllers\Freight\BillingController::class, 'creditRoom'])->whereNumber('id');
        // One document, opened: header, lines, notes against it, receipts, and the journal it would post.
        Route::get('/billing/{id}', [\App\Http\Controllers\Freight\BillingController::class, 'show'])->whereNumber('id');
        Route::put('/billing/{id}', [\App\Http\Controllers\Freight\BillingController::class, 'update'])->whereNumber('id');
        Route::post('/billing/{id}/void', [\App\Http\Controllers\Freight\BillingController::class, 'void'])->whereNumber('id');
        Route::post('/billing/{id}/lines', [\App\Http\Controllers\Freight\BillingController::class, 'storeLine'])->whereNumber('id');
        Route::put('/billing/{id}/lines/{lineId}', [\App\Http\Controllers\Freight\BillingController::class, 'updateLine'])->whereNumber('id');
        Route::delete('/billing/{id}/lines/{lineId}', [\App\Http\Controllers\Freight\BillingController::class, 'destroyLine'])->whereNumber('id');

        Route::get('/receipts', [\App\Http\Controllers\Freight\ReceiptController::class, 'index']);
        Route::get('/receipts/open-documents', [\App\Http\Controllers\Freight\ReceiptController::class, 'openDocuments']);
        Route::post('/receipts', [\App\Http\Controllers\Freight\ReceiptController::class, 'store']);
        Route::get('/receipts/{id}/posting-preview', [\App\Http\Controllers\Freight\ReceiptController::class, 'postingPreview'])->whereNumber('id');
        Route::post('/receipts/{id}/post', [\App\Http\Controllers\Freight\ReceiptController::class, 'post'])->whereNumber('id');

        // Supplier statements — airlines (CASS), truckers, brokers, anyone we owe (user, 2026-09-19).
        Route::get('/vendor-statements', [\App\Http\Controllers\Freight\VendorStatementController::class, 'index']);
        Route::post('/vendor-statements', [\App\Http\Controllers\Freight\VendorStatementController::class, 'import']);
        Route::get('/vendor-statements/{id}', [\App\Http\Controllers\Freight\VendorStatementController::class, 'show'])->whereNumber('id');
        Route::post('/vendor-statements/{id}/compare', [\App\Http\Controllers\Freight\VendorStatementController::class, 'recompare'])->whereNumber('id');
        Route::post('/vendor-statements/{id}/lines/{lineId}/dispute', [\App\Http\Controllers\Freight\VendorStatementController::class, 'dispute'])->whereNumber('id');
        Route::post('/vendor-statements/{id}/draft-query', [\App\Http\Controllers\Freight\VendorStatementController::class, 'draftQuery'])->whereNumber('id');

        Route::get('/reconciliation', [\App\Http\Controllers\Freight\ReconciliationController::class, 'index']);
        Route::get('/reconciliation/{transaction}/candidates', [\App\Http\Controllers\Freight\ReconciliationController::class, 'candidates']);
        // What was credited against what was billed, and the mail that asks about it (user, 2026-09-19).
        Route::get('/reconciliation/differences', [\App\Http\Controllers\Freight\ReconciliationController::class, 'differences']);
        Route::post('/reconciliation/import', [\App\Http\Controllers\Freight\ReconciliationController::class, 'importStatement']);
        Route::post('/reconciliation/{transaction}/draft-query', [\App\Http\Controllers\Freight\ReconciliationController::class, 'draftQuery']);
        Route::post('/reconciliation/{transaction}/match', [\App\Http\Controllers\Freight\ReconciliationController::class, 'match']);
        Route::post('/reconciliation/{transaction}/unmatch', [\App\Http\Controllers\Freight\ReconciliationController::class, 'unmatch']);
    });
});
