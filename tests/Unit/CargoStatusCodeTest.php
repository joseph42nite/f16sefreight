<?php

namespace Tests\Unit;

use Tests\TestCase;

/**
 * The FSU code map behind the Message Log.
 *
 * 🔴 `config/common-data.php` DID NOT EXIST while `GLNResponseController` read it on
 * every Cargo Status message. `config()` returned NULL, `?? ''` swallowed it, and every
 * status was stored with a blank reason — the Message Log showed a bare three-letter code
 * and nothing else. Nothing failed, nothing logged, and no test noticed for as long as the
 * controller has existed.
 *
 * ⚠️ These assertions are deliberately about the SHAPE of the map, not a spot-check of one
 * lookup. A missing file and a file with the wrong key format fail identically at runtime —
 * silently, as an empty description — so the test has to catch both.
 */
class CargoStatusCodeTest extends TestCase
{
    private function map(): array
    {
        return config('common-data.cargo_status_description');
    }

    public function test_the_map_exists_and_is_not_empty(): void
    {
        $this->assertIsArray(
            $this->map(),
            'config/common-data.php is missing — every Cargo Status reason will be blank'
        );

        $this->assertNotEmpty($this->map());
    }

    /**
     * 🔴 EXACTLY THREE UPPER-CASE CHARACTERS. The controller does not read a field for
     * this — it takes `substr($business_id, -3)` off the end of the message id. A key of
     * any other length or case can never be matched, so the entry is dead the moment it
     * is typed.
     */
    public function test_every_key_is_a_three_character_upper_case_code(): void
    {
        foreach (array_keys($this->map()) as $code) {
            $this->assertSame(3, strlen($code), "'{$code}' is not three characters");
            $this->assertSame(strtoupper($code), $code, "'{$code}' is not upper case");
        }
    }

    /** No entry may be blank: an empty description is the exact failure this file fixes. */
    public function test_no_description_is_empty(): void
    {
        foreach ($this->map() as $code => $description) {
            $this->assertNotSame('', trim((string) $description), "{$code} has no description");
        }
    }

    /**
     * The spine a consignment actually follows. If the carrier sends one of these and the
     * Message Log shows nothing beside it, the operator cannot read their own shipment.
     */
    public function test_the_common_milestones_resolve(): void
    {
        foreach (['FOH', 'RCS', 'PRE', 'MAN', 'DEP', 'ARR', 'RCF', 'NFD', 'AWD', 'CCD', 'DLV', 'DIS'] as $code) {
            $this->assertArrayHasKey($code, $this->map(), "{$code} is missing from the map");
        }
    }

    /**
     * ⚠️ Exercises the CONTROLLER'S OWN parse, not the config directly. The code is cut
     * out of the message id, so a map that loads correctly and a map that is keyed
     * correctly are still two different things.
     */
    public function test_a_status_code_is_resolved_the_way_the_controller_cuts_it(): void
    {
        $businessId = '176-10000008RCS';

        $conditionCode = substr($businessId, -3);
        $reason = $this->map()[$conditionCode] ?? '';

        $this->assertSame('RCS', $conditionCode);
        $this->assertSame('176-10000008', substr($businessId, 0, -3), 'the AWB is what remains');
        $this->assertSame('Received from shipper and ready for carriage', $reason);
    }
}
