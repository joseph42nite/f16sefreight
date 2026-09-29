<?php

namespace App\Services\Accounts;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * The monthly run of client payment report cards (GAPS #443): every client of every Command company, graded by
 * ClientPaymentGrader, kept one row per month — the history is the trend.
 *
 * Jev is asked only about a client who is slipping (graded C or D, or worse than last month) AND wrote to us that
 * month: what their mail says about paying — a dispute, a promise, money trouble. The figures cannot see those, and
 * they change what accounts should do next. It suggests; a person confirms it on the card.
 */
class ClientPaymentReports
{
    public const JEV_QUESTION = 'payment_mail';

    public function __construct(
        private readonly ClientPaymentGrader $grader,
        private readonly JevDecisions $jev,
    ) {}

    /** @return int cards written */
    public function run(Carbon $month): int
    {
        $month = $month->copy()->startOfMonth();
        $written = 0;

        $companies = DB::table('companies')->where('tier', 'command')->pluck('id');

        foreach (DB::table('customers')->whereIn('company_id', $companies)->orderBy('id')->get() as $customer) {
            $previous = DB::table('client_payment_reports')->where('customer_id', $customer->id)
                ->where('month', $month->copy()->subMonth()->toDateString())->value('score');

            $card = $this->grader->grade($customer, $month, $previous === null ? null : (int) $previous);

            // Nothing billed and nothing owed: no card — an empty row says nothing and clutters the history.
            if ($card['bills_due'] === 0 && $card['overdue_value'] == 0) {
                continue;
            }

            DB::table('client_payment_reports')->updateOrInsert(
                ['customer_id' => $customer->id, 'month' => $card['month']],
                $card + ['company_id' => $customer->company_id, 'updated_at' => now(), 'created_at' => now()]);
            $written++;

            if (in_array($card['grade'], ['C', 'D'], true) || $card['trend'] === 'worse') {
                $this->readTheirMail($customer, $month, $card);
            }
        }

        return $written;
    }

    /** Jev's reading of the client's own mail that month, stored on the card. Nothing to read, nothing asked. */
    private function readTheirMail(object $customer, Carbon $month, array $card): void
    {
        $mails = blank($customer->email_domain) ? collect() : DB::table('email_messages')
            ->where('direction', 'inbound')
            ->where('from', 'like', '%@' . strtolower($customer->email_domain) . '%')
            ->whereBetween('received_at', [$month->copy()->startOfMonth()->subDays(15), $month->copy()->endOfMonth()])
            ->orderByDesc('received_at')->limit(5)->get(['subject', 'body_snippet', 'received_at']);

        if ($mails->isEmpty()) {
            return;
        }

        $reportId = (int) DB::table('client_payment_reports')->where('customer_id', $customer->id)->where('month', $card['month'])->value('id');
        $agentId = (int) ($customer->branch_id ?: DB::table('agents_info')->where('company_id', $customer->company_id)->orderBy('id')->value('id'));

        $decision = $this->jev->ask(self::JEV_QUESTION, $agentId, 'client_payment_report', $reportId, [
            // The figures, so the mail is read in context — Jev is told not to decide from them.
            'how_late' => sprintf('%d%% of what fell due was paid on time; on average %s days late; %s overdue now.',
                (int) round(($card['on_time_share'] ?? 0) * 100), $card['avg_days_late'] ?? '—', number_format((float) $card['overdue_value'], 2)),
            'emails' => $mails->map(fn ($m) => ['date' => substr((string) $m->received_at, 0, 10), 'subject' => (string) $m->subject,
                'text' => mb_substr((string) $m->body_snippet, 0, 400)])->all(),
        ], config('accounts_decisions.questions.' . self::JEV_QUESTION . '.criteria'));

        if ($decision !== null) {
            DB::table('client_payment_reports')->where('id', $reportId)->update(['ai_decision_id' => $decision['id']]);
        }
    }
}
