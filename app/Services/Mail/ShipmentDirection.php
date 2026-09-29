<?php

namespace App\Services\Mail;

use Illuminate\Support\Facades\DB;

/**
 * Import or export, from a mail's lane — a FACT, so it outranks Jev's reading (GAPS #437).
 *
 * Our country is the branch's own (`agents_info.agent_country`, named, mapped through config/country.php). A lane
 * ending in it and starting abroad is an import; the reverse, an export; anything else says nothing. Air codes are
 * IATA and resolve through `locations`; sea codes are UN/LOCODE, whose first two letters ARE the country.
 */
class ShipmentDirection
{
    /** @param array $cargo the staged cargo — `origin` / `destination` as {value, confidence} */
    public function fromCargo(array $cargo, int $agentId): ?string
    {
        $home = $this->home($agentId);
        $from = $this->country($cargo['origin']['value'] ?? null);
        $to = $this->country($cargo['destination']['value'] ?? null);

        if ($home === null || $from === null || $to === null || $from === $to) {
            return null;
        }

        return match ($home) {
            $to     => 'import',
            $from   => 'export',
            default => null,
        };
    }

    private function home(int $agentId): ?string
    {
        // Stored both ways on real branches — "IN" and "India" — so both are read.
        $name = trim((string) DB::table('agents_info')->where('id', $agentId)->value('agent_country'));

        if (strlen($name) === 2 && array_key_exists(strtoupper($name), config('country', []))) {
            return strtoupper($name);
        }

        $code = $name === '' ? false : array_search(strtolower($name), array_map('strtolower', config('country', [])), true);

        return $code === false ? null : $code;
    }

    /**
     * An airport's country from the ports directory, when `locations` has none: its airports are listed under their
     * UN/LOCODE, which is the country plus — for most airports — the IATA code. Used only when exactly one airport
     * matches; an ambiguous code decides nothing.
     */
    private function airportCountry(string $iata): ?string
    {
        $countries = DB::table('ports')->where('port_type', 'air')->where('locode', 'like', '__' . $iata)
            ->distinct()->pluck('country_code');

        return $countries->count() === 1 ? $countries->first() : null;
    }

    private function country(?string $code): ?string
    {
        $code = strtoupper(trim((string) $code));

        return match (strlen($code)) {
            5 => substr($code, 0, 2),
            3 => DB::table('locations')->where('iata_code', $code)->value('country_code') ?? $this->airportCountry($code),
            default => null,
        };
    }
}
