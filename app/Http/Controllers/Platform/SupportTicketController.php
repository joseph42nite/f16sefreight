<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Support\UserContext;
use App\SupportTicket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * The support desk — guide §5.6, PRD.md §5.10.
 *
 * ═══ TWO SURFACES, TWO AUDIENCES ════════════════════════════════════════════
 *   store()   a TENANT user files a report from VisualReporter.vue
 *   index/update()  F16s staff work the queue on `superadmin.`
 *
 * The guide says the platform endpoints sit behind superadmin, and they do — but the
 * REPORTER is an ordinary tenant user (PRD.md §5.10), so `POST /api/tickets` lives on
 * the tenant side. Putting the create path behind superadmin too would mean nobody
 * could ever file a ticket.
 *
 * ⚠️ **No LLM anywhere in this path.** The route, selector and console logs are
 * captured deterministically by the browser. A hallucinated selector makes a bug
 * report worse than useless — it sends a developer to the wrong screen carrying
 * confident-looking evidence.
 */
class SupportTicketController extends Controller
{
    /** A tenant user files a report. */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'route'            => 'required|string|max:255',
            'description'      => 'required|string',
            'element_selector' => 'nullable|string|max:255',
            'screenshot_path'  => 'nullable|string|max:500',
            'console_logs'     => 'nullable|array',
        ]);

        $context = UserContext::for(auth()->user());

        $ticket = SupportTicket::create($data + [
            // 🔴 Both taken from the SESSION, never from the request. A reporter who
            // could name their own agent_id could file tickets against another tenant,
            // and the support desk reads across all of them.
            'agent_id' => $context->agentId,
            'user_id'  => $context->userId,
            'status'   => 'open',
        ]);

        return response()->json($ticket->fresh(), 201);
    }

    /** The desk queue. Cross-tenant by design — superadmin is not tenant-bound. */
    public function index(Request $request): JsonResponse
    {
        $tickets = SupportTicket::query()
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('agent_id'), fn ($q) => $q->where('agent_id', $request->integer('agent_id')))
            ->with(['reporter:id,name,email,designation', 'branch:id,agent_name,branch_code'])
            // Oldest OPEN first: a support queue sorted newest-first buries the ticket
            // that has been waiting longest, which is the one most likely to be a
            // customer about to give up.
            ->orderByRaw("FIELD(status, 'open', 'investigating', 'resolved')")
            ->orderBy('created_at')
            ->paginate(50);

        return response()->json($tickets);
    }

    public function show(SupportTicket $ticket): JsonResponse
    {
        return response()->json($ticket->load(['reporter:id,name,email,designation', 'branch:id,agent_name,branch_code']));
    }

    /**
     * Status transitions: open -> investigating -> resolved.
     *
     * ⚠️ **Forward only, and re-opening is a NEW ticket.** A resolved ticket that can
     * silently return to `open` destroys the only queue metric that matters — how long
     * a report waited before somebody looked — because its clock would restart. If the
     * bug is back, that is a new report with its own timestamps and its own evidence.
     */
    public function update(Request $request, SupportTicket $ticket): JsonResponse
    {
        $data = $request->validate([
            'status' => 'required|string|in:' . implode(',', SupportTicket::STATUSES),
        ]);

        $order = array_flip(SupportTicket::STATUSES);

        if ($order[$data['status']] < $order[$ticket->status]) {
            return response()->json([
                'error'  => sprintf(
                    'A ticket cannot go back from %s to %s. If the problem has returned, file a new report.',
                    $ticket->status, $data['status']
                ),
                'reason' => 'backwards_transition',
            ], 422);
        }

        $ticket->update(['status' => $data['status']]);

        return response()->json($ticket->fresh());
    }
}
