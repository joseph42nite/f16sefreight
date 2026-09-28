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
    protected $signature = 'mail:rubric-check {--mode= : "sea" replays the sea set against the sea rubric} {--json : machine-readable output}';

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

        // ── Sea (FocusSea, 2026-09-28; GAPS #427). The shapes a sea desk receives all day, so the rubric is
        // measured on them as it was on air's — not assumed to carry over because a few words are shared.
        ['customer_enquiry', 'Rate request 2x40HC Nhava Sheva to Jebel Ali', 'Please quote FCL 2x40HC INNSA-AEJEA, ready 5 Oct, general cargo, about 18 MT per box.'],
        ['customer_enquiry', 'LCL Chennai to Hamburg', 'Need your LCL rate for 3.5 cbm, 6 pallets, 1200 kgs, Chennai to Hamburg, cargo ready next week.'],
        ['customer_enquiry', 'Import rate DEHAM-INNSA', 'We have a client shipping 1x40HC Hamburg to Nhava Sheva every month. Please quote your destination charges so we can offer.'],
        ['client_shipment', 'Booking - 1x20GP Mundra to Rotterdam', 'Please book 1x20GP for our shipment Mundra to Rotterdam at the agreed rate. Cargo ready on the 3rd; shipping instructions attached.'],
        ['client_shipment', 'Draft BL corrections', 'Please find our corrections to the draft bill of lading for container MSKU6874230. Kindly issue the final BL once they are made.'],
        ['shipping_line', 'Arrival notice MSC Gulsun V.245E', 'Arrival notice: vessel MSC Gulsun V.245E, ETA JNPT 24/09. B/L MEDU1234567, 1x40HC. Please arrange the delivery order before discharge.'],
        ['vendor_invoice', 'Freight invoice B/L MEDU1234567', 'Please find attached our ocean freight invoice OF-8812 for B/L MEDU1234567, USD 2,450. Kindly remit so the original B/L can be released.'],
        ['overseas_agent', 'Pre-alert HBL SHNSA7781', 'Pre-alert: HBL SHNSA7781, 2x40HC on CMA CGM Tage V.0AB12, ETA Nhava Sheva 30/09. Documents attached. Please arrange clearance and delivery.'],
        ['trucking_road', 'Container movement JNPT to Bhiwandi', 'Trailer placed for container TCLU1234567 at JNPT; it will reach the Bhiwandi warehouse by 6 pm. E-way bill attached.'],
        ['clearance', 'Shipping bill filed 4455667', 'We have filed shipping bill 4455667 for your container MSKU6874230. Please send the VGM declaration and the final invoice copy.'],
        ['regulatory', 'ICEGATE: IGM 2233445 filed', 'IGM 2233445 for vessel MSC Gulsun V.245E at INNSA has been filed and accepted by customs.'],
        ['claim', 'Container damaged at Jebel Ali', 'Container TCLU1234567 arrived at Jebel Ali with water damage to 12 cartons. We are lodging a claim; please notify the carrier and your insurer.'],
    ];

    /**
     * The sea desk's set, against the SEA rubric (owner, 2026-09-28: "those types of emails will be different").
     * Shipping instructions, VGM, rollovers, container release, empty return, arrival notices, delivery orders,
     * detention and demurrage — the mail a sea desk lives in, which the shared set barely touches.
     */
    private const SEA_SAMPLES = [
        ['customer_enquiry', 'Rate request 2x40HC Nhava Sheva to Jebel Ali', 'Please quote FCL 2x40HC INNSA-AEJEA, ready 5 Oct, general cargo, about 18 MT per box.'],
        ['customer_enquiry', 'LCL Chennai to Hamburg', 'Need your LCL rate for 3.5 cbm, 6 pallets, 1200 kgs, Chennai to Hamburg, cargo ready next week.'],
        ['customer_enquiry', 'Import rate DEHAM-INNSA', 'We have a client shipping 1x40HC Hamburg to Nhava Sheva every month. Please quote your destination charges so we can offer.'],
        ['customer_enquiry', 'Re: FCL quote Mundra-Felixstowe', 'Still waiting for your rate on the 3x40HC Mundra to Felixstowe. Our cargo is ready on the 10th.'],
        ['client_shipment', 'Booking - 1x20GP Mundra to Rotterdam', 'Please book 1x20GP for our shipment Mundra to Rotterdam at the agreed rate. Cargo ready on the 3rd; shipping instructions attached.'],
        ['client_shipment', 'SI for booking MAEU261234567', 'Please find our shipping instructions for booking MAEU261234567: shipper, consignee, notify, 20 packages, marks as per invoice.'],
        // A VGM figure about a booked box is NOT a price request — the sea twin of air's "about 480 kg".
        ['client_shipment', 'VGM - MSKU6874230', 'VGM for container MSKU6874230 under booking MAEU261234567: 24,380 kg, method 1. Signed declaration attached.'],
        ['client_shipment', 'Draft BL corrections', 'Please find our corrections to the draft bill of lading for container MSKU6874230. Kindly issue the final BL once they are made.'],
        ['client_shipment', 'Telex release please', 'Payment is done from our buyer. Please arrange the telex release for BL SHNSA7781 today.'],
        ['shipping_line', 'Booking confirmation MAEU261234567', 'Booking MAEU261234567 confirmed: 2x40HC, MAERSK KOLKATA V.412W, ETD Nhava Sheva 04/10, SI cut-off 01/10 12:00, VGM cut-off 02/10.'],
        ['shipping_line', 'Rollover notice MAEU261234567', 'Due to space constraints your booking MAEU261234567 has been rolled over to MAERSK KENSINGTON V.415W, ETD 11/10.'],
        ['shipping_line', 'Empty release MAEU261234567', 'Empty release issued for booking MAEU261234567: 2x40HC, pick up from Speedy CFS empty yard, valid until 03/10.'],
        ['shipping_line', 'Arrival notice MSC Gulsun V.245E', 'Arrival notice: vessel MSC Gulsun V.245E, ETA JNPT 24/09. B/L MEDU1234567, 1x40HC. Please arrange the delivery order before discharge.'],
        ['vendor_invoice', 'Freight invoice B/L MEDU1234567', 'Please find attached our ocean freight invoice OF-8812 for B/L MEDU1234567, USD 2,450. Kindly remit so the original B/L can be released.'],
        ['vendor_invoice', 'Detention invoice MSKU6874230', 'Container MSKU6874230 returned 6 days after free time. Please find our detention invoice DT-4471 for INR 38,400.'],
        ['overseas_agent', 'Pre-alert HBL SHNSA7781', 'Pre-alert: HBL SHNSA7781, 2x40HC on CMA CGM Tage V.0AB12, ETA Nhava Sheva 30/09. Documents attached. Please arrange clearance and delivery.'],
        ['trucking_road', 'Container movement JNPT to Bhiwandi', 'Trailer placed for container TCLU1234567 at JNPT; it will reach the Bhiwandi warehouse by 6 pm. E-way bill attached.'],
        ['trucking_road', 'Empty returned TCLU1234567', 'Empty container TCLU1234567 returned to the Maersk yard at Nhava Sheva this morning. EIR copy attached.'],
        ['cfs_warehouse', 'Destuffing done MSKU1234567', 'Container MSKU1234567 destuffed at our CFS today, 40 packages in good order. Free storage till 2 Oct.'],
        ['clearance', 'Shipping bill filed 4455667', 'We have filed shipping bill 4455667 for your container MSKU6874230. Please send the VGM declaration and the final invoice copy.'],
        ['regulatory', 'ICEGATE: IGM 2233445 filed', 'IGM 2233445 for vessel MSC Gulsun V.245E at INNSA has been filed and accepted by customs.'],
        ['payment_advice', 'Payment for BL SHNSA7781', 'We have paid INR 1,86,000 against your invoice INV-DEMOBOM-26-0144 for BL SHNSA7781. UTR ICIC2026092811223.'],
        ['claim', 'Container damaged at Jebel Ali', 'Container TCLU1234567 arrived at Jebel Ali with water damage to 12 cartons. We are lodging a claim; please notify the carrier and your insurer.'],
        ['claim', 'Disputing demurrage on BL MEDU1234567', 'We do not accept the demurrage on BL MEDU1234567 — the delay was the terminal congestion, not ours. Please withdraw the charge.'],
        ['other', 'Webinar: the future of container shipping', 'Join our webinar next week on how digital freight platforms are changing container shipping.'],
    ];

    public function handle(JevClient $jev, MailIntentClassifier $classifier): int
    {
        $mode = $this->option('mode') === 'sea' ? 'sea' : null;
        $rubric = MailIntentClassifier::rubricFor($mode);
        $samples = $mode === 'sea' ? self::SEA_SAMPLES : self::SAMPLES;

        if (! $jev->configured()) {
            $this->error('The decision model is not configured (no OPENROUTER_API_KEY).');

            return self::FAILURE;
        }

        $questions = array_map(
            fn (array $q) => JevClient::choice($q['instructions'], $q['criteria']),
            $rubric['questions']
        );
        // The real routing and the real confidence floors — measuring anything else would be
        // measuring a copy of the logic that can drift from the one in use.
        $read = new ReflectionMethod(MailIntentClassifier::class, 'read');

        $rows = [];
        $passed = 0;
        $cost = 0.0;
        $ms = 0;
        $tokens = 0;

        foreach ($samples as [$expected, $subject, $body]) {
            try {
                $answer = $jev->ask(['from' => 'someone@unknown.test', 'subject' => $subject, 'body' => $body], $questions, 20);
            } catch (RuntimeException $e) {
                $this->error("{$subject}: {$e->getMessage()}");

                return self::FAILURE;
            }

            $got = $read->invoke($classifier, $answer['answers'], $mode)['classification'] ?? '(refused)';
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

        $n = count($samples);

        if ($this->option('json')) {
            $this->line(json_encode([
                'rubric' => $rubric['version'], 'model' => config('mail_intent.model'),
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
            $passed === $n ? 'PASS' : 'FAIL', $rubric['version'],
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
