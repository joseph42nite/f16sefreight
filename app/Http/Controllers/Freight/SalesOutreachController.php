<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\MailboxConnection;
use App\Services\AuditLogger;
use App\Services\Mail\MailBody;
use App\Services\Mail\MailProviderRegistry;
use App\Services\Sales\OutreachDrafter;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Client emails on the Sales page (PRD §7.3.7; user, 2026-09-15): findings from the client's own trends,
 * drafted by Gemma, edited and sent by the rep from their own mailbox.
 *
 * 🔒 A rep works only their own clients (`sales_id = me`), on every tier — the client is found by the
 * domain saved on `customers.email_domain`, which Tactical has too.
 * 🔴 NOTHING IS SENT WITHOUT THE REP PRESSING SEND (§5.7).
 */
class SalesOutreachController extends Controller
{
    /**
     * Why a suggestion was dismissed (user, 2026-09-15) — kept so F16s can see in superadmin which suggestions
     * miss, and improve them.
     */
    public const DISMISS_REASONS = [
        'already_in_touch' => 'Already in touch with the client',
        'figures_wrong' => 'The figures look wrong',
        'not_a_good_time' => 'Not a good time for this client',
        'client_opted_out' => 'Client does not want these emails',
        'other' => 'Other',
    ];

    public function __construct(private readonly AuditLogger $audit) {}

    public function index(): JsonResponse
    {
        $this->authorize('viewSales');

        $mode = app()->bound('active_portal_scope') ? app('active_portal_scope') : null;

        $rows = DB::table('sales_action_queue as q')
            ->join('customers as c', 'c.id', '=', 'q.customer_id')
            ->where('q.sales_id', auth()->id())
            ->where('q.audience', 'client')->where('q.status', 'open')
            ->when($mode, fn ($q) => $q->where('q.transport_mode', $mode))
            ->orderByDesc('q.priority_score')
            ->get(['q.*', 'c.name as client', 'c.email_domain']);

        return response()->json([
            'emails' => $rows->map(fn ($r) => $this->shape($r))->values(),
            // Tactical shows the client's domain and the rep writes the name in (PRD §2.3.3).
            'shows_client_names' => $this->showsClientNames(),
            'dismiss_reasons' => self::DISMISS_REASONS,
            // Sending needs the rep's own mailbox; the page says so before they draft.
            'has_mailbox' => $this->mailbox() !== null,
        ]);
    }

