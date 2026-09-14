<?php

namespace App\Services\Mail;

use App\MailboxConnection;

/**
 * What a mail provider must be able to do — guide §4.2.
 *
 * 🔴 **The interface exists from the first line, before there are two providers.**
 * Microsoft ships first because Google's `gmail.*` scopes need a CASA audit with annual
 * recertification (GAPS #15), but Gmail is a deferral, not a cancellation. Everything
 * genuinely hard about ingestion — three-tier thread matching, echo suppression, resumable
 * backfill, the SLA clock — is provider-agnostic; only the delta cursor and the wire shape
 * of a message are not. Writing Graph calls directly into a command would mean rewriting
 * that machinery when Gmail lands, and re-deriving every decision in it.
 *
 * ⚠️ **Implementations return NORMALISED messages, never provider payloads.** A provider
 * that leaked its own JSON shape upward would put `conversationId` in one branch and
 * `threadId` in another all through the ingestor, which is the same rewrite by instalments.
 */
interface MailProviderContract
{
    /** Provider key stored on `mailbox_connections.provider`. */
    public function key(): string;

    /** Where to send the user to authorise. `$state` is the CSRF/round-trip token. */
    public function authorizationUrl(string $state): string;

    /**
     * Exchange an authorization code for tokens.
     *
     * @return array{access_token: string, refresh_token: ?string, expires_in: int}
     */
    public function exchangeCode(string $code): array;

    /**
     * Refresh an expired access token.
     *
     * @return array{access_token: string, refresh_token: ?string, expires_in: int}
     */
    public function refresh(string $refreshToken): array;

    /** The mailbox address the tokens belong to — never trust the one the user typed. */
    public function primaryAddress(string $accessToken): string;

    /**
     * One page of changes since `$cursor`.
     *
     * ⚠️ A NULL cursor means "start a delta stream", not "read everything ever". The
     * initial fill is a separate, resumable concern — see `backfill_page_cursor`.
     *
     * @return array{messages: array<int,NormalisedMessage>, next_cursor: ?string, delta_cursor: ?string}
     */
    public function delta(MailboxConnection $connection, ?string $cursor): array;

    /**
     * The files attached to one message — names and types only, never the bytes.
     *
     * 🔴 LAZY (guide §4.2): the bytes are fetched only when someone opens or extracts the file.
     * Inline images (signature logos) are left out; they are part of the body, not documents.
     *
     * @return array<int, array{id: string, name: string, mime_type: string, size: ?int}>
     */
    public function attachments(MailboxConnection $connection, string $providerMessageId): array;

    /** The bytes of one attachment. Throws when the provider refuses. */
    public function attachmentContent(MailboxConnection $connection, string $providerMessageId, string $providerAttachmentId): string;

    /**
     * Send a message from the connected mailbox.
     *
     * 🔴 The provider sends it, and the SAME message comes back on the next delta as an
     * echo — `message_id` is unique, so ingestion upserts rather than duplicating. That
     * is why nothing here writes an `email_messages` row: the mailbox is the source of
     * truth for what was actually sent, and inventing a local row would produce a second
     * copy the moment the echo arrives.
     *
     * @param  string[]  $to
     * @param  string[]  $cc
     * @param  ?string   $replyToProviderId  the provider's id for the message being
     *                                       answered. Set it and the provider threads the
     *                                       reply; omit it and this starts a new thread.
     * @return array{ok: bool, error: ?string}
     */
    public function send(
        MailboxConnection $connection,
        array $to,
        array $cc,
        string $subject,
        string $body,
        ?string $replyToProviderId = null
    ): array;
}
