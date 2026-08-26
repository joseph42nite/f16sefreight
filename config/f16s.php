<?php

return [

    /*
    |--------------------------------------------------------------------------
    | OCR Credit Economy — tier defaults
    |--------------------------------------------------------------------------
    |
    | Only VISION OCR costs a credit. Text-selectable PDFs are parsed locally by
    | Gemma and are free; coordinate extraction (pdfplumber) is free at every tier.
    | See PRD.md §3.4 and implementation_guide.md §4.1.1.
    |
    | These are DEFAULTS. A platform superadmin may pin a per-tenant value on the
    | companies row; NULL there means "follow the tier", so an ordinary tenant is
    | lifted automatically on upgrade while a negotiated allowance is never
    | silently overwritten by a tier change.
    |
    | Resolve with:
    |     $company->ocr_credits_monthly_allowance
    |         ?? config("f16s.credits.{$company->tier}.monthly_allowance")
    |
    | Sizing: credits/month ≈ shipments × client docs per shipment × share scanned.
    | A mid-size branch runs ~150 shipments × ~2.5 client docs × ~40% scanned ≈ 150.
    | The values below carry ~3x headroom, because the ceiling is meant to catch
    | abuse and the extreme tail — NOT to meter ordinary use. Recalibrate from
    | ocr_credit_transactions once a month of real burn exists.
    |
    */

    'credits' => [

        // No vision path at all — a scan returns `upgrade_required`.
        // Zero is the honest number here, not a restriction.
        'core' => [
            'monthly_allowance' => 0,
            'overdraft_limit'   => 0,
        ],

        'tactical' => [
            'monthly_allowance' => 500,
            'overdraft_limit'   => -20,
        ],

        'command' => [
            'monthly_allowance' => 2000,
            'overdraft_limit'   => -50,
        ],

    ],

    /*
    | Hours a job may sit at `awaiting_vision_consent` before it is cancelled and
    | its temp PDF deleted. The 30-minute stale sweep must NOT touch that state —
    | an operator may legitimately answer an hour later.
    */
    'vision_consent_ttl_hours' => 24,

    /*
    |--------------------------------------------------------------------------
    | Tenant policy defaults
    |--------------------------------------------------------------------------
    |
    | THESE ARE THE ONLY DEFAULTS. The `tenant_policies` table stores overrides
    | and every one of its columns is NULLable with no SQL default, so a value
    | lives in exactly one place. Duplicating a default into the DDL as well
    | would create two sources of truth that quietly drift apart.
    |
    | Resolution order, every time:   branch row → company row → here.
    |
    |     $v = $branchPolicy?->oli_capacity_cap
    |       ?? $companyPolicy?->oli_capacity_cap
    |       ?? config('f16s.policies.oli.capacity_cap');
    |
    | Owners differ per group and are NOT all superadmin (PRD §2.3.7):
    |   oli, undo_send, stale_enquiry  → tenant Boss,     /settings/workload
    |   cass                           → tenant Accounts, /settings/finance
    |
    */

    'policies' => [

        // Operator Load Index — PRD §5.5.
        // OLI = Σ over active jobs of (complexity + α·dimension_lines + β·houses) × urgency
        'oli' => [
            'complexity' => [
                'air_export' => 1.0,
                'air_import' => 1.5,
                'sea_export' => 2.0,
                'sea_import' => 2.5,
            ],
            'dimension_factor' => 0.2,   // α — per distinct L×W×H line
            'house_factor'     => 0.5,   // β — per HAWB under the master
            'urgency' => [
                'today'    => 3.0,       // clearance today or overdue
                'tomorrow' => 2.0,
                'later'    => 1.0,
            ],
            'capacity_cap' => 15.0,      // above this, assignment warns
        ],

        // Composer undo window — PRD §5.2.4. 0 is valid: send immediately, no undo.
        'undo_send_seconds' => 15,

        // Enquiry hygiene — PRD §5.4. Window of client silence before
        // enquiries:nudge-stale prompts pricing for an explicit Lost/keep decision.
        // ⚠️ STARTING POINT, NOT A SPECIFIED VALUE. PRD §5.4 says only "the tenant's
        // configured stale window" and never states a number. Confirm with the
        // business before launch — too short nags the desk, too long defeats the point.
        'stale_enquiry_days' => 7,

        // CASS reconciliation tolerances — PRD §6.5, default ±1.0% on both.
        // The only genuinely branch-level settings, which is why tenant_policies
        // carries agent_id at all.
        'cass' => [
            'weight_tolerance_pct' => 1.0,
            'rate_tolerance_pct'   => 1.0,
        ],

    ],

];
