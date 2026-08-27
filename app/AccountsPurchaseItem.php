<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * One cost line.
 *
 * 🔴 `rate` is the BUY rate. **It must never reach a sales-facing API response, at any
 * tier** — one of the product's load-bearing rules. Strip it server-side in the API
 * Resource; hiding it in the Vue component is not the same thing.
 */
class AccountsPurchaseItem extends Model
{
    protected $fillable = [
        'purchase_voucher_id', 'house_job_id', 'charge_type', 'hsn_sac_code',
        'description', 'quantity', 'rate', 'amount',
        'tax_percentage', 'tax_amount', 'net_amount',
    ];

    protected $casts = [
        'quantity'       => 'decimal:3',
        'rate'           => 'decimal:4',
        'amount'         => 'decimal:2',
        'tax_percentage' => 'decimal:2',
        'tax_amount'     => 'decimal:2',
        'net_amount'     => 'decimal:2',
    ];

    public function voucher()
    {
        return $this->belongsTo(AccountsPurchaseVoucher::class, 'purchase_voucher_id');
    }

    public function houseJob()
    {
        return $this->belongsTo(Job::class, 'house_job_id');
    }
}
