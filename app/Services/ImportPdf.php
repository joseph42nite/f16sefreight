<?php

namespace App\Services;

use App\Job;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

/**
 * The two printed import documents — the cargo arrival notice and the delivery order (GAPS #434).
 *
 * ❓ Like the BL, the LAYOUT is proposed: PRD §5.8/§8.1 name what the documents carry, not how they look, and no legal
 * wording is invented — each prints the shipment's own figures and a signature line. Estimated release fees on the
 * notice are the job's issued bills, never a computed guess.
 */
class ImportPdf
{
    public function arrivalNotice(Job $job): string
    {
        return $this->render('documents.arrival-notice', $job);
    }

    public function deliveryOrder(Job $job): string
    {
        return $this->render('documents.delivery-order', $job);
    }

    private function render(string $view, Job $job): string
    {
        return Pdf::loadView($view, ['doc' => $this->shape($job)])->setPaper('a4', 'portrait')
            ->set_option('isHtml5ParserEnabled', true)->output();
    }

    public function shape(Job $job): array
    {
        $branch = DB::table('agents_info')->where('id', $job->agent_id)->first();
        $sea = $job->transport_mode === 'sea';
        $d = DB::table($sea ? 'sea_shipment_details' : 'air_shipment_details')->where('job_id', $job->id)->first();
        $imp = $sea ? null : DB::table('air_import_details')->where('job_id', $job->id)->first();

        return [
            'mode'      => $job->transport_mode,
            'issuer'    => [
                'name'    => $branch ? DB::table('companies')->where('id', $branch->company_id)->value('name') : null,
                'branch'  => $branch->agent_name ?? null,
                'address' => $branch ? implode(', ', array_filter([$branch->agent_address, $branch->agent_city, $branch->agent_pincode])) : null,
                'gst_no'  => $branch->gst_no ?? null,
            ],
            'job_no'    => $job->execution_job_no,
            'client'    => $job->customer_id ? DB::table('customers')->where('id', $job->customer_id)->first(['name', 'address']) : null,
            'consignee' => $this->party($job, 'consignee'),
            'document'  => $sea
                ? ['label' => $job->is_consolidation ? 'MBL' : 'HBL', 'no' => $job->is_consolidation ? ($d->mbl_number ?? null) : ($d->hbl_number ?? null)]
                : ['label' => 'MAWB', 'no' => $job->awb_number],
            'carriage'  => $sea
                ? trim(($d->vessel_name ?? '') . (($d->voyage_no ?? null) ? ' / ' . $d->voyage_no : ''))
                : trim(($d->carrier_name ?? '') . (($d->flight_number ?? null) ? ' ' . $d->flight_number : '')),
            'from'      => $d->pol_code ?? null,
            'to'        => $d->pod_code ?? null,
            'arrival'   => $sea ? ($d->eta ?? null) : ($imp->arrived_at ?? null),
            'igm_no'    => ($sea ? $d : $imp)->igm_no ?? null,
            'igm_date'  => ($sea ? $d : $imp)->igm_date ?? null,
            'free_days' => $imp->free_storage_days ?? null,
            'storage_from' => $imp->storage_from ?? null,
            'pieces'    => $d->piece_count ?? null,
            'gross'     => $d->gross_weight ?? null,
            'containers' => $sea ? DB::table('sea_containers')->where('job_id', $job->id)->whereNull('deleted_at')
                ->get(['container_number', 'container_type', 'seal_number'])->all() : [],
            'can'       => DB::table('cargo_arrival_notices')->where('job_id', $job->id)->first(),
            'do'        => DB::table('delivery_orders')->where('job_id', $job->id)->first(),
            // What the client owes on this shipment — the issued bills themselves, never an estimate made up here.
            'bills'     => DB::table('accounts_invoices')->where('job_id', $job->id)->whereNotIn('status', ['draft', 'void'])
                ->get(['invoice_no', 'type', 'grand_total', 'amount_paid', 'currency'])->all(),
        ];
    }

    private function party(Job $job, string $role): ?array
    {
        $row = DB::table('job_entities')->where('job_id', $job->id)->where('role', $role)->whereNull('deleted_at')->first();

        if ($row === null || $row->party_type === 'branch') {
            return null;
        }

        $p = DB::table($row->party_type === 'partner' ? 'partners' : 'customers')->where('id', $row->party_id)->first(['name', 'address']);

        return $p ? ['name' => $p->name, 'address' => $p->address] : null;
    }
}
