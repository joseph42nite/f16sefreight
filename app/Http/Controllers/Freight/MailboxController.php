<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\MailboxConnection;
use App\Services\AuditLogger;
use App\Services\Mail\MailBody;
use App\Services\Mail\MailboxSyncService;
use App\Services\Mail\MailProviderRegistry;
use App\Support\UserContext;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Throwable;

/**
 * Connecting and managing a mailbox — guide §4.2.
 *
 * 🔴 **The OAuth callback CANNOT be authenticated the normal way.** It arrives as a browser
 * redirect from Microsoft with no `Authorization` header, so the acting user has to be
 * carried across the round trip in `state`. That state is a random key into a short-lived
 * cache entry, never the user id itself — a guessable or forgeable state would let anyone
 * attach THEIR mailbox tokens to somebody else's account, or attach a mailbox they control
 * to a tenant they do not belong to.
 *
 * 🔐 Tokens are written straight to encrypted columns and never logged, never returned in a
 * response, and never placed in a URL.
 */
class MailboxController extends Controller
{
    /** Marks the state of an IT admin's company-wide approval, which comes back to the same address. */
    public const APPROVAL_STATE = 'approval.';

    /** How long a user has to finish the consent screen. */
    private const STATE_TTL_MINUTES = 10;

    public function __construct(
        private MailProviderRegistry $providers,
        private AuditLogger $audit,
    ) {
    }

    /** The tenant's connected mailboxes. Never includes tokens — see $hidden on the model. */
    public function index(): JsonResponse
    {
        $context = UserContext::for(auth()->user());

        $connections = MailboxConnection::where('agent_id', $context->agentId)
            ->get(['id', 'email_address', 'provider', 'is_active', 'auth_state',
                   'last_synced_at', 'disconnected_at', 'backfill_status',
                   'signature_html', 'signature_source']);

        return response()->json([
            'connections' => $connections,
            'providers'   => $this->providers->available(),
            // The fallback for a mailbox with no signature of its own.
            'my_signature' => auth()->user()->signature_text,
        ]);
    }

    /**
     * Begin the connect flow. Returns the URL for the browser to visit.
     *
     * ⚠️ Returned rather than redirected: the caller is a Vue app holding a JWT, and a 302
     * from an XHR would be followed by the browser without ever reaching the user.
     */
    public function connect(Request $request): JsonResponse
    {
        $data = $request->validate([
            'provider' => ['required', 'string', 'in:' . implode(',', $this->providers->available())],
        ]);

        $user = auth()->user();
        $context = UserContext::for($user);

        if ($context->agentId === null) {
            return response()->json([
                'error'  => 'This account is not attached to a branch, so a mailbox cannot be connected.',
                'reason' => 'no_tenant',
            ], 422);
        }

        $state = (string) Str::uuid();

        Cache::put($this->stateKey($state), [
            'user_id'  => $user->id,
            'agent_id' => $context->agentId,
            'provider' => $data['provider'],
            // The portal they started from — Microsoft sends the browser back to one fixed address, and the sign-in is
            // kept per portal, so the import screen must open where they were.
            'return_to' => $request->getSchemeAndHttpHost(),
        ], now()->addMinutes(self::STATE_TTL_MINUTES));

        // 🔴 AN UNCONFIGURED APP MUST EXPLAIN ITSELF, NOT 500. Until the Entra app
        // registration exists, `services.graph.client_id` is empty and building the
        // authorization URL throws — which is the FIRST thing anyone hits on a fresh
        // install. A 500 there tells the operator the product is broken; it is not, it is
        // unconfigured, and those need different words and different people to fix them.
        try {
            $url = $this->providers->for($data['provider'])->authorizationUrl($state);
        } catch (Throwable $e) {
            Cache::forget($this->stateKey($state));

            return response()->json([
                'error'  => 'Mailbox sign-in is not configured on this server yet. '
                    . 'An administrator needs to register the app with Microsoft and set '
                    . 'GRAPH_CLIENT_ID, GRAPH_CLIENT_SECRET and GRAPH_REDIRECT_URI.',
                'reason' => 'provider_not_configured',
                'detail' => $e->getMessage(),
            ], 503);
        }

        return response()->json([
            'authorization_url' => $url,
            'expires_in'        => self::STATE_TTL_MINUTES * 60,
        ]);
    }

