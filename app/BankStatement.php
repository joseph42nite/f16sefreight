<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BankStatement extends Model
{
    protected $table = 'bank_statements';

    protected $fillable = [
        'agent_id',
        'plaid_transaction_id',
        'booking_date',
        'value_date',
        'amount',
        'sender_reference',
        'status',
        'matched_invoice_id',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'value_date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function matchedInvoice()
    {
        return $this->belongsTo(AccountsInvoice::class, 'matched_invoice_id');
    }
}
