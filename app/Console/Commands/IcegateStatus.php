<?php

namespace App\Console\Commands;

use App\Services\IcegateConnection;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Throwable;

/**
 * `php artisan icegate:status [--ping]` — run it after putting the developer portal's keys in .env.
 *
 * Says which ICEGATE keys are set (names only, never values) and whether Auto File can run. `--ping` makes one GET to
 * ICEGATE_BASE_URL and reports the HTTP status, so a wrong URL or a blocked network shows up here, not on a filing.
 */
class IcegateStatus extends Command
{
    protected $signature = 'icegate:status {--ping : Make one GET request to ICEGATE_BASE_URL}';

    protected $description = 'Report whether ICEGATE filing is connected, and what is missing';

    public function handle(IcegateConnection $connection): int
    {
        $status = $connection->status();

        $this->line('Environment: ' . $status['environment']);

        foreach (config('icegate.required') as $key) {
            $this->line(sprintf('  %-22s %s', $key, in_array($key, $status['missing'], true) ? 'missing' : 'set'));
        }

        $this->line('Auto File: ' . ($status['can_transmit'] ? 'ready' : 'not ready — ' . $status['reason']));

        if ($this->option('ping')) {
            if (blank(config('icegate.base_url'))) {
                $this->error('Cannot ping: ICEGATE_BASE_URL is not set.');

                return self::FAILURE;
            }

            try {
                $response = Http::timeout(config('icegate.timeout'))->get(config('icegate.base_url'));
                $this->line('Ping: HTTP ' . $response->status());
            } catch (Throwable $e) {
                $this->error('Ping failed: ' . $e->getMessage());

                return self::FAILURE;
            }
        }

        return self::SUCCESS;
    }
}
