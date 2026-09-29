<?php

/*
 * Setu Account Aggregator — each bank account's statement, read with the account holder's consent (PRD §6.4, GAPS #442).
 *
 * 🔴 READ-ONLY, by law and by design. Under RBI's Account Aggregator framework we are the FIU: we may READ the data the
 * account holder consented to share, for as long as they allow it. Nothing here can move money — paying a supplier
 * is a different product with its own contract (see GAPS #442).
 *
 * ⚠️ The request and response shapes in SetuAccountAggregator were written from Setu's published FIU API as
 * remembered, NOT read from their documentation (setu.co was not reachable when this was built). Every call is in
 * that one class, so confirming them against the sandbox is a change to one file. `php artisan setu:status --ping`
 * says which keys are set (names only, never values).
 */
return [
    // 'sandbox' or 'production' — from Setu's dashboard, with its own keys for each.
    'environment' => env('SETU_AA_ENV', 'sandbox'),

    'base_url'            => env('SETU_AA_BASE_URL'),
    'client_id'           => env('SETU_AA_CLIENT_ID'),
    'client_secret'       => env('SETU_AA_CLIENT_SECRET'),
    'product_instance_id' => env('SETU_AA_PRODUCT_INSTANCE_ID'),

    // Names only: the command never prints a value.
    'required' => ['SETU_AA_BASE_URL', 'SETU_AA_CLIENT_ID', 'SETU_AA_CLIENT_SECRET', 'SETU_AA_PRODUCT_INSTANCE_ID'],

    // How long a consent lasts, and how far back the first read goes. Setu's consent template on the dashboard must
    // allow at least these.
    'consent_months' => (int) env('SETU_AA_CONSENT_MONTHS', 12),
    'history_days'   => (int) env('SETU_AA_HISTORY_DAYS', 90),

    // Each read starts this many days before the last one ended, so a late-posted line is not missed. Repeats are
    // harmless: the importer refreshes a line it already holds.
    'overlap_days' => 3,

    'timeout' => (int) env('SETU_AA_TIMEOUT', 20),
];
