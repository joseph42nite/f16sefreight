<?php

namespace App\Services;

use App\Job;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Consolidation — the master/house relationship. PRD.md §5.8.
 *
 * ═══ 🔴 THE ROUTING CASCADE IS NOT A CONVENIENCE ════════════════════════════
 * *"Manifest mismatches between master and house are a customs rejection."* When a
 * master's routing or vessel changes, every child house must follow. A house still
 * naming last week's vessel is not a stale display — it is a false statement on a
 * customs document, filed under a different bill of lading number from the master that
 * corrects it.
 *
 * ⚠️ Only the SEVEN fields the PRD lists cascade (POR, POL, POD, DEL, vessel, voyage,
 * IMO, flag). Cascading everything would overwrite each house's own cargo figures with
 * the master's, which is the opposite of what a consolidation is.
 *
 * ═══ ⚠️ THE ROLL-UP IS DEBOUNCED ════════════════════════════════════════════
 * Saving a house sums pieces, weight and volume up to its master. Linking eight houses
 * in sequence would otherwise recompute the master eight times, each read racing the
 * last write. A short cache lock collapses the burst into one recompute.
 */
class ConsolidationService
{
    /** PRD.md §5.8 — the 2-second debounce window. */
    private const DEBOUNCE_SECONDS = 2;

    /** The only fields a master imposes on its houses. See the class docblock. */
    private const CASCADE = [
        'por_code', 'pol_code', 'pod_code', 'del_code',
        'vessel_name', 'voyage_no', 'imo_number', 'vessel_flag',
    ];

    /**
     * Recompute a master's totals from its houses.
     *
     * 🔴 SUMMED FROM THE HOUSES, never incremented. An incremental update drifts the
     * moment one house is edited or unlinked, and a master whose declared pieces do not
     * equal its houses' is exactly the mismatch `IcegateValidator` refuses to file.
     */
    public function rollUp(int $masterId): array
    {
        $houses = Job::withoutTenantScope()
            ->where('parent_job_id', $masterId)
            ->whereNull('deleted_at')
            ->pluck('id');

        $totals = DB::table('sea_shipment_details')
            ->whereIn('job_id', $houses)
            ->selectRaw('COALESCE(SUM(piece_count),0) AS pieces,
                         COALESCE(SUM(gross_weight),0) AS gross,
                         COALESCE(SUM(net_weight),0) AS net,
                         COALESCE(SUM(volume_cbm),0) AS cbm')
            ->first();

        // ⚠️ A master with no houses is left ALONE, not zeroed. A direct shipment is not
        // a consol with zero children, and resetting its own declared figures to zero
        // would erase a manifest.
        if ($houses->isEmpty()) {
            return ['houses' => 0, 'skipped' => true];
        }

        DB::table('sea_shipment_details')->updateOrInsert(
            ['job_id' => $masterId],
            [
                'piece_count'  => (int) $totals->pieces,
                'gross_weight' => round((float) $totals->gross, 3),
                'net_weight'   => round((float) $totals->net, 3),
                'volume_cbm'   => round((float) $totals->cbm, 3),
                'updated_at'   => now(),
                'created_at'   => now(),
            ]
        );

        return [
            'houses' => $houses->count(),
            'piece_count' => (int) $totals->pieces,
            'gross_weight' => round((float) $totals->gross, 3),
            'volume_cbm' => round((float) $totals->cbm, 3),
        ];
    }

    /**
     * Roll up, at most once per debounce window.
     *
     * Returns false when the burst was collapsed — the caller has not lost anything,
     * the recompute simply already happened or is about to.
     */
    public function rollUpDebounced(int $masterId): bool
    {
        $lock = Cache::lock("consol:rollup:{$masterId}", self::DEBOUNCE_SECONDS);

        if (! $lock->get()) {
            return false;
        }

        $this->rollUp($masterId);

        // The lock is NOT released: holding it for its full TTL is what makes this a
        // debounce rather than a mutex. Releasing here would let the next save in the
        // burst recompute immediately, which is the storm this exists to prevent.
        return true;
    }

    /**
     * Push the master's routing onto every house.
     *
     * @return int houses updated
     */
    public function cascadeRouting(int $masterId): int
    {
        $master = DB::table('sea_shipment_details')->where('job_id', $masterId)->first();

        if ($master === null) {
            return 0;
        }

        $routing = [];
        foreach (self::CASCADE as $field) {
            if ($master->$field !== null) {
                $routing[$field] = $master->$field;
            }
        }

        if ($routing === []) {
            return 0;
        }

        $houses = Job::withoutTenantScope()
            ->where('parent_job_id', $masterId)
            ->whereNull('deleted_at')
            ->pluck('id');

        if ($houses->isEmpty()) {
            return 0;
        }

        return DB::table('sea_shipment_details')
            ->whereIn('job_id', $houses)
            ->update($routing + ['updated_at' => now()]);
    }

    /**
     * Attach a house to a master.
     *
     * 🔴 Refuses a house that already belongs to a DIFFERENT master. Silently
     * re-parenting would remove cargo from one consol's manifest and add it to
     * another's, and both masters would then disagree with what was filed.
     */
    public function link(Job $master, Job $house): array
    {
        if ($house->parent_job_id !== null && (int) $house->parent_job_id !== (int) $master->id) {
            return ['ok' => false, 'reason' => 'already_linked'];
        }

        if ((int) $house->id === (int) $master->id) {
            return ['ok' => false, 'reason' => 'self_link'];
        }

        if ($house->transport_mode !== $master->transport_mode) {
            return ['ok' => false, 'reason' => 'mode_mismatch'];
        }

        $house->update(['parent_job_id' => $master->id, 'is_sub_shipment' => true]);
        $master->update(['is_consolidation' => true]);

        $this->cascadeRouting($master->id);
        $this->rollUp($master->id);

        return ['ok' => true];
    }

    /** Detach, then recompute — the master must not keep cargo it no longer carries. */
    public function unlink(Job $house): void
    {
        $masterId = $house->parent_job_id;

        $house->update(['parent_job_id' => null, 'is_sub_shipment' => false]);

        if ($masterId !== null) {
            $this->rollUp((int) $masterId);
        }
    }
}
