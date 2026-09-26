<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/** One receipt against one document. A receipt may have many; a document may be settled by many. */
class AccountsReceiptAllocation extends Model
{
    /** `amount` is the rupees placed; `invoice_amount` and `exchange_rate` what they settled of a foreign bill (GAPS #411). */
    protected $fillable = ['receipt_id', 'invoice_id', 'amount', 'invoice_amount', 'exchange_rate', 'resolution'];

    protected $casts = ['amount' => 'decimal:2', 'invoice_amount' => 'decimal:2', 'exchange_rate' => 'decimal:6'];

    public function receipt()
    {
        return $this->belongsTo(AccountsReceipt::class, 'receipt_id');
    }

    public function invoice()
    {
        return $this->belongsTo(AccountsInvoice::class, 'invoice_id');
    }
}
