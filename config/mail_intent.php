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
     * 🔴 Below its own floor an answer is not acted on — see MailIntentClassifier::read(), which
     * can still use the other one. The floors live with their questions (below) because
     * `confidence` is how PEAKED a distribution is and therefore scales with how many options it
     * is spread across: nine senders and seven intents do not read on the same scale, and one
     * shared number makes the longer list the stricter test for no reason anybody intended.
     *
     * ⚠️ This is the FALLBACK for a question that does not set its own — and it is deliberately
     * strict rather than permissive. A question added to `questions` without a floor should be
     * hard to act on until somebody measures one for it; defaulting to a low number would let a
     * new, untuned question start filing mail on the strength of nothing.
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
     * 2026-09-20  — one Choice over 13 folders. 13/13 on the acceptance set.
     * 2026-09-20b — TWO Choices, sender and intent, routed to a folder in PHP. See the note
     *               above `questions` for why, and MailIntentClassifier::route() for the table.
     */
    'rubric_version' => '2026-09-20b',

    /*
    |--------------------------------------------------------------------------
    | TWO questions, not one
    |--------------------------------------------------------------------------
    |
    | 🔴 The first rubric asked one question — "which folder?" — and it conflated two
    | independent facts. An airline's flight confirmation and an airline's INVOICE are both
    | "airline"; one belongs to operations and one to accounts, and a single Choice cannot
    | separate them without an option per combination. Thirteen folders as thirteen options
    | also flattens the distribution, and `confidence` measures exactly that flatness: more
    | options mean every answer looks less certain whether or not the model is less certain.
    |
    | So the model answers WHO wrote and WHAT THEY WANT, and `MailIntentClassifier::route()`
    | turns the pair into a folder in PHP. Both questions ride in ONE request — the `state` is
    | sent once and output tokens are free, so the second answer is very nearly free — and each
    | gets its own well-peaked distribution instead of one spread thin.
    |
    | ⚠️ The two are asked SEPARATELY on purpose and their confidences are read separately.
    | TypeSafe is explicit that answers to different questions carry no arithmetic relationship;
    | do not multiply, average or compare these two numbers. What the classifier does instead is
    | use whichever it is sure of — see `route()`.
    |
    | ⚠️ Neither option list may be reordered into meaning. Both are flat sets: a Choice has no
    | notion that `wants_to_book` is "more" than `wants_a_price`. Ordering here is for readers.
    |
    */

    'questions' => [

        'sender' => [
            /*
             * Lower than the intent floor, and not by taste. Nine options: a top option at ~45%
             * against eight others reads as 0.38 here, and that is a real reading, not a coin
             * toss. Measured — at the intent floor, six correct and obvious sender answers in a
             * row (an airline FNA, an agent's rate request, a CHA asking for documents) were
             * discarded and the mail fell to Other.
             */
            'min_confidence' => (float) env('MAIL_INTENT_SENDER_FLOOR', 0.38),

            'instructions' => 'This email arrived in the shared mailbox of a freight forwarder — a company that '
                . 'arranges transport of commercial cargo by air and sea for its clients. Who wrote it? Decide from '
                . 'their role in the shipping chain, not from the subject.',

            'criteria' => [
                'client' => 'A shipper, consignee, exporter, importer or manufacturer whose own cargo we move or '
                    . 'might move — including someone writing to us for the first time.',
                'overseas_agent' => 'A freight forwarder, co-loader or consolidator in another country who works '
                    . 'the other end of our shipments: sending us cargo, receiving ours, or asking our rates to '
                    . 'quote their own client.',
                // ⚠️ The EDI sentence is load-bearing. FNA and FWB/FHL notices quote the
                // forwarder's name in their payload, and without this the model read two real
                // ones as `overseas_agent` at 0.36 and 0.39 and both mails fell to Other.
                'airline' => 'An air cargo carrier, or the cargo handling agent acting for one. A status message '
                    . 'produced by an airline cargo system — FNA, FWB, FHL or FSU — comes from the airline even '
                    . 'when the text of it names a freight forwarder as shipper, agent or consignee.',
                'shipping_line' => 'An ocean carrier, NVOCC or their liner agent.',
                'customs_broker' => 'A customs broker or CHA — a firm that clears cargo, not the authority itself.',
                'transporter' => 'A road haulier, trucking company, transport contractor or driver: vehicle or '
                    . 'trailer placement, lorry and container movement by road, e-way bills, and pickup or '
                    . 'delivery runs between a warehouse, port or airport and a door.',
                'cfs_warehouse' => 'A container freight station, ICD, bonded warehouse, port or airport cargo '
                    . 'terminal, or ground handling agent — whoever physically holds the cargo between legs.',
                'authority' => 'A government or regulatory body: customs itself, ICEGATE, DGFT, a port trust, or '
                    . 'a tax authority.',
                'outsider' => 'Nobody in the shipping chain for our cargo: a company selling us something, a '
                    . 'newsletter, a recruiter or job applicant, a bank, a software vendor, our own staff, or an '
                    . 'automated notice from a system we use.',
            ],
        ],

        'intent' => [
            /* Seven options, and the folder for money or trouble turns on this one alone. */
            'min_confidence' => (float) env('MAIL_INTENT_INTENT_FLOOR', 0.50),

            'instructions' => 'What does the sender of this email want from us? Decide from what they are asking '
                . 'for, not from who they are.',

            'criteria' => [
                // ⚠️ The last sentence is a boundary that was measured, not imagined. Without it a
                // two-word reply reading "about 480 kg" was read as a price request at 0.85 — and
                // that folder MINTS a document number. A figure is not a request.
                'wants_a_price' => 'To find out what we would charge. A request for a rate, a quotation, an offer '
                    . 'or a tariff, or a list of cargo details — pieces, weight, dimensions, a route, a ready '
                    . 'date — sent so that we will price it. Also chasing a quote we have not sent yet. '
                    . 'A short reply that mentions a figure or a measurement but names no cargo, no route and no '
                    . 'request is NOT this.',
                'wants_to_book' => 'To have us move a specific shipment, with the price already settled or not in '
                    . 'question. Shipping instructions, a booking request or confirmation, documents sent so the '
                    . 'shipment can go, or a nomination of cargo to us.',
                'operational_update' => 'To tell us, or ask us, how a shipment already underway is going: flight '
                    . 'or vessel details, an air waybill or bill of lading, arrival and gate messages, a customs '
                    . 'query, a delivery time, a document needed to release the cargo.',
                'wants_money' => 'To be paid by us, or to tell us what we owe: their invoice, a statement of '
                    . 'account, a debit note, a payment reminder or a dunning notice.',
                'sending_money' => 'To tell us that money has been paid to us, or is about to be: a remittance '
                    . 'advice, a payment reference or UTR, a cheque or transfer confirmation, a TDS certificate.',
                'has_a_problem' => 'To raise something that went wrong and is being held against someone: cargo '
                    . 'damaged, short, lost or delayed, an insurance claim, a penalty, or a dispute over an amount '
                    . 'already billed.',
                'nothing_for_us' => 'Nothing to do with a shipment of ours: marketing, a newsletter, an industry '
                    . 'bulletin, a survey or feedback request, a sales pitch, a job application, an internal note, '
                    . 'or an automated system message. Also a fragment so short that what it is about cannot be '
                    . 'told from it at all.',
            ],
        ],

    ],

];
