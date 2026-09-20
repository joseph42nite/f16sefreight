<?php

namespace App\Services\Bank;

use App\Services\AiUsageService;
use App\Services\Help\OpenRouterClient;
use App\User;
use RuntimeException;

/**
 * The mail that asks a client about a payment that does not match its bill (user, 2026-09-19).
 *
 * 🔴 **Gemma words it from the figures and may not add a number.** Any figure in the answer that is not in the facts
 * throws the answer away and the plain template is used — the same rule as the client emails and the Boss's mails. A
 * chasing mail that invents an amount is worse than no mail at all.
 *
 * ⚠️ Nothing here sends. Accounts read it, edit it and send it from their own mailbox.
 */
class PaymentQueryDrafter
{
    /** What each mail is for. */
    private const GOALS = [
        'short' => 'The client has paid less than the invoice. State the invoice, what it was for, what was billed, '
            . 'what was received, the date and reference of the payment, and the shortfall. Ask them to confirm whether '
            . 'the balance is on its way or whether something on the invoice is in question, and by when.',
        'over' => 'The client has paid more than the invoice. State the invoice, what was billed, what was received, '
            . 'and the excess. Ask whether it was meant for another invoice, or whether they would like it refunded or '
            . 'held against their next shipment.',
        'unidentified' => 'A payment has arrived that we cannot place against any invoice. State the amount, the date, '
            . 'the reference and whatever the bank narration says, and ask which invoices it is meant to settle.',
        // Chasing what is overdue (user, 2026-09-20). Firm, never threatening: the relationship outlives the debt.
        'collection' => 'Invoices are overdue. State how much is outstanding in total, list each invoice with its '
            . 'date and how many days it is past due, and ask for payment or for a date by which it will be made. '
            . 'Courteous and businesslike; no threats, no legal language, no interest claims.',
        // A supplier's own statement against our vouchers (user, 2026-09-19) — an airline's CASS, a trucker's month.
        'vendor_difference' => 'A supplier\'s statement does not agree with what we booked. Name the statement and the '
            . 'period, list each shipment where the figures differ with what they billed and what we booked, and ask '
            . 'them to check those lines and send a corrected statement or a credit note.',
    ];

    public function __construct(private readonly OpenRouterClient $client, private readonly AiUsageService $usage) {}

    /** @return array{subject: string, body: string, written_by: string} */
    public function draft(string $kind, array $facts, User $by): array
    {
        return $this->written($kind, $facts, $by) ?? $this->template($kind, $facts);
    }

