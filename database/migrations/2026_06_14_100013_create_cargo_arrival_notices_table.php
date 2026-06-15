<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('cargo_arrival_notices', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('job_id')->unique();
            $table->string('can_no', 30)->unique()->index();
            $table->date('document_date');
            $table->integer('free_storage_days')->default(2);
            $table->date('storage_charges_start_date')->nullable();
            $table->timestamp('sent_to_consignee_at')->nullable();
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('cargo_arrival_notices');
    }
};
