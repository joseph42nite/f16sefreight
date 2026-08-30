<?php

namespace App\Services;

use App\Job;
use Illuminate\Support\Facades\DB;

/**
 * ICEGATE / Cargo-XML structural validation — guide §4.1.2, PRD.md §5.8/§5.9.
 *
 * 🔴 **VALIDATE AFTER EXTRACTION, NEVER DURING IT.** The extraction schema deliberately
 * carries no `maxLength`: a 35-char cap on a shipper name makes the model silently
 * truncate a 60-character legal name, destroying data at parse time with nothing
 * raised. A name too long for Cargo-XML is a real problem a HUMAN must decide how to
 * abbreviate — a truncated consignee on a customs declaration is not recoverable.
 *
 * So this class never edits anything. It reports, and the operator resolves.
 *
 * ⚠️ **Two of these rules are not per-field checks and are missed by anyone reading
 * the constraint table literally:**
 *   1. house piece counts must sum to the master EXACTLY
 *   2. an IMDG class REQUIRES a UN number
 * Both are form-level assertions across rows, and both are customs rejections.
 */
class IcegateValidator
{
    /** Sea — PRD.md §5.8. */
    private const SEA_LIMITS = [
        'mbl_number'   => 20,
        'hbl_number'   => 20,
        'seal_number'  => 15,
        'package_code' => 3,
    ];

    /** Air — Cargo-IMP's legacy line limit, and the IATA field caps. */
    public const CARGO_IMP_LINE = 35;
    public const NAME_MAX = 50;
    public const ADDRESS_CUMULATIVE_MAX = 500;
    public const ICEGATE_ID_MAX = 20;

    /**
     * Every violation on one job, worst first.
     *
     * Returns ALL of them, never the first — an operator fixing a manifest wants the
     * whole list in one pass. Surfacing one at a time turns a five-minute correction
     * into five round trips through a customs gateway.
     *
     * @return list<array{field: string, rule: string, message: string, severity: string, value: mixed}>
     */
    public function validate(Job $job): array
    {
        return $job->transport_mode === 'sea'
            ? $this->validateSea($job)
            : $this->validateAir($job);
    }

    private function validateSea(Job $job): array
    {
        $v = [];
        $details = DB::table('sea_shipment_details')->where('job_id', $job->id)->first();

        if ($details === null) {
            return [[
                'field' => 'sea_shipment_details', 'rule' => 'required',
                'message' => 'This job has no verified shipment details, so there is nothing to file.',
                'severity' => 'blocking', 'value' => null,
            ]];
        }

        foreach (self::SEA_LIMITS as $field => $max) {
            if (property_exists($details, $field)) {
                $v = array_merge($v, $this->lengthCheck($field, $details->$field, $max));
            }
        }

        // ⚠️ An IMDG class REQUIRES a UN number. Dangerous goods declared by class with
        // no substance identified is a filing customs will reject outright, and it is
        // the rule most easily lost because the two fields sit on different tabs.
        if (! blank($details->imdg_class) && blank($details->un_number)) {
            $v[] = [
                'field' => 'un_number', 'rule' => 'imdg_requires_un',
                'message' => "IMDG class {$details->imdg_class} is declared with no UN number. "
                           . 'Dangerous goods must identify the substance, not only its class.',
                'severity' => 'blocking', 'value' => null,
            ];
        }

        if (! blank($details->imo_number) && ! preg_match('/^[0-9]{7}$/', (string) $details->imo_number)) {
            $v[] = [
                'field' => 'imo_number', 'rule' => 'imo_format',
                'message' => 'An IMO number is exactly seven digits.',
                'severity' => 'blocking', 'value' => $details->imo_number,
            ];
        }

        // 14 digits with 3 decimals — the ICEGATE gross-weight field width.
        if (! blank($details->gross_weight) && ! preg_match('/^\d{1,11}(\.\d{1,3})?$/', (string) (float) $details->gross_weight)) {
            $v[] = [
                'field' => 'gross_weight', 'rule' => 'weight_precision',
                'message' => 'Gross weight must fit 14 digits with at most 3 decimals.',
                'severity' => 'blocking', 'value' => $details->gross_weight,
            ];
        }

        foreach (DB::table('sea_containers')->where('job_id', $job->id)->whereNull('deleted_at')->get() as $c) {
            $v = array_merge($v, $this->lengthCheck('seal_number', $c->seal_number, 15));

            if (! $this->isValidContainerNumber($c->container_number)) {
                $v[] = [
                    'field' => 'container_number', 'rule' => 'iso_6346',
                    'message' => "Container {$c->container_number} fails the ISO 6346 check digit. "
                               . 'A mistyped container number is rejected at the gate, not at filing.',
                    'severity' => 'blocking', 'value' => $c->container_number,
                ];
            }
        }

        return array_merge($v, $this->pieceCountReconciliation($job, $details));
    }

