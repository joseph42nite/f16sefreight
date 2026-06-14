<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('gst_ledger_entries', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('voucher_id');
            $table->string('voucher_type', 30);
            $table->string('voucher_no', 30);
            $table->date('voucher_date');
            $table->unsignedBigInteger('company_id');
            $table->decimal('cgst_rate', 5, 2)->default(0.00);
            $table->decimal('cgst_amount', 15, 2)->default(0.00);
            $table->decimal('sgst_rate', 5, 2)->default(0.00);
            $table->decimal('sgst_amount', 15, 2)->default(0.00);
            $table->decimal('igst_rate', 5, 2)->default(0.00);
            $table->decimal('igst_amount', 15, 2)->default(0.00);
            $table->decimal('total_tax', 15, 2)->default(0.00);
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('company_id')->references('id')->on('companies');
            $table->index(['voucher_type', 'voucher_id']);
        });
    }
    public function down() {
        Schema::dropIfExists('gst_ledger_entries');
    }
};
