<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\MailboxConnection;
use App\Services\AuditLogger;
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
                   'last_synced_at', 'disconnected_at', 'backfill_status']);

        return response()->json([
            'connections' => $connections,
            'providers'   => $this->providers->available(),
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
        $pending = Cache::pull($this->stateKey($state));

        if ($pending === null) {
            return $this->finish('This sign-in link has expired or was already used. Try connecting again.', false);
        }

        // Microsoft reports consent refusal as a redirect, not an error status.
        if ($request->filled('error')) {
            return $this->finish('Microsoft did not grant access: ' . $request->query('error_description', $request->query('error')), false);
        }

        if (! $request->filled('code')) {
            return $this->finish('Microsoft did not return an authorization code.', false);
        }

        try {
            $provider = $this->providers->for($pending['provider']);
            $tokens = $provider->exchangeCode((string) $request->query('code'));
            $address = $provider->primaryAddress($tokens['access_token']);
        } catch (Throwable $e) {
            return $this->finish('Could not complete the connection: ' . $e->getMessage(), false);
        }

        // 🔴 `email_address` is GLOBALLY unique. A mailbox already attached elsewhere must
        // be refused with an explanation rather than 500ing on the index — two tenants
        // syncing one mailbox would cross-file a client's mail between companies.
        $existing = MailboxConnection::withoutGlobalScopes()->where('email_address', $address)->first();

        if ($existing !== null && (int) $existing->agent_id !== (int) $pending['agent_id']) {
            return $this->finish("{$address} is already connected to another branch.", false);
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
            'backfill_status'  => 'pending',
        ])->save();

        $this->audit->record($pending['agent_id'], 'mailbox.connected', 'mailbox_connection',
            $connection->id, $pending['user_id']);

        return $this->finish("{$address} is connected. Mail will begin syncing shortly.", true);
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
    private function finish(string $message, bool $ok)
    {
        $status = $ok ? 200 : 400;

        return response()->make(
            '<!doctype html><meta charset="utf-8"><title>Mailbox</title>'
            . '<body style="font:16px system-ui;padding:2rem;max-width:34rem;margin:auto">'
            . '<h1 style="font-size:1.1rem">' . ($ok ? 'Mailbox connected' : 'Connection failed') . '</h1>'
            . '<p>' . e($message) . '</p>'
            . '<p style="color:#5A6472">You can close this window and return to the app.</p>',
            $status,
            ['Content-Type' => 'text/html']
        );
    }
}
