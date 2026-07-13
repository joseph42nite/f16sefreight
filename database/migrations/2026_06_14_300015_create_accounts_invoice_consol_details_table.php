<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('accounts_invoice_consol_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('invoice_id')->unique();
            $table->decimal('profit_share_ratio', 5, 2)->default(0.00);
            $table->unsignedBigInteger('partner_agent_id');
            $table->timestamps();

            $table->foreign('invoice_id')->references('id')->on('accounts_invoices')->onDelete('cascade');
            $table->foreign('partner_agent_id')->references('id')->on('companies');
        });
    }
    public function down() {
        Schema::dropIfExists('accounts_invoice_consol_details');
    }
};
