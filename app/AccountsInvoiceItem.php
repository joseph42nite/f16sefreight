<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/** One charge line. `rate` is the SELL rate; net_amount is the revenue side of margin. */
class AccountsInvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id', 'house_job_id', 'charge_type', 'charge_basis', 'hsn_sac_code',
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
