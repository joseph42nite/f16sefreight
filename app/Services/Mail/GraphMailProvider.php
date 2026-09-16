<?php

namespace App\Services\Mail;

use App\MailboxConnection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Microsoft Graph — the first mail provider (guide §4.2).
 *
 * 🟢 **Graph ships before Gmail because of what each provider DEMANDS, not preference.**
 * Google's `gmail.*` scopes are restricted: a third-party CASA audit by an approved lab,
 * a Letter of Validation, and annual recertification. Microsoft has no equivalent —
 * publisher verification is optional identity verification affecting the consent prompt,
 * and M365 Certification applies to marketplace listings rather than an app a customer's
 * own admin installs. For a single-tenant Entra app the client's Global Administrator
 * simply consents (GAPS #15).
 *
 * 🔴 **DELEGATED access, never application permissions.** App-only `Mail.ReadWrite` reads
 * EVERY mailbox in the tenant — HR and finance included — and would need an Exchange
 * Application Access Policy to be safe, plus removal of any unscoped Entra grant, because
 * a permission held both unscoped and resource-scoped ends up with no scoping at all.
 * Delegated access is bounded by the user who consented, which is the boundary the product
 * already wants: a user connects THEIR mailbox.
 *
 * 🔴 **Inbox AND Sent Items, each with its own delta.** Graph has no mailbox-wide message
 * delta — only `/me/mailFolders/{id}/messages/delta` (checked against Microsoft's docs,
 * 2026-09-16; the `/me/messages/delta` this used before does not exist). A reply typed in
 * Outlook lands in Sent Items and never touches the Inbox, so reading the Inbox alone loses
 * half of every conversation — the half that fills `first_response_at`.
 */
class GraphMailProvider implements MailProviderContract
{
    public function key(): string
    {
        return 'outlook';
    }

    public function authorizationUrl(string $state): string
    {
        return $this->authority() . '/oauth2/v2.0/authorize?' . http_build_query([
            'client_id'     => $this->config('client_id'),
            'response_type' => 'code',
            'redirect_uri'  => $this->config('redirect'),
            'response_mode' => 'query',
            'scope'         => implode(' ', config('services.graph.scopes')),
            'state'         => $state,
            // Force the consent screen so a re-connect after a scope change actually
            // re-consents rather than silently returning a token missing the new scope.
            'prompt'        => 'select_account',
        ]);
    }

    public function exchangeCode(string $code): array
    {
        return $this->token([
            'grant_type'   => 'authorization_code',
            'code'         => $code,
            'redirect_uri' => $this->config('redirect'),
        ]);
    }

    public function refresh(string $refreshToken): array
    {
        return $this->token([
            'grant_type'    => 'refresh_token',
            'refresh_token' => $refreshToken,
        ]);
    }

    public function primaryAddress(string $accessToken): string
    {
        $response = Http::withToken($accessToken)
            ->acceptJson()
            ->get($this->api() . '/me', ['$select' => 'mail,userPrincipalName']);

        if ($response->failed()) {
            throw new RuntimeException('Graph /me failed: ' . $response->status() . ' ' . $response->body());
        }

        // ⚠️ `mail` is NULL for accounts with no Exchange licence; userPrincipalName is the
        // fallback and is not always an address, so an empty result must fail loudly rather
        // than store a blank that the UNIQUE index will later reject in confusing ways.
        $address = $response->json('mail') ?: $response->json('userPrincipalName');

        if (blank($address)) {
            throw new RuntimeException('Graph returned no address for this account.');
        }

        return strtolower($address);
    }

    /** Received and sent mail — Graph's well-known folder names. */
    public function folders(): array
    {
        return ['inbox', 'sentitems'];
    }

    public function delta(MailboxConnection $connection, string $folder, ?string $cursor, ?Carbon $since = null): array
    {
        $url = $cursor ?: $this->folderUrl($folder) . '/messages/delta?' . http_build_query(array_filter([
            // 🔴 ccRecipients is REQUESTED, not inferred. Graph returns only the fields
            // named here, so a missing one is silently an empty list rather than an
            // error — which is exactly how CC came to be absent everywhere downstream.
            '$select' => 'id,internetMessageId,conversationId,subject,from,toRecipients,'
                . 'ccRecipients,bccRecipients,'
                . 'receivedDateTime,bodyPreview,hasAttachments,internetMessageHeaders',
            // The only filter a message delta accepts. It sets where the stream starts; later
            // pages and the deltaLink carry it on by themselves.
            '$filter' => $since ? 'receivedDateTime ge ' . $since->copy()->utc()->format('Y-m-d\TH:i:s\Z') : null,
        ]));

        $response = Http::withToken($connection->access_token)
            ->acceptJson()
            ->withHeaders(['Prefer' => 'odata.maxpagesize=50, outlook.body-content-type="text"'])
            ->get($url);

        if ($response->failed()) {
            throw new RuntimeException('Graph delta failed: ' . $response->status() . ' ' . $response->body());
        }

        $body = $response->json();
        $mailbox = strtolower($connection->email_address);

        $messages = [];

        foreach ($body['value'] ?? [] as $raw) {
            // A delta page also carries REMOVALS. They have no internetMessageId and must
            // be skipped rather than ingested as a blank message.
            if (blank($raw['internetMessageId'] ?? null)) {
                continue;
            }

            $messages[] = $this->normalise($raw, $mailbox);
        }

        return [
            'messages'     => $messages,
            // More pages of THIS sync.
            'next_cursor'  => $body['@odata.nextLink'] ?? null,
            // 🔴 The cursor to store for NEXT time, present only on the final page. Storing
            // a nextLink as the delta cursor would replay the same page forever.
            'delta_cursor' => $body['@odata.deltaLink'] ?? null,
        ];
    }

    /** How many messages a folder holds since a date — the import's "of about N". */
    public function count(MailboxConnection $connection, string $folder, Carbon $since): int
    {
        $response = Http::withToken($connection->access_token)->acceptJson()
            ->get($this->folderUrl($folder) . '/messages', [
                '$filter' => 'receivedDateTime ge ' . $since->copy()->utc()->format('Y-m-d\TH:i:s\Z'),
                '$count' => 'true', '$top' => 1, '$select' => 'id',
            ]);

        if ($response->failed()) {
            throw new RuntimeException('Graph count failed: ' . $response->status());
        }

        // Array access, not json('@odata.count'): the dot would be read as a path.
        return (int) ($response->json()['@odata.count'] ?? 0);
    }

    private function folderUrl(string $folder): string
    {
        return $this->api() . '/me/mailFolders/' . rawurlencode($folder);
    }

    /** Graph's message shape → the ingestor's shape. Nothing above this sees Graph JSON. */
    private function normalise(array $raw, string $mailbox): NormalisedMessage
    {
        $from = strtolower($raw['from']['emailAddress']['address'] ?? '');

        // One shape for all three lists — they differ only in which key they came from.
        $addresses = fn (string $key) => array_values(array_filter(array_map(
            fn ($r) => strtolower($r['emailAddress']['address'] ?? ''),
            $raw[$key] ?? []
        )));

        $to = $addresses('toRecipients');

        return new NormalisedMessage(
            messageId: $raw['internetMessageId'],
            threadId: $raw['conversationId'] ?? null,
            from: $from,
            to: $to,
            cc: $addresses('ccRecipients'),
            // ⚠️ Empty on inbound and that is correct: a blind copy is not disclosed to
            // recipients, so Graph returns it only on the sender's own copy.
            bcc: $addresses('bccRecipients'),
            subject: $raw['subject'] ?? null,
            snippet: $raw['bodyPreview'] ?? null,
            receivedAt: Carbon::parse($raw['receivedDateTime'] ?? now()),
            // 🔴 Direction is decided by WHO SENT IT, not by which folder it sat in. A
            // reply typed in Outlook is outbound wherever Graph filed it, and that is what
            // stamps `first_response_at`.
            direction: $from === $mailbox ? 'outbound' : 'inbound',
            references: $this->references($raw['internetMessageHeaders'] ?? []),
            hasAttachments: (bool) ($raw['hasAttachments'] ?? false),
            providerId: $raw['id'] ?? null,
        );
    }

    public function attachments(MailboxConnection $connection, string $providerMessageId): array
    {
        $response = Http::withToken($connection->access_token)
            ->acceptJson()
            ->get($this->api() . '/me/messages/' . rawurlencode($providerMessageId) . '/attachments', [
                '$select' => 'id,name,contentType,size,isInline',
            ]);

        if ($response->failed()) {
            throw new RuntimeException('Graph attachments failed: ' . $response->status() . ' ' . $response->body());
        }

        $files = [];

        foreach ($response->json('value') ?? [] as $raw) {
            // ⚠️ Only FILE attachments have bytes to fetch. An attached Outlook item (a forwarded
            // mail) or a OneDrive link has no `$value`, and an inline image is the signature logo.
            if (($raw['@odata.type'] ?? '') !== '#microsoft.graph.fileAttachment' || ! empty($raw['isInline'])) {
                continue;
            }

            $files[] = [
                'id'        => $raw['id'],
                'name'      => $raw['name'] ?? 'attachment',
                'mime_type' => $raw['contentType'] ?? 'application/octet-stream',
                'size'      => isset($raw['size']) ? (int) $raw['size'] : null,
            ];
        }

        return $files;
    }

    public function attachmentContent(MailboxConnection $connection, string $providerMessageId, string $providerAttachmentId): string
    {
        $response = Http::withToken($connection->access_token)
            ->get($this->api() . '/me/messages/' . rawurlencode($providerMessageId)
                . '/attachments/' . rawurlencode($providerAttachmentId) . '/$value');

        if ($response->failed()) {
            throw new RuntimeException('Graph attachment download failed: ' . $response->status());
        }

        return $response->body();
    }

    /** In-Reply-To + References, flattened — thread-match tier 2. */
    private function references(array $headers): array
    {
        $out = [];

        foreach ($headers as $header) {
            $name = strtolower($header['name'] ?? '');

            if ($name === 'in-reply-to' || $name === 'references') {
                preg_match_all('/<[^>]+>/', (string) ($header['value'] ?? ''), $m);
                $out = array_merge($out, $m[0]);
            }
        }

        return array_values(array_unique($out));
    }

    /** @return array{access_token: string, refresh_token: ?string, expires_in: int} */
    private function token(array $grant): array
    {
        $response = Http::asForm()->post($this->authority() . '/oauth2/v2.0/token', $grant + [
            'client_id'     => $this->config('client_id'),
            'client_secret' => $this->config('client_secret'),
            'scope'         => implode(' ', config('services.graph.scopes')),
        ]);

        if ($response->failed()) {
            throw new RuntimeException('Graph token request failed: '
                . $response->status() . ' ' . $response->body());
        }

        return [
            'access_token' => $response->json('access_token'),
            // ⚠️ A refresh response does not always carry a NEW refresh token. Overwriting
            // the stored one with NULL is how a mailbox silently stops syncing an hour
            // later — the caller must keep the old one when this is null.
            'refresh_token' => $response->json('refresh_token'),
            'expires_in'    => (int) ($response->json('expires_in') ?? 3600),
        ];
    }

    private function authority(): string
    {
        return rtrim($this->config('authority'), '/') . '/' . $this->config('tenant');
    }

    /**
     * Send through Graph — a reply or forward when `$replyToProviderId` is given, otherwise a
     * new message.
     *
     * 🔴 `/reply` and `/forward` rather than `/sendMail` for an answer, because Graph then sets
     * `In-Reply-To` and `References` itself. Threading built by hand from those headers is
     * threading that breaks the first time a client's mail server rewrites them.
     *
     * ⚠️ NOTHING IS WRITTEN LOCALLY. The sent message returns on the next delta as an echo and
     * is upserted on its unique `message_id`.
     */
    public function send(
        MailboxConnection $connection,
        array $to,
        array $cc,
        string $subject,
        string $body,
        ?string $replyToProviderId = null,
        array $attachments = [],
        string $mode = 'reply'
    ): array {
        if ($attachments !== []) {
            return $this->sendWithAttachments($connection, $to, $cc, $subject, $body, $replyToProviderId, $attachments, $mode);
        }

        if ($replyToProviderId !== null) {
            $url = $this->api() . '/me/messages/' . rawurlencode($replyToProviderId) . ($mode === 'forward' ? '/forward' : '/reply');
            // Graph builds the quoted original; `message` carries the recipients the operator chose.
            $payload = [
                'message' => [
                    'toRecipients' => $this->recipients($to),
                    'ccRecipients' => $this->recipients($cc),
                ],
                // ⚠️ HTML: Graph inserts the comment above the quoted original it builds itself.
                // Not yet checked against a live tenant (GAPS).
                'comment' => $body,
            ];
        } else {
            $url = $this->api() . '/me/sendMail';
            $payload = [
                'message' => [
                    'subject'      => $subject,
                    'body'         => ['contentType' => 'HTML', 'content' => $body],
                    'toRecipients' => $this->recipients($to),
                    'ccRecipients' => $this->recipients($cc),
                ],
                'saveToSentItems' => true,
            ];
        }

        $response = Http::withToken($connection->access_token)->asJson()->post($url, $payload);

        if ($response->failed()) {
            // ⚠️ Graph's own message, not a generic one: "mailbox is over quota" tells an
            // operator whether to retry or fix the address; "send failed" does not.
            return ['ok' => false, 'error' => $this->graphError($response)];
        }

        return ['ok' => true, 'error' => null];
    }

    /** Graph takes at most this much attachment in one request; larger files go up in pieces. */
    private const SMALL_ATTACHMENT = 3 * 1024 * 1024;

    /** An upload-session piece: Graph requires a multiple of 320 KiB. */
    private const UPLOAD_CHUNK = 10 * 320 * 1024;

    /**
     * With files: build a DRAFT, attach, then send it.
     *
     * 🔴 `/reply` and `/sendMail` carry at most 3 MB of attachments in one request, so anything
     * with files goes through a draft: `createReply` / `createForward` (still threaded, and Graph
     * still writes the quoted original), our body put above that original, each file attached —
     * under 3 MB in one call, larger through an upload session — and then `/send`.
     *
     * ⚠️ A draft that fails half way is DELETED, or it sits in the user's Drafts folder looking
     * like something they started.
     */
    private function sendWithAttachments(
        MailboxConnection $connection, array $to, array $cc, string $subject, string $body,
        ?string $replyToProviderId, array $attachments, string $mode
    ): array {
        $api = $this->api();
        $http = fn () => Http::withToken($connection->access_token)->acceptJson();

        $created = $replyToProviderId !== null
            ? $http()->withBody('{}', 'application/json')
                ->post($api . '/me/messages/' . rawurlencode($replyToProviderId) . ($mode === 'forward' ? '/createForward' : '/createReply'))
            : $http()->asJson()->post($api . '/me/messages', [
                'subject' => $subject,
                'body' => ['contentType' => 'HTML', 'content' => $body],
                'toRecipients' => $this->recipients($to),
                'ccRecipients' => $this->recipients($cc),
            ]);

        if ($created->failed() || blank($created->json('id'))) {
            return ['ok' => false, 'error' => $this->graphError($created)];
        }

        $draft = $api . '/me/messages/' . rawurlencode($created->json('id'));

        try {
            if ($replyToProviderId !== null) {
                $this->check($http()->asJson()->patch($draft, [
                    'toRecipients' => $this->recipients($to),
                    'ccRecipients' => $this->recipients($cc),
                    'body' => ['contentType' => 'HTML', 'content' => $this->aboveQuote($body, (string) $created->json('body.content'))],
                ]));
            }

            foreach ($attachments as $file) {
                $this->attach($connection, $draft, $file);
            }

            $this->check($http()->withBody('{}', 'application/json')->post($draft . '/send'));
        } catch (RuntimeException $e) {
            Http::withToken($connection->access_token)->delete($draft);

            return ['ok' => false, 'error' => $e->getMessage()];
        }

        return ['ok' => true, 'error' => null];
    }

    /** One file onto a draft. */
    private function attach(MailboxConnection $connection, string $draft, array $file): void
    {
        $size = strlen($file['bytes']);

        if ($size < self::SMALL_ATTACHMENT) {
            $this->check(Http::withToken($connection->access_token)->asJson()->post($draft . '/attachments', [
                '@odata.type'  => '#microsoft.graph.fileAttachment',
                'name'         => $file['name'],
                'contentType'  => $file['mime_type'],
                'contentBytes' => base64_encode($file['bytes']),
            ]));

            return;
        }

        $session = $this->check(Http::withToken($connection->access_token)->asJson()
            ->post($draft . '/attachments/createUploadSession', [
                'AttachmentItem' => ['attachmentType' => 'file', 'name' => $file['name'], 'size' => $size],
            ]));

        $uploadUrl = $session->json('uploadUrl');

        for ($offset = 0; $offset < $size; $offset += self::UPLOAD_CHUNK) {
            $piece = substr($file['bytes'], $offset, self::UPLOAD_CHUNK);
            $last = $offset + strlen($piece) - 1;

            // 🔴 NO Authorization header: the upload URL is pre-authenticated, and Graph REJECTS
            // a request to it that carries a bearer token.
            $this->check(Http::withHeaders(['Content-Range' => "bytes {$offset}-{$last}/{$size}"])
                ->withBody($piece, 'application/octet-stream')
                ->put($uploadUrl));
        }
    }

    /** Our body inside the draft's HTML, above the original Graph quoted. */
    private function aboveQuote(string $body, string $draftHtml): string
    {
        if (preg_match('/<body[^>]*>/i', $draftHtml, $m, PREG_OFFSET_CAPTURE)) {
            $at = $m[0][1] + strlen($m[0][0]);

            return substr($draftHtml, 0, $at) . $body . substr($draftHtml, $at);
        }

        return $body . $draftHtml;
    }

    private function recipients(array $list): array
    {
        return array_values(array_map(fn ($address) => ['emailAddress' => ['address' => $address]], $list));
    }

    /** @throws RuntimeException with Graph's own message */
    private function check($response)
    {
        if ($response->failed()) {
            throw new RuntimeException($this->graphError($response));
        }

        return $response;
    }

    private function graphError($response): string
    {
        return $response->json('error.message') ?? ('HTTP ' . $response->status());
    }

    private function api(): string
    {
        return rtrim($this->config('api'), '/');
    }

    private function config(string $key): string
    {
        $value = config("services.graph.{$key}");

        if (blank($value)) {
            throw new RuntimeException(
                "Microsoft Graph is not configured: services.graph.{$key} is empty. "
                . 'Set GRAPH_CLIENT_ID / GRAPH_CLIENT_SECRET / GRAPH_REDIRECT_URI.'
            );
        }

        return $value;
    }
}
