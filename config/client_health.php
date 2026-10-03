<?php

/*
 * The Composite Client Health Score — PRD §7.3.4 H. Weights from the PRD, kept here so they are tuned in config, not
 * code. They sum to exactly 1.00; a component with too little data is dropped and the rest re-weighted to 1.
 */
return [
    'weights' => [
        'momentum' => 0.30,   // B — volume trend
        'churn'    => 0.25,   // A — rhythm band
        'win_rate' => 0.20,   // C — converted ÷ closed enquiries
        'payment'  => 0.15,   // the client's payment report card (GAPS #443, owner 2026-10-03)
        'ops'      => 0.10,   // G — internal ops scorecard (nothing computes it yet: always dropped)
    ],

    // Fewer components than this with enough data ⇒ no score ("—"). Absent evidence is not bad news.
    'min_components' => 3,

    'churn_bands' => ['LOW' => 1.0, 'WATCH' => 0.67, 'AT_RISK' => 0.33, 'DORMANT' => 0.0],
];
