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
    /** The single question. One answer, one folder — see config/mail_intent.php. */
    private const QUESTION = 'folder';

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
            $answer = $this->jev->ask($this->state($message), [
                self::QUESTION => JevClient::choice(config('mail_intent.instructions'), config('mail_intent.criteria')),
            ]);
        } catch (RuntimeException $e) {
            $this->credits->refund($transaction);
            report($e);

            return null;
        }

        $this->usage->log($answer['usage'], 'mail_intent', null, [
            'agent_id' => $message->agent_id, 'company_id' => $company->id,
        ]);

        return $this->read($answer['answers'][self::QUESTION] ?? []);
    }

    /**
     * The answer, or NULL when it is not one we can act on.
     *
     * ⚠️ `confidence` is kept even when the answer is demoted to `other`, so the accuracy
     * report can separate "the model was unsure" from "the model was sure and wrong" — two
     * problems with opposite fixes. What is NOT kept is the demoted choice itself: a folder
     * we decided not to use is not a filing, and storing it in `auto_classification` would
     * make the override report count decisions nobody ever acted on.
     */
    private function read(array $answer): ?array
    {
        $choice = $answer['choice'] ?? null;
        $confidence = (float) ($answer['confidence'] ?? 0);

        // An option outside the rubric cannot be stored: the inbox has no folder to show it in.
        if (! is_string($choice) || ! array_key_exists($choice, config('mail_intent.criteria'))) {
            return null;
        }

        if ($confidence < (float) config('mail_intent.min_confidence')) {
            $choice = 'other';
        }

        return [
            'classification' => $choice,
            'confidence' => round($confidence, 3),
            'rubric' => (string) config('mail_intent.rubric_version'),
        ];
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
