<?php

namespace Tests\Feature;

use App\Blog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class OpenClawWebhookTest extends TestCase
{
    protected $secret = 'test-hmac-secret';
    protected $adminChatId = '12345678';

    protected function setUp(): void
    {
        parent::setUp();

        // Configure env values dynamically for test execution
        config(['app.url' => 'http://localhost']);
        putenv("OPENCLAW_HMAC_SECRET={$this->secret}");
        putenv("TELEGRAM_ADMIN_CHAT_ID={$this->adminChatId}");
        putenv("TELEGRAM_BOT_TOKEN=dummy-bot-token");

        // Clear tables
        DB::table('openclaw_nonces')->truncate();
        DB::table('openclaw_pending_actions')->truncate();
    }

    private function generateHeaders($payload, $nonce = 'test-nonce', $timestamp = null)
    {
        if (!$timestamp) {
            $timestamp = date('c');
        }
        $rawPayload = json_encode($payload);
        $signature = hash_hmac('sha256', $rawPayload, $this->secret);

        return [
            'x-openclaw-signature' => $signature,
            'x-openclaw-timestamp' => $timestamp,
            'x-openclaw-nonce' => $nonce,
        ];
    }

    public function test_webhook_fails_with_missing_headers()
    {
        $payload = [
            'event_type' => 'create_blog_post',
            'payload' => ['title' => 'Test', 'content' => 'Test']
        ];

        $response = $this->postJson('/api/openclaw/webhook', $payload);
        $response->assertStatus(401);
    }

    public function test_webhook_fails_with_invalid_signature()
    {
        $payload = [
            'event_type' => 'create_blog_post',
            'payload' => ['title' => 'Test', 'content' => 'Test']
        ];

        $response = $this->postJson('/api/openclaw/webhook', $payload, [
            'x-openclaw-signature' => 'invalid-signature-hash',
            'x-openclaw-timestamp' => date('c'),
            'x-openclaw-nonce' => 'test-nonce',
        ]);

        $response->assertStatus(401);
    }

    public function test_webhook_fails_with_stale_timestamp()
    {
        $payload = [
            'event_type' => 'create_blog_post',
            'payload' => ['title' => 'Test', 'content' => 'Test']
        ];

        // 10 minutes ago
        $staleTimestamp = date('c', time() - 600);
        $headers = $this->generateHeaders($payload, 'nonce-stale', $staleTimestamp);

        $response = $this->postJson('/api/openclaw/webhook', $payload, $headers);
        $response->assertStatus(409);
        $this->assertStringContainsString('Timestamp outside acceptable window', $response->json('error'));
    }

    public function test_webhook_rejects_duplicate_nonce()
    {
        $payload = [
            'event_type' => 'create_blog_post',
            'payload' => ['title' => 'Test', 'content' => 'Test']
        ];

        $headers = $this->generateHeaders($payload, 'nonce-dup');

        // First request is accepted
        Http::fake([
            'https://api.telegram.org/*' => Http::response(['ok' => true, 'result' => ['message_id' => 123]], 200)
        ]);

        $response1 = $this->postJson('/api/openclaw/webhook', $payload, $headers);
        $response1->assertStatus(200);

        // Second request with same nonce is rejected
        $response2 = $this->postJson('/api/openclaw/webhook', $payload, $headers);
        $response2->assertStatus(409);
        $this->assertStringContainsString('Duplicate nonce', $response2->json('error'));
    }

    public function test_webhook_restricts_access_to_non_blog_events()
    {
        $payload = [
            'event_type' => 'create_task', // restricted event type
            'payload' => ['title' => 'Unauthorized Task']
        ];

        $headers = $this->generateHeaders($payload, 'nonce-restrict');

        $response = $this->postJson('/api/openclaw/webhook', $payload, $headers);
        $response->assertStatus(403);
        $this->assertStringContainsString('OpenClaw is only authorized for blog management', $response->json('error'));
    }

    public function test_webhook_stages_create_blog_post_and_sends_telegram_approval()
    {
        $payload = [
            'event_type' => 'create_blog_post',
            'payload' => [
                'title' => 'Test Webhook Post',
                'category' => 'Technology',
                'excerpt' => 'Some excerpt',
                'content' => '<p>This is blog content</p>',
                'is_draft' => true
            ]
        ];

        $headers = $this->generateHeaders($payload, 'nonce-ok');

        Http::fake([
            'https://api.telegram.org/botdummy-bot-token/sendMessage' => Http::response([
                'ok' => true,
                'result' => ['message_id' => 999]
            ], 200)
        ]);

        $response = $this->postJson('/api/openclaw/webhook', $payload, $headers);
        $response->assertStatus(200);
        $response->assertJsonPath('status', 'accepted');

        // Verify action is stored in database as pending
        $pending = DB::table('openclaw_pending_actions')->where('event_type', 'create_blog_post')->first();
        $this->assertNotNull($pending);
        $this->assertEquals('pending', $pending->status);
        $this->assertStringContainsString('Test Webhook Post', $pending->payload);

        // Verify Telegram message ID is stored
        $this->assertEquals('[999]', $pending->telegram_message_id);
    }

    public function test_telegram_callback_unauthorized_user_is_ignored()
    {
        Http::fake([
            'https://api.telegram.org/botdummy-bot-token/answerCallbackQuery' => Http::response(['ok' => true], 200)
        ]);

        $response = $this->postJson('/api/openclaw/telegram-callback', [
            'callback_query' => [
                'id' => 'cb-1',
                'from' => ['id' => 99999], // Unauthorized user
                'data' => 'openclaw_accept:some-action-id',
                'message' => [
                    'chat' => ['id' => 12345],
                    'message_id' => 555
                ]
            ]
        ]);

        $response->assertStatus(200);
    }

    public function test_telegram_callback_accepts_and_executes_pending_blog_creation()
    {
        $actionId = 'cb-action-123';
        $blogPayload = [
            'title' => 'Approved Blog Post',
            'content' => '<p>Approved content</p>',
            'is_draft' => true
        ];

        DB::table('openclaw_pending_actions')->insert([
            'action_id' => $actionId,
            'event_type' => 'create_blog_post',
            'payload' => json_encode($blogPayload),
            'status' => 'pending',
            'telegram_message_id' => '[999]',
            'telegram_chat_id' => $this->adminChatId,
            'created_at' => now(),
        ]);

        Http::fake([
            'https://api.telegram.org/botdummy-bot-token/editMessageText' => Http::response(['ok' => true], 200),
            'https://api.telegram.org/botdummy-bot-token/answerCallbackQuery' => Http::response(['ok' => true], 200)
        ]);

        $response = $this->postJson('/api/openclaw/telegram-callback', [
            'callback_query' => [
                'id' => 'cb-2',
                'from' => ['id' => (int)$this->adminChatId], // Authorised Admin
                'data' => "openclaw_accept:{$actionId}",
                'message' => [
                    'chat' => ['id' => (int)$this->adminChatId],
                    'message_id' => 999
                ]
            ]
        ]);

        $response->assertStatus(200);

        // Verify action status in DB
        $action = DB::table('openclaw_pending_actions')->where('action_id', $actionId)->first();
        $this->assertEquals('accepted', $action->status);
        $this->assertNotNull($action->resolved_at);

        // Verify blog post was created in blogs table
        $blog = Blog::where('title', 'Approved Blog Post')->first();
        $this->assertNotNull($blog);
        $this->assertEquals('approved-blog-post', $blog->slug);
        $this->assertNull($blog->published_at); // is_draft = true
    }

    public function test_telegram_callback_rejects_and_cancels_pending_blog_creation()
    {
        $actionId = 'cb-action-456';
        $blogPayload = [
            'title' => 'Rejected Blog Post',
            'content' => '<p>Rejected content</p>',
            'is_draft' => true
        ];

        DB::table('openclaw_pending_actions')->insert([
            'action_id' => $actionId,
            'event_type' => 'create_blog_post',
            'payload' => json_encode($blogPayload),
            'status' => 'pending',
            'telegram_message_id' => '[999]',
            'telegram_chat_id' => $this->adminChatId,
            'created_at' => now(),
        ]);

        Http::fake([
            'https://api.telegram.org/botdummy-bot-token/editMessageText' => Http::response(['ok' => true], 200),
            'https://api.telegram.org/botdummy-bot-token/answerCallbackQuery' => Http::response(['ok' => true], 200)
        ]);

        $response = $this->postJson('/api/openclaw/telegram-callback', [
            'callback_query' => [
                'id' => 'cb-3',
                'from' => ['id' => (int)$this->adminChatId],
                'data' => "openclaw_reject:{$actionId}",
                'message' => [
                    'chat' => ['id' => (int)$this->adminChatId],
                    'message_id' => 999
                ]
            ]
        ]);

        $response->assertStatus(200);

        // Verify action status in DB is rejected
        $action = DB::table('openclaw_pending_actions')->where('action_id', $actionId)->first();
        $this->assertEquals('rejected', $action->status);

        // Verify blog post was NOT created
        $blog = Blog::where('title', 'Rejected Blog Post')->first();
        $this->assertNull($blog);
    }
}
