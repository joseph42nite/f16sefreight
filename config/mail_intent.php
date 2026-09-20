<?php

/*
|--------------------------------------------------------------------------
| What an inbound mail is about — the rubric Jev answers against
|--------------------------------------------------------------------------
|
| 🔴 THIS FILE IS THE CLASSIFIER. The PHP around it is plumbing: it posts the
| `state` and these `criteria` to the model and reads back a choice. To change how
| mail is filed you edit the prose here, bump `rubric_version`, and watch the
| override rate in Super Admin → Mail filing. Nothing in app/ needs touching, and
| the diff of a filing change is a diff of English.
|
| ⚠️ **Bump `rubric_version` on EVERY wording change.** It is stamped on each
| decision (`email_threads.auto_classification_rubric`), so "the overrides spiked
| on the 3rd" can be answered with "because the rubric changed on the 3rd".
| Without it the accuracy telemetry measures a moving target and says nothing.
|
| ── Why prose and not patterns ─────────────────────────────────────────────
| The regex this replaced could match "please quote" but never tell OUR OWN
| quotation ("the commercial quotation for Focus Air") from a client asking for
| one, because both contain the word. The criteria below say which is which in
| the words a new ops hire would be told, which is also the form the model reads
| best.
|
| ── Writing criteria that hold (TypeSafe, jev-1.13 jaggedness) ─────────────
| The model is LITERAL: it answers the question written, not the one meant. So
| each option states the boundary case that actually misfired rather than a
| definition. It is also bad at arithmetic and dates — nothing here asks for
| either; cargo figures stay with the regexes in MailFilingService,
| which read a number off the page instead of judging one.
|
*/

