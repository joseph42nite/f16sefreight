<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * Money owed to a vendor against a shipment.
 *
 * 🔴 NO SoftDeletes — no financial table soft-deletes.
 * `job_id` is ON DELETE RESTRICT: a voucher is a real liability and its job cannot be
 * deleted out from under it.
 */
class AccountsPurchaseVoucher extends Model
{
    protected $fillable = [
        'agent_id', 'job_id', 'transport_mode', 'vendor_id', 'created_by',
        'voucher_no', 'document_date', 'status',
    ];

    protected $casts = ['document_date' => 'date'];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function vendor()
    {
        return $this->belongsTo(Partner::class, 'vendor_id');
    }

    public function items()
    {
        return $this->hasMany(AccountsPurchaseItem::class, 'purchase_voucher_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
