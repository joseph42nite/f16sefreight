<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Blog bodies saved before they were cleaned on the way in (2026-11-15 frontend audit, FS6) are cleaned once here,
 * so the public page never prints one that was not. A body the cleaner leaves unchanged is not rewritten.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('blogs')) {
            return;
        }

        $body = new \App\Services\Blog\BlogBody();

        DB::table('blogs')->orderBy('id')->select(['id', 'content'])->chunkById(100, function ($rows) use ($body) {
            foreach ($rows as $row) {
                $clean = $body->clean($row->content);

                if ($clean !== trim((string) $row->content)) {
                    DB::table('blogs')->where('id', $row->id)->update(['content' => $clean]);
                }
            }
        });
    }

    public function down(): void
    {
        // What was removed is not kept, on purpose.
    }
};
