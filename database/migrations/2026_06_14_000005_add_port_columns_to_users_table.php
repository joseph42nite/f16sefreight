<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Add port_of_loading_id and pima-related port columns to users table.
     * References the `ports` table which must exist first (000004).
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'default_port_id')) {
                $table->unsignedBigInteger('default_port_id')->nullable()->after('pima_address');
                $table->foreign('default_port_id')->references('id')->on('ports')->onDelete('set null');
            }
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'default_port_id')) {
                $table->dropForeign(['default_port_id']);
                $table->dropColumn('default_port_id');
            }
        });
    }
};
