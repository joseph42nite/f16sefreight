<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\PdfProcessingJob;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/** Reading a document runs on the server; the panel picks it up again after a tab change or a reload (user, 2026-09-18). */
class ExtractionResumesTest extends TestCase
{
    use DatabaseTransactions;

    public function test_running_and_just_finished_readings_come_back_and_only_the_owners(): void
    {
        $company = Company::create(['name' => 'Read Co', 'code' => 'RDC', 'tier' => 'tactical']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $user = fn (string $email) => User::create(['name' => 'U', 'email' => $email, 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $mine = $user('mine-rdc@test.local');
        $theirs = $user('theirs-rdc@test.local');

        $job = function (User $owner, string $status, string $name, $created = null, $completed = null) {
            $row = PdfProcessingJob::create(['user_id' => $owner->id, 'original_filename' => $name, 'temp_file_path' => uniqid() . '.pdf',
                'document_type' => 'unstructured', 'status' => $status]);

            return $row->forceFill(['created_at' => $created ?? now(), 'completed_at' => $completed])->saveQuietly() ? $row : $row;
        };
        $reading = $job($mine, 'processing', 'invoice.pdf');
        $justDone = $job($mine, 'completed', 'packing-list.pdf', now()->subMinutes(2), now()->subMinute());
        $job($mine, 'completed', 'old.pdf', now()->subHour(), now()->subMinutes(50));
        $job($mine, 'failed', 'broken.pdf');
        $job($mine, 'processing', 'yesterday.pdf', now()->subHours(5));
        $job($theirs, 'processing', 'not-mine.pdf');

        $names = collect($this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($mine), 'Accept' => 'application/json'])
            ->getJson('http://focusair.localhost/api/user/ocr-running')->assertOk()->json('data'))->pluck('original_filename');

        $this->assertSame(['invoice.pdf', 'packing-list.pdf'], $names->sort()->values()->all());
        $this->assertContains($reading->id, collect($this->getJson('http://focusair.localhost/api/user/ocr-running')->json('data'))->pluck('id'));
        $this->assertNotNull($justDone->fresh()->completed_at);
    }
}
