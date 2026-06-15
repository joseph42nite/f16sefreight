<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\AccountsPurchaseVoucher;
use App\AccountsPurchaseItem;
use App\ChartOfAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseVoucherController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user() ?? auth('user-api')->user();

        if (auth('superAdmin-api')->check()) {
            $vouchers = AccountsPurchaseVoucher::with(['vendor', 'job'])->get();
        } else {
            $vouchers = AccountsPurchaseVoucher::where('agent_id', $user->branch_name)
                ->with(['vendor', 'job'])
                ->get();
        }

        return response()->json($vouchers);
    }

    public function show($id)
    {
        $voucher = AccountsPurchaseVoucher::with(['items', 'vendor', 'job'])->findOrFail($id);
        return response()->json($voucher);
    }

    public function store(Request $request)
    {
        $user = auth()->user() ?? auth('user-api')->user();

        $validated = $request->validate([
            'job_id' => 'required|exists:jobs,id',
            'vendor_id' => 'required|exists:companies,id',
            'document_date' => 'required|date',
            'vendor_invoice_no' => 'nullable|string',
            'vendor_invoice_date' => 'nullable|date',
            'currency' => 'required|string|max:3',
            'exchange_rate' => 'nullable|numeric',
            'subtotal' => 'required|numeric',
            'tax_amount' => 'required|numeric',
            'grand_total' => 'required|numeric',
            'items' => 'required|array',
            'items.*.charge_type' => 'required|string',
            'items.*.description' => 'required|string',
            'items.*.qty' => 'nullable|numeric',
            'items.*.unit_rate' => 'required|numeric',
            'items.*.tax_rate' => 'nullable|numeric',
            'items.*.subtotal' => 'required|numeric',
            'items.*.tax_amount' => 'required|numeric',
            'items.*.total_amount' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($validated, $user) {
            $voucher = AccountsPurchaseVoucher::create([
                'agent_id' => $user->branch_name,
                'voucher_no' => 'PV-DRAFT-' . strtoupper(uniqid()),
                'document_date' => $validated['document_date'],
                'job_id' => $validated['job_id'],
                'vendor_id' => $validated['vendor_id'],
                'vendor_invoice_no' => $validated['vendor_invoice_no'] ?? null,
                'vendor_invoice_date' => $validated['vendor_invoice_date'] ?? null,
                'currency' => $validated['currency'],
                'exchange_rate' => $validated['exchange_rate'] ?? 1.000000,
                'subtotal' => $validated['subtotal'],
                'tax_amount' => $validated['tax_amount'],
                'grand_total' => $validated['grand_total'],
                'status' => 'draft',
                'is_posted' => false,
                'created_by' => $user->id,
            ]);

            foreach ($validated['items'] as $itemData) {
                $voucher->items()->create([
                    'charge_type' => $itemData['charge_type'],
                    'description' => $itemData['description'] ?? '',
                    'qty' => $itemData['qty'] ?? 1.00,
                    'unit_rate' => $itemData['unit_rate'],
                    'tax_rate' => $itemData['tax_rate'] ?? 0.00,
                    'subtotal' => $itemData['subtotal'],
                    'tax_amount' => $itemData['tax_amount'] ?? 0.00,
                    'total_amount' => $itemData['total_amount'],
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Draft purchase voucher created successfully.',
                'voucher' => $voucher->load('items')
            ], 201);
        });
    }

    public function finalize($id)
    {
        return DB::transaction(function () use ($id) {
            $voucher = AccountsPurchaseVoucher::lockForUpdate()->findOrFail($id);

            if ($voucher->status === 'finalized') {
                return response()->json([
                    'status' => false,
                    'message' => 'Voucher is already finalized.'
                ], 422);
            }

            // Check accounting period
            $period = \App\AccountingPeriod::where('agent_id', $voucher->agent_id)
                ->whereDate('start_date', '<=', $voucher->document_date)
                ->whereDate('end_date', '>=', $voucher->document_date)
                ->first();

            if ($period && ($period->status === 'closed' || $period->status === 'locked')) {
                abort(403, 'Posting blocked: Accounting period is closed or locked.');
            }

            $voucherNo = \App\AccountsPurchaseVoucher::nextVoucherNumber($voucher->agent_id, $voucher->document_date->toDateString());

            $voucher->voucher_no = $voucherNo;
            $voucher->status = 'finalized';
            $voucher->is_posted = true;
            $voucher->save();

            // Post double-entry to accounts_ledger_entries
            $apAccount = $this->getOrCreateAccount($voucher->agent_id, '2100', 'Accounts Payable', 'liability');
            $expenseAccount = $this->getOrCreateAccount($voucher->agent_id, '5000', 'Purchase Expense', 'expense');

            // Credit: Accounts Payable for grand_total
            \App\AccountsLedgerEntry::create([
                'agent_id' => $voucher->agent_id,
                'chart_of_account_id' => $apAccount->id,
                'entry_date' => $voucher->document_date,
                'reference_type' => 'PurchaseVoucher',
                'reference_id' => $voucher->id,
                'debit' => 0.00,
                'credit' => $voucher->grand_total,
                'narration' => 'Voucher finalization: ' . $voucher->voucher_no,
            ]);

            // Debit: Purchase Expense for subtotal
            \App\AccountsLedgerEntry::create([
                'agent_id' => $voucher->agent_id,
                'chart_of_account_id' => $expenseAccount->id,
                'entry_date' => $voucher->document_date,
                'reference_type' => 'PurchaseVoucher',
                'reference_id' => $voucher->id,
                'debit' => $voucher->subtotal,
                'credit' => 0.00,
                'narration' => 'Expense recognition for: ' . $voucher->voucher_no,
            ]);

            // Debit: GST Input Tax Credit if tax_amount > 0
            if ($voucher->tax_amount > 0) {
                $itcAccount = $this->getOrCreateAccount($voucher->agent_id, '1300', 'GST Input Tax Credit', 'asset');
                \App\AccountsLedgerEntry::create([
                    'agent_id' => $voucher->agent_id,
                    'chart_of_account_id' => $itcAccount->id,
                    'entry_date' => $voucher->document_date,
                    'reference_type' => 'PurchaseVoucher',
                    'reference_id' => $voucher->id,
                    'debit' => $voucher->tax_amount,
                    'credit' => 0.00,
                    'narration' => 'Tax input credit on: ' . $voucher->voucher_no,
                ]);
            }

            // Compute GST Split
            $vendor = $voucher->vendor;
            $agent = $voucher->agent;
            $vendorState = $vendor ? trim(strtolower($vendor->billing_state ?? '')) : '';
            $agentState = $agent ? trim(strtolower($agent->agent_state ?? '')) : '';

            if ($vendorState && $agentState && $vendorState === $agentState) {
                $cgstRate = 9.00;
                $sgstRate = 9.00;
                $igstRate = 0.00;
                $cgstAmount = round($voucher->tax_amount / 2, 2);
                $sgstAmount = $voucher->tax_amount - $cgstAmount;
                $igstAmount = 0.00;
            } else {
                $cgstRate = 0.00;
                $sgstRate = 0.00;
                $igstRate = 18.00;
                $cgstAmount = 0.00;
                $sgstAmount = 0.00;
                $igstAmount = $voucher->tax_amount;
            }

            // Write entry to gst_ledger_entries
            \App\GstLedgerEntry::create([
                'agent_id' => $voucher->agent_id,
                'voucher_id' => $voucher->id,
                'voucher_type' => 'PurchaseVoucher',
                'voucher_no' => $voucher->voucher_no,
                'voucher_date' => $voucher->document_date,
                'company_id' => $voucher->vendor_id,
                'cgst_rate' => $cgstRate,
                'cgst_amount' => $cgstAmount,
                'sgst_rate' => $sgstRate,
                'sgst_amount' => $sgstAmount,
                'igst_rate' => $igstRate,
                'igst_amount' => $igstAmount,
                'total_tax' => $voucher->tax_amount,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Voucher finalized successfully.',
                'voucher' => $voucher
            ]);
        });
    }

    private function getOrCreateAccount(int $agentId, string $code, string $name, string $type)
    {
        return ChartOfAccount::firstOrCreate(
            [
                'agent_id' => $agentId,
                'code' => $code,
            ],
            [
                'name' => $name,
                'type' => $type,
                'is_active' => true,
            ]
        );
    }
}
