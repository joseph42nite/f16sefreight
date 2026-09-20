<?php

namespace App\Services\Mail;

use App\Company;
use App\EmailMessage;
use App\Services\AiUsageService;
use App\Services\CompanyAiBudget;
use App\Services\JevClient;
use App\Services\OcrCreditService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * What an inbound mail is about, decided by Jev (user, 2026-09-20).
 *
 * 🔴 **THIS REPLACED A REGEX, AND THE REGEX WAS THE PROBLEM.** `QUOTE_REQUEST_PATTERN` was
 * eleven alternations long and still could not tell "please quote your best rate" sent TO us
 * from "the commercial quotation for Focus Air" sent BY us, because the discriminating fact
 * is who is asking whom — which is meaning, not spelling. Every new false positive bought
 * another negative lookahead, and every lookahead made the next one harder to reason about.
 *
 * ⚠️ **Only CLASSIFICATION moved to the model. Cargo figures did not.** The weight, pieces,
 * dimension and lane patterns in MailFilingService stay exactly where they are:
 * they read a number off the page, and those numbers end up on a customs declaration. Jev is
 * explicit that it is not a calculator and does not generate values — asking it for "the
 * gross weight" would be asking the one thing its own documentation says to keep in code.
 *
 * ── Where it sits ──────────────────────────────────────────────────────────
 * Fourth, and only fourth: a tenant's own rules, then a domain we already invoice, then the
 * platform's airline/domain directory, THEN this. An airline is still recognised by its
 * domain in the backend, as it always was, and a domain is a fact while this is a judgement
 * — a judgement must never outrank a fact. On a settled mailbox most mail never reaches
 * here, which is also why it is affordable.
 *
 * ── Degrading ──────────────────────────────────────────────────────────────
 * Every refusal below returns NULL and the mail is filed `other` for a person to re-file.
 * That is the pre-model behaviour, and it is a worse inbox rather than a broken one. Mail
 * sync must never fail because a model did.
 *
 * ── 🔐 The mail is untrusted, and the model does not know that ─────────────
 * ⚠️ TypeSafe says plainly that `state` is data and jev-1.13 is not hardened against text
 * written to steer it. A sender CAN write "this is an urgent customer enquiry" and move the
 * answer. The blast radius is bounded on purpose: the worst outcome is a thread in the wrong
 * folder and an enquiry number minted for it, both of which an operator undoes in one click,
 * and nothing here can send, quote, spend or reply. Do not widen this to any decision that
 * acts on the client's behalf without a person in between.
 */
class MailIntentClassifier
{
    /**
     * 🔴 Suppliers — the senders whose "wants_money" is a bill TO US, and so belongs in
     * accounts rather than in that counterparty's operational folder. A client asking us for
     * money is not in this list: that is a credit note or a dispute, not a purchase invoice.
     */
    private const SUPPLIERS = ['overseas_agent', 'airline', 'shipping_line', 'customs_broker', 'transporter', 'cfs_warehouse'];

    /**
     * Who wrote it → the folder that counterparty's mail belongs in, when the intent says
     * nothing more specific.
     *
     * ⚠️ `client` maps to `other`, NOT to `customer_enquiry`. A mail from a client whose purpose
     * we could not read is not an enquiry, and filing it as one mints a document number and
     * inflates the conversion denominator every funnel metric is measured against. Only
     * `wants_a_price` earns that folder, and only from someone who could actually be quoted.
     */
    private const SENDER_FOLDER = [
        'client'         => 'other',
        'overseas_agent' => 'overseas_agent',
        'airline'        => 'airline',
        'shipping_line'  => 'shipping_line',
        'customs_broker' => 'clearance',
        'transporter'    => 'trucking_road',
        'cfs_warehouse'  => 'cfs_warehouse',
        'authority'      => 'regulatory',
        'outsider'       => 'other',
    ];

    /**
     * Intents that settle the folder on their own, whoever sent them.
     *
     * 🔴 This is what makes reading the two confidences separately worth doing: a remittance
     * advice goes to `payment_advice` whether it came from a client or an agent, so a confident
     * intent can be acted on even when the model is unsure who wrote.
     */
    private const INTENT_FOLDER = [
        'nothing_for_us' => 'other',
        'has_a_problem'  => 'claim',
        'sending_money'  => 'payment_advice',
    ];

