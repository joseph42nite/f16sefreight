<?php

namespace Tests\Feature;

use App\Services\AiUsageService;
use App\Services\Help\OpenRouterClient;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * The free Gemma at night, the paid model when it does not answer (user, 2026-09-15).
 */
class NightFreeModelTest extends TestCase
{
    use DatabaseTransactions;

    private const SCHEMA = [
        'type' => 'object',
        'properties' => ['answer' => ['type' => 'string'], 'found' => ['type' => 'boolean']],
        'required' => ['answer', 'found'],
        'additionalProperties' => false,
    ];

    protected function setUp(): void
    {
        parent::setUp();

        // phpunit.xml switches the night window off for every other test; this one checks the real hours.
        config(['services.openrouter.free_from_hour' => 21, 'services.openrouter.free_until_hour' => 11]);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function usage(): AiUsageService
    {
        return app(AiUsageService::class);
    }

    /** 🔴 9pm to 11am India time; help and drafts on by default, extraction only once superadmin switches it on. */
    public function test_the_free_model_is_tried_only_at_night_and_only_where_switched_on(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-09-15 22:30', 'Asia/Kolkata'));
        $this->assertTrue($this->usage()->freeFirst('help'));
        $this->assertFalse($this->usage()->freeFirst('extraction'));

        Carbon::setTestNow(Carbon::parse('2026-09-16 10:59', 'Asia/Kolkata'));
        $this->assertTrue($this->usage()->freeFirst('draft'));

        Carbon::setTestNow(Carbon::parse('2026-09-16 11:00', 'Asia/Kolkata'));
        $this->assertFalse($this->usage()->freeFirst('help'), 'daytime is paid');

        DB::table('ai_budget_settings')->update(['night_free_extraction' => true, 'night_free_help_drafts' => false]);
        Carbon::setTestNow(Carbon::parse('2026-09-16 02:00', 'Asia/Kolkata'));
        $this->assertTrue($this->usage()->freeFirst('extraction'));
        $this->assertFalse($this->usage()->freeFirst('help'));
    }

    private function reply(array $content, float $cost = 0.0): array
    {
        return ['model' => 'google/gemma-4-31b-it', 'provider' => 'Test', 'choices' => [['message' => ['content' => json_encode($content)]]],
                'usage' => ['prompt_tokens' => 100, 'completion_tokens' => 20, 'cost' => $cost]];
    }

    public function test_a_complete_free_answer_is_used_and_costs_nothing(): void
    {
        config(['services.openrouter.key' => 'test-key']);
        Http::fake(['*' => Http::response($this->reply(['answer' => 'Go to Inbox', 'found' => true]))]);

        $result = app(OpenRouterClient::class)->json([['role' => 'system', 'content' => 'Help.'], ['role' => 'user', 'content' => 'Where?']], self::SCHEMA, 'help_answer', 'help_timeouts', true);

        $this->assertSame(['free', 'Go to Inbox'], [$result['usage']['tier'], $result['data']['answer']]);
        Http::assertSentCount(1);
        Http::assertSent(fn ($r) => $r['model'] === 'google/gemma-4-31b-it:free' && $r['response_format'] === ['type' => 'json_object']
            && $r['provider'] === ['data_collection' => 'deny']);
    }

    /** 🔴 A free answer missing a required key is not used — the paid economy tier answers instead. */
    public function test_an_incomplete_free_answer_falls_back_to_the_paid_model(): void
    {
        config(['services.openrouter.key' => 'test-key']);
        Http::fakeSequence()
            ->push($this->reply(['answer' => 'half']))
            ->push($this->reply(['answer' => 'Go to Inbox', 'found' => true], 0.0002));

        $result = app(OpenRouterClient::class)->json([['role' => 'system', 'content' => 'Help.'], ['role' => 'user', 'content' => 'Where?']], self::SCHEMA, 'help_answer', 'help_timeouts', true);

        $this->assertSame(['economy', true], [$result['usage']['tier'], $result['data']['found']]);
        Http::assertSentCount(2);
    }
}
