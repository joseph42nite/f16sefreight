<?php

namespace App\Services;

use App\EmailThread;
use App\InboundEmail;
use App\MailboxConnection;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Phase 2.5 — MailboxReplyService
 *
 * Sends a reply to an email thread through the same OAuth-connected mailbox
 * that originally received it (Gmail API or Microsoft Graph API), ensuring the
 * reply arrives in the customer's inbox as if sent directly from the operator's
 * business email address.
 */
class MailboxReplyService
{
    /**
     * Send a reply to a thread.
     *
     * Retrieves the last inbound message to extract the provider thread ID /
     * message ID, refreshes the OAuth token if needed, builds the appropriate
     * API payload, and dispatches the reply.
     *
     * On success, it persists an outbound InboundEmail record and updates the
     * thread's status and `first_reply_at` timestamp.
     *
     * @param  \App\MailboxConnection  $connection  The mailbox that received the thread
     * @param  \App\EmailThread        $thread      The thread being replied to
     * @param  \App\InboundEmail       $lastEmail   The last message in the thread (for thread/message IDs)
     * @param  string                  $body        Plain-text reply body from the operator
     * @return \App\InboundEmail                    The persisted outbound email record
     *
     * @throws \RuntimeException  When the provider API call fails
     */
    public function sendReply(
        MailboxConnection $connection,
        EmailThread       $thread,
        InboundEmail      $lastEmail,
        string            $body
    ): InboundEmail {
        $this->ensureAccessTokenIsValid($connection);

        if ($connection->provider === 'gmail') {
            return $this->sendGmailReply($connection, $thread, $lastEmail, $body);
        }

        if ($connection->provider === 'outlook') {
            return $this->sendOutlookReply($connection, $thread, $lastEmail, $body);
        }

        throw new \RuntimeException("Unsupported provider: {$connection->provider}");
    }

    // -------------------------------------------------------------------------
    // Gmail
    // -------------------------------------------------------------------------

    /**
     * Send via Gmail API.
     *
     * Builds a valid RFC 2822 MIME message, base64url-encodes it, and posts it
     * to the Gmail messages/send endpoint with the original thread ID so Gmail
     * groups the reply correctly under the same conversation.
     */
    protected function sendGmailReply(
        MailboxConnection $connection,
        EmailThread       $thread,
        InboundEmail      $lastEmail,
        string            $body
    ): InboundEmail {
        // The customer's address is whoever sent the last inbound message
        $toAddress   = $lastEmail->from;
        $fromAddress = $connection->email_address;
        $subject     = 'Re: ' . ($thread->subject ?? '');

        // Build RFC 2822 MIME message
        $mime = implode("\r\n", [
            "From: {$fromAddress}",
            "To: {$toAddress}",
            "Subject: {$subject}",
            "In-Reply-To: {$lastEmail->message_id}",
            "References: {$lastEmail->message_id}",
            "Content-Type: text/plain; charset=UTF-8",
            "MIME-Version: 1.0",
            "",
            $body,
        ]);

        // Gmail API requires base64url (no padding)
        $encoded = rtrim(strtr(base64_encode($mime), '+/', '-_'), '=');

        $response = Http::withToken($connection->access_token)
            ->post("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", [
                'raw'      => $encoded,
                'threadId' => $thread->provider_thread_id ?? '',
            ]);

        if (!$response->successful()) {
            Log::error("Gmail Reply API Error [{$connection->email_address}]: " . $response->body());
            throw new \RuntimeException(
                "Gmail API failed ({$response->status()}): " . ($response->json('error.message') ?? $response->body())
            );
        }

        $sentMessageId = $response->json('id') ?? ('outbound_' . uniqid());

        return $this->persistOutboundEmail($connection, $thread, $lastEmail, $body, $sentMessageId, $toAddress);
    }

    // -------------------------------------------------------------------------
    // Outlook / Microsoft Graph
    // -------------------------------------------------------------------------

