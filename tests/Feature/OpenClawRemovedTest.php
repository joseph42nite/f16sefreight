<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

/**
 * OpenClaw is gone (owner, 2026-10-11: "the bot is OpenMaus — remove the OpenClaw option completely"). Its webhook,
 * its Telegram approvals and its pending-actions list answered unauthenticated or semi-public calls; none of them may
 * still be reachable, and its two tables are dropped.
 */
class OpenClawRemovedTest extends TestCase
{
    public function test_no_openclaw_route_is_left(): void
    {
        $left = collect(Route::getRoutes()->getRoutes())->map(fn ($r) => $r->uri())->filter(fn ($uri) => str_contains($uri, 'openclaw'));

        $this->assertSame([], $left->values()->all());
        $this->postJson('/api/openclaw/webhook', ['event_type' => 'create_blog_post'])->assertNotFound();
        $this->postJson('/api/openclaw/telegram-callback', [])->assertNotFound();
    }

    public function test_its_tables_and_classes_are_gone(): void
    {
        $this->assertFalse(Schema::hasTable('openclaw_nonces'));
        $this->assertFalse(Schema::hasTable('openclaw_pending_actions'));
        $this->assertFalse(class_exists(\App\Http\Controllers\OpenClawController::class));
        $this->assertFalse(class_exists(\App\Http\Middleware\VerifyOpenClawSignature::class));
        $this->assertNull(config('services.openclaw'));
    }
}
