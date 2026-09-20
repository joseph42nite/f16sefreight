<?php

namespace App\Services\Mail;

use App\EmailMessage;
// 🔴 Was same-namespace before this class moved into App\Services\Mail. Without these two the
// free-mail check and the platform directory lookup resolve to App\Services\Mail\… and fatal.
use App\Services\GlobalDomainDirectory;
use Illuminate\Support\Facades\DB;

/**
 * Files INBOUND mail into a folder and stages its cargo figures for an operator to confirm.
 *
 * 🔴 **Named `RegexClassificationService` until 2026-09-20.** The name outlived the design: the
 * filing decision is Jev's now (MailIntentClassifier), and what is still regex here is cargo
 * extraction. A class called "Regex…" that calls a hosted model is a sentence that has to be
 * unlearned by everyone who reads it, so it is named for what it does — the thing Super Admin →
 * Mail filing reports on.
 *
 * 🔴 **INBOUND ONLY. This is a load-bearing product rule, not an optimisation.**
 * Outbound messages are stored on the thread and stamp `first_response_at`, but must
 * never run through the classifier, never mint an `enquiry_no`, never reset
 * `latest_message_received_at` and never clear `stale_nudged_at` (PRD.md §5.2.3).
 * A reply quoting the client's own cargo figures matches every extraction pattern —
 * classify it and you mint a SECOND enquiry for a conversation that already has one,
 * inflating the conversion denominator and corrupting every funnel metric downstream.
 *
 * 🔴 **THIS STAGES; THE OPERATOR MINTS.** This service never creates an `enquiries` row
 * and never consumes a number. It returns a proposal. Auto-minting would burn document
 * numbers on spam and, again, corrupt the denominator.
 *
 * 🔴 **THE FILING DECISION IS NO LONGER A REGEX (user, 2026-09-20).** Whether a mail is a
 * customer enquiry is Jev's answer — see MailIntentClassifier, and the rubric it reads in
 * config/mail_intent.php. What was removed is `QUOTE_REQUEST_PATTERN`, an eleven-branch
 * alternation that matched the word "quote" and could never tell who was asking whom.
 *
 * ⚠️ The cargo patterns below STAYED, deliberately. They read figures off a page; the model
 * decides what a mail is for. Jev generates nothing and is documented as unreliable on
 * numbers, so moving extraction to it would trade a pattern that is occasionally wrong for
 * a judgement that is confidently wrong on a customs declaration.
 *
 * ── Rules are scoped by transport_mode ─────────────────────────────────────
 * Air and sea speak different languages: kg/pieces and IATA codes versus CBM/TEU and
 * 5-char LOCODEs. A shared pattern set mis-parses both.
 *
 * ── Weight patterns are split BY LABEL, deliberately ───────────────────────
 * A single pattern like /(\d+\.?\d*)\s*kgs?/i cannot tell gross from chargeable from
 * net, so a mail quoting "gross 450 kg, chargeable 520 kg" records whichever appears
 * first — silently, and on the figure that prices the shipment. Labelled captures with
 * an unlabelled fallback stored as gross at reduced confidence.
 */
class MailFilingService
{
    /**
     * Labelled weight patterns. Order matters: the more specific label wins, and the
     * unlabelled fallback is tried last and marked low confidence.
     */
    private const WEIGHT_PATTERNS = [
        // "chargeable weight 520", "CW 520", "Ch wt 18000 kgs", "Chg wt: 18000"
        'chargeable' => '/\b(?:chargeable|charge?able|cw|ch\.?\s*w(?:gh)?t|chg\.?\s*w(?:gh)?t)\D{0,12}?(\d+(?:\.\d+)?)\s*(?:kgs?|kilos?)?\b/i',
        // "Gross wgt 17400kgs", "GW 450", "G.W.: 450 kg", and a plain "WEIGHT : 300 kgs" / "Wt 300 kg" — the plain label
        // only with a kg unit, so a table heading ("Pcs / Weight / Time") never reads as a figure (user, 2026-09-17).
        'gross'      => '/\b(?:gross|gw|g\.w\.?|actual)\D{0,12}?(\d+(?:\.\d+)?)\s*(?:kgs?|kilos?)?\b|(?<!ch\s)(?<!ch\.)(?<!chg\s)\b(?:weight|wgt|wt)\b\s*[:\-=]?\s*(\d+(?:\.\d+)?)\s*(?:kgs?|kilos?|kilograms?)\b/i',
        'net'        => '/\b(?:net|nw)\D{0,12}?(\d+(?:\.\d+)?)\s*(?:kgs?|kilos?)?\b/i',
    ];