return [

    /*
     * The master switch. OFF files every mail that no rule, client domain or platform
     * directory entry matched as `other` — which is what the product did before the
     * model, minus the regex's false positives. Nothing breaks; filing just gets duller.
     */
    'enabled' => (bool) env('MAIL_INTENT_AI', true),

    /*
     * 🔴 A DECISION MODEL, NOT A CHAT MODEL. Jev returns a typed choice with a
     * probability for every option and no prose at all, over OpenRouter's Decisions API
     * — a different endpoint and a different body from /chat/completions (see JevClient).
     * `~typesafe/jev-latest` follows the family; the pinned version is what we measure
     * against, so the rubric's accuracy numbers mean something.
     */
    'model' => env('JEV_MODEL', 'typesafe/jev-1.13'),

    /*
     * Seconds. Jev answers in about a quarter of a second, so this is not a budget — it is
     * the point at which we stop waiting and file the mail as `other`. Mail sync must not
     * stall behind a model.
     */
    'timeout' => (int) env('JEV_TIMEOUT', 4),

    /*
     * 🔴 Below this, the answer is not used and the mail is filed `other` for a person to
     * re-file (user, 2026-09-17: "when confidence is low just put it in other").
     *
     * `confidence` is how PEAKED the distribution is, not how likely the winner is: a mail
     * that is genuinely half airline notice and half enquiry comes back at ~0.2 with a
     * perfectly reasonable `choice`, and acting on it would file a coin toss. TypeSafe's
     * own floor for "genuinely uncertain" is 0.5; 0.6 buys a margin on a decision that
     * mints a document number.
     */
    'min_confidence' => (float) env('MAIL_INTENT_MIN_CONFIDENCE', 0.60),

    /*
     * How much of the mail the model sees. Accuracy FALLS as unrelated text is added
     * (context rot), and a quoted thread below a two-line reply is mostly unrelated text.
     * The subject plus the snippet the poller already stores is the whole shipment ask in
     * nearly every real enquiry.
     */
    'max_body_chars' => (int) env('MAIL_INTENT_MAX_BODY', 2000),

    /*
     * Stamped on every decision. Bump it whenever anything below this line changes.
     *
     * 2026-09-20 — 13/13 on the acceptance set in EnquiryPatternsTest (US$0.0005, 573ms average).
     * Two sentences in this rubric were written BY that run rather than guessed at:
     *   - "the rate is already agreed and they are now asking us to book" — without it, a client
     *     writing "Agreed rate 350++, please share the confirmed booking schedule" came back at
     *     0.59 confidence and fell below the floor. The model had the right answer and no
     *     permission to be sure of it.
     *   - "a short reply that mentions a figure but names no cargo, no route and no request" —
     *     without it, a two-word reply reading "about 480 kg" was filed as an enquiry at 0.85 and
     *     would have minted a document number. With it, 0.44, which the floor turns into Other.
     * Both are the same lesson, and the one TypeSafe's own jaggedness notes lead with: the model
     * answers the question written, so a boundary that is not written is not a boundary.
     */
    'rubric_version' => '2026-09-20',

    'instructions' => 'This email arrived in the shared mailbox of a freight forwarder — a company that arranges '
        . 'transport of commercial cargo by air and sea for its clients. Which folder does it belong in? '
        . 'Decide from what the sender wants from us, not from the words they happen to use.',

    /*
     * ⚠️ The keys ARE the stored classification. They must stay in step with
     * EmailInboxController::CLASSIFICATIONS — a key that is not in that list files mail
     * into a folder the inbox cannot show, and the thread disappears from every view.
     *
     * The full vocabulary is offered, not the per-mode subset: at ingestion the transport
     * mode is genuinely unknown (one mailbox serves air and sea), and withholding
     * `shipping_line` from an air branch would push every ocean carrier's mail into
     * `other` rather than into a folder the operator can re-file from.
     */
    'criteria' => [

        // The one that mints a number. Every boundary here is a mail that was misfiled.
        'customer_enquiry' => 'A client, prospect or overseas agent asking US to move cargo, or asking what we '
            . 'would charge to move it. Includes a request for a rate, a quotation, an offer, space or a booking, '
            . 'and includes a bare list of shipment details — pieces, weight, dimensions, a route, a ready date — '
            . 'with no request written out, because sending us the cargo IS the request. '
            . 'It is still this folder when they are chasing a quote we have not sent, or replying about one we have, '
            . 'and when the rate is already agreed and they are now asking us to book, to confirm space, or to send '
            . 'the booking schedule. '
            . 'It is NOT this folder when the quotation or offer is one WE sent them, when they are selling '
            . 'something to us, when they ask us to rate their service, or when the mail is a short reply that '
            . 'mentions a figure but names no cargo, no route and no request.',

        'airline' => 'An air cargo carrier, or the handling agent acting for one, writing about our own shipments '
            . 'or about the space we buy: flight and space confirmations, air waybill matters, FNA / FWB / FHL '
            . 'status messages, arrival and discrepancy notices, and the rate sheets and schedules carriers publish '
            . 'to forwarders.',

        'shipping_line' => 'An ocean carrier or NVOCC writing about sea freight: container bookings, bills of '
            . 'lading, vessel schedules and sailings, rollovers, detention and demurrage.',

        'clearance' => 'A customs broker, CHA or customs authority writing about clearing a shipment: bills of '
            . 'entry, shipping bills, duty, documents customs has asked for, examination and release.',

        'trucking_road' => 'A road transporter or haulier writing about moving cargo by road: pickup and delivery, '
            . 'vehicle or trailer placement, e-way bills, and drivers at a gate.',

        // 🔴 The catch-all carries its OWN examples, because "none of the above" is not a
        // description a model can match against — every real misfile below started life as
        // something that merely resembled one of the folders above.
        'other' => 'Anything else, including: a quotation, proposal or offer WE sent to a client; a vendor or '
            . 'software company selling something to us; a survey or feedback request asking us to rate someone\'s '
            . 'service; newsletters, marketing and industry news; job applications; bank, tax, utility and '
            . 'government correspondence; invoices addressed to us; internal mail between our own staff; and '
            . 'automated notices from systems we use.',
    ],

];
