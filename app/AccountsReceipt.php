<?php

namespace App;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

/**
 * Money received, and the documents it settled.
 *
 * 🔴 NO SoftDeletes — a financial table (PRD §9.3). A receipt entered in error is reversed by another document, never
 * removed.
 *
 * ⚠️ `amount` is what ARRIVED. What it settled is the sum of its allocations, and the two need not agree: an advance
 * is received against nothing at all, and a part payment settles less than it covers.
 */
class AccountsReceipt extends Model
{
    use BelongsToTenant;

    /** How the money arrived. */
    public const MODES = ['bank_transfer', 'cheque', 'cash', 'upi', 'card', 'adjustment'];

    protected $fillable = [
        'agent_id', 'payer_type', 'payer_id', 'receipt_no', 'receipt_date', 'mode', 'reference',
        'amount', 'currency', 'exchange_rate', 'bank_transaction_id', 'narration', 'is_posted', 'created_by',
    ];

    protected $casts = [
        'receipt_date' => 'date',
        'amount' => 'decimal:2',
        'exchange_rate' => 'decimal:4',
        'is_posted' => 'boolean',
    ];

    public function allocations()
    {
        return $this->hasMany(AccountsReceiptAllocation::class, 'receipt_id');
    }

    /** What this receipt has been placed against; the rest is sitting on account. */
    public function allocated(): float
    {
        return round((float) $this->allocations()->sum('amount'), 2);
    }

    public function unallocated(): float
    {
        return round((float) $this->amount - $this->allocated(), 2);
    }
}
