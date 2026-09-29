<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

/**
 * A bill of lading (or a carrier's booking) as the model read it, turned into the FocusSea form's own fields
 * (guide Step 12.4).
 *
 * 🔴 **Read at full fidelity, checked here, decided by a person** (guide §4.1.2). The model's answer carries no
 * lengths and no codes; this is where each value meets the form's rule: a BL number over ICEGATE's 20 characters, a
 * container that fails its ISO 6346 check digit, an HS code that is not 6–10 digits. A value with a problem is shown
 * with the problem and NOT ticked, so it never reaches the bill unless somebody fixes or chooses it.
 *
 * ⚠️ Nothing here is guessed. A port is given its UN/LOCODE only when the port directory names exactly one sea port
 * that way; a carrier only when one of the branch's shipping lines has that name; a party is only MATCHED to a client
 * or partner, never created. Anything else is shown as written for the person to choose.
 */
class SeaBillReading
{
    /** The form's own field for each thing a bill says, with the label the person reads. */
    private const FIELDS = [
        'bl_number'             => 'BL number',
        'vessel_name'           => 'Vessel',
        'voyage_no'             => 'Voyage',
        'carrier_id'            => 'Carrier',
        'por_code'              => 'Place of receipt',
        'pol_code'              => 'Port of loading',
        'pod_code'              => 'Port of discharge',
        'del_code'              => 'Place of delivery',
        'commodity_description' => 'Description',
        'hs_code'               => 'HS code',
        'marks_numbers'         => 'Marks & numbers',
        'piece_count'           => 'Packages',
        'package_code'          => 'Package code',
        'gross_weight'          => 'Gross weight (kg)',
        'volume_cbm'            => 'Volume (CBM)',
    ];

    /** Where each port-like answer goes on the form. */
    private const PORTS = [
        'place_of_receipt'  => 'por_code',
        'port_of_loading'   => 'pol_code',
        'port_of_discharge' => 'pod_code',
        'place_of_delivery' => 'del_code',
    ];

    public function __construct(private readonly IcegateValidator $icegate) {}

    /**
     * @param  array  $bill     the model's answer (`extracted_data.bill`)
     * @param  int    $agentId  the branch whose partners and clients a name may match
     * @return array{fields: array, containers: array, parties: array}
     */
    public function read(array $bill, int $agentId): array
    {
        $rows = [];

        $rows[] = $this->row('bl_number', $bill['bl_number'] ?? null, fn ($v) => mb_strlen($v) > 20
            ? 'Longer than the 20 characters ICEGATE takes — shorten it on the form.' : null);
        $rows[] = $this->row('vessel_name', $bill['vessel_name'] ?? null, fn ($v) => mb_strlen($v) > 100 ? 'Longer than 100 characters.' : null);
        $rows[] = $this->row('voyage_no', $bill['voyage_no'] ?? null, fn ($v) => mb_strlen($v) > 30 ? 'Longer than 30 characters.' : null);
        $rows[] = $this->carrier($bill['carrier_name'] ?? null, $agentId);

        foreach (self::PORTS as $read => $field) {
            $rows[] = $this->port($field, $bill[$read] ?? null);
        }

        $rows[] = $this->row('commodity_description', $bill['description'] ?? null, fn ($v) => mb_strlen($v) > 500 ? 'Longer than 500 characters.' : null);
        $rows[] = $this->row('hs_code', isset($bill['hs_code']) ? preg_replace('/\D/', '', (string) $bill['hs_code']) : null,
            fn ($v) => preg_match('/^\d{6,10}$/', $v) ? null : 'An HS code is 6 to 10 digits.', $bill['hs_code'] ?? null);
        $rows[] = $this->row('marks_numbers', $bill['marks_numbers'] ?? null);
        $rows[] = $this->row('piece_count', isset($bill['package_count']) ? (int) $bill['package_count'] : null);
        // ⚠️ ICEGATE's package code is three letters (PLT, CTN). A bill prints "PALLETS" — a code is not guessed from it.
        $rows[] = $this->row('package_code', $bill['package_type'] ?? null,
            fn ($v) => preg_match('/^[A-Za-z]{1,3}$/', $v) ? null : 'The package code is up to 3 letters (e.g. PLT, CTN) — choose it on the form.');
        $rows[] = $this->row('gross_weight', isset($bill['gross_weight']) ? (float) $bill['gross_weight'] : null);
        $rows[] = $this->row('volume_cbm', isset($bill['volume_cbm']) ? (float) $bill['volume_cbm'] : null);

        return [
            'fields'     => array_values(array_filter($rows, fn ($r) => $r['read'] !== null)),
            'containers' => $this->containers($bill['container_numbers'] ?? null, $bill['seal_numbers'] ?? null),
            'parties'    => array_values(array_filter([
                $this->party('shipper', $bill['shipper_name'] ?? null, $bill['shipper_address'] ?? null, $agentId),
                $this->party('consignee', $bill['consignee_name'] ?? null, $bill['consignee_address'] ?? null, $agentId),
                $this->party('notify_party', $bill['notify_name'] ?? null, null, $agentId),
            ])),
        ];
    }

