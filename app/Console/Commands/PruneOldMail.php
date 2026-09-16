<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Delete mail three months after a conversation's last message (user, 2026-09-16: "mails will be saved for 3 months
 * only … if it's too old they can check their Outlook"; "delete mail threads and history but keep other figures that
 * will be used for internal analysis").
 *
 *     php artisan mail:prune            nightly
 *
 * Gone: the conversation, its messages, their attachments (and the cached files), its client-update history and the
 * bell notices pointing at it. Kept: everything the figures are built from — enquiries, jobs, client contacts, sales
 * snapshots, AI usage — plus the time to first reply, copied onto the enquiry first, and a person's classification
 * corrections, which keep teaching the rules without their conversation.
 *
 * ⚠️ A conversation still in use is not old: it is judged by its LATEST message, so a thread that started four months
 * ago and got a reply last week stays.
 */
class PruneOldMail extends Command
{
    protected $signature = 'mail:prune {--months=3 : how long mail is kept after a conversation\'s last message}';

    protected $description = 'Delete mail older than three months, keeping the figures used for analysis';

    public function handle(): int
    {
        $cutoff = now()->subMonths((int) $this->option('months'));
        $deleted = 0;

        DB::table('email_threads')->where('latest_message_received_at', '<', $cutoff)
            ->orderBy('id')
            ->chunkById(200, function ($threads) use (&$deleted) {
                $this->keepFirstReplyTimes($threads);

                $keys = $threads->pluck('thread_key');
                $ids = $threads->pluck('id');
                $messageIds = DB::table('email_messages')->whereIn('thread_key', $keys)->pluck('id');

                DB::transaction(function () use ($keys, $ids, $messageIds) {
                    $files = DB::table('email_attachments')->whereIn('email_message_id', $messageIds)->whereNotNull('file_path')->pluck('file_path');
                    DB::table('email_attachments')->whereIn('email_message_id', $messageIds)->delete();
                    DB::table('email_messages')->whereIn('id', $messageIds)->delete();
                    DB::table('notifications')->whereIn(DB::raw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.thread_id'))"), $ids->map(fn ($id) => (string) $id))->delete();
                    DB::table('email_threads')->whereIn('id', $ids)->delete();

                    // Files last, once the rows are gone for certain.
                    DB::afterCommit(fn () => Storage::disk('local')->delete($files->all()));
                });

                $deleted += $ids->count();
            });

        $this->info("  {$deleted} conversation(s) older than {$this->option('months')} months deleted.");

        return self::SUCCESS;
    }

    /** How long the client waited for the first reply, kept on the enquiry before the mail that measured it goes. */
    private function keepFirstReplyTimes($threads): void
    {
        foreach ($threads->whereNotNull('enquiry_id')->whereNotNull('first_response_at') as $thread) {
            $firstIn = DB::table('email_messages')->where('thread_key', $thread->thread_key)->where('direction', 'inbound')->min('received_at');

            if ($firstIn !== null) {
                DB::table('enquiries')->where('id', $thread->enquiry_id)->whereNull('first_reply_minutes')->update([
                    'first_reply_minutes' => max(0, (int) round((strtotime($thread->first_response_at) - strtotime($firstIn)) / 60)),
                ]);
            }
        }
    }
}
