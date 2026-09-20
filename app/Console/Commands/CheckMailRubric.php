<?php

namespace App\Console\Commands;

use App\Services\JevClient;
use App\Services\Mail\MailIntentClassifier;
use Illuminate\Console\Command;
use ReflectionMethod;
use RuntimeException;

/**
 * Replays the acceptance set against the live model — `php artisan mail:rubric-check`.
 *
 * 🔴 **THIS IS THE ONLY THING THAT MEASURES THE RUBRIC, and it deliberately calls the real
 * model.** The unit tests fake the HTTP and prove the wiring: that a fact outranks an answer,
 * that a low-confidence answer is not acted on, that a failed call is refunded. None of that
 * says whether the prose in config/mail_intent.php actually files mail correctly, and a test
 * that asserted against a stub would only prove the stub.
 *
 * ⚠️ **Run it after EVERY rubric edit, and read the confidence columns, not just the verdict.**
 * A case that passes at 0.39 is one word away from failing; a case that fails at 0.95 means the
 * criteria say something you did not mean. Both matter more than the score.
 *
 * ⚠️ It costs real money — about US$0.0015 for the whole set, on the OPENROUTER_API_KEY in the
 * environment — which is why it is a command somebody runs and not a test that runs itself.
 *
 * ⚠️ **Some of these never reach the model in production.** Airline EDI and mail from our own
 * domain are intercepted by pattern one step earlier (MailFilingService::patternClassification),
 * precisely so they cost nothing. They stay in this set as the BACKSTOP measurement: the pattern
 * is deliberately narrow — an EDI type only counts beside a real waybill number — so anything it
 * does not catch lands on the rubric, and this is where you find out whether the rubric still
 * catches it. A case passing here that the pattern also catches is belt and braces, not waste.
 *
 * ── The samples ────────────────────────────────────────────────────────────
 * Every one is real mail from the first live inbox (joseph@f16sefreight.com, 2026-09-17) or a
 * shape the user named. They were expensive to collect and each is here because something got
 * it wrong at least once. ADD TO THIS LIST whenever a mail is misfiled in production: that is
 * the whole maintenance loop, and a misfile nobody wrote down is one that comes back.
 */
class CheckMailRubric extends Command
{
    protected $signature = 'mail:rubric-check {--json : machine-readable output}';

    protected $description = 'Replay the mail-filing acceptance set against the live decision model';

    /** [expected folder, subject, body] */
    private const SAMPLES = [
        ['customer_enquiry', 'Hello', 'Can you please quote for 2 shipments next week'],
        ['customer_enquiry', 'Hello', 'Kindly share your best rates'],
        ['customer_enquiry', 'BLR JFK AC Booking RFQ', 'Dear Sir,'],
        ['customer_enquiry', 'Hi', "BLR-ORD\nPCS : 21\nWEIGHT : 300 kgs\nGeneral cargo"],
        ['client_shipment', 'Rates for Chennai-Dubai', 'Please share the confirmed booking schedule. Agreed rate 350++, Pcs 400, Gross wgt 17400kgs'],
        // Our OWN quotation, which contains every word a quote request does.
        ['other', 'Commercial Quotation – Focus Air By F16s | MG Logistics', 'As discussed, please find below the commercial quotation for Focus Air, the web-based air freight platform'],
        ['other', 'Re: E-AWB Compliance with F16s E-freight Solutions Proposal', 'Thank you for your response. Please find the clarifications and our best commercial offer below.'],
        // "Rate" as a verb, not a noun.
        ['other', 'Rate your support experience - SR-6987568: FNA received', 'Your feedback matters! Please take a moment to rate your recent support experience.'],
        ['other', 'Your Lusha Account Will Close in 30 Days', 'Your Lusha account is scheduled for closure in 30 days due to inactivity.'],
        ['other', 'Webinar', 'Join our webinar next week'],
        // A figure is not a request — this one MINTS a document number if read as an enquiry.
        ['other', 'Re: fit', 'about 480 kg'],
        // Airline EDI that names a forwarder in its payload.
        ['airline', 'FNA 607-53138691', 'Please note below FNA received. 607-53138691 / SKYLINK FREIGHT FORWARDERS LTD / 0 HAWB / BOM / Mumbai / TLV / Tel Aviv Yafo / 1 / 12.6 KGM'],
        ['airline', 'Re: AWB NO:176-28955006', 'FWB/FHL processed successfully. Sl / AWB Number / Client / HAWB Count / Origin / Destination / Pcs / Weight / Time & Date Sent'],
        ['overseas_agent', 'Pre-alert SIN-BOM', 'Pre-alert: HAWB SGBOM4471, 3 pcs 120 kgs, MAWB 618-12345678. Docs attached. Please arrange clearance and delivery to consignee.'],
        ['customer_enquiry', 'Import rate FRA-BOM', 'We have a client shipping FRA-BOM around 500 kgs monthly. Please quote your best import rate so we can offer.'],
        ['vendor_invoice', 'Invoice AI/2026/4412', 'Please find attached our invoice AI/2026/4412 against AWB 098-33445566, amount INR 84,200. Kindly arrange payment within 15 days.'],
        ['vendor_invoice', 'Bill for vehicle placement', 'Attached our bill for vehicle placement BOM-Pune on 16/09, Rs 12,500 plus GST.'],
        ['payment_advice', 'Payment released', 'We have released payment of INR 2,45,000 against your invoices INV-1182 and INV-1190. UTR HDFC2026091812345.'],
        // 🔐 `other`, NOT vendor_invoice. It names nobody, and vendor_invoice routes to accounts —
        // an unidentifiable demand for payment is the exact shape of invoice fraud.
        ['other', 'Reminder: invoice 552 overdue', 'Gentle reminder that our invoice 552 dated 10/08 is overdue by 30 days. Please confirm payment date.'],
        ['claim', 'Shortage on delivery BOM-JFK', 'On delivery 2 cartons were found torn and 8 kgs short against the packing list. We are lodging a claim; please advise your insurer.'],
        ['cfs_warehouse', 'Gate-in MSKU1234567', 'Container MSKU1234567 gated in at our CFS on 18/09. Destuffing scheduled 20/09. Free storage days expire 22/09.'],
        ['regulatory', 'ICEGATE: BE 7788990 assessed', 'Bill of Entry 7788990 dated 18.09.2026 has been assessed. Duty payable INR 1,12,400. Please pay through ICEGATE to proceed.'],
        ['client_shipment', 'Update on BOM-JFK?', 'Any update on our shipment BOM-JFK, AWB 176-55667788? Our customer is asking for a delivery date.'],
        ['clearance', 'Docs needed for BE filing', 'Please send the original bill of lading and packing list so we can file the Bill of Entry tomorrow.'],
        ['shipping_line', 'Revised sailing MV Maersk Chennai', 'Vessel MV Maersk Chennai has been rescheduled, new ETD 22/09. Your booking BKG998877 is confirmed on the revised sailing.'],
    ];

