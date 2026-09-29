<?php

namespace App\Services;

use App\Http\Controllers\Freight\JobEntityController;
use App\Job;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

/**
 * The printed bill of lading — House or Master (guide Step 12.3, GAPS #433).
 *
 * ❓ **The layout is PROPOSED, not specified.** PRD §5.8 names the fields and their limits but gives no layout, so this
 * is the conventional box layout filled ONLY from what the FocusSea form holds. Nothing is printed that the form does
 * not store: no place or date of issue, no number of originals, no shipped-on-board date — the form has none of them,
 * and a blank on a BL is safer than a guess (GAPS #433 lists them for the owner).
 *
 * ⚠️ A bill with no BL number yet prints, and says DRAFT across its face — as a draft invoice does.
 */
class BlPdf
{
    public function render(Job $job): string
    {
        return Pdf::loadView('documents.bill-of-lading', ['bl' => $this->shape($job)])
            ->setPaper('a4', 'portrait')
            ->set_option('isHtml5ParserEnabled', true)
            ->output();
    }

    public function filename(Job $job): string
    {
        $bl = $this->shape($job);

        return preg_replace('/[^A-Za-z0-9\-]/', '', $bl['number'] ?: ($job->execution_job_no ?: 'BL-' . $job->id)) . '.pdf';
    }

    /** Everything the template prints, read once. */
    public function shape(Job $job): array
    {
        $d = DB::table('sea_shipment_details')->where('job_id', $job->id)->first();
        $kind = JobEntityController::documentKind($job);
        $branch = DB::table('agents_info')->where('id', $job->agent_id)->first();
        $company = $branch ? DB::table('companies')->where('id', $branch->company_id)->value('name') : null;
        $number = $kind === 'master' ? ($d->mbl_number ?? null) : ($d->hbl_number ?? null);

        return [
            'kind'      => $kind,
            'title'     => $kind === 'master' ? 'Master Bill of Lading' : 'House Bill of Lading',
            'number'    => $number,
            'draft'     => blank($number),
            'job_no'    => $job->execution_job_no,
            'issuer'    => [
                'name'    => $company,
                'branch'  => $branch->agent_name ?? null,
                'address' => $this->branchAddress($branch),
                'gst_no'  => $branch->gst_no ?? null,
            ],
            'carrier'   => ($d->carrier_id ?? null) ? DB::table('partners')->where('id', $d->carrier_id)->value('name') : null,
            'shipper'   => $this->party($job, 'shipper'),
            'consignee' => $this->party($job, 'consignee'),
            'notify'    => $this->party($job, 'notify_party'),
            'refs'      => [
                'Job no'           => $job->execution_job_no,
                'Job order no'     => $job->job_order_no,
                'Shipping bill'    => trim(($d->shipping_bill_no ?? '') . (($d->shipping_bill_date ?? null) ? ' / ' . $d->shipping_bill_date : '')) ?: null,
                'Service contract' => $d->service_contract_no ?? null,
                'Master BL'        => $kind === 'house' && $job->parent_job_id
                    ? DB::table('sea_shipment_details')->where('job_id', $job->parent_job_id)->value('mbl_number') : null,
            ],
            'vessel'    => trim(($d->vessel_name ?? '') . (($d->voyage_no ?? null) ? ' / ' . $d->voyage_no : '')) ?: null,
            'flag'      => $d->vessel_flag ?? null,
            'imo'       => $d->imo_number ?? null,
            'por'       => $this->port($d->por_code ?? null),
            'pol'       => $this->port($d->pol_code ?? null),
            'pod'       => $this->port($d->pod_code ?? null),
            'del'       => $this->port($d->del_code ?? null),
            'via'       => array_values(array_filter(array_map(fn ($c) => $this->port($c),
                [$d->ts1_code ?? null, $d->ts2_code ?? null, $d->ts3_code ?? null]))),
            'etd'       => $d->etd ?? null,
            'eta'       => $d->eta ?? null,
            'marks'     => $d->marks_numbers ?? null,
            'pieces'    => $d->piece_count ?? null,
            'package'   => $d->package_code ?? null,
            'commodity' => $d->commodity_description ?? null,
            'hs_code'   => $d->hs_code ?? null,
            'imdg'      => ($d->imdg_class ?? null) ? trim('Class ' . $d->imdg_class . (($d->un_number ?? null) ? ' · UN ' . $d->un_number : '')) : null,
            'gross'     => $d->gross_weight ?? null,
            'net'       => $d->net_weight ?? null,
            'weight_unit' => $d->weight_unit ?? 'KGS',
            'volume'    => $d->volume_cbm ?? null,
            'volume_unit' => $d->volume_unit ?? 'CBM',
            'freight_terms' => $d->freight_terms ?? null,
            'bl_type'   => $d->bl_type ?? null,
            'release'   => $d->release_type ?? null,
            'containers' => DB::table('sea_containers')->where('job_id', $job->id)->whereNull('deleted_at')
                ->orderBy('id')->get(['container_number', 'container_type', 'seal_number'])->all(),
            // A master carries its houses' cargo; the print says how many bills it covers, not their detail.
            'houses'    => $kind === 'master' ? Job::withoutTenantScope()->where('parent_job_id', $job->id)->count() : 0,
        ];
    }

    /** One party by role: name and address, from whichever directory the role points into. */
    private function party(Job $job, string $role): ?array
    {
        $row = DB::table('job_entities')->where('job_id', $job->id)->where('role', $role)->whereNull('deleted_at')->first();

        if ($row === null) {
            return null;
        }

        if ($row->party_type === 'branch') {
            $b = DB::table('agents_info')->where('id', $row->party_id)->first();
            $name = $b ? DB::table('companies')->where('id', $b->company_id)->value('name') . ' — ' . $b->agent_name : null;

            return ['name' => $name, 'address' => $this->branchAddress($b)];
        }

        $p = DB::table($row->party_type === 'partner' ? 'partners' : 'customers')->where('id', $row->party_id)->first(['name', 'address']);

        return $p ? ['name' => $p->name, 'address' => $p->address] : null;
    }

    private function branchAddress(?object $b): ?string
    {
        if ($b === null) {
            return null;
        }

        return implode(', ', array_filter([$b->agent_address ?? null, $b->agent_city ?? null, $b->agent_pincode ?? null, $b->agent_country ?? null])) ?: null;
    }

    /** "INNSA — Nhava Sheva" when the directory knows the name, the LOCODE alone when it does not. */
    private function port(?string $code): ?string
    {
        if (blank($code)) {
            return null;
        }

        $name = DB::table('ports')->where('locode', $code)->value('port_name');

        return $name ? "{$code} — {$name}" : $code;
    }
}
