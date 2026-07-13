<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('openclaw_nonces', function (Blueprint $table) {
            $table->string('nonce')->primary();
            $table->timestamp('received_at')->useCurrent();
        });

        Schema::create('openclaw_pending_actions', function (Blueprint $table) {
            $table->id();
            $table->string('action_id')->unique();
            $table->string('event_type');
            $table->text('payload');
            $table->string('status')->default('pending'); // 'pending', 'accepted', 'rejected'
            $table->text('telegram_message_id')->nullable();
            $table->string('telegram_chat_id')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('resolved_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('openclaw_pending_actions');
        Schema::dropIfExists('openclaw_nonces');
    }
};
