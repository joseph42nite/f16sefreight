<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('air_way_bills')) {
            return;
        }
        Schema::table('air_way_bills', function (Blueprint $table) {
            if (!Schema::hasColumn('air_way_bills', 'as_agreed')) {
                $table->boolean('as_agreed')->nullable()->default(0);
            }
        });
    }

    public function down()
    {
        if (!Schema::hasTable('air_way_bills')) {
            return;
        }
        Schema::table('air_way_bills', function (Blueprint $table) {
            if (Schema::hasColumn('air_way_bills', 'as_agreed')) {
                $table->dropColumn('as_agreed');
            }
        });
    }
};
