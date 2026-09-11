<?php

namespace Tests\Unit;

use App\Jobs\ProcessPdfOcrJob;
use Tests\TestCase;

/**
 * The limits on reading a document, which have to nest.
 *
 * 🔴 An unstructured document is read by a model now, and gemma3:4b took 378s on a two-page
 * invoice. Three limits sit on that path: the parser's own model timeout (600s), Laravel's
 * HTTP call to the parser, and the queue job. Each has to outlast the one inside it, and the
 * queue's `retry_after` has to outlast the job, or a second worker starts reading the same
 * document while the first is still on it. The old values (60s, 80s, 90s) timed out every
 * real document, and nothing reported it.
 */
class OcrJobTimeoutTest extends TestCase
{
    public function test_an_awb_keeps_its_short_limit(): void
    {
        $this->assertSame(80, ProcessPdfOcrJob::httpTimeoutFor(['action' => 'extract']));
    }

    public function test_a_model_reading_outlasts_the_parsers_own_timeout(): void
    {
        // The parser gives the model 600s (python/model_extract.py TIMEOUT_SECONDS). Laravel
        // has to wait longer, so the parser's "timed out" answer arrives instead of a dropped call.
        $this->assertGreaterThan(600, ProcessPdfOcrJob::httpTimeoutFor(['action' => 'extract_unstructured']));
    }

    public function test_the_job_outlasts_its_longest_http_call(): void
    {
        $job = new ProcessPdfOcrJob(1);

        $this->assertGreaterThan(ProcessPdfOcrJob::MODEL_HTTP_TIMEOUT, $job->timeout);
    }

    public function test_the_queue_does_not_hand_a_running_job_to_a_second_worker(): void
    {
        $job = new ProcessPdfOcrJob(1);

        foreach (['database', 'redis'] as $connection) {
            $this->assertGreaterThan(
                $job->timeout,
                config("queue.connections.$connection.retry_after"),
                "$connection retry_after must exceed the job timeout"
            );
        }
    }
}
