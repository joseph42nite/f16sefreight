<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Mail is deleted three months after a conversation's last message (user, 2026-09-16: "delete mail threads and
 * history but keep other figures that'll be used for internal analysis"). Two things lived only on the mail:
 *   - how long the client waited for the first reply — now kept on the enquiry (`first_reply_minutes`)
 *   - a person's classification corrections — they carry their own subject, sender and domain, so they keep
 *     teaching the rules; only their link to the deleted conversation goes (set to NULL)
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('enquiries', function (Blueprint $table) {
            $table->unsignedInteger('first_reply_minutes')->nullable()->after('status');
        });

        Schema::table('email_classification_overrides', function (Blueprint $table) {
            $table->dropForeign(['email_thread_id']);
        });
        Schema::table('email_classification_overrides', function (Blueprint $table) {
            $table->unsignedBigInteger('email_thread_id')->nullable()->change();
            $table->foreign('email_thread_id')->references('id')->on('email_threads')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('email_classification_overrides', function (Blueprint $table) {
            $table->dropForeign(['email_thread_id']);
        });
        Schema::table('email_classification_overrides', function (Blueprint $table) {
            $table->unsignedBigInteger('email_thread_id')->nullable(false)->change();
            $table->foreign('email_thread_id')->references('id')->on('email_threads');
        });

        Schema::table('enquiries', function (Blueprint $table) {
            $table->dropColumn('first_reply_minutes');
        });
    }
};
