<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\AccountsCassStatement;
use App\AirwayBills;
use App\AccountsPurchaseVoucher;
use App\BankStatement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReconciliationController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user() ?? auth('user-api')->user();

        if (auth('superAdmin-api')->check()) {
            $statements = AccountsCassStatement::with(['airline', 'matchedVoucher'])->get();
        } else {
            $statements = AccountsCassStatement::where('agent_id', $user->branch_name)
                ->with(['airline', 'matchedVoucher'])
                ->get();
        }

        return response()->json($statements);
    }

    public function uploadCASSStatement(Request $request)
    {
        $user = auth()->user() ?? auth('user-api')->user();

        if ($request->hasFile('file')) {
            $path = $request->file('file')->getRealPath();
            $file = fopen($path, 'r');
            $header = null;
            $rows = [];
            while (($row = fgetcsv($file)) !== false) {
                if (!$header) {
                    $header = array_map('trim', $row);
                } else {
                    $rows[] = array_combine($header, $row);
                }
            }
            fclose($file);
        } else {
            $rows = $request->input('statements', []);
        }

        $created = [];
        foreach ($rows as $rowData) {
            $created[] = AccountsCassStatement::create([
                'agent_id' => $user->branch_name,
                'airline_id' => $rowData['airline_id'] ?? $request->input('airline_id'),
                'awb_number' => $rowData['awb_number'],
                'billing_period' => $rowData['billing_period'] ?? '2026-06-W1',
                'cass_gross_weight' => $rowData['cass_gross_weight'] ?? 0.00,
                'cass_rate' => $rowData['cass_rate'] ?? 0.00,
                'cass_freight_charges' => $rowData['cass_freight_charges'] ?? 0.00,
                'cass_other_charges' => $rowData['cass_other_charges'] ?? 0.00,
                'grand_total' => $rowData['grand_total'] ?? 0.00,
                'reconciliation_status' => 'unmatched',
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => count($created) . ' statements uploaded successfully.',
            'statements' => $created
        ]);
    }

    public function reconcileCASS(Request $request)
    {
        $statementIds = $request->input('ids', []);
        
        $query = AccountsCassStatement::query();
        if (!empty($statementIds)) {
            $query->whereIn('id', $statementIds);
        } else {
            $query->where('reconciliation_status', 'unmatched');
        }
        
        $statements = $query->get();
        $matchedCount = 0;
        
        foreach ($statements as $statement) {
            $awbNumber = $statement->awb_number;
            
            $awbCode = null;
            $awbNo = null;
            if (strpos($awbNumber, '-') !== false) {
                $parts = explode('-', $awbNumber);
                $awbCode = trim($parts[0]);
                $awbNo = trim($parts[1]);
            } elseif (strlen($awbNumber) >= 11) {
                $awbCode = substr($awbNumber, 0, 3);
                $awbNo = substr($awbNumber, 3);
            } else {
                $awbNo = $awbNumber;
            }

            $awbRecord = null;
            if ($awbCode && $awbNo) {
                $awbRecord = AirwayBills::where('awb_code', $awbCode)->where('awb_no', $awbNo)->first();
            } else {
                $awbRecord = AirwayBills::where('awb_no', $awbNo)->first();
            }

            if (!$awbRecord || !$awbRecord->job_id) {
                $statement->update([
                    'reconciliation_status' => 'unmatched',
                    'matched_voucher_id' => null,
                ]);
                continue;
            }

            $voucher = AccountsPurchaseVoucher::where('job_id', $awbRecord->job_id)->first();

            if (!$voucher) {
                $statement->update([
                    'reconciliation_status' => 'unmatched',
                    'matched_voucher_id' => null,
                ]);
                continue;
            }

            $freightItem = $voucher->items()->where('charge_type', 'like', '%freight%')->first()
                        ?? $voucher->items()->first();

            $voucherWeight = $freightItem ? $freightItem->qty : 0.00;
            $voucherRate = $freightItem ? $freightItem->unit_rate : 0.00;

            $weightDiff = abs($statement->cass_gross_weight - $voucherWeight);
            $rateDiff = abs($statement->cass_rate - $voucherRate);

            if ($weightDiff < 0.01 && $rateDiff < 0.01) {
                $status = 'matched';
                $matchedVoucherId = $voucher->id;
                $matchedCount++;
            } elseif ($weightDiff >= 0.01) {
                $status = 'weight_mismatch';
                $matchedVoucherId = null;
            } else {
                $status = 'rate_mismatch';
                $matchedVoucherId = null;
            }

            $statement->update([
                'reconciliation_status' => $status,
                'matched_voucher_id' => $matchedVoucherId,
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'CASS reconciliation completed.',
            'processed' => count($statements),
            'matched' => $matchedCount,
        ]);
    }

    public function getBankStatements(Request $request)
    {
        $user = auth()->user() ?? auth('user-api')->user();
        $query = BankStatement::query();
        if (!auth('superAdmin-api')->check()) {
            $query->where('agent_id', $user->branch_name);
        }
        $statements = $query->with('matchedInvoice')->orderBy('booking_date', 'desc')->get();
        return response()->json($statements);
    }

    public function pollBankStatements(Request $request)
    {
        \Illuminate\Support\Facades\Artisan::call('bank:poll');
        return response()->json([
            'status' => true,
            'message' => 'Bank polling completed.',
        ]);
    }

    public function matchBankPayments(Request $request)
    {
        $user = auth()->user() ?? auth('user-api')->user();
        $agentId = $user->branch_name;
        $engine = new \App\Services\BankMatchingEngine();
        $matchedCount = $engine->reconcileAgentPayments($agentId);
        return response()->json([
            'status' => true,
            'message' => 'Automated payment reconciliation completed.',
            'matched' => $matchedCount,
        ]);
    }

    public function getAiRiskAnalysis(Request $request)
    {
        $user = auth()->user() ?? auth('user-api')->user() ?? auth('superAdmin-api')->user();
        $agentId = $request->query('agent_id') ?? ($user ? $user->branch_name : null);

        // Get all clients (companies) with jobs
        $clientsQuery = \App\Company::query();
        if ($agentId) {
            $clientsQuery->whereHas('accountsInvoices', function ($q) use ($agentId) {
                $q->where('agent_id', $agentId);
            });
        } else {
            $clientsQuery->whereHas('accountsInvoices');
        }
        $clients = $clientsQuery->get();

        $anonymizedData = [];
        $maskMap = [];
        $reverseMap = [];
        $counter = 1;

        foreach ($clients as $client) {
            $clientKey = 'Client_' . $counter++;
            $maskMap[$client->name] = $clientKey;
            $reverseMap[$clientKey] = $client->name;

            // Compute metrics
            $invoicesQuery = \App\AccountsInvoice::where('client_id', $client->id);
            if ($agentId) {
                $invoicesQuery->where('agent_id', $agentId);
            }
            $invoices = $invoicesQuery->get();

            $paidInvoices = $invoices->where('status', 'paid');
            $unpaidInvoices = $invoices->where('status', 'finalized');

            $totalDelay = 0;
            $paidCount = 0;
            foreach ($paidInvoices as $inv) {
                // Find matched bank statement
                $statement = BankStatement::where('matched_invoice_id', $inv->id)->first();
                if ($statement) {
                    $days = $inv->document_date->diffInDays($statement->booking_date);
                    $totalDelay += $days;
                    $paidCount++;
                }
            }
            $avgDelay = $paidCount > 0 ? round($totalDelay / $paidCount, 1) : 0;
            $unpaidExposure = $unpaidInvoices->sum('grand_total');

            // Count jobs this quarter vs last quarter
            $jobCountThisQQuery = \App\Job::withoutGlobalScope(\App\Scopes\PortalScope::class)
                ->where('client_id', $client->id)
                ->where('created_at', '>=', now()->subMonths(3));
            if ($agentId) {
                $jobCountThisQQuery->where('agent_id', $agentId);
            }
            $jobCountThisQ = $jobCountThisQQuery->count();

            $jobCountPriorQQuery = \App\Job::withoutGlobalScope(\App\Scopes\PortalScope::class)
                ->where('client_id', $client->id)
                ->where('created_at', '>=', now()->subMonths(6))
                ->where('created_at', '<', now()->subMonths(3));
            if ($agentId) {
                $jobCountPriorQQuery->where('agent_id', $agentId);
            }
            $jobCountPriorQ = $jobCountPriorQQuery->count();

            $volumeTrend = $jobCountPriorQ > 0
                ? round((($jobCountThisQ - $jobCountPriorQ) / $jobCountPriorQ) * 100, 1)
                : 0;

            $anonymizedData[$clientKey] = [
                'avg_payment_delay_days' => $avgDelay,
                'unpaid_invoices_count' => $unpaidInvoices->count(),
                'total_unpaid_exposure' => floatval($unpaidExposure),
                'quarterly_volume_trend_pct' => $volumeTrend,
            ];
        }

        if (empty($anonymizedData)) {
            return response()->json([
                'status' => true,
                'analysis' => 'No active clients or transaction logs found to analyze risk.'
            ]);
        }

        // Call FastAPI /analyze-risk
        $fastApiUrl = 'http://127.0.0.1:8001/analyze-risk';
        try {
            $response = \Illuminate\Support\Facades\Http::post($fastApiUrl, [
                'data' => $anonymizedData
            ]);

            if ($response->successful()) {
                $analysisText = $response->json('analysis');

                // Unmask client tags back to original names
                foreach ($reverseMap as $clientKey => $realName) {
                    $analysisText = str_ireplace($clientKey, "**" . $realName . "**", $analysisText);
                }

                return response()->json([
                    'status' => true,
                    'analysis' => $analysisText
                ]);
            }
        } catch (\Throwable $e) {
            \Log::error("Gemini risk analysis call failed: " . $e->getMessage());
        }

        // Fallback if FastAPI/Gemini is unavailable or fails
        $fallbackAnalysis = "### Financial Risk Analysis Summary\n\n";
        foreach ($anonymizedData as $key => $metrics) {
            $realName = $reverseMap[$key] ?? $key;
            $status = "Normal";
            $recommendation = "Maintain regular payment terms.";
            if ($metrics['avg_payment_delay_days'] > 30 || $metrics['total_unpaid_exposure'] > 10000) {
                $status = "High Risk ⚠️";
                $recommendation = "Recommend credit hold or immediate collections follow-up.";
            }
            $fallbackAnalysis .= "- **{$realName}** ({$status}): Average delay of {$metrics['avg_payment_delay_days']} days, exposure of {$metrics['total_unpaid_exposure']} INR. *Recommendation:* {$recommendation}\n";
        }
        return response()->json([
            'status' => true,
            'analysis' => $fallbackAnalysis
        ]);
    }
}
