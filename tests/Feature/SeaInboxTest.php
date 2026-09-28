<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\EmailThread;
use App\Enquiry;
use App\MailboxConnection;
use App\Services\Mail\MessageIngestor;
use App\Services\Mail\NormalisedMessage;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The sea inbox — GAPS #427 (owner, 2026-09-28: "focussea works like focusair but for sea").
 *
 * 🔴 An enquiry arriving by mail was minted in a queue job with no portal, so it defaulted to AIR — every sea
 * enquiry landed in the air pool as an ENQA number, invisible to the sea desk. The desk is now the portal the
 * mailbox's owner signs in from; a mixed mailbox files a would-be enquiry as Other for a person to file.
 */
class SeaInboxTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $owner;
    private MailboxConnection $mailbox;

    private const SEA_MAIL = 'Please quote FCL 2x40HC Nhava Sheva to Jebel Ali, about 18 MT per box, ready 5 Oct.';

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Sea Mail Co', 'code' => 'SMC', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->owner = User::create(['name' => 'Meera', 'email' => 'meera@forwarder-smc.test', 'password' => Hash::make('secret-smc'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $this->mailbox = MailboxConnection::withoutGlobalScopes()->create(['agent_id' => $this->branch->id, 'user_id' => $this->owner->id,
            'email_address' => 'meera@forwarder-smc.test', 'provider' => 'outlook', 'is_active' => 1, 'auth_state' => 'connected',
            'backfill_status' => 'completed']);

        // A mail from a domain we already bill is an enquiry by FACT (step 2 of the chain) — the model is not asked.
        Customer::create(['company_id' => $company->id, 'name' => 'Globex Sea', 'email_domain' => 'globex-smc.test']);

        foreach ([['INNSA', 'Jawaharlal Nehru (Nhava Sheva)', 'IN'], ['AEJEA', 'Jebel Ali', 'AE']] as [$code, $name, $cc]) {
            DB::table('ports')->insert(['locode' => $code, 'port_name' => $name, 'country_code' => $cc, 'port_type' => 'sea',
                'is_active' => 1, 'created_at' => now(), 'updated_at' => now()]);
        }
    }

    private function desk(?array $modes): void
    {
        DB::table('users')->where('id', $this->owner->id)->update(['signed_in_modes' => $modes === null ? null : json_encode($modes)]);
    }

    private function receive(string $body = self::SEA_MAIL): EmailThread
    {
        $id = '<' . uniqid('', true) . '@smc.test>';
        app(MessageIngestor::class)->ingest($this->mailbox, [new NormalisedMessage(
            messageId: $id, threadId: null, from: 'buyer@globex-smc.test', to: [$this->mailbox->email_address], cc: [], bcc: [],
            subject: 'Rate request', snippet: $body, receivedAt: now(), direction: 'inbound',
        )]);

        return EmailThread::withoutGlobalScopes()->where('thread_key', DB::table('email_messages')->where('message_id', $id)->value('thread_key'))->first();
    }

    public function test_a_sea_desks_enquiry_is_a_sea_enquiry(): void
    {
        $this->desk(['sea']);

        $thread = $this->receive();

        $this->assertSame('customer_enquiry', $thread->classification);
        $enquiry = Enquiry::withoutGlobalScopes()->find($thread->enquiry_id);
        $this->assertSame('sea', $enquiry->transport_mode);
        $this->assertStringStartsWith('ENQS-', $enquiry->enquiry_no);
    }

    public function test_an_air_desks_enquiry_stays_air(): void
    {
        $this->desk(['air']);

        $enquiry = Enquiry::withoutGlobalScopes()->find($this->receive('Please quote 2 pallets 480 kg BOM to FRA')->enquiry_id);

        $this->assertSame('air', $enquiry->transport_mode);
        $this->assertStringStartsWith('ENQA-', $enquiry->enquiry_no);
    }

    /** "If it's mixed then put it in others" — both desks, or none recorded yet. No number is minted. */
    public function test_a_mixed_mailbox_files_a_would_be_enquiry_as_other(): void
    {
        foreach ([['air', 'sea'], null] as $modes) {
            $this->desk($modes);

            $thread = $this->receive();

            $this->assertSame('other', $thread->classification);
            $this->assertSame('mixed_mode', $thread->auto_classification_source);
            $this->assertSame('customer_enquiry', $thread->auto_classification, 'what the chain said is kept for the record');
            $this->assertNull($thread->enquiry_id);
        }
    }

    /** PRD §5.2.7 — sea's own units: tonnes, boxes by size and type, FCL/LCL, and a UN/LOCODE lane. */
    public function test_a_sea_mail_is_read_in_sea_units(): void
    {
        $this->desk(['sea']);

        $cargo = json_decode($this->receive()->staged_cargo, true);

        $this->assertSame('2 × 40HC', $cargo['containers']['value']);
        $this->assertEquals(18000, $cargo['gross_weight']['value']);
        $this->assertSame('fcl', $cargo['cargo_type']['value']);
        $this->assertSame('INNSA', $cargo['origin']['value']);
        $this->assertSame('AEJEA', $cargo['destination']['value']);
    }

    public function test_signing_in_records_the_desk(): void
    {
        DB::table('roles')->insert(['email' => $this->owner->email, 'role' => 'user', 'created_at' => now(), 'updated_at' => now()]);
        $login = fn (string $host) => $this->postJson("http://{$host}/api/login", ['email' => $this->owner->email, 'password' => 'secret-smc'])->assertOk();

        $login('focussea.f16sefreight.com');
        $this->assertSame(['sea'], $this->owner->fresh()->signed_in_modes);

        $login('focusair.f16sefreight.com');
        $this->assertSame(['air', 'sea'], $this->owner->fresh()->signed_in_modes);
    }

    /** A sea client is never told about an air waybill — "confirmed" is in sea's words, the air moments are not sent. */
    public function test_a_sea_client_hears_sea_not_air(): void
    {
        $this->desk(['sea']);
        $thread = $this->receive();
        $enquiry = Enquiry::withoutGlobalScopes()->find($thread->enquiry_id);
        \App\Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'sea',
            'execution_job_no' => 'JOBS-SMC-26-0001']);
        $updates = app(\App\Services\ClientNotificationService::class);

        $confirmed = $updates->draft($thread->fresh(), 'confirmed');
        $this->assertStringContainsString('[shipping line]', $confirmed['body']);
        $this->assertStringContainsString('draft bill of lading', $confirmed['body']);
        $this->assertStringNotContainsString('air waybill', $confirmed['body']);

        $this->assertNull($updates->draft($thread->fresh(), 'draft_awb'));
    }

    public function test_fcl_or_lcl_can_be_confirmed_onto_the_enquiry(): void
    {
        $this->desk(['sea']);
        $enquiry = Enquiry::withoutGlobalScopes()->find($this->receive()->enquiry_id);

        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->owner), 'Accept' => 'application/json'])
            ->patchJson("http://focussea.f16sefreight.com/api/enquiries/{$enquiry->id}/cargo", ['cargo_type' => 'fcl', 'origin_code' => 'INNSA'])
            ->assertOk()->assertJsonPath('cargo_type', 'fcl');
    }
}