    /**
     * Where Microsoft sends the browser back.
     *
     * 🔴 Unauthenticated by necessity, so `state` is the ONLY thing establishing who this
     * is. It is consumed on use (`Cache::pull`), which makes a replayed callback fail
     * rather than attach a second copy of the mailbox.
     */
    public function callback(Request $request)
    {
        $state = (string) $request->query('state');

        if (str_starts_with($state, self::APPROVAL_STATE)) {
            return $this->approved($request, $state);
        }

        $pending = Cache::pull($this->stateKey($state));

        if ($pending === null) {
            return $this->finish('This sign-in link has expired or was already used. Try connecting again.', false);
        }

        // Microsoft reports consent refusal as a redirect, not an error status.
        if ($request->filled('error')) {
            $said = (string) $request->query('error_description', $request->query('error'));

            // The company's Microsoft 365 lets only its IT admin approve apps: say so plainly.
            if (in_array($request->query('error'), ['access_denied', 'consent_required'], true) || preg_match('/AADSTS(65001|90094|90095)/', $said)) {
                return $this->finish('Your company\'s Microsoft 365 needs its IT admin to approve F16s once for everyone. '
                    . 'Ask F16s for your company\'s approval link and send it to your IT admin, then connect again.', false, $pending['return_to'] ?? null);
            }

            return $this->finish('Microsoft did not grant access: ' . $said, false, $pending['return_to'] ?? null);
        }

        if (! $request->filled('code')) {
            return $this->finish('Microsoft did not return an authorization code.', false, $pending['return_to'] ?? null);
        }

        try {
            $provider = $this->providers->for($pending['provider']);
            $tokens = $provider->exchangeCode((string) $request->query('code'));
            $address = $provider->primaryAddress($tokens['access_token']);
        } catch (Throwable $e) {
            return $this->finish('Could not complete the connection: ' . $e->getMessage(), false, $pending['return_to'] ?? null);
        }

        // 🔴 Their own mailbox: the Outlook account must be the email they log in with (user, 2026-09-16) — not a
        // personal account, not a colleague's.
        $loginEmail = strtolower((string) \App\User::whereKey($pending['user_id'])->value('email'));

        if ($address !== $loginEmail) {
            return $this->finish("You signed in to Microsoft as {$address}, but you log in to F16s as {$loginEmail}. "
                . "Connect again and choose the Microsoft account for {$loginEmail}.", false, $pending['return_to'] ?? null);
        }

        // 🔴 `email_address` is GLOBALLY unique. A mailbox already attached elsewhere must
        // be refused with an explanation rather than 500ing on the index — two tenants
        // syncing one mailbox would cross-file a client's mail between companies.
        $existing = MailboxConnection::withoutGlobalScopes()->where('email_address', $address)->first();

        if ($existing !== null && (int) $existing->agent_id !== (int) $pending['agent_id']) {
            return $this->finish("{$address} is already connected to another branch.", false, $pending['return_to'] ?? null);
        }

        $connection = $existing ?? new MailboxConnection();

        $connection->forceFill([
            'agent_id'      => $pending['agent_id'],
            'user_id'       => $pending['user_id'],
            'email_address' => $address,
            'provider'      => $provider->key(),
            'access_token'  => $tokens['access_token'],
            'refresh_token' => $tokens['refresh_token'] ?: $connection->refresh_token,
            'expires_at'    => now()->addSeconds($tokens['expires_in']),
            'auth_state'    => 'connected',
            'is_active'     => true,
            // Reconnecting clears the user's own removal — this IS the user asking for it
            // back, unlike a tier upgrade, which must not.
            'disconnected_at'  => null,
            'disconnected_by'  => null,
            // A reconnect after the import finished carries on from its cursors; otherwise the last month is imported.
            'backfill_status'  => $connection->backfill_status === 'completed' ? 'completed' : 'pending',
        ])->save();

        $this->audit->record($pending['agent_id'], 'mailbox.connected', 'mailbox_connection',
            $connection->id, $pending['user_id']);

        // Straight to the import screen, in the portal they started from.
        return redirect()->away(rtrim($pending['return_to'] ?? '', '/') . '/mailbox-import/' . $connection->id);
    }

    /**
     * The user removes their own mailbox.
     *
     * 🔴 This is NOT `is_active = false`. That flag is the superadmin's tier downgrade and
     * KEEPS the tokens so an upgrade restores sync silently. A user's own removal clears
     * them — otherwise a later billing change reconnects a mailbox its owner deliberately
     * removed, an action performed by nobody (PRD §3.3).
     */
    public function disconnect(MailboxConnection $mailbox): JsonResponse
    {
        $context = UserContext::for(auth()->user());

        if ((int) $mailbox->agent_id !== (int) $context->agentId) {
            return response()->json(['error' => 'Not found.'], 404);
        }

        $mailbox->forceFill([
            'access_token'    => null,
            'refresh_token'   => null,
            'sync_cursor'     => null,
            'auth_state'      => 'not_connected',
            'disconnected_at' => now(),
            'disconnected_by' => auth()->id(),
        ])->save();

        $this->audit->record($mailbox->agent_id, 'mailbox.disconnected', 'mailbox_connection',
            $mailbox->id, auth()->id());

        return response()->json(['status' => true, 'msg' => 'Mailbox disconnected. Stored credentials were erased.']);
    }

