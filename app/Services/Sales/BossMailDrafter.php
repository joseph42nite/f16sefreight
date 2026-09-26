<?php

namespace App\Services\Sales;

use App\Services\AiUsageService;
use App\Services\Help\OpenRouterClient;
use App\User;
use RuntimeException;

/**
 * A detailed internal mail from the Boss to his team, for one BossMails suggestion (user, 2026-09-16).
 *
 * 🔴 Gemma words it from the figures and may not add a number: any number not in the facts discards its answer and
 * the plain template is used, the same rule as the client emails. The Boss reads and edits everything; nothing here
 * sends.
 */
class BossMailDrafter
{
    /** What each mail asks the team for. */
    private const GOALS = [
        'next_month_targets' => 'Propose next month\'s targets for the branch, per transport mode, from the figures given. Explain briefly how they were set (the last 3 months and the trend). Ask the team to confirm or push back with reasons by the end of the week.',
        'volume_drop' => 'The branch\'s tonnage has dropped. State the drop plainly, name the clients falling most with their figures, and ask the team what is behind it for each and what they plan to do, with a reply within 2 days.',
        'top_clients_quiet' => 'Some of the branch\'s biggest clients have gone quiet. List each with their usual quarter and the last 3 months. Ask the account owner for each: what happened, when they last spoke to the client, and the plan to win them back.',
        'behind_target' => 'The branch is pacing behind this month\'s targets. List each measure with the target, the figure so far and the month-end pace. Ask for a concrete plan for the days left.',
        'losing_on_price' => 'Quotes are being lost on price on some lanes. List each lane with the losses and the share. Ask pricing to review buy rates and margins on those lanes and come back with options.',
        'slow_replies' => 'First replies to client enquiries have become slower. Give the median hours now and before, and the enquiries lost for slow replies. Ask what is causing it and how to bring it back down.',
        'money_overdue' => 'Money overdue beyond 60 days has built up. Give the total and the clients owing most. Ask accounts and each client\'s account owner for a collection plan and dates.',
    ];

    public function __construct(private readonly OpenRouterClient $client, private readonly AiUsageService $usage) {}

    /** @return array{subject: string, body: string, written_by: string} */
    public function draft(string $kind, array $facts, User $boss): array
    {
        return $this->written($kind, $facts, $boss) ?? $this->template($kind, $facts);
    }

    private function written(string $kind, array $facts, User $boss): ?array
    {
        if (! $this->client->configured() || ! isset(self::GOALS[$kind])) {
            return null;
        }

        $company = \App\Company::withoutGlobalScopes()->find(\App\Support\UserContext::for($boss)->companyId);
        if (app(\App\Services\CompanyAiBudget::class)->refusal($company, 'sales_draft') !== null) {
            return null;
        }

        $packet = json_encode($facts, JSON_UNESCAPED_UNICODE);

        try {
            $answer = $this->client->json([
                ['role' => 'system', 'content' => implode("\n", [
                    'You write internal emails from the managing director of a freight forwarder to his own staff.',
                    'Use only the facts given. Copy every number exactly; never calculate, round, compare or invent one.',
                    'Direct, clear and respectful: state the situation with the figures, then the specific questions or asks, with a deadline. 120 to 220 words.',
                    'Short paragraphs; one paragraph per client, lane or measure when there are several.',
                    'Start with "Hi team," and end with "Thanks," and nothing after it: the signature is added when it is sent. No placeholders.',
                    'Never blame a named person; ask for reasons and plans.',
                ])],
                ['role' => 'user', 'content' => 'Goal: ' . self::GOALS[$kind] . "\nFacts: " . $packet],
            ], [
                'type' => 'object',
                'properties' => [
                    'subject' => ['type' => 'string'],
                    'paragraphs' => ['type' => 'array', 'items' => ['type' => 'string']],
                ],
                'required' => ['subject', 'paragraphs'],
                'additionalProperties' => false,
            ], 'internal_email', 'draft_timeouts', $this->usage->freeFirst('draft'));
        } catch (RuntimeException $e) {
            return null;
        }

        $this->usage->log($answer['usage'], 'sales_draft', $boss);

        $subject = trim((string) ($answer['data']['subject'] ?? ''));
        $paragraphs = array_values(array_filter(array_map('trim', $answer['data']['paragraphs'] ?? [])));

        preg_match_all('/\d+/', $subject . ' ' . implode(' ', $paragraphs), $found);
        preg_match_all('/\d+/', $packet, $known);

        if ($subject === '' || $paragraphs === [] || array_diff($found[0], $known[0]) !== []) {
            return null;
        }

        return ['subject' => $subject, 'body' => $this->html($paragraphs), 'written_by' => 'ai'];
    }

