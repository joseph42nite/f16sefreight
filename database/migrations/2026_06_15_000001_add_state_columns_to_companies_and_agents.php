<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->string('billing_state', 100)->nullable()->after('name');
        });

        Schema::table('agents_info', function (Blueprint $table) {
            $table->string('agent_state', 100)->nullable()->after('ho_state');
        });
    }

    public function down()
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('billing_state');
        });

        Schema::table('agents_info', function (Blueprint $table) {
            $table->dropColumn('agent_state');
        });
    }
};
