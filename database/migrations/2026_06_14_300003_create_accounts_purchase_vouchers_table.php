<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('accounts_purchase_vouchers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->string('voucher_no')->unique();
            $table->date('document_date');
            $table->unsignedBigInteger('job_id');
            $table->unsignedBigInteger('vendor_id');
            $table->string('vendor_invoice_no', 50)->nullable();
            $table->date('vendor_invoice_date')->nullable();
            $table->string('currency', 3);
            $table->decimal('exchange_rate', 12, 6)->default(1.000000);
            $table->decimal('subtotal', 15, 2);
            $table->decimal('tax_amount', 15, 2);
            $table->decimal('grand_total', 15, 2);
            $table->string('status')->default('draft');
            $table->boolean('is_posted')->default(false);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('job_id')->references('id')->on('jobs');
            $table->foreign('vendor_id')->references('id')->on('companies');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });
    }
    public function down() {
        Schema::dropIfExists('accounts_purchase_vouchers');
    }
};
