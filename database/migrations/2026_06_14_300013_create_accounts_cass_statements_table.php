<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('accounts_cass_statements', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('airline_id');
            $table->string('awb_number')->index();
            $table->string('billing_period');
            $table->decimal('cass_gross_weight', 10, 3)->default(0.000);
            $table->decimal('cass_rate', 10, 4)->default(0.0000);
            $table->decimal('cass_freight_charges', 15, 2)->default(0.00);
            $table->decimal('cass_other_charges', 15, 2)->default(0.00);
            $table->decimal('grand_total', 15, 2)->default(0.00);
            $table->enum('reconciliation_status', ['unmatched', 'matched', 'rate_mismatch', 'weight_mismatch'])->default('unmatched');
            $table->unsignedBigInteger('matched_voucher_id')->nullable();
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('airline_id')->references('id')->on('airlines');
            $table->foreign('matched_voucher_id')->references('id')->on('accounts_purchase_vouchers')->onDelete('set null');
        });
    }
    public function down() {
        Schema::dropIfExists('accounts_cass_statements');
    }
};
