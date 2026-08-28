<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enquiry;
use App\PdfProcessingJob;
use App\Services\AuditLogger;
use App\Services\CargoDataPromotionService;
use App\Services\SystemActor;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

/**
 * The reserved system actor — GAPS #22.
 *
 * `audit_logs.user_id` is NOT NULL with a foreign key, but the actions most worth
 * auditing have no human actor. Rather than weaken the constraint, each tenant gets one
 * reserved user that automated actions attribute to.
 */
class SystemActorTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;

    protected function setUp(): void
    {
        parent::setUp();
        SystemActor::flushCache();

        $this->company = Company::create(['name' => 'Sys Co', 'code' => 'SYS', 'tier' => 'command']);
        $this->branch = Agent::create([
            'company_id' => $this->company->id, 'agent_name' => 'Sys Branch', 'branch_code' => 'BOM',
        ]);
    }

    public function test_a_system_actor_is_created_on_first_use_and_reused_after(): void
    {
        $first = SystemActor::forCompany($this->company->id);

        SystemActor::flushCache(); // force a fresh database lookup
        $second = SystemActor::forCompany($this->company->id);

        $this->assertSame($first, $second, 'A tenant must have exactly one system actor.');
        $this->assertSame(1, User::withoutGlobalScopes()
            ->where('company_name', (string) $this->company->id)
            ->where('designation', SystemActor::DESIGNATION)->count());
    }

    /** One identity per TENANT, not per branch — five identical "System" users would be odd. */
    public function test_branches_of_one_tenant_share_a_single_system_actor(): void
    {
        $second = Agent::create([
            'company_id' => $this->company->id, 'agent_name' => 'Sys Chennai', 'branch_code' => 'MAA',
        ]);

        $this->assertSame(
            SystemActor::forBranch($this->branch->id),
            SystemActor::forBranch($second->id)
        );
    }

    public function test_each_tenant_gets_its_own_system_actor(): void
    {
        $other = Company::create(['name' => 'Other Co', 'code' => 'OTH', 'tier' => 'core']);
        Agent::create(['company_id' => $other->id, 'agent_name' => 'B', 'branch_code' => 'DEL']);

        $this->assertNotSame(
            SystemActor::forCompany($this->company->id),
            SystemActor::forCompany($other->id),
            'Attribution must never cross tenants.'
        );
    }

    // ─── It must be unable to do anything ────────────────────────────────────

    /**
     * `designation = 'system'` is outside the real set, so it matches NO gate. Every role
     * check fails closed with no special-casing anywhere.
     */
    public function test_the_system_actor_passes_no_role_gate(): void
    {
        $actor = User::withoutGlobalScopes()->find(SystemActor::forCompany($this->company->id));

        foreach (['triage', 'convert', 'assignOperator', 'postLedger', 'managePeriod', 'viewFinancials'] as $ability) {
            $this->assertFalse(
                Gate::forUser($actor)->allows($ability),
                "The system actor must not be able to '{$ability}'."
            );
        }
    }

    /** It is not a person and must never appear in an operator picker. */
    public function test_the_system_actor_is_excluded_from_user_listings(): void
    {
        $person = User::create([
            'name' => 'Asha', 'email' => 'asha-sys@test.local', 'password' => 'x',
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => 'operations',
        ]);

        SystemActor::forCompany($this->company->id);

        $listed = User::withoutGlobalScopes()
            ->where('company_name', (string) $this->company->id)
            ->realPeople()->pluck('email')->all();

        $this->assertSame([$person->email], $listed);
    }

    public function test_the_system_actor_is_inactive_and_has_no_usable_password(): void
    {
        $actor = User::withoutGlobalScopes()->find(SystemActor::forCompany($this->company->id));

        $this->assertSame(0, (int) $actor->is_active);
        $this->assertTrue($actor->isSystemActor());
        // The stored hash is random and discarded — there is no login path at all.
        $this->assertFalse(\Illuminate\Support\Facades\Hash::check('', $actor->password));
    }

    // ─── What it is for ──────────────────────────────────────────────────────

    public function test_an_automated_action_is_audited_against_the_system_actor(): void
    {
        app(AuditLogger::class)->recordSystem($this->branch->id, 'credits.granted', 'company', $this->company->id);

        $row = DB::table('audit_logs')->where('action', 'credits.granted')->first();

        $this->assertNotNull($row, 'An automated action must still produce an audit row.');
        $this->assertSame(SystemActor::forCompany($this->company->id), (int) $row->user_id);
        $this->assertSame($this->branch->id, (int) $row->agent_id, 'The real branch is still recorded.');
    }

    public function test_a_human_action_is_audited_against_that_human(): void
    {
        $person = User::create([
            'name' => 'Ravi', 'email' => 'ravi-sys@test.local', 'password' => 'x',
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => 'pricing',
        ]);

        app(AuditLogger::class)->record($this->branch->id, 'job.cancelled', 'job', 1, $person->id);

        $this->assertSame(
            $person->id,
            (int) DB::table('audit_logs')->where('action', 'job.cancelled')->value('user_id')
        );
    }

    /**
     * 🔴 THE REGRESSION THIS CLOSES. Cargo promotion runs in a queue worker with no
     * acting user; it previously SKIPPED the audit row rather than violate the foreign
     * key — leaving the change least witnessed by a human as the one unrecorded.
     */
    public function test_an_unattended_cargo_promotion_is_now_audited(): void
    {
        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-SYSBOM-26-0001',
            'extracted_weight' => 450.5, 'cargo_data_source' => 'regex',
            // No pricing_id, ops_id or sales_id — nobody to attribute to.
        ]);

        $extraction = new PdfProcessingJob([
            'enquiry_id' => $enquiry->id,
            'extracted_data' => ['gross_weight' => ['value' => 512.8, 'confidence' => 'high']],
        ]);

        $this->assertTrue(app(CargoDataPromotionService::class)->promote($extraction));

        $audit = DB::table('audit_logs')
            ->where('action', 'enquiry.cargo_promoted')
            ->where('model_id', $enquiry->id)
            ->first();

        $this->assertNotNull($audit, 'An unattended promotion must be audited, not skipped.');
        $this->assertSame(SystemActor::forCompany($this->company->id), (int) $audit->user_id);
        $this->assertSame('enquiry', $audit->model_type, 'A morph key, never a class name.');
    }

    /** Audit rows stay append-only even when written by the system actor. */
    public function test_a_system_written_audit_row_still_cannot_be_altered(): void
    {
        app(AuditLogger::class)->recordSystem($this->branch->id, 'credits.granted', 'company', $this->company->id);

        $id = DB::table('audit_logs')->where('action', 'credits.granted')->value('id');

        $this->expectException(\Illuminate\Database\QueryException::class);
        DB::table('audit_logs')->where('id', $id)->update(['action' => 'tampered']);
    }
}
