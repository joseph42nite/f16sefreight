<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('accounts_invoice_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('invoice_id');
            $table->unsignedBigInteger('house_job_id')->nullable();
            $table->string('charge_type', 50);
            $table->string('description');
            $table->decimal('qty', 10, 2)->default(1.00);
            $table->decimal('unit_rate', 15, 2);
            $table->decimal('tax_rate', 5, 2)->default(0.00);
            $table->decimal('subtotal', 15, 2);
            $table->decimal('tax_amount', 15, 2);
            $table->decimal('total_amount', 15, 2);
            $table->timestamps();

            $table->foreign('invoice_id')->references('id')->on('accounts_invoices')->onDelete('cascade');
            $table->foreign('house_job_id')->references('id')->on('jobs')->onDelete('set null');
        });
    }
    public function down() {
        Schema::dropIfExists('accounts_invoice_items');
    }
};
