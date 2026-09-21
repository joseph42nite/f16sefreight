<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Services\AgeingService;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Money in — one pipeline instead of three pages (guide §11.2, user 2026-09-21).
 *
 * 🔴 **Stages, not tabs.** Left to right is the order a rupee actually travels: handed over → raised → issued →
 * arrived → late. Tabs say "these are five things"; a pipeline says "this is one thing, and here is where it is
 * stuck", which is the question the desk opens the page with.
 *
 * ⚠️ **This controller counts; it does not re-answer.** Each stage's list is served by the register that already
 * owns it — billing documents, receipts, the chase queue — so merging the pages changed no figure. The
 * regression fixture asserts these counts against the same hand-computed numbers as every other screen.
 */
class MoneyInController extends Controller
{
    public function __construct(private readonly AgeingService $ageing) {}

    public function stages(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $branches = $this->branches();
        $picked = $request->integer('agent_id') ?: null;
        $scope = $picked ? [$picked] : $branches->pluck('id')->all();

        $drafts = fn (bool $handedOver) => DB::table('accounts_invoices')->whereIn('agent_id', $scope)
            ->where('status', 'draft')
            ->when($handedOver, fn ($q) => $q->whereNotNull('sent_to_accounts_at'),
                fn ($q) => $q->whereNull('sent_to_accounts_at'))
            ->selectRaw('COUNT(*) AS n, COALESCE(SUM(grand_total * exchange_rate), 0) AS total')->first();

        $toBill = $drafts(true);
        $ownDrafts = $drafts(false);

        // 🔴 A credit note counts the other way, here as everywhere: it gives money back.
        $issued = DB::table('accounts_invoices')->whereIn('agent_id', $scope)
            ->whereNotIn('status', ['draft', 'void'])
            ->selectRaw('COUNT(*) AS n, COALESCE(SUM(CASE WHEN type = ? THEN -1 ELSE 1 END * grand_total * exchange_rate), 0) AS total',
                ['credit_note'])->first();

        $received = DB::table('accounts_receipts')->whereIn('agent_id', $scope)
            ->selectRaw('COUNT(*) AS n, COALESCE(SUM(amount * exchange_rate), 0) AS total')->first();

        $unplaced = DB::table('bank_transactions')->whereIn('agent_id', $scope)
            ->where('direction', 'credit')->where('reconciliation_status', 'unreconciled')
            ->selectRaw('COUNT(*) AS n, COALESCE(SUM(amount), 0) AS total')->first();

        $overdue = $this->ageing->byParty($scope)->filter(fn ($p) => $p['overdue'] > 0);

        return response()->json([
            'stages' => [
                ['key' => 'to_bill', 'step' => 1, 'label' => 'To bill',
                 'count' => (int) $toBill->n, 'amount' => round((float) $toBill->total, 2),
                 'note' => 'Handed over by pricing, not billed yet.'],
                ['key' => 'drafts', 'step' => 2, 'label' => 'Drafts',
                 'count' => (int) $ownDrafts->n, 'amount' => round((float) $ownDrafts->total, 2),
                 'note' => 'Raised here and not finalized.'],
                ['key' => 'issued', 'step' => 3, 'label' => 'Issued',
                 'count' => (int) $issued->n, 'amount' => round((float) $issued->total, 2),
                 'note' => 'Numbered and gone to the client.'],
                ['key' => 'money_in', 'step' => 4, 'label' => 'Money in',
                 'count' => (int) $received->n + (int) $unplaced->n,
                 'amount' => round((float) $received->total, 2),
                 'unplaced' => ['count' => (int) $unplaced->n, 'amount' => round((float) $unplaced->total, 2)],
                 'note' => (int) $unplaced->n > 0
                     ? (int) $unplaced->n . ' payment(s) still to place.'
                     : 'Everything that arrived is placed.'],
                ['key' => 'overdue', 'step' => 5, 'label' => 'Overdue',
                 'count' => $overdue->count(), 'amount' => round($overdue->sum('overdue'), 2),
                 'tone' => $overdue->sum('overdue') > 0 ? 'warning' : null,
                 'note' => 'Past the due date and still owed.'],
            ],
            'branches' => $branches,
        ]);
    }

    private function branches()
    {
        $context = UserContext::for(auth()->user());

        return DB::table('agents_info')->where('company_id', $context->companyId)
            ->orderBy('agent_name')->get(['id', 'agent_name as name']);
    }
}
