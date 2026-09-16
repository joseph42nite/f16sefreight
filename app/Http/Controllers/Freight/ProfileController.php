<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * A person's own name (user, 2026-09-16).
 *
 * The name is what clients read: "Priya Nair from our operations team will be taking care of it", and it signs the
 * automated updates. Accounts are created by superadmin, often with a placeholder, so everyone can put their real
 * name in from Settings. Only their own row, and only the name — role, branch and company are not theirs to change.
 */
class ProfileController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:100']]);

        $user = auth()->user();
        $user->forceFill(['name' => trim($data['name'])])->save();

        return response()->json(['name' => $user->name]);
    }

    /**
     * Where this person stands with their own Outlook (user, 2026-09-16): pricing, operations, sales, the Boss and
     * accounts connect their mailbox; on their first sign-in they are asked, and may answer "Later".
     *
     * @return ?array{connected: bool, ask: bool, mailbox_id: ?int, importing: bool}  null for anyone who does not connect one
     */
    public static function mailboxState($user, \App\Support\UserContext $context): ?array
    {
        if (! in_array($context->designation, ['pricing', 'operations', 'sales', 'boss', 'accounts'], true) || $context->tier === 'core') {
            return null;
        }

        $mailbox = \App\MailboxConnection::withoutGlobalScopes()->where('user_id', $user->id)
            ->whereNull('disconnected_at')->where('auth_state', 'connected')->latest('id')->first();

        return [
            'connected' => $mailbox !== null,
            'ask' => $mailbox === null && $user->mailbox_prompted_at === null,
            'mailbox_id' => $mailbox?->id,
            'importing' => $mailbox !== null && in_array($mailbox->backfill_status, ['pending', 'running'], true),
        ];
    }

    /** "Later": not asked again on sign-in; a reminder bar stays until the mailbox is connected. */
    public function mailboxLater(): JsonResponse
    {
        auth()->user()->forceFill(['mailbox_prompted_at' => now()])->save();

        return response()->json(['ok' => true]);
    }
}
