<?php

namespace App;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

/**
 * Money paid out, and the vouchers it settled — the mirror of `AccountsReceipt`.
 *
 * 🔴 NO SoftDeletes: a financial table (PRD §9.3). A payment entered in error is reversed by another document.
 */
class AccountsPayment extends Model
{
    use BelongsToTenant;

    /** How the money left. */
    public const MODES = ['bank_transfer', 'cheque', 'cash', 'upi', 'card', 'adjustment'];

    protected $fillable = [
        'agent_id', 'payee_type', 'payee_id', 'payment_no', 'payment_date', 'mode', 'reference',
        'amount', 'currency', 'exchange_rate', 'run_ref', 'bank_transaction_id', 'narration',
        'is_posted', 'created_by',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
        'exchange_rate' => 'decimal:4',
        'is_posted' => 'boolean',
    ];

    public function allocations()
    {
        return $this->hasMany(AccountsPaymentAllocation::class, 'payment_id');
    }

    /** What this payment has been placed against; the rest is an advance to the supplier. */
    public function allocated(): float
    {
        return round((float) $this->allocations()->sum('amount'), 2);
    }
}
