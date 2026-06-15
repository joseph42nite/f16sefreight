<?php

namespace App\Observers;

use App\AccountsInvoice;
use App\AccountingPeriod;
use App\AccountsLedgerEntry;
use App\GstLedgerEntry;
use App\ChartOfAccount;
use Illuminate\Support\Facades\DB;

class InvoiceObserver
{
    public function updating(AccountsInvoice $invoice)
    {
        // If is_posted transitions from false to true
        if ($invoice->isDirty('is_posted') && $invoice->is_posted && !$invoice->getOriginal('is_posted')) {
            // 1. Validate accounting period
            $period = AccountingPeriod::where('agent_id', $invoice->agent_id)
                ->whereDate('start_date', '<=', $invoice->document_date)
                ->whereDate('end_date', '>=', $invoice->document_date)
                ->first();

            if ($period && ($period->status === 'closed' || $period->status === 'locked')) {
                abort(403, 'Posting blocked: Accounting period is closed or locked.');
            }

            // 2. Compute GST split
            $client = $invoice->client;
            $agent = $invoice->agent;
            
            $clientState = $client ? trim(strtolower($client->billing_state ?? '')) : '';
            $agentState = $agent ? trim(strtolower($agent->agent_state ?? '')) : '';

            if ($clientState && $agentState && $clientState === $agentState) {
                // Intrastate
                $cgstRate = 9.00;
                $sgstRate = 9.00;
                $igstRate = 0.00;
                $cgstAmount = round($invoice->tax_amount / 2, 2);
                $sgstAmount = $invoice->tax_amount - $cgstAmount;
                $igstAmount = 0.00;
            } else {
                // Interstate
                $cgstRate = 0.00;
                $sgstRate = 0.00;
                $igstRate = 18.00;
                $cgstAmount = 0.00;
                $sgstAmount = 0.00;
                $igstAmount = $invoice->tax_amount;
            }

            // 3. Post double-entry to accounts_ledger_entries
            // Get or create Accounts Receivable
            $arAccount = $this->getOrCreateAccount($invoice->agent_id, '1200', 'Accounts Receivable', 'asset');
            // Get or create Sales Revenue
            $revAccount = $this->getOrCreateAccount($invoice->agent_id, '4000', 'Sales Revenue', 'revenue');
            
            // Debit: Accounts Receivable for grand_total
            AccountsLedgerEntry::create([
                'agent_id' => $invoice->agent_id,
                'chart_of_account_id' => $arAccount->id,
                'entry_date' => $invoice->document_date,
                'reference_type' => 'Invoice',
                'reference_id' => $invoice->id,
                'debit' => $invoice->grand_total,
                'credit' => 0.00,
                'narration' => 'Invoice finalization: ' . $invoice->invoice_no,
            ]);

            // Credit: Sales Revenue for subtotal
            AccountsLedgerEntry::create([
                'agent_id' => $invoice->agent_id,
                'chart_of_account_id' => $revAccount->id,
                'entry_date' => $invoice->document_date,
                'reference_type' => 'Invoice',
                'reference_id' => $invoice->id,
                'debit' => 0.00,
                'credit' => $invoice->subtotal,
                'narration' => 'Revenue recognition for: ' . $invoice->invoice_no,
            ]);

            // Credit: Tax Payable (GST output) if tax_amount > 0
            if ($invoice->tax_amount > 0) {
                $taxAccount = $this->getOrCreateAccount($invoice->agent_id, '2200', 'GST Tax Payable', 'liability');
                AccountsLedgerEntry::create([
                    'agent_id' => $invoice->agent_id,
                    'chart_of_account_id' => $taxAccount->id,
                    'entry_date' => $invoice->document_date,
                    'reference_type' => 'Invoice',
                    'reference_id' => $invoice->id,
                    'debit' => 0.00,
                    'credit' => $invoice->tax_amount,
                    'narration' => 'Tax output on: ' . $invoice->invoice_no,
                ]);
            }

            // 4. Write entry in gst_ledger_entries
            GstLedgerEntry::create([
                'agent_id' => $invoice->agent_id,
                'voucher_id' => $invoice->id,
                'voucher_type' => 'Invoice',
                'voucher_no' => $invoice->invoice_no,
                'voucher_date' => $invoice->document_date,
                'company_id' => $invoice->client_id,
                'cgst_rate' => $cgstRate,
                'cgst_amount' => $cgstAmount,
                'sgst_rate' => $sgstRate,
                'sgst_amount' => $sgstAmount,
                'igst_rate' => $igstRate,
                'igst_amount' => $igstAmount,
                'total_tax' => $invoice->tax_amount,
            ]);
        }
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