    private const UNLABELLED_WEIGHT = '/(\d+(?:\.\d+)?)\s*(?:kgs?|kilograms?)\b/i';

    /** Sea quotes volume; air quotes weight. */
    private const CBM_PATTERN = '/(\d+(?:\.\d+)?)\s*(?:cbm|m3|cubic\s*met(?:er|re)s?)\b/i';

    /** A pallet is one piece (user, 2026-09-14): "3 pallets BOM to SIN" is 3 pieces. */
    private const PIECES_PATTERN = '/(\d+)\s*(?:pcs?|pieces?|packages?|cartons?|pkgs?|pallets?|plts?)\b/i';

    /** The label first, as forwarders write it: "PCS : 21", "Pcs 400", "No. of pieces: 12" (user, 2026-09-17). */
    private const PIECES_LABEL_FIRST = '/\b(?:no\.?\s*of\s*)?(?:pcs|pieces|pkgs|packages|cartons|ctns)\b\s*[:\-=]?\s*(\d+)\b/i';

    /** "Dims 40x30x30 cms", "Dimensions : 60 x 30 x20" — length × width × height, as written. */
    private const DIMENSIONS_PATTERN = '/(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*(cms?|mm|inch(?:es)?|in|m)?\b/iu';

    /**
     * A lane, written the way clients write one: "BOM to HAM", "BOM-HAM", "BOM → HAM",
     * "Mumbai to Hamburg".
     *
     * ⚠️ The separator is REQUIRED. Two codes with no relation between them ("AWB 176,
     * ETA MON") are not a lane, and a pattern that paired any two capitals in a sentence
     * would invent routes out of ordinary prose.
     */
    private const LANE_PATTERN = '/\b([A-Za-z]{3,})\b\s*(?:to|->|-|–|—|→|\/)\s*\b([A-Za-z]{3,})\b/iu';

    /**
     * 🔴 Words that LOOK like IATA codes and are not. Taken from the same list the PDF
     * extractor uses (`transform_flight_routing`'s LABEL_WORDS), because it is the same
     * problem: a bare three-letter matcher reads "TO", "AND" and "THE" as airports and
     * produces a route from any sentence containing them.
     *
     * ⚠️ Deliberately NOT extended with every English three-letter word. Real codes
     * collide with real words — BAY, RED, ONE, SUN are all airports — so the list stays
     * the extractor's, where each entry was added because it actually misfired.
     */
    private const LANE_STOPWORDS = [
        'to', 'by', 'first', 'carrier', 'routing', 'and', 'destination', 'airport',
        'of', 'requested', 'flight', 'date', 'the', 'for', 'via', 'our', 'per',
        'kgs', 'kg', 'pcs', 'cbm', 'awb', 'eta', 'etd', 'ready', 'from',
    ];

    /**
     * Classify one message and stage what it contains.
     *
     * @return array{classification: string, matched_rule_id: ?int, cargo: array, source: string,
     *               confidence: ?float, rubric: ?string}|null
     *         NULL when the message must not be classified at all.
     */
    /**
     * ⚠️ `$transportMode` is NULLABLE because classification does not depend on it — only
     * the CBM pattern does, and that is sea-only. At ingestion the mode is genuinely
     * unknown: a branch runs air and sea from one mailbox, and a mail says which it is
     * long before anyone can tell from the envelope. Passing a guessed 'air' there would
     * be inventing a fact to satisfy a signature.
     */
    public function classify(EmailMessage $message, ?string $transportMode = null): ?array
    {
        // The guard that protects the conversion denominator. Checked first, always.
        if ($message->direction !== 'inbound') {
            return null;
        }

        // Imported (historical) mail IS classified, as PRD §5.2.2 says: this only files the
        // conversation by type — it mints nothing, starts no clock and rings no bell — and an
        // imported month the user cannot filter by type is little use (GAPS #334).

        $haystack = trim(($message->subject ?? '') . "\n" . ($message->body_snippet ?? ''));

        $rule = $this->firstMatchingRule($message, $haystack);

        if ($rule !== null) {
            DB::table('email_classification_rules')->where('id', $rule->id)->increment('hit_count');
        }

        // 🔴 THE FALLBACK CHAIN, most specific first. Each step also records WHERE the
        // answer came from, because "the filing got worse" has a different fix depending
        // on whether it was a tenant's rule, the shared directory or the model that said so.
        //
        //   1. the tenant's own rules      — a local exception outranks everything
        //   2. a domain we already invoice — see below
        //   3. the platform directory      — what the industry knows about a domain, airlines included
        //   4. the decision model          — what the mail actually asks for (MailIntentClassifier)
        //   5. other                       — nothing decided, so the filing is a guess: Other,
        //      and a person re-files it (user, 2026-09-17: "when confidence is low just put
        //      it in other"; was customer_enquiry, which filed every newsletter and colleague's
        //      mail as an enquiry on the first real mailbox).
        //
        // ⚠️ Steps 1–3 are FACTS and are checked first for that reason: a rule someone wrote,
        // an invoice we have raised, a domain the industry agrees about. Step 4 is a reading of
        // prose. A reading must never overturn a fact, and the order is the only thing enforcing it.
        $decision = $rule !== null
            ? ['classification' => $rule->target_classification, 'source' => 'rule']
            : ($this->firstOf($this->knownClientClassification($message), 'client')
                ?? $this->firstOf($this->globalClassificationFor($message->from), 'directory')
                ?? $this->model($message)
                ?? ['classification' => 'other', 'source' => 'none']);

        return $decision + [
            'matched_rule_id' => $rule->id ?? null,
            'cargo'           => $this->extractCargo($haystack, $transportMode),
            'confidence'      => null,
            'rubric'          => null,
        ];
    }

    /** @return array{classification: string, source: string}|null */
    private function firstOf(?string $classification, string $source): ?array
    {
        return $classification === null ? null : ['classification' => $classification, 'source' => $source];
    }

    /**
     * Ask the model, when nothing already known has answered.
     *
     * ⚠️ NULL is not a failure to handle here — it covers the model being switched off, the
     * tenant being out of AI budget or credits, and the call not coming back. All of them mean
     * the same thing to this chain: nobody decided, so the mail falls through to `other`.
     */
    private function model(EmailMessage $message): ?array
    {
        $answer = app(MailIntentClassifier::class)->classify($message);

        return $answer === null ? null : $answer + ['source' => 'model'];
    }

