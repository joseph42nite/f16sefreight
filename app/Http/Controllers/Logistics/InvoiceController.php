<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\AccountsInvoice;
use App\AccountsInvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user() ?? auth('user-api')->user();

        if (auth('superAdmin-api')->check()) {
            $invoices = AccountsInvoice::with(['client', 'job'])->get();
        } else {
            $invoices = AccountsInvoice::where('agent_id', $user->branch_name)
                ->with(['client', 'job'])
                ->get();
        }

        return response()->json($invoices);
    }

    public function show($id)
    {
        $invoice = AccountsInvoice::with(['items', 'brokerageDetail', 'consolDetail', 'client', 'job'])->findOrFail($id);
        return response()->json($invoice);
    }

    public function store(Request $request)
    {
        $user = auth()->user() ?? auth('user-api')->user();
        
        $validated = $request->validate([
            'job_id' => 'required|exists:jobs,id',
            'client_id' => 'required|exists:companies,id',
            'type' => 'required|in:invoice,debit_note,credit_note,brokerage,consol_invoice',
            'document_date' => 'required|date',
            'due_date' => 'required|date',
            'currency' => 'required|string|max:3',
            'exchange_rate' => 'nullable|numeric',
            'billing_address' => 'nullable|string',
            'tax_registration_no' => 'nullable|string',
            'payment_terms' => 'nullable|string',
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
            $invoice = AccountsInvoice::create([
                'agent_id' => $user->branch_name,
                'type' => $validated['type'],
                'invoice_no' => 'DRAFT-' . strtoupper(uniqid()),
                'document_date' => $validated['document_date'],
                'job_id' => $validated['job_id'],
                'client_id' => $validated['client_id'],
                'currency' => $validated['currency'],
                'exchange_rate' => $validated['exchange_rate'] ?? 1.000000,
                'billing_address' => $validated['billing_address'] ?? null,
                'tax_registration_no' => $validated['tax_registration_no'] ?? null,
                'payment_terms' => $validated['payment_terms'] ?? null,
                'subtotal' => $validated['subtotal'],
                'tax_amount' => $validated['tax_amount'],
                'grand_total' => $validated['grand_total'],
                'status' => 'draft',
                'is_posted' => false,
                'due_date' => $validated['due_date'],
                'created_by' => $user->id,
            ]);

            foreach ($validated['items'] as $itemData) {
                $invoice->items()->create([
                    'house_job_id' => $itemData['house_job_id'] ?? null,
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
                'message' => 'Draft invoice created successfully.',
                'invoice' => $invoice->load('items')
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $invoice = AccountsInvoice::findOrFail($id);

        if ($invoice->status === 'finalized') {
            return response()->json([
                'status' => false,
                'message' => 'Finalized invoices cannot be updated.'
            ], 422);
        }

        $validated = $request->validate([
            'job_id' => 'required|exists:jobs,id',
            'client_id' => 'required|exists:companies,id',
            'type' => 'required|in:invoice,debit_note,credit_note,brokerage,consol_invoice',
            'document_date' => 'required|date',
            'due_date' => 'required|date',
            'currency' => 'required|string|max:3',
            'exchange_rate' => 'nullable|numeric',
            'billing_address' => 'nullable|string',
            'tax_registration_no' => 'nullable|string',
            'payment_terms' => 'nullable|string',
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

        return DB::transaction(function () use ($invoice, $validated) {
            $invoice->update([
                'type' => $validated['type'],
                'document_date' => $validated['document_date'],
                'job_id' => $validated['job_id'],
                'client_id' => $validated['client_id'],
                'currency' => $validated['currency'],
                'exchange_rate' => $validated['exchange_rate'] ?? 1.000000,
                'billing_address' => $validated['billing_address'] ?? null,
                'tax_registration_no' => $validated['tax_registration_no'] ?? null,
                'payment_terms' => $validated['payment_terms'] ?? null,
                'subtotal' => $validated['subtotal'],
                'tax_amount' => $validated['tax_amount'],
                'grand_total' => $validated['grand_total'],
                'due_date' => $validated['due_date'],
            ]);

            $invoice->items()->delete();

            foreach ($validated['items'] as $itemData) {
                $invoice->items()->create([
                    'house_job_id' => $itemData['house_job_id'] ?? null,
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
                'message' => 'Invoice updated successfully.',
                'invoice' => $invoice->load('items')
            ]);
        });
    }

    public function finalize($id)
    {
        return DB::transaction(function () use ($id) {
            $invoice = AccountsInvoice::lockForUpdate()->findOrFail($id);

            if ($invoice->status === 'finalized') {
                return response()->json([
                    'status' => false,
                    'message' => 'Invoice is already finalized.'
                ], 422);
            }

            $invoiceNo = \App\InvoiceSequence::nextInvoiceNumber(
                $invoice->agent_id,
                $invoice->type,
                $invoice->document_date->toDateString()
            );

            $invoice->invoice_no = $invoiceNo;
            $invoice->status = 'finalized';
            $invoice->is_posted = true;
            $invoice->save();

            return response()->json([
                'status' => true,
                'message' => 'Invoice finalized successfully.',
                'invoice' => $invoice
            ]);
        });
    }
}