    /** The plain version: every figure, and the ask. */
    private function template(string $kind, array $facts): array
    {
        $b = $facts['branch'] ?? 'the branch';

        [$subject, $paragraphs] = match ($kind) {
            'next_month_targets' => ["{$b}: targets for {$facts['month']}", array_merge(
                ["Here are the targets I propose for {$b} for {$facts['month']}, set from our last 3 months and the trend against the 9 months before:"],
                array_map(fn ($mode, $m) => strtoupper($mode) . ": {$m['proposed_shipments']} shipments and {$m['proposed_tonnage_kg']} kg"
                    . (isset($m['proposed_revenue_inr']) ? ", ₹{$m['proposed_revenue_inr']} revenue" : '')
                    . " (last 3 months: {$m['last_3_months_average_shipments']} shipments, {$m['last_3_months_average_tonnage_kg']} kg a month; trend {$m['trend_percent']}%).",
                    array_keys($facts['modes']), $facts['modes']),
                ['Please confirm these, or tell me by the end of the week what you would change and why.']
            )],
            'volume_drop' => ["{$b}: tonnage down " . abs($facts['change_percent']) . '%', array_merge(
                ["{$b}'s tonnage over the last 3 months averaged {$facts['monthly_tonnage_kg_last_3_months']} kg a month, against {$facts['monthly_tonnage_kg_before']} kg in the 9 months before ({$facts['change_percent']}%)."],
                array_map(fn ($c) => "{$c['client']}: {$c['monthly_kg_last_3_months']} kg a month now, {$c['monthly_kg_before']} kg before.", $facts['clients_falling_most']),
                ['What is behind the drop for each of these, and what is the plan? Please reply within 2 days.']
            )],
            'top_clients_quiet' => ["{$b}: top clients gone quiet", array_merge(
                ['Some of our biggest clients have gone quiet:'],
                array_map(fn ($c) => "{$c['client']}: usually {$c['usual_quarter_kg']} kg a quarter, {$c['last_3_months_kg']} kg in the last 3 months.", $facts['clients']),
                ['For each one: what happened, when did we last speak to them, and what is the plan to win them back?']
            )],
            'behind_target' => ["{$b}: behind target for {$facts['month']}", array_merge(
                ["With {$facts['days_left']} days left, {$b} is pacing behind this month's targets:"],
                array_map(fn ($s) => strtoupper($s['mode']) . " {$s['measure']}: target {$s['target']}, so far {$s['so_far']}, month-end pace {$s['month_end_pace_percent']}%."
                    . (isset($s['of_which_general_billing']) ? " (So far includes {$s['of_which_general_billing']} billed not for a shipment.)" : ''), $facts['behind']),
                ['What is the plan to close the gap in the days left?']
            )],
            'losing_on_price' => ["{$b}: quotes lost on price", array_merge(
                ["In the last {$facts['days']} days we have lost these lanes on price:"],
                array_map(fn ($l) => "{$l['lane']}: {$l['lost_on_price']} of {$l['closed']} closed enquiries ({$l['share_percent']}%).", $facts['lanes']),
                ['Please review our buy rates and margins on these lanes and come back with options.']
            )],
            'slow_replies' => ["{$b}: first replies are slower", [
                "Our median time to the first reply is {$facts['median_hours_last_30_days']} hours over the last 30 days, against {$facts['median_hours_60_days_before']} hours before.",
                "{$facts['enquiries_lost_for_slow_reply_last_90_days']} enquiries were lost for a slow reply in the last 90 days.",
                'What is causing the delay, and how do we bring it back down?',
            ]],
            default => ["{$b}: money overdue beyond 60 days", array_merge(
                ["₹{$facts['overdue_60_plus_inr']} is overdue beyond 60 days. The clients owing most:"],
                array_map(fn ($c) => "{$c['client']}: ₹{$c['overdue_60_plus_inr']}.", $facts['clients']),
                ['Please share a collection plan with dates for each.']
            )],
        };

        return ['subject' => $subject, 'body' => $this->html(array_merge(['Hi team,'], $paragraphs, ['Thanks,'])), 'written_by' => 'template'];
    }

    private function html(array $paragraphs): string
    {
        return implode('', array_map(fn ($p) => '<p>' . e($p) . '</p>', $paragraphs));
    }
}
