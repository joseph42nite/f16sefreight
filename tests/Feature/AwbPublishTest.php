<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enquiry;
use App\Job;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/** Generating the waybill PDF files it against the shipment and moves it on, which readies the client's mail (2026-09-18). */
class AwbPublishTest extends TestCase
{
    use DatabaseTransactions;

    public function test_publishing_the_waybill_moves_the_shipment_to_pdf_generated(): void
    {
        Storage::fake('local');
        $company = Company::create(['name' => 'Pub Co', 'code' => 'PUB', 'tier' => 'tactical']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $user = User::create(['name' => 'Joseph', 'email' => 'joseph-pub@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $enquiry = Enquiry::create(['agent_id' => $branch->id, 'transport_mode' => 'air', 'status' => 'converted', 'enquiry_no' => 'ENQA-PUBBOM-26-0001']);
        $job = Job::create(['agent_id' => $branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-PUBBOM-26-0001', 'awb_number' => '176-99887766', 'status' => 'Intake']);

        DB::table('air_way_bills')->insert(['id' => 17699887766, 'awb_code' => '176', 'awb_no' => '99887766',
            'agent_id' => $branch->id, 'job_id' => $job->id, 'status' => 'draft', 'created_at' => now(), 'updated_at' => now()]);

        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user), 'Accept' => 'application/json'])
            ->postJson('http://focusair.localhost/api/user/documents/awb/17699887766/publish')
            ->assertCreated()->assertJsonPath('file_name', 'AWB-176-99887766.pdf');

        $this->assertSame('PDF Generated', DB::table('jobs')->where('id', $job->id)->value('status'));
        $this->assertDatabaseHas('job_documents', ['job_id' => $job->id, 'document_type' => 'awb']);

        // Already flying: publishing a corrected copy must not push it back to drafting.
        DB::table('jobs')->where('id', $job->id)->update(['status' => 'Sent to Airline']);
        $this->postJson('http://focusair.localhost/api/user/documents/awb/17699887766/publish')->assertCreated();
        $this->assertSame('Sent to Airline', DB::table('jobs')->where('id', $job->id)->value('status'));
    }
}
