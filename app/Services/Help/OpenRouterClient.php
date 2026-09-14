<?php

namespace App\Services\Help;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Gemma 4 and an embedding model on OpenRouter, from Laravel (user decision, 2026-09-14).
 *
 * 🔴 The same rules as the parser's client (python/model_extract.py): only providers that do not
 * keep prompts, the answer constrained to a JSON schema, and "stuck" is OUR timeout — OpenRouter
 * moves providers on errors, not on slowness — so each attempt is short and the next is routed
 * differently.
 */
class OpenRouterClient
{
    private const ROUTES = ['latency', 'throughput', 'price'];

    public function configured(): bool
    {
        return filled(config('services.openrouter.key'));
    }

    /**
     * Embed texts, in order. Vectors come back unit-length, so a dot product is the cosine.
     *
     * @param  string[]  $texts
     * @return array{vectors: array<int, float[]>, usage: array}
     */
    public function embed(array $texts): array
    {
        $model = config('services.openrouter.embedding_model');
        $vectors = [];
        $tokens = 0;
        $cost = 0.0;
        $started = microtime(true);

        foreach (array_chunk($texts, 32) as $batch) {
            $body = $this->post('/embeddings', ['model' => $model, 'input' => $batch, 'provider' => ['data_collection' => 'deny']]);

            foreach ($body['data'] ?? [] as $row) {
                $vectors[] = self::normalise($row['embedding'] ?? []);
            }

            $tokens += (int) ($body['usage']['prompt_tokens'] ?? 0);
            $cost += (float) ($body['usage']['cost'] ?? 0);
        }

        if (count($vectors) !== count($texts)) {
            throw new RuntimeException('the embedding model returned ' . count($vectors) . ' vectors for ' . count($texts) . ' texts');
        }

        return ['vectors' => $vectors, 'usage' => [
            'model' => $model, 'provider' => null, 'tokens_in' => $tokens, 'tokens_out' => 0,
            'cost_usd' => $cost, 'execution_ms' => (int) ((microtime(true) - $started) * 1000), 'attempts' => 1,
        ]];
    }

    /**
     * Ask the chat model for a JSON answer that matches `$schema`.
     *
     * @return array{data: array, usage: array}
     */
    public function json(array $messages, array $schema, string $name): array
    {
        $reason = 'the model is not reachable';

        foreach (self::ROUTES as $i => $sort) {
            $started = microtime(true);

            try {
                $body = $this->post('/chat/completions', [
                    'model' => config('services.openrouter.chat_model'),
                    'messages' => $messages,
                    'temperature' => 0,
                    'max_tokens' => 700,
                    'response_format' => ['type' => 'json_schema', 'json_schema' => ['name' => $name, 'strict' => true, 'schema' => $schema]],
                    'provider' => ['sort' => $sort, 'require_parameters' => true, 'data_collection' => 'deny'],
                    'usage' => ['include' => true],
                ]);
            } catch (RuntimeException $e) {
                $reason = $e->getMessage();

                continue;
            }

            $data = json_decode((string) ($body['choices'][0]['message']['content'] ?? ''), true);

            if (! is_array($data)) {
                throw new RuntimeException('the model returned something unreadable');
            }

            return ['data' => $data, 'usage' => [
                'model' => $body['model'] ?? config('services.openrouter.chat_model'),
                'provider' => $body['provider'] ?? null,
                'tokens_in' => (int) ($body['usage']['prompt_tokens'] ?? 0),
                'tokens_out' => (int) ($body['usage']['completion_tokens'] ?? 0),
                'cost_usd' => (float) ($body['usage']['cost'] ?? 0),
                'execution_ms' => (int) ((microtime(true) - $started) * 1000),
                'attempts' => $i + 1,
            ]];
        }

        throw new RuntimeException($reason);
    }

    /** @throws RuntimeException with a reason fit to show an operator */
    private function post(string $path, array $payload): array
    {
        if (! $this->configured()) {
            throw new RuntimeException('the model is not configured (no OPENROUTER_API_KEY)');
        }

        $timeout = (int) config('services.openrouter.attempt_timeout');

        try {
            $response = Http::withToken(config('services.openrouter.key'))
                ->withHeaders(['X-Title' => 'F16s Freight OS'])
                ->timeout($timeout)
                ->acceptJson()
                ->post(rtrim(config('services.openrouter.base'), '/') . $path, $payload);
        } catch (ConnectionException $e) {
            throw new RuntimeException(str_contains($e->getMessage(), 'timed out')
                ? "the model timed out after {$timeout}s" : 'the model is not reachable');
        }

        if ($response->failed()) {
            throw new RuntimeException('the model failed (HTTP ' . $response->status() . ')');
        }

        $body = $response->json() ?? [];

        if (! empty($body['error'])) {
            throw new RuntimeException('the model failed (' . mb_substr((string) ($body['error']['message'] ?? 'provider error'), 0, 120) . ')');
        }

        return $body;
    }

    /** @param float[] $vector */
    public static function normalise(array $vector): array
    {
        $length = sqrt(array_sum(array_map(fn ($x) => $x * $x, $vector)));

        return $length > 0 ? array_map(fn ($x) => $x / $length, $vector) : $vector;
    }
}
