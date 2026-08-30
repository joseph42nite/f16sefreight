<?php

namespace App\Providers;

use App\Support\UserContext;
use App\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        //
    ];

    public function boot()
    {
        $this->registerPolicies();
        $this->registerRoleGates();
    }

    /**
     * Role gates — guide §3.4, implemented against the Role x Screen matrix (PRD §2.4).
     *
     * 🔴 **TIER IS CHECKED BEFORE ROLE, in every gate.** On `core` there is exactly ONE
     * login type: `users.designation` is carried but INERT, and every role-specific route
     * is unreachable whatever the column says. Role policies begin evaluating only at
     * `tactical`, and `accounts` only at `command`. Checking tier first is what stops a
     * Core tenant reaching a role-scoped endpoint by writing a designation directly into
     * the database.
     *
     * 🔒 **Posting to the ledger and opening/closing a period are exclusive to
     * `accounts` — not even the Boss.** The role that sets targets must not book the
     * revenue those targets are measured in, and the role that sets the margin must not
     * book it either. `boss` appearing in either list is a BUG, and the test suite
     * asserts a boss receives 403 on both.
     */
    private function registerRoleGates(): void
    {
        // ── The unified inbox ────────────────────────────────────────────────
        // Both operational roles live here: pricing triages, operations claims and
        // works. `triage` (below) is what actually gates re-classification, so reading
        // the inbox is deliberately wider than changing what a thread IS.
        $this->define('viewInbox', ['pricing', 'operations'], 'tactical');

        // ── Enquiry lifecycle — pricing owns triage and conversion ───────────
        $this->define('triage',     ['pricing'], 'tactical');
        $this->define('convert',    ['pricing'], 'tactical');
        $this->define('markLost',   ['pricing'], 'tactical');

        // Operations may ASK for a reassignment; pricing (or boss) grants it.
        $this->define('requestReassignment', ['operations'],      'tactical');
        $this->define('assignOperator',      ['pricing', 'boss'], 'tactical');

        // ── Customs & manifests — guide §5.4 ─────────────────────────────────
        // 🔒 OPERATIONS transmits. `documentation` is a legacy designation VALUE, not
        // a login: document work is done by the same operations user who executes the
        // shipment (PRD.md §2.3), so there is no separate filing role to grant.
        // Pricing and boss may READ a filing — seeing that a consignee name is eight
        // characters too long is how it gets fixed in the address book rather than at
        // the gateway — but neither may transmit one.
        $this->define('fileManifest', ['operations'],                      'tactical');
        $this->define('viewManifest', ['operations', 'pricing', 'boss'],   'tactical');

        // ── Analytics — explicitly 403 for operations and pricing ────────────
        $this->define('viewAnalytics', ['sales', 'boss', 'accounts'], 'tactical');
        $this->define('viewSales',     ['sales', 'boss'],             'tactical');

        // ── Financial — Command tier only ────────────────────────────────────
        // 🔒 accounts ONLY. Including boss here is the single most likely permission
        // to get wrongly widened during development.
        $this->define('finalizeInvoice', ['accounts'], 'command');
        $this->define('postLedger',      ['accounts'], 'command');
        $this->define('managePeriod',    ['accounts'], 'command');
        $this->define('reconcile',       ['accounts'], 'command');

        // Boss gets read-only on financial reports, and may override a credit hold.
        $this->define('viewFinancials',    ['accounts', 'boss'], 'command');
        $this->define('overrideCreditHold', ['accounts', 'boss'], 'command');
    }

    /**
     * @param  string[]  $designations
     * @param  string    $minTier  checked BEFORE the designation — see the docblock
     */
    private function define(string $ability, array $designations, string $minTier): void
    {
        Gate::define($ability, function (User $user) use ($designations, $minTier) {
            $context = UserContext::for($user);

            // 1. TIER FIRST. On core, designation is inert and nothing role-scoped opens.
            if (! $context->tierAtLeast($minTier)) {
                return false;
            }

            // 2. THEN ROLE.
            return in_array($context->designation, $designations, true);
        });
    }
}