    /**
     * A domain we have already onboarded as a customer is, on the balance of evidence,
     * writing to us about a shipment.
     *
     * 🔴 This needs NO configuration, which is the point. `email_classification_rules` is
     * empty on a new tenant and stays empty until somebody writes rules, so without this
     * the chain had nothing to match on and every message fell through to the default —
     * the classifier was a constant wearing the shape of a decision.
     *
     * ⚠️ Scoped to the COMPANY, not the branch. `customers` is tenant-wide and a client
     * group is every row sharing `(company_id, email_domain)`; matching per branch would
     * fail to recognise a client the Chennai office onboarded.
     *
     * ⚠️ Free mail is excluded. Half a client's staff write from gmail.com, and one
     * customer onboarded with a free-mail domain would otherwise classify every personal
     * account on the internet as that client's enquiry.
     */
    private function knownClientClassification(EmailMessage $message): ?string
    {
        $from = (string) $message->from;

        if (! str_contains($from, '@')) {
            return null;
        }

        $domain = strtolower(substr(strrchr($from, '@'), 1));

        if (app(GlobalDomainDirectory::class)->isFreeMail($domain)) {
            return null;
        }

        $companyId = DB::table('agents_info')->where('id', $message->agent_id)->value('company_id');

        if ($companyId === null) {
            return null;
        }

        $known = DB::table('customers')
            ->where('company_id', $companyId)
            ->whereRaw('LOWER(email_domain) = ?', [$domain])
            ->exists();

        return $known ? 'customer_enquiry' : null;
    }

    /**
     * Match order: domain → sender pattern → subject → body. Within each type, by
     * `priority` ascending, so a specific sender_domain_match entry beats a broad
     * body_keyword.
     */
    private function firstMatchingRule(EmailMessage $message, string $haystack): ?object
    {
        $rules = DB::table('email_classification_rules')
            ->where('agent_id', $message->agent_id)
            ->where('is_active', true)
            ->orderBy('priority')
            ->get();

        $senderDomain = str_contains((string) $message->from, '@')
            ? strtolower(substr(strrchr((string) $message->from, '@'), 1))
            : '';

        foreach (['sender_domain_match', 'sender_pattern', 'subject_keyword', 'body_keyword'] as $type) {
            foreach ($rules->where('rule_type', $type) as $rule) {
                $subject = match ($type) {
                    'sender_domain_match' => $senderDomain,
                    'sender_pattern'   => (string) $message->from,
                    'subject_keyword'  => (string) $message->subject,
                    default            => $haystack,
                };

                if ($this->matches($rule->pattern, $subject, $type)) {
                    return $rule;
                }
            }
        }

        return null;
    }

    /**
     * What the PLATFORM knows about this sender's domain, when no tenant rule matched.
     *
     * 🔴 Consulted only AFTER the tenant's own rules. An industry default must never
     * outrank a local exception — a forwarder using an airline's domain for something
     * unusual has to be able to say so without arguing with the platform.
     *
     * 🔐 Only a domain goes in and only a classification comes back. Nothing about this
     * message, this client or this tenant reaches the shared directory.
     */
    public function globalClassificationFor(?string $from): ?string
    {
        $directory = app(GlobalDomainDirectory::class);

        return $directory->classify($directory->domainOf($from));
    }

    private function matches(string $pattern, string $subject, string $type): bool
    {
        if ($subject === '') {
            return false;
        }

        if ($type === 'sender_domain_match') {
            return strcasecmp($pattern, $subject) === 0;
        }

        // A malformed rule must not take the poller down — treat it as a non-match and
        // let the accuracy telemetry surface it.
        $result = @preg_match($this->asRegex($pattern), $subject);

        return $result === 1;
    }

    private function asRegex(string $pattern): string
    {
        // Rules may be authored either as bare keywords or as full regexes.
        return @preg_match($pattern, '') === false ? '/' . preg_quote($pattern, '/') . '/i' : $pattern;
    }