    /** Draft (or re-draft) the email. The rep sees it in the editor; nothing is sent. */
    public function draft(OutreachDrafter $drafter, int $id): JsonResponse
    {
        $action = $this->ownOpen($id);
        $draft = $drafter->draft($action, auth()->user(), $this->showsClientNames());

        DB::table('sales_action_queue')->where('id', $id)->update([
            'draft_subject' => $draft['subject'],
            'draft_body' => $draft['body'],
            'draft_to' => json_encode($draft['to']),
            'draft_cc' => json_encode($draft['cc']),
            'draft_generated_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json($this->shape($this->ownOpen($id)) + ['written_by' => $draft['written_by']]);
    }

    /** Send what the rep approved, from their own mailbox, so the client hears from them. */
    public function send(Request $request, MailBody $mailBody, int $id): JsonResponse
    {
        $action = $this->ownOpen($id);

        $data = $request->validate([
            'to' => ['required', 'array', 'min:1'], 'to.*' => ['email'],
            'cc' => ['nullable', 'array'], 'cc.*' => ['email'],
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
        ]);

        if (str_contains($data['subject'] . $data['body'], OutreachDrafter::NAME_PLACEHOLDER)) {
            return response()->json([
                'error' => 'Write the client\'s company name where it says ' . OutreachDrafter::NAME_PLACEHOLDER . '.',
                'reason' => 'name_missing',
            ], 422);
        }

        $connection = $this->mailbox();

        if ($connection === null) {
            return response()->json([
                'error' => 'Connect your mailbox in Settings → Mailboxes first, so the email comes from you.',
                'reason' => 'no_mailbox',
            ], 422);
        }

        $signature = ! blank($connection->signature_html)
            ? $mailBody->clean($connection->signature_html)
            : $mailBody->fromText(auth()->user()->signature_text ?? null);

        $result = app(MailProviderRegistry::class)->for($connection->provider)->send(
            $connection, $data['to'], $data['cc'] ?? [], $data['subject'], $mailBody->forEmail($data['body'], $signature)
        );

        if (! $result['ok']) {
            return response()->json(['error' => $result['error'] ?? 'The mail provider refused the message.', 'reason' => 'send_failed'], 502);
        }

        // What was actually sent is what the row keeps. The reply comes back into the inbox with the next sync.
        DB::table('sales_action_queue')->where('id', $id)->update([
            'draft_subject' => $data['subject'], 'draft_body' => $data['body'],
            'draft_to' => json_encode($data['to']), 'draft_cc' => json_encode($data['cc'] ?? []),
            'draft_generated_at' => $action->draft_generated_at ?? now(),
            'status' => 'acted', 'sent_at' => now(), 'sent_by' => auth()->id(), 'updated_at' => now(),
        ]);

        $this->audit->record($action->agent_id, 'sales.outreach_sent', 'sales_action_queue', $id, auth()->id());

        return response()->json(['ok' => true]);
    }

    public function dismiss(Request $request, int $id): JsonResponse
    {
        $action = $this->ownOpen($id);

        $data = $request->validate([
            'reason' => ['required', 'in:' . implode(',', array_keys(self::DISMISS_REASONS))],
            'note' => ['nullable', 'string', 'max:500', 'required_if:reason,other'],
        ]);

        DB::table('sales_action_queue')->where('id', $id)->update([
            'status' => 'dismissed', 'dismissed_reason' => $data['reason'], 'dismissed_note' => $data['note'] ?? null,
            'dismissed_by' => auth()->id(), 'dismissed_at' => now(), 'updated_at' => now(),
        ]);
        $this->audit->record($action->agent_id, 'sales.outreach_dismissed', 'sales_action_queue', $id, auth()->id());

        return response()->json(['ok' => true]);
    }

    /**
     * Dismissed suggestions and why: a rep sees their own, the Boss every rep's in the company, with totals by
     * reason. The last 90 days.
     */
    public function dismissed(): JsonResponse
    {
        $this->authorize('viewSales');

        $context = UserContext::for(auth()->user());
        $rows = DB::table('sales_action_queue as q')
            ->join('customers as c', 'c.id', '=', 'q.customer_id')
            ->leftJoin('users as u', 'u.id', '=', 'q.dismissed_by')
            ->where('q.audience', 'client')->where('q.status', 'dismissed')
            ->where('q.dismissed_at', '>=', now()->subDays(90))
            ->when($context->designation === 'boss',
                fn ($q) => $q->where('c.company_id', $context->companyId),
                fn ($q) => $q->where('q.dismissed_by', auth()->id()))
            ->orderByDesc('q.dismissed_at')
            ->limit(200)
            ->get(['q.id', 'q.action_type', 'q.fact_packet', 'q.dismissed_reason', 'q.dismissed_note', 'q.dismissed_at', 'c.name as client', 'c.email_domain', 'u.name as rep']);

        return response()->json([
            'reasons' => self::DISMISS_REASONS,
            'by_reason' => $rows->countBy('dismissed_reason'),
            'dismissed' => $rows->map(fn ($r) => [
                'id' => $r->id, 'type' => $r->action_type,
                'client' => $this->showsClientNames() ? $r->client : null, 'domain' => $r->email_domain,
                'facts' => json_decode($r->fact_packet, true),
                'reason' => $r->dismissed_reason, 'note' => $r->dismissed_note,
                'rep' => $r->rep, 'dismissed_at' => $r->dismissed_at,
            ])->values(),
        ]);
    }

    /** An open client email belonging to the signed-in rep, or 404. */
    private function ownOpen(int $id): object
    {
        $this->authorize('viewSales');

        $action = DB::table('sales_action_queue as q')
            ->join('customers as c', 'c.id', '=', 'q.customer_id')
            ->where('q.id', $id)->where('q.sales_id', auth()->id())
            ->where('q.audience', 'client')->where('q.status', 'open')
            ->first(['q.*', 'c.name as client', 'c.email_domain']);

        abort_if($action === null, 404);

        return $action;
    }

    /** Client names are a Command view; Tactical works from the domain (PRD §2.3.3). */
    private function showsClientNames(): bool
    {
        return UserContext::for(auth()->user())->tier === 'command';
    }

    private function mailbox(): ?MailboxConnection
    {
        return MailboxConnection::where('user_id', auth()->id())->where('is_active', true)->first();
    }

    private function shape(object $r): array
    {
        return [
            'id' => $r->id,
            'type' => $r->action_type,
            'client' => $this->showsClientNames() ? $r->client : null,
            'domain' => $r->email_domain,
            'mode' => $r->transport_mode,
            'facts' => json_decode($r->fact_packet, true),
            'subject' => $r->draft_subject,
            'body' => $r->draft_body,
            'to' => json_decode((string) $r->draft_to, true) ?: [],
            'cc' => json_decode((string) $r->draft_cc, true) ?: [],
            'drafted_at' => $r->draft_generated_at,
        ];
    }
}
