<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Attachments are now INDEXED at sync (guide §4.2), which the original columns could not hold.
 *
 * ⚠️ `mime_type` was 50 characters; an Excel packing list is
 * `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` — 65. `provider_attachment_id`
 * was 255, and a Graph attachment id is a base64 string that runs past 200 on long message ids.
 * `size_bytes` is what the chip shows, and what the 25 MB provider cap is checked against.
 *
 * `fetch_state` gains `remote` (listed, bytes never fetched — the lazy default) and `blocked`
 * (the virus scan refused it). It is a plain VARCHAR with no CHECK, so no DDL is needed for that.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_attachments', function (Blueprint $table) {
            $table->string('mime_type', 255)->change();
            $table->string('provider_attachment_id', 512)->nullable()->change();
            $table->unsignedBigInteger('size_bytes')->nullable()->after('mime_type');
        });
    }

    public function down(): void
    {
        Schema::table('email_attachments', function (Blueprint $table) {
            $table->dropColumn('size_bytes');
            $table->string('provider_attachment_id', 255)->nullable()->change();
            $table->string('mime_type', 50)->change();
        });
    }
};
