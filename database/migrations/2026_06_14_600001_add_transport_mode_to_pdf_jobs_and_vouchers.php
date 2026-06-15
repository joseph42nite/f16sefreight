<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('pdf_processing_jobs', function (Blueprint $table) {
            if (!Schema::hasColumn('pdf_processing_jobs', 'transport_mode')) {
                $table->enum('transport_mode', ['air', 'sea'])->default('air')->after('direction');
            }
        });

        Schema::table('accounts_purchase_vouchers', function (Blueprint $table) {
            if (!Schema::hasColumn('accounts_purchase_vouchers', 'transport_mode')) {
                $table->enum('transport_mode', ['air', 'sea'])->default('air')->after('agent_id');
            }
        });
    }

    public function down()
    {
        Schema::table('pdf_processing_jobs', function (Blueprint $table) {
            if (Schema::hasColumn('pdf_processing_jobs', 'transport_mode')) {
                $table->dropColumn('transport_mode');
            }
        });

        Schema::table('accounts_purchase_vouchers', function (Blueprint $table) {
            if (Schema::hasColumn('accounts_purchase_vouchers', 'transport_mode')) {
                $table->dropColumn('transport_mode');
            }
        });
    }
};
