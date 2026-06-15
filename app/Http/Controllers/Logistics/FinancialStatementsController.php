<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\AccountsLedgerEntry;
use App\ChartOfAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FinancialStatementsController extends Controller
{
    public function getTrialBalance(Request $request)
    {
        $user = auth()->user() ?? auth('user-api')->user();
        $agentId = $request->query('agent_id', $user->branch_name ?? 1);

        $query = AccountsLedgerEntry::where('agent_id', $agentId);

        if ($request->has('start_date')) {
            $query->whereDate('entry_date', '>=', $request->input('start_date'));
        }
        if ($request->has('end_date')) {
            $query->whereDate('entry_date', '<=', $request->input('end_date'));
        }

        $entries = $query->select('chart_of_account_id', DB::raw('SUM(debit) as total_debit'), DB::raw('SUM(credit) as total_credit'))
            ->groupBy('chart_of_account_id')
            ->with('chartOfAccount')
            ->get();

        $rows = [];
        $totalDebits = 0.00;
        $totalCredits = 0.00;

        foreach ($entries as $entry) {
            $coa = $entry->chartOfAccount;
            if (!$coa) continue;

            $debit = (float) $entry->total_debit;
            $credit = (float) $entry->total_credit;

            $rows[] = [
                'account_id' => $coa->id,
                'code' => $coa->code,
                'name' => $coa->name,
                'type' => $coa->type,
                'debit' => $debit,
                'credit' => $credit,
            ];

            $totalDebits += $debit;
            $totalCredits += $credit;
        }

        return response()->json([
            'status' => true,
            'agent_id' => $agentId,
            'is_balanced' => abs($totalDebits - $totalCredits) < 0.01,
            'total_debit' => round($totalDebits, 2),
            'total_credit' => round($totalCredits, 2),
            'accounts' => $rows,
        ]);
    }

    public function getProfitAndLoss(Request $request)
    {
        $user = auth()->user() ?? auth('user-api')->user();
        $agentId = $request->query('agent_id', $user->branch_name ?? 1);

        $query = AccountsLedgerEntry::where('agent_id', $agentId)
            ->whereHas('chartOfAccount', function ($q) {
                $q->whereIn('type', ['revenue', 'expense']);
            });

        if ($request->has('start_date')) {
            $query->whereDate('entry_date', '>=', $request->input('start_date'));
        }
        if ($request->has('end_date')) {
            $query->whereDate('entry_date', '<=', $request->input('end_date'));
        }

        $entries = $query->select('chart_of_account_id', DB::raw('SUM(debit) as total_debit'), DB::raw('SUM(credit) as total_credit'))
            ->groupBy('chart_of_account_id')
            ->with('chartOfAccount')
            ->get();

        $revenues = [];
        $expenses = [];
        $totalRevenue = 0.00;
        $totalExpense = 0.00;

        foreach ($entries as $entry) {
            $coa = $entry->chartOfAccount;
            if (!$coa) continue;

            $debit = (float) $entry->total_debit;
            $credit = (float) $entry->total_credit;

            if ($coa->type === 'revenue') {
                $netRevenue = $credit - $debit;
                $revenues[] = [
                    'account_id' => $coa->id,
                    'code' => $coa->code,
                    'name' => $coa->name,
                    'balance' => round($netRevenue, 2),
                ];
                $totalRevenue += $netRevenue;
            } elseif ($coa->type === 'expense') {
                $netExpense = $debit - $credit;
                $expenses[] = [
                    'account_id' => $coa->id,
                    'code' => $coa->code,
                    'name' => $coa->name,
                    'balance' => round($netExpense, 2),
                ];
                $totalExpense += $netExpense;
            }
        }

        $netProfit = $totalRevenue - $totalExpense;

        return response()->json([
            'status' => true,
            'agent_id' => $agentId,
            'total_revenue' => round($totalRevenue, 2),
            'total_expense' => round($totalExpense, 2),
            'net_profit' => round($netProfit, 2),
            'revenues' => $revenues,
            'expenses' => $expenses,
        ]);
    }

    public function getBalanceSheet(Request $request)
    {
        $user = auth()->user() ?? auth('user-api')->user();
        $agentId = $request->query('agent_id', $user->branch_name ?? 1);

        $asOfDate = $request->input('date');

        // 1. Calculate Profit & Loss (Retained Earnings) up to this date
        $plQuery = AccountsLedgerEntry::where('agent_id', $agentId)
            ->whereHas('chartOfAccount', function ($q) {
                $q->whereIn('type', ['revenue', 'expense']);
            });

        if ($asOfDate) {
            $plQuery->whereDate('entry_date', '<=', $asOfDate);
        }

        $plEntries = $plQuery->select('chart_of_account_id', DB::raw('SUM(debit) as total_debit'), DB::raw('SUM(credit) as total_credit'))
            ->groupBy('chart_of_account_id')
            ->with('chartOfAccount')
            ->get();

        $retainedEarnings = 0.00;
        foreach ($plEntries as $entry) {
            $coa = $entry->chartOfAccount;
            if (!$coa) continue;
            $debit = (float) $entry->total_debit;
            $credit = (float) $entry->total_credit;

            if ($coa->type === 'revenue') {
                $retainedEarnings += ($credit - $debit);
            } elseif ($coa->type === 'expense') {
                $retainedEarnings -= ($debit - $credit);
            }
        }

        // 2. Fetch Assets, Liabilities, Equity
        $bsQuery = AccountsLedgerEntry::where('agent_id', $agentId)
            ->whereHas('chartOfAccount', function ($q) {
                $q->whereIn('type', ['asset', 'liability', 'equity']);
            });

        if ($asOfDate) {
            $bsQuery->whereDate('entry_date', '<=', $asOfDate);
        }

        $bsEntries = $bsQuery->select('chart_of_account_id', DB::raw('SUM(debit) as total_debit'), DB::raw('SUM(credit) as total_credit'))
            ->groupBy('chart_of_account_id')
            ->with('chartOfAccount')
            ->get();

        $assets = [];
        $liabilities = [];
        $equities = [];

        $totalAssets = 0.00;
        $totalLiabilities = 0.00;
        $totalEquity = 0.00;

        foreach ($bsEntries as $entry) {
            $coa = $entry->chartOfAccount;
            if (!$coa) continue;

            $debit = (float) $entry->total_debit;
            $credit = (float) $entry->total_credit;

            if ($coa->type === 'asset') {
                $balance = $debit - $credit;
                $assets[] = [
                    'account_id' => $coa->id,
                    'code' => $coa->code,
                    'name' => $coa->name,
                    'balance' => round($balance, 2),
                ];
                $totalAssets += $balance;
            } elseif ($coa->type === 'liability') {
                $balance = $credit - $debit;
                $liabilities[] = [
                    'account_id' => $coa->id,
                    'code' => $coa->code,
                    'name' => $coa->name,
                    'balance' => round($balance, 2),
                ];
                $totalLiabilities += $balance;
            } elseif ($coa->type === 'equity') {
                $balance = $credit - $debit;
                $equities[] = [
                    'account_id' => $coa->id,
                    'code' => $coa->code,
                    'name' => $coa->name,
                    'balance' => round($balance, 2),
                ];
                $totalEquity += $balance;
            }
        }

        // Add Retained Earnings to Equities list and total
        $equities[] = [
            'account_id' => null,
            'code' => 'RE',
            'name' => 'Retained Earnings',
            'balance' => round($retainedEarnings, 2),
        ];
        $totalEquity += $retainedEarnings;

        return response()->json([
            'status' => true,
            'agent_id' => $agentId,
            'total_assets' => round($totalAssets, 2),
            'total_liabilities' => round($totalLiabilities, 2),
            'total_equity' => round($totalEquity, 2),
            'assets' => $assets,
            'liabilities' => $liabilities,
            'equity' => $equities,
        ]);
    }
}
