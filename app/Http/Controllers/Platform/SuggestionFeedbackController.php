<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Freight\SalesOutreachController;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * How reps respond to suggested client emails, across every customer (user, 2026-09-15): what was sent, what
 * was dismissed and why — so F16s can see which suggestions miss and improve them.
 *
 * 🔒 Superadmin only. The figures behind each suggestion are shown; the client's name and domain are not —
 * improving a suggestion needs the pattern, not whose account it was.
 */
class SuggestionFeedbackController extends Controller
{
    private const DAYS = 90;

    public function index(): JsonResponse
    {
        $since = now()->subDays(self::DAYS);

        $answered = DB::table('sales_action_queue')
            ->where('audience', 'client')
            ->where(fn ($q) => $q->where('sent_at', '>=', $since)->orWhere('dismissed_at', '>=', $since));

        $byType = (clone $answered)
            ->selectRaw("action_type, SUM(status = 'acted') AS sent, SUM(status = 'dismissed') AS dismissed")
            ->groupBy('action_type')->get()
            ->map(fn ($r) => [
                'type' => $r->action_type,
                'sent' => (int) $r->sent,
                'dismissed' => (int) $r->dismissed,
                'dismissed_percent' => $r->sent + $r->dismissed > 0 ? (int) round($r->dismissed * 100 / ($r->sent + $r->dismissed)) : null,
            ]);

        $reasons = (clone $answered)->where('status', 'dismissed')
            ->selectRaw('action_type, dismissed_reason, COUNT(*) AS n')
            ->groupBy('action_type', 'dismissed_reason')->get();

        $recent = DB::table('sales_action_queue as q')
            ->join('agents_info as a', 'a.id', '=', 'q.agent_id')
            ->join('companies as c', 'c.id', '=', 'a.company_id')
            ->where('q.audience', 'client')->where('q.status', 'dismissed')->where('q.dismissed_at', '>=', $since)
            ->orderByDesc('q.dismissed_at')->limit(100)
            ->get(['q.id', 'q.action_type', 'q.transport_mode', 'q.fact_packet', 'q.dismissed_reason', 'q.dismissed_note', 'q.dismissed_at', 'c.name as company', 'c.tier']);

        return response()->json([
            'days' => self::DAYS,
            'reasons' => SalesOutreachController::DISMISS_REASONS,
            'by_type' => $byType->values(),
            'reasons_by_type' => $reasons->groupBy('action_type')->map(fn ($rows) => $rows->pluck('n', 'dismissed_reason')),
            'recent' => $recent->map(fn ($r) => [
                'id' => $r->id, 'type' => $r->action_type, 'mode' => $r->transport_mode,
                'company' => $r->company, 'tier' => $r->tier,
                'facts' => json_decode($r->fact_packet, true),
                'reason' => $r->dismissed_reason, 'note' => $r->dismissed_note, 'dismissed_at' => $r->dismissed_at,
            ])->values(),
        ]);
    }
}
