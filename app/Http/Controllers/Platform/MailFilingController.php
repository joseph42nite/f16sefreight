<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * How well mail is filed, so it can be improved (user, 2026-09-17: "show in superadmin so we can work on the
 * regex"). Per company or all, over a period of conversations started:
 *   - for each type filed: how many, how many a person changed, and to what;
 *   - missed enquiries: filed as something else, changed to customer enquiry;
 *   - the sender domains changed most often, and recent changes with the words the classifier read.
 *
 * ⚠️ **The per-source breakdown was built and then removed** (user, 2026-09-20: "if it's doing a
 * good job we don't need the backend page in superadmin to determine"). The COLUMNS behind it are
 * still written on every decision — `auto_classification_source`, `_confidence`, `_rubric` — because
 * recording them costs nothing and cannot be done retroactively: the day filing goes wrong, "which
 * source, at what confidence, under which rubric" is the first question and the only way to answer
 * it is to have been writing it down. What was dropped is the screen, not the record. Read them with
 * SQL if that day comes.
 *
 * 🔒 Super admin only. Reads what `email_threads.auto_classification` and `email_classification_overrides` hold.
 */
class MailFilingController extends Controller
{
    public const PERIODS = [7, 30, 90];

    public function index(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_id' => ['nullable', 'integer'],
            'days' => ['nullable', 'in:' . implode(',', self::PERIODS)],
        ]);
        $days = (int) ($data['days'] ?? 30);
        $since = now()->subDays($days);
        $companyId = $data['company_id'] ?? null;
        $branches = fn ($q, $column) => $companyId === null ? $q
            : $q->whereIn($column, DB::table('agents_info')->where('company_id', $companyId)->select('id'));

        $threads = $branches(DB::table('email_threads')->whereNotNull('auto_classification')->where('created_at', '>=', $since), 'agent_id');

        $filed = (clone $threads)
            ->selectRaw('auto_classification AS filed_as, COUNT(*) AS filed, SUM(classification <> auto_classification) AS changed')
            ->groupBy('auto_classification')->orderByDesc('filed')->get();
        $changedTo = (clone $threads)->whereColumn('classification', '<>', 'auto_classification')
            ->selectRaw('auto_classification AS filed_as, classification AS changed_to, COUNT(*) AS n')
            ->groupBy('auto_classification', 'classification')->get()->groupBy('filed_as');

        $corrections = $branches(DB::table('email_classification_overrides as o')->where('o.created_at', '>=', $since), 'o.agent_id');

        return response()->json([
            'days' => $days,
            'periods' => self::PERIODS,
            'companies' => DB::table('companies')->whereNull('deleted_at')->orderBy('name')->get(['id', 'name']),
            'by_type' => $filed->map(fn ($r) => [
                'filed_as' => $r->filed_as,
                'filed' => (int) $r->filed,
                'changed' => (int) $r->changed,
                'changed_percent' => $r->filed > 0 ? (int) round($r->changed * 100 / $r->filed) : 0,
                'changed_to' => collect($changedTo[$r->filed_as] ?? [])->mapWithKeys(fn ($c) => [$c->changed_to => (int) $c->n]),
            ])->values(),
            'missed_enquiries' => (int) (clone $threads)->where('classification', 'customer_enquiry')
                ->where('auto_classification', '<>', 'customer_enquiry')->count(),
            'domains' => (clone $corrections)
                ->selectRaw('o.sender_domain, o.original_classification AS was, o.corrected_classification AS now, COUNT(*) AS n, MAX(o.email_subject) AS example')
                ->groupBy('o.sender_domain', 'o.original_classification', 'o.corrected_classification')
                ->orderByDesc('n')->limit(30)->get(),
            'recent' => (clone $corrections)
                ->leftJoin('agents_info as a', 'a.id', '=', 'o.agent_id')->leftJoin('companies as c', 'c.id', '=', 'a.company_id')
                ->leftJoin('users as u', 'u.id', '=', 'o.corrected_by')
                ->orderByDesc('o.created_at')->limit(50)
                ->get(['o.id', 'o.created_at', 'c.name as company', 'u.name as by', 'o.original_classification as was',
                    'o.corrected_classification as now', 'o.sender_email', 'o.email_subject as subject', 'o.email_snippet as snippet']),
        ]);
    }
}
