<?php

namespace App\Http\Controllers;

use App\Blog;
use App\Services\TelegramService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class OpenClawController extends Controller
{
    /**
     * POST /api/openclaw/webhook
     * Process incoming webhook events from OpenClaw.
     */
    public function webhook(Request $request)
    {
        try {
            $eventType = $request->input('event_type');
            $payload = $request->input('payload');

            if (!$eventType || !$payload) {
                return response()->json(['error' => 'event_type and payload are required'], 400);
            }

            // Enforce OpenClaw access is restricted to ONLY blog section
            if (!in_array($eventType, ['create_blog_post', 'update_blog_post'])) {
                return response()->json(['error' => 'Access denied: OpenClaw is only authorized for blog management.'], 403);
            }

            // Stage the action for Telegram approval
            $actionId = Str::uuid()->toString();
            $adminChatId = env('TELEGRAM_ADMIN_CHAT_ID');

            if (!$adminChatId) {
                Log::error('[OPENCLAW] TELEGRAM_ADMIN_CHAT_ID is not configured in .env');
                return response()->json(['error' => 'Telegram Admin Chat ID is not configured'], 500);
            }

            // Build detailed summary text for Telegram message
            $actionVerb = ($eventType === 'create_blog_post') ? 'Create' : 'Update';
            $details = "";
            foreach ($payload as $key => $value) {
                if (is_array($value)) {
                    $details .= "• *{$key}:* " . json_encode($value) . "\n";
                } elseif ($value !== null && $value !== '') {
                    $valStr = (strlen($value) > 200) ? substr($value, 0, 197) . '...' : $value;
                    $details .= "• *{$key}:* {$valStr}\n";
                }
            }

            $messageText = "🤖 *OpenClaw — Confirmation Required*\n\n" .
                "*Action:* {$actionVerb} Blog Post\n\n" .
                "📋 *Proposed Changes:*\n{$details}\n" .
                "---\nTap a button below to proceed:";

            // Build Inline Keyboard
            $replyMarkup = [
                'inline_keyboard' => [
                    [
                        ['text' => '✅ Accept & Save', 'callback_data' => "openclaw_accept:{$actionId}"],
                        ['text' => '❌ Reject', 'callback_data' => "openclaw_reject:{$actionId}"]
                    ]
                ]
            ];

            // Store pending action
            DB::table('openclaw_pending_actions')->insert([
                'action_id' => $actionId,
                'event_type' => $eventType,
                'payload' => json_encode($payload),
                'status' => 'pending',
                'telegram_chat_id' => $adminChatId,
                'created_at' => now(),
            ]);

            // Send Telegram message to admin
            $tgResult = TelegramService::sendMessage($adminChatId, $messageText, $replyMarkup);

            if ($tgResult && isset($tgResult['message_id'])) {
                DB::table('openclaw_pending_actions')
                    ->where('action_id', $actionId)
                    ->update(['telegram_message_id' => json_encode([$tgResult['message_id']])]);
            }

            return response()->json([
                'status' => 'accepted',
                'event_type' => $eventType,
                'message' => 'Action staged for admin confirmation via Telegram'
            ]);
        } catch (\Exception $e) {
            Log::error('[OPENCLAW] Webhook error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * POST /api/openclaw/telegram-callback
     * Handles Telegram inline keyboard buttons accept/reject.
     */
    public function telegramCallback(Request $request)
    {
        try {
            $callbackQuery = $request->input('callback_query');
            if (!$callbackQuery) {
                return response()->json(['ok' => true]);
            }

            $callbackData = $callbackQuery['data'] ?? '';
            $chatId = $callbackQuery['message']['chat']['id'] ?? null;
            $messageId = $callbackQuery['message']['message_id'] ?? null;

            if (!$callbackData || !str_starts_with($callbackData, 'openclaw_')) {
                return response()->json(['ok' => true]);
            }

            // Authorization check
            $fromId = (string)($callbackQuery['from']['id'] ?? '');
            $adminChatId = env('TELEGRAM_ADMIN_CHAT_ID');
            $authorizedAdminIds = $adminChatId ? array_map('trim', explode(',', $adminChatId)) : [];

            if (!empty($authorizedAdminIds) && !in_array($fromId, $authorizedAdminIds)) {
                TelegramService::answerCallbackQuery($callbackQuery['id'], '❌ You are not authorized.');
                return response()->json(['ok' => true]);
            }

            $parts = explode(':', $callbackData);
            $action = $parts[0];
            $actionId = $parts[1] ?? '';

            // Find pending action
            $pending = DB::table('openclaw_pending_actions')
                ->where('action_id', $actionId)
                ->where('status', 'pending')
                ->first();

            if (!$pending) {
                TelegramService::answerCallbackQuery($callbackQuery['id'], '⚠️ Action already processed or not found.');
                return response()->json(['ok' => true]);
            }

            $eventType = $pending->event_type;
            $payload = json_decode($pending->payload, true);

            // Get Telegram message IDs to update
            $sentMessageIds = [];
            if ($pending->telegram_message_id) {
                $decoded = json_decode($pending->telegram_message_id, true);
                $sentMessageIds = is_array($decoded) ? $decoded : [$pending->telegram_message_id];
            } else if ($messageId) {
                $sentMessageIds = [$messageId];
            }

            if ($action === 'openclaw_accept') {
                // Execute Event
                $result = $this->executeEvent($eventType, $payload);

                DB::table('openclaw_pending_actions')
                    ->where('action_id', $actionId)
                    ->update([
                        'status' => 'accepted',
                        'resolved_at' => now()
                    ]);

                $statusText = "✅ *Approved!* Blog post has been saved/updated.\n\n" . $result['summary'];

                foreach ($sentMessageIds as $msgId) {
                    TelegramService::editMessageText($chatId, $msgId, $statusText);
                }

                TelegramService::answerCallbackQuery($callbackQuery['id'], '✅ Executed successfully!');

            } elseif ($action === 'openclaw_reject') {
                DB::table('openclaw_pending_actions')
                    ->where('action_id', $actionId)
                    ->update([
                        'status' => 'rejected',
                        'resolved_at' => now()
                    ]);

                $statusText = "❌ *Rejected!* Action was cancelled.\n\nOriginal Request: " . str_replace('_', ' ', $eventType);

                foreach ($sentMessageIds as $msgId) {
                    TelegramService::editMessageText($chatId, $msgId, $statusText);
                }

                TelegramService::answerCallbackQuery($callbackQuery['id'], '❌ Action rejected.');
            }

            return response()->json(['ok' => true]);
        } catch (\Exception $e) {
            Log::error('[OPENCLAW] Callback error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * GET /api/openclaw/pending
     * List all pending actions waiting for Telegram confirmation.
     */
    public function getPendingActions()
    {
        $pending = DB::table('openclaw_pending_actions')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['pending_actions' => $pending]);
    }

    /**
     * Routes and executes the accepted action.
     */
    private function executeEvent($eventType, $payload)
    {
        if ($eventType === 'create_blog_post') {
            return $this->handleCreateBlogPost($payload);
        } elseif ($eventType === 'update_blog_post') {
            return $this->handleUpdateBlogPost($payload);
        }

        return ['success' => false, 'summary' => 'Unknown event type'];
    }

    private function generateSlug($title)
    {
        return Str::slug($title);
    }

    private function ensureUniqueSlug($slug, $excludeId = null)
    {
        $candidate = $slug;
        $counter = 1;
        while (true) {
            $query = DB::table('blogs')->where('slug', $candidate);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
            if (!$query->exists()) {
                return $candidate;
            }
            $candidate = "{$slug}-{$counter}";
            $counter++;
        }
    }

    private function handleCreateBlogPost($payload)
    {
        if (empty($payload['title']) || empty($payload['content'])) {
            return ['success' => false, 'summary' => 'Title and Content are required'];
        }

        $slug = $this->ensureUniqueSlug($this->generateSlug($payload['title']));
        
        $isDraft = filter_var($payload['is_draft'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $publishedAt = $isDraft ? null : now();

        $blog = Blog::create([
            'title' => $payload['title'],
            'slug' => $slug,
            'category' => $payload['category'] ?? 'General',
            'read_time' => $payload['read_time'] ?? '5 min read',
            'image_path' => $payload['image_path'] ?? ($payload['cover_image_url'] ?? ''),
            'excerpt' => $payload['excerpt'] ?? substr(strip_tags($payload['content']), 0, 150),
            'meta_title' => $payload['meta_title'] ?? $payload['title'],
            'meta_description' => $payload['meta_description'] ?? ($payload['excerpt'] ?? ''),
            'content' => $payload['content'],
            'takeaways' => $payload['takeaways'] ?? null,
            'published_at' => $publishedAt
        ]);

        return [
            'success' => true,
            'summary' => "Created Blog Post #{$blog->id}: \"{$blog->title}\" (Slug: /blog/{$blog->slug}, Status: " . ($isDraft ? 'Draft' : 'Published') . ")"
        ];
    }

    private function handleUpdateBlogPost($payload)
    {
        $blog = null;
        if (!empty($payload['blog_id'])) {
            $blog = Blog::find($payload['blog_id']);
        } elseif (!empty($payload['slug'])) {
            $blog = Blog::where('slug', $payload['slug'])->first();
        }

        if (!$blog) {
            return ['success' => false, 'summary' => 'Blog post not found. Provide blog_id or slug.'];
        }

        $data = [];
        $fields = ['title', 'category', 'read_time', 'excerpt', 'content', 'meta_title', 'meta_description', 'takeaways'];

        foreach ($fields as $field) {
            if (isset($payload[$field])) {
                $data[$field] = $payload[$field];
            }
        }

        if (isset($payload['image_path'])) {
            $data['image_path'] = $payload['image_path'];
        } elseif (isset($payload['cover_image_url'])) {
            $data['image_path'] = $payload['cover_image_url'];
        }

        if (isset($payload['is_draft'])) {
            $isDraft = filter_var($payload['is_draft'], FILTER_VALIDATE_BOOLEAN);
            $data['published_at'] = $isDraft ? null : ($blog->published_at ?: now());
        }

        if (isset($payload['title']) && $payload['title'] !== $blog->title) {
            $slug = $this->generateSlug($payload['title']);
            $data['slug'] = $this->ensureUniqueSlug($slug, $blog->id);
        }

        $blog->update($data);

        return [
            'success' => true,
            'summary' => "Updated Blog Post #{$blog->id}: \"{$blog->title}\" (Status: " . ($blog->published_at ? 'Published' : 'Draft') . ")"
        ];
    }
}
