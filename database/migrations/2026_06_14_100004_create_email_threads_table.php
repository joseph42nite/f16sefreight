<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('email_threads', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->string('thread_key')->unique();
            $table->string('subject')->nullable();
            $table->timestamp('latest_message_received_at')->index();
            $table->json('participant_emails');
            $table->enum('status', ['unread', 'read', 'replied', 'archived'])->default('unread');
            $table->unsignedBigInteger('assigned_operator_id')->nullable();
            $table->unsignedBigInteger('job_id')->nullable();
            $table->timestamp('first_reply_at')->nullable();
            $table->timestamp('first_triage_at')->nullable();
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('assigned_operator_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('set null');
            $table->index(['agent_id', 'status', 'latest_message_received_at'], 'threads_tenant_status_received_index');
        });
    }
    public function down() {
        Schema::dropIfExists('email_threads');
    }
};
