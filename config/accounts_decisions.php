<?php

/*
|--------------------------------------------------------------------------
| Jev in accounts — the rubric (implementation_guide §11.7; GAPS #412)
|--------------------------------------------------------------------------
|
| Each decision point is a question Jev answers about one thing — a bank line, a partner, a mail — by choosing
| among options PHP has ALREADY built. The prose below is what Jev reads, so changing how it decides is an edit to
| English here, not to code. ⚠️ Bump `rubric_version` on EVERY wording change: it is stamped on each decision in
| `ai_decisions`, and a new version is the only thing that asks a question again.
|
| 🔴 The safety rules (§11.7) hold for every question here:
|   · Jev CHOOSES; PHP computes and commits. It never produces an amount, a date, a rate or a tax figure.
|   · A suggestion, never an action: it pre-selects a choice a person confirms; every check runs on what they confirm.
|   · Under its floor, silence — the screen shows no suggestion rather than a weak one.
|
| ⚠️ Floors are per question and conservative until measured. `confidence` is how PEAKED an answer is, so it
| scales with the number of options: a floor is never carried from one question to another, and none is lowered
| without the accepted/changed counts in `ai_decisions` saying so.
|
*/

return [

    /* Off in tests (phpunit.xml): a paid endpoint. A test that wants it enables it and fakes the HTTP. */
    'enabled' => (bool) env('ACCOUNTS_AI', true),

    // The same pinned model the inbox is measured against.
    'model' => env('JEV_MODEL', 'typesafe/jev-1.13'),

    /* Seconds. A screen waits for this, so it is short: past it the screen simply has no suggestion. */
    'timeout' => (int) env('ACCOUNTS_AI_TIMEOUT', 4),

    'rubric_version' => '2026-09-26a',

    /* A dynamic list (bills, vouchers) is cut to this many, plus "none of these" — more options, flatter answers. */
    'max_options' => 5,

    'questions' => [

        // ① Money in ④ — which open bill a bank credit pays. Options: the bills whose balance fits the amount.
        'bank_match' => [
            'label' => 'Which bill a payment is for',
            'where' => 'Money in → bank matching',
            'instructions' => 'Money has arrived in our bank account. The state gives what the bank recorded — the '
                . 'amount in rupees, the payer, the narration and the reference. Each option is one of our open bills '
                . 'whose balance fits that amount. Choose the bill this money is paying: the payer should be that '
                . "bill's client, and a bill number, shipment number or client name in the narration or reference is "
                . 'the strongest sign. Choose none_of_these when the payer or narration points to none of them, or '
                . 'when two bills fit equally and nothing separates them.',
            'none' => 'None of these bills — the payer, narration and reference do not point to exactly one of them.',
            'min_confidence' => 0.55,
        ],

        // ③ Money in ④ — why a payment is short. Pre-selects the resolution; "can't tell" leaves it STILL OWED.
        'short_payment' => [
            'label' => 'Why a payment is short',
            'where' => 'Money in → bank matching',
            'instructions' => 'A client paid less than the bill. The state gives the bill, what arrived, how much '
                . 'less as a share of the bill, and what the bank recorded. Say why it is short. Tax deducted at '
                . 'source is usually an exact small percentage of the bill before tax — 1% or 2% — and the narration '
                . 'may say TDS. Bank charges are a small fixed-looking sum taken by a bank in between. Choose '
                . 'cannot_tell unless the evidence points one way.',
            'criteria' => [
                'client_deducted_tds' => 'The client deducted tax at source; the shortfall is that tax, paid on our behalf.',
                'bank_charges' => 'A bank in between took its charges from the transfer.',
                'agreed_discount' => 'The narration shows a discount or settlement the client says was agreed.',
                'disputed' => 'The client is holding back part of the bill over a dispute.',
                'cannot_tell' => 'Nothing in the evidence says why it is short.',
            ],
            // Which resolution each answer pre-selects. NULL = "still owed": a guess is never a write-off.
            'resolution' => [
                'client_deducted_tds' => 'tds', 'bank_charges' => 'write_off', 'agreed_discount' => 'discount',
                'disputed' => null, 'cannot_tell' => null,
            ],
            // High: this answer decides which line of the P&L the difference lands on.
            'min_confidence' => 0.70,
        ],

        // ② Money in ④ — money that matches no open bill. Says what it probably is; posts nothing.
        'unidentified' => [
            'label' => 'What unmatched money is',
            'where' => 'Money in → differences',
            'instructions' => 'Money arrived that matches none of our open bills. The state gives the amount, the '
                . 'payer, the narration and the reference. Say what it most likely is.',
            'criteria' => [
                'client_payment' => 'A client paying us — for a bill not raised yet, an advance, or several bills at once.',
                'refund_to_us' => 'A supplier, airline or authority refunding money we paid them.',
                'bank_interest' => 'Interest credited by our own bank.',
                'bank_reversal' => 'Our bank reversing a charge or a failed transfer.',
                'capital_or_loan' => 'Money from the owners, a group company or a lender.',
                'cannot_tell' => 'Nothing in the evidence says what it is.',
            ],
            'min_confidence' => 0.55,
        ],

        // ⑤ Money out ③ — which of our vouchers a supplier-statement line is. Options: that supplier's vouchers.
        'statement_line' => [
            'label' => 'Which voucher a statement line is',
            'where' => 'Money out → statements',
            'instructions' => "A supplier's statement lists a charge we could not match by number. The state gives "
                . 'their line — reference, date and amount — and each option is one of our vouchers from that '
                . 'supplier. Choose the voucher this line is: the same shipment, air waybill or job reference is '
                . 'the strongest sign; a close amount alone is weak. Choose none_of_these when no voucher is clearly it.',
            'none' => 'None of these vouchers — nothing ties the line to exactly one of them.',
            'min_confidence' => 0.55,
        ],

        // ④ Inbox → Money in — which of a client's open bills a remittance advice says are being paid.
        //   One yes/no per bill in ONE request: the mail is sent once, and output is free.
        'remittance' => [
            'label' => 'Which bills a remittance advice pays',
            'where' => 'Inbox → a mail about a payment',
            'instructions' => 'A client wrote to us about a payment. The state gives the mail and this one bill of '
                . 'theirs. Say whether the mail says THIS bill is being paid — by its number, its shipment or its '
                . 'exact amount. A general "payment made" with nothing that points to this bill is not_mentioned.',
            'criteria' => [
                'paid' => 'The mail says this bill is being paid.',
                'not_mentioned' => 'The mail does not point to this bill.',
            ],
            'min_confidence' => 0.60,
        ],

        // ⑥ Directory → partner TDS — which section a supplier's services fall under. Options: the branch's OWN
        //   TDS rate table (the sections and descriptions accounts maintain), plus none and not_sure. A legal
        //   classification: shown as a suggestion to check against their certificate, never set on its own.
        'vendor_tds' => [
            'label' => "A supplier's TDS section",
            'where' => 'Clients & Partners → partner TDS',
            'instructions' => 'We pay this supplier. The state gives who they are and what we have booked from them. '
                . 'Each option is a TDS section as our accounts team describes it. Choose the section their services '
                . 'fall under, none when these payments are not ones we deduct on, and not_sure unless it is clear.',
            'none' => 'None — we do not deduct tax on what we pay this supplier.',
            'not_sure' => 'Not sure — the evidence does not settle it.',
            'min_confidence' => 0.65,
        ],
    ],
];
