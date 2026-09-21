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
        'bank_account_id',
        'amount', 'currency', 'exchange_rate', 'run_ref', 'bank_transaction_id', 'narration',
        'is_posted', 'created_by',
    ];

    protected $casts = [
        /*
         * 🔴 `date:Y-m-d`, NOT `date`. A bare date cast serialises as a UTC timestamp, so a document
         * dated 20 September in Asia/Kolkata reaches the browser as `2026-09-19T18:30:00Z` — and any
         * screen that takes the first ten characters of it reads the day BEFORE. The billing drawer did
         * exactly that, so opening a draft and pressing Save header moved its date back a day, silently
         * changing which accounting period, which ageing bucket and which month's GST it belongs to.
         * These columns are DATES; they have no time and no zone.
         */
        'payment_date' => 'date:Y-m-d',
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
