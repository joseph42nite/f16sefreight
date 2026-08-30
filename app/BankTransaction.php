<?php

namespace App;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

/**
 * One line from the bank feed.
 *
 * 🔴 `plaid_transaction_id` is UNIQUE, and that uniqueness IS the ingestion guard.
 * Transactions arrive by webhook AND by a scheduled 3-day fallback sweep (PRD.md §6.4)
 * — deliberately, so a missed webhook never leaves a gap — which means the same
 * transaction routinely arrives twice. Without the unique index every swept row would
 * be double-counted into cash.
 *
 * ⚠️ Both match columns are ON DELETE SET NULL: unmatching a payment must not delete
 * the bank row. The money genuinely moved; only our interpretation of it was wrong.
 *
 * 🔴 NO SoftDeletes. No financial table gets one (PRD.md §9.3).
 */
class BankTransaction extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'agent_id', 'matched_invoice_id', 'matched_voucher_id',
        'plaid_transaction_id', 'amount', 'reconciliation_status',
    ];

    protected $casts = ['amount' => 'decimal:2'];

    protected $attributes = ['reconciliation_status' => 'unreconciled'];

    /** A CREDIT — money in — is a receipt against an invoice. */
    public function matchedInvoice()
    {
        return $this->belongsTo(AccountsInvoice::class, 'matched_invoice_id');
    }

    /** A DEBIT — money out — is a payment against a purchase voucher. */
    public function matchedVoucher()
    {
        return $this->belongsTo(AccountsPurchaseVoucher::class, 'matched_voucher_id');
    }

    public function scopeUnreconciled($query)
    {
        return $query->where('reconciliation_status', 'unreconciled');
    }
}
