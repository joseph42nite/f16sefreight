<?php

namespace App\Support;

/**
 * The five sales documents the billing desk raises (PRD §6.2), in ONE place.
 *
 * 🔴 Each type keeps its own sequence counter per branch and fiscal year, so the prefix belongs beside the type and
 * nowhere else. A prefix re-derived at a call site is how two documents end up sharing a number.
 */
class BillingDocuments
{
    /** type => [label, sequence prefix, who it is addressed to]. */
    public const TYPES = [
        'invoice' => ['label' => 'Invoice', 'prefix' => 'INV', 'billed' => 'customer'],
        'debit_note' => ['label' => 'Revenue Debit Note', 'prefix' => 'DN', 'billed' => 'customer'],
        'credit_note' => ['label' => 'Revenue Credit Note', 'prefix' => 'CN', 'billed' => 'customer'],
        'brokerage' => ['label' => 'Brokerage Invoice', 'prefix' => 'BRK', 'billed' => 'partner'],
        'consol_invoice' => ['label' => 'Consol Invoice', 'prefix' => 'CSINV', 'billed' => 'partner'],
    ];

    /** A note amends an invoice; the other three stand on their own. */
    public const NOTES = ['debit_note', 'credit_note'];

    public static function prefix(string $type): string
    {
        return self::TYPES[$type]['prefix'] ?? 'INV';
    }

    public static function label(string $type): string
    {
        return self::TYPES[$type]['label'] ?? $type;
    }

    /** `customer` or `partner` — which directory the bill is addressed into. */
    public static function billedParty(string $type): string
    {
        return self::TYPES[$type]['billed'] ?? 'customer';
    }
}
