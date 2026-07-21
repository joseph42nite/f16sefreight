<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Captures columns that already exist on the live MySQL house_way_bills table
 * (added by hand) but were never in a migration, so dev/test/fresh installs
 * lacked them — which left the HAWB PDF routes (GenerateHawbPdfController
 * selects the ho_ address columns and as_agreed) failing everywhere except
 * live. Same schema-drift capture pattern as the airline_address migration.
 */
return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('house_way_bills')) {
            return;
        }
        $stringColumns = ['ho_name', 'ho_address', 'ho_city', 'ho_pincode', 'ho_state', 'ho_country'];
        Schema::table('house_way_bills', function (Blueprint $table) use ($stringColumns) {
            foreach ($stringColumns as $column) {
                if (!Schema::hasColumn('house_way_bills', $column)) {
                    $table->string($column)->nullable();
                }
            }
            if (!Schema::hasColumn('house_way_bills', 'as_agreed')) {
                $table->boolean('as_agreed')->nullable();
            }
        });
    }

    public function down()
    {
        if (!Schema::hasTable('house_way_bills')) {
            return;
        }
        $columns = ['ho_name', 'ho_address', 'ho_city', 'ho_pincode', 'ho_state', 'ho_country', 'as_agreed'];
        Schema::table('house_way_bills', function (Blueprint $table) use ($columns) {
            foreach ($columns as $column) {
                if (Schema::hasColumn('house_way_bills', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
