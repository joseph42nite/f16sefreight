<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Jev, through OpenRouter's Decisions API (user, 2026-09-20).
 *
 * 🔴 **NOT A CHAT MODEL, AND NOT THE CHAT ENDPOINT.** Jev is a TypeSafe "System One"
 * model: it takes a `state` and a map of typed `questions` and returns one typed answer
 * per question with a probability for every option. It generates no text at all, and it
 * is served at `POST /api/alpha/decisions` — a different host path and a different body
 * from the `/api/v1/chat/completions` that OpenRouterClient uses. A chat-completions
 * payload sent here is a 400, and the reverse is a 404. Do not merge the two clients.
 *
 * ── Why there is no tier ladder here ───────────────────────────────────────
 * OpenRouterClient climbs economy → fast → throughput because a chat model is served by
 * a dozen providers at a dozen prices. Jev has exactly ONE provider (TypeSafe), so there
 * is nothing to route between: a failure is a failure, and the caller decides what to do
 * without the model. `data_collection: deny` is still sent — the house rule is that no
 * provider keeps our prompts, and a rule only enforced where it is convenient is not one.
 *
 * ── The price, and why a mail costs a tenth of a document ──────────────────
 * $0.042 per million input tokens, and OUTPUT IS FREE — a typed choice is a few dozen
 * tokens and TypeSafe does not bill them. A classified mail is ~900 input tokens, about
 * US$0.000038, roughly ₹0.003. A document read by Gemma costs about ₹0.025. That ratio
 * is where OcrCreditService::MAIL_COST's 0.1 comes from, and it is the reason credits
 * had to learn decimals: 1 was eight times the honest number and 0 was a lie.
 */
class JevClient
{
    public function configured(): bool
    {
        return filled(config('services.openrouter.key')) && filled(config('services.jev.decisions_base'));
    }

    /**
     * Evaluate one state against a map of typed questions.
     *
     * @param  string|array  $state     the content to judge — a string, or structured data
     * @param  array         $questions keyed by an id you choose; answers come back under the same ids
     * @return array{answers: array, usage: array}
     *
     * @throws RuntimeException with a reason fit to show an operator
     */
    public function ask($state, array $questions, ?int $timeout = null): array
    {
        if (! $this->configured()) {
            throw new RuntimeException('the decision model is not configured (no OPENROUTER_API_KEY)');
        }

        $timeout = $timeout ?? (int) config('mail_intent.timeout');
        $started = microtime(true);

        try {
            $response = Http::withToken(config('services.openrouter.key'))
                ->withHeaders(['X-Title' => 'F16s Freight OS'])
                ->timeout($timeout)
                ->acceptJson()
                ->post(rtrim(config('services.jev.decisions_base'), '/') . '/decisions', [
                    'model' => config('mail_intent.model'),
                    'state' => $state,
                    'questions' => $questions,
                    // The house rule, on every provider: nobody keeps our clients' mail.
                    'provider' => ['data_collection' => 'deny'],
                ]);
        } catch (ConnectionException $e) {
            throw new RuntimeException(str_contains($e->getMessage(), 'timed out')
                ? "the decision model timed out after {$timeout}s" : 'the decision model is not reachable');
        }

        if ($response->failed()) {
            throw new RuntimeException('the decision model failed (HTTP ' . $response->status() . ')');
        }

        $body = $response->json() ?? [];

        if (! empty($body['error'])) {
            throw new RuntimeException('the decision model failed ('
                . mb_substr((string) ($body['error']['message'] ?? 'provider error'), 0, 120) . ')');
        }

        if (! is_array($body['answers'] ?? null)) {
            throw new RuntimeException('the decision model returned no answers');
        }

        return ['answers' => $body['answers'], 'usage' => [
            'model' => $body['model'] ?? config('mail_intent.model'),
            'provider' => $body['provider'] ?? null,
            // The Decisions API names these input_/output_tokens, not prompt_/completion_.
            'tokens_in' => (int) ($body['usage']['input_tokens'] ?? 0),
            'tokens_out' => (int) ($body['usage']['output_tokens'] ?? 0),
            'cost_usd' => (float) ($body['usage']['cost'] ?? 0),
            'execution_ms' => (int) ((microtime(true) - $started) * 1000),
            'attempts' => 1,
        ]];
    }

    /**
     * A Choice question: pick one of `$criteria`'s keys.
     *
     * ⚠️ The criteria are a map of OPTION → what that option means, and the description is
     * not decoration — jev-1.13 reads the rubric literally and a bare option name gives it
     * nothing to read. Options with no description are exactly where filing goes wrong.
     */
    public static function choice(string $instructions, array $criteria): array
    {
        return ['type' => 'choice', 'instructions' => $instructions, 'criteria' => $criteria];
    }
}
