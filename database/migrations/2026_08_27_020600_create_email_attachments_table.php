<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * email_attachments — cached attachment metadata, not permanent storage.
 *
 * ── The cache can be empty and the row still useful ─────────────────────────
 * file_path is the S3 key WHILE cached and NULL once evicted; provider_attachment_id
 * (Gmail attachmentId / Graph attachment id) is the RE-FETCH key. That pairing is the
 * whole design: attachments age out of local storage after ~90 days, and the row keeps
 * enough to pull the file back from the provider on demand.
 * fetch_state distinguishes the three real cases — cached | evicted | unavailable —
 * because "we deleted our copy" and "the provider no longer has it" need different UI.
 *
 * ── Cascade on delete ───────────────────────────────────────────────────────
 * An attachment has no meaning without its message. Deleting the mailbox connection
 * cascades to messages, which cascades to here.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::create('email_attachments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('email_message_id');

            $table->string('filename', 255);
            $table->string('file_path', 255)->nullable();              // S3 key while cached
            $table->string('provider_attachment_id', 255)->nullable(); // re-fetch key
            $table->timestamp('cache_expires_at')->nullable();
            $table->string('fetch_state', 20)->default('cached');
            $table->string('mime_type', 50);

            $table->timestamps();

            $table->foreign('email_message_id')->references('id')->on('email_messages')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('email_attachments');
    }
};
