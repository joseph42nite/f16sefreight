<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AccountsPurchaseItem extends Model
{
    protected $table = 'accounts_purchase_items';

    protected $fillable = [
        'voucher_id',
        'charge_type',
        'description',
        'qty',
        'unit_rate',
        'tax_rate',
        'subtotal',
        'tax_amount',
        'total_amount',
    ];

    protected $casts = [
        'qty'          => 'decimal:2',
        'unit_rate'    => 'decimal:2',
        'tax_rate'     => 'decimal:2',
        'subtotal'     => 'decimal:2',
        'tax_amount'   => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function purchaseVoucher()
    {
        return $this->belongsTo(AccountsPurchaseVoucher::class, 'voucher_id');
    }
}
