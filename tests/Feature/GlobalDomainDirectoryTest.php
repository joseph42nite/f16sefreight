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
    public function test_adding_an_airline_partner_teaches_the_platform_its_domain(): void
    {
        $this->partner('airline', 'ops@lhcargo.test');

        $this->assertSame('airline', $this->directory()->classify('lhcargo.test'));
    }

    public function test_a_customs_broker_maps_to_clearance(): void
    {
        $this->partner('customs_broker', 'desk@acmechb.test');

        $this->assertSame('clearance', $this->directory()->classify('acmechb.test'));
    }

    public function test_a_transporter_maps_to_trucking(): void
    {
        $this->partner('transporter', 'dispatch@bluedartsurface.test');

        $this->assertSame('trucking_road', $this->directory()->classify('bluedartsurface.test'));
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
    public function test_a_shipping_line_is_not_forced_into_the_air_vocabulary(): void
    {
        $this->partner('shipping_line', 'book@maerskline.test');

        $this->assertNull($this->directory()->classify('maerskline.test'));
    }

    /**
     * ⚠️ A later, DIFFERING opinion does not overwrite. Two tenants disagreeing about a
     * domain is something to look at, not a race the last writer wins.
     */
    public function test_a_conflicting_opinion_does_not_overwrite_the_first(): void
    {
        $this->partner('airline', 'ops@disputed.test', 'GD1');
        $this->partner('transporter', 'ops@disputed.test', 'GD2');

        $this->assertSame('airline', $this->directory()->classify('disputed.test'));
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
