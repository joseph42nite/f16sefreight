<?php

namespace App\Support;

/**
 * Rupee amounts as Indian readers write them: 7,85,703.00, not 785,703.00 (Walk 4 #39).
 *
 * Most screens already group this way (`toLocaleString("en-IN")`), but the sentences the SERVER writes used PHP's
 * `number_format`, which groups in thousands. The credit-limit refusal then said "785,703.00 against a limit of
 * 514,000.00" in its banner and "INR 7,85,703.00 … INR 5,14,000.00" in the line under it — one fact, two styles.
 */
final class Inr
{
    public static function format(float $amount, int $decimals = 2): string
    {
        $negative = $amount < 0;
        [$whole, $fraction] = array_pad(explode('.', number_format(abs($amount), $decimals, '.', '')), 2, '');

        $last3 = substr($whole, -3);
        $rest = substr($whole, 0, -3);

        if ($rest !== '') {
            $rest = preg_replace('/\B(?=(\d{2})+(?!\d))/', ',', $rest) . ',';
        }

        return ($negative ? '-' : '') . $rest . $last3 . ($decimals > 0 ? '.' . $fraction : '');
    }
}
