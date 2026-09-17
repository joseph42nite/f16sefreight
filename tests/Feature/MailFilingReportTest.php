<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\SuperAdmin;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/** Super admin → Mail filing: how the regex files mail and how often people change it (user, 2026-09-17). */
class MailFilingReportTest extends TestCase
{
    use DatabaseTransactions;

    public function test_changes_are_counted_against_what_the_regex_filed_per_company(): void
    {
        $company = Company::create(['name' => 'Filing Co', 'code' => 'FIL', 'tier' => 'tactical']);
        $other = Company::create(['name' => 'Elsewhere Co', 'code' => 'ELS', 'tier' => 'tactical']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $elsewhere = Agent::create(['company_id' => $other->id, 'agent_name' => 'MAA', 'branch_code' => 'MAA']);
        $user = User::create(['name' => 'Priya', 'email' => 'priya-fil@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'pricing', 'is_active' => 1]);

        // Filed as customer enquiry ×4 (one changed to other), as other ×2 (one changed to customer enquiry); another company's too.
        $thread = function (Agent $at, string $auto, string $now) {
            return DB::table('email_threads')->insertGetId(['agent_id' => $at->id, 'thread_key' => uniqid('fil', true), 'status' => 'new',
                'auto_classification' => $auto, 'classification' => $now, 'latest_message_received_at' => now(), 'created_at' => now(), 'updated_at' => now()]);
        };
        foreach ([['customer_enquiry', 'customer_enquiry'], ['customer_enquiry', 'customer_enquiry'], ['customer_enquiry', 'customer_enquiry'],
                  ['customer_enquiry', 'other'], ['other', 'other'], ['other', 'customer_enquiry']] as [$auto, $now]) {
            $id = $thread($branch, $auto, $now);
            if ($auto !== $now) {
                DB::table('email_classification_overrides')->insert(['agent_id' => $branch->id, 'email_thread_id' => $id, 'original_classification' => $auto,
                    'corrected_classification' => $now, 'sender_domain' => 'descartes.com', 'sender_email' => 'news@descartes.com',
                    'email_subject' => 'Innovation Forum', 'corrected_by' => $user->id, 'created_at' => now()]);
            }
        }
        $thread($elsewhere, 'customer_enquiry', 'airline');

        // Not for a client's login (asked first: the test keeps a guard's user between requests).
        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user), 'Accept' => 'application/json'])
            ->getJson('http://focusair.localhost/api/admin/mail-filing')->assertStatus(401);

        $staff = SuperAdmin::create(['name' => 'F16s', 'email' => 'staff-fil@f16s.test', 'password' => Hash::make('x')]);
        $report = $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('superAdmin-api')->login($staff), 'Accept' => 'application/json'])
            ->getJson("http://superadmin.f16sefreight.com/api/admin/mail-filing?company_id={$company->id}&days=30")->assertOk()->json();

        $enquiries = collect($report['by_type'])->firstWhere('filed_as', 'customer_enquiry');
        $this->assertSame([4, 1, 25, ['other' => 1]], [$enquiries['filed'], $enquiries['changed'], $enquiries['changed_percent'], $enquiries['changed_to']]);
        $this->assertSame(1, $report['missed_enquiries']);
        $this->assertSame(['descartes.com', 'customer_enquiry', 'other', 1], [$report['domains'][0]['sender_domain'], $report['domains'][0]['was'], $report['domains'][0]['now'], $report['domains'][0]['n']]);
        $this->assertSame(['Filing Co', 'Priya'], [$report['recent'][0]['company'], $report['recent'][0]['by']]);

        // The export follows the same company.
        $this->get("http://superadmin.f16sefreight.com/api/admin/classification-overrides/export?company_id={$other->id}")->assertOk()
            ->assertDontSee('Innovation Forum');

    }
}
