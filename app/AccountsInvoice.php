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

    /**
     * The placeholder a draft carries before it is numbered.
     *
     * 🔴 `invoice_no` is NOT NULL with no default and `uq_invoice_agent_no` is UNIQUE on
     * `(agent_id, invoice_no)` (GAPS.md #27), so a draft cannot simply be left blank —
     * two unnumbered drafts on one branch would collide on the empty string. It therefore
     * carries a placeholder, and the placeholder must be RECOGNISABLE: it is truthy, so
     * any `?: $sequences->next(...)` silently keeps it and the invoice goes to the client
     * bearing `DRAFT-…` as its permanent number. That defect shipped; `needsNumber()`
     * exists so the check lives in one place rather than being re-derived per caller.
     */
    public const DRAFT_NUMBER_PREFIX = 'DRAFT-';

    /** True when this invoice has no REAL sequence number yet. */
    public function needsNumber(): bool
    {
        return blank($this->invoice_no)
            || str_starts_with($this->invoice_no, self::DRAFT_NUMBER_PREFIX);
    }

    /** The placeholder a new draft is created with — unique per job. */
    public static function placeholderNumber(int $jobId): string
    {
        return self::DRAFT_NUMBER_PREFIX . $jobId . '-' . now()->format('YmdHis');
    }

    protected $fillable = [
        'sent_to_accounts_at', 'sent_to_accounts_by',
        'agent_id', 'job_id', 'transport_mode', 'customer_id',
        'billed_party_type', 'billed_party_id', 'parent_invoice_id', 'created_by',
        'invoice_no', 'type', 'document_date', 'status',
        'subtotal', 'tax_amount', 'grand_total', 'amount_paid',
        'currency', 'exchange_rate', 'is_posted', 'billed_party_role',
        // The billing desk's own columns (user, 2026-09-19): a date to age against, what the bill is for in words,
        // why a note exists, and what the IRP gave back.
        'due_date', 'narration', 'reason', 'irn', 'irn_status', 'ack_no', 'ack_date',
        // Why this invoice was issued over the client's credit limit, and by whom (PRD §251).
        'credit_override_reason', 'credit_override_by', 'credit_override_at',
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
        'document_date' => 'date:Y-m-d',
        'due_date'      => 'date:Y-m-d',
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