    private function validateAir(Job $job): array
    {
        $v = [];

        // MAWB lives on the job itself; the format is NNN-NNNNNNNN, 11 characters.
        if (! blank($job->awb_number) && ! preg_match('/^\d{3}-\d{8}$/', (string) $job->awb_number)) {
            $v[] = [
                'field' => 'awb_number', 'rule' => 'mawb_format',
                'message' => 'A master air waybill is 11 characters in the form NNN-NNNNNNNN.',
                'severity' => 'blocking', 'value' => $job->awb_number,
            ];
        }

        $details = DB::table('air_shipment_details')->where('job_id', $job->id)->first();

        if ($details === null) {
            return array_merge($v, [[
                'field' => 'air_shipment_details', 'rule' => 'required',
                'message' => 'This job has no verified shipment details, so there is nothing to file.',
                'severity' => 'blocking', 'value' => null,
            ]]);
        }

        // 🔴 Cargo-IMP's 35-character limit is PER LINE, not per field. An address that
        // fits in 500 characters overall still fails if any single line exceeds 35, and
        // checking only the total is the mistake that makes this rule feel arbitrary.
        foreach (['pickup_address', 'delivery_address'] as $field) {
            $v = array_merge($v, $this->lineCheck($field, $details->$field ?? null));
        }

        foreach (['carrier_name' => self::NAME_MAX] as $field => $max) {
            $v = array_merge($v, $this->lengthCheck($field, $details->$field ?? null, $max));
        }

        return $v;
    }

    /**
     * 🔴 **HOUSE PIECE COUNTS MUST TOTAL THE MASTER EXACTLY** — cross-row, not
     * per-field, and a customs rejection when it is wrong. A consol whose houses sum
     * to 47 against a master of 48 means one house is unmanifested cargo.
     *
     * Skipped entirely when the job has no houses: a direct shipment is not a consol
     * with zero children, and reporting "0 of 12 pieces manifested" on one would be
     * a false blocker on every straight job in the system.
     */
    private function pieceCountReconciliation(Job $job, object $details): array
    {
        $houses = Job::withoutTenantScope()->where('parent_job_id', $job->id)->pluck('id');

        if ($houses->isEmpty()) {
            return [];
        }

        $housePieces = (int) DB::table('sea_shipment_details')
            ->whereIn('job_id', $houses)->sum('piece_count');
        $masterPieces = (int) $details->piece_count;

        if ($housePieces === $masterPieces) {
            return [];
        }

        return [[
            'field' => 'piece_count', 'rule' => 'houses_must_total_master',
            'message' => sprintf(
                '%d houses declare %d pieces against a master of %d. A difference of %d is %s.',
                $houses->count(), $housePieces, $masterPieces, abs($housePieces - $masterPieces),
                $housePieces < $masterPieces ? 'cargo on the master that no house manifests'
                                             : 'more cargo manifested than the master carries'
            ),
            'severity' => 'blocking',
            'value' => ['master' => $masterPieces, 'houses' => $housePieces],
        ]];
    }

    /** @return list<array> */
    private function lengthCheck(string $field, $value, int $max): array
    {
        if (blank($value) || mb_strlen((string) $value) <= $max) {
            return [];
        }

        return [[
            'field' => $field, 'rule' => "max:{$max}",
            'message' => sprintf(
                '%s is %d characters; ICEGATE accepts %d. Abbreviate it — do not let it be truncated.',
                $field, mb_strlen((string) $value), $max
            ),
            'severity' => 'blocking', 'value' => $value,
        ]];
    }

    /** Cargo-IMP's per-LINE limit, plus the cumulative address cap. */
    private function lineCheck(string $field, $value): array
    {
        if (blank($value)) {
            return [];
        }

        $v = [];

        foreach (preg_split('/\r\n|\r|\n/', (string) $value) as $i => $line) {
            if (mb_strlen($line) > self::CARGO_IMP_LINE) {
                $v[] = [
                    'field' => $field, 'rule' => 'cargo_imp_line',
                    'message' => sprintf(
                        'Line %d of %s is %d characters. Cargo-IMP allows %d per line, '
                        . 'and a longer line is an EDI transmission error, not a truncation.',
                        $i + 1, $field, mb_strlen($line), self::CARGO_IMP_LINE
                    ),
                    'severity' => 'blocking', 'value' => $line,
                ];
            }
        }

        if (mb_strlen((string) $value) > self::ADDRESS_CUMULATIVE_MAX) {
            $v[] = [
                'field' => $field, 'rule' => 'address_cumulative',
                'message' => sprintf('%s is %d characters across all lines; the cap is %d.',
                    $field, mb_strlen((string) $value), self::ADDRESS_CUMULATIVE_MAX),
                'severity' => 'blocking', 'value' => null,
            ];
        }

        return $v;
    }

    /**
     * ISO 6346 check digit — four letters, six digits, one check digit.
     *
     * Each character maps to a value (letters skip the multiples of 11, which is why
     * the alphabet table has gaps), weighted by 2^position, summed, and reduced mod 11
     * with 10 folding to 0. A mistyped container number is rejected at the terminal
     * gate rather than at filing, so catching it here is the difference between a
     * correction and a truck turned away.
     */
    public function isValidContainerNumber(?string $number): bool
    {
        $number = strtoupper(trim((string) $number));

        if (! preg_match('/^[A-Z]{4}\d{7}$/', $number)) {
            return false;
        }

        // A=10, skipping 11, 22 and 33 — the ISO 6346 letter table.
        $letterValue = function (string $c): int {
            $v = ord($c) - ord('A') + 10;
            foreach ([11, 22, 33] as $skip) {
                if ($v >= $skip) {
                    $v++;
                }
            }

            return $v;
        };

        $sum = 0;
        for ($i = 0; $i < 10; $i++) {
            $char = $number[$i];
            $value = ctype_alpha($char) ? $letterValue($char) : (int) $char;
            $sum += $value * (2 ** $i);
        }

        return ($sum % 11) % 10 === (int) $number[10];
    }
}
