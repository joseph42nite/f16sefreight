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
        if (Schema::hasTable('companies') && !Schema::hasColumn('companies', 'in_testing_mode')) {
            Schema::table('companies', function (Blueprint $table) {
                $table->boolean('in_testing_mode')->default(false)->nullable();
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
        if (Schema::hasTable('companies') && Schema::hasColumn('companies', 'in_testing_mode')) {
            Schema::table('companies', function (Blueprint $table) {
                $table->dropColumn('in_testing_mode');
            });
        }
    }
};
