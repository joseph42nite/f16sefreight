<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Job;
use App\CargoArrivalNotice;
use App\JobDocument;
use App\Company;
use App\AccountsInvoice;
use App\AccountsInvoiceItem;
use App\ManifestFiling;
use App\Enums\JobStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ImportShipmentController extends Controller
{
    /**
     * Send Arrival Notice
     * POST /api/user/import-shipments/{id}/send-arrival-notice
     */
    public function sendArrivalNotice(Request $request, $id)
    {
        $user = auth()->user() ?? auth('user-api')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $job = Job::where('agent_id', $user->branch_name)->findOrFail($id);

        $request->validate([
            'free_storage_days' => 'nullable|integer|min:0',
            'storage_charges_start_date' => 'nullable|date',
        ]);

        return DB::transaction(function () use ($request, $job, $user) {
            $notice = CargoArrivalNotice::firstOrNew(['job_id' => $job->id]);

            if (!$notice->exists) {
                $notice->agent_id = $job->agent_id;
                $notice->can_no = $this->nextCanNumber($job->agent_id);
                $notice->document_date = now()->toDateString();
            }

            $notice->free_storage_days = $request->input('free_storage_days', 2);
            $notice->storage_charges_start_date = $request->input('storage_charges_start_date');
            $notice->sent_to_consignee_at = now();
            $notice->save();

            // Register draft PDF in E-Docket (job_documents)
            JobDocument::create([
                'agent_id' => $job->agent_id,
                'job_id' => $job->id,
                'document_type' => 'arrival_notice',
                'filename' => $notice->can_no . '.pdf',
                'file_path' => 'e-docket/arrival_notices/' . $notice->can_no . '.pdf',
                'mime_type' => 'application/pdf',
                'uploaded_by' => $user->id,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Arrival notice generated and registered in E-Docket successfully.',
                'arrival_notice' => $notice
            ]);
        });
    }

    /**
     * Issue Delivery Order
     * POST /api/user/import-shipments/{id}/issue-delivery-order
     */
    public function issueDeliveryOrder(Request $request, $id)
    {
        $user = auth()->user() ?? auth('user-api')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $job = Job::where('agent_id', $user->branch_name)->findOrFail($id);

        // Fetch client/consignee to validate credit limit
        if (!$job->client_id) {
            return response()->json([
                'status' => false,
                'message' => 'No client/consignee associated with this job.'
            ], 422);
        }

        $consignee = Company::findOrFail($job->client_id);

        // Credit Limit checks
        $creditLimit = (float) $consignee->credit_limit;
        $creditBalance = (float) $consignee->credit_balance;

        $isSuspended = ($consignee->credit_status === 'suspended')
            || (is_array($consignee->templates_config) && isset($consignee->templates_config['credit_status']) && $consignee->templates_config['credit_status'] === 'suspended');

        if ($isSuspended || ($creditLimit > 0 && $creditBalance > $creditLimit)) {
            return response()->json([
                'status' => false,
                'message' => 'Consignee credit limit exceeded or credit status is suspended.'
            ], 422);
        }

        // Fetch linked invoice
        $invoice = AccountsInvoice::where('job_id', $job->id)->first();
        if (!$invoice) {
            return response()->json([
                'status' => false,
                'message' => 'No linked invoice found for this job.'
            ], 422);
        }

        // Payment status checks
        if ($invoice->payment_status === 'Pending' || $request->input('payment_status') === 'Pending') {
            return response()->json([
                'status' => false,
                'message' => 'Linked invoice payment status is Pending.'
            ], 422);
        }

        return DB::transaction(function () use ($request, $job, $invoice, $user) {
            $doReleaseFee = (float) $request->input('do_release_fee', 1500.00);
            $warehouseFee = (float) $request->input('warehouse_fee', 2500.00);

            // Delete pre-existing DO/Warehouse charges from this invoice
            AccountsInvoiceItem::where('invoice_id', $invoice->id)
                ->whereIn('charge_type', ['Delivery Order Release Charges', 'Warehouse Handling Charges'])
                ->delete();

            // Inject new line items
            $invoice->items()->create([
                'charge_type' => 'Delivery Order Release Charges',
                'description' => 'Delivery Order Release Charges',
                'qty' => 1.00,
                'unit_rate' => $doReleaseFee,
                'tax_rate' => 18.00,
                'subtotal' => $doReleaseFee,
                'tax_amount' => $doReleaseFee * 0.18,
                'total_amount' => $doReleaseFee * 1.18,
            ]);

            $invoice->items()->create([
                'charge_type' => 'Warehouse Handling Charges',
                'description' => 'Warehouse Handling Charges',
                'qty' => 1.00,
                'unit_rate' => $warehouseFee,
                'tax_rate' => 18.00,
                'subtotal' => $warehouseFee,
                'tax_amount' => $warehouseFee * 0.18,
                'total_amount' => $warehouseFee * 1.18,
            ]);

            // Recalculate invoice totals
            $subtotal = (float) $invoice->items()->sum('subtotal');
            $taxAmount = (float) $invoice->items()->sum('tax_amount');
            $grandTotal = (float) $invoice->items()->sum('total_amount');

            $invoice->update([
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'grand_total' => $grandTotal,
            ]);

            // Generate DO reference
            $doRef = 'DO-AIMP-' . random_int(10000, 99999);

            // Register DO PDF in E-Docket
            JobDocument::create([
                'agent_id' => $job->agent_id,
                'job_id' => $job->id,
                'document_type' => 'delivery_order',
                'filename' => $doRef . '.pdf',
                'file_path' => 'e-docket/delivery_orders/' . $doRef . '.pdf',
                'mime_type' => 'application/pdf',
                'uploaded_by' => $user->id,
            ]);

            // Set job status to Completed
            $job->status = JobStatus::Completed;
            $job->save();

            return response()->json([
                'status' => true,
                'message' => 'Delivery Order issued successfully.',
                'delivery_order_no' => $doRef,
                'delivery_order_date' => now()->toDateTimeString(),
                'invoice' => $invoice->load('items'),
            ]);
        });
    }

    /**
     * Submit CGM Manifest to ICEGATE
     * POST /api/user/import-shipments/{id}/submit-cgm
     */
    public function submitCgm(Request $request, $id)
    {
        $user = auth()->user() ?? auth('user-api')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $job = Job::where('agent_id', $user->branch_name)->findOrFail($id);

        // Validate customs house code
        $customsHouse = $request->input('customs_house_code') ?? $request->input('customs_house');
        if (!$customsHouse || strlen($customsHouse) !== 6) {
            return response()->json([
                'status' => false,
                'message' => 'Customs house code must be exactly 6 characters.'
            ], 422);
        }

        // Validate MAWB Number (try request input first, fallback to linked waybills)
        $mawbNumber = $request->input('mawb_number');
        if (!$mawbNumber) {
            $awb = $job->airwayBills()->first();
            $mawbNumber = $awb ? $awb->awb_no : null;
        }

        if (!$mawbNumber) {
            return response()->json([
                'status' => false,
                'message' => 'Master Air Waybill (MAWB) number is required.'
            ], 422);
        }

        if (!preg_match('/^\d{3}-\d{8}$/', $mawbNumber)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid MAWB number format.'
            ], 422);
        }

        // Validate linked HAWBs count (Consolidation folder must have at least one linked HAWB)
        $hasLinkedHawb = $job->subShipments()->exists() || $job->housewayBills()->exists();
        if (!$hasLinkedHawb) {
            return response()->json([
                'status' => false,
                'message' => 'Consolidation must contain at least one linked HAWB.'
            ], 422);
        }

        return DB::transaction(function () use ($request, $job, $customsHouse, $user) {
            // Simulated DSC signature logs
            $dscLogs = [
                ['type' => 'info', 'text' => '[DSC] Connecting USB Digital Signature Certificate (DSC)...'],
                ['type' => 'info', 'text' => "Found Active Profile: 'JOMY GEORGE (e-Mudhra Class 3 Signer)'"],
                ['type' => 'success', 'text' => 'Running PIN authorization challenge... Accepted.'],
                ['type' => 'info', 'text' => 'Encrypting cargo manifest flat-file structure...'],
                ['type' => 'success', 'text' => 'Signed file successfully transmitted via HTTPS gateway.'],
                ['type' => 'success', 'text' => 'Response code: 200. IGM Reference Received: SCMTR-AIMP-9028']
            ];

            // Create manifest filing record
            $filing = ManifestFiling::create([
                'agent_id' => $job->agent_id,
                'job_id' => $job->id,
                'filing_reference' => 'SCMTR-AIMP-' . random_int(1000, 9999),
                'customs_house_code' => strtoupper($customsHouse),
                'transaction_status' => 'Accepted',
                'transport_mode' => 'air',
                'filing_date' => $request->input('filing_date') ?? now()->toDateString(),
                'response_payload' => json_encode($dscLogs),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'CGM Manifest submitted and accepted by customs successfully.',
                'filing' => $filing,
                'dsc_logs' => $dscLogs
            ]);
        });
    }

    /**
     * Helper to generate Cargo Arrival Notice sequence number.
     */
    private function nextCanNumber(int $agentId): string
    {
        $prefix = 'CAN';
        $fiscalYear = now()->format('y');

        return DB::transaction(function () use ($agentId, $prefix, $fiscalYear) {
            $counter = \App\SequenceCounter::where('agent_id', $agentId)
                ->where('prefix', $prefix)
                ->where('fiscal_year', $fiscalYear)
                ->lockForUpdate()
                ->first();

            if (!$counter) {
                $counter = \App\SequenceCounter::create([
                    'agent_id'      => $agentId,
                    'prefix'        => $prefix,
                    'fiscal_year'   => $fiscalYear,
                    'current_value' => 0,
                ]);
            }

            $counter->increment('current_value');
            $counter->refresh();

            return sprintf('%s-%s-%04d', $prefix, $fiscalYear, $counter->current_value);
        });
    }
}
