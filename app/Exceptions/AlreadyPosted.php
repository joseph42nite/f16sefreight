<?php

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use RuntimeException;

/**
 * A journal already exists for this document, so a second one is refused (2026-11-10 audit, M1).
 *
 * 🔴 THIS IS THE RACE, NOT THE ORDINARY CASE. Every post action checks "already posted" before it opens its
 * transaction, and that check answers the second click of a slow user. Two requests that arrive together both pass
 * it. `LedgerPostingService::write()` throws this from inside the transaction, which rolls the loser back whole —
 * journal, GST register row, TDS register row — and the caller gets the same 422 the early check gives.
 */
class AlreadyPosted extends RuntimeException
{
    public function __construct(public readonly string $sourceType, public readonly int $sourceId)
    {
        parent::__construct("A journal already exists for {$sourceType} #{$sourceId}.");
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'error'  => 'This document is already posted.',
            'reason' => 'already_posted',
        ], 422);
    }
}
