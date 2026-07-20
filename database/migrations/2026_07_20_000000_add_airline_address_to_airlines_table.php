<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('airlines') && !Schema::hasColumn('airlines', 'airline_address')) {
            Schema::table('airlines', function (Blueprint $table) {
                $table->text('airline_address')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('airlines') && Schema::hasColumn('airlines', 'airline_address')) {
            Schema::table('airlines', function (Blueprint $table) {
                $table->dropColumn('airline_address');
            });
        }
    }
};
