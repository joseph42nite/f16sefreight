<?php

namespace App;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

/**
 * A sales document: invoice, debit note, credit note, brokerage or consol invoice.
 *
 * 🔴 NO SoftDeletes. NO FINANCIAL TABLE SOFT-DELETES (PRD.md §9.3). Voiding is a
 * STATUS — a void invoice must stay visible in the GST register and the audit trail.
 *
 * ── customer vs billedParty are DIFFERENT FACTS ────────────────────────────
 * `customer` drives AR, collections and credit, all customer-only concepts, and is NULL
 * on partner-billed documents. `billedParty` is who the invoice is ADDRESSED to, which
 * for brokerage, consol and agent invoices is a Partner. Collapsing them would either
 * put partners into the AR ledger or make partner-billed invoices unaddressable.
 */
class AccountsInvoice extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'agent_id', 'job_id', 'transport_mode', 'customer_id',
        'billed_party_type', 'billed_party_id', 'parent_invoice_id', 'created_by',
        'invoice_no', 'type', 'document_date', 'status',
        'subtotal', 'tax_amount', 'grand_total', 'amount_paid',
        'currency', 'exchange_rate', 'is_posted', 'billed_party_role',
    ];

    protected $casts = [
        'document_date' => 'date',
        'subtotal'      => 'decimal:2',
        'tax_amount'    => 'decimal:2',
        'grand_total'   => 'decimal:2',
        'amount_paid'   => 'decimal:2',
        'exchange_rate' => 'decimal:4',
        'is_posted'     => 'boolean',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    /** The debtor. NULL on partner-billed documents — see the class docblock. */
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    /** Customer or Partner, via the morph map. */
    public function billedParty()
    {
        return $this->morphTo(__FUNCTION__, 'billed_party_type', 'billed_party_id');
    }

    /** The invoice a credit or debit note amends. */
    public function parentInvoice()
    {
        return $this->belongsTo(self::class, 'parent_invoice_id');
    }

    public function items()
    {
        return $this->hasMany(AccountsInvoiceItem::class, 'invoice_id');
    }

    public function brokerageDetail()
    {
        return $this->hasOne(AccountsInvoiceBrokerageDetail::class, 'invoice_id');
    }

    public function consolDetail()
    {
        return $this->hasOne(AccountsInvoiceConsolDetail::class, 'invoice_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** grand_total - amount_paid. Read on every AR screen and credit check. */
    public function outstanding(): float
    {
        return round((float) $this->grand_total - (float) $this->amount_paid, 2);
    }

    public function scopeOutstanding($query)
    {
        return $query->whereNotIn('status', ['draft', 'void', 'paid']);
    }
}