    /** One field: the value for the form, what the bill said, and the problem if there is one. */
    private function row(string $key, mixed $value, ?callable $check = null, mixed $read = null): array
    {
        $value = is_string($value) ? trim($value) : $value;
        $value = $value === '' ? null : $value;
        $problem = $value !== null && $check !== null ? $check((string) $value) : null;

        return ['key' => $key, 'label' => self::FIELDS[$key], 'value' => $problem === null ? $value : null,
            'read' => $read ?? $value, 'problem' => $problem, 'apply' => $value !== null && $problem === null];
    }

    /** A port as a UN/LOCODE: printed as one, or the ONE sea port the directory names that way. */
    private function port(string $field, ?string $read): array
    {
        $read = $read !== null ? trim($read) : null;

        if ($read === null || $read === '') {
            return $this->row($field, null);
        }

        $code = preg_match('/^[A-Z]{2}[A-Z0-9]{3}$/', strtoupper(str_replace(' ', '', $read))) && DB::table('ports')
            ->where('locode', strtoupper(str_replace(' ', '', $read)))->exists()
            ? strtoupper(str_replace(' ', '', $read))
            : null;

        if ($code === null) {
            $name = strtoupper(preg_replace('/\s*,.*$/', '', $read));
            $found = DB::table('ports')->where('port_type', 'sea')->where('is_active', 1)
                ->whereRaw('UPPER(port_name) = ?', [$name])->limit(2)->pluck('locode');
            $code = $found->count() === 1 ? $found->first() : null;
        }

        return ['key' => $field, 'label' => self::FIELDS[$field], 'value' => $code, 'read' => $read,
            'problem' => $code === null ? 'No single UN/LOCODE is named "' . $read . '" — choose the port on the form.' : null,
            'apply' => $code !== null];
    }

    /** The carrier, when one of the branch's shipping lines has exactly that name. */
    private function carrier(?string $name, int $agentId): array
    {
        $name = $name !== null ? trim($name) : null;

        if ($name === null || $name === '') {
            return $this->row('carrier_id', null);
        }

        $companyId = DB::table('agents_info')->where('id', $agentId)->value('company_id');
        $found = DB::table('partners')->where('company_id', $companyId)->where('partner_type', 'shipping_line')
            ->whereRaw('UPPER(name) = ?', [strtoupper($name)])->limit(2)->pluck('id');

        return ['key' => 'carrier_id', 'label' => self::FIELDS['carrier_id'], 'value' => $found->count() === 1 ? $found->first() : null,
            'read' => $name, 'problem' => $found->count() === 1 ? null : 'Not one of your shipping lines by that name — choose the carrier on the form.',
            'apply' => $found->count() === 1];
    }

    /**
     * Each container with its seal. Seals pair with containers in the order printed only when the counts agree —
     * otherwise a seal on the wrong box is worse than none, and the seals are left for the person.
     */
    private function containers(?string $numbers, ?string $seals): array
    {
        $boxes = array_values(array_filter(array_map('trim', preg_split('/[,;\s]+/', strtoupper((string) $numbers)))));
        $sealList = array_values(array_filter(array_map('trim', preg_split('/[,;\s]+/', (string) $seals))));
        $paired = count($boxes) === count($sealList);

        return array_map(function (string $number, int $i) use ($sealList, $paired) {
            $seal = $paired ? $sealList[$i] : null;
            $problem = ! $this->icegate->isValidContainerNumber($number) ? 'Fails the ISO 6346 check digit — check the number.'
                : ($seal !== null && mb_strlen($seal) > 15 ? 'The seal is longer than 15 characters.' : null);

            return ['container_number' => $number, 'seal_number' => $seal, 'problem' => $problem, 'apply' => $problem === null];
        }, $boxes, array_keys($boxes));
    }

    /** A party as written, with the client or partner of the same name when there is exactly one. Never created. */
    private function party(string $role, ?string $name, ?string $address, int $agentId): ?array
    {
        $name = $name !== null ? trim($name) : '';

        if ($name === '') {
            return null;
        }

        $companyId = DB::table('agents_info')->where('id', $agentId)->value('company_id');
        $customers = DB::table('customers')->where('company_id', $companyId)->whereRaw('UPPER(name) = ?', [strtoupper($name)])->limit(2)->pluck('name', 'id');
        $partners = DB::table('partners')->where('company_id', $companyId)->whereRaw('UPPER(name) = ?', [strtoupper($name)])->limit(2)->pluck('name', 'id');

        $match = match (true) {
            $customers->count() === 1 && $partners->isEmpty() => ['party_type' => 'customer', 'party_id' => $customers->keys()->first(), 'name' => $customers->first()],
            $partners->count() === 1 && $customers->isEmpty() => ['party_type' => 'partner', 'party_id' => $partners->keys()->first(), 'name' => $partners->first()],
            default => null,
        };

        return ['role' => $role, 'name' => $name, 'address' => $address, 'match' => $match];
    }
}
