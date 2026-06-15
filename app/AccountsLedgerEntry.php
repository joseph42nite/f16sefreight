<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AccountsLedgerEntry extends Model
{
    protected $table = 'accounts_ledger_entries';

    protected static function booted()
    {
        static::updating(function ($model) {
            throw new \Exception("Ledger entries are append-only. Updates are not allowed.");
        });

        static::deleting(function ($model) {
            throw new \Exception("Ledger entries are append-only. Deletes are not allowed.");
        });
    }

    // Ledger entries are append-only (enforced by DB trigger).
    // Do not allow updates or deletes via Eloquent.
    protected $fillable = [
        'agent_id',
        'chart_of_account_id',
        'entry_date',
        'reference_type',
        'reference_id',
        'debit',
        'credit',
        'narration',
    ];

    protected $casts = [
        'entry_date' => 'date',
        'debit'      => 'decimal:2',
        'credit'     => 'decimal:2',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function chartOfAccount()
    {
        return $this->belongsTo(ChartOfAccount::class, 'chart_of_account_id');
    }
}
