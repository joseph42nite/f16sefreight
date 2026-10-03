<?php

namespace App\Console\Commands;

use App\Services\Help\HelpDocumentReader;
use App\Services\Help\HelpIndexer;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * `php artisan help:load-bundled` — the help documents that ship with the product (docs/help), put into the in-app
 * Help library so the assistant can answer from them without anyone uploading them by hand (owner, 2026-09-29: "put
 * the guide in the UI"; GAPS #445).
 *
 * Idempotent: a document already loaded is replaced only when its text changed. Superadmin can still re-upload or
 * delete it like any other. Indexing needs the embedding model (OPENROUTER_API_KEY); without it the document is kept
 * `not_indexed` with the reason, and a later run indexes it.
 */
class LoadBundledHelp extends Command
{
    protected $signature = 'help:load-bundled';

    protected $description = 'Load the help documents that ship in docs/help into the in-app Help library';

    /** file in docs/help → the title the assistant cites and the portal page it belongs to. */
    public const DOCUMENTS = [
        'paying-suppliers-from-your-bank.md' => ['Paying suppliers from your bank', '/money-out'],
    ];

    public function handle(HelpDocumentReader $reader, HelpIndexer $indexer): int
    {
        foreach (self::DOCUMENTS as $file => [$title, $route]) {
            $path = base_path('docs/help/' . $file);
            $content = $reader->read($path, 'md');
            $row = ['title' => $title, 'route' => $route, 'filename' => $file, 'format' => 'md', 'content' => $content,
                'content_hash' => hash('sha256', $content), 'updated_at' => now()];

            $existing = DB::table('help_documents')->where('filename', $file)->where('route', $route)->first();

            if ($existing !== null && $existing->content_hash === $row['content_hash'] && $existing->status === 'indexed') {
                $this->line("{$title}: up to date");

                continue;
            }

            $id = $existing->id ?? DB::table('help_documents')->insertGetId($row + ['created_at' => now()]);
            if ($existing !== null) {
                DB::table('help_documents')->where('id', $id)->update($row);
            }

            $indexer->index($id);
            $this->line("{$title}: " . DB::table('help_documents')->where('id', $id)->value('status'));
        }

        return self::SUCCESS;
    }
}
