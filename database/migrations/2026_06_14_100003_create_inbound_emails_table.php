<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('inbound_emails', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('mailbox_connection_id');
            $table->string('message_id')->unique();
            $table->string('thread_key')->index();
            $table->string('from');
            $table->string('to');
            $table->string('subject')->nullable();
            $table->longText('body_text')->nullable();
            $table->longText('body_html')->nullable();
            $table->timestamp('received_at');
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('mailbox_connection_id')->references('id')->on('mailbox_connections')->onDelete('cascade');
        });
    }
    public function down() {
        Schema::dropIfExists('inbound_emails');
    }
};
