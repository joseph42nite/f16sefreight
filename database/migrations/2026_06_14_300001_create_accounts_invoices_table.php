<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('accounts_invoices', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->enum('transport_mode', ['air', 'sea']);
            $table->enum('type', ['invoice', 'debit_note', 'credit_note', 'brokerage', 'consol_invoice']);
            $table->string('invoice_no')->unique();
            $table->date('document_date');
            $table->unsignedBigInteger('job_id');
            $table->unsignedBigInteger('client_id');
            $table->string('billed_party_role', 20)->default('client');
            $table->string('currency', 3);
            $table->decimal('exchange_rate', 12, 6)->default(1.000000);
            $table->text('billing_address')->nullable();
            $table->string('tax_registration_no', 20)->nullable();
            $table->string('payment_terms', 20)->nullable();
            $table->decimal('subtotal', 15, 2);
            $table->decimal('tax_amount', 15, 2);
            $table->decimal('grand_total', 15, 2);
            $table->string('status')->default('draft');
            $table->boolean('is_posted')->default(false);
            $table->date('due_date');
            $table->unsignedBigInteger('created_by');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('job_id')->references('id')->on('jobs');
            $table->foreign('client_id')->references('id')->on('companies');
            $table->foreign('created_by')->references('id')->on('users');
        });
    }
    public function down() {
        Schema::dropIfExists('accounts_invoices');
    }
};
