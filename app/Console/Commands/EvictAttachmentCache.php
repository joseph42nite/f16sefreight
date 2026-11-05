<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Drop a mail attachment's cached bytes once `cache_expires_at` has passed (guide §4.7, GAPS #232).
 *
 *     php artisan attachments:evict-cache       daily
 *
 * Only the bytes go: the row stays, `fetch_state = 'evicted'`, and the next open fetches the file from the mailbox
 * again through `provider_attachment_id` (AttachmentStore) — scanned again on the way in.
 *
 * ⚠️ Never touches `job_documents`. An AWB, a BL or a delivery order we generated was never in anyone's mailbox, so
 * there is nothing to fetch it back from; those files are statutory and kept (GAPS #81).
 */
class EvictAttachmentCache extends Command
{
    protected $signature = 'attachments:evict-cache';

    protected $description = 'Drop cached mail attachment files past their keep date; the mailbox still has them';

    public function handle(): int
    {
        $evicted = 0;

        DB::table('email_attachments')
            ->where('fetch_state', 'cached')
            ->where('cache_expires_at', '<', now())
            ->orderBy('id')
            ->chunkById(500, function ($rows) use (&$evicted) {
                DB::table('email_attachments')->whereIn('id', $rows->pluck('id'))
                    ->update(['fetch_state' => 'evicted', 'file_path' => null, 'updated_at' => now()]);

                // Files after the rows: a row that says evicted with its file still on disk is harmless; the reverse
                // would be a cached row pointing at nothing.
                Storage::disk('local')->delete($rows->pluck('file_path')->filter()->all());

                $evicted += $rows->count();
            });

        $this->info("  {$evicted} cached attachment(s) evicted.");

        return self::SUCCESS;
    }
}
