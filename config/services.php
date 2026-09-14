<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    /*
     * The FastAPI parsing engine.
     *
     * 🔴 PORT 8000, matching docker-compose. The default here was 8001 while the only
     * place the service is actually defined publishes 8000 — and nothing set
     * OCR_SERVICE_URL, so every extraction failed with "Could not connect to server" even
     * with the container running correctly. A default that disagrees with the deployment
     * is worse than no default: it fails at the point of use, far from the mismatch.
     *
     * The parser calls Gemma 4 through OpenRouter itself; Laravel only calls the parser.
     */
    'ocr' => [
        'url' => env('OCR_SERVICE_URL', 'http://127.0.0.1:8000'),
    ],

    /*
     * Microsoft Graph — mailbox ingestion (guide §4.2).
     *
     * 🟢 Microsoft ships FIRST because Google's `gmail.*` scopes are restricted and need a
     * third-party CASA audit with annual recertification (GAPS #15). Graph needs only the
     * tenant admin's consent.
     *
     * ⚠️ `tenant` is 'common' for a multi-tenant app, or a specific tenant GUID for a
     * single-tenant one. The single-tenant form is the near-term case and needs no
     * verification of any kind — the client's Global Administrator simply consents.
     *
     * 🔐 The secret is a CLIENT SECRET. It belongs in the environment, never in the repo,
     * and Entra expires it on a schedule — a mailbox that stops syncing with 401s months
     * from now is usually this, not a token bug.
     */
    // Gemma 4 on OpenRouter, called from Laravel for the help copilot (the parser calls it itself).
    // The key is the same one the ai-server container reads.
    'openrouter' => [
        'key'             => env('OPENROUTER_API_KEY'),
        'base'            => env('OPENROUTER_BASE', 'https://openrouter.ai/api/v1'),
        'chat_model'      => env('OPENROUTER_MODEL', 'google/gemma-4-31b-it'),
        // 1,024 dimensions: small enough to compare every help section in PHP on each question.
        'embedding_model' => env('OPENROUTER_EMBEDDING_MODEL', 'baai/bge-m3'),
        'attempt_timeout' => (int) env('OPENROUTER_ATTEMPT_TIMEOUT', 12),
    ],

    // clamd, for mail attachments (guide §4.2). docker-compose publishes it on 3310.
    'clamav' => [
        'host' => env('CLAMAV_HOST', '127.0.0.1'),
        'port' => env('CLAMAV_PORT', 3310),
    ],

    'graph' => [
        'client_id'     => env('GRAPH_CLIENT_ID'),
        'client_secret' => env('GRAPH_CLIENT_SECRET'),
        'tenant'        => env('GRAPH_TENANT', 'common'),
        'redirect'      => env('GRAPH_REDIRECT_URI'),
        'authority'     => env('GRAPH_AUTHORITY', 'https://login.microsoftonline.com'),
        'api'           => env('GRAPH_API_BASE', 'https://graph.microsoft.com/v1.0'),

        /*
         * 🔴 DELEGATED, not application permissions. Application permissions read EVERY
         * mailbox in the tenant — a freight operator's HR and finance mail included —
         * and would need an Exchange Application Access Policy to be safe. Delegated
         * access is bounded by the user who consented, which is exactly the boundary the
         * product wants: a user connects THEIR mailbox.
         *
         * ⚠️ Read/WRITE because the portal replaces the mail client (PRD §5.2.3), and
         * `offline_access` because without it there is no refresh token and every mailbox
         * silently stops syncing about an hour after it is connected.
         */
        'scopes' => [
            'https://graph.microsoft.com/Mail.ReadWrite',
            'https://graph.microsoft.com/Mail.Send',
            'https://graph.microsoft.com/User.Read',
            'offline_access',
        ],
    ],

];
