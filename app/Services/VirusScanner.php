<?php

namespace App\Services;

use RuntimeException;

/**
 * ClamAV, over clamd's INSTREAM protocol (guide §4.2: "ClamAV scan before any attachment is
 * persisted").
 *
 * 🔴 FAILS CLOSED. A scanner that cannot be reached throws, and the caller neither stores nor
 * serves the file. "The scanner was down so we let it through" is the one outcome a scan exists
 * to prevent.
 *
 * ⚠️ Streamed over TCP, so Laravel and clamd share no filesystem — the same code works with
 * clamd in Docker, on another host, or in the same container.
 */
class VirusScanner
{
    /** clamd's default StreamMaxLength is 25 MB, the same as the provider's attachment cap. */
    private const CHUNK = 65536;

    /**
     * @return array{clean: bool, signature: ?string}
     *
     * @throws RuntimeException when clamd cannot be reached or answers something unreadable
     */
    public function scan(string $bytes): array
    {
        $host = config('services.clamav.host');
        $port = (int) config('services.clamav.port');

        $socket = @stream_socket_client("tcp://{$host}:{$port}", $errno, $error, 5);

        if ($socket === false) {
            throw new RuntimeException("The virus scanner is not reachable ({$error}).");
        }

        stream_set_timeout($socket, 60);

        try {
            fwrite($socket, "zINSTREAM\0");

            foreach (str_split($bytes, self::CHUNK) as $chunk) {
                fwrite($socket, pack('N', strlen($chunk)) . $chunk);
            }

            fwrite($socket, pack('N', 0));

            $reply = trim((string) stream_get_contents($socket), "\0 \n");
        } finally {
            fclose($socket);
        }

        // "stream: OK" or "stream: Eicar-Test-Signature FOUND".
        if (preg_match('/^stream: OK$/', $reply)) {
            return ['clean' => true, 'signature' => null];
        }

        if (preg_match('/^stream: (.+) FOUND$/', $reply, $m)) {
            return ['clean' => false, 'signature' => $m[1]];
        }

        throw new RuntimeException('The virus scanner gave no verdict: ' . ($reply === '' ? 'no reply' : $reply));
    }
}