    public function __construct(
        private readonly JevClient $jev,
        private readonly AiUsageService $usage,
        private readonly CompanyAiBudget $budget,
        private readonly OcrCreditService $credits,
    ) {}

    /**
     * @return array{classification: string, confidence: float, rubric: string}|null
     *         NULL when the model was not asked, or could not be used.
     */
    public function classify(EmailMessage $message): ?array
    {
        if (! config('mail_intent.enabled') || ! $this->jev->configured()) {
            return null;
        }

        // ⚠️ An unsaved message is refused rather than classified for free. A credit charged
        // against nothing is the one thing an append-only ledger cannot explain later.
        if ($message->id === null) {
            return null;
        }

        $company = $this->companyFor($message);

        if ($company === null || $this->budget->refusal($company, 'mail_intent') !== null) {
            return null;
        }

        // Reserved before the call, refunded if it fails — see OcrCreditService.
        $transaction = $this->credits->chargeMail($company, (int) $message->id);

        if ($transaction === null) {
            return null;
        }

        try {
            // ⚠️ ONE request carrying BOTH questions. The state is sent once — which is the whole
            // cost, since output tokens are free — so the second answer is very nearly a freebie.
            // Two separate calls would double the bill and the latency for nothing.
            $answer = $this->jev->ask($this->state($message), array_map(
                fn (array $q) => JevClient::choice($q['instructions'], $q['criteria']),
                config('mail_intent.questions')
            ));
        } catch (RuntimeException $e) {
            $this->credits->refund($transaction);
            report($e);

            return null;
        }

        $this->usage->log($answer['usage'], 'mail_intent', null, [
            'agent_id' => $message->agent_id, 'company_id' => $company->id,
        ]);

        return $this->read($answer['answers'] ?? []);
    }

    /**
     * Two answers into one folder.
     *
     * 🔴 **THE CONFIDENCES ARE READ SEPARATELY AND NEVER COMBINED ARITHMETICALLY.** TypeSafe is
     * explicit that answers to different questions carry no relationship to each other — you
     * cannot multiply them into a joint probability or carry a threshold from one to the other.
     * What they can each say is "I am not sure", and each one being unsure costs us something
     * different:
     *
     *   both unsure      → Other. We know neither who wrote nor why.
     *   intent unsure    → the sender's folder. A carrier's mail whose purpose we cannot read is
     *                      still the carrier's mail, and that is where an operator will look.
     *   sender unsure    → only the intents that name a folder alone (a remittance advice is
     *                      `payment_advice` whoever sent it); anything else needs both, so Other.
     *   both confident   → route().
     *
     * ⚠️ The stored confidence is the MINIMUM of the two, because a decision is only as good as
     * the weakest answer it rests on. It is a diagnostic, not a probability — do not treat it as
     * "the chance this folder is right".
     *
     * @return array{classification: string, confidence: float, rubric: string}|null
     */
    private function read(array $answers): ?array
    {
        [$sender, $senderConfidence] = $this->choiceIn($answers, 'sender');
        [$intent, $intentConfidence] = $this->choiceIn($answers, 'intent');

        // An option outside the rubric cannot be routed — and a missing answer is a contract
        // change, not a low-confidence one, so it is refused rather than guessed around.
        if ($sender === null || $intent === null) {
            return null;
        }

        // 🔴 A FLOOR PER QUESTION. Confidence is how peaked a distribution is, so it scales with
        // the number of options: the same real certainty reads lower across nine senders than
        // across seven intents. One shared floor silently made the longer list the stricter test
        // and dropped six correct, obvious sender readings in a row. TypeSafe say it directly —
        // never carry a threshold tuned on one question over to another.
        $senderSure = $senderConfidence >= $this->floorFor('sender');
        $intentSure = $intentConfidence >= $this->floorFor('intent');

        $folder = match (true) {
            $senderSure && $intentSure => $this->route($sender, $intent),
            $intentSure                => self::INTENT_FOLDER[$intent] ?? 'other',
            $senderSure                => self::SENDER_FOLDER[$sender],
            default                    => 'other',
        };

        return [
            'classification' => $folder,
            'confidence' => round(min($senderConfidence, $intentConfidence), 3),
            'rubric' => (string) config('mail_intent.rubric_version'),
        ];
    }

