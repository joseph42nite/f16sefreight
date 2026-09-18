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

    /** A shipment's own readings come back in full after a refresh, however long ago they were read (user, 2026-09-18). */
    public function test_a_shipments_readings_come_back_after_a_refresh(): void
    {
        $company = \App\Company::create(['name' => 'Keep Co', 'code' => 'KEP', 'tier' => 'tactical']);
        $branch = \App\Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $user = \App\User::create(['name' => 'P', 'email' => 'p-kep@test.local', 'password' => \Illuminate\Support\Facades\Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $enquiry = \App\Enquiry::create(['agent_id' => $branch->id, 'transport_mode' => 'air', 'status' => 'converted', 'enquiry_no' => 'ENQA-KEPBOM-26-0001']);
        $job = \App\Job::create(['agent_id' => $branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air', 'execution_job_no' => 'JOBA-KEPBOM-26-0001']);
        $other = \App\Job::create(['agent_id' => $branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air', 'execution_job_no' => 'JOBA-KEPBOM-26-0002']);

        $read = function ($jobId, string $name, $created) use ($user) {
            $row = PdfProcessingJob::create(['user_id' => $user->id, 'original_filename' => $name, 'temp_file_path' => uniqid() . '.pdf',
                'document_type' => 'unstructured', 'status' => 'completed', 'job_id' => $jobId]);
            $row->forceFill(['created_at' => $created, 'completed_at' => $created])->saveQuietly();
        };
        $read($job->id, 'invoice.pdf', now()->subHours(6));       // read hours ago: still this shipment's
        $read($job->id, 'packing-list.pdf', now()->subDays(2));
        $read($job->id, 'ancient.pdf', now()->subDays(9));        // older than a week: left out
        $read($other->id, 'another-shipment.pdf', now()->subHour());

        $names = collect($this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user), 'Accept' => 'application/json'])
            ->getJson("http://focusair.localhost/api/user/ocr-running?job_id={$job->id}")->assertOk()->json('data'))->pluck('original_filename');

        $this->assertSame(['packing-list.pdf', 'invoice.pdf'], $names->all());
    }

    /** Removing a document deletes the file and what was read from it, and it never comes back (user, 2026-09-18). */
    public function test_removing_a_document_deletes_it_and_it_does_not_return(): void
    {
        \Illuminate\Support\Facades\Storage::fake('pdf_temp');
        $company = \App\Company::create(['name' => 'Gone Co', 'code' => 'GON', 'tier' => 'tactical']);
        $branch = \App\Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $mine = \App\User::create(['name' => 'P', 'email' => 'p-gon@test.local', 'password' => \Illuminate\Support\Facades\Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $theirs = \App\User::create(['name' => 'Q', 'email' => 'q-gon@test.local', 'password' => \Illuminate\Support\Facades\Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $enquiry = \App\Enquiry::create(['agent_id' => $branch->id, 'transport_mode' => 'air', 'status' => 'converted', 'enquiry_no' => 'ENQA-GONBOM-26-0001']);
        $job = \App\Job::create(['agent_id' => $branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air', 'execution_job_no' => 'JOBA-GONBOM-26-0001']);

        \Illuminate\Support\Facades\Storage::disk('pdf_temp')->put('invoice.pdf', '%PDF');
        $reading = PdfProcessingJob::create(['user_id' => $mine->id, 'original_filename' => 'invoice.pdf', 'temp_file_path' => 'invoice.pdf',
            'document_type' => 'unstructured', 'status' => 'completed', 'job_id' => $job->id, 'extracted_data' => ['shipper' => ['name' => 'Globex']]]);

        $api = fn (\App\User $u) => $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);

        // Somebody else's document is not theirs to delete.
        $api($theirs)->deleteJson("http://focusair.localhost/api/user/ocr-jobs/{$reading->id}")->assertNotFound();

        $api($mine)->deleteJson("http://focusair.localhost/api/user/ocr-jobs/{$reading->id}")->assertOk();

        \Illuminate\Support\Facades\Storage::disk('pdf_temp')->assertMissing('invoice.pdf');
        $this->assertNull($reading->fresh()->extracted_data, 'what was read from it is gone');
        $this->assertSame('dismissed', $reading->fresh()->status);
        $this->assertSame([], $this->getJson("http://focusair.localhost/api/user/ocr-running?job_id={$job->id}")->assertOk()->json('data'));
    }
}
