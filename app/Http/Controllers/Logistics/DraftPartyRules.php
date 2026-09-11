<?php

namespace App\Http\Controllers\Logistics;

/**
 * Party rules for a DRAFT waybill.
 *
 * 🔴 A draft keeps what was collected. Every party part used to be required on every save,
 * so the Extraction panel removed any party missing one, and a draft from a real invoice
 * saved only the AWB number. With `status = draft` only the name is required, and a part
 * that IS given must still be valid (its length, a 2-letter country). A send keeps every rule.
 */
trait DraftPartyRules
{
    private function partyRules(array $rules): array
    {
        if (request('status') !== 'draft') {
            return $rules;
        }

        foreach ($rules as $field => $rule) {
            if (preg_match('/_name$/', $field)) {
                continue;
            }

            $parts = is_array($rule) ? $rule : explode('|', $rule);
            $parts = array_map(fn ($r) => $r === 'required' ? 'nullable' : $r, $parts);

            $rules[$field] = is_array($rule) ? $parts : implode('|', $parts);
        }

        return $rules;
    }
}
