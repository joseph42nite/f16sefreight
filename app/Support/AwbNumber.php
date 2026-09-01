<?php

namespace App\Support;

/**
 * The ONE place that knows what an air waybill number looks like.
 *
 * 🔴 **Two formats were in use and nothing reconciled them** (GAPS #40).
 * `jobs.awb_number` stored `176-10000008` — `IcegateValidator` enforces
 * `/^\d{3}-\d{8}$/`, hyphen required — while `air_way_bills.id` stored `17610000008`
 * with no separator. Joining the operational half of FocusAir to the document half needed
 * a `REPLACE(awb_number,'-','')` that nothing in the codebase performed, so the two halves
 * never met.
 *
 * The canonical form is **`176-10000008`**: three-digit airline prefix, hyphen, eight-digit
 * serial. That is what IATA prints, what customs expects, and what the job side already
 * held.
 *
 * ⚠️ **The primary key stays numeric, and that is not a compromise to undo later.**
 * `air_way_bills.id` is `BIGINT UNSIGNED` and is the foreign-key target of
 * `way_bill_addresses`, `consignment_data`, `other_custom_information` and more, all
 * keyed on `awb_id`. A hyphen cannot go in it without migrating every one of those. So the
 * key is the digits and the NUMBER is canonical — `key()` and `canonical()` convert
 * between them, and neither is derived by hand anywhere else.
 */
class AwbNumber
{
    /** `176` + `10000008` → `176-10000008`. */
    public static function canonical(?string $code, ?string $serial): ?string
    {
        $code = preg_replace('/\D/', '', (string) $code);
        $serial = preg_replace('/\D/', '', (string) $serial);

        if ($code === '' || $serial === '') {
            return null;
        }

        return $code . '-' . $serial;
    }

    /**
     * Normalise anything that claims to be an AWB number to the canonical form.
     *
     * Accepts `17610000008`, `176-10000008`, `176 10000008` — the shapes that actually
     * turn up from OCR, from a spreadsheet, and from a person typing.
     */
    public static function normalise(?string $value): ?string
    {
        $digits = preg_replace('/\D/', '', (string) $value);

        if (strlen($digits) !== 11) {
            return null;
        }

        return substr($digits, 0, 3) . '-' . substr($digits, 3);
    }

    /** The numeric primary key for a number in any form: `176-10000008` → `17610000008`. */
    public static function key(?string $value): ?int
    {
        $digits = preg_replace('/\D/', '', (string) $value);

        return strlen($digits) === 11 ? (int) $digits : null;
    }

    /** Is this a well-formed AWB number, in any accepted shape? */
    public static function isValid(?string $value): bool
    {
        return self::normalise($value) !== null;
    }
}
