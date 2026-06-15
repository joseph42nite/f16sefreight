<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('manifest_filings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('job_id');
            $table->string('filing_reference', 50)->nullable()->index();
            $table->string('customs_house_code', 6)->nullable();
            $table->string('transaction_status', 20)->default('Pending'); // Submitted, Received, Pending
            $table->string('transport_mode', 10)->default('air'); // air or sea
            $table->date('filing_date')->nullable();
            $table->text('response_payload')->nullable();
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
            $table->index(['agent_id', 'transaction_status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('manifest_filings');
    }
};
