<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\MailboxConnection;
use App\Services\AuditLogger;
use App\Services\Mail\MailBody;
use App\Services\Mail\MailProviderRegistry;
use App\Services\Sales\BossMailDrafter;
use App\Services\Sales\BossMails;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * The Boss's mails to his team (user, 2026-09-16): suggested from the figures, drafted on request, edited and sent
 * from his own mailbox. 🔒 The Boss's alone, his company's alone. 🔴 Nothing is sent until he presses Send.
 */
class BossMailController extends Controller
{
    /** Why a suggestion was dismissed — kept, like the client emails', so the suggestions can be improved. */
    public const DISMISS_REASONS = [
        'already_discussed' => 'Already discussed with the team',
        'figures_wrong' => 'The figures look wrong',
        'not_needed_now' => 'Not needed now',
        'other' => 'Other',
    ];

    public function __construct(private readonly AuditLogger $audit) {}

    public function index(): JsonResponse
    {
        $context = $this->boss();

        $rows = DB::table('boss_mail_suggestions as s')->join('agents_info as a', 'a.id', '=', 's.agent_id')
            ->where('s.company_id', $context->companyId)->where('s.status', 'open')
            ->orderByDesc('s.priority')->orderBy('s.id')
            ->get(['s.*', 'a.agent_name as branch']);

        $people = DB::table('users')->whereIn('id', $rows->flatMap(fn ($r) => json_decode($r->suggested_to, true) ?: [])->unique())
            ->get(['id', 'name', 'email', 'designation'])->keyBy('id');

        return response()->json([
            'mails' => $rows->map(fn ($r) => $this->shape($r, $people))->values(),
            'dismiss_reasons' => self::DISMISS_REASONS,
            'has_mailbox' => $this->mailbox() !== null,
        ]);
    }

    /** Draft (or re-draft) the mail; the Boss reads it in the editor. Nothing is sent. */
    public function draft(BossMailDrafter $drafter, int $id): JsonResponse
    {
        $row = $this->open($id);
        $to = DB::table('users')->whereIn('id', json_decode($row->suggested_to, true) ?: [])->pluck('email')->all();
        $draft = $drafter->draft($row->kind, json_decode($row->facts, true) ?: [], auth()->user());

        DB::table('boss_mail_suggestions')->where('id', $id)->update([
            'draft_subject' => $draft['subject'], 'draft_body' => $draft['body'],
            'draft_to' => json_encode($to), 'draft_cc' => json_encode([]), 'drafted_at' => now(), 'updated_at' => now(),
        ]);

        return response()->json(['id' => $id, 'subject' => $draft['subject'], 'body' => $draft['body'], 'to' => $to, 'cc' => [],
            'written_by' => $draft['written_by']]);
    }

    /** Send what the Boss approved, from his own mailbox. */
    public function send(Request $request, MailBody $mailBody, int $id): JsonResponse
    {
        $row = $this->open($id);

        $data = $request->validate([
            'to' => ['required', 'array', 'min:1'], 'to.*' => ['email'],
            'cc' => ['nullable', 'array'], 'cc.*' => ['email'],
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
        ]);

        $connection = $this->mailbox();

        if ($connection === null) {
            return response()->json(['error' => 'Connect your mailbox in Settings → Mailboxes first, so the mail comes from you.',
                'reason' => 'no_mailbox'], 422);
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

        DB::table('boss_mail_suggestions')->where('id', $id)->update([
            'draft_subject' => $data['subject'], 'draft_body' => $data['body'],
            'draft_to' => json_encode($data['to']), 'draft_cc' => json_encode($data['cc'] ?? []),
            'status' => 'sent', 'sent_at' => now(), 'sent_by' => auth()->id(), 'updated_at' => now(),
        ]);
        $this->audit->record($row->agent_id, 'boss.mail_sent', 'boss_mail_suggestion', $id, auth()->id());

        return response()->json(['ok' => true]);
    }

    public function dismiss(Request $request, int $id): JsonResponse
    {
        $row = $this->open($id);

        $data = $request->validate([
            'reason' => ['required', 'in:' . implode(',', array_keys(self::DISMISS_REASONS))],
            'note' => ['nullable', 'string', 'max:500', 'required_if:reason,other'],
        ]);

        DB::table('boss_mail_suggestions')->where('id', $id)->update([
            'status' => 'dismissed', 'dismissed_reason' => $data['reason'], 'dismissed_note' => $data['note'] ?? null,
            'dismissed_by' => auth()->id(), 'dismissed_at' => now(), 'updated_at' => now(),
        ]);
        $this->audit->record($row->agent_id, 'boss.mail_dismissed', 'boss_mail_suggestion', $id, auth()->id());

        return response()->json(['ok' => true]);
    }

    private function boss(): UserContext
    {
        $this->authorize('viewSales');
        $context = UserContext::for(auth()->user());
        abort_unless($context->designation === 'boss', 403, 'These are the Boss\'s mails.');

        return $context;
    }

    /** An open suggestion of the Boss's own company, or 404. */
    private function open(int $id): object
    {
        $context = $this->boss();
        $row = DB::table('boss_mail_suggestions')->where('id', $id)->where('company_id', $context->companyId)->where('status', 'open')->first();
        abort_if($row === null, 404);

        return $row;
    }

    private function mailbox(): ?MailboxConnection
    {
        return MailboxConnection::withoutGlobalScopes()->where('user_id', auth()->id())->where('is_active', true)->first();
    }

    private function shape(object $r, $people): array
    {
        return [
            'id' => $r->id,
            'kind' => $r->kind,
            'title' => BossMails::TITLES[$r->kind] ?? $r->kind,
            'branch' => $r->branch,
            'facts' => json_decode($r->facts, true),
            'suggested_to' => collect(json_decode($r->suggested_to, true) ?: [])->map(fn ($id) => $people[$id] ?? null)->filter()
                ->map(fn ($p) => ['name' => $p->name, 'email' => $p->email, 'role' => $p->designation])->values(),
            'subject' => $r->draft_subject,
            'body' => $r->draft_body,
            'to' => json_decode((string) $r->draft_to, true) ?: [],
            'cc' => json_decode((string) $r->draft_cc, true) ?: [],
            'drafted_at' => $r->drafted_at,
        ];
    }
}
