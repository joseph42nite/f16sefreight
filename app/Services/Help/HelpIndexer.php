<?php

namespace App\Services\Help;

use App\Services\AiUsageService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * A help document → sections → embeddings, stored in MySQL (user's choice, 2026-09-14).
 *
 * 🔴 SPLIT BY HEADING FIRST, then by length. A heading is a unit an F16s writer chose ("Entering an
 * arrival notice"), and a section that runs long is cut into overlapping pieces so no step falls
 * between two. Every piece carries its document title and heading path, so a piece read alone still
 * says what page and task it is about.
 */
class HelpIndexer
{
    /** About 700 tokens: long enough to hold a whole task, short enough that the match stays specific. */
    private const PIECE_CHARS = 2800;
    private const OVERLAP_CHARS = 300;

    public function __construct(private OpenRouterClient $client, private AiUsageService $usage)
    {
    }

    /** (Re)index one document. A failed embedding leaves it `not_indexed` with the reason. */
    public function index(int $documentId): void
    {
        $document = DB::table('help_documents')->find($documentId);
        $pieces = $this->pieces($document->title, $document->route, $document->content);

        try {
            $embedded = $this->client->embed(array_column($pieces, 'embed'));
        } catch (Throwable $e) {
            DB::table('help_documents')->where('id', $documentId)->update([
                'status' => 'not_indexed', 'error' => mb_substr($e->getMessage(), 0, 255), 'updated_at' => now(),
            ]);

            return;
        }

        DB::transaction(function () use ($documentId, $pieces, $embedded) {
            DB::table('help_chunks')->where('help_document_id', $documentId)->delete();

            foreach ($pieces as $i => $piece) {
                DB::table('help_chunks')->insert([
                    'help_document_id' => $documentId,
                    'position' => $i,
                    'heading' => mb_substr((string) $piece['heading'], 0, 255) ?: null,
                    'text' => $piece['text'],
                    'embedding' => pack('g*', ...$embedded['vectors'][$i]),
                    'created_at' => now(), 'updated_at' => now(),
                ]);
            }

            DB::table('help_documents')->where('id', $documentId)->update([
                'status' => 'indexed', 'error' => null, 'chunk_count' => count($pieces),
                'embedding_model' => $embedded['usage']['model'], 'updated_at' => now(),
            ]);
        });

        $this->usage->log($embedded['usage'], 'help_index');
        Cache::forget(HelpSearch::CACHE_KEY);
    }

    /**
     * @return array<int, array{heading: ?string, text: string, embed: string}>
     */
    public function pieces(string $title, ?string $route, string $content): array
    {
        $sections = [];
        $path = [];
        $buffer = [];
        $heading = null;

        $flush = function () use (&$sections, &$buffer, &$heading) {
            $text = trim(implode("\n", $buffer));
            if ($text !== '') {
                $sections[] = ['heading' => $heading, 'text' => $text];
            }
            $buffer = [];
        };

        foreach (explode("\n", $content) as $line) {
            if (preg_match('/^(#{1,3})\s+(.+)$/', $line, $m)) {
                $flush();
                $path = array_slice($path, 0, strlen($m[1]) - 1);
                $path[] = trim($m[2]);
                $heading = implode(' › ', $path);
                continue;
            }

            $buffer[] = $line;
        }

        $flush();

        $pieces = [];

        foreach ($sections as $section) {
            foreach ($this->split($section['text']) as $text) {
                $label = trim($title . ($section['heading'] ? ' › ' . $section['heading'] : ''));
                $pieces[] = [
                    'heading' => $section['heading'],
                    'text' => $text,
                    // What is embedded: the text with where it belongs, so "arrival notice" on the
                    // Jobs page matches a question asked on that page.
                    'embed' => $label . ($route ? " (page {$route})" : '') . "\n" . $text,
                ];
            }
        }

        return $pieces;
    }

    /** @return string[] */
    private function split(string $text): array
    {
        if (mb_strlen($text) <= self::PIECE_CHARS) {
            return [$text];
        }

        $out = [];
        $start = 0;
        $length = mb_strlen($text);

        while ($start < $length) {
            $piece = mb_substr($text, $start, self::PIECE_CHARS);

            // End on a paragraph or sentence where one is near, not mid-word.
            if ($start + self::PIECE_CHARS < $length) {
                $cut = max(mb_strrpos($piece, "\n\n") ?: 0, mb_strrpos($piece, '. ') ?: 0);
                if ($cut > self::PIECE_CHARS / 2) {
                    $piece = mb_substr($piece, 0, $cut + 1);
                }
            }

            $out[] = trim($piece);

            if ($start + mb_strlen($piece) >= $length) {
                break;
            }

            // The next piece starts a little before this one ended, so a step is never split in two.
            $start += max(mb_strlen($piece) - self::OVERLAP_CHARS, 1);
        }

        return array_values(array_filter($out));
    }
}
