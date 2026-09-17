<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** A picture under the signature — a logo, a scanned sign (user, 2026-09-17). */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mailbox_connections', function (Blueprint $table) {
            $table->string('signature_image_path', 255)->nullable()->after('signature_source');
            $table->string('signature_image_mime', 50)->nullable()->after('signature_image_path');
        });
    }

    public function down(): void
    {
        Schema::table('mailbox_connections', function (Blueprint $table) {
            $table->dropColumn(['signature_image_path', 'signature_image_mime']);
        });
    }
};
