<?php

namespace App\Services\Help;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * The nearest help sections to a question, compared in PHP (vectors in MySQL, user's choice).
 *
 * ⚠️ Every section is compared on every question. That is right for a help library — a few thousand
 * sections at 1,024 dimensions is a few million multiplications — and wrong for millions of rows;
 * GAPS records where to move if the library ever grows that large.
 */
class HelpSearch
{
    public const CACHE_KEY = 'help:vectors';

    /** A section on the page the user is looking at is preferred, by this much. */
    private const SAME_PAGE_BONUS = 0.05;

    /**
     * @param  float[]  $vector  unit length
     * @return array<int, array{id: int, document_id: int, title: string, route: ?string, heading: ?string, text: string, score: float}>
     */
    public function nearest(array $vector, ?string $route, int $limit = 6): array
    {
        $scored = [];

        foreach ($this->vectors() as $id => [$documentId, $docRoute, $packed]) {
            $other = unpack('g*', $packed);
            $score = 0.0;
            $i = 0;

            foreach ($other as $value) {
                $score += $value * ($vector[$i++] ?? 0.0);
            }

            if ($route && $docRoute && str_starts_with($route, $docRoute)) {
                $score += self::SAME_PAGE_BONUS;
            }

            $scored[$id] = $score;
        }

        arsort($scored);
        $top = array_slice($scored, 0, $limit, true);

        if ($top === []) {
            return [];
        }

        $rows = DB::table('help_chunks as c')
            ->join('help_documents as d', 'd.id', '=', 'c.help_document_id')
            ->whereIn('c.id', array_keys($top))
            ->get(['c.id', 'c.help_document_id', 'd.title', 'd.route', 'c.heading', 'c.text'])
            ->keyBy('id');

        return array_values(array_map(fn ($id) => [
            'id' => $id, 'document_id' => (int) $rows[$id]->help_document_id, 'title' => $rows[$id]->title,
            'route' => $rows[$id]->route, 'heading' => $rows[$id]->heading, 'text' => $rows[$id]->text,
            'score' => round($top[$id], 4),
        ], array_keys($top)));
    }

    /** id => [document id, route, packed vector], cached until a document is (re)indexed. */
    private function vectors(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, fn () => DB::table('help_chunks as c')
            ->join('help_documents as d', 'd.id', '=', 'c.help_document_id')
            ->where('d.status', 'indexed')
            ->whereNotNull('c.embedding')
            ->get(['c.id', 'c.help_document_id', 'd.route', 'c.embedding'])
            ->mapWithKeys(fn ($r) => [$r->id => [(int) $r->help_document_id, $r->route, $r->embedding]])
            ->all());
    }
}
