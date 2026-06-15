<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\MailboxConnection;
use App\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class MailboxOAuthController extends Controller
{
    /**
     * Connect a user's mailbox connection after OAuth verification.
     * POST /api/user/mailbox-connections/connect
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function connect(Request $request)
    {
        $request->validate([
            'email_address' => ['required', 'email'],
            'provider'      => ['required', 'string', 'in:gmail,outlook'],
            'access_token'  => ['required', 'string'],
            'refresh_token' => ['required', 'string'],
            'expires_in'    => ['nullable', 'integer'],
            'expires_at'    => ['nullable', 'string'],
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }
        
        $company = Company::where('name', $user->company_name)->first();
        if (!$company) {
            return response()->json(['error' => 'Company configuration not found.'], 403);
        }

        $email = $request->input('email_address');
        $emailDomain = strtolower(substr(strrchr($email, "@"), 1));

        // Block personal email domains to prevent security leaks
        $personalDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com', 'aol.com', 'icloud.com'];
        if (in_array($emailDomain, $personalDomains)) {
            return response()->json([
                'error' => 'Personal/unauthorized email domains are not allowed.'
            ], 403);
        }

        // Validate corporate email domain suffix if configured for company
        if (!empty($company->email_domain)) {
            $companyDomain = strtolower(ltrim($company->email_domain, '@'));
            if (strcasecmp($emailDomain, $companyDomain) !== 0) {
                return response()->json([
                    'error' => 'Mailbox email domain does not match the company registered domain.'
                ], 403);
            }
        }

        $expiresAt = null;
        if ($request->has('expires_in')) {
            $expiresAt = now()->addSeconds((int)$request->input('expires_in'));
        } elseif ($request->has('expires_at')) {
            $expiresAt = Carbon::parse($request->input('expires_at'));
        }

        $connection = MailboxConnection::updateOrCreate(
            ['email_address' => $email],
            [
                'user_id'       => $user->id,
                'provider'      => $request->input('provider'),
                'access_token'  => $request->input('access_token'),
                'refresh_token' => $request->input('refresh_token'),
                'expires_at'    => $expiresAt,
                'is_active'     => true,
            ]
        );

        return response()->json([
            'status'  => true,
            'message' => 'Mailbox connection successfully registered.',
            'data'    => $connection,
        ], 200);
    }

    /**
     * List connected mailboxes for the authenticated user.
     * GET /api/user/mailbox-connections
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $connections = MailboxConnection::where('user_id', $user->id)->get();
        return response()->json($connections, 200);
    }

    /**
     * Disconnect/delete a mailbox connection.
     * DELETE /api/user/mailbox-connections/{id}
     */
    public function disconnect(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $connection = MailboxConnection::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $connection->delete();

        return response()->json([
            'status' => true,
            'message' => 'Mailbox successfully disconnected.',
        ], 200);
    }
}
