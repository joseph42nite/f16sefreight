<?php

namespace App\Services\Sales;

use App\CustomerContact;
use App\Services\AiUsageService;
use App\Services\Help\OpenRouterClient;
use App\User;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * A ready-to-send email for one client finding (PRD §7.3.7): who it goes to, and the words.
 *
 * 🔴 Gemma writes the words from the finding's figures and may not add a number of its own — any number
 * in its answer that is not in the facts throws the answer away and the plain template is used. The rep
 * reads and edits everything before it is sent; nothing here sends.
 */
class OutreachDrafter
{
    /**
     * Tactical shows a client by its domain, never its name (PRD §2.3.3), so the draft leaves the name for the
     * rep to write in; the Send refuses while it is still there (user, 2026-09-15).
     */
    public const NAME_PLACEHOLDER = '[Company name]';

    /** What each finding asks the client for — the one clear ask the PRD requires. */
    private const GOALS = [
        'client_reactivation' => 'They have not shipped for longer than their usual rhythm. Check in warmly and offer help with any upcoming shipments. Do not suggest they left us.',
        'client_volume_drop' => 'Their volume has fallen. Ask if their plans have changed and offer a short call to see how we can support them.',
        'client_volume_growth' => 'Their volume has grown. Thank them and offer to secure space and a rate for the coming weeks.',
        'client_rate_review' => 'Some recent quotes on a lane did not go ahead on price. Offer to review our rates on that lane with them.',
        'client_new_lanes' => 'We run lanes they do not use with us yet. Offer those lanes briefly, without pressure.',
    ];

    public function __construct(private readonly OpenRouterClient $client, private readonly AiUsageService $usage) {}

    /**
     * @return array{to: string[], cc: string[], subject: string, body: string, written_by: string}
     */
    public function draft(object $action, User $rep, bool $withClientName): array
    {
        $customer = DB::table('customers')->find($action->customer_id);
        $facts = json_decode($action->fact_packet, true) ?: [];
        [$to, $cc] = $this->recipients($customer);
        $name = $withClientName ? $customer->name : self::NAME_PLACEHOLDER;

        $text = $this->written($action->action_type, $facts, $name, $rep) ?? $this->template($action->action_type, $facts, $name);

        return ['to' => $to, 'cc' => $cc] + $text;
    }

    /**
     * To: the client's primary contact, else whoever at their domain wrote to us last. Cc: contacts someone
     * chose to copy. An opted-out address is never used (PRD §9.3).
     *
     * @return array{0: string[], 1: string[]}
     */
    public function recipients(object $customer): array
    {
        $contacts = CustomerContact::where('customer_id', $customer->id)->contactable();
        $primary = (clone $contacts)->where('is_primary', true)->value('email');

        if ($primary === null) {
            $primary = $this->lastSenderFrom($customer);
        }

        $cc = CustomerContact::where('customer_id', $customer->id)->ccEligible()
            ->where('email', '!=', (string) $primary)->pluck('email')->all();

        return [$primary ? [$primary] : [], $cc];
    }

    /** The most recent inbound sender at one of the client's domains, on this company's mail. */
    private function lastSenderFrom(object $customer): ?string
    {
        $domains = array_filter(array_map(fn ($d) => strtolower(trim($d)), explode(',', (string) $customer->email_domain)));

        if ($domains === []) {
            return null;
        }

        $branches = DB::table('agents_info')->where('company_id', $customer->company_id)->pluck('id');
        $from = DB::table('email_messages')->whereIn('agent_id', $branches)->where('direction', 'inbound')
            ->where(function ($q) use ($domains) {
                foreach ($domains as $domain) {
                    $q->orWhere('from', 'like', '%@' . $domain . '%');
                }
            })
            ->orderByDesc('received_at')->value('from');

        // "Asha Rao <asha@globex.com>" → the address.
        return $from && preg_match('/[^\s<>"]+@[^\s<>"]+/', $from, $m) ? strtolower($m[0]) : null;
    }

