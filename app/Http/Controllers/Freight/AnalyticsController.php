<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Funnel reporting — DSR / MSR / YSR. Guide §5.5, PRD.md §7.1.
 *
 * 🔴 **READS THE VIEWS. NEVER AGGREGATES `jobs` OR `enquiries` LIVE.** PRD.md §2242:
 * no COUNT/SUM/AVG on live transactional tables for a dashboard. Live aggregation
 * degrades exactly as a branch grows — the product gets slower the more successful the
 * customer is — and it competes for the rows operators are writing to all day.
 *
 * ⚠️ **Mode scoping is not a display filter.** A funnel blending air and sea describes
 * no business: the two have different cadences, competitors and price sensitivities.
 * The scope comes from the PORTAL, never from a query parameter a client could set.
 */
class AnalyticsController extends Controller
{
    private const GRAINS = [
        'day'   => 'dsr_funnel_view',
        'month' => 'msr_funnel_view',
        'year'  => 'ysr_funnel_view',
    ];

    /** Only the yearly view carries two bases; the other grains are unambiguous. */
    private const BASES = ['fiscal', 'calendar'];

    public function funnel(Request $request): JsonResponse
    {
        $this->authorize('viewAnalytics');

        $data = $request->validate([
            'grain' => 'nullable|string|in:day,month,year',
            'basis' => 'nullable|string|in:fiscal,calendar',
            'from'  => 'nullable|date',
            'to'    => 'nullable|date',
        ]);

        $grain = $data['grain'] ?? 'month';
        $context = UserContext::for(auth()->user());

        $query = DB::table(self::GRAINS[$grain])
            // Tenancy comes from the USER's branch, never from the request. The views
            // are not Eloquent models, so no global scope protects them.
            ->where('agent_id', $context->agentId);

        // 🔴 The portal decides the mode. A cross-mode portal (accounts, admin) has no
        // scope and legitimately sees both — that is the boss's comparison view.
        if (app()->bound('active_portal_scope')) {
            $query->where('transport_mode', app('active_portal_scope'));
        }

        // 🔴 **THE DOUBLE-COUNT TRAP.** ysr_funnel_view is a UNION ALL of the same
        // enquiries under two year bases. Query it without `period_basis` and every
        // row comes back twice under two different year labels, silently doubling
        // every count. It is REQUIRED here rather than defaulted silently, so the
        // caller states which twelve-month window they mean.
        if ($grain === 'year') {
            $basis = $data['basis'] ?? null;

            if ($basis === null) {
                return response()->json([
                    'error'  => 'A yearly funnel must state its year basis: fiscal (April–March, '
                              . 'matching document numbering) or calendar. Without it every enquiry '
                              . 'is counted under both.',
                    'reason' => 'basis_required',
                    'options' => self::BASES,
                ], 422);
            }

            $query->where('period_basis', $basis);
        }

        if (isset($data['from'])) {
            $query->whereDate('period_start', '>=', $data['from']);
        }
        if (isset($data['to'])) {
            $query->whereDate('period_start', '<=', $data['to']);
        }

        return response()->json([
            'grain'  => $grain,
            'basis'  => $grain === 'year' ? $data['basis'] : null,
            'mode'   => app()->bound('active_portal_scope') ? app('active_portal_scope') : null,
            // ⚠️ Ascending. A funnel is read as a trend, and a reversed axis reads as
            // the opposite trend to anyone skimming it.
            'periods' => $query->orderBy('period_start')->limit(400)->get(),
        ]);
    }
}
