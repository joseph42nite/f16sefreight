<?php

namespace Tests\Feature;

use App\Company;
use App\Partner;
use App\Services\GlobalDomainDirectory;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * The progressive loop — what the platform learns once, every tenant gets.
 *
 * 🔐 **The privacy line is the thing under test.** Only a domain, a classification and a
 * count of agreeing tenants ever cross the boundary. "lhcargo.test is an airline" is an
 * industry fact; "Globex emailed about pharma" is a client's business, and no path here
 * may carry the second.
 */
class GlobalDomainDirectoryTest extends TestCase
{
    use DatabaseTransactions;

    private function directory(): GlobalDomainDirectory
    {
        return app(GlobalDomainDirectory::class);
    }

    private function partner(string $type, ?string $email, string $code = 'GD1'): Partner
    {
        $company = Company::firstOrCreate(['code' => $code],
            ['name' => "Dir {$code}", 'tier' => 'command']);

        return Partner::create([
            'company_id' => $company->id, 'name' => 'A Vendor',
            'partner_type' => $type, 'email' => $email,
        ]);
    }

    // ─── Learning from partners ──────────────────────────────────────────────

    /**
     * 🔴 Adding a partner teaches the platform, as a side effect of ordinary work. This is
     * the cheapest signal there is and it costs the operator nothing extra.
     */
    /**
     * 🔴 A partner PROPOSES; it does not classify. The directory is platform-wide, so one
     * wrong entry misfiles mail for every tenant at once while the tenant it hurts cannot
     * see why. The learning is automatic; the applying is a decision.
     */
    public function test_adding_an_airline_partner_proposes_but_does_not_classify(): void
    {
        $this->partner('airline', 'ops@lhcargo.test');

        $this->assertNull($this->directory()->classify('lhcargo.test'),
            'A proposal classified mail before anybody reviewed it.');

        $row = DB::table('global_domain_classifications')->where('domain', 'lhcargo.test')->first();

        $this->assertSame('proposed', $row->status);
        $this->assertSame('airline', $row->classification);
    }

    /** Only once approved does it classify — for every tenant. */
    public function test_an_approved_domain_classifies_platform_wide(): void
    {
        $this->partner('airline', 'ops@approved-air.test');

        DB::table('global_domain_classifications')->where('domain', 'approved-air.test')
            ->update(['status' => 'approved']);

        $this->assertSame('airline', $this->directory()->classify('approved-air.test'));
    }

    /**
     * ⚠️ A REJECTED domain stays rejected. Deleting the row would mean the next partner
     * added for it proposes it again, and the reviewer answers the same question forever
     * with no record of having answered it.
     */
    public function test_a_rejected_domain_is_not_revived_by_another_partner(): void
    {
        $this->partner('airline', 'ops@refused.test', 'GD1');

        DB::table('global_domain_classifications')->where('domain', 'refused.test')
            ->update(['status' => 'rejected']);

        $this->partner('airline', 'cargo@refused.test', 'GD2');

        $this->assertSame('rejected', DB::table('global_domain_classifications')
            ->where('domain', 'refused.test')->value('status'));
        $this->assertNull($this->directory()->classify('refused.test'));
    }

    public function test_a_customs_broker_maps_to_clearance(): void
    {
        $this->partner('customs_broker', 'desk@acmechb.test');

        $this->assertSame('clearance', DB::table('global_domain_classifications')
            ->where('domain', 'acmechb.test')->value('classification'));
    }

    public function test_a_transporter_maps_to_trucking(): void
    {
        $this->partner('transporter', 'dispatch@bluedartsurface.test');

        $this->assertSame('trucking_road', DB::table('global_domain_classifications')
            ->where('domain', 'bluedartsurface.test')->value('classification'));
    }

