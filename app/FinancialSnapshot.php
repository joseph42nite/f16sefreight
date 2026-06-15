<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FinancialSnapshot extends Model
{
    protected $table = 'financial_snapshots';

    protected $fillable = [
        'agent_id',
        'snapshot_date',
        'accounting_period_id',
        'total_receivables',
        'total_payables',
        'net_cash_flow',
        'cash_on_hand',
        'unbilled_revenue',
        'accrued_expenses',
        'last_computed_at',
    ];

    protected $casts = [
        'snapshot_date'     => 'date',
        'last_computed_at'  => 'datetime',
        'total_receivables' => 'decimal:2',
        'total_payables'    => 'decimal:2',
        'net_cash_flow'     => 'decimal:2',
        'cash_on_hand'      => 'decimal:2',
        'unbilled_revenue'  => 'decimal:2',
        'accrued_expenses'  => 'decimal:2',
    ];

    /**
     * Check if snapshot data is stale (older than 1 hour).
     */
    public function isStale(): bool
    {
        return $this->last_computed_at->diffInMinutes(now()) > 60;
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function accountingPeriod()
    {
        return $this->belongsTo(AccountingPeriod::class, 'accounting_period_id');
    }
}