    /**
     * Send via Microsoft Graph API.
     *
     * Uses the /reply action on the last message so that Graph automatically
     * threads it under the same conversation — no manual threading headers needed.
     */
    protected function sendOutlookReply(
        MailboxConnection $connection,
        EmailThread       $thread,
        InboundEmail      $lastEmail,
        string            $body
    ): InboundEmail {
        $messageId = $lastEmail->message_id;

        $response = Http::withToken($connection->access_token)
            ->post("https://graph.microsoft.com/v1.0/me/messages/{$messageId}/reply", [
                'message' => [
                    'body' => [
                        'contentType' => 'Text',
                        'content'     => $body,
                    ],
                ],
                'comment' => $body,
            ]);

        if (!$response->successful()) {
            Log::error("Outlook Reply API Error [{$connection->email_address}]: " . $response->body());
            throw new \RuntimeException(
                "Microsoft Graph API failed ({$response->status()}): " . ($response->json('error.message') ?? $response->body())
            );
        }

        // Graph /reply returns 202 with no body — generate a synthetic message ID
        $sentMessageId = 'outbound_' . uniqid();
        $toAddress     = $lastEmail->from;

        return $this->persistOutboundEmail($connection, $thread, $lastEmail, $body, $sentMessageId, $toAddress);
    }

    // -------------------------------------------------------------------------
    // Shared helpers
    // -------------------------------------------------------------------------

    /**
     * Persist an outbound email record and update the thread status.
     */
    protected function persistOutboundEmail(
        MailboxConnection $connection,
        EmailThread       $thread,
        InboundEmail      $lastEmail,
        string            $body,
        string            $sentMessageId,
        string            $toAddress
    ): InboundEmail {
        $outbound = InboundEmail::create([
            'agent_id'              => $thread->agent_id,
            'mailbox_connection_id' => $connection->id,
            'message_id'            => $sentMessageId,
            'thread_key'            => $thread->thread_key,
            'from'                  => $connection->email_address,
            'to'                    => $toAddress,
            'subject'               => 'Re: ' . ($thread->subject ?? ''),
            'body_text'             => $body,
            'body_html'             => null,
            'received_at'           => now(),
        ]);

        // Mark thread as replied and record first reply timestamp
        $updateData = ['status' => 'replied'];
        if (!$thread->first_reply_at) {
            $updateData['first_reply_at'] = now();
        }
        $thread->update($updateData);

        return $outbound;
    }

    /**
     * Refresh the OAuth access token if it is expired or within 60 seconds of expiry.
     */
    protected function ensureAccessTokenIsValid(MailboxConnection $connection): void
    {
        if (!$connection->expires_at || $connection->expires_at->subSeconds(60)->isPast()) {
            $this->refreshAccessToken($connection);
        }
    }

    /**
     * Refresh an expired OAuth token using the stored refresh token.
     */
    protected function refreshAccessToken(MailboxConnection $connection): void
    {
        if ($connection->provider === 'gmail') {
            $response = Http::post('https://oauth2.googleapis.com/token', [
                'client_id'     => config('services.google.client_id'),
                'client_secret' => config('services.google.client_secret'),
                'refresh_token' => $connection->refresh_token,
                'grant_type'    => 'refresh_token',
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $connection->update([
                    'access_token' => $data['access_token'],
                    'expires_at'   => now()->addSeconds($data['expires_in'] ?? 3600),
                ]);
            } else {
                Log::error("Failed to refresh Gmail token for {$connection->email_address}: " . $response->body());
            }
        } elseif ($connection->provider === 'outlook') {
            $response = Http::asForm()->post('https://login.microsoftonline.com/common/oauth2/v2.0/token', [
                'client_id'     => config('services.microsoft.client_id'),
                'client_secret' => config('services.microsoft.client_secret'),
                'refresh_token' => $connection->refresh_token,
                'grant_type'    => 'refresh_token',
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $connection->update([
                    'access_token' => $data['access_token'],
                    'expires_at'   => now()->addSeconds($data['expires_in'] ?? 3600),
                ]);
            } else {
                Log::error("Failed to refresh Outlook token for {$connection->email_address}: " . $response->body());
            }
        }
    }
}
