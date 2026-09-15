<?php

namespace App\Services\Help;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Gemma 4 and an embedding model on OpenRouter, from Laravel (user decision, 2026-09-14).
 *
 * 🔴 The same rules as the parser's client (python/model_extract.py): only providers that do not
 * keep prompts, the answer constrained to a JSON schema, and CHEAP FIRST WITH A FAST FALLBACK ALWAYS —
 * economy providers under the price ceiling, then any provider, then economy by throughput. "Stuck" is
 * OUR timeout: OpenRouter moves providers on errors, not on slowness.
 */
class OpenRouterClient
{
    private const TIERS = [['economy', 'order'], ['fast', 'order'], ['economy', 'throughput']];

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
            $payload = ['model' => $model, 'input' => $batch, 'provider' => ['data_collection' => 'deny']];
            $timeout = (int) config('services.openrouter.embedding_timeout');

            // Embeddings cost a fraction of a paisa, so there is no economy tier — one retry is the fallback.
            try {
                $body = $this->post('/embeddings', $payload, $timeout);
            } catch (RuntimeException $e) {
                $body = $this->post('/embeddings', $payload, $timeout);
            }

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
    public function json(array $messages, array $schema, string $name, string $timeouts = 'help_timeouts', bool $freeFirst = false): array
    {
        $reason = 'the model is not reachable';
        $started = microtime(true);

        if ($freeFirst && ($free = $this->free($messages, $schema, $started)) !== null) {
            return $free;
        }
        $timeouts = array_map('intval', explode(',', (string) config('services.openrouter.' . $timeouts)));

        foreach (self::TIERS as $i => [$tier, $sort]) {
            $provider = ['require_parameters' => true, 'data_collection' => 'deny'];

            if ($tier === 'economy') {
                $provider['max_price'] = [
                    'prompt' => (float) config('services.openrouter.economy_max_prompt'),
                    'completion' => (float) config('services.openrouter.economy_max_completion'),
                ];
            }

            if ($sort === 'order') {
                // Named providers: economy stays within its list; the fast fallback may go anywhere after its own.
                $names = config($tier === 'economy' ? 'services.openrouter.economy_providers' : 'services.openrouter.fast_providers');
                $provider['order'] = array_values(array_filter(array_map('trim', explode(',', (string) $names))));
                $provider['allow_fallbacks'] = $tier !== 'economy';
            } else {
                $provider['sort'] = $sort;
            }

            try {
                $body = $this->post('/chat/completions', [
                    'model' => config('services.openrouter.chat_model'),
                    'messages' => $messages,
                    'temperature' => 0,
                    'max_tokens' => 700,
                    'response_format' => ['type' => 'json_schema', 'json_schema' => ['name' => $name, 'strict' => true, 'schema' => $schema]],
                    'provider' => $provider,
                    'usage' => ['include' => true],
                ], $timeouts[$i] ?? end($timeouts));
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
                // Timed from the first try: what the user actually waited.
                'execution_ms' => (int) ((microtime(true) - $started) * 1000),
                'attempts' => $i + 1,
                'tier' => $tier,
            ]];
        }

        throw new RuntimeException($reason);
    }

    /**
     * 🌙 The free Gemma's one try (see config services.openrouter.free_*). It takes a plain JSON object, not a strict
     * schema, so the schema goes in the instructions and an answer missing a required key is not used. NULL = the
     * paid tiers take over.
     */
    private function free(array $messages, array $schema, float $started): ?array
    {
        $messages[0]['content'] .= "\nAnswer with ONLY a JSON object matching this JSON schema: " . json_encode($schema);

        try {
            $body = $this->post('/chat/completions', [
                'model' => config('services.openrouter.free_model'),
                'messages' => $messages, 'temperature' => 0, 'max_tokens' => 700,
                'response_format' => ['type' => 'json_object'],
                'provider' => ['data_collection' => 'deny'],
                'usage' => ['include' => true],
            ], (int) config('services.openrouter.free_timeout'));
        } catch (RuntimeException $e) {
            return null;
        }

        $data = json_decode((string) ($body['choices'][0]['message']['content'] ?? ''), true);

        if (! is_array($data) || array_diff($schema['required'] ?? [], array_keys($data)) !== []) {
            return null;
        }

        return ['data' => $data, 'usage' => [
            'model' => $body['model'] ?? config('services.openrouter.free_model'), 'provider' => $body['provider'] ?? null,
            'tokens_in' => (int) ($body['usage']['prompt_tokens'] ?? 0), 'tokens_out' => (int) ($body['usage']['completion_tokens'] ?? 0),
            'cost_usd' => (float) ($body['usage']['cost'] ?? 0), 'execution_ms' => (int) ((microtime(true) - $started) * 1000),
            'attempts' => 1, 'tier' => 'free',
        ]];
    }

    /** @throws RuntimeException with a reason fit to show an operator */
    private function post(string $path, array $payload, int $timeout): array
    {
        if (! $this->configured()) {
            throw new RuntimeException('the model is not configured (no OPENROUTER_API_KEY)');
        }

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
