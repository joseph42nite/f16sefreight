<?php

namespace Tests\Feature;

use App\AccountsInvoice;
use App\AccountsInvoiceItem;
use App\Agent;
use App\AirShipmentDetail;
use App\Company;
use App\Customer;
use App\CustomerContact;
use App\Enquiry;
use App\Enums\EnquiryStatus;
use App\Enums\JobStatus;
use App\Job;
use App\JobEntity;
use App\SeaShipmentDetail;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Step 2 invariants — the rules the DATABASE cannot express, so the models must.
 *
 * The database has no way to say "a job populates exactly one detail table", "a
 * converted enquiry can never be lost", or "these tokens are encrypted at rest". Those
 * are enforced in model boot() methods and observers, which means they can be deleted by
 * anyone editing the file. These assertions make that break loudly.
 */
class ModelInvariantsTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Invariant Co', 'code' => 'INV', 'tier' => 'command']);
        $this->branch = Agent::create([
            'company_id' => $this->company->id, 'agent_name' => 'Invariant Branch', 'branch_code' => 'IVB',
        ]);
    }

    private function enquiry(string $mode = 'air'): Enquiry
    {
        $prefix = ['air' => 'ENQA', 'sea' => 'ENQS', 'road' => 'ENQR'][$mode];

        return Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => $mode,
            'enquiry_no' => $prefix . '-INVIVB-26-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
        ]);
    }

    private function job(string $mode = 'air'): Job
    {
        return Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $this->enquiry($mode)->id,
            'transport_mode' => $mode,
        ]);
    }

    // ─── The mode invariant ──────────────────────────────────────────────────

    /** Checkpoint 2 names this one explicitly. */
    public function test_a_sea_job_returns_null_for_air_shipment_details(): void
    {
        $sea = $this->job('sea');
        SeaShipmentDetail::create(['job_id' => $sea->id, 'vessel_name' => 'MAERSK SELETAR']);

        $this->assertNotNull($sea->fresh()->seaShipmentDetails);
        $this->assertNull($sea->fresh()->airShipmentDetails);
    }

    public function test_an_air_job_returns_null_for_sea_shipment_details(): void
    {
        $air = $this->job('air');
        AirShipmentDetail::create(['job_id' => $air->id, 'flight_number' => 'LH761']);

        $this->assertNotNull($air->fresh()->airShipmentDetails);
        $this->assertNull($air->fresh()->seaShipmentDetails);
    }

    /** awb_number is air-only; a sea job with one produces a wrong customs document. */
    public function test_a_sea_job_cannot_carry_an_awb_number(): void
    {
        $sea = $this->job('sea');

        $this->expectException(\LogicException::class);
        $sea->update(['awb_number' => '176-12345678']);
    }

    public function test_air_details_cannot_be_attached_to_a_sea_job(): void
    {
        $sea = $this->job('sea');

        $this->expectException(\LogicException::class);
        AirShipmentDetail::create(['job_id' => $sea->id, 'flight_number' => 'LH761']);
    }

    /** Cross-field rule: dangerous goods need both the class and the UN number. */
    public function test_an_imdg_class_requires_a_un_number(): void
    {
        $sea = $this->job('sea');

        $this->expectException(\LogicException::class);
        SeaShipmentDetail::create(['job_id' => $sea->id, 'imdg_class' => '3']);
    }

    // ─── Conversion and loss ─────────────────────────────────────────────────

    /** Creating a job IS conversion — enforced in the observer, not a controller. */
    public function test_creating_a_job_converts_its_enquiry(): void
    {
        $enquiry = $this->enquiry();
        $this->assertSame(EnquiryStatus::New, $enquiry->status);

        Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
        ]);

        $this->assertSame(EnquiryStatus::Converted, $enquiry->fresh()->status);
    }

    /**
     * A converted enquiry cannot be lost. Allowing it would count one client request as
     * both a win and a loss, corrupting conversion rate and loss analysis at once.
     */
    public function test_a_converted_enquiry_cannot_be_marked_lost(): void
    {
        $enquiry = $this->enquiry();
        Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air']);

        $this->expectException(\LogicException::class);
        $enquiry->fresh()->update(['status' => EnquiryStatus::Lost]);
    }

    public function test_an_unconverted_enquiry_can_be_lost_and_stamps_lost_at(): void
    {
        $enquiry = $this->enquiry();
        $enquiry->update(['status' => EnquiryStatus::Lost, 'lost_reason' => 'rates_high']);

        $this->assertSame(EnquiryStatus::Lost, $enquiry->fresh()->status);
        $this->assertNotNull($enquiry->fresh()->lost_at);
    }

    /** Every status transition writes an SLA row — including the first. */
    public function test_a_job_logs_a_milestone_on_creation_and_on_each_transition(): void
    {
        $job = $this->job();

        $this->assertSame(
            [JobStatus::Intake->value],
            DB::table('milestone_performance_logs')->where('job_id', $job->id)->pluck('milestone_name')->all()
        );

        $job->update(['status' => JobStatus::Verification]);

        $this->assertSame(
            [JobStatus::Intake->value, JobStatus::Verification->value],
            DB::table('milestone_performance_logs')->where('job_id', $job->id)->pluck('milestone_name')->all()
        );
    }

    /** REGRESSION: model defaults must mirror the DB, or milestones log an empty name. */
    public function test_a_new_job_reports_its_status_without_a_refresh(): void
    {
        $this->assertSame(JobStatus::Intake, $this->job()->status);
        $this->assertSame(EnquiryStatus::New, $this->enquiry()->status);
    }

    // ─── Encryption at rest ──────────────────────────────────────────────────

    /**
     * GAPS #3. Removing these casts silently starts storing bank details in plaintext,
     * and existing rows then fail to decrypt.
     */
    public function test_customer_bank_details_are_encrypted_in_the_column(): void
    {
        $iban = 'GB98MIDL07009312345678901234567890';

        $customer = Customer::create([
            'company_id' => $this->company->id, 'name' => 'Globex', 'bank_account_no' => $iban,
        ]);

        $stored = DB::table('customers')->where('id', $customer->id)->value('bank_account_no');

        $this->assertNotSame($iban, $stored, 'The column must not hold plaintext.');
        $this->assertStringNotContainsString('MIDL', $stored);
        $this->assertSame($iban, $customer->fresh()->bank_account_no);
    }

    public function test_bank_details_never_appear_in_a_serialized_model(): void
    {
        $customer = Customer::create([
            'company_id' => $this->company->id, 'name' => 'Globex',
            'bank_account_no' => 'GB98MIDL07009312345678901234567890',
        ]);

        $this->assertArrayNotHasKey('bank_account_no', $customer->fresh()->toArray());
        $this->assertArrayNotHasKey('bank_ifsc_code', $customer->fresh()->toArray());
    }

    // ─── Morph map ───────────────────────────────────────────────────────────

    /**
     * Without the morph map Eloquent writes the fully-qualified class name, so renaming
     * or moving a class silently orphans every historical row.
     */
    public function test_the_party_morph_stores_a_short_key_not_a_class_name(): void
    {
        $customer = Customer::create(['company_id' => $this->company->id, 'name' => 'Globex']);
        $job = $this->job();

        JobEntity::create([
            'agent_id' => $this->branch->id, 'job_id' => $job->id,
            'party_type' => 'customer', 'party_id' => $customer->id, 'role' => 'shipper',
        ]);

        $stored = DB::table('job_entities')->where('job_id', $job->id)->value('party_type');

        $this->assertSame('customer', $stored);
        $this->assertInstanceOf(Customer::class, JobEntity::where('job_id', $job->id)->first()->party);
    }

    // ─── Scopes that carry a rule ────────────────────────────────────────────

    /** The client group is DERIVED from (company_id, email_domain) — no parent column. */
    public function test_the_client_group_scope_finds_every_branch_sharing_a_domain(): void
    {
        $mumbai = Customer::create(['company_id' => $this->company->id, 'name' => 'Globex Mumbai', 'email_domain' => 'globex.test']);
        Customer::create(['company_id' => $this->company->id, 'name' => 'Globex Chennai', 'email_domain' => 'globex.test']);
        Customer::create(['company_id' => $this->company->id, 'name' => 'Initech', 'email_domain' => 'initech.test']);

        $this->assertSame(2, $mumbai->scopeGroup(Customer::query())->count());
    }

    public function test_cc_eligible_excludes_opted_out_contacts(): void
    {
        $customer = Customer::create(['company_id' => $this->company->id, 'name' => 'Globex', 'email_domain' => 'globex.test']);

        CustomerContact::create(['company_id' => $this->company->id, 'customer_id' => $customer->id,
            'email' => 'ops@globex.test', 'include_in_cc' => true]);
        CustomerContact::create(['company_id' => $this->company->id, 'customer_id' => $customer->id,
            'email' => 'ceo@globex.test', 'include_in_cc' => true, 'opted_out_at' => now()]);

        $this->assertSame(
            ['ops@globex.test'],
            CustomerContact::where('customer_id', $customer->id)->ccEligible()->pluck('email')->all()
        );
    }

    /** Syncing requires all three conditions; any one alone is insufficient. */
    public function test_a_downgraded_mailbox_is_not_syncable_but_is_restorable(): void
    {
        $user = User::create([
            'name' => 'Asha', 'email' => 'asha-inv@test.local', 'password' => 'x',
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
        ]);

        $mailbox = \App\MailboxConnection::create([
            'agent_id' => $this->branch->id, 'user_id' => $user->id,
            'email_address' => 'asha-inv@test.local', 'provider' => 'google',
            'auth_state' => 'connected', 'is_active' => false, // tier downgrade
        ]);

        $this->assertSame(0, \App\MailboxConnection::whereKey($mailbox->id)->syncable()->count());
        $this->assertSame(1, \App\MailboxConnection::whereKey($mailbox->id)->restorableOnUpgrade()->count());

        // A mailbox the USER removed must NOT be restored by a tier upgrade.
        $mailbox->update(['disconnected_at' => now()]);

        $this->assertSame(0, \App\MailboxConnection::whereKey($mailbox->id)->restorableOnUpgrade()->count());
    }

    // ─── Margin ──────────────────────────────────────────────────────────────

    /** NULL, never -100: an unbilled job has no margin yet. */
    public function test_an_unbilled_job_has_a_null_margin_not_minus_one_hundred(): void
    {
        $this->assertNull($this->job()->grossMarginPct());
    }

    public function test_a_billed_job_computes_gross_margin(): void
    {
        $job = $this->job();
        $customer = Customer::create(['company_id' => $this->company->id, 'name' => 'Globex']);

        $invoice = AccountsInvoice::create([
            'agent_id' => $this->branch->id, 'job_id' => $job->id, 'customer_id' => $customer->id,
            'invoice_no' => 'INV-INVIVB-26-0001', 'type' => 'invoice',
            'document_date' => now(), 'grand_total' => 195880,
        ]);

        AccountsInvoiceItem::create([
            'invoice_id' => $invoice->id, 'charge_type' => 'air_freight', 'description' => 'Freight',
            'quantity' => 545, 'rate' => 300, 'amount' => 163500, 'net_amount' => 195880,
        ]);

        $vendor = \App\Partner::create([
            'company_id' => $this->company->id, 'name' => 'Lufthansa', 'partner_type' => 'airline',
        ]);

        $voucher = \App\AccountsPurchaseVoucher::create([
            'agent_id' => $this->branch->id, 'job_id' => $job->id, 'vendor_id' => $vendor->id,
            'voucher_no' => 'PV-INVIVB-26-0001', 'document_date' => now(),
        ]);

        \App\AccountsPurchaseItem::create([
            'purchase_voucher_id' => $voucher->id, 'charge_type' => 'air_freight',
            'description' => 'Airline net rate', 'quantity' => 545, 'rate' => 235,
            'amount' => 128075, 'net_amount' => 128075,
        ]);

        $this->assertSame(34.62, $job->grossMarginPct()); // matches the SQL verification in Batch 1c
    }
}
