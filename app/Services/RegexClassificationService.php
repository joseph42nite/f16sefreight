<?php

namespace App\Services;

use App\EmailMessage;
use Illuminate\Support\Facades\DB;

/**
 * Classifies INBOUND mail and stages cargo figures for an operator to confirm.
 *
 * 🔴 **INBOUND ONLY. This is a load-bearing product rule, not an optimisation.**
 * Outbound messages are stored on the thread and stamp `first_response_at`, but must
 * never run through the classifier, never mint an `enquiry_no`, never reset
 * `latest_message_received_at` and never clear `stale_nudged_at` (PRD.md §5.2.3).
 * A reply quoting the client's own cargo figures matches every extraction pattern —
 * classify it and you mint a SECOND enquiry for a conversation that already has one,
 * inflating the conversion denominator and corrupting every funnel metric downstream.
 *
 * 🔴 **REGEX STAGES; THE OPERATOR MINTS.** This service never creates an `enquiries` row
 * and never consumes a number. It returns a proposal. Auto-minting would burn document
 * numbers on spam and, again, corrupt the denominator.
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
class RegexClassificationService
{
    /**
     * Labelled weight patterns. Order matters: the more specific label wins, and the
     * unlabelled fallback is tried last and marked low confidence.
     */
    private const WEIGHT_PATTERNS = [
        'chargeable' => '/\b(?:chargeable|charge?able|cw)\D{0,12}?(\d+(?:\.\d+)?)\s*(?:kgs?|kilos?)?\b/i',
        'gross'      => '/\b(?:gross|gw|actual)\D{0,12}?(\d+(?:\.\d+)?)\s*(?:kgs?|kilos?)?\b/i',
        'net'        => '/\b(?:net|nw)\D{0,12}?(\d+(?:\.\d+)?)\s*(?:kgs?|kilos?)?\b/i',
    ];

    private const UNLABELLED_WEIGHT = '/(\d+(?:\.\d+)?)\s*(?:kgs?|kilograms?)\b/i';

    /** Sea quotes volume; air quotes weight. */
    private const CBM_PATTERN = '/(\d+(?:\.\d+)?)\s*(?:cbm|m3|cubic\s*met(?:er|re)s?)\b/i';

    private const PIECES_PATTERN = '/(\d+)\s*(?:pcs?|pieces?|packages?|cartons?|pkgs?)\b/i';

    /**
     * Classify one message and stage what it contains.
     *
     * @return array{classification: string, matched_rule_id: ?int, cargo: array}|null
     *         NULL when the message must not be classified at all.
     */
    public function classify(EmailMessage $message, string $transportMode): ?array
    {
        // The guard that protects the conversion denominator. Checked first, always.
        if ($message->direction !== 'inbound') {
            return null;
        }

        // Backfilled mail must not start SLA clocks, fire notifications or propose
        // enquiries — a 60-day onboarding import would otherwise detonate the whole
        // workload engine at once.
        if ($message->is_historical) {
            return null;
        }

        $haystack = trim(($message->subject ?? '') . "\n" . ($message->body_snippet ?? ''));

        $rule = $this->firstMatchingRule($message, $transportMode, $haystack);

        if ($rule !== null) {
            DB::table('email_classification_rules')->where('id', $rule->id)->increment('hit_count');
        }

        return [
            'classification'  => $rule->target_classification ?? 'customer_enquiry',
            'matched_rule_id' => $rule->id ?? null,
            'cargo'           => $this->extractCargo($haystack, $transportMode),
        ];
    }

    /**
     * Match order: domain → sender pattern → subject → body. Within each type, by
     * `priority` ascending, so a specific sender_domain_match entry beats a broad
     * body_keyword.
     */
    private function firstMatchingRule(EmailMessage $message, string $transportMode, string $haystack): ?object
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
    public function extractCargo(string $text, string $transportMode): array
    {
        $cargo = [];

        foreach (self::WEIGHT_PATTERNS as $label => $pattern) {
            if (preg_match($pattern, $text, $m)) {
                $cargo[$label . '_weight'] = ['value' => (float) $m[1], 'confidence' => 'high'];
            }
        }

        // Only fall back when NO labelled weight was found. Stored as gross with reduced
        // confidence so the operator is prompted to check it.
        if ($cargo === [] && preg_match(self::UNLABELLED_WEIGHT, $text, $m)) {
            $cargo['gross_weight'] = ['value' => (float) $m[1], 'confidence' => 'low'];
        }

        if (preg_match(self::PIECES_PATTERN, $text, $m)) {
            $cargo['pieces'] = ['value' => (int) $m[1], 'confidence' => 'high'];
        }

        if ($transportMode === 'sea' && preg_match(self::CBM_PATTERN, $text, $m)) {
            $cargo['volume_cbm'] = ['value' => (float) $m[1], 'confidence' => 'high'];
        }

        return $cargo;
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
