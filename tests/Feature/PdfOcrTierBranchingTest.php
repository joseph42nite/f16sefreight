<?php

namespace Tests\Feature;

use App\Company;
use App\Jobs\ProcessPdfOcrJob;
use App\LlmUsageLog;
use App\PdfProcessingJob;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PdfOcrTierBranchingTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('pdf_temp');
    }

    public function testCoreTierExecutesStandardTemplateOCR()
    {
        // 1. Arrange: Create core tier company & user
        $company = Company::create([
            'name' => 'Viper Core Logistics',
            'tier' => 'viper_core',
        ]);

        $user = new User();
        $user->name = 'Core Operator';
        $user->email = 'core@test.com';
        $user->password = bcrypt('password');
        $user->company_name = $company->name;
        $user->can_send = true;
        $user->origin_airport_code = 'JFK';
        $user->save();

        // 2. Create pdf processing job
        $job = PdfProcessingJob::create([
            'user_id' => $user->id,
            'original_filename' => 'invoice.pdf',
            'temp_file_path' => 'temp_ocr_job_core.pdf',
            'document_type' => 'commercial_invoice',
            'status' => 'pending',
        ]);

        // Write a fake PDF file
        Storage::disk('pdf_temp')->put($job->temp_file_path, "%PDF-1.5\nfake content");

        // Mock Http to point to coordinate parser extract endpoint
        Http::fake([
            '*/extract' => Http::response([
                'shipper' => ['name' => 'Core Sender', 'address' => '123 Core St'],
                'consignee' => ['name' => 'Core Receiver', 'address' => '456 Receiver St']
            ], 200)
        ]);

        // 3. Act: Run the queue job synchronously
        $ocrJob = new ProcessPdfOcrJob($job->id);
        $ocrJob->handle();

        // 4. Assert: Correct HTTP endpoint called, job status completed, usage cost not logged
        Http::assertSent(function ($request) {
            return str_contains($request->url(), '/extract') && !str_contains($request->url(), '/extract-unstructured');
        });

        $job->refresh();
        $this->assertEquals('completed', $job->status);
        $this->assertEquals('Core Sender', $job->extracted_data['shipper']['name']);
        
        // Ensure no LLM usage logs since it falls back to coordinate parser
        $this->assertEquals(0, LlmUsageLog::count());
    }

    public function testTacticalTierExecutesGeminiUnstructuredOCR()
    {
        // 1. Arrange: Create tactical tier company & user
        $company = Company::create([
            'name' => 'Viper Tactical Logistics',
            'tier' => 'viper_tactical',
        ]);

        $user = new User();
        $user->name = 'Tactical Operator';
        $user->email = 'tactical@test.com';
        $user->password = bcrypt('password');
        $user->company_name = $company->name;
        $user->can_send = true;
        $user->origin_airport_code = 'JFK';
        $user->save();

        // 2. Create pdf processing job
        $job = PdfProcessingJob::create([
            'user_id' => $user->id,
            'original_filename' => 'invoice.pdf',
            'temp_file_path' => 'temp_ocr_job_tactical.pdf',
            'document_type' => 'commercial_invoice',
            'status' => 'pending',
        ]);

        // Write a fake PDF file
        Storage::disk('pdf_temp')->put($job->temp_file_path, "%PDF-1.5\nfake content");

        // Mock Http to point to unstructured extraction endpoint
        Http::fake([
            '*/extract-unstructured' => Http::response([
                'status' => 'success',
                'extracted_data' => [
                    'shipper_name' => ['value' => 'Tactical Exporter', 'confidence' => 'high'],
                    'consignee_name' => ['value' => 'Tactical Importer', 'confidence' => 'medium'],
                ],
                'tokens_in' => 1000,
                'tokens_out' => 500,
                'model' => 'gemini-1.5-flash'
            ], 200)
        ]);

        // 3. Act: Run the queue job synchronously
        $ocrJob = new ProcessPdfOcrJob($job->id);
        $ocrJob->handle();

        // 4. Assert: Correct HTTP endpoint called, job status completed, and cost logged
        Http::assertSent(function ($request) {
            return str_contains($request->url(), '/extract-unstructured');
        });

        $job->refresh();
        $this->assertEquals('completed', $job->status);
        $this->assertEquals('Tactical Exporter', $job->extracted_data['shipper_name']['value']);

        // Check LLM usage log
        $this->assertEquals(1, LlmUsageLog::count());
        $log = LlmUsageLog::first();
        $this->assertEquals('gemini-1.5-flash', $log->model);
        $this->assertEquals(1000, $log->tokens_in);
        $this->assertEquals(500, $log->tokens_out);
        
        // Cost should be: (1000 * 0.000000075) + (500 * 0.00000030) = 0.000075 + 0.000150 = 0.000225
        $this->assertEquals(0.000225, $log->cost_usd);
    }
}
