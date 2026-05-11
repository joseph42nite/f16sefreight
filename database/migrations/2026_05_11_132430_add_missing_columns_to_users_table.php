<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMissingColumnsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'can_send')) {
                $table->boolean('can_send')->default(true)->after('origin_airport_code');
            }
            if (!Schema::hasColumn('users', 'pima_address')) {
                $table->string('pima_address', 255)->nullable()->after('can_send');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $cols = [];
            if (Schema::hasColumn('users', 'can_send')) {
                $cols[] = 'can_send';
            }
            if (Schema::hasColumn('users', 'pima_address')) {
                $cols[] = 'pima_address';
            }
            if (!empty($cols)) {
                $table->dropColumn($cols);
            }
        });
    }
}
