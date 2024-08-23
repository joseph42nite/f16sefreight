<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PaymentInfo extends Model
{
    
   protected $fillable = [
    'payment_type',
    'currency',
    'carriage',
    'insurance',
    'other_charges_due_carrier',
    'other_charges_due_agent',
    'taxes',
    'weight_charge',
    'total_charges',
    'awb_id'
   ];
}
