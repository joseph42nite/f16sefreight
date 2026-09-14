<?php

namespace Tests\Unit;

use App\Jobs\ProcessPdfOcrJob;
use Tests\TestCase;

/**
 * The limits on reading a document, which have to nest.
 *
 * 🔴 An unstructured document is read by Gemma 4 on OpenRouter: three attempts of 12s each in the
 * parser, then Laravel's HTTP call to the parser, then the queue job. Each has to outlast the one
 * inside it, and the queue's `retry_after` has to outlast the job, or a second worker starts
 * reading the same document while the first is still on it.
 */
class OcrJobTimeoutTest extends TestCase
{
    public function test_an_awb_keeps_its_short_limit(): void
    {
        $this->assertSame(80, ProcessPdfOcrJob::httpTimeoutFor(['action' => 'extract']));
    }

    public function test_a_model_reading_outlasts_the_parsers_own_attempts(): void
    {
        // Three attempts of 12s (python/model_extract.py). Laravel has to wait longer, so the
        // parser's "timed out" answer arrives instead of a dropped call.
        $this->assertGreaterThan(3 * 12, ProcessPdfOcrJob::httpTimeoutFor(['action' => 'extract_unstructured']));
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
