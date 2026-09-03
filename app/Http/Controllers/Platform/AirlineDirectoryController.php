<?php

namespace App\Http\Controllers\Platform;

use App\Airline;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * The platform's airline list — prefix, name, and email domain — curated by F16s.
 *
 * 🔴 **Reference data, not tenant data.** `176` is Emirates whoever is looking, so every
 * branch of every tenant re-keying the same carrier is how one airline ends up spelled four
 * ways and its domain classified inconsistently. Curating it centrally also means an
 * operator picks a carrier from a list instead of typing a prefix from memory — and a
 * mistyped prefix is a waybill filed under the wrong airline.
 *
 * ⚠️ This replaces the need for a tenant to add an airline as a `partners` row purely to
 * teach the domain directory. Tenant partners go back to being what they should be: the
 * brokers, truckers and agents that BRANCH deals with, each with its own state GSTIN.
 */
class AirlineDirectoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $airlines = Airline::query()
            ->when($request->filled('q'), function ($q) use ($request) {
                $term = '%' . $request->string('q') . '%';

                $q->where('name', 'like', $term)
                    ->orWhere('prefix', 'like', $term)
                    ->orWhere('code', 'like', $term)
                    ->orWhere('domain', 'like', $term);
            })
            // Carriers with no domain first: those are the rows still needing the work
            // this screen exists for.
            ->orderByRaw('domain IS NOT NULL')
            ->orderBy('name')
            ->paginate(100);

        return response()->json($airlines);
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json(Airline::create($this->validated($request)), 201);
    }

    public function update(Request $request, Airline $airline): JsonResponse
    {
        $airline->update($this->validated($request, $airline->id));

        return response()->json($airline->fresh());
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100'],

            // ⚠️ The IATA numeric prefix — three digits, and the first segment of every
            // AWB number this carrier issues. Unique, because two carriers sharing one
            // would make an AWB number ambiguous about who is carrying the freight.
            'prefix' => ['required', 'regex:/^\d{3}$/',
                         Rule::unique('airlines', 'prefix')->ignore($ignoreId)],

            // The two-character IATA designator (EK, LH). Not unique in practice —
            // designators get reassigned after an airline folds.
            'code'    => ['nullable', 'string', 'max:5'],
            'country' => ['nullable', 'string', 'max:100'],

            // 🔐 A DOMAIN, never an address. `ops@lhcargo.test` would classify one
            // mailbox; `lhcargo.test` classifies the carrier.
            'domain'  => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9.-]+\.[a-z]{2,}$/i'],

            'airline_address' => ['nullable', 'string'],
            'is_active'       => ['nullable', 'boolean'],
        ]);
    }
}