    /** Gemma's version, or NULL when the model is unavailable or strays from the facts. */
    private function written(string $type, array $facts, string $client, User $rep): ?array
    {
        if (! $this->client->configured() || ! isset(self::GOALS[$type])) {
            return null;
        }

        $packet = json_encode(['client' => $client, 'facts' => $facts], JSON_UNESCAPED_UNICODE);

        try {
            $answer = $this->client->json([
                ['role' => 'system', 'content' => implode("\n", [
                    'You write short, professional emails from a freight forwarder\'s account manager to a client company.',
                    'Use only the facts given. Copy every number exactly; never calculate, round, compare or invent one.',
                    'Warm, respectful and calm: no pressure, no blame, no alarm. One clear ask. 80 to 130 words.',
                    'Greet the client\'s team by the company name given (e.g. "Dear Globex team,"); if it is "' . self::NAME_PLACEHOLDER . '", write exactly that for the account manager to fill in. End with "Kind regards," and nothing after it: the signature is added when it is sent. No other placeholders.',
                    'Write as someone who knows the account, not as a report: never mention records, data, reports, analytics, systems or AI.',
                    'Never mention our staff, response times, internal problems, margins or other clients.',
                ])],
                ['role' => 'user', 'content' => 'Goal: ' . self::GOALS[$type] . "\nFacts: " . $packet],
            ], [
                'type' => 'object',
                'properties' => [
                    'subject' => ['type' => 'string'],
                    'paragraphs' => ['type' => 'array', 'items' => ['type' => 'string']],
                ],
                'required' => ['subject', 'paragraphs'],
                'additionalProperties' => false,
            ], 'client_email', 'draft_timeouts');
        } catch (RuntimeException $e) {
            return null;
        }

        $this->usage->log($answer['usage'], 'sales_draft', $rep);

        $subject = trim((string) ($answer['data']['subject'] ?? ''));
        $paragraphs = array_values(array_filter(array_map('trim', $answer['data']['paragraphs'] ?? [])));

        if ($subject === '' || $paragraphs === [] || ! $this->onlyKnownNumbers($subject . ' ' . implode(' ', $paragraphs), $packet)) {
            return null;
        }

        return ['subject' => $subject, 'body' => $this->html($paragraphs), 'written_by' => 'ai'];
    }

    /** Every number in the email must appear in the facts — Gemma words, it does not count. */
    private function onlyKnownNumbers(string $text, string $packet): bool
    {
        preg_match_all('/\d+/', $text, $found);
        preg_match_all('/\d+/', $packet, $known);

        return array_diff($found[0], $known[0]) === [];
    }

    /** The plain version, used when Gemma cannot be. */
    private function template(string $type, array $facts, string $client): array
    {
        $lanes = implode(' and ', $facts['usual_lanes'] ?? []) ?: 'your usual lanes';

        [$subject, $paragraphs] = match ($type) {
            'client_reactivation' => ['Checking in on your upcoming shipments', [
                "It has been {$facts['days_since_last_shipment']} days since your last shipment with us — longer than your usual rhythm of about every {$facts['usually_ships_every_days']} days.",
                "If anything is planned on {$lanes}, or there is something we could do better for you, I would be glad to help. Could we have a quick call this week?",
            ]],
            'client_volume_drop' => ['Supporting your shipments in the coming weeks', [
                'Your recent volumes with us have been lower than usual (' . abs($facts['volume_change_percent']) . "% below your yearly average).",
                'If your plans have changed, I would welcome a short call to understand how we can best support you.',
            ]],
            'client_volume_growth' => ['Securing space for your growing volumes', [
                "Thank you — your volumes with us are up {$facts['volume_change_percent']}% on your yearly average.",
                "To keep things running smoothly on {$lanes}, I would be happy to secure space and a rate for the coming weeks. Shall we discuss?",
            ]],
            'client_rate_review' => ["Reviewing our rates on {$facts['lane']}", [
                "A few recent quotes on {$facts['lane']} did not go ahead, and I would like to make sure our rates work for you.",
                'Could we set up a short call to review them together?',
            ]],
            default => ['More lanes we can handle for you', [
                'Alongside ' . $lanes . ', we also run ' . implode(', ', $facts['lanes_we_run'] ?? []) . '.',
                'If any of these would be useful for your business, I would be glad to share options.',
            ]],
        };

        return ['subject' => $subject, 'body' => $this->html(array_merge(["Dear {$client} team,"], $paragraphs, ['Kind regards,'])), 'written_by' => 'template'];
    }

    private function html(array $paragraphs): string
    {
        return implode('', array_map(fn ($p) => '<p>' . e($p) . '</p>', $paragraphs));
    }
}
