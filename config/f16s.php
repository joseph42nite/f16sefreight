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

];
