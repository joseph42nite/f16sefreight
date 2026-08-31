<?php

/**
 * A standalone minting child for EnquirySequenceConcurrencyTest.
 *
 * ⚠️ This exists because `artisan tinker --execute` is NOT usable as a subprocess:
 * PsySH opens TTY mode and dies with "TTY mode requires /dev/tty to be read/writable"
 * when stdout is a pipe. Children failed silently and the test passed vacuously on the
 * handful that survived — so the vehicle had to be something that boots the framework
 * and nothing else.
 *
 * Usage:  php tests/Support/mint_sequence.php <agent_id> <prefix> <count>
 * Emits one document number per line on stdout. Any failure goes to stderr and exits 1,
 * so the parent can report the real reason rather than an empty pipe.
 */

require __DIR__ . '/../../vendor/autoload.php';

$app = require __DIR__ . '/../../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

[$agentId, $prefix, $count] = [(int) ($argv[1] ?? 0), $argv[2] ?? 'ENQA', (int) ($argv[3] ?? 1)];

try {
    $service = $app->make(App\Services\EnquirySequenceService::class);

    for ($i = 0; $i < $count; $i++) {
        echo $service->next($agentId, $prefix), PHP_EOL;
    }
} catch (Throwable $e) {
    fwrite(STDERR, get_class($e) . ': ' . $e->getMessage() . PHP_EOL);
    exit(1);
}
