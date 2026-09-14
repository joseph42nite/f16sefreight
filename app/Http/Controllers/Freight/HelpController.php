<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Services\AiUsageService;
use App\Services\Help\HelpCopilot;
use App\Services\Help\OpenRouterClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

/**
 * The help copilot, for a portal user (PRD §5.10).
 *
 * ⚠️ Any signed-in tenant user may ask: a doubt about where data goes is not a role's privilege.
 * Questions have their own daily limit per user, set in superadmin → AI usage.
 */
class HelpController extends Controller
{
    public function ask(Request $request, HelpCopilot $copilot, AiUsageService $usage, OpenRouterClient $client): JsonResponse
    {
        $data = $request->validate([
            'question' => ['required', 'string', 'max:1000'],
            'route' => ['nullable', 'string', 'max:255'],
            'history' => ['nullable', 'array', 'max:3'],
            'history.*.question' => ['required_with:history', 'string', 'max:1000'],
            'history.*.answer' => ['required_with:history', 'string', 'max:4000'],
        ]);

        $user = auth()->user();

        if (! $client->configured()) {
            return response()->json(['error' => 'Help is not set up yet. Raise a ticket and the support team will answer.', 'reason' => 'not_configured'], 503);
        }

        if (! $usage->mayAsk($user->id)) {
            return response()->json([
                'error' => "You've reached today's limit for help questions. Raise a ticket and the support team will answer.",
                'reason' => 'daily_limit',
            ], 429);
        }

        try {
            return response()->json($copilot->ask($user, $data['question'], $data['route'] ?? null, $data['history'] ?? []));
        } catch (RuntimeException $e) {
            report($e);

            return response()->json(['error' => 'Help could not answer just now (' . $e->getMessage() . '). Try again, or raise a ticket.', 'reason' => 'model_failed'], 502);
        }
    }
}
