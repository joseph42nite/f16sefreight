<?php

namespace App\Http\Controllers\Freight;

use App\Company;
use App\Http\Controllers\Controller;
use App\Services\OcrCreditService;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Credits, as the workspace shows them: per piece of AI reading, never in money (user, 2026-09-14).
 *
 * Rates: an airway bill (read by fixed boxes, no AI) 0 · an invoice or packing list read by AI 1 ·
 * a scan read by AI from page images 3 · **one inbound mail filed by AI 0.1** (user, 2026-09-20).
 * A document read by labels — no credits, or the daily limit — uses none. Everyone who works in the
 * workspace sees it, so nobody extracts blind.
 *
 * 🔴 **MAIL IS COUNTED, NOT LISTED.** The month's total and the rate card include it; the table
 * below them does not, and that is the point of two queries rather than one. "Recent documents"
 * lists things an operator uploaded and can open — a mail the poller filed at 04:00 is neither,
 * and a hundred of them a day would bury the documents the panel exists to explain. The mail
 * that can be read IS the thread, in the inbox, where it belongs.
 *
 * ⚠️ Mail rows are found by `email_message_id`, never by `notes` or by amount. The note is
 * English that will be reworded and 0.1 is a price that will change; the foreign key is what
 * the row actually is.
 */
class CreditsController extends Controller
{
    public function index(): JsonResponse
    {
        $context = UserContext::for(auth()->user());
        $company = $context->companyId ? Company::withoutGlobalScopes()->find($context->companyId) : null;

        if ($company === null) {
            return response()->json(['error' => 'This account is not attached to a company.'], 422);
        }

        $documents = DB::table('pdf_processing_jobs as p')
            ->join('users as u', 'u.id', '=', 'p.user_id')
            ->join('agents_info as a', 'a.id', '=', 'u.branch_name')
            ->where('a.company_id', $company->id)
            ->leftJoinSub(
                DB::table('ocr_credit_transactions')->groupBy('pdf_processing_job_id')
                    ->selectRaw('pdf_processing_job_id, -SUM(amount) AS credits'),
                't', 't.pdf_processing_job_id', '=', 'p.id'
            )
            // Whether the AI actually read it, from the usage log — not inferred from credits, because
            // documents read before the rates existed (2026-09-14) used none.
            ->selectRaw('EXISTS (SELECT 1 FROM llm_usage_logs l WHERE l.pdf_processing_job_id = p.id) AS read_by_ai')
            ->addSelect(['p.id', 'p.original_filename', 'p.extraction_path', 'p.status', 'p.created_at', 'u.name as user', DB::raw('COALESCE(t.credits, 0) AS credits')]);

        $month = (clone $documents)->where('p.created_at', '>=', now()->startOfMonth())->get();
        $kinds = [
            'text' => 'Invoices & packing lists read by AI',
            'scan' => 'Scans read by AI',
            'awb' => 'Airway bills (no AI)',
            'labels' => 'Read by labels, no AI',
            'waiting' => 'Scans waiting for approval',
            'mail' => 'Inbound mail filed by AI',
        ];

        // ⚠️ `except('mail')` — mail is in $kinds for its label, but it is not a document kind
        // and `kind()` never returns it. Mapping over it here would emit an empty mail row
        // that the real one below is then pushed alongside.
        $summary = collect($kinds)->except('mail')->map(fn ($label, $kind) => [
            'kind' => $kind,
            'label' => $label,
            'count' => $month->filter(fn ($d) => $this->kind($d) === $kind)->count(),
            'credits' => round((float) $month->filter(fn ($d) => $this->kind($d) === $kind)->sum('credits'), 2),
        ])->values();

        $mail = $this->mailThisMonth($company->id);

        return response()->json([
            'balance' => round((float) $company->ocr_credits_balance, 2),
            // Credits may run below zero down to this, so a busy month can finish its shipments.
            'floor' => $company->creditFloor(),
            'rates' => [
                'awb' => 0,
                'text' => OcrCreditService::TEXT_COST,
                'scan' => OcrCreditService::VISION_COST,
                // A tenth of a credit, which is why credits carry decimals at all.
                'mail' => OcrCreditService::MAIL_COST,
            ],
            'month' => [
                'documents' => $month->count(),
                'mails' => $mail['count'],
                'credits' => round((float) $month->sum('credits') + $mail['credits'], 2),
                'by_kind' => $summary->push([
                    'kind' => 'mail',
                    'label' => $kinds['mail'],
                    'count' => $mail['count'],
                    'credits' => $mail['credits'],
                ])->values(),
            ],
            'recent' => $documents->orderByDesc('p.id')->limit(25)->get()->map(fn ($d) => [
                'id' => $d->id,
                'filename' => $d->original_filename,
                'kind' => $this->kind($d),
                'label' => $kinds[$this->kind($d)] ?? $d->status,
                'credits' => round((float) $d->credits, 2),
                'status' => $d->status,
                'user' => $d->user,
                'created_at' => $d->created_at,
            ]),
        ]);
    }

    /**
     * This month's mail filing, from the ledger.
     *
     * ⚠️ The COUNT is of consumption rows and the CREDITS are the net of charges and refunds.
     * Counting net rows would hide a mail we charged for and gave back — which is exactly the
     * case worth seeing, because it means the model was called and did not answer.
     *
     * @return array{count: int, credits: float}
     */
    private function mailThisMonth(int $companyId): array
    {
        $row = DB::table('ocr_credit_transactions')
            ->where('company_id', $companyId)
            ->whereNotNull('email_message_id')
            ->where('created_at', '>=', now()->startOfMonth())
            ->selectRaw("COALESCE(SUM(transaction_type = 'consumption'), 0) AS mails, COALESCE(SUM(amount), 0) AS net")
            ->first();

        return ['count' => (int) $row->mails, 'credits' => round(-(float) $row->net, 2)];
    }

    /** What kind of reading a document got, which decides its credits. */
    private function kind(object $document): string
    {
        return match (true) {
            $document->extraction_path === 'vision' => 'scan',
            $document->status === 'awaiting_vision_consent' || $document->extraction_path === 'none' => 'waiting',
            $document->extraction_path === 'coordinates' || ($document->extraction_path === null && (float) $document->credits === 0.0 && $document->status === 'completed') => 'awb',
            (float) $document->credits > 0 || (bool) $document->read_by_ai => 'text',
            default => 'labels',
        };
    }
}
