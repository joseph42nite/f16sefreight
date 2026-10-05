<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Services\Sales\StaffReviews;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * The page a quarterly review's "See the details" opens (owner, 2026-10-05; GAPS #457): the quarter's full facts.
 * 🔒 Only the people in that review's chain — the Boss, the salesperson who owns or receives it, the staff it is
 * addressed to — in the same company, on Command.
 */
class StaffReviewController extends Controller
{
    public function show(int $id): JsonResponse
    {
        $context = UserContext::for(auth()->user());
        abort_unless($context->tierAtLeast('command'), 403, 'Quarterly reviews are a Command feature.');

        $row = DB::table('boss_mail_suggestions')->where('id', $id)->where('company_id', $context->companyId)
            ->where('kind', StaffReviews::KIND)->first();
        abort_if($row === null, 404);

        $to = array_map('intval', json_decode($row->suggested_to, true) ?: []);
        $inChain = $context->designation === 'boss' || (int) $row->owner_user_id === $context->userId || in_array($context->userId, $to, true);
        abort_unless($inChain, 403, 'This review is for the people who worked the account.');

        return response()->json(['id' => $row->id, 'status' => $row->status, 'sent_at' => $row->sent_at,
            'facts' => json_decode($row->facts, true)]);
    }
}
