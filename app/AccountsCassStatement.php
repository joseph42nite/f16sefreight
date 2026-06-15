<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AccountsCassStatement extends Model
{
    protected $table = 'accounts_cass_statements';

    protected $fillable = [
        'agent_id',
        'airline_id',
        'awb_number',
        'billing_period',
        'cass_gross_weight',
        'cass_rate',
        'cass_freight_charges',
        'cass_other_charges',
        'grand_total',
        'reconciliation_status',
        'matched_voucher_id',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function airline()
    {
        return $this->belongsTo(Airline::class, 'airline_id');
    }

    public function matchedVoucher()
    {
        return $this->belongsTo(AccountsPurchaseVoucher::class, 'matched_voucher_id');
    }
}
