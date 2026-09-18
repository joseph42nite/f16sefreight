<?php

namespace Tests\Feature;

use App\Services\AiUsageService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/** The paid model through the working day, the free one at night (user, 2026-09-18: "morning 10 to evening 8 paid, free at night"). */
class FreeModelWindowTest extends TestCase
{
    use DatabaseTransactions;

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    public function test_paid_between_ten_and_eight_free_outside_it(): void
    {
        app(AiUsageService::class)->settings(); // the row, created with its defaults on first use
        DB::table('ai_budget_settings')->update(['night_free_extraction' => 1, 'night_free_help_drafts' => 1]);
        // phpunit.xml pins the window OFF so other tests never depend on the clock; this one is about the window itself,
        // so it reads the shipped setting: paid 10am–8pm India time, free outside it.
        config()->set('services.openrouter.free_from_hour', 20);
        config()->set('services.openrouter.free_until_hour', 10);
        $free = function (string $time) {
            Carbon::setTestNow(Carbon::parse($time, 'Asia/Kolkata'));
            config()->set('services.openrouter.free_from_hour', 20);
            config()->set('services.openrouter.free_until_hour', 10);

            return app(AiUsageService::class)->freeFirst('extraction');
        };

        foreach (['2026-09-18 10:00', '2026-09-18 13:30', '2026-09-18 19:59'] as $working) {
            $this->assertFalse($free($working), "{$working} is the working day — the paid model");
        }

        foreach (['2026-09-18 20:00', '2026-09-18 23:30', '2026-09-19 08:00', '2026-09-19 09:59'] as $night) {
            $this->assertTrue($free($night), "{$night} is out of hours — the free model first");
        }
    }

    /** Switched off in Super Admin, the paid model is used whatever the hour. */
    public function test_the_switch_still_decides(): void
    {
        app(AiUsageService::class)->settings();
        DB::table('ai_budget_settings')->update(['night_free_extraction' => 0]);
        Carbon::setTestNow(Carbon::parse('2026-09-18 23:00', 'Asia/Kolkata'));

        $this->assertFalse(app(AiUsageService::class)->freeFirst('extraction'));
    }
}