    /**
     * 🔴 A FREE-MAIL DOMAIN IS REFUSED. One broker listing a gmail address would otherwise
     * classify every personal mail on the platform as clearance — the single most damaging
     * thing this directory could learn.
     */
    public function test_a_free_mail_domain_is_never_learned(): void
    {
        $this->partner('customs_broker', 'somebroker@gmail.com');

        $this->assertNull($this->directory()->classify('gmail.com'));
    }

    /**
     * 🔴 `shipping_line` has NO classification to map to. The vocabulary is
     * customer_enquiry | airline | clearance | trucking_road — air-shaped, with no slot for
     * a sea carrier. Mapping Maersk to `airline` would put sea carriers in the air folder
     * and hide the mistake, so it is deliberately not learned at all.
     */
    /**
     * 🔴 A SEA CARRIER IS NOT LEARNED BY THE AIR INBOX. `shipping_line` is FocusSea's
     * counterparty and the classification set is per MODE — filing Maersk under `airline`
     * to avoid an empty case would put sea carriers in an air operator's folder and hide
     * the mistake. Refused deliberately until the sea vocabulary exists (GAPS #50).
     */
    public function test_a_shipping_line_is_not_learned_by_the_air_vocabulary(): void
    {
        $this->partner('shipping_line', 'book@maerskline.test');

        $this->assertNull(DB::table('global_domain_classifications')
            ->where('domain', 'maerskline.test')->value('classification'),
            'A sea carrier was learned into the air inbox.');
    }

    /**
     * ⚠️ A later, DIFFERING opinion does not overwrite. Two tenants disagreeing about a
     * domain is something to look at, not a race the last writer wins.
     */
    public function test_a_conflicting_opinion_does_not_overwrite_the_first(): void
    {
        $this->partner('airline', 'ops@disputed.test', 'GD1');
        $this->partner('transporter', 'ops@disputed.test', 'GD2');

        $this->assertSame('airline', DB::table('global_domain_classifications')
            ->where('domain', 'disputed.test')->value('classification'));
    }

    /** Agreement raises confidence rather than duplicating the row. */
    public function test_agreement_raises_the_confirmation_count(): void
    {
        $this->partner('airline', 'ops@agreed.test', 'GD1');
        $this->partner('airline', 'cargo@agreed.test', 'GD2');

        $row = DB::table('global_domain_classifications')->where('domain', 'agreed.test')->first();

        $this->assertSame(2, (int) $row->confirmations);
        $this->assertSame(1, DB::table('global_domain_classifications')
            ->where('domain', 'agreed.test')->count());
    }

    // ─── The directory is deliberately NOT tenant-scoped ─────────────────────

    /**
     * 🔴 THE POINT OF THE WHOLE TABLE. What one tenant taught, another gets — that is why
     * there is no `agent_id` here, and why `lufthansa.com` is not re-learned by every
     * forwarder on the platform.
     */
    public function test_what_one_tenant_teaches_another_tenant_receives(): void
    {
        $this->partner('airline', 'ops@sharedfact.test', 'GD1');

        DB::table('global_domain_classifications')->where('domain', 'sharedfact.test')
            ->update(['status' => 'approved']);

        // A completely unrelated tenant asking the same question.
        $this->assertSame('airline', $this->directory()->classify('sharedfact.test'));

        $columns = DB::getSchemaBuilder()->getColumnListing('global_domain_classifications');

        $this->assertNotContains('agent_id', $columns, 'The directory must not be tenant-scoped.');
        $this->assertNotContains('company_id', $columns);
    }

    /**
     * 🔐 The privacy line, asserted structurally: there is nowhere in this table for a
     * subject, a sender, a thread or a client to live.
     */
    public function test_the_directory_cannot_hold_client_information(): void
    {
        $columns = DB::getSchemaBuilder()->getColumnListing('global_domain_classifications');

        foreach (['subject', 'sender_email', 'thread', 'customer_id', 'body'] as $forbidden) {
            $this->assertNotContains($forbidden, $columns);
        }
    }
}
