<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Jobs\ProcessPdfOcrJob;
use App\PdfProcessingJob;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Reading a bill of lading into the sea form (guide Step 12.4): the parser gets the bill's own schema, and what it
 * read comes back in the form's own fields, each checked against §4.1.2 — never guessed, never truncated.
 */
class BlReadingTest extends TestCase
{
    use DatabaseTransactions;

    private User $ops;
    private Company $company;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Bill Co', 'code' => 'BLR', 'tier' => 'tactical', 'ocr_credits_balance' => 50]);
        $branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->ops = User::create(['name' => 'ops', 'email' => 'ops-blr@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $branch->id, 'designation' => 'operations', 'is_active' => 1]);
    }

    private function status(int $id): array
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->ops), 'Accept' => 'application/json'])
            ->getJson("http://focussea.f16sefreight.com/api/user/ocr-status/{$id}")->assertOk()->json();
    }

    public function test_a_read_bill_comes_back_in_the_sea_forms_fields_each_checked(): void
    {
        DB::table('ports')->insert(['locode' => 'INNSA', 'port_name' => 'NHAVA SHEVA', 'country_code' => 'IN', 'port_type' => 'sea',
            'is_active' => 1, 'created_at' => now(), 'updated_at' => now()]);
        $line = DB::table('partners')->insertGetId(['company_id' => $this->company->id, 'name' => 'MSC', 'partner_type' => 'shipping_line',
            'created_at' => now(), 'updated_at' => now()]);
        $client = DB::table('customers')->insertGetId(['company_id' => $this->company->id, 'name' => 'Northwind Exports Pvt Ltd',
            'created_at' => now(), 'updated_at' => now()]);

        $job = PdfProcessingJob::create(['user_id' => $this->ops->id, 'original_filename' => 'bl.pdf', 'temp_file_path' => 'x.pdf',
            'document_type' => 'bill_of_lading', 'status' => 'completed', 'extracted_data' => ['extraction_path' => 'text', 'bill' => [
                'bl_number' => 'MEDUBOM12345', 'vessel_name' => 'MSC ANNA', 'voyage_no' => '412W', 'carrier_name' => 'msc',
                'port_of_loading' => 'Nhava Sheva', 'port_of_discharge' => 'HAMBURG', 'hs_code' => '2932.99',
                'package_count' => 12, 'package_type' => 'PALLETS', 'gross_weight' => 4800.5, 'volume_cbm' => 22.4,
                'container_numbers' => 'MSCU1234566, TGHU7654321', 'seal_numbers' => '887766, 112233',
                'shipper_name' => 'NORTHWIND EXPORTS PVT LTD', 'consignee_name' => 'TO ORDER',
            ]]]);

        $bill = $this->status($job->id)['bill'];
        $field = collect($bill['fields'])->keyBy('key');

        $this->assertSame('MEDUBOM12345', $field['bl_number']['value']);
        $this->assertTrue($field['bl_number']['apply']);
        $this->assertSame($line, $field['carrier_id']['value'], 'the branch\'s shipping line of that name');
        $this->assertSame('INNSA', $field['pol_code']['value'], 'the one sea port the directory names so');
        $this->assertNull($field['pod_code']['value'], 'no port named HAMBURG in the directory — shown, not guessed');
        $this->assertFalse($field['pod_code']['apply']);
        $this->assertSame('293299', $field['hs_code']['value']);
        $this->assertNull($field['package_code']['value'], 'PALLETS is not a 3-letter code');
        $this->assertSame(12, $field['piece_count']['value']);

        $this->assertSame(['MSCU1234566', 'TGHU7654321'], array_column($bill['containers'], 'container_number'));
        $this->assertSame('887766', $bill['containers'][0]['seal_number']);
        $this->assertTrue($bill['containers'][0]['apply']);
        $this->assertFalse($bill['containers'][1]['apply'], 'TGHU7654321 fails its check digit');

        $parties = collect($bill['parties'])->keyBy('role');
        $this->assertSame(['party_type' => 'customer', 'party_id' => $client, 'name' => 'Northwind Exports Pvt Ltd'], $parties['shipper']['match']);
        $this->assertNull($parties['consignee']['match']);
    }

    /** The parser is told it is a bill, and the credit says what was read. */
    public function test_the_parser_is_asked_to_read_a_bill(): void
    {
        Storage::fake('pdf_temp');
        Storage::disk('pdf_temp')->put('bill.pdf', '%PDF-1.4');
        config(['services.ocr.url' => 'http://ocr.test']);
        Http::fake(['ocr.test/*' => Http::response(['extraction_path' => 'text', 'page_count' => 1, 'document' => 'bill', 'read_by' => 'model',
            'bill' => ['bl_number' => 'MEDUBOM12345'], 'model_usage' => ['model' => 'google/gemma-4-31b-it', 'tokens_in' => 900, 'tokens_out' => 120, 'cost_usd' => 0.0002]])]);

        $job = PdfProcessingJob::create(['user_id' => $this->ops->id, 'original_filename' => 'bl.pdf', 'temp_file_path' => 'bill.pdf',
            'document_type' => 'bill_of_lading', 'status' => 'pending']);

        (new ProcessPdfOcrJob($job->id))->handle(app(\App\Services\OcrRoutingService::class));

        Http::assertSent(fn ($request) => str_ends_with($request->url(), '/extract-unstructured')
            && collect($request->data())->contains(fn ($part) => ($part['name'] ?? null) === 'document_type' && ($part['contents'] ?? null) === 'bill_of_lading'));
        $this->assertSame('completed', $job->fresh()->status);
        $this->assertSame('Bill of lading read by AI', DB::table('ocr_credit_transactions')->where('pdf_processing_job_id', $job->id)->value('notes'));
    }
}