    private function written(string $kind, array $facts, User $by): ?array
    {
        if (! $this->client->configured() || ! isset(self::GOALS[$kind])) {
            return null;
        }

        $company = \App\Company::withoutGlobalScopes()->find(\App\Support\UserContext::for($by)->companyId);

        if (app(\App\Services\CompanyAiBudget::class)->refusal($company, 'payment_query') !== null) {
            return null;
        }

        $packet = json_encode($facts, JSON_UNESCAPED_UNICODE);

        try {
            $answer = $this->client->json([
                ['role' => 'system', 'content' => implode("\n", [
                    'You write short emails from a freight forwarder\'s accounts desk to a client about a payment.',
                    'Use only the facts given. Copy every number and reference exactly; never calculate, round or invent one.',
                    'Courteous and plain: what was billed, what arrived, the difference, and the one thing you are asking for.',
                    '60 to 120 words. Start with "Hello," and end with "Kind regards," and nothing after it — the signature is added when it is sent.',
                    'No placeholders, no apologies, no threats.',
                ])],
                ['role' => 'user', 'content' => 'Goal: ' . self::GOALS[$kind] . "\nFacts: " . $packet],
            ], [
                'type' => 'object',
                'properties' => ['subject' => ['type' => 'string'], 'paragraphs' => ['type' => 'array', 'items' => ['type' => 'string']]],
                'required' => ['subject', 'paragraphs'],
                'additionalProperties' => false,
            ], 'payment_query', 'draft_timeouts', $this->usage->freeFirst('draft'));
        } catch (RuntimeException $e) {
            return null;
        }

        $this->usage->log($answer['usage'], 'payment_query', $by);

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
        $money = fn ($n) => '₹' . number_format((float) $n, 2);
        $invoice = $facts['invoice_no'] ?? 'our invoice';
        // Only the payment mails have a payment in their facts; a supplier's statement has none.
        $paid = isset($facts['received'])
            ? "{$money($facts['received'])} reached us on {$facts['value_date']}"
                . (filled($facts['reference'] ?? null) ? " under reference {$facts['reference']}" : '')
            : '';

        [$subject, $paragraphs] = match ($kind) {
            'short' => ["{$invoice}: {$money($facts['difference'])} short",
                [
                    "Invoice {$invoice} for {$money($facts['billed'])} was raised on {$facts['document_date']}"
                        . (filled($facts['job_no'] ?? null) ? " against shipment {$facts['job_no']}" : '') . '.',
                    "{$paid}, which leaves {$money($facts['difference'])} outstanding.",
                    'Could you confirm whether the balance is on its way, or tell us what on the invoice is in question? We will hold the account open meanwhile.',
                ]],
            'collection' => [
                count($facts['invoices']) === 1
                    ? "{$facts['invoices'][0]['invoice_no']}: {$money($facts['total_overdue'])} overdue"
                    : count($facts['invoices']) . " invoices overdue — {$money($facts['total_overdue'])}",
                array_merge(
                    ['Our records show ' . $money($facts['total_overdue']) . ' outstanding past its due date'
                        . ($facts['oldest_days'] > 0 ? ", the oldest by {$facts['oldest_days']} days" : '') . '.'],
                    array_map(fn ($i) => "{$i['invoice_no']} of {$i['document_date']}: " . $money($i['outstanding'])
                        . ", due {$i['due_on']}"
                        . ($i['days_overdue'] > 0 ? " — {$i['days_overdue']} days ago" : '') . '.', $facts['invoices']),
                    ['Could you let us know when payment will be made, or tell us if anything on these is in question?']
                )],
            'vendor_difference' => [
                "{$facts['vendor']} — {$facts['period']}: " . count($facts['lines']) . ' line(s) to check',
                array_merge(
                    ['Thank you for the statement' . (filled($facts['statement_no'] ?? null) ? " {$facts['statement_no']}" : '')
                        . " for {$facts['period']}, totalling {$money($facts['their_total'])}."],
                    array_map(fn ($l) => ($l['reference'] ?? $l['shipment'] ?? 'One line') . ': you have billed '
                        . $money($l['they_billed'])
                        . (isset($l['we_booked']) ? ', we have ' . $money($l['we_booked']) . ' booked' : ', we have nothing booked')
                        . (isset($l['difference']) ? ' — a difference of ' . $money($l['difference']) : '') . '.', $facts['lines']),
                    ['Could you check these and send a corrected statement or a credit note? Everything else on the statement agrees.']
                )],
            'over' => ["{$invoice}: {$money($facts['difference'])} more than billed",
                [
                    "Invoice {$invoice} was for {$money($facts['billed'])}.",
                    "{$paid}, which is {$money($facts['difference'])} more than the invoice.",
                    'Was it meant to cover another invoice as well? If not, tell us whether to refund it or hold it against your next shipment.',
                ]],
            default => ['A payment we cannot place',
                [
                    "{$paid}." . (filled($facts['narration'] ?? null) ? " The bank narration reads \"{$facts['narration']}\"." : ''),
                    'We cannot tell which invoices it is meant to settle.',
                    'Could you let us know the invoice numbers it covers, so we can apply it correctly?',
                ]],
        };

        return ['subject' => $subject, 'body' => $this->html(array_merge(['Hello,'], $paragraphs, ['Kind regards,'])), 'written_by' => 'template'];
    }

    private function html(array $paragraphs): string
    {
        return implode('', array_map(fn ($p) => '<p>' . e($p) . '</p>', $paragraphs));
    }
}