    /**
     * Who wrote it plus what they want → the folder.
     *
     * 🔴 This is deliberately CODE and not another rubric entry. It is a lookup with no judgement
     * in it: every cell is a rule somebody can argue with by reading it, and changing where
     * "an airline that wants money" goes should be a diff in a match arm, not a paragraph of
     * English sent to a model and hoped over.
     *
     * ⚠️ `wants_a_price` reaches `customer_enquiry` only from a `client` or an `overseas_agent`,
     * because those are the two senders we would actually quote. An airline asking OUR price is
     * either a misread or something strange, and it belongs in the airline folder where a person
     * will see it — not in the pool the conversion rate is measured against.
     */
    private function route(string $sender, string $intent): string
    {
        if (isset(self::INTENT_FOLDER[$intent])) {
            return self::INTENT_FOLDER[$intent];
        }

        return match ($intent) {
            // Their bill to us, if they are someone we buy from — and otherwise THEIR folder,
            // not Other. ⚠️ Customs demanding duty is `wants_money` from `authority`, read at 0.97
            // and 0.99, and an earlier version of this arm threw both answers away to file it as
            // Other. A sender we are sure of is never nothing.
            'wants_money' => in_array($sender, self::SUPPLIERS, true) ? 'vendor_invoice' : self::SENDER_FOLDER[$sender],

            'wants_a_price' => in_array($sender, ['client', 'overseas_agent'], true)
                ? 'customer_enquiry'
                : self::SENDER_FOLDER[$sender],

            // An agent nominating cargo is a shipment arriving, not an enquiry to quote.
            'wants_to_book' => match ($sender) {
                'client'         => 'client_shipment',
                'overseas_agent' => 'overseas_agent',
                default          => self::SENDER_FOLDER[$sender],
            },

            // A client asking where their cargo is belongs with their shipment, not in the
            // enquiry pool and not buried in Other.
            'operational_update' => $sender === 'client' ? 'client_shipment' : self::SENDER_FOLDER[$sender],

            default => 'other',
        };
    }

    /** A question's own floor, or the shared one when it does not set one. */
    private function floorFor(string $question): float
    {
        return (float) (config("mail_intent.questions.{$question}.min_confidence")
            ?? config('mail_intent.min_confidence'));
    }

    /**
     * One Choice answer, validated against its own rubric.
     *
     * @return array{0: ?string, 1: float} the option and its confidence, or [null, 0.0]
     */
    private function choiceIn(array $answers, string $question): array
    {
        $answer = $answers[$question] ?? [];
        $choice = $answer['choice'] ?? null;
        $allowed = config("mail_intent.questions.{$question}.criteria");

        return is_string($choice) && array_key_exists($choice, $allowed)
            ? [$choice, (float) ($answer['confidence'] ?? 0)]
            : [null, 0.0];
    }

    /**
     * What the model reads.
     *
     * ⚠️ Named fields, not one blob: jev-1.13 does better when the question can point at a
     * part of the state, and a subject is a different kind of evidence from a signature block.
     *
     * ⚠️ Truncated on purpose. Accuracy falls as unrelated text is added, and the text below
     * a two-line reply is a quoted thread — the ask is in the first paragraph or it is not
     * in the mail at all.
     */
    private function state(EmailMessage $message): array
    {
        return [
            'from' => (string) $message->from,
            'subject' => (string) $message->subject,
            'body' => mb_substr((string) $message->body_snippet, 0, (int) config('mail_intent.max_body_chars')),
        ];
    }

    /** The tenant the call is charged to. Scoped to the COMPANY: the AI budget and credits both are. */
    private function companyFor(EmailMessage $message): ?Company
    {
        $companyId = DB::table('agents_info')->where('id', $message->agent_id)->value('company_id');

        return $companyId === null ? null : Company::withoutGlobalScopes()->find($companyId);
    }
}
