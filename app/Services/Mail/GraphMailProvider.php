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
 * 🔴 **`/me/messages/delta`, NOT `/mailFolders/inbox/messages/delta`.** A reply typed in
 * Outlook lands in Sent Items and never touches the Inbox; an inbox-scoped sync loses half
 * of every conversation and, worse, loses exactly the half that fills `first_response_at`.
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

    public function delta(MailboxConnection $connection, ?string $cursor): array
    {
        $url = $cursor ?: $this->api() . '/me/messages/delta?' . http_build_query([
            '$select' => 'id,internetMessageId,conversationId,subject,from,toRecipients,'
                . 'receivedDateTime,bodyPreview,hasAttachments,internetMessageHeaders',
            '$top' => 50,
        ]);

        $response = Http::withToken($connection->access_token)
            ->acceptJson()
            // Graph returns deltas in pages; `Prefer` keeps the payload to what we select.
            ->withHeaders(['Prefer' => 'outlook.body-content-type="text"'])
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

    /** Graph's message shape → the ingestor's shape. Nothing above this sees Graph JSON. */
    private function normalise(array $raw, string $mailbox): NormalisedMessage
    {
        $from = strtolower($raw['from']['emailAddress']['address'] ?? '');

        $to = array_values(array_filter(array_map(
            fn ($r) => strtolower($r['emailAddress']['address'] ?? ''),
            $raw['toRecipients'] ?? []
        )));

        return new NormalisedMessage(
            messageId: $raw['internetMessageId'],
            threadId: $raw['conversationId'] ?? null,
            from: $from,
            to: $to,
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
