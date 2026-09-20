<?php

namespace App\Services\Billing;

use App\AccountsInvoice;
use App\Support\BillingDocuments;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

/**
 * A printed bill — one, or a hundred in one file (user, 2026-09-19: Multiple Bill Printing).
 *
 * 🔴 **Nothing is recomputed for the print.** The header totals are what finalization wrote and what the ledger
 * posted; a print that re-adds the lines would disagree with the books the day a line is edited on a draft.
 *
 * ⚠️ A DRAFT prints, and says so on its face. Accounts check a bill before they number it, and a print they cannot
 * take until it is final is a print they will take a screenshot of instead.
 */
class BillPdf
{
    /** @param  iterable<AccountsInvoice>  $invoices */
    public function render(iterable $invoices): string
    {
        $bills = array_map(fn ($invoice) => $this->shape($invoice), is_array($invoices) ? $invoices : iterator_to_array($invoices));

        return Pdf::loadView('documents.bill', ['bills' => $bills])
            ->setPaper('a4', 'portrait')
            ->set_option('isHtml5ParserEnabled', true)
            ->output();
    }

    /** One file name a person can find again: `INV-F16BOM-26-0001.pdf`, or the count when there are several. */
    public function filename(array $invoiceNumbers): string
    {
        return count($invoiceNumbers) === 1
            ? preg_replace('/[^A-Za-z0-9\-]/', '', $invoiceNumbers[0]) . '.pdf'
            : 'bills-' . count($invoiceNumbers) . '-' . now()->format('Ymd-His') . '.pdf';
    }

    /** Everything the template prints, read once per document. */
    private function shape(AccountsInvoice $invoice): array
    {
        $branch = DB::table('agents_info')->where('id', $invoice->agent_id)->first();
        $company = $branch === null ? null : DB::table('companies')->where('id', $branch->company_id)->first();
        $job = DB::table('jobs')->where('id', $invoice->job_id)->first(['execution_job_no', 'awb_number']);
        $party = $this->party($invoice);

        $rate = (float) ($invoice->exchange_rate ?: 1);

        return [
            'company' => $company->name ?? 'Company',
            'branch' => $branch->agent_name ?? '',
            'gst_no' => \Illuminate\Support\Facades\Schema::hasColumn('agents_info', 'gst_no') ? ($branch->gst_no ?? null) : null,
            'title' => BillingDocuments::label($invoice->type),
            'invoice_no' => $invoice->invoice_no,
            'document_date' => optional($invoice->document_date)->format('d M Y'),
            'due_date' => $invoice->due_date ? \Illuminate\Support\Carbon::parse($invoice->due_date)->format('d M Y') : null,
            'organization' => $party['name'],
            'organization_gst' => $party['gst_no'],
            'job_no' => $job->execution_job_no ?? null,
            'awb_number' => $job->awb_number ?? null,
            'parent_no' => $invoice->parent_invoice_id
                ? AccountsInvoice::withoutTenantScope()->where('id', $invoice->parent_invoice_id)->value('invoice_no')
                : null,
            'reason' => $invoice->reason,
            'narration' => $invoice->narration,
            'irn' => $invoice->irn,
            'items' => $invoice->items()->get(),
            'currency' => $invoice->currency,
            'exchange_rate' => rtrim(rtrim(number_format($rate, 4), '0'), '.'),
            'subtotal' => (float) $invoice->subtotal,
            'tax_amount' => (float) $invoice->tax_amount,
            'grand_total' => (float) $invoice->grand_total,
            'amount_inr' => round((float) $invoice->grand_total * $rate, 2),
            // A draft says so on its face; a bill says what is owed — and a credit note owes the other way round,
            // so printing "Outstanding" on one asks the client for money we are giving back.
            'status_line' => match (true) {
                $invoice->status === 'draft' => 'DRAFT — not a valid tax document until it is finalized.',
                $invoice->type === 'credit_note' => 'Credit of ' . $invoice->currency . ' '
                    . number_format((float) $invoice->grand_total, 2) . ' to be adjusted against your account.',
                default => 'Outstanding: ' . $invoice->currency . ' ' . number_format($invoice->outstanding(), 2),
            },
        ];
    }

    /** Who the bill is addressed to: a customer, or a partner for brokerage and consol. */
    private function party(AccountsInvoice $invoice): array
    {
        $table = $invoice->billed_party_type === 'partner' ? 'partners' : 'customers';
        $id = $invoice->billed_party_id ?: $invoice->customer_id;
        $row = $id === null ? null : DB::table($table)->where('id', $id)->first();

        return ['name' => $row->name ?? 'Not addressed', 'gst_no' => $row->gst_no ?? null];
    }
}
