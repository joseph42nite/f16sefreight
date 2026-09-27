<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();

        // ⚠️ The whole suite runs in ONE process, and the legacy PDF generators call set_time_limit(300) on every
        // request they serve — so once a test has hit one, every test after it shares that one limit, counted in
        // CPU time. On a loaded machine the suite died 900 tests in with "Maximum execution time of 300 seconds
        // exceeded" in a test that had nothing to do with PDFs (GAPS #417). Each test starts unlimited, as a CLI does.
        set_time_limit(0);
    }
}
