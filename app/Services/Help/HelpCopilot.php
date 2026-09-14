<?php

namespace App\Services\Help;

use App\Services\AiUsageService;
use App\Support\UserContext;
use App\User;
use Illuminate\Support\Facades\DB;

/**
 * Answers a portal user's question from the uploaded help documents (PRD §5.10, user 2026-09-14).
 *
 * 🔴 ONLY FROM THE DOCUMENTS. The nearest sections are handed to Gemma with the instruction to answer
 * from them alone; when nothing is close enough the model is not called at all, and the reply says it
 * does not know and offers a ticket. A confident answer invented about someone's freight portal is
 * worse than "I don't know".
 *
 * 🔴 A STEP CAN ONLY NAME A BUTTON THE DOCUMENTS NAME. A document marks one as `[[upload-invoice]]`;
 * a step whose target is not written in the sections it was given is dropped, and so is a page link
 * to a page none of them are about. The model never gets to invent where to click.
 */
class HelpCopilot
{
    /** Below this, a section is not about the question — measured against the embedding model, tune in GAPS. */
    public const MIN_SCORE = 0.35;

    public function __construct(
        private OpenRouterClient $client,
        private HelpSearch $search,
        private AiUsageService $usage,
    ) {
    }

    /**
     * @param  array<int, array{question: string, answer: string}>  $history  the last turns, oldest first
     * @return array{id: int, found: bool, answer: string, page: ?string, steps: array}
     */
    public function ask(User $user, string $question, ?string $route, array $history = []): array
    {
        $history = array_slice($history, -3);

        // A follow-up ("and where is that?") is searched together with the question before it.
        $searchText = trim(implode("\n", array_column($history, 'question')) . "\n" . $question);
        $embedded = $this->client->embed([$searchText]);
        $this->usage->log($embedded['usage'], 'help', $user);

        $sections = $this->search->nearest($embedded['vectors'][0], $route);
        $relevant = array_values(array_filter($sections, fn ($s) => $s['score'] >= self::MIN_SCORE));

        if ($relevant === []) {
            return $this->store($user, $question, $route, [
                'found' => false,
                'answer' => "I couldn't find this in the F16s help documents. You can raise a ticket and the support team will answer.",
                'page' => null, 'steps' => [],
            ], [], $sections[0]['score'] ?? null);
        }

        $answer = $this->client->json($this->messages($question, $route, $history, $relevant), self::schema(), 'help_answer');
        $this->usage->log($answer['usage'], 'help', $user);

        return $this->store($user, $question, $route, $this->checked($answer['data'], $relevant), array_column($relevant, 'id'), $relevant[0]['score']);
    }

    private function messages(string $question, ?string $route, array $history, array $sections): array
    {
        $passages = '';

        foreach ($sections as $i => $s) {
            $passages .= '[' . ($i + 1) . '] ' . $s['title'] . ($s['heading'] ? ' › ' . $s['heading'] : '')
                . ($s['route'] ? " (page {$s['route']})" : '') . "\n" . $s['text'] . "\n\n";
        }

        $system = <<<'TXT'
You are the help assistant inside F16s Freight OS, a freight forwarding portal. You answer staff of freight companies who are using the portal.

Answer ONLY from the PASSAGES. If they do not answer the question, set found to false and say briefly that the help documents do not cover it — never guess how the portal works.

Keep the answer short and practical: what to do, in order. Plain text, no Markdown headings.

steps: only when a passage marks a control as [[name]]. Use exactly that name as target, one step per action, in order. Never make up a name.
page: the page path the user should go to, taken from a passage's "(page …)", or null.
TXT;

        $messages = [['role' => 'system', 'content' => $system]];

        foreach ($history as $turn) {
            $messages[] = ['role' => 'user', 'content' => $turn['question']];
            $messages[] = ['role' => 'assistant', 'content' => $turn['answer']];
        }

        $messages[] = ['role' => 'user', 'content' => "The user is on page: " . ($route ?: 'unknown')
            . "\n\nPASSAGES:\n{$passages}QUESTION: {$question}"];

        return $messages;
    }

    /** The model's answer, with anything it could not have taken from the sections removed. */
    private function checked(array $data, array $sections): array
    {
        $text = implode("\n", array_column($sections, 'text'));
        preg_match_all('/\[\[([a-z0-9][a-z0-9-]{0,60})\]\]/i', $text, $m);
        $targets = array_map('strtolower', $m[1]);
        $routes = array_filter(array_column($sections, 'route'));

        $steps = [];
        foreach (array_slice((array) ($data['steps'] ?? []), 0, 8) as $step) {
            $target = strtolower((string) ($step['target'] ?? ''));
            if (in_array($target, $targets, true) && filled($step['instruction'] ?? null)) {
                $steps[] = ['target' => $target, 'instruction' => mb_substr((string) $step['instruction'], 0, 200)];
            }
        }

        $page = $data['page'] ?? null;

        return [
            'found' => (bool) ($data['found'] ?? false),
            // `[[upload-invoice]]` reads as "upload-invoice" in the chat; the tour highlights it.
            'answer' => trim(preg_replace('/\[\[([^\]]+)\]\]/', '$1', (string) ($data['answer'] ?? ''))),
            'page' => in_array($page, $routes, true) ? $page : null,
            'steps' => $steps,
        ];
    }

    private function store(User $user, string $question, ?string $route, array $reply, array $chunkIds, ?float $best): array
    {
        $id = DB::table('help_questions')->insertGetId([
            'agent_id' => UserContext::for($user)->agentId,
            'user_id' => $user->id,
            'route' => $route ? mb_substr($route, 0, 255) : null,
            'question' => $question,
            'answer' => $reply['answer'],
            'found' => $reply['found'],
            'steps' => json_encode($reply['steps']),
            'chunk_ids' => json_encode($chunkIds),
            'best_score' => $best,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        return ['id' => $id] + $reply;
    }

    public static function schema(): array
    {
        return [
            'type' => 'object',
            'additionalProperties' => false,
            'required' => ['found', 'answer', 'page', 'steps'],
            'properties' => [
                'found' => ['type' => 'boolean'],
                'answer' => ['type' => 'string'],
                'page' => ['type' => ['string', 'null']],
                'steps' => [
                    'type' => 'array',
                    'maxItems' => 8,
                    'items' => [
                        'type' => 'object',
                        'additionalProperties' => false,
                        'required' => ['target', 'instruction'],
                        'properties' => ['target' => ['type' => 'string'], 'instruction' => ['type' => 'string']],
                    ],
                ],
            ],
        ];
    }
}
