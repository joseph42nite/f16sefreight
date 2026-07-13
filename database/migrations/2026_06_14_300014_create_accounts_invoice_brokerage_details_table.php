<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('accounts_invoice_brokerage_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('invoice_id')->unique();
            $table->enum('brokerage_basis', ['percentage_of_freight', 'flat_rate', 'per_kg', 'per_container']);
            $table->decimal('commission_rate', 8, 4)->default(0.0000);
            $table->decimal('base_freight_cost', 15, 2)->default(0.00);
            $table->timestamps();

            $table->foreign('invoice_id')->references('id')->on('accounts_invoices')->onDelete('cascade');
        });
    }
    public function down() {
        Schema::dropIfExists('accounts_invoice_brokerage_details');
    }
};
