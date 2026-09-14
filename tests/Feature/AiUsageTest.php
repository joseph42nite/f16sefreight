<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Jobs\ProcessPdfOcrJob;
use App\PdfProcessingJob;
use App\SuperAdmin;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * What the hosted model costs, and the limits on it (user, 2026-09-14).
 *
 * 🔴 Gemma 4 on OpenRouter is paid per call. Every answered call is logged against its user and
 * branch; a user over the daily limit is read by labels; the monthly budget is SHOWN, never enforced.
 */
class AiUsageTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'AI Co', 'code' => 'AIC', 'tier' => 'tactical']);
        $branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);

        $this->user = User::create([
            'name' => 'Ops', 'email' => 'ops-ai@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);

        DB::table('llm_usage_logs')->delete();
        DB::table('ai_budget_settings')->delete();
    }

    /** Runs the worker on an invoice, with the parser answering `$answer`. Returns what was sent. */
    private function runJob(array $answer, bool $allowVision = false): array
    {
        Storage::fake('pdf_temp');
        Storage::disk('pdf_temp')->put('inv.pdf', '%PDF-1.4');

        $sent = [];
        Http::fake(function ($request) use ($answer, &$sent) {
            $sent[] = $request->data();

            return Http::response($answer, 200);
        });

        $job = PdfProcessingJob::create([
            'user_id' => $this->user->id, 'original_filename' => 'inv.pdf', 'temp_file_path' => 'inv.pdf',
            'document_type' => 'unstructured', 'status' => 'queued',
        ]);

        (new ProcessPdfOcrJob($job->id, $allowVision))->handle();

        return ['job' => $job->fresh(), 'sent' => collect($sent[0] ?? [])->pluck('contents', 'name')->all()];
    }

    private function usage(array $overrides = []): array
    {
        return array_merge(['model' => 'google/gemma-4-31b-it', 'provider' => 'DeepInfra', 'tokens_in' => 2100,
                            'tokens_out' => 260, 'cost_usd' => 0.00028, 'execution_ms' => 3400, 'attempts' => 1], $overrides);
    }

    public function test_an_answered_call_is_logged_against_the_user_and_branch(): void
    {
        ['job' => $job] = $this->runJob(['extraction_path' => 'text', 'page_count' => 2, 'model_usage' => $this->usage()]);

        $row = DB::table('llm_usage_logs')->first();

        $this->assertSame('completed', $job->status);
        $this->assertSame($this->user->id, (int) $row->user_id);
        $this->assertSame((int) $this->user->branch_name, (int) $row->agent_id);
        $this->assertSame($job->id, (int) $row->pdf_processing_job_id);
        $this->assertSame('google/gemma-4-31b-it', $row->model);
        $this->assertSame('DeepInfra', $row->provider);
        $this->assertSame('text', $row->purpose);
        $this->assertEquals(0.00028, (float) $row->cost_usd);
    }

    public function test_a_document_the_model_did_not_answer_is_not_logged(): void
    {
        $this->runJob(['extraction_path' => 'text', 'page_count' => 1, 'model_error' => 'the model timed out after 12s']);

        $this->assertSame(0, DB::table('llm_usage_logs')->count());
    }

    /** 🔴 Over the daily limit the parser is told not to call the model: labels, and the panel says why. */
    public function test_over_the_daily_limit_the_model_is_not_called(): void
    {
        DB::table('ai_budget_settings')->insert(['per_user_daily_limit' => 2, 'created_at' => now(), 'updated_at' => now()]);

        foreach (range(1, 2) as $i) {
            DB::table('llm_usage_logs')->insert(['user_id' => $this->user->id, 'model' => 'm', 'created_at' => now(), 'updated_at' => now()]);
        }

        ['sent' => $sent] = $this->runJob(['extraction_path' => 'text', 'page_count' => 1]);

        $this->assertSame('false', $sent['use_model']);
    }

    public function test_under_the_limit_the_model_is_allowed(): void
    {
        ['sent' => $sent] = $this->runJob(['extraction_path' => 'text', 'page_count' => 1]);

        $this->assertSame('true', $sent['use_model']);
    }

    /** A consented scan was authorised by a person and paid with a credit: the daily limit does not apply. */
    public function test_a_consented_scan_is_not_limited_and_is_logged_as_vision(): void
    {
        DB::table('ai_budget_settings')->insert(['per_user_daily_limit' => 0, 'created_at' => now(), 'updated_at' => now()]);

        ['sent' => $sent] = $this->runJob(['extraction_path' => 'vision', 'page_count' => 1, 'model_usage' => $this->usage()], true);

        $this->assertSame('true', $sent['use_model']);
        $this->assertSame('vision', DB::table('llm_usage_logs')->value('purpose'));
    }

    // ─── The superadmin portal ───────────────────────────────────────────────

    private function asStaff(): self
    {
        $staff = SuperAdmin::create(['name' => 'Staff', 'email' => 'staff-ai@f16s.test', 'password' => Hash::make('x')]);

        return $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('superAdmin-api')->login($staff),
            'Accept' => 'application/json',
        ]);
    }

    /** 🔴 At the budget the portal SAYS so — nothing is stopped (user's choice). */
    public function test_the_portal_shows_spend_against_the_budget_in_rupees(): void
    {
        DB::table('ai_budget_settings')->insert(['monthly_budget_inr' => 1, 'usd_to_inr' => 88, 'created_at' => now(), 'updated_at' => now()]);
        DB::table('llm_usage_logs')->insert([
            'user_id' => $this->user->id, 'agent_id' => $this->user->branch_name, 'model' => 'google/gemma-4-31b-it',
            'cost_usd' => 0.02, 'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->asStaff()->getJson('http://superadmin.f16sefreight.com/api/superadmin/ai-usage')
            ->assertOk()
            ->assertJsonPath('month.spend_inr', 1.76)
            ->assertJsonPath('month.over_budget', true)
            ->assertJsonPath('by_company.0.company', 'AI Co')
            ->assertJsonPath('by_user.0.calls_today', 1);
    }

    public function test_the_limits_are_set_in_the_portal(): void
    {
        $this->asStaff()->putJson('http://superadmin.f16sefreight.com/api/superadmin/ai-usage/settings', [
            'monthly_budget_inr' => 10000, 'usd_to_inr' => 87.5, 'per_user_daily_limit' => 60,
        ])->assertOk()->assertJsonPath('settings.per_user_daily_limit', 60);

        $this->assertSame(60, (int) DB::table('ai_budget_settings')->value('per_user_daily_limit'));
    }

    /** 🔒 A tenant login never reaches the platform's budget. */
    public function test_a_tenant_user_cannot_see_the_budget(): void
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->user),
            'Accept' => 'application/json',
        ])->getJson('http://superadmin.f16sefreight.com/api/superadmin/ai-usage')->assertStatus(401);
    }
}
