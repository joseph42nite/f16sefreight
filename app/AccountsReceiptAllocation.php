<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/** One receipt against one document. A receipt may have many; a document may be settled by many. */
class AccountsReceiptAllocation extends Model
{
    protected $fillable = ['receipt_id', 'invoice_id', 'amount', 'resolution'];

    protected $casts = ['amount' => 'decimal:2'];

    public function receipt()
    {
        return $this->belongsTo(AccountsReceipt::class, 'receipt_id');
    }

    public function invoice()
    {
        return $this->belongsTo(AccountsInvoice::class, 'invoice_id');
    }
}
