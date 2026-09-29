<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\EmailMessage;
use App\EmailThread;
use App\Enquiry;
use App\Services\EnquiryMinter;
use App\Services\Mail\MailFilingService;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * Import triage (owner, 2026-09-29: "have the mail triage for import from Jev too, for sea and air"; GAPS #437).
 *
 * The lane decides when the mail names one — a fact; Jev's `direction` answer otherwise, kept only above its floor;
 * nothing said leaves the enquiry as export, as it always was. What the rubric reads correctly is measured by
 * `mail:rubric-check`, not here — these tests prove the wiring.
 */
class ImportTriageTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private int $connectionId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Triage Co', 'code' => 'TRG', 'tier' => 'command', 'ocr_credits_balance' => 500]);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Chennai', 'branch_code' => 'MAA',
            'agent_country' => 'India']);
        $user = User::create(['name' => 'pricing', 'email' => 'pricing-trg@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $this->connectionId = DB::table('mailbox_connections')->insertGetId([
            'agent_id' => $this->branch->id, 'user_id' => $user->id, 'email_address' => 'inbox-trg@test.local',
            'provider' => 'outlook', 'is_active' => 1, 'auth_state' => 'connected', 'created_at' => now(), 'updated_at' => now(),
        ]);

        foreach ([['SZX', 'Shenzhen', 'CN'], ['MAA', 'Chennai', 'IN'], ['SIN', 'Singapore', 'SG']] as [$code, $name, $country]) {
            DB::table('locations')->updateOrInsert(['iata_code' => $code],
                ['destination' => $name, 'country_code' => $country, 'is_active' => 1, 'created_at' => now(), 'updated_at' => now()]);
        }

        config(['mail_intent.enabled' => true, 'services.openrouter.key' => 'test-key']);
    }

    private function message(string $subject, string $body): EmailMessage
    {
        $key = 'thr_' . uniqid('', true);
        DB::table('email_threads')->insert(['agent_id' => $this->branch->id, 'thread_key' => $key, 'status' => 'unread',
            'classification' => 'unclassified', 'latest_message_received_at' => now(), 'created_at' => now(), 'updated_at' => now()]);

        return EmailMessage::create(['agent_id' => $this->branch->id, 'mailbox_connection_id' => $this->connectionId,
            'thread_key' => $key, 'direction' => 'inbound', 'message_id' => '<' . uniqid('', true) . '@mail.test>',
            'from' => 'someone@unknown-trg.test', 'subject' => $subject, 'body_snippet' => $body, 'received_at' => now(), 'is_historical' => false]);
    }

    /** All three questions answered, as the Decisions API does in one request. */
    private function fakeAnswer(string $sender, string $intent, ?string $direction, float $directionConfidence = 0.9): void
    {
        $choice = fn (string $c, float $conf) => ['type' => 'choice', 'choice' => $c,
            'probabilities' => [$c => $conf], 'confidence' => $conf];

        $answers = ['sender' => $choice($sender, 0.9), 'intent' => $choice($intent, 0.9)];
        if ($direction !== null) {
            $answers['direction'] = $choice($direction, $directionConfidence);
        }

        Http::fake(['*/decisions' => Http::response(['id' => 'gen-dec-trg', 'model' => 'typesafe/jev-1.13', 'provider' => 'TypeSafe',
            'answers' => $answers, 'usage' => ['input_tokens' => 1300, 'output_tokens' => 40, 'cost' => 0.000055]])]);
    }

    public function test_jev_is_asked_the_direction_in_both_rubrics(): void
    {
        $this->assertArrayHasKey('direction', config('mail_intent.questions'));
        $this->assertArrayHasKey('direction', config('mail_intent.sea.questions'));
        $this->assertNotSame(config('mail_intent.questions.direction.instructions'), config('mail_intent.sea.questions.direction.instructions'),
            'Sea asks it in its own words.');
    }

    /**
     * The rubric is the bill (owner, 2026-09-29: "make sure the Jev prompt is not too long"). Each one sent is held
     * under ~1,000 tokens (4,000 characters of JSON); it was ~1,300 before it was compacted.
     */
    public function test_the_rubric_stays_compact(): void
    {
        foreach ([null, 'sea'] as $mode) {
            $questions = array_map(fn (array $q) => \App\Services\JevClient::choice($q['instructions'], $q['criteria']),
                \App\Services\Mail\MailIntentClassifier::rubricFor($mode)['questions']);

            $this->assertLessThanOrEqual(4000, strlen(json_encode($questions)), ($mode ?? 'air') . ' rubric grew past its budget.');
        }
    }

    /** A lane already answers import or export, so the question is not sent and not paid for. */
    public function test_jev_is_not_asked_the_direction_a_lane_already_gives(): void
    {
        $this->fakeAnswer('client', 'wants_a_price', null);

        app(MailFilingService::class)->classify($this->message('Rate SZX-MAA', 'SZX-MAA 8 cartons 240 kgs, please quote'), 'air');
        Http::assertSent(fn ($request) => ! array_key_exists('direction', $request['questions']));

        app(MailFilingService::class)->classify($this->message('Rates', 'please share your best rates'), 'air');
        Http::assertSent(fn ($request) => array_key_exists('direction', $request['questions']));
    }

    public function test_a_sure_import_reading_is_kept(): void
    {
        $this->fakeAnswer('overseas_agent', 'wants_to_book', 'import');

        $result = app(MailFilingService::class)->classify($this->message('Pre-alert', 'HAWB 4471, 3 pcs, docs attached, please clear'), 'air');

        $this->assertSame('import', $result['direction']);
    }

    public function test_an_unsure_reading_says_nothing(): void
    {
        $this->fakeAnswer('client', 'wants_a_price', 'import', 0.4);

        $result = app(MailFilingService::class)->classify($this->message('Rates', 'please share your rates'), 'air');

        $this->assertNull($result['direction']);
    }

    /** The lane is a fact, and a fact outranks a reading of prose. */
    public function test_the_lane_outranks_jev(): void
    {
        $this->fakeAnswer('client', 'wants_a_price', 'export', 0.95);

        $result = app(MailFilingService::class)->classify($this->message('Rate SZX-MAA', 'SZX-MAA 8 cartons 240 kgs, please quote'), 'air');

        $this->assertSame('import', $result['direction'], 'Shenzhen to Chennai, for a branch in India, is an import.');

        $out = app(MailFilingService::class)->classify($this->message('Rate MAA-SIN', 'MAA-SIN 6 pcs 180 kgs'), 'air');
        $this->assertSame('export', $out['direction']);
    }

    /** A known client's mail never reaches Jev — its lane is the only thing that can say. */
    public function test_a_known_clients_lane_is_read_without_jev(): void
    {
        Http::fake();
        DB::table('customers')->insert(['company_id' => $this->company->id, 'name' => 'Known', 'email_domain' => 'known-trg.test',
            'created_at' => now(), 'updated_at' => now()]);
        $message = $this->message('Rate SZX-MAA', 'SZX-MAA 240 kgs please');
        $message->update(['from' => 'buyer@known-trg.test']);

        $result = app(MailFilingService::class)->classify($message->fresh(), 'air');

        $this->assertSame('import', $result['direction']);
        Http::assertNothingSent();
    }

    public function test_the_enquiry_starts_as_the_mail_read_and_export_when_nothing_said(): void
    {
        $import = EmailThread::withoutTenantScope()->where('thread_key', $this->message('x', 'y')->thread_key)->first();
        $import->forceFill(['auto_direction' => 'import', 'classification' => 'customer_enquiry'])->save();
        $plain = EmailThread::withoutTenantScope()->where('thread_key', $this->message('x', 'y')->thread_key)->first();

        $this->assertSame('import', app(EnquiryMinter::class)->mint($import, null, 'air')->direction);
        $this->assertSame('export', app(EnquiryMinter::class)->mint($plain, null, 'air')->direction);
    }

    public function test_pricing_corrects_the_direction_on_the_enquiry(): void
    {
        $pricing = User::where('email', 'pricing-trg@test.local')->first();
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'enquiry_no' => 'ENQA-TRGMAA-26-0001']);

        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($pricing), 'Accept' => 'application/json'])
            ->patchJson("http://focusair.f16sefreight.com/api/enquiries/{$enquiry->id}/cargo", ['direction' => 'import'])->assertOk();

        $this->assertSame('import', $enquiry->fresh()->direction);
    }
}