    /**
     * A mailbox's signature (PRD §5.2.4) — per mailbox, because a user with two accounts
     * usually needs two.
     *
     * ⚠️ Cleaned on the way in exactly like a composed body: a signature pasted from Outlook
     * carries `mso-` styles and class soup that would otherwise go out on every mail.
     */
    public function updateSignature(Request $request, MailboxConnection $mailbox, MailBody $mailBody): JsonResponse
    {
        $context = UserContext::for(auth()->user());

        if ((int) $mailbox->agent_id !== (int) $context->agentId) {
            return response()->json(['error' => 'Not found.'], 404);
        }

        $data = $request->validate([
            'signature_html'   => ['nullable', 'string', 'max:20000'],
            'signature_source' => ['nullable', 'in:pasted,manual'],
        ]);

        $html = $mailBody->clean($data['signature_html'] ?? '');
        $empty = trim(strip_tags($html)) === '';

        $mailbox->forceFill([
            'signature_html'   => $empty ? null : $html,
            'signature_source' => $empty ? null : ($data['signature_source'] ?? 'manual'),
        ])->save();

        return response()->json($mailbox->only(['id', 'signature_html', 'signature_source']));
    }

    /** The user's own signature, used where a mailbox has none. Plain text, as the column is. */
    public function updateMySignature(Request $request): JsonResponse
    {
        $data = $request->validate(['signature_text' => ['nullable', 'string', 'max:5000']]);

        $user = auth()->user();
        $user->forceFill(['signature_text' => blank($data['signature_text'] ?? null) ? null : $data['signature_text']])->save();

        return response()->json(['signature_text' => $user->signature_text]);
    }

    /** Sync one mailbox now, rather than waiting for the sweep. */
    public function syncNow(MailboxConnection $mailbox, MailboxSyncService $sync): JsonResponse
    {
        $context = UserContext::for(auth()->user());

        if ((int) $mailbox->agent_id !== (int) $context->agentId) {
            return response()->json(['error' => 'Not found.'], 404);
        }

        $result = $sync->sync($mailbox);

        return response()->json($result, $result['ok'] ? 200 : 422);
    }

    /**
     * Import a few pages of the last month and say how far it has got. The import screen calls this until it is done;
     * the 15-minute sweep carries on if the screen is closed.
     */
    public function import(MailboxConnection $mailbox, MailboxSyncService $sync): JsonResponse
    {
        $context = UserContext::for(auth()->user());

        if ((int) $mailbox->agent_id !== (int) $context->agentId) {
            return response()->json(['error' => 'Not found.'], 404);
        }

        $error = null;

        if (in_array($mailbox->backfill_status, ['pending', 'running'], true)) {
            $error = $sync->sync($mailbox, 5)['error'];
            $mailbox->refresh();
        }

        return response()->json([
            'email_address' => $mailbox->email_address,
            'status' => $mailbox->backfill_status,
            'processed' => (int) $mailbox->backfill_processed,
            'estimate' => $mailbox->backfill_estimate,
            'from' => $mailbox->backfill_from?->toDateString(),
            'error' => $error,
        ]);
    }

    /**
     * Microsoft sends the IT admin back here after approving (or refusing) F16s for their company. The state is the
     * company, encrypted — the link is sent by email and may be opened days later, so it cannot live in the cache.
     */
    private function approved(Request $request, string $state)
    {
        try {
            $companyId = (int) \Illuminate\Support\Facades\Crypt::decryptString(substr($state, strlen(self::APPROVAL_STATE)));
        } catch (Throwable $e) {
            return $this->finish('This approval link is not valid. Ask F16s for a new one.', false);
        }

        $company = \App\Company::withoutGlobalScopes()->find($companyId);

        if ($company === null) {
            return $this->finish('This approval link is not valid. Ask F16s for a new one.', false);
        }

        if ($request->query('admin_consent') !== 'True') {
            return $this->finish('F16s was not approved: ' . $request->query('error_description', $request->query('error', 'no answer from Microsoft')), false);
        }

        $company->forceFill(['outlook_approved_at' => now(), 'outlook_tenant_id' => mb_substr((string) $request->query('tenant'), 0, 64)])->save();

        return $this->finish("F16s is approved for {$company->name}. Everyone at your company can now connect their Outlook from F16s.", true);
    }

    private function stateKey(string $state): string
    {
        return "mailbox_oauth_state:{$state}";
    }

    /**
     * The callback lands in a BROWSER, so it answers with a page rather than JSON.
     *
     * ⚠️ The message is escaped: `error_description` is attacker-influencable text arriving
     * from a redirect, and rendering it raw would be reflected XSS on our own origin.
     */
    private function finish(string $message, bool $ok, ?string $back = null)
    {
        $status = $ok ? 200 : 400;

        return response()->make(
            '<!doctype html><meta charset="utf-8"><title>Mailbox</title>'
            . '<body style="font:16px system-ui;padding:2rem;max-width:34rem;margin:auto">'
            . '<h1 style="font-size:1.1rem">' . ($ok ? 'Mailbox connected' : 'Connection failed') . '</h1>'
            . '<p>' . e($message) . '</p>'
            . ($back ? '<p><a href="' . e(rtrim($back, '/')) . '/mailboxes">Back to Mailboxes</a></p>'
                : '<p style="color:#5A6472">You can close this window and return to the app.</p>'),
            $status,
            ['Content-Type' => 'text/html']
        );
    }
}
