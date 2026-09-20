<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\EmailMessage;
use App\Services\OcrCreditService;
use App\Services\Mail\MailFilingService;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * Filing inbound mail, since the decision model replaced the quote-request regex (2026-09-20).
 *
 * 🔴 **THESE TESTS COVER THE WIRING, NOT THE RUBRIC.** Whether Jev reads "please quote the best
 * rate" as an enquiry is a question about a hosted model and a paragraph of English; asserting
 * it here would mean either calling a paid endpoint from CI or asserting against a stub, which
 * proves the stub. What CAN be pinned is everything around the answer: that a fact outranks it,
 * that a low-confidence answer is not acted on, that a failure costs the tenant nothing, and
 * that the mail still lands somewhere a person can find it.
 *
 * The rubric's own accuracy is measured where it actually matters — Super Admin → Mail filing,
 * which compares `auto_classification` against what operators re-filed, per source and per
 * rubric version. That is a live number on real mail rather than a fixture.
 *
 * ⚠️ The real-mail samples the regex was built from are KEPT, in
 * `test_the_samples_the_rubric_has_to_get_right`, as the fixture any rubric change should be
 * replayed against by hand or by an eval. They were expensive to collect (the first real
 * inbox, joseph@f16sefreight.com, 2026-09-17) and deleting them with the regex would have
 * thrown away the only record of what "wrong" looked like.
 */
class EnquiryPatternsTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;

    private Agent $branch;

    private int $connectionId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create([
            'name' => 'Pattern Co', 'code' => 'PTN', 'tier' => 'tactical', 'ocr_credits_balance' => 500,
        ]);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);

        $user = User::create([
            'name' => 'ops', 'email' => 'ops-ptn-' . uniqid('', true) . '@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);

        $this->connectionId = DB::table('mailbox_connections')->insertGetId([
            'agent_id' => $this->branch->id, 'user_id' => $user->id,
            'email_address' => 'inbox-ptn-' . uniqid('', true) . '@test.local',
            'provider' => 'outlook', 'is_active' => 1, 'auth_state' => 'connected',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        config(['mail_intent.enabled' => true, 'services.openrouter.key' => 'test-key']);
    }

    // ─── Fixtures ────────────────────────────────────────────────────────────

    /**
     * A stored inbound message. It has to be STORED: the classifier refuses to charge a credit
     * against a row that does not exist, so an unsaved model never reaches the model at all.
     */
    private function message(string $subject, string $body, string $from = 'someone@unknown-ptn.test'): EmailMessage
    {
        $key = 'thr_' . uniqid('', true);

        DB::table('email_threads')->insert([
            'agent_id' => $this->branch->id, 'thread_key' => $key, 'status' => 'unread',
            'classification' => 'unclassified', 'latest_message_received_at' => now(),
            'created_at' => now(), 'updated_at' => now(),
        ]);

        return EmailMessage::create([
            'agent_id' => $this->branch->id, 'mailbox_connection_id' => $this->connectionId,
            'thread_key' => $key, 'direction' => 'inbound',
            'message_id' => '<' . uniqid('', true) . '@mail.test>',
            'from' => $from, 'subject' => $subject, 'body_snippet' => $body,
            'received_at' => now(), 'is_historical' => false,
        ]);
    }

    /**
     * The Decisions API, answering BOTH questions — the shape the classifier actually reads.
     *
     * ⚠️ Stated as sender + intent, not as a folder: the folder is MailFilingService's routing
     * table, and a fake that returned one would be testing the fake. Tests name the pair and
     * assert the folder the routing produces from it.
     */
    private function fakeAnswer(string $sender, string $intent, float $senderConfidence = 0.9, ?float $intentConfidence = null): void
    {
        $choice = fn (string $c, float $conf) => [
            'type' => 'choice', 'choice' => $c,
            'probabilities' => [$c => $conf, 'outsider' => 1 - $conf], 'confidence' => $conf,
        ];

        Http::fake(['*/decisions' => Http::response([
            'id' => 'gen-dec-test', 'model' => 'typesafe/jev-1.13-20260917', 'provider' => 'TypeSafe',
            'answers' => [
                'sender' => $choice($sender, $senderConfidence),
                'intent' => $choice($intent, $intentConfidence ?? $senderConfidence),
            ],
            'usage' => ['input_tokens' => 1300, 'output_tokens' => 40, 'cost' => 0.000055],
        ])]);
    }

    private function filed(string $subject, string $body): array
    {
        return app(MailFilingService::class)->classify($this->message($subject, $body), 'air');
    }

    private function balance(): float
    {
        return (float) DB::table('companies')->where('id', $this->company->id)->value('ocr_credits_balance');
    }

    // ─── The cargo patterns, which did NOT move to the model ─────────────────

    /**
     * 🔴 Extraction stayed in regex on purpose. These numbers price a shipment and go on a
     * customs declaration; Jev's own documentation says it is not a calculator and does not
     * generate values, so reading them with it would trade an occasionally-wrong pattern for
     * a confidently-wrong judgement.
     */
    public function test_the_figures_forwarders_write_are_read(): void
    {
        $cargo = app(MailFilingService::class)->extractCargo(
            "hi,\n\nRequesting quotation for :\n\nBLR-ORD\nPCS : 21\nWEIGHT : 300 kgs\nDimensions : 60 x 30 x20\nGeneral cargo", 'air');

        $this->assertSame([21, 300.0, 'high', '60 x 30 x 20'], [$cargo['pieces']['value'], $cargo['gross_weight']['value'],
            $cargo['gross_weight']['confidence'], $cargo['dimensions']['value']]);

        $cargo = app(MailFilingService::class)->extractCargo(
            "Agreed rate 350++\nPcs 400\nGross wgt 17400kgs\nCh wt 18000 kgs\nDims 40x30x30 cms", 'air');

        $this->assertSame([400, 17400.0, 18000.0, '40 x 30 x 30 cms'], [$cargo['pieces']['value'], $cargo['gross_weight']['value'],
            $cargo['chargeable_weight']['value'], $cargo['dimensions']['value']]);
    }

    // ─── The chain ───────────────────────────────────────────────────────────

    /** The model's answer is what gets filed, and the decision says the model said so. */
    public function test_the_models_answer_is_what_gets_filed(): void
    {
        $this->fakeAnswer('client', 'wants_a_price', 0.91, 0.95);

        $result = $this->filed('Hello', 'Can you please quote for 2 shipments next week');

        $this->assertSame('customer_enquiry', $result['classification']);
        $this->assertSame('model', $result['source']);
        // The weaker of the two answers: a decision is only as good as what it rests on.
        $this->assertSame(0.91, $result['confidence']);
        $this->assertSame(config('mail_intent.rubric_version'), $result['rubric']);
    }

    /**
     * 🔴 A domain we already invoice outranks the model, and the model is never even asked.
     * A judgement about prose must not be able to overturn a client we onboarded — and the
     * saved call is the reason a settled mailbox is cheap to run.
     */
    public function test_a_known_client_domain_beats_the_model_and_skips_the_call(): void
    {
        DB::table('customers')->insert([
            'company_id' => $this->company->id, 'name' => 'Globex', 'email_domain' => 'globex-ptn.test',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->fakeAnswer('outsider', 'nothing_for_us', 0.99);

        $result = app(MailFilingService::class)->classify(
            $this->message('Newsletter', 'Nothing about freight here', 'ops@globex-ptn.test'), 'air');

        $this->assertSame(['customer_enquiry', 'client'], [$result['classification'], $result['source']]);
        Http::assertNothingSent();
    }

    /**
     * ⚠️ `confidence` is how PEAKED the answer is, not how likely the winner is. A mail that is
     * genuinely half airline notice and half enquiry comes back with a plausible `choice` at a
     * confidence near zero, and filing it would be acting on a coin toss.
     */
    public function test_a_low_confidence_answer_is_filed_as_other_with_the_confidence_kept(): void
    {
        // Neither answer clears its floor, so there is nothing to act on from either axis.
        $this->fakeAnswer('client', 'wants_a_price', 0.10, 0.12);

        $result = $this->filed('FYI', 'Please see below.');

        $this->assertSame('other', $result['classification']);
        // Still 'model': the model WAS asked and WAS paid for. Recording this as 'none' would
        // hide every call the confidence floor threw away.
        $this->assertSame('model', $result['source']);
        $this->assertSame(0.10, $result['confidence']);
    }

    /** With the model switched off, unmatched mail falls to Other exactly as it did before it existed. */
    public function test_with_the_model_off_unmatched_mail_falls_to_other(): void
    {
        config(['mail_intent.enabled' => false]);
        Http::fake();

        $result = $this->filed('Hello', 'Please quote the best rate');

        $this->assertSame(['other', 'none', null], [$result['classification'], $result['source'], $result['confidence']]);
        Http::assertNothingSent();
    }

    // ─── What it costs ───────────────────────────────────────────────────────

    /** 🔴 A fifth of a credit a mail — the rate decimals were added for. */
    public function test_one_filed_mail_costs_a_fifth_of_a_credit(): void
    {
        $this->fakeAnswer('airline', 'operational_update', 0.88);

        $this->filed('Flight update', 'Space confirmed on tomorrow.');

        $this->assertSame(500 - OcrCreditService::MAIL_COST, $this->balance());
        $this->assertSame(-0.2, (float) DB::table('ocr_credit_transactions')
            ->where('company_id', $this->company->id)->whereNotNull('email_message_id')->value('amount'));
    }

    /**
     * 🔴 Ten mails are exactly 2.00 credits, not 1.9999999999999998. The ledger is DECIMAL and
     * every balance is rounded before it is stored, so float arithmetic cannot accumulate in it.
     */
    public function test_fractional_charges_do_not_drift(): void
    {
        $this->fakeAnswer('outsider', 'nothing_for_us', 0.95);

        for ($i = 0; $i < 10; $i++) {
            $this->filed('Notice ' . $i, 'Body ' . $i);
        }

        $this->assertSame(498.0, $this->balance());
    }

    /** A call that fails costs the tenant nothing, and the mail still lands somewhere findable. */
    public function test_a_failed_call_is_refunded_and_the_mail_falls_to_other(): void
    {
        Http::fake(['*/decisions' => Http::response(['error' => ['message' => 'overloaded']], 529)]);

        $result = $this->filed('Hello', 'Please quote the best rate');

        $this->assertSame(['other', 'none'], [$result['classification'], $result['source']]);
        $this->assertSame(500.0, $this->balance());
        $this->assertSame(1, DB::table('ocr_credit_transactions')
            ->where('company_id', $this->company->id)->where('transaction_type', 'refund')->count());
    }

    /** Out of credits is a duller inbox, not a broken one: nothing is called and nothing is charged. */
    public function test_a_tenant_out_of_credits_is_not_charged_and_is_not_called(): void
    {
        DB::table('companies')->where('id', $this->company->id)
            ->update(['ocr_credits_balance' => -20, 'ocr_credits_limit' => -20]);
        Http::fake();

        $result = $this->filed('Hello', 'Please quote the best rate');

        $this->assertSame(['other', 'none'], [$result['classification'], $result['source']]);
        $this->assertSame(-20.0, $this->balance());
        Http::assertNothingSent();
    }

    // ─── The rubric's acceptance set ─────────────────────────────────────────

    /**
     * 🔴 **NOT AN ASSERTION ABOUT THE MODEL.** Real mail from the first live inbox, kept here so
     * that a change to `config/mail_intent.criteria` has something concrete to be replayed
     * against. Each line is a mail that the regex got wrong at least once, and the comment is
     * the reason it is hard: the discriminating fact is never a word, it is who is asking whom.
     *
     * The test itself only pins that every expected folder is one the inbox can actually show —
     * a rubric key that has drifted from EmailInboxController::CLASSIFICATIONS files mail into
     * a folder no view lists, and the thread simply disappears.
     */
    public function test_the_samples_the_rubric_has_to_get_right(): void
    {
        $samples = [
            // Asking US for a price — the folder that mints a number.
            ['customer_enquiry', 'Hello', 'Can you please quote for 2 shipments next week'],
            ['customer_enquiry', 'Hello', 'Kindly share your best rates'],
            ['customer_enquiry', 'BLR JFK AC Booking RFQ', 'Dear Sir,'],
            // No request written out at all: the cargo IS the request.
            ['customer_enquiry', 'Hi', "BLR-ORD\nPCS : 21\nWEIGHT : 300 kgs\nGeneral cargo"],
            // OUR OWN quotation, which contains every word a quote request does.
            ['other', 'Commercial Quotation – Focus Air By F16s | MG Logistics', 'As discussed, please find below the commercial quotation for Focus Air, the web-based air freight platform'],
            ['other', 'Re: E-AWB Compliance with F16s E-freight Solutions Proposal', 'Thank you for your response. Please find the clarifications and our best commercial offer below.'],
            // "Rate" as a verb, not a noun.
            ['other', 'Rate your support experience - SR-6987568: FNA received', 'Your feedback matters! Please take a moment to rate your recent support experience.'],
            ['other', 'Your Lusha Account Will Close in 30 Days', 'Your Lusha account is scheduled for closure in 30 days due to inactivity.'],
            // Carrier traffic carrying cargo figures — a shipment already flying, not one being quoted.
            ['airline', 'FNA 607-53138691', 'Please note below FNA received. 607-53138691 / SKYLINK FREIGHT FORWARDERS LTD / 0 HAWB / BOM / Mumbai / TLV / Tel Aviv Yafo / 1 / 12.6 KGM'],
            ['airline', 'Re: AWB NO:176-28955006', 'FWB/FHL processed successfully. Sl / AWB Number / Client / HAWB Count / Origin / Destination / Pcs / Weight / Time & Date Sent'],
        ];

        $folders = \App\Http\Controllers\Freight\EmailInboxController::CLASSIFICATIONS;

        foreach ($samples as [$expected, $subject, $body]) {
            $this->assertContains($expected, $folders, $subject);
        }

        // 🔴 Every (sender, intent) pair the model can return must route to a folder the inbox
        // can actually show. A rubric option added without a routing arm, or a folder renamed
        // without the routing following, files mail where no view lists it and the thread
        // vanishes — which no amount of model accuracy would ever surface.
        $route = new \ReflectionMethod(\App\Services\Mail\MailIntentClassifier::class, 'route');
        $classifier = app(\App\Services\Mail\MailIntentClassifier::class);

        foreach (array_keys(config('mail_intent.questions.sender.criteria')) as $sender) {
            foreach (array_keys(config('mail_intent.questions.intent.criteria')) as $intent) {
                $this->assertContains($route->invoke($classifier, $sender, $intent), $folders, "{$sender} + {$intent}");
            }
        }
    }
}
