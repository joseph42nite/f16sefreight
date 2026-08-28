<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\EmailMessage;
use App\Enquiry;
use App\Services\CargoDataPromotionService;
use App\Services\EnquirySequenceService;
use App\Services\RegexClassificationService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Step 4 services — the rules that live in code because nothing else can hold them.
 */
class CoreServicesTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Seq Co', 'code' => 'SEQ', 'tier' => 'command']);
        $this->branch = Agent::create([
            'company_id' => $this->company->id, 'agent_name' => 'Seq Branch', 'branch_code' => 'BOM',
        ]);
    }

    private function sequences(): EnquirySequenceService
    {
        return app(EnquirySequenceService::class);
    }

    // ─── Fiscal year ─────────────────────────────────────────────────────────

    /**
     * April 1st rollover for Indian GST. February 2027 must read 26, not 27 — the whole
     * reason fiscalYear() exists rather than date('y').
     */
    public function test_the_fiscal_year_rolls_on_april_first_not_january(): void
    {
        $service = $this->sequences();

        $this->assertSame('26', $service->fiscalYear(Carbon::parse('2026-04-01')), 'April 1st opens FY26.');
        $this->assertSame('26', $service->fiscalYear(Carbon::parse('2026-12-31')), 'December is still FY26.');
        $this->assertSame('26', $service->fiscalYear(Carbon::parse('2027-02-14')), 'February 2027 is STILL FY26.');
        $this->assertSame('26', $service->fiscalYear(Carbon::parse('2027-03-31')), 'March 31st closes FY26.');
        $this->assertSame('27', $service->fiscalYear(Carbon::parse('2027-04-01')), 'April 1st opens FY27.');
    }

    // ─── Number format ───────────────────────────────────────────────────────

    public function test_a_document_number_has_four_parts_and_names_its_tenant_and_branch(): void
    {
        $number = $this->sequences()->next($this->branch->id, 'ENQA', Carbon::parse('2026-08-28'));

        $this->assertSame('ENQA-SEQBOM-26-0001', $number);

        [$prefix, $agentCode, $fiscalYear, $sequence] = explode('-', $number);

        $this->assertSame('ENQA', $prefix);
        $this->assertSame('SEQBOM', $agentCode, 'companies.code + agents_info.branch_code, no inner separator.');
        $this->assertSame('26', $fiscalYear);
        $this->assertSame('0001', $sequence);
    }

    public function test_numbers_increment_within_a_scope_and_pad_to_four(): void
    {
        $service = $this->sequences();
        $at = Carbon::parse('2026-08-28');

        $this->assertSame('INV-SEQBOM-26-0001', $service->next($this->branch->id, 'INV', $at));
        $this->assertSame('INV-SEQBOM-26-0002', $service->next($this->branch->id, 'INV', $at));
        $this->assertSame('INV-SEQBOM-26-0003', $service->next($this->branch->id, 'INV', $at));
    }

    /** Air and sea count independently — four separate counters, not one shared. */
    public function test_each_prefix_counts_independently(): void
    {
        $service = $this->sequences();
        $at = Carbon::parse('2026-08-28');

        $service->next($this->branch->id, 'ENQA', $at);
        $service->next($this->branch->id, 'ENQA', $at);

        $this->assertSame('ENQS-SEQBOM-26-0001', $service->next($this->branch->id, 'ENQS', $at));
        $this->assertSame('JOBA-SEQBOM-26-0001', $service->next($this->branch->id, 'JOBA', $at));
    }

    /** Counters are per-branch, so two branches both issuing 0001 is correct. */
    public function test_two_branches_number_independently(): void
    {
        $other = Agent::create([
            'company_id' => $this->company->id, 'agent_name' => 'Seq Chennai', 'branch_code' => 'MAA',
        ]);

        $service = $this->sequences();
        $at = Carbon::parse('2026-08-28');

        $this->assertSame('INV-SEQBOM-26-0001', $service->next($this->branch->id, 'INV', $at));
        $this->assertSame('INV-SEQMAA-26-0001', $service->next($other->id, 'INV', $at));
    }

    /** Fiscal rollover resets the sequence to 0001. */
    public function test_the_counter_resets_at_the_fiscal_year_boundary(): void
    {
        $service = $this->sequences();

        $service->next($this->branch->id, 'INV', Carbon::parse('2027-03-31'));
        $this->assertSame('INV-SEQBOM-26-0002', $service->next($this->branch->id, 'INV', Carbon::parse('2027-03-31')));

        // One day later is a new fiscal year and a fresh counter.
        $this->assertSame('INV-SEQBOM-27-0001', $service->next($this->branch->id, 'INV', Carbon::parse('2027-04-01')));
    }

    // ─── Failing loudly rather than emitting a malformed number ──────────────

    /**
     * GAPS #2. Both code columns are nullable and were empty when introduced. A missing
     * code would silently produce `ENQA--26-0001`, and a document number is not something
     * to discover is wrong after it has reached a client or customs.
     */
    public function test_a_missing_branch_code_fails_loudly_instead_of_emitting_a_gap(): void
    {
        $codeless = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'No Code Branch']);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessageMatches('/branch_code/');

        $this->sequences()->next($codeless->id, 'INV');
    }

    public function test_a_missing_company_code_fails_loudly(): void
    {
        $codeless = Company::create(['name' => 'No Code Co', 'tier' => 'core']);
        $branch = Agent::create(['company_id' => $codeless->id, 'agent_name' => 'B', 'branch_code' => 'XXX']);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessageMatches('/companies\.code/');

        $this->sequences()->next($branch->id, 'INV');
    }

    /**
     * GAPS #8. `SELECT … FOR UPDATE` on a row that does not exist takes a GAP lock, and
     * two branches minting their first number of a fiscal year can deadlock on it. The
     * service inserts the row before locking, so the lock is always a plain row lock.
     */
    public function test_the_counter_row_exists_before_it_is_locked(): void
    {
        $this->sequences()->next($this->branch->id, 'CAN', Carbon::parse('2026-08-28'));

        $row = DB::table('sequence_counters')
            ->where('agent_id', $this->branch->id)->where('prefix', 'CAN')->where('fiscal_year', '26')
            ->first();

        $this->assertNotNull($row);
        $this->assertSame(1, (int) $row->current_value);
    }

    // ─── Classification ──────────────────────────────────────────────────────

    private function message(array $overrides = []): EmailMessage
    {
        return new EmailMessage(array_merge([
            'agent_id' => $this->branch->id, 'direction' => 'inbound',
            'from' => 'ops@globex.test', 'subject' => 'Quote request',
            'body_snippet' => '', 'is_historical' => false,
        ], $overrides));
    }

    /**
     * 🔴 The rule that protects the conversion denominator. A reply quoting the client's
     * own figures matches every extraction pattern; classifying it mints a second enquiry
     * for a conversation that already has one.
     */
    public function test_outbound_mail_is_never_classified(): void
    {
        $service = app(RegexClassificationService::class);

        $this->assertNull($service->classify($this->message(['direction' => 'outbound']), 'air'));
        $this->assertNotNull($service->classify($this->message(), 'air'));
    }

    /** Backfilled mail must not start clocks or propose enquiries. */
    public function test_historical_mail_is_never_classified(): void
    {
        $service = app(RegexClassificationService::class);

        $this->assertNull($service->classify($this->message(['is_historical' => true]), 'air'));
    }

    /**
     * A single unlabelled weight pattern records whichever number appears first — on the
     * figure that prices the shipment.
     */
    public function test_weights_are_extracted_by_label_not_by_position(): void
    {
        $cargo = app(RegexClassificationService::class)->extractCargo(
            'Gross weight 450 kg, chargeable weight 520 kg, 12 pcs',
            'air'
        );

        $this->assertSame(450.0, $cargo['gross_weight']['value']);
        $this->assertSame(520.0, $cargo['chargeable_weight']['value']);
        $this->assertSame(12, $cargo['pieces']['value']);
    }

    /** An unlabelled figure is still captured, but flagged for a human to check. */
    public function test_an_unlabelled_weight_is_stored_as_gross_with_low_confidence(): void
    {
        $cargo = app(RegexClassificationService::class)->extractCargo('Shipment of 300 kg', 'air');

        $this->assertSame(300.0, $cargo['gross_weight']['value']);
        $this->assertSame('low', $cargo['gross_weight']['confidence']);
    }

    public function test_volume_is_extracted_for_sea_only(): void
    {
        $service = app(RegexClassificationService::class);

        $this->assertArrayHasKey('volume_cbm', $service->extractCargo('48.75 CBM', 'sea'));
        $this->assertArrayNotHasKey('volume_cbm', $service->extractCargo('48.75 CBM', 'air'));
    }

    // ─── Cargo promotion ─────────────────────────────────────────────────────

    /**
     * 🔴 Monotonic. OCR is better than regex and worse than a human — a re-run must never
     * undo an operator's correction.
     */
    public function test_promotion_never_overwrites_operator_verified_cargo(): void
    {
        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-SEQBOM-26-0009',
            'extracted_weight' => 450.5, 'cargo_data_source' => 'verified',
        ]);

        $extraction = new \App\PdfProcessingJob([
            'enquiry_id' => $enquiry->id,
            'extracted_data' => ['gross_weight' => ['value' => 999.9, 'confidence' => 'high']],
        ]);

        $this->assertFalse(app(CargoDataPromotionService::class)->promote($extraction));
        $this->assertSame('450.500', $enquiry->fresh()->extracted_weight);
    }

    public function test_promotion_writes_over_regex_data_and_stamps_the_source(): void
    {
        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-SEQBOM-26-0010',
            'extracted_weight' => 450.5, 'cargo_data_source' => 'regex',
        ]);

        $extraction = new \App\PdfProcessingJob([
            'enquiry_id' => $enquiry->id,
            'extracted_data' => ['gross_weight' => ['value' => 512.8, 'confidence' => 'high']],
        ]);

        $this->assertTrue(app(CargoDataPromotionService::class)->promote($extraction));

        $fresh = $enquiry->fresh();
        $this->assertSame('512.800', $fresh->extracted_weight);
        $this->assertSame('ocr', $fresh->cargo_data_source);
        $this->assertNotNull($fresh->cargo_data_promoted_at);
    }

    /** Declared vs actual — the under-declaration signal. */
    public function test_variance_flags_above_twenty_percent_and_is_null_without_both_sides(): void
    {
        $service = app(CargoDataPromotionService::class);

        $enquiry = new Enquiry(['extracted_weight' => 450.0]);

        $this->assertFalse($service->shouldFlagVariance($enquiry, 500.0)); // +11%
        $this->assertTrue($service->shouldFlagVariance($enquiry, 600.0));  // +33%
        $this->assertNull($service->variance($enquiry, null), 'A missing side is not a zero variance.');
        $this->assertNull($service->variance(new Enquiry(['extracted_weight' => 0]), 500.0));
    }
}
