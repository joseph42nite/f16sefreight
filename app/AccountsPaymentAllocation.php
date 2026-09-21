<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/** One payment against one voucher. A payment may settle many; a voucher may take many. */
class AccountsPaymentAllocation extends Model
{
    protected $fillable = ['payment_id', 'purchase_voucher_id', 'amount'];

    protected $casts = ['amount' => 'decimal:2'];

    public function payment()
    {
        return $this->belongsTo(AccountsPayment::class, 'payment_id');
    }

    public function voucher()
    {
        return $this->belongsTo(AccountsPurchaseVoucher::class, 'purchase_voucher_id');
    }
}
