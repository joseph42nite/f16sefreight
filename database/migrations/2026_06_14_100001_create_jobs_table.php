<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('jobs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->enum('transport_mode', ['air', 'sea']);
            $table->enum('direction', ['export', 'import'])->default('export');
            $table->string('enquiry_no')->unique();
            $table->string('execution_job_no')->unique()->nullable();
            $table->unsignedBigInteger('client_id')->nullable();
            $table->unsignedBigInteger('operator_id')->nullable();
            $table->unsignedBigInteger('job_owner_id')->nullable();
            $table->unsignedBigInteger('doc_user_id')->nullable();
            $table->enum('status', ['Intake', 'AI Extraction', 'Verification', 'Generation', 'PDF Generated', 'Sent to Airline', 'Airline Confirmed', 'Completed', 'Lost'])->default('Intake');
            $table->enum('lost_reason', ['rates_high', 'delay_in_response', 'client_cancelled', 'capacity_issue', 'other'])->nullable();
            $table->string('lost_reason_custom')->nullable();
            $table->timestamp('lost_at')->nullable();
            $table->unsignedBigInteger('parent_job_id')->nullable();
            $table->boolean('is_sub_shipment')->default(false);
            $table->boolean('is_consolidation')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('client_id')->references('id')->on('companies');
            $table->foreign('operator_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('job_owner_id')->references('id')->on('users');
            $table->foreign('doc_user_id')->references('id')->on('users');
            $table->foreign('parent_job_id')->references('id')->on('jobs');
        });
    }
    public function down() {
        Schema::dropIfExists('jobs');
    }
};
