<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * One charge line. `rate` is the SELL rate. `amount` is before tax and is what revenue and margin are made of;
 * `net_amount` is amount + tax (what the client pays for the line), despite the name (GAPS, Walk 4 #35).
 */
class AccountsInvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id', 'house_job_id', 'charge_type', 'charge_basis', 'source', 'hsn_sac_code',
        'description', 'quantity', 'rate', 'amount',
        'tax_status', 'tax_percentage', 'tax_amount', 'net_amount',
    ];

    protected $casts = [
        'quantity'       => 'decimal:3',
        'rate'           => 'decimal:4',
        'amount'         => 'decimal:2',
        'tax_percentage' => 'decimal:2',
        'tax_amount'     => 'decimal:2',
        'net_amount'     => 'decimal:2',
    ];

    /**
     * A DRAFT's header follows its lines, whichever path wrote them (Walk 4 #36). The cost sheet and the waybill
     * wrote lines and never the header, so a draft showed INR 0.00 in Accounts' To-bill list until it was finalized.
     * Only drafts: a finalized document's figures are what was issued, and are never recomputed behind it.
     */
    protected static function booted(): void
    {
        $retotal = static function (self $item): void {
            // Inside retotalOnce(): note the document and total it when the batch is done.
            if (self::$deferred !== null) {
                self::$deferred[(int) $item->invoice_id] = true;

                return;
            }

            self::retotal((int) $item->invoice_id);
        };

        static::saved($retotal);
        static::deleted($retotal);
    }

    /** Documents whose lines changed inside retotalOnce(); NULL outside one. */
    private static ?array $deferred = null;

    /**
     * Write many lines and total each document ONCE at the end, instead of after every line.
     *
     * 🔴 A 30-line sheet retotalled 30 times — about 150 queries to arrive at one figure (2026-11-10 audit §5). The
     * totals are written before this returns, so a caller inside a transaction still commits them together with the
     * lines. Nested calls total when the outermost one ends.
     *
     * @template T
     * @param  callable(): T  $work
     * @return T
     */
    public static function retotalOnce(callable $work)
    {
        if (self::$deferred !== null) {
            return $work();
        }

        self::$deferred = [];

        try {
            $result = $work();
        } finally {
            $touched = array_keys(self::$deferred);
            self::$deferred = null;
        }

        foreach ($touched as $invoiceId) {
            self::retotal($invoiceId);
        }

        return $result;
    }

    private static function retotal(int $invoiceId): void
    {
        $invoice = AccountsInvoice::withoutTenantScope()->find($invoiceId);

        if ($invoice === null || $invoice->status !== 'draft') {
            return;
        }

        $sums = $invoice->items()->selectRaw('COALESCE(SUM(amount), 0) AS amount, COALESCE(SUM(tax_amount), 0) AS tax')->toBase()->first();
        $subtotal = round((float) $sums->amount, 2);
        $tax = round((float) $sums->tax, 2);

        $invoice->forceFill(['subtotal' => $subtotal, 'tax_amount' => $tax, 'grand_total' => round($subtotal + $tax, 2)])
            ->saveQuietly();

        // Quietly skips UnpostedDocumentObserver, so the close-of-period queue is told the new total here.
        app(\App\Services\UnpostedQueue::class)->refresh($invoice);
    }

    public function invoice()
    {
        return $this->belongsTo(AccountsInvoice::class, 'invoice_id');
    }

    /** Maps this line to a HOUSE shipment inside a consol invoice. */
    public function houseJob()
    {
        return $this->belongsTo(Job::class, 'house_job_id');
    }
}
