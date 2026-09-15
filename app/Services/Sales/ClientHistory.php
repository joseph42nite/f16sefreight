<?php

namespace App\Services\Sales;

use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * The one place the sales engine reads a client's shipments and enquiries from (user, 2026-09-15).
 *
 * 🔴 WHICH FIGURES ARE THE TRUTH:
 *   - an air shipment whose AWB has gone to the airline → what the AWB said: its route and its cargo
 *     lines' gross weight (pounds converted to kg). That is what actually flew.
 *   - an air shipment not sent to the airline yet → what the client's mail said (`enquiries.extracted_weight`,
 *     origin and destination).
 *   - sea has no AWB → the verified shipment details (`sea_shipment_details`) when there are any, else the mail.
 *   - a lost enquiry never had a shipment, so it is always read from the mail.
 *
 * Cancelled shipments are not shipments. Every figure looks back WINDOW_DAYS from the snapshot date.
 */
class ClientHistory
{
    public const WINDOW_DAYS = 365;

    /** The job has gone to the airline, so its AWB is final. */
    private const SENT_TO_AIRLINE = ['Sent to Airline', 'Airline Confirmed', 'Completed'];

    private const LB_TO_KG = 0.453592;

    /**
     * One row per shipment in the window, oldest first: day, lane ("BOM → FRA" or null), weight in kg, source.
     *
     * @param  ?int  $customerId  NULL = every client of these branches (the lanes the branch runs)
     * @return Collection<object{job_id: int, day: Carbon, lane: ?string, weight: float, source: string}>
     */
    public function shipments(array $branchIds, ?int $customerId, string $mode, Carbon $date): Collection
    {
        $details = $mode === 'sea' ? 'sea_shipment_details' : 'air_shipment_details';

        // Each AWB's cargo lines, summed in kg. `gross_weight` is stored as text on the waybill.
        $awbWeights = DB::table('way_bill_consignment_data')
            ->selectRaw("awb_id, SUM(CAST(gross_weight AS DECIMAL(15,3))
                * CASE WHEN UPPER(weight_code) IN ('L', 'LB', 'LBS') THEN ? ELSE 1 END) AS kg", [self::LB_TO_KG])
            ->groupBy('awb_id');

        return DB::table('jobs as j')
            ->leftJoin('enquiries as e', 'e.id', '=', 'j.enquiry_id')
            ->leftJoin("{$details} as d", 'd.job_id', '=', 'j.id')
            ->leftJoin('air_way_bills as a', 'a.job_id', '=', 'j.id')
            ->leftJoinSub($awbWeights, 'w', fn ($join) => $join->on('w.awb_id', '=', DB::raw('CAST(a.id AS CHAR)')))
            ->whereIn('j.agent_id', $branchIds)
            ->when($customerId !== null, fn ($q) => $q->where('j.customer_id', $customerId))
            ->where('j.transport_mode', $mode)
            ->where('j.status', '!=', 'Cancelled')
            ->whereNull('j.deleted_at')
            ->whereBetween('j.created_at', [$date->copy()->subDays(self::WINDOW_DAYS)->startOfDay(), $date->copy()->endOfDay()])
            ->orderBy('j.created_at')
            ->get([
                'j.id as job_id', 'j.status', 'j.created_at',
                'a.departure_airport', 'a.destination_airport', 'w.kg as awb_kg',
                'd.pol_code', 'd.pod_code', 'd.gross_weight as detail_kg',
                'e.origin_code', 'e.dest_code', 'e.extracted_weight as mail_kg',
            ])
            ->unique('job_id')
            ->map(fn ($r) => $this->shipment($r, $mode))
            ->values();
    }

    /** Enquiries raised in the window — the funnel, the loss split, and lanes lost on price. */
    public function enquiries(array $branchIds, int $customerId, string $mode, Carbon $date): Collection
    {
        return DB::table('enquiries')
            ->whereIn('agent_id', $branchIds)->where('customer_id', $customerId)
            ->where('transport_mode', $mode)->whereNull('deleted_at')
            ->whereBetween('created_at', [$date->copy()->subDays(self::WINDOW_DAYS)->startOfDay(), $date->copy()->endOfDay()])
            ->get()
            ->map(function ($e) {
                $e->lane = self::lane($e->origin_code, $e->dest_code);

                return $e;
            });
    }

    /** 1 April of the financial year the date falls in. */
    public static function financialYearStart(Carbon $date): Carbon
    {
        return Carbon::create($date->month >= 4 ? $date->year : $date->year - 1, 4, 1)->startOfDay();
    }

    public static function lane(?string $origin, ?string $dest): ?string
    {
        return $origin && $dest ? strtoupper($origin) . ' → ' . strtoupper($dest) : null;
    }

    private function shipment(object $r, string $mode): object
    {
        $awbFinal = $mode === 'air' && in_array($r->status, self::SENT_TO_AIRLINE, true) && (float) $r->awb_kg > 0;

        if ($awbFinal) {
            // "BOM, Mumbai" and "BOM" are both written on waybills; the code is what counts.
            $lane = self::lane(trim(explode(',', (string) $r->departure_airport)[0]), trim(explode(',', (string) $r->destination_airport)[0]));
            [$weight, $source] = [(float) $r->awb_kg, 'awb'];
        } elseif ($mode === 'sea' && (float) $r->detail_kg > 0) {
            $lane = self::lane($r->pol_code, $r->pod_code) ?? self::lane($r->origin_code, $r->dest_code);
            [$weight, $source] = [(float) $r->detail_kg, 'shipment'];
        } else {
            $lane = self::lane($r->origin_code, $r->dest_code);
            [$weight, $source] = [(float) $r->mail_kg, 'mail'];
        }

        return (object) [
            'job_id' => (int) $r->job_id,
            'day' => Carbon::parse($r->created_at)->startOfDay(),
            'lane' => $lane ?? ($awbFinal ? self::lane($r->origin_code, $r->dest_code) : null),
            'weight' => round($weight, 3),
            'source' => $source,
        ];
    }
}
