<?php

namespace App\Console\Commands;

use App\Services\Bank\SetuAccountAggregator;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Throwable;

/**
 * `php artisan setu:status [--ping]` — run it after putting Setu's keys in .env. Names only, never values.
 * `--ping` makes one GET to SETU_AA_BASE_URL, so a wrong URL or a blocked network shows up here, not on a bank account.
 */
class SetuStatus extends Command
{
    protected $signature = 'setu:status {--ping : Make one GET request to SETU_AA_BASE_URL}';

    protected $description = 'Report whether the Setu bank feed is connected, and what is missing';

    public function handle(SetuAccountAggregator $setu): int
    {
        $missing = $setu->missing();

        $this->line('Environment: ' . config('setu.environment'));
        foreach (config('setu.required') as $key) {
            $this->line(sprintf('  %-30s %s', $key, in_array($key, $missing, true) ? 'missing' : 'set'));
        }
        $this->line('Bank feed: ' . ($missing === [] ? 'ready' : 'not ready'));

        if ($this->option('ping')) {
            if (blank(config('setu.base_url'))) {
                $this->error('Cannot ping: SETU_AA_BASE_URL is not set.');

                return self::FAILURE;
            }

            try {
                $this->line('Ping: HTTP ' . Http::timeout(10)->get((string) config('setu.base_url'))->status());
            } catch (Throwable $e) {
                $this->error('Ping failed: ' . $e->getMessage());

                return self::FAILURE;
            }
        }

        return $missing === [] ? self::SUCCESS : self::FAILURE;
    }
}
