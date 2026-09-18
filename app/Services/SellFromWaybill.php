<?php

namespace App\Services;

use App\AccountsInvoice;
use App\AccountsInvoiceItem;
use App\Job;
use Illuminate\Support\Facades\DB;

/**
 * The cost sheet's SELL side, written from the draft air waybill (user, 2026-09-18: "the cost sheet is not updating on
 * its own — keep updating the sell when updating the draft; buy we'll add later").
 *
 * 🔴 **The waybill is never touched.** This reads it and writes billing lines, the one direction PRD §6.7 allows: a
 * rate typed on the cost sheet must never move a figure that appears on a customs declaration.
 *
 * ⚠️ **Only the lines it wrote.** Every line it creates is marked `source = 'waybill'` and those are replaced on each
 * save; anything a person typed is left exactly as it is. A posted invoice is never rewritten — corrections go through
 * a credit note.
 */
class SellFromWaybill
{
    public const SOURCE = 'waybill';

    /** @return int the number of lines written */
    public function refresh(string|int $awbId): int
    {
        $waybill = DB::table('air_way_bills')->where('id', $awbId)->first(['id', 'job_id', 'agent_id', 'awb_code', 'awb_no']);

        if ($waybill === null || $waybill->job_id === null) {
            return 0;
        }

        $job = Job::withoutTenantScope()->find($waybill->job_id);

        // Posted: the revenue is booked and filed. Nothing here rewrites it.
        if ($job === null || AccountsInvoice::withoutTenantScope()->where('job_id', $job->id)->where('status', '!=', 'draft')->exists()) {
            return 0;
        }

        $cargo = DB::table('way_bill_consignment_data')->where('awb_id', $awbId)->first(['chargable_weight', 'gross_weight', 'rate']);
        $payment = DB::table('payment_info')->where('awb_id', $awbId)->first();
        $number = \App\Support\AwbNumber::normalise((string) $waybill->awb_code . $waybill->awb_no) ?? (string) $awbId;

        $lines = [];
        $weight = (float) ($cargo->chargable_weight ?? $cargo->gross_weight ?? 0);
        $rate = (float) ($cargo->rate ?? 0);
        $weightCharge = (float) ($payment->weight_charge ?? 0);

        // Air freight: the rate on the waybill × the weight it is charged on; failing that, the weight charge as written.
        if ($weight > 0 && $rate > 0) {
            $lines[] = ['charge_type' => 'air_freight', 'charge_basis' => 'per_weight_ton',
                'description' => "Air freight — AWB {$number}, {$weight} kg", 'quantity' => $weight, 'rate' => $rate];
        } elseif ($weightCharge > 0) {
            $lines[] = ['charge_type' => 'air_freight', 'charge_basis' => 'flat_rate',
                'description' => "Air freight — AWB {$number}", 'quantity' => 1, 'rate' => $weightCharge];
        }

        foreach ([
            'other_charges_due_agent' => 'Other charges due agent',
            'other_charges_due_carrier' => 'Other charges due carrier',
        ] as $column => $label) {
            $amount = (float) ($payment->{$column . '_prepaid'} ?? 0) + (float) ($payment->{$column . '_collect'} ?? 0);

            if ($amount > 0) {
                $lines[] = ['charge_type' => 'miscellaneous', 'charge_basis' => 'flat_rate',
                    'description' => "{$label} — AWB {$number}", 'quantity' => 1, 'rate' => $amount];
            }
        }

        return DB::transaction(function () use ($job, $lines) {
            $invoice = $this->invoiceFor($job);

            AccountsInvoiceItem::where('invoice_id', $invoice->id)->where('source', self::SOURCE)->delete();

            foreach ($lines as $line) {
                $amount = round($line['quantity'] * $line['rate'], 2);

                AccountsInvoiceItem::create($line + [
                    'invoice_id' => $invoice->id,
                    'source' => self::SOURCE,
                    'amount' => $amount,
                    // Tax is the accounts side's decision; the waybill says nothing about it.
                    'tax_status' => 'taxable', 'tax_percentage' => 0, 'tax_amount' => 0,
                    'net_amount' => $amount,
                ]);
            }

            return count($lines);
        });
    }

    private function invoiceFor(Job $job): AccountsInvoice
    {
        $draft = AccountsInvoice::withoutTenantScope()->where('job_id', $job->id)->where('status', 'draft')->first();

        return $draft ?? AccountsInvoice::create([
            'agent_id' => $job->agent_id, 'job_id' => $job->id,
            'transport_mode' => $job->transport_mode, 'customer_id' => $job->customer_id,
            'created_by' => auth()->id(),
            'invoice_no' => AccountsInvoice::placeholderNumber($job->id),
            'type' => 'invoice', 'document_date' => now()->toDateString(),
            'status' => 'draft', 'currency' => 'INR',
        ]);
    }
}
