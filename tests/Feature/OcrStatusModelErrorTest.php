<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\PdfProcessingJob;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Why the model did not read a document, carried to the panel.
 *
 * 🔴 When the model cannot answer, the parser falls back to labels and records the reason
 * as `model_error`. Before this, a model that timed out and a model that read badly looked
 * identical on the card. The status endpoint is the only road from the parser to the panel,
 * so the reason has to come out of it.
 */
class OcrStatusModelErrorTest extends TestCase
{
    use DatabaseTransactions;

    private function user(): User
    {
        $company = Company::create([
            'name' => 'Status co', 'code' => 'OSM', 'tier' => 'tactical', 'ocr_credits_balance' => 0,
        ]);

        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'B', 'branch_code' => 'BOM']);

        return User::create([
            'name' => 'U', 'email' => 'status-model@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);
    }

    private function completed(User $user, array $extracted): PdfProcessingJob
    {
        return PdfProcessingJob::create([
            'user_id'           => $user->id,
            'original_filename' => 'invoice.pdf',
            'temp_file_path'    => null,
            'document_type'     => 'unstructured',
            'status'            => 'completed',
            'extraction_path'   => 'text',
            'extracted_data'    => $extracted,
        ]);
    }

    private function status(User $as, int $jobId)
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($as),
            'Accept' => 'application/json',
        ])->getJson("http://focusair.localhost/api/user/ocr-status/{$jobId}");
    }

    public function test_the_reason_the_model_did_not_read_reaches_the_panel(): void
    {
        $user = $this->user();
        $job = $this->completed($user, [
            'extraction_path' => 'text',
            'read_by'         => 'labels',
            'model_error'     => 'the model timed out after 600s',
        ]);

        $this->status($user, $job->id)
            ->assertOk()
            ->assertJsonPath('job_status', 'completed')
            ->assertJsonPath('model_error', 'the model timed out after 600s');
    }

    public function test_a_model_reading_carries_no_error(): void
    {
        $user = $this->user();
        $job = $this->completed($user, ['extraction_path' => 'text', 'read_by' => 'model']);

        $this->status($user, $job->id)
            ->assertOk()
            ->assertJsonPath('model_error', null);
    }
}
