<?php

namespace Tests\Feature;

use App\Location;
use App\SuperAdmin;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The airport list behind every waybill form's autocomplete. It is cached for good, so an empty answer must never
 * be the one that is kept (found 2026-11-16: the dev cache held an empty list while the table had rows).
 */
class LocationListCacheTest extends TestCase
{
    use DatabaseTransactions;

    private const KEY = 'locations_destination_iata';

    private mixed $before;

    protected function setUp(): void
    {
        parent::setUp();

        // The cache may be shared with the dev site: put back whatever was there.
        $this->before = Cache::get(self::KEY);
        $this->actingAs(SuperAdmin::create(['name' => 'Staff', 'email' => 'loc-' . uniqid() . '@test.local',
            'password' => Hash::make('x')]), 'superAdmin-api');
    }

    protected function tearDown(): void
    {
        $this->before === null ? Cache::forget(self::KEY) : Cache::forever(self::KEY, $this->before);

        parent::tearDown();
    }

    public function test_an_empty_list_is_not_kept(): void
    {
        Location::query()->delete();
        Cache::forget(self::KEY);

        $this->getJson('/api/superadmin/get-location')->assertOk()->assertJsonCount(0);
        $this->assertNull(Cache::get(self::KEY));

        Location::create(['destination' => 'Dubai', 'iata_code' => 'DXB']);

        $this->getJson('/api/superadmin/get-location')->assertOk()->assertJsonCount(1)->assertJsonPath('0.iata_code', 'DXB');
        $this->assertCount(1, Cache::get(self::KEY));
    }

    public function test_an_empty_list_already_kept_is_read_again(): void
    {
        Location::query()->delete();
        Location::create(['destination' => 'Chennai', 'iata_code' => 'MAA']);
        Cache::forever(self::KEY, collect());

        $this->getJson('/api/superadmin/get-location')->assertOk()->assertJsonCount(1)->assertJsonPath('0.iata_code', 'MAA');
    }
}
