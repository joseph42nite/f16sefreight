<?php

namespace App\Http\Controllers\Freight;

use App\Company;
use App\Http\Controllers\Controller;
use App\Services\OcrCreditService;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Credits, as the workspace shows them: per DOCUMENT, never in money (user, 2026-09-14).
 *
 * Rates: an airway bill (read by fixed boxes, no AI) 0 · an invoice or packing list read by AI 1 ·
 * a scan read by AI from page images 3. A document read by labels — no credits, or the daily limit —
 * uses none. Everyone who works in the workspace sees it, so nobody extracts blind.
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
        ];

        $summary = collect($kinds)->map(fn ($label, $kind) => [
            'kind' => $kind,
            'label' => $label,
            'documents' => $month->filter(fn ($d) => $this->kind($d) === $kind)->count(),
            'credits' => (int) $month->filter(fn ($d) => $this->kind($d) === $kind)->sum('credits'),
        ])->values();

        return response()->json([
            'balance' => (int) $company->ocr_credits_balance,
            // Credits may run below zero down to this, so a busy month can finish its shipments.
            'floor' => $company->creditFloor(),
            'rates' => ['awb' => 0, 'text' => OcrCreditService::TEXT_COST, 'scan' => OcrCreditService::VISION_COST],
            'month' => [
                'documents' => $month->count(),
                'credits' => (int) $month->sum('credits'),
                'by_kind' => $summary,
            ],
            'recent' => $documents->orderByDesc('p.id')->limit(25)->get()->map(fn ($d) => [
                'id' => $d->id,
                'filename' => $d->original_filename,
                'kind' => $this->kind($d),
                'label' => $kinds[$this->kind($d)] ?? $d->status,
                'credits' => (int) $d->credits,
                'status' => $d->status,
                'user' => $d->user,
                'created_at' => $d->created_at,
            ]),
        ]);
    }

    /** What kind of reading a document got, which decides its credits. */
    private function kind(object $document): string
    {
        return match (true) {
            $document->extraction_path === 'vision' => 'scan',
            $document->status === 'awaiting_vision_consent' || $document->extraction_path === 'none' => 'waiting',
            $document->extraction_path === 'coordinates' || ($document->extraction_path === null && (int) $document->credits === 0 && $document->status === 'completed') => 'awb',
            (int) $document->credits > 0 || (bool) $document->read_by_ai => 'text',
            default => 'labels',
        };
    }
}
