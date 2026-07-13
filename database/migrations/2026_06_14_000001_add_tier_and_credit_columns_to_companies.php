<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('companies', function (Blueprint $table) {
            $table->string('tier', 20)->default('viper_core')->after('name');
            $table->decimal('credit_limit', 15, 2)->default(0.00)->after('tier');
            $table->decimal('credit_balance', 15, 2)->default(0.00)->after('credit_limit');
        });
    }
    public function down() {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['tier', 'credit_limit', 'credit_balance']);
        });
    }
};
