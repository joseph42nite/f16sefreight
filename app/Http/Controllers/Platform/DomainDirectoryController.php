<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Freight\EmailInboxController;
use App\Services\GlobalDomainDirectory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * F16s staff review of what the platform has learned — guide §5.6.
 *
 * 🔴 **The directory is platform-wide, so a wrong entry misfiles mail for every tenant at
 * once** — and the tenant it hurts cannot see why, because the rule is not theirs. That
 * asymmetry is the reason nothing here applies itself: the learning is automatic, the
 * APPLYING is a decision a person makes with the evidence in front of them.
 *
 * 🔐 Superadmin only, and the payload is domains and counts. Nothing about a client, a
 * thread or a subject reaches this screen, because none of it reaches the directory.
 */
class DomainDirectoryController extends Controller
{
    /**
     * What is waiting, what is live, and what was turned down.
     *
     * ⚠️ Rejected rows are LISTED, not hidden. A reviewer needs to see that a domain was
     * already considered and refused — otherwise the same argument arrives again with no
     * memory of the first answer.
     */
    public function index(Request $request): JsonResponse
    {
        $status = $request->string('status')->toString() ?: 'proposed';

        $rows = DB::table('global_domain_classifications as g')
            ->leftJoin('users as u', 'u.id', '=', 'g.reviewed_by')
            ->when(in_array($status, ['proposed', 'approved', 'rejected'], true),
                fn ($q) => $q->where('g.status', $status))
            ->orderByDesc('g.confirmations')
            ->orderBy('g.domain')
            ->limit(500)
            ->get([
                'g.id', 'g.domain', 'g.classification', 'g.source', 'g.status',
                'g.confirmations', 'g.reviewed_at', 'g.review_note', 'g.created_at',
                'u.name as reviewed_by_name',
            ]);

        return response()->json([
            'rows'     => $rows,
            'counts'   => DB::table('global_domain_classifications')
                ->select('status', DB::raw('COUNT(*) as n'))
                ->groupBy('status')->pluck('n', 'status'),
            // The vocabulary a reviewer may correct a proposal to.
            'classifications' => EmailInboxController::CLASSIFICATIONS,
        ]);
    }

    /**
     * Approve a proposal — from here it classifies mail for every tenant.
     *
     * ⚠️ The reviewer may CORRECT the classification while approving. A proposal is a
     * guess from a partner row or a pile of corrections; the reviewer is the first person
     * who actually knows, and making them reject-and-wait to fix a wrong guess would mean
     * the right answer never gets recorded at all.
     */
    public function approve(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'classification' => ['nullable', 'string',
                                 'in:' . implode(',', EmailInboxController::CLASSIFICATIONS)],
            'note'           => ['nullable', 'string', 'max:255'],
        ]);

        $row = DB::table('global_domain_classifications')->find($id);

        if ($row === null) {
            return response()->json(['error' => 'Not found.'], 404);
        }

        DB::table('global_domain_classifications')->where('id', $id)->update([
            'classification' => $data['classification'] ?? $row->classification,
            'status'         => 'approved',
            'reviewed_by'    => auth()->id(),
            'reviewed_at'    => now(),
            'review_note'    => $data['note'] ?? null,
            'updated_at'     => now(),
        ]);

        return response()->json(['status' => true, 'domain' => $row->domain]);
    }

    /**
     * Turn a proposal down.
     *
     * 🔴 The row is KEPT as rejected rather than deleted. Deleting it means the next
     * partner added for that domain proposes it again, and the reviewer answers the same
     * question forever with no record of having answered it.
     */
    public function reject(Request $request, int $id): JsonResponse
    {
        $data = $request->validate(['note' => ['nullable', 'string', 'max:255']]);

        $updated = DB::table('global_domain_classifications')->where('id', $id)->update([
            'status'      => 'rejected',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'review_note' => $data['note'] ?? null,
            'updated_at'  => now(),
        ]);

        return $updated === 0
            ? response()->json(['error' => 'Not found.'], 404)
            : response()->json(['status' => true]);
    }

    /** Run the promotion sweep on demand, so a reviewer can see what it would add. */
    public function promote(GlobalDomainDirectory $directory): JsonResponse
    {
        return response()->json(['proposed' => $directory->promoteFromOverrides()]);
    }
}