    /**
     * Cargo figures, each with a confidence. Every value is nullable — a missing figure
     * must stay missing rather than being invented, because these numbers end up on a
     * customs declaration.
     */
    public function extractCargo(string $text, ?string $transportMode = null): array
    {
        $cargo = [];

        foreach (self::WEIGHT_PATTERNS as $label => $pattern) {
            if (preg_match($pattern, $text, $m)) {
                // The first group that caught a number (the gross pattern has two ways to write it).
                $value = collect(array_slice($m, 1))->first(fn ($v) => $v !== '');
                $cargo[$label . '_weight'] = ['value' => (float) $value, 'confidence' => 'high'];
            }
        }

        // Only fall back when NO labelled weight was found. Stored as gross with reduced
        // confidence so the operator is prompted to check it.
        if ($cargo === [] && preg_match(self::UNLABELLED_WEIGHT, $text, $m)) {
            $cargo['gross_weight'] = ['value' => (float) $m[1], 'confidence' => 'low'];
        }

        if (preg_match(self::PIECES_PATTERN, $text, $m) || preg_match(self::PIECES_LABEL_FIRST, $text, $m)) {
            $cargo['pieces'] = ['value' => (int) $m[1], 'confidence' => 'high'];
        }

        if (preg_match(self::DIMENSIONS_PATTERN, $text, $m)) {
            $cargo['dimensions'] = ['value' => trim("{$m[1]} x {$m[2]} x {$m[3]} " . strtolower($m[4] ?? '')), 'confidence' => 'high'];
        }

        if ($transportMode === 'sea' && preg_match(self::CBM_PATTERN, $text, $m)) {
            $cargo['volume_cbm'] = ['value' => (float) $m[1], 'confidence' => 'high'];
        }

        return $cargo + $this->extractLane($text);
    }

    /**
     * The route, resolved to IATA codes through `locations`.
     *
     * 🔴 Resolved by SQL, never by calling the Python extractor. The 8,383-entry map lives
     * in `python/extract_awb_new.py`; `export_locations.py` loads it into `locations` once,
     * and this reads that. An HTTP round trip per inbound mail would be slow and would put
     * the OCR service in the mail pipeline's critical path, where it has no business.
     *
     * ⚠️ Both ends must resolve or NEITHER is returned. "Mumbai to somewhere we could not
     * read" is a half-lane, and a half-lane on a card looks like a whole one — the
     * operator sees an origin, believes the destination was simply blank, and never checks.
     *
     * ⚠️ Confidence is `low` throughout. This is one line of prose read by a regex, not a
     * field off a document, and the workspace should ask before it is trusted.
     */
    private function extractLane(string $text): array
    {
        if (! preg_match(self::LANE_PATTERN, $text, $m)) {
            return [];
        }

        $origin = $this->resolveLocation($m[1]);
        $dest   = $this->resolveLocation($m[2]);

        if ($origin === null || $dest === null || $origin === $dest) {
            return [];
        }

        return [
            'origin'      => ['value' => $origin, 'confidence' => 'low'],
            'destination' => ['value' => $dest,   'confidence' => 'low'],
        ];
    }

    /** One token — a code as written, or a city name — to an IATA code. */
    private function resolveLocation(string $token): ?string
    {
        $token = strtolower(trim($token));

        if ($token === '' || in_array($token, self::LANE_STOPWORDS, true)) {
            return null;
        }

        // A three-letter token is only a code if the table agrees it is one. Checking
        // against `locations` rather than accepting any three capitals is what stops
        // "MON" and "EUR" becoming airports.
        if (strlen($token) === 3) {
            $code = strtoupper($token);

            $known = DB::table('locations')
                ->where('is_active', true)
                ->where('iata_code', $code)
                ->exists();

            if ($known) {
                return $code;
            }
        }

        return DB::table('locations')
            ->where('is_active', true)
            ->whereRaw('LOWER(destination) = ?', [$token])
            ->value('iata_code');
    }

    /**
     * Record an operator correction. Paired with hit_count, this makes a rule's accuracy
     * measurable — a rule with 200 hits and 180 overrides is actively harmful and can be
     * found rather than guessed at.
     */
    public function recordOverride(array $attributes): void
    {
        DB::table('email_classification_overrides')->insert($attributes + ['created_at' => now()]);

        if (! empty($attributes['matched_rule_id'])) {
            DB::table('email_classification_rules')
                ->where('id', $attributes['matched_rule_id'])
                ->increment('override_count');
        }
    }
}
