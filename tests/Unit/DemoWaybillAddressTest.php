<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

/**
 * Walk 7: every demo waybill was refused at Generate PDF — "ship address — Line 1 is 37 characters. Cargo-IMP allows
 * 35 per line" — because the seeder wrote "Plot 42/A, MIDC Andheri East (Gate 3)". The demo has to be clickable end to
 * end, so every address line the demo writes onto a waybill keeps to the 35 characters the form enforces.
 */
class DemoWaybillAddressTest extends TestCase
{
    public function test_every_demo_waybill_address_fits_a_cargo_imp_line(): void
    {
        $source = file_get_contents(__DIR__ . '/../../database/seeds/FreightDemoSeeder.php');
        preg_match_all("/'(?:ship|cons|also)_(?:name|address|address_line_2)' => '([^']*)'/", $source, $m);

        $this->assertNotEmpty($m[1]);
        foreach ($m[1] as $line) {
            $this->assertLessThanOrEqual(35, mb_strlen($line), "\"{$line}\" is " . mb_strlen($line) . ' characters.');
        }
    }
}
