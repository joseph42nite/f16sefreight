<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Jobs\ProcessPdfOcrJob;
use App\PdfProcessingJob;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/** The routing and platform findings of the 2026-11-10 audit (§4). */
class PlatformRoutingTest extends TestCase
{
    use DatabaseTransactions;

    /** Three routes named a method nobody had written, and one a guard nobody had defined: each answered 500. */
    public function test_every_route_points_at_a_method_and_a_guard_that_exist(): void
    {
        $guards = array_keys(config('auth.guards'));

        foreach (Route::getRoutes() as $route) {
            $action = $route->getAction('controller');

            if (is_string($action)) {
                [$class, $method] = array_pad(explode('@', $action), 2, '__invoke');
                $this->assertTrue(method_exists($class, $method), "{$route->uri()} points at {$class}::{$method}, which does not exist.");
            }

            foreach ($route->gatherMiddleware() as $middleware) {
                if (is_string($middleware) && str_starts_with($middleware, 'auth:')) {
                    foreach (explode(',', substr($middleware, 5)) as $guard) {
                        $this->assertContains($guard, $guards, "{$route->uri()} uses the guard '{$guard}', which is not defined.");
                    }
                }
            }
        }
    }

    /** A nested limit with no name counts on the same key as the api group's, so anything used up the ten sign-ins. */
    public function test_every_nested_rate_limit_has_its_own_counter(): void
    {
        $nested = 0;

        foreach (Route::getRoutes() as $route) {
            $middleware = $route->gatherMiddleware();

            // The api group carries the 300 a minute; a `throttle:` written on the route or its group is nested in it.
            if (! in_array('api', $middleware, true)) {
                continue;
            }

            foreach ($middleware as $limit) {
                if (is_string($limit) && str_starts_with($limit, 'throttle:')) {
                    $nested++;
                    $this->assertCount(3, explode(',', $limit), "{$route->uri()}: '{$limit}' shares the api group's counter — give it a name.");
                }
            }
        }

        $this->assertGreaterThan(0, $nested, 'No nested limit was found, so this test checked nothing.');
    }

    public function test_other_requests_do_not_use_up_the_sign_in_limit(): void
    {
        for ($i = 1; $i <= 15; $i++) {
            $this->getJson('http://focusair.f16sefreight.com/api/get-public-blogs');
        }

        $status = $this->postJson('http://focusair.f16sefreight.com/api/login', ['email' => 'nobody@test.local', 'password' => 'wrong'])->status();

        $this->assertNotSame(429, $status, 'Fifteen page loads used up the ten sign-in attempts.');
    }

    public function test_the_sign_in_limit_itself_still_holds(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            $this->postJson('http://focusair.f16sefreight.com/api/login', ['email' => 'nobody@test.local', 'password' => 'wrong']);
        }

        $this->postJson('http://focusair.f16sefreight.com/api/login', ['email' => 'nobody@test.local', 'password' => 'wrong'])
            ->assertStatus(429);
    }

    /** Behind a load balancer every visitor has its address unless it is trusted to say whose request this is. */
    public function test_a_trusted_proxy_passes_on_the_visitors_address(): void
    {
        $seen = function () {
            $request = Request::create('/x', 'GET', server: ['REMOTE_ADDR' => '10.0.0.5', 'HTTP_X_FORWARDED_FOR' => '203.0.113.9']);

            return app(\App\Http\Middleware\TrustProxies::class)->handle($request, fn ($r) => $r->ip());
        };

        config()->set('app.trusted_proxies', '');
        $this->assertSame('10.0.0.5', $seen(), 'With nothing trusted, a forwarded address must not be believed.');

        config()->set('app.trusted_proxies', '10.0.0.5');
        $this->assertSame('203.0.113.9', $seen());

        // Reset what Symfony keeps statically, for the tests after this one.
        Request::setTrustedProxies([], Request::HEADER_X_FORWARDED_FOR);
    }

    /** `jobs` is the shipments table; queued work must never be written into it. */
    public function test_the_database_queue_does_not_use_the_shipments_table(): void
    {
        $this->assertNotSame('jobs', config('queue.connections.database.table'));
    }

    /** A scheduler killed mid-run must not leave a command locked out for a day. */
    public function test_no_scheduled_command_holds_its_lock_for_a_day(): void
    {
        $events = app(\Illuminate\Console\Scheduling\Schedule::class)->events();
        $this->assertNotEmpty($events);

        foreach ($events as $event) {
            if ($event->withoutOverlapping) {
                $this->assertLessThanOrEqual(180, $event->expiresAt, "{$event->command} keeps its lock for {$event->expiresAt} minutes.");
            }
        }
    }

    /** `$tries = 3` did nothing: the job caught its own failure and marked the document failed on the first one. */
    public function test_a_document_is_tried_again_when_the_parser_cannot_be_reached(): void
    {
        [$job, $extraction] = $this->ocrJob();
        Http::fake(fn () => throw new \Illuminate\Http\Client\ConnectionException('cURL error 7: Failed to connect to ocr port 8001'));

        $queued = \Mockery::mock(\Illuminate\Contracts\Queue\Job::class);
        $queued->shouldReceive('attempts')->andReturn(1);
        $queued->shouldReceive('release')->once()->with(5);
        $job->setJob($queued);

        $job->handle();

        $this->assertSame('pending', $extraction->fresh()->status);
    }

    public function test_the_last_try_marks_the_document_failed(): void
    {
        [$job, $extraction] = $this->ocrJob();
        Http::fake(fn () => throw new \Illuminate\Http\Client\ConnectionException('cURL error 7: Failed to connect to ocr port 8001'));

        $queued = \Mockery::mock(\Illuminate\Contracts\Queue\Job::class);
        $queued->shouldReceive('attempts')->andReturn(3);
        $queued->shouldNotReceive('release');
        $job->setJob($queued);

        $job->handle();

        $this->assertSame('failed', $extraction->fresh()->status);
    }

    public function test_a_parser_that_timed_out_is_not_asked_again(): void
    {
        [$job, $extraction] = $this->ocrJob();
        Http::fake(fn () => throw new \Illuminate\Http\Client\ConnectionException('cURL error 28: Operation timed out after 80001 milliseconds'));

        $queued = \Mockery::mock(\Illuminate\Contracts\Queue\Job::class);
        $queued->shouldReceive('attempts')->andReturn(1);
        $queued->shouldNotReceive('release');
        $job->setJob($queued);

        $job->handle();

        $this->assertSame('failed', $extraction->fresh()->status);
    }

    private function ocrJob(): array
    {
        $company = Company::create(['name' => 'Ocr Retry Co', 'code' => 'ORT', 'tier' => 'command']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'B', 'branch_code' => 'BOM']);
        $user = User::create(['name' => 'U', 'email' => 'ocr-retry@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'operations']);

        Storage::fake('pdf_temp');
        Storage::disk('pdf_temp')->put('retry.pdf', '%PDF-1.4');

        $extraction = PdfProcessingJob::create(['user_id' => $user->id, 'original_filename' => 'awb.pdf', 'status' => 'pending',
            'page_count' => 1, 'document_type' => 'MAWB', 'temp_file_path' => 'retry.pdf']);

        return [new ProcessPdfOcrJob($extraction->id), $extraction];
    }
}
