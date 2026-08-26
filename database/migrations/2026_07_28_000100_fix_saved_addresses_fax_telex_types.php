<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * saved_addresses.fax / .telex were INTEGER. They hold neither.
 *
 * Fax numbers and telex answerbacks are alphanumeric — "+44 20 7946 0958",
 * "TLX123", numbers with meaningful leading zeros. An integer column strips the
 * zeros, rejects "+", spaces and hyphens, and rejects letters outright.
 *
 * The column was inconsistent with its own siblings in two directions:
 *   - saved_addresses.phone is varchar(20)
 *   - way_bill_addresses.ship_telex / cons_telex / also_telex are all varchar(20)
 *     and hold exactly the same kind of value
 *
 * SQLite hid this completely. Its loose typing stores "TLX123" in a column
 * declared INTEGER without complaint, so local dev and the test suite never
 * saw a problem. MySQL rejects it outright:
 *
 *     SQLSTATE[HY000]: 1366 Incorrect integer value: 'TLX123' for column 'telex'
 *
 * Found by WaybillRefactoringTest the first time the suite ran against MySQL 8
 * instead of SQLite.
 *
 * Widening int -> varchar preserves every existing value, so this is safe to
 * apply to production. Requires doctrine/dbal, which Laravel 9 needs for change().
 */
return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('saved_addresses')) {
            return;
        }

        Schema::table('saved_addresses', function (Blueprint $table) {
            $table->string('fax', 20)->nullable()->change();
            $table->string('telex', 20)->nullable()->change();
        });
    }

    public function down()
    {
        // Deliberately NOT reverted to integer: any alphanumeric value stored
        // since this migration ran would be destroyed by narrowing the column.
    }
};
