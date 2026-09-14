<?php

namespace App\Http\Controllers\Logistics;

/**
 * Party and routing rules for a DRAFT waybill.
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
        return $this->draftRules($rules, '/_name$/');
    }

    /**
     * 🔴 A route read from a document is an origin and a destination, never a carrier, flight
     * or date, so a draft keeps just the two airports. A send keeps every rule.
     */
    private function routeRules(array $rules): array
    {
        return $this->draftRules($rules, '/^(departure|destination)_airport$/');
    }

    /** In a draft, `required` becomes `nullable` for every field the pattern does not name. */
    private function draftRules(array $rules, string $keepRequired): array
    {
        if (request('status') !== 'draft') {
            return $rules;
        }

        foreach ($rules as $field => $rule) {
            if (preg_match($keepRequired, $field)) {
                continue;
            }

            $parts = is_array($rule) ? $rule : explode('|', $rule);
            $parts = array_map(fn ($r) => $r === 'required' ? 'nullable' : $r, $parts);

            $rules[$field] = is_array($rule) ? $parts : implode('|', $parts);
        }

        return $rules;
    }
}
