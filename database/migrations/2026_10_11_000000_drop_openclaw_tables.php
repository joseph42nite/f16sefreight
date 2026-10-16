<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * OpenClaw is removed (owner, 2026-10-11: "the bot is OpenMaus — remove the OpenClaw option completely"). Its replay
 * guard and its queue of blog actions waiting for a Telegram approval go with it. Rolling back recreates both tables
 * empty: what was waiting in them is not kept.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::dropIfExists('openclaw_pending_actions');
        Schema::dropIfExists('openclaw_nonces');
    }

    public function down()
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
            $table->string('status')->default('pending');
            $table->text('telegram_message_id')->nullable();
            $table->string('telegram_chat_id')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('resolved_at')->nullable();
        });
    }
};
