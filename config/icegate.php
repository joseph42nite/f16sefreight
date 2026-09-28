<?php

/*
 * ICEGATE — the connection the CGM Filing screen transmits through (guide Step 12.3, GAPS #429).
 *
 * 🔴 Every value here comes from ICEGATE's developer portal, and none of them is guessed. Until all three
 * `required` keys are set, Auto File is refused with 422 and the screen names what is missing; Manual and Email
 * filings are recorded as today.
 *
 * ⚠️ Setting the keys is not enough on its own: the message format (the CGM/SCMTR layout) and DSC signing come from
 * ICEGATE's specification, and no transmitter is built until that is in hand (`transmitter` stays NULL). The
 * `icegate:status` command says which of the two is missing.
 */
return [
    // 'sandbox' or 'production'. Sandbox until the portal has passed the test filings.
    'environment' => env('ICEGATE_ENV', 'sandbox'),

    'base_url'      => env('ICEGATE_BASE_URL'),
    'client_id'     => env('ICEGATE_CLIENT_ID'),
    'client_secret' => env('ICEGATE_CLIENT_SECRET'),

    // The env keys that must be set before anything is sent. Names only — the command never prints a value.
    'required' => ['ICEGATE_BASE_URL', 'ICEGATE_CLIENT_ID', 'ICEGATE_CLIENT_SECRET'],

    // The class that builds and sends a filing. NULL until ICEGATE's message specification is in hand.
    'transmitter' => null,

    'timeout' => (int) env('ICEGATE_TIMEOUT', 30),
];