    public function handle(JevClient $jev, MailIntentClassifier $classifier): int
    {
        if (! $jev->configured()) {
            $this->error('The decision model is not configured (no OPENROUTER_API_KEY).');

            return self::FAILURE;
        }

        $questions = array_map(
            fn (array $q) => JevClient::choice($q['instructions'], $q['criteria']),
            config('mail_intent.questions')
        );
        // The real routing and the real confidence floors — measuring anything else would be
        // measuring a copy of the logic that can drift from the one in use.
        $read = new ReflectionMethod(MailIntentClassifier::class, 'read');

        $rows = [];
        $passed = 0;
        $cost = 0.0;
        $ms = 0;
        $tokens = 0;

        foreach (self::SAMPLES as [$expected, $subject, $body]) {
            try {
                $answer = $jev->ask(['from' => 'someone@unknown.test', 'subject' => $subject, 'body' => $body], $questions, 20);
            } catch (RuntimeException $e) {
                $this->error("{$subject}: {$e->getMessage()}");

                return self::FAILURE;
            }

            $got = $read->invoke($classifier, $answer['answers'])['classification'] ?? '(refused)';
            $hit = $got === $expected;
            $passed += $hit ? 1 : 0;
            $cost += $answer['usage']['cost_usd'];
            $ms += $answer['usage']['execution_ms'];
            $tokens += $answer['usage']['tokens_in'];

            $rows[] = [
                'ok' => $hit,
                'expected' => $expected,
                'got' => $got,
                'sender' => $answer['answers']['sender']['choice'] ?? '?',
                'sender_confidence' => round((float) ($answer['answers']['sender']['confidence'] ?? 0), 2),
                'intent' => $answer['answers']['intent']['choice'] ?? '?',
                'intent_confidence' => round((float) ($answer['answers']['intent']['confidence'] ?? 0), 2),
                'subject' => $subject,
            ];
        }

        $n = count(self::SAMPLES);

        if ($this->option('json')) {
            $this->line(json_encode([
                'rubric' => config('mail_intent.rubric_version'), 'model' => config('mail_intent.model'),
                'passed' => $passed, 'total' => $n, 'cost_usd' => round($cost, 6), 'results' => $rows,
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

            return $passed === $n ? self::SUCCESS : self::FAILURE;
        }

        $this->table(
            ['', 'expected', 'got', 'sender', 'conf', 'intent', 'conf', 'subject'],
            array_map(fn ($r) => [
                $r['ok'] ? '<info>ok</info>' : '<error>FAIL</error>',
                $r['expected'], $r['got'], $r['sender'], $r['sender_confidence'],
                $r['intent'], $r['intent_confidence'], mb_substr($r['subject'], 0, 34),
            ], $rows)
        );

        $this->newLine();
        $this->line(sprintf(
            '<comment>%s</comment> · rubric %s · %d/%d · US$%.6f (%.6f each) · %d tokens in · %dms average',
            $passed === $n ? 'PASS' : 'FAIL', config('mail_intent.rubric_version'),
            $passed, $n, $cost, $cost / $n, (int) ($tokens / $n), (int) ($ms / $n)
        ));

        // ⚠️ The credit rate is derived from the token count above. If it has moved, so has the
        // honest price of filing a mail — see OcrCreditService::MAIL_COST.
        $inr = $cost / $n * 88;
        $this->line(sprintf(
            '  a mail costs ~₹%.4f; a document costs ~₹0.025, so the honest rate is ~%.2f credits (MAIL_COST is %s)',
            $inr, $inr / 0.025, \App\Services\OcrCreditService::MAIL_COST
        ));

        return $passed === $n ? self::SUCCESS : self::FAILURE;
    }
}
