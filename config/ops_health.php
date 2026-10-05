<?php

/*
 * PRD §7.3.4 G — the internal ops scorecard, measured but not yet scored (owner, 2026-10-05; GAPS #456).
 *
 * No weights and no penalty_scale here on purpose: the owner chooses them once 2–3 months of real numbers exist.
 * The minimums are the PRD's own guard rails.
 */
return [
    // Our own steps. Each step's length runs until the job's next status; the wait after "Sent to Airline" is the
    // airline's, not ours, and is not counted (owner, 2026-10-05).
    'our_steps' => ['Intake', 'AI Extraction', 'Verification', 'Generation', 'PDF Generated'],

    // A step counts for a client only with this many of their jobs through it, and a client needs this many such
    // steps before "days slower" is said at all (PRD §7.3.4 G).
    'min_step_observations' => 3,
    'min_steps' => 2,

    // Below this many jobs a rate is NULL (PRD guard rails: ≥ 5 shipments).
    'min_jobs' => 5,
];
