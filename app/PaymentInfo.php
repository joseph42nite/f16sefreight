<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PaymentInfo extends Model
{
   protected $table = 'payment_info';

   public function airWayBill()
    {
        return $this->belongsTo(AirWayBill::class, 'awb_id', 'id');
    }
   // protected $fillable = [
   //  'payment_type',
   //  'currency',
   //  'carriage',
   //  'insurance',
   //  'other_charges_due_carrier',
   //  'other_charges_due_agent',
   //  'taxes',
   //  'weight_charge',
   //  'total_charges',
   //  'awb_id',
   //  'type_of_payment'
   // ];
}
