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
     * 2026-09-28  — sea (GAPS #427): twelve sea mails added to the acceptance set; one missed — an
     *               agent's sea pre-alert naming the vessel read as the shipping line (0.43). The agent and
     *               carrier criteria now say which bill each one issues.
     * 2026-09-29  — import triage (owner, GAPS #437): a THIRD question, `direction`, asked in the same request.
     *               A mail that names its lane is decided by the lane instead (a fact — ShipmentDirection).
     * 2026-09-29b — compacted (owner: "make sure the Jev prompt is not too long"): ~1,260 → ~830 tokens, and the
     *               direction question is not sent when a lane answers it (~680). Every measured boundary sentence
     *               kept in substance; the rest shortened. Re-measure.
     * 2026-10-04  — measured on the live model: 39/40 — "BLR JFK AC Booking RFQ" (an airport pair, nothing else)
     *               lost its direction at 0.53 < 0.60. Restored the two phrases the compaction cut: "ports or
     *               airports named" and export's "from an Indian origin to an overseas destination".
     * 2026-10-04b — import's "an overseas shipper or agent sending it to a buyer here" restored too (the last #438
     *               cut): Pre-alert SIN-BOM 0/5 → 2/5 (direction 0.55–0.70), nothing else moved. GAPS #453.
     */
    'rubric_version' => '2026-10-04b',

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

            'instructions' => 'Email to a freight forwarder (air and sea cargo). Who wrote it? Judge their role in the '
                . 'shipping chain, not the subject.',

            'criteria' => [
                'client' => 'A shipper, consignee, exporter, importer or manufacturer whose own cargo we move or might '
                    . 'move, including a first-time sender.',
                // ⚠️ The pre-alert sentence is measured: a sea pre-alert naming the vessel read as the
                // shipping line at 0.43 until it said so (2026-09-28).
                'overseas_agent' => 'A forwarder, co-loader or consolidator abroad working the other end of our '
                    . 'shipments, or asking our rates for its own client. A pre-alert giving HBL or HAWB numbers for '
                    . 'cargo they shipped to us is from the agent, even when it names the vessel or carrier.',
                // ⚠️ The EDI sentence is load-bearing. FNA and FWB/FHL notices quote the
                // forwarder's name in their payload, and without this the model read two real
                // ones as `overseas_agent` at 0.36 and 0.39 and both mails fell to Other.
                'airline' => 'An air cargo carrier or its handling agent. An FNA, FWB, FHL or FSU status message is '
                    . 'from the airline even when it names a forwarder as shipper, agent or consignee.',
                'shipping_line' => 'An ocean carrier, NVOCC or liner agent: operates the vessel, issues the master '
                    . 'bill (MBL), confirms bookings and sailings, sends arrival notices and invoices for its bills.',
                'customs_broker' => 'A customs broker or CHA: a firm that clears cargo, not customs itself.',
                'transporter' => 'A road haulier, trucker or driver: vehicle placement, cargo or containers by road, '
                    . 'e-way bills, pickups and deliveries.',
                'cfs_warehouse' => 'A CFS, ICD, bonded warehouse, port or airport cargo terminal, or ground handler: '
                    . 'whoever holds the cargo between legs.',
                'authority' => 'A government body: customs, ICEGATE, DGFT, a port trust or a tax authority.',
                'outsider' => 'Nobody in our cargo chain: a vendor, newsletter, recruiter or applicant, bank, our own '
                    . 'staff, or an automated system notice.',
            ],
        ],

        'intent' => [
            /* Seven options, and the folder for money or trouble turns on this one alone. */
            'min_confidence' => (float) env('MAIL_INTENT_INTENT_FLOOR', 0.50),

            'instructions' => 'What does the sender want from us? Judge the request, not the sender.',

            'criteria' => [
                // ⚠️ The last sentence is a boundary that was measured, not imagined. Without it a
                // two-word reply reading "about 480 kg" was read as a price request at 0.85 — and
                // that folder MINTS a document number. A figure is not a request.
                'wants_a_price' => 'Our price: a rate, quote or tariff request, or cargo details (pieces, weight, '
                    . 'size, route, ready date) sent for pricing, or chasing an unsent quote. A short reply with a '
                    . 'figure but no cargo, route or request is NOT this.',
                'wants_to_book' => 'Us to move a specific shipment, price settled: shipping instructions, a booking, '
                    . 'documents so it can go, or a cargo nomination.',
                'operational_update' => 'News or a question on a shipment underway: flight or vessel, AWB or BL, '
                    . 'arrival, a customs query, delivery time, release documents.',
                'wants_money' => 'Payment from us: their invoice, statement, debit note or payment reminder.',
                'sending_money' => 'Money paid or about to be paid to us: remittance advice, UTR, cheque or transfer '
                    . 'confirmation, TDS certificate.',
                'has_a_problem' => 'A complaint: cargo damaged, short, lost or delayed, an insurance claim, a penalty, '
                    . 'or a disputed bill.',
                'nothing_for_us' => 'Not about our shipments: marketing, newsletter, survey, sales pitch, job '
                    . 'application, internal note, system message, or a fragment too short to tell.',
            ],
        ],

        /*
         * Import or export (owner, 2026-09-29: "have the mail triage for import from Jev too, for sea and air").
         * NOT SENT when the mail names its lane — a lane is a fact and outranks this (ShipmentDirection), so an
         * answer to it would be paid for and thrown away. Three options; kept only above this floor, export default.
         */
        'direction' => [
            'min_confidence' => (float) env('MAIL_INTENT_DIRECTION_FLOOR', 0.60),

            'instructions' => 'We are in India. Is the cargo coming into India or leaving it? Judge the route, the ports '
                . 'or airports named, and words like pre-alert, arrival or delivery order, not where the sender is.',

            'criteria' => [
                'import' => 'Inbound to India: an overseas shipper or agent sending it to a buyer here, a pre-alert, '
                    . 'arrival notice, delivery order or clearance here, or a rate for cargo from abroad.',
                'export' => 'Outbound from India: a booking or rate request from an Indian origin to an overseas '
                    . 'destination, shipping instructions or a shipping bill for cargo going abroad.',
                'cannot_tell' => 'No direction given: an invoice or payment without a route, a general question, or no '
                    . 'shipment.',
            ],
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | The SEA rubric — its own, not air's (owner, 2026-09-28)
    |--------------------------------------------------------------------------
    |
    | 🔴 "Those types of emails will be different." A sea desk's day is shipping instructions,
    | VGM, booking confirmations and rollovers, container release and empty return, arrival
    | notices and delivery orders, detention and demurrage — none of which the rubric above was
    | written around. A mailbox whose owner works FocusSea is read against THIS (MailboxMode);
    | an air mailbox, and a mixed one, against the rubric above.
    |
    | ⚠️ Same option KEYS as above, different prose. The keys are the routing vocabulary
    | (MailIntentClassifier::route()), and the folders are the same folders on both desks; what
    | differs is what each option means in a sea mail, which is what the model reads. There is
    | no `airline` sender here: a sea desk has none.
    |
    | ⚠️ Measured on its own set: `php artisan mail:rubric-check --mode=sea`. Bump its OWN version
    | on every wording change — it is stamped on each decision like the air one.
    |
    | sea-2026-09-28  — first sea rubric. 25/25 on its own set.
    | sea-2026-09-28b — the EIR sentence on `transporter` (an empty-return mail read at 0.43).
    | sea-2026-09-29  — import triage: the `direction` question, in sea's words (GAPS #437).
    | sea-2026-09-29b — compacted, as the shared rubric (~1,340 → ~910 tokens). Re-measure.
    */
    'sea' => [
        'rubric_version' => 'sea-2026-09-29b',

        'questions' => [

            'sender' => [
                // Eight options, so a real reading sits a little higher than across air's nine.
                'min_confidence' => (float) env('MAIL_INTENT_SEA_SENDER_FLOOR', 0.38),

                'instructions' => 'Email to a freight forwarder\'s ocean desk (FCL and LCL). Who wrote it? Judge their '
                    . 'role in the ocean shipping chain, not the subject.',

                'criteria' => [
                    'client' => 'An exporter, importer, shipper, consignee or manufacturer whose own cargo we move or '
                        . 'might move by sea, including a first-time sender and their staff sending SI, VGM or draft '
                        . 'BL corrections.',
                    'overseas_agent' => 'A forwarder or consolidator abroad working the other end of our sea shipments, '
                        . 'or asking our rates for its own client. A pre-alert giving HBL numbers for cargo they '
                        . 'shipped to us is from the agent, even when it names the vessel or carrier.',
                    'shipping_line' => 'An ocean carrier, NVOCC or liner agent: operates the vessel, issues the master '
                        . 'BL, confirms or rolls bookings, sends schedules and cut-offs, releases empties, and sends '
                        . 'arrival notices, DOs and freight, detention or demurrage invoices for its bills.',
                    'customs_broker' => 'A customs broker or CHA: files shipping bills and bills of entry, not customs '
                        . 'itself.',
                    // ⚠️ The EIR sentence is measured: "empty returned, EIR attached" read as the haulier at only
                    // 0.43 without it (sea-2026-09-28).
                    'transporter' => 'A container haulier, trucker or driver: trailer placement, moving boxes between '
                        . 'factory, CFS, ICD and port, returning empties, e-way bills. A haulier that returned a box '
                        . 'sends the EIR (equipment interchange receipt) as proof.',
                    'cfs_warehouse' => 'A CFS, ICD, container terminal, empty yard, depot or bonded warehouse: gate-in '
                        . 'and gate-out, stuffing and destuffing, free days.',
                    'authority' => 'A government body: customs, ICEGATE, a port authority or trust, DGFT, or a tax '
                        . 'authority.',
                    'outsider' => 'Nobody in our cargo chain: a vendor, newsletter, recruiter or applicant, bank, our '
                        . 'own staff, or an automated system notice.',
                ],
            ],

            'intent' => [
                'min_confidence' => (float) env('MAIL_INTENT_SEA_INTENT_FLOOR', 0.50),

                'instructions' => 'What does the sender want from our ocean desk? Judge the request, not the sender.',

                'criteria' => [
                    'wants_a_price' => 'Our sea rate: FCL (count and size) or LCL (volume, weight) between two ports, '
                        . 'with a commodity or ready date, or chasing an unsent quote. A weight, VGM or volume about a '
                        . 'box already booked is NOT this.',
                    // ⚠️ Spelled out, not "SI" alone: the model reads the rubric literally (SeaInboxTest pins it).
                    'wants_to_book' => 'Us to move a specific sea shipment, price settled: a booking request, shipping '
                        . 'instructions (SI), a VGM so the box can load, or a cargo nomination.',
                    'operational_update' => 'News or a question on a sea shipment underway: booking confirmation, '
                        . 'schedule, cut-off, ETD or ETA, rollover, container release or pickup, gate-in, a draft BL, '
                        . 'telex or original release, arrival notice, DO, or a customs query or hold.',
                    'wants_money' => 'Payment from us: ocean freight, local charges or THC, detention or demurrage, DO '
                        . 'charges, a statement or a payment reminder.',
                    'sending_money' => 'Money paid or about to be paid to us: remittance advice, UTR, cheque or '
                        . 'transfer confirmation, TDS certificate.',
                    'has_a_problem' => 'A complaint: cargo or a container damaged, short or lost, a costly rollover or '
                        . 'delay, an insurance claim, a penalty, or disputed detention, demurrage or billing.',
                    'nothing_for_us' => 'Not about our shipments: marketing, newsletter, survey, sales pitch, job '
                        . 'application, internal note, system message, or a fragment too short to tell.',
                ],
            ],

            // Import or export, in a sea desk's words — see the shared rubric's note (not sent when a lane says).
            'direction' => [
                'min_confidence' => (float) env('MAIL_INTENT_SEA_DIRECTION_FLOOR', 0.60),

                'instructions' => 'We are in India. Is the sea cargo coming into an Indian port or leaving one? Judge '
                    . 'the ports and words like pre-alert, arrival notice, IGM or DO, not where the sender is.',

                'criteria' => [
                    'import' => 'Inbound to India: a pre-alert, arrival notice, IGM, DO or CFS destuffing here, or a '
                        . 'rate for cargo from a foreign port.',
                    'export' => 'Outbound from India: a booking, SI, VGM, shipping bill, empty pickup or stuffing, or '
                        . 'a rate to a foreign port.',
                    'cannot_tell' => 'No direction given: an invoice or payment without a route, a general question, '
                        . 'or no shipment.',
                ],
            ],

        ],
    ],

];
