<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * The DSR / MSR / YSR funnel views — Batch 1d.
 *
 * Views rather than tables because the funnel is a pure re-shape of `enquiries` with
 * no derived state to store. There is nothing a nightly job could compute that the
 * view does not already express, and a materialised copy would only add a way for the
 * funnel to disagree with the enquiries it describes.
 *
 * ═══ 🔴 EXISTS, NEVER A LEFT JOIN ═══════════════════════════════════════════
 * One enquiry may carry SEVERAL email threads. `LEFT JOIN email_threads` fans the rows
 * out and inflates `COUNT(*)` — silently corrupting the conversion DENOMINATOR, which
 * makes every conversion rate look better than it is. The schema doc records the test:
 * 3 enquiries across 4 threads count 3 raised / 2 replied, where a LEFT JOIN reported 4.
 *
 * ═══ 🔴 NULL, NEVER 0%, ON AN EMPTY DENOMINATOR (PRD.md §7.1) ═══════════════
 * "No enquiries this period" and "every enquiry lost" are opposite facts. Rendering
 * both as 0% tells a sales manager the team failed when in truth nothing came in.
 *
 * ═══ ⚠️ ysr_funnel_view EMITS BOTH YEAR BASES ═══════════════════════════════
 * Fiscal (April–March, matching EnquirySequenceService) and calendar, tagged by
 * `period_basis`. Neither is hard-coded, so a UI toggle is a WHERE clause rather than
 * a schema change. **`period_basis` MUST be in every WHERE clause** — query without it
 * and every row returns twice under two year labels, silently doubling every count.
 */
return new class extends Migration
{
    /**
     * The shared body. Only the period expression differs between grains, and it must
     * appear in BOTH the SELECT and the GROUP BY — a mismatch there is the classic way
     * these views silently return one row per enquiry instead of one per period.
     */
    private function funnel(string $periodExpr, string $grain, ?string $basis = null): string
    {
        $basisColumn = $basis === null ? '' : "        '{$basis}' AS period_basis,\n";

        return "
    SELECT
        e.agent_id,
        e.transport_mode,
{$basisColumn}        {$periodExpr} AS period_start,
        '{$grain}' AS period_grain,
        COUNT(*) AS enquiries_raised,
        -- EXISTS, never a LEFT JOIN. See the class docblock.
        SUM(CASE WHEN EXISTS (SELECT 1 FROM email_threads t
                              WHERE t.enquiry_id = e.id
                                AND t.first_response_at IS NOT NULL)
                 THEN 1 ELSE 0 END) AS enquiries_replied,
        SUM(CASE WHEN e.status IN ('new','quoted','awaiting_client') THEN 1 ELSE 0 END) AS enquiries_pending,
        SUM(CASE WHEN e.status = 'converted' THEN 1 ELSE 0 END) AS enquiries_converted,
        SUM(CASE WHEN e.status = 'lost' THEN 1 ELSE 0 END) AS enquiries_lost,
        -- NULL, never 0%, when the denominator is empty.
        CASE WHEN COUNT(*) = 0 THEN NULL
             ELSE ROUND(SUM(CASE WHEN e.status = 'converted' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2)
        END AS conversion_rate_pct
    FROM enquiries e
    -- Soft-deleted enquiries must not inflate the denominator.
    WHERE e.deleted_at IS NULL
    GROUP BY e.agent_id, e.transport_mode, {$periodExpr}";
    }

    public function up()
    {
        DB::statement('DROP VIEW IF EXISTS dsr_funnel_view');
        DB::statement('CREATE VIEW dsr_funnel_view AS' . $this->funnel('DATE(e.created_at)', 'day'));

        DB::statement('DROP VIEW IF EXISTS msr_funnel_view');
        DB::statement('CREATE VIEW msr_funnel_view AS'
            . $this->funnel("DATE_FORMAT(e.created_at, '%Y-%m-01')", 'month'));

        // Both bases, UNION ALL, tagged. The fiscal expression returns the April 1st
        // that OPENS the fiscal year, so a yearly report and a document number agree:
        // a March-2026 enquiry yields 2025-04-01 and numbers as -25-. For Jan–Mar the
        // two bases differ, and that is exactly where reconciliation arguments start.
        DB::statement('DROP VIEW IF EXISTS ysr_funnel_view');
        DB::statement(
            'CREATE VIEW ysr_funnel_view AS'
            . $this->funnel("DATE_FORMAT(e.created_at, '%Y-01-01')", 'year', 'calendar')
            . "\n    UNION ALL"
            . $this->funnel("DATE_FORMAT(DATE_SUB(e.created_at, INTERVAL 3 MONTH), '%Y-04-01')", 'year', 'fiscal')
        );
    }

    public function down()
    {
        foreach (['dsr_funnel_view', 'msr_funnel_view', 'ysr_funnel_view'] as $view) {
            DB::statement("DROP VIEW IF EXISTS {$view}");
        }
    }
};
