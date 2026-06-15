<?php

namespace App\Services;

use App\BankStatement;
use App\AccountsInvoice;
use App\AirwayBills;
use App\Job;
use App\AccountsLedgerEntry;
use App\ChartOfAccount;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BankMatchingEngine
{
    /**
     * Run reconciliation for all unreconciled statements in an agent/branch.
     *
     * @param  int  $agentId
     * @return int  Number of successfully matched transactions
     */
    public function reconcileAgentPayments(int $agentId): int
    {
        $statements = BankStatement::where('agent_id', $agentId)
            ->where('status', 'unreconciled')
            ->get();

        $matchedCount = 0;
        foreach ($statements as $statement) {
            if ($this->reconcileStatement($statement)) {
                $matchedCount++;
            }
        }

        return $matchedCount;
    }

    /**
     * Reconcile a single bank statement transaction.
     *
     * @param  \App\BankStatement  $statement
     * @return bool
     */
    public function reconcileStatement(BankStatement $statement): bool
    {
        // Level 1: Direct Matching (Job ID or AWB in sender_reference)
        $invoice = $this->findInvoiceByDirectReference($statement);

        // Level 2: Fuzzy Matching (Amount + Name match)
        if (!$invoice) {
            $invoice = $this->findInvoiceByFuzzyMatch($statement);
        }

        if ($invoice) {
            DB::transaction(function () use ($statement, $invoice) {
                // Update Invoice Status
                $invoice->update(['status' => 'paid']);

                // Update Statement Status
                $statement->update([
                    'status' => 'reconciled',
                    'matched_invoice_id' => $invoice->id
                ]);

                // Post Journal entries to General Ledger
                $this->postLedgerPayment($statement, $invoice);
            });

            return true;
        }

        return false;
    }

    /**
     * Look up invoice using Job No or AWB No found in reference text.
     */
    protected function findInvoiceByDirectReference(BankStatement $statement): ?AccountsInvoice
    {
        $ref = $statement->sender_reference;

        // 1. Extract Job Number (e.g. JOBA-26-0001, JOBS-26-0002, ENQA-26-0001)
        if (preg_match('/\b((?:JOBA|JOBS|ENQA|ENQS|JOBS-26|JOBA-26)-26-\d{4,6})\b/i', $ref, $matches)) {
            $jobNo = strtoupper($matches[1]);
            $job = Job::where('execution_job_no', $jobNo)
                ->orWhere('enquiry_no', $jobNo)
                ->first();

            if ($job) {
                $invoice = AccountsInvoice::where('job_id', $job->id)
                    ->where('status', 'finalized')
                    ->where('agent_id', $statement->agent_id)
                    ->first();

                if ($invoice && abs($invoice->grand_total - $statement->amount) < 0.01) {
                    return $invoice;
                }
            }
        }

        // 2. Extract AWB / HAWB Number (e.g. 123-45678901 or 12345678901)
        if (preg_match('/\b(\d{3})[-\s]?(\d{8})\b/', $ref, $matches)) {
            $awbCode = $matches[1];
            $awbNo = $matches[2];

            $awb = AirwayBills::where('awb_code', $awbCode)
                ->where('awb_no', $awbNo)
                ->first();

            if ($awb && $awb->job_id) {
                $invoice = AccountsInvoice::where('job_id', $awb->job_id)
                    ->where('status', 'finalized')
                    ->where('agent_id', $statement->agent_id)
                    ->first();

                if ($invoice && abs($invoice->grand_total - $statement->amount) < 0.01) {
                    return $invoice;
                }
            }
        }

        return null;
    }

    /**
     * Look up invoice matching exact amount + client name in text.
     */
    protected function findInvoiceByFuzzyMatch(BankStatement $statement): ?AccountsInvoice
    {
        // Find finalized invoices with matching amount
        $invoices = AccountsInvoice::where('status', 'finalized')
            ->where('agent_id', $statement->agent_id)
            ->where(DB::raw('abs(grand_total - ' . floatval($statement->amount) . ')'), '<', 0.01)
            ->with('client')
            ->get();

        foreach ($invoices as $invoice) {
            if ($invoice->client) {
                $clientName = strtolower($invoice->client->name);
                $ref = strtolower($statement->sender_reference);

                // Check if client name is in reference memo
                if (strpos($ref, $clientName) !== false) {
                    return $invoice;
                }

                // Or check parts of the name
                $parts = explode(' ', $clientName);
                foreach ($parts as $part) {
                    if (strlen($part) > 3 && strpos($ref, $part) !== false) {
                        return $invoice;
                    }
                }
            }
        }

        return null;
    }

    /**
     * Post double-entry accounting records for payment receipt.
     */
    protected function postLedgerPayment(BankStatement $statement, AccountsInvoice $invoice)
    {
        $bankAccount = $this->getOrCreateAccount($statement->agent_id, '1010', 'Bank/Cash', 'asset');
        $arAccount = $this->getOrCreateAccount($statement->agent_id, '1200', 'Accounts Receivable', 'asset');

        // Debit: Bank/Cash
        AccountsLedgerEntry::create([
            'agent_id' => $statement->agent_id,
            'chart_of_account_id' => $bankAccount->id,
            'entry_date' => $statement->booking_date,
            'reference_type' => 'BankStatement',
            'reference_id' => $statement->id,
            'debit' => $statement->amount,
            'credit' => 0.00,
            'narration' => 'Payment received: ' . $statement->sender_reference,
        ]);

        // Credit: Accounts Receivable
        AccountsLedgerEntry::create([
            'agent_id' => $statement->agent_id,
            'chart_of_account_id' => $arAccount->id,
            'entry_date' => $statement->booking_date,
            'reference_type' => 'BankStatement',
            'reference_id' => $statement->id,
            'debit' => 0.00,
            'credit' => $statement->amount,
            'narration' => 'Payment reconciled for invoice: ' . $invoice->invoice_no,
        ]);
    }

    /**
     * Get or create Chart of Account row.
     */
    protected function getOrCreateAccount(int $agentId, string $code, string $name, string $type)
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
