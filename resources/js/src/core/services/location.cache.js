import ApiService from "@/core/services/api.service";

/**
 * Process-wide cache for the airport/location dataset (~20k rows).
 *
 * The waybill forms (FocusAir / HouseWayBill / Consolidation) each need the
 * full list for their IATA autocomplete. Without this, every page mount
 * re-downloaded and re-parsed the entire dataset and held its own copy.
 * Here it is fetched once, and concurrent callers share the same in-flight
 * request and the same resulting array (read-only — consumers only filter it).
 */
let cache = null;
let inFlight = null;

export function loadLocations() {
    if (cache) return Promise.resolve(cache);
    if (inFlight) return inFlight;

    inFlight = ApiService.get(`/user/get-location`)
        .then(({ data }) => {
            cache = data;
            inFlight = null;
            return cache;
        })
        .catch(err => {
            inFlight = null;
            throw err;
        });

    return inFlight;
}
