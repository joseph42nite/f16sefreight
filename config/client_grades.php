<?php

/*
 * How a client's payment report card is graded (GAPS #443). Worked out in PHP from invoices and receipts — PRD §7.3.4:
 * every figure reproducible "in plain SQL and PHP without an LLM". Jev reads the client's MAIL for what the figures
 * cannot see (a dispute, a promise), and a person confirms it.
 *
 * ⚠️ These are STARTING values, chosen to be simple and explainable, not measured. Tune them here once a few months of
 * cards exist — every card keeps its figures, so a change can be checked against history.
 */
return [
    // The window: bills that fell due in the last N months. Three covers a 60-day cycle and still moves month to month.
    'window_months' => 3,

    // Fewer bills than this in the window → no grade. Two bills cannot tell a habit from an accident.
    'min_bills' => 3,

    // score = 100 × on-time share − average days late (capped) − a penalty if anything is very old.
    'late_days_cap' => 40,
    'very_old_days' => 60,
    'very_old_penalty' => 15,

    // Score → grade, highest first.
    'grades' => ['A' => 85, 'B' => 70, 'C' => 50, 'D' => 0],

    // A move of at least this many points against last month is "better" or "worse".
    'trend_points' => 5,

    // Terms when a client has none on file (the snapshot engine's default too).
    'default_terms_days' => 30,
];
