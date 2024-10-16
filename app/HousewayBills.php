<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

<<<<<<< HEAD:app/HousewayBills.php
class HousewayBills extends Model
{   
=======
class HousewayBill extends Model
{
>>>>>>> eae6839162de2e43e42fb9d581df9c2bf90f07d3:app/HousewayBill.php
    protected $table = 'house_way_bills';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
}