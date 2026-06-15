<?php

namespace App\Services;

use App\MailboxConnection;
use App\InboundEmail;
use App\InboundAttachment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class MailboxPollingService
{
    /**
     * @var \App\Services\EmailThreadingService
     */
    protected $threadingService;

    /**
     * @var \App\Services\AirlineExclusionService
     */
    protected $exclusionService;

    /**
     * Constructor.
     *
     * @param  \App\Services\EmailThreadingService  $threadingService
     * @param  \App\Services\AirlineExclusionService  $exclusionService
     */
    public function __construct(EmailThreadingService $threadingService, AirlineExclusionService $exclusionService)
    {
        $this->threadingService = $threadingService;
        $this->exclusionService = $exclusionService;
    }

    /**
     * Poll a connection.
     *
     * @param  \App\MailboxConnection  $connection
     * @return void
     */
    public function poll(MailboxConnection $connection)
    {
        if (!$connection->is_active) {
            return;
        }

        // Ensure token is valid
        $this->ensureAccessTokenIsValid($connection);

        if ($connection->provider === 'gmail') {
            $this->pollGmail($connection);
        } elseif ($connection->provider === 'outlook') {
            $this->pollOutlook($connection);
        }
    }

    /**
     * Refresh OAuth access token if expired or close to expiry.
     *
     * @param  \App\MailboxConnection  $connection
     * @return void
     */
    protected function ensureAccessTokenIsValid(MailboxConnection $connection)
    {
        if (!$connection->expires_at || $connection->expires_at->subSeconds(60)->isPast()) {
            $this->refreshAccessToken($connection);
        }
    }

    /**
     * Refresh OAuth credentials.
     *
     * @param  \App\MailboxConnection  $connection
     * @return void
     */
    protected function refreshAccessToken(MailboxConnection $connection)
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
                Log::error("Failed to refresh Gmail access token for {$connection->email_address}: " . $response->body());
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
                Log::error("Failed to refresh Outlook access token for {$connection->email_address}: " . $response->body());
            }
        }
    }

    /**
     * Poll unread emails from Gmail.
     *
     * @param  \App\MailboxConnection  $connection
     * @return void
     */
    protected function pollGmail(MailboxConnection $connection)
    {
        $response = Http::withToken($connection->access_token)
            ->get("https://gmail.googleapis.com/gmail/v1/users/me/messages", [
                'q'          => 'is:unread',
                'maxResults' => 10,
            ]);

        if (!$response->successful()) {
            Log::error("Gmail API Error: " . $response->body());
            return;
        }

        $messages = $response->json()['messages'] ?? [];
        foreach ($messages as $msg) {
            $msgId = $msg['id'];

            if (InboundEmail::where('message_id', $msgId)->exists()) {
                continue;
            }

            $detailResponse = Http::withToken($connection->access_token)
                ->get("https://gmail.googleapis.com/gmail/v1/users/me/messages/{$msgId}");

            if ($detailResponse->successful()) {
                $this->importGmailMessage($connection, $detailResponse->json());
            }
        }
    }

    /**
     * Import a parsed Gmail message structure.
     *
     * @param  \App\MailboxConnection  $connection
     * @param  array  $gmailMsg
     * @return void
     */
    protected function importGmailMessage(MailboxConnection $connection, array $gmailMsg)
    {
        $messageId = $gmailMsg['id'];
        $providerThreadId = $gmailMsg['threadId'] ?? '';

        $headers = [];
        foreach ($gmailMsg['payload']['headers'] ?? [] as $header) {
            $headers[strtolower($header['name'])] = $header['value'];
        }

        $subject = $headers['subject'] ?? '(No Subject)';
        $from = $headers['from'] ?? '';
        $to = $headers['to'] ?? '';

        $fromEmail = $this->extractEmailAddress($from);
        $toEmail = $this->extractEmailAddress($to);

        $receivedAt = isset($headers['date']) ? Carbon::parse($headers['date']) : now();

        $body = $this->parseGmailParts($gmailMsg['payload'] ?? []);
        $bodyText = $body['text'] ?? '';
        $bodyHtml = $body['html'] ?? '';

        $user = $connection->user;
        $agent = \App\Agent::where('company_id', $user->company_id ?? 0)->first();
        $agentId = $agent ? $agent->id : 1;

        $emailData = [
            'agent_id'               => $agentId,
            'mailbox_connection_id'  => $connection->id,
            'provider'               => 'gmail',
            'provider_thread_id'     => $providerThreadId,
            'subject'                => $subject,
            'from'                   => $fromEmail,
            'to'                     => $toEmail,
            'received_at'            => $receivedAt,
            'in_reply_to'            => $this->extractEmailAddress($headers['in-reply-to'] ?? ''),
            'references'             => $headers['references'] ?? '',
        ];

        $threadKey = $this->threadingService->determineThreadKey($emailData);
        $this->threadingService->getOrCreateThread($threadKey, $emailData);

        $inboundEmail = InboundEmail::create([
            'agent_id'              => $agentId,
            'mailbox_connection_id' => $connection->id,
            'message_id'            => $messageId,
            'thread_key'            => $threadKey,
            'from'                  => $fromEmail,
            'to'                    => $toEmail,
            'subject'               => $subject,
            'body_text'             => $bodyText,
            'body_html'             => $bodyHtml,
            'received_at'           => $receivedAt,
        ]);

        $this->processGmailAttachments($connection, $gmailMsg, $inboundEmail);

        // Run airline exclusion classification
        $this->exclusionService->process($inboundEmail);
    }

    /**
     * Recursively parse Gmail parts to extract plain text and HTML bodies.
     *
     * @param  array  $part
     * @return array
     */
    protected function parseGmailParts(array $part): array
    {
        $result = ['text' => '', 'html' => ''];
        $mimeType = $part['mimeType'] ?? '';

        if (isset($part['body']['data']) && !empty($part['body']['data'])) {
            $data = base64_decode(str_replace(['-', '_'], ['+', '/'], $part['body']['data']));
            if ($mimeType === 'text/plain') {
                $result['text'] = $data;
            } elseif ($mimeType === 'text/html') {
                $result['html'] = $data;
            }
        }

        if (isset($part['parts'])) {
            foreach ($part['parts'] as $subPart) {
                $subResult = $this->parseGmailParts($subPart);
                $result['text'] .= $subResult['text'];
                $result['html'] .= $subResult['html'];
            }
        }

        return $result;
    }

    /**
     * Extract email address from RFC 822 format (e.g. "Name <email@domain.com>").
     *
     * @param  string  $rawHeader
     * @return string
     */
    protected function extractEmailAddress(string $rawHeader): string
    {
        if (preg_match('/<([^>]+)>/', $rawHeader, $matches)) {
            return trim($matches[1]);
        }
        return trim($rawHeader);
    }

    /**
     * Download and index Gmail email attachments.
     *
     * @param  \App\MailboxConnection  $connection
     * @param  array  $gmailMsg
     * @param  \App\InboundEmail  $inboundEmail
     * @return void
     */
    protected function processGmailAttachments(MailboxConnection $connection, array $gmailMsg, InboundEmail $inboundEmail)
    {
        $parts = $this->collectGmailAttachmentParts($gmailMsg['payload'] ?? []);

        foreach ($parts as $part) {
            $filename = $part['filename'] ?? 'attachment';
            $mimeType = $part['mimeType'] ?? 'application/octet-stream';
            $attachmentId = $part['body']['attachmentId'] ?? null;

            if ($attachmentId) {
                $response = Http::withToken($connection->access_token)
                    ->get("https://gmail.googleapis.com/gmail/v1/users/me/messages/{$inboundEmail->message_id}/attachments/{$attachmentId}");

                if ($response->successful()) {
                    $data = base64_decode(str_replace(['-', '_'], ['+', '/'], $response->json()['data']));
                    $path = 'attachments/' . Str::uuid() . '_' . $filename;
                    
                    Storage::disk('local')->put($path, $data);

                    InboundAttachment::create([
                        'inbound_email_id' => $inboundEmail->id,
                        'filename'         => $filename,
                        'file_path'        => $path,
                        'mime_type'        => $mimeType,
                    ]);
                }
            }
        }
    }

    /**
     * Collect all attachment parts recursively from a Gmail message payload.
     *
     * @param  array  $part
     * @return array
     */
    protected function collectGmailAttachmentParts(array $part): array
    {
        $parts = [];
        if (!empty($part['filename']) && !empty($part['body']['attachmentId'])) {
            $parts[] = $part;
        }
        if (isset($part['parts'])) {
            foreach ($part['parts'] as $subPart) {
                $parts = array_merge($parts, $this->collectGmailAttachmentParts($subPart));
            }
        }
        return $parts;
    }

    /**
     * Poll unread emails from Microsoft Outlook / Graph API.
     *
     * @param  \App\MailboxConnection  $connection
     * @return void
     */
    protected function pollOutlook(MailboxConnection $connection)
    {
        $response = Http::withToken($connection->access_token)
            ->get("https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages", [
                '$filter' => 'isRead eq false',
                '$top'    => 10,
            ]);

        if (!$response->successful()) {
            Log::error("Outlook API Error: " . $response->body());
            return;
        }

        $messages = $response->json()['value'] ?? [];
        foreach ($messages as $msg) {
            $msgId = $msg['id'];

            if (InboundEmail::where('message_id', $msgId)->exists()) {
                continue;
            }

            $this->importOutlookMessage($connection, $msg);
        }
    }

    /**
     * Import Outlook email.
     *
     * @param  \App\MailboxConnection  $connection
     * @param  array  $outlookMsg
     * @return void
     */
    protected function importOutlookMessage(MailboxConnection $connection, array $outlookMsg)
    {
        $messageId = $outlookMsg['id'];
        $conversationId = $outlookMsg['conversationId'] ?? '';
        $subject = $outlookMsg['subject'] ?? '(No Subject)';

        $fromEmail = $outlookMsg['from']['emailAddress']['address'] ?? '';

        $toEmails = [];
        foreach ($outlookMsg['toRecipients'] ?? [] as $recipient) {
            if (isset($recipient['emailAddress']['address'])) {
                $toEmails[] = $recipient['emailAddress']['address'];
            }
        }
        $toStr = implode(', ', $toEmails);

        $receivedAt = isset($outlookMsg['receivedDateTime']) 
            ? Carbon::parse($outlookMsg['receivedDateTime']) 
            : now();

        $bodyText = '';
        $bodyHtml = '';
        if (isset($outlookMsg['body']['content'])) {
            if (strtolower($outlookMsg['body']['contentType'] ?? 'html') === 'html') {
                $bodyHtml = $outlookMsg['body']['content'];
            } else {
                $bodyText = $outlookMsg['body']['content'];
            }
        }

        $user = $connection->user;
        $agent = \App\Agent::where('company_id', $user->company_id ?? 0)->first();
        $agentId = $agent ? $agent->id : 1;

        $emailData = [
            'agent_id'               => $agentId,
            'mailbox_connection_id'  => $connection->id,
            'provider'               => 'outlook',
            'provider_thread_id'     => $conversationId,
            'subject'                => $subject,
            'from'                   => $fromEmail,
            'to'                     => $toStr,
            'received_at'            => $receivedAt,
            'in_reply_to'            => null,
            'references'             => null,
        ];

        $threadKey = $this->threadingService->determineThreadKey($emailData);
        $this->threadingService->getOrCreateThread($threadKey, $emailData);

        $inboundEmail = InboundEmail::create([
            'agent_id'              => $agentId,
            'mailbox_connection_id' => $connection->id,
            'message_id'            => $messageId,
            'thread_key'            => $threadKey,
            'from'                  => $fromEmail,
            'to'                    => $toStr,
            'subject'               => $subject,
            'body_text'             => $bodyText,
            'body_html'             => $bodyHtml,
            'received_at'           => $receivedAt,
        ]);

        if ($outlookMsg['hasAttachments'] ?? false) {
            $this->processOutlookAttachments($connection, $messageId, $inboundEmail);
        }

        // Run airline exclusion classification
        $this->exclusionService->process($inboundEmail);
    }

    /**
     * Download and index Outlook attachments.
     *
     * @param  \App\MailboxConnection  $connection
     * @param  string  $messageId
     * @param  \App\InboundEmail  $inboundEmail
     * @return void
     */
    protected function processOutlookAttachments(MailboxConnection $connection, string $messageId, InboundEmail $inboundEmail)
    {
        $response = Http::withToken($connection->access_token)
            ->get("https://graph.microsoft.com/v1.0/me/messages/{$messageId}/attachments");

        if ($response->successful()) {
            $attachments = $response->json()['value'] ?? [];
            foreach ($attachments as $attachment) {
                if (isset($attachment['contentBytes'])) {
                    $filename = $attachment['name'] ?? 'attachment';
                    $mimeType = $attachment['contentType'] ?? 'application/octet-stream';
                    $data = base64_decode($attachment['contentBytes']);
                    
                    $path = 'attachments/' . Str::uuid() . '_' . $filename;
                    Storage::disk('local')->put($path, $data);

                    InboundAttachment::create([
                        'inbound_email_id' => $inboundEmail->id,
                        'filename'         => $filename,
                        'file_path'        => $path,
                        'mime_type'        => $mimeType,
                    ]);
                }
            }
        }
    }
}
