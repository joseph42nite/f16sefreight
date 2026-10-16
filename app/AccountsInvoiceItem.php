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
            $invoice = AccountsInvoice::withoutTenantScope()->find($item->invoice_id);

            if ($invoice === null || $invoice->status !== 'draft') {
                return;
            }

            $subtotal = round((float) $invoice->items()->sum('amount'), 2);
            $tax = round((float) $invoice->items()->sum('tax_amount'), 2);

            $invoice->forceFill(['subtotal' => $subtotal, 'tax_amount' => $tax, 'grand_total' => round($subtotal + $tax, 2)])
                ->saveQuietly();
        };

        static::saved($retotal);
        static::deleted($retotal);
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
