<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\MailboxConnection;
use App\Services\MailboxPollingService;

class PollMailboxes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mailboxes:poll';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Poll connected active mailboxes for new emails';

    /**
     * Execute the console command.
     *
     * @param  \App\Services\MailboxPollingService  $pollingService
     * @return int
     */
    public function handle(MailboxPollingService $pollingService)
    {
        $connections = MailboxConnection::where('is_active', true)->get();

        if ($connections->isEmpty()) {
            $this->info("No active mailbox connections to poll.");
            return 0;
        }

        foreach ($connections as $connection) {
            try {
                $this->info("Polling mailbox: {$connection->email_address} ({$connection->provider})");
                $pollingService->poll($connection);
            } catch (\Throwable $e) {
                $this->error("Error polling {$connection->email_address}: " . $e->getMessage());
                \Log::error("Mailbox polling error for {$connection->email_address}: " . $e->getMessage(), [
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }

        return 0;
    }
}
