<?php

use App\Support\MailSubject;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * `email_messages.subject_key` — the subject without its Re:/Fwd: prefixes, hashed, with an index.
 *
 * Filing a mail that the provider's thread id and the reply chain could not place meant reading the branch's last
 * 30 days of mail to compare subjects (2026-11-10 audit §5). With the key that is one indexed lookup.
 *
 * ⚠️ A row whose key is NULL is still found the old way (ThreadMatcher), so a row written by something that does not
 * know about the column is slower to match, never missed.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_messages', function (Blueprint $table) {
            $table->char('subject_key', 32)->nullable()->after('subject');
            $table->index(['agent_id', 'subject_key', 'received_at'], 'email_messages_subject_key_index');
        });

        DB::table('email_messages')->whereNotNull('subject')->orderBy('id')
            ->chunkById(1000, function ($rows) {
                foreach ($rows as $row) {
                    if (($key = MailSubject::key($row->subject)) !== null) {
                        DB::table('email_messages')->where('id', $row->id)->update(['subject_key' => $key]);
                    }
                }
            });
    }

    public function down(): void
    {
        Schema::table('email_messages', function (Blueprint $table) {
            $table->dropIndex('email_messages_subject_key_index');
            $table->dropColumn('subject_key');
        });
    }
};
