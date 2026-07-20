<?php

namespace App\Http\Traits;

use App\Agent;
use App\SavedAddress;
use Illuminate\Http\Request;

trait WaybillTrait
{
    private function getAuthAgent()
    {
        $user = auth()->guard('user-api')->user();
        if (!$user) {
            return null;
        }
        return Agent::where('id', $user->branch_name)->first();
    }
    private function validateAndFormatRouteDates(array &$routing_information)
    {
        $dateFields = ['date', 'date_2', 'date_3'];
        foreach ($dateFields as $field) {
            if (isset($routing_information[$field]) && !empty($routing_information[$field])) {
                $dateValue = $routing_information[$field];
                $timestamp = strtotime($dateValue);
                if ($timestamp === false && is_string($dateValue)) {
                    $timestamp = strtotime(str_replace(['T', 'Z'], [' ', ''], $dateValue));
                }
                if ($timestamp === false) {
                    $fieldNameForErr = $field === 'date' ? 'date' : $field;
                    return response()->json(['errors' => [$field => ["The {$fieldNameForErr} field must be a valid date."]]], 422);
                }
                $routing_information[$field] = date('Y-m-d H:i:s', $timestamp);
            }
        }
        return null;
    }
    private function getAddressByType(Request $request, string $addressType, string $prefix)
    {
        $addressId = $request->input('id') ?? $request->query('id');
        $address = null;
        if ($addressId) {
            $address = SavedAddress::where('id', $addressId)->first();
        } else {
            $address = SavedAddress::where('address_type', $addressType)->first();
        }

        if ($address) {
            return response()->json([
                "{$prefix}_name" => $address->name,
                "{$prefix}_name_2" => $address->name_2,
                "{$prefix}_account" => $address->account,
                "{$prefix}_address" => $address->address,
                "{$prefix}_address_line_2" => $address->address_line_2,
                "{$prefix}_city" => $address->city,
                "{$prefix}_airport_code" => $address->airport_code,
                "{$prefix}_post_code" => $address->post_code,
                "{$prefix}_state" => $address->state,
                "{$prefix}_country" => $address->country,
                "{$prefix}_phone" => $address->phone,
                "{$prefix}_fax" => $address->fax,
                "{$prefix}_telex" => $address->telex,
            ], 200);
        }
        return response()->json(['error' => 'Address not found'], 404);
    }
}
