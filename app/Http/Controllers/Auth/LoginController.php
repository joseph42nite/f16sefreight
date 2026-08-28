<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Role;
use App\User;
use App\Company;
use App\Support\Portal;
use App\Support\UserContext;
use Illuminate\Support\Facades\Cache;

class LoginController extends Controller
{
    //
    public function login()
    {
        $credentials = request(['email', 'password']);
        $roleRecord = Role::where('email', $credentials['email'])->select('role')->first();
        
        if (!$roleRecord) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        $role = $roleRecord->role;
        $guard = $role . '-api';
        
        if (!$token = auth()->guard($guard)->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $user_data = auth()->guard($guard)->user();
        $current_date = date("Y-m-d");

        $userDataArray = $user_data->toArray();

        if ($role == 'user') {
            User::where('id', $user_data->id)->update(['latest_token' => $token]);
            
            // EAGER CACHED CONFIGURATION
            //
            // users.company_name stores the company ID, not the name: the admin user form's
            // dropdown saves companies.id while displaying the name (NewUsers.vue). Looking it
            // up by name therefore matched nothing and templates_config came back null on every
            // login. Resolve by id, falling back to name for any older row that holds a literal
            // name. See docs/plan/CONTEXT.md §6.
            $companyRef = $user_data->company_name;
            $templatesConfig = Cache::remember(
                "company_templates_{$companyRef}",
                3600,
                fn() => optional(
                    is_numeric($companyRef)
                        ? Company::find($companyRef)
                        : Company::where('name', $companyRef)->first()
                )->templates_config
            );
            
            $userDataArray['templates_config'] = $templatesConfig;
        }

        // ── Portal gating — guide §3.4, PRD §1.3 ────────────────────────────────
        //
        // 🔴 THE NULL-PORTAL PATH MUST STAY BYTE-IDENTICAL. The live application logs in
        // at plain `localhost` / the bare apex, which names no portal, and that login has
        // to keep working exactly as it did before this block existed. Portal rules apply
        // ONLY when the Host actually names one of the six subdomains.
        $portal = Portal::fromHost(request()->getHost());

        if ($portal->exists()) {
            $rejection = $this->rejectIfPortalDisallows($portal, $user_data, $role);

            if ($rejection !== null) {
                return $rejection;
            }
        }

        $payload = [
            'token' => $token,
            'user'  => $userDataArray,
            'role'  => $role,
        ];

        // Expose tier and designation on the login payload so Vue route guards can read
        // them (guide §3.6). The backend re-checks everything regardless — the frontend
        // gate is convenience, never security.
        if ($user_data instanceof User) {
            $payload['context'] = UserContext::for($user_data)->toArray();
        }

        if ($portal->exists()) {
            $payload['portal'] = [
                'key'   => $portal->key,
                'label' => $portal->label(),
                'scope' => $portal->scope(),
            ];
        }

        return response()->json($payload);
    }

    /**
     * Decide whether this user may enter this portal. Returns a response to send, or NULL
     * to continue.
     *
     * Order is deliberate and matches EnforcePortalAccess:
     *   1. guard      — the platform portal is a different auth guard entirely
     *   2. TIER       — on `core`, designation is inert and no role portal opens
     *   3. role       — designation must belong on this portal
     *
     * Checking tier before role is what stops a Core tenant reaching a role-scoped portal
     * by writing a designation value directly into the database.
     */
    private function rejectIfPortalDisallows(Portal $portal, $user, string $role)
    {
        // superadmin. is F16s's own staff on the superAdmin-api guard. admin. is the
        // CLIENT tenant's Boss — an ordinary user. Conflating them would hand a tenant
        // director a host the middleware treats as untenanted.
        if (! $portal->isTenantBound()) {
            return $role === 'superAdmin'
                ? null
                : response()->json([
                    'error'  => 'This portal is for platform staff.',
                    'reason' => 'guard',
                ], 403);
        }

        if ($role === 'superAdmin') {
            return response()->json([
                'error'  => 'Platform staff sign in at the platform portal.',
                'reason' => 'guard',
            ], 403);
        }

        if (! $user instanceof User) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $context = UserContext::for($user);

        if (! $context->tierAtLeast($portal->minTier())) {
            return response()->json([
                'error'         => "The {$portal->label()} portal requires the {$portal->minTier()} plan.",
                'reason'        => 'tier',
                'current_tier'  => $context->tier,
                'required_tier' => $portal->minTier(),
            ], 403);
        }

        if (! $portal->allowsDesignation($context->designation)) {
            return response()->json([
                'error'  => "Your account is not set up for the {$portal->label()} portal.",
                'reason' => 'designation',
            ], 403);
        }

        return null;
    }

    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email', // Validate email
        ]);

        $user = User::where('email', $request->email)->first();

        // Generate OTP
        $otp = rand(100000, 999999);
        $user->otp = $otp;
        $user->otp_expiration = now()->addMinutes(10); // Set expiration time
        $user->save();

        // Send OTP to the user's email
        Mail::to($user->email)->send(new OtpMail($otp)); // Assuming you have the OtpMail mailable

        return response()->json(['message' => 'OTP sent successfully']);
    }
    public function login_superadmin()
    {
        $credentials = request(['email', 'password']);

        if (!$token = auth()->guard('superAdmin-api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return $this->respondWithToken($token);
    }
}