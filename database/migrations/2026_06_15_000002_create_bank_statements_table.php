<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('bank_statements', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->string('plaid_transaction_id', 100)->unique()->nullable();
            $table->date('booking_date');
            $table->date('value_date');
            $table->decimal('amount', 15, 2);
            $table->text('sender_reference');
            $table->enum('status', ['unreconciled', 'reconciled', 'flagged'])->default('unreconciled');
            $table->unsignedBigInteger('matched_invoice_id')->nullable();
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('matched_invoice_id')->references('id')->on('accounts_invoices')->onDelete('set null');
            $table->index(['agent_id', 'status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('bank_statements');
    }
};
