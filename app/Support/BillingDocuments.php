<?php

namespace App\Support;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

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

    /** Billed to a partner but earned on a client's shipment. */
    public const PARTNER_BILLED = ['brokerage', 'consol_invoice'];

    /**
     * Brokerage, consol, and the notes that amend them, on a shipment — each with the shipment's client as
     * `j.customer_id` (user, 2026-09-26: "count brokerage and consol toward sales revenue"; GAPS #408).
     *
     * 🔴 **Revenue ONLY, never what the client owes.** They are billed to a partner (`customer_id` is NULL), so the
     * client's ageing, credit use and days-to-pay never see them; the job is the only link to the client, and so to
     * the rep. A note follows its parent here as everywhere: a credit note against a brokerage bill subtracts.
     */
    public static function earnedFromPartners(): Builder
    {
        return DB::table('accounts_invoices as i')
            ->join('jobs as j', 'j.id', '=', 'i.job_id')
            ->leftJoin('accounts_invoices as p', 'p.id', '=', 'i.parent_invoice_id')
            ->where(fn ($q) => $q->whereIn('i.type', self::PARTNER_BILLED)->orWhereIn('p.type', self::PARTNER_BILLED))
            ->whereNotIn('i.status', ['draft', 'void']);
    }

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
