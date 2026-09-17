<?php

namespace App\Services\Mail;

use App\EmailThread;
use App\MailboxConnection;
use App\User;
use Illuminate\Support\Facades\DB;

/**
 * Send a mail on a conversation — the inbox reply and the client updates both go through here.
 *
 * ⚠️ Sends from the mailbox the THREAD arrived on, not from the operator's own: a client who replies must land back
 * on this conversation. 🔴 NO LOCAL ROW IS WRITTEN — the sent message returns on the next sync and upserts on its
 * `message_id`; writing one here would duplicate it.
 */
class ThreadMailer
{
    public function __construct(private readonly MailBody $mailBody) {}

    /**
     * @param  string  $body  the composer's HTML or plain text; cleaned here
     * @param  array<int, array{name: string, mime_type: string, bytes: string}>  $attachments
     * @return array{ok: bool, error?: string, reason?: string, status?: int, threaded?: bool}
     */
    public function send(EmailThread $thread, User $user, array $to, array $cc, string $subject, string $body,
        array $attachments = [], ?int $inReplyTo = null, bool $withSignature = true, string $mode = 'reply'): array
    {
        $last = DB::table('email_messages')
            ->where('thread_key', $thread->thread_key)
            ->when($inReplyTo !== null, fn ($q) => $q->where('id', $inReplyTo))
            ->orderByDesc('received_at')
            ->first(['mailbox_connection_id', 'provider_message_id']);

        if ($last === null || $last->mailbox_connection_id === null) {
            return $this->refused('This conversation has no connected mailbox to send from.', 'no_mailbox', 422);
        }

        $connection = MailboxConnection::find($last->mailbox_connection_id);

        if ($connection === null || ! $connection->is_active) {
            return $this->refused('The mailbox this conversation arrived on is no longer connected.', 'mailbox_disconnected', 422);
        }

        if (trim(strip_tags($this->mailBody->clean($body))) === '') {
            return $this->refused('The message is empty.', 'empty_body', 422);
        }

        // 🔴 The signature is added HERE, from settings, never typed into the body (ui_ux_guide §composer).
        $signature = $withSignature ? $this->signatureFor($connection, $user) : null;
        $image = $withSignature ? app(SignatureImage::class)->for($connection) : null;
        if ($image !== null) {
            $attachments[] = $image;
        }

        $result = app(MailProviderRegistry::class)->for($connection->provider)->send(
            $connection, $to, $cc, $subject,
            $this->mailBody->forEmail($body, $signature, $image),
            // ⚠️ NULL for a historical message without a provider id: it still goes, as a new thread on their side.
            $last->provider_message_id,
            $attachments,
            $mode
        );

        if (! $result['ok']) {
            return $this->refused($result['error'] ?? 'The mail provider refused the message.', 'send_failed', 502);
        }

        return ['ok' => true, 'threaded' => $last->provider_message_id !== null];
    }

    /**
     * The mailbox's own signature, else the sender's — PRD §5.2.4: `mailbox_connections.signature_html` overrides
     * `users.signature_text`, because a user with two connected accounts usually needs two.
     */
    public function signatureFor(MailboxConnection $connection, User $user): ?string
    {
        if (! blank($connection->signature_html)) {
            return $this->mailBody->clean($connection->signature_html);
        }

        return $this->mailBody->fromText($user->signature_text ?? null);
    }

    private function refused(string $error, string $reason, int $status): array
    {
        return ['ok' => false, 'error' => $error, 'reason' => $reason, 'status' => $status];
    }
}
