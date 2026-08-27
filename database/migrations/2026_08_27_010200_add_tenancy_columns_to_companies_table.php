<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * companies — ALTER only. This table is live (id, name, created_at, updated_at,
 * templates_config, in_testing_mode); Batch 1a adds the SaaS tenancy columns.
 *
 * `companies` stores PLATFORM TENANTS — the forwarding companies subscribing to F16s
 * OS — not their clients. Client companies live in `customers`, which is why `tier`
 * and the credit columns mean nothing there (database_relations_tree.md §1).
 *
 * ── NULL is meaningful on two of these, and only two ─────────────────────────
 * ocr_credits_monthly_allowance and ocr_credits_limit are NULL by default, and NULL
 * reads as "follow the tier default in config/f16s.php". A non-NULL value is a
 * deliberate superadmin override pinned to this tenant. That distinction is the whole
 * mechanism: an ordinary tenant's allowance lifts automatically on a tier upgrade,
 * while a negotiated allowance is never silently overwritten by one. Deliberately NO
 * SQL default on either — a default here would be a second home for a number that
 * already lives in config, and the two would drift.
 *
 * ── tier and ocr_credits_balance are NOT NULL, which the DDL leaves implicit ──
 * The DDL writes `tier VARCHAR(30) DEFAULT 'core'` without NOT NULL. Tightened here
 * on purpose: tier resolution has to be TOTAL — every user has a branch, therefore a
 * company, therefore a tier (implementation_guide.md §4.1.1) — and that guarantee is
 * what lets ProcessPdfOcrJob route without a "tenant with no tier" branch to invent.
 * A NULL tier would reintroduce exactly that case. Same reasoning for a NULL balance,
 * which is not a number and cannot be debited.
 *
 * ── deleted_at ───────────────────────────────────────────────────────────────
 * PRD.md §9.3 names companies among the six soft-deleting tables. The SoftDeletes
 * trait is NOT added to the model here — that is Step 2, and it must be read against
 * the UNIQUE-collision table in the schema doc first.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->string('tier', 30)->default('core')->after('name');
            $table->string('email_domain', 100)->nullable()->after('tier');

            $table->integer('ocr_credits_balance')->default(0)->after('email_domain');
            $table->integer('ocr_credits_monthly_allowance')->nullable()->after('ocr_credits_balance');
            $table->integer('ocr_credits_limit')->nullable()->after('ocr_credits_monthly_allowance');

            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropColumn([
                'tier',
                'email_domain',
                'ocr_credits_balance',
                'ocr_credits_monthly_allowance',
                'ocr_credits_limit',
            ]);
        });
    }
};
