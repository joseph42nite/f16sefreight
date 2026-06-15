<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Agent;
use App\BankStatement;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PollBankStatements extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bank:poll';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Poll Plaid and Setu endpoints for new bank statement transactions';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $agents = Agent::all();

        if ($agents->isEmpty()) {
            $this->info("No branches/agents found to poll statements for.");
            return 0;
        }

        foreach ($agents as $agent) {
            $this->info("Polling bank statements for branch: {$agent->agent_name} (ID: {$agent->id})");

            try {
                // Call Plaid or Setu simulated endpoints
                $transactions = $this->fetchPlaidTransactions($agent);

                $count = 0;
                foreach ($transactions as $tx) {
                    // Check if transaction already exists
                    $exists = BankStatement::where('plaid_transaction_id', $tx['id'])->exists();
                    if (!$exists) {
                        BankStatement::create([
                            'agent_id' => $agent->id,
                            'plaid_transaction_id' => $tx['id'],
                            'booking_date' => $tx['booking_date'],
                            'value_date' => $tx['value_date'],
                            'amount' => $tx['amount'],
                            'sender_reference' => $tx['sender_reference'],
                            'status' => 'unreconciled',
                        ]);
                        $count++;
                    }
                }

                $this->info("Persisted {$count} new transactions for branch ID {$agent->id}.");

            } catch (\Throwable $e) {
                $this->error("Error polling for branch ID {$agent->id}: " . $e->getMessage());
                Log::error("Bank polling error for branch {$agent->id}: " . $e->getMessage(), [
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }

        return 0;
    }

    /**
     * Fetch transactions from Plaid/Setu.
     *
     * If credentials are not configured or in testing/mock mode, we return mock transactions.
     *
     * @param  \App\Agent  $agent
     * @return array
     */
    protected function fetchPlaidTransactions(Agent $agent): array
    {
        // Check if real keys are configured
        $clientId = config('services.plaid.client_id');
        $secret = config('services.plaid.secret');

        if ($clientId && $secret) {
            // Simulated Plaid/Setu API call (real HTTP post in prod)
            $response = Http::post('https://sandbox.plaid.com/transactions/get', [
                'client_id' => $clientId,
                'secret' => $secret,
                'start_date' => now()->subDays(3)->toDateString(),
                'end_date' => now()->toDateString(),
            ]);

            if ($response->successful()) {
                return collect($response->json('transactions', []))->map(function ($t) {
                    return [
                        'id' => $t['transaction_id'],
                        'booking_date' => $t['date'],
                        'value_date' => $t['date'],
                        'amount' => $t['amount'],
                        'sender_reference' => $t['name'] . ' - ' . ($t['payment_meta']['reference_number'] ?? ''),
                    ];
                })->toArray();
            }

            Log::warning("Plaid API failed to connect, falling back to mock statements.");
        }

        // Return Mock Statements for Demo / Test purposes
        return [
            [
                'id' => 'tx_mock_' . $agent->id . '_1',
                'booking_date' => now()->subDays(2)->toDateString(),
                'value_date' => now()->subDays(2)->toDateString(),
                'amount' => 1652.00,
                'sender_reference' => 'WIRE IN: Job #JOBA-26-0001 Clearances',
            ],
            [
                'id' => 'tx_mock_' . $agent->id . '_2',
                'booking_date' => now()->subDays(1)->toDateString(),
                'value_date' => now()->subDays(1)->toDateString(),
                'amount' => 12500.00,
                'sender_reference' => 'FT RECEIPT: HAWB Ref 123-45678901 payment',
            ],
            [
                'id' => 'tx_mock_' . $agent->id . '_3',
                'booking_date' => now()->toDateString(),
                'value_date' => now()->toDateString(),
                'amount' => 3200.00,
                'sender_reference' => 'PAYMENT FROM: Workflow Test Company INC',
            ]
        ];
    }
}
