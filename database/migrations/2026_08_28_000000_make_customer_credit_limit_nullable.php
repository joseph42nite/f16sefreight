<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * customers.credit_limit: NOT NULL DEFAULT 0.00 -> NULLABLE.
 *
 * 🔴 **NULL is not zero, and here the difference decides whether cargo moves.**
 *
 * `2026_08_27_010400` wrote this column as `->default(0.00)`, which Laravel renders
 * NOT NULL. The DDL in `database_relations_tree.md` says `DECIMAL(15,2) DEFAULT 0.00`
 * with no NOT NULL — i.e. nullable — and that difference is not cosmetic:
 *
 *   NULL  no credit limit has been configured for this client yet
 *   0.00  this client is allowed ZERO credit — every shipment is blocked
 *
 * With the column NOT NULL, **every customer onboarded without an explicit limit lands
 * at 0.00 and is instantly credit-blocked**, which reads to the desk as the credit gate
 * malfunctioning rather than as missing configuration. Found 2026-08-28 when a seed
 * omitting the field failed outright.
 *
 * This is the same rule `ui_ux_guide.md` §4.1 applies to display ("NULL is not zero —
 * render an em dash"), applied one layer down: the storage has to be able to express
 * "not set" before the UI can render it.
 *
 * ⚠️ **Existing 0.00 rows are left alone.** They are indistinguishable from a deliberate
 * zero, and guessing which were which would be inventing data. Only the column's
 * capability changes.
 *
 * The credit gate must therefore treat NULL as "no limit configured" — decide explicitly
 * whether that permits or blocks (§6 of the PRD) rather than letting `null <= x` decide
 * it by coercion.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->decimal('credit_limit', 15, 2)->nullable()->default(null)->change();
        });
    }

    public function down()
    {
        // Restoring NOT NULL requires a value for every NULL row; 0.00 is the only
        // available choice and it is the very ambiguity this migration removed.
        Schema::table('customers', function (Blueprint $table) {
            $table->decimal('credit_limit', 15, 2)->nullable(false)->default(0.00)->change();
        });
    }
};
