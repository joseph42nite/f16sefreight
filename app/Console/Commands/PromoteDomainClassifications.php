<?php

namespace App\Console\Commands;

use App\Services\GlobalDomainDirectory;
use Illuminate\Console\Command;

/**
 * Turn repeated, independent corrections into platform knowledge.
 *
 * 🔴 **The loop that makes the product improve for the NEXT client.** When operators at
 * several different tenants all correct mail from the same domain the same way, that has
 * stopped being one company's preference and become an industry fact — and every tenant
 * after them should get it right first time.
 *
 * 🔐 Only the domain and the classification are promoted. The count of tenants is used to
 * decide and then discarded; which tenants, which threads and which clients never leave
 * their own tables.
 */
class PromoteDomainClassifications extends Command
{
    protected $signature = 'classification:promote {--tenants= : how many distinct tenants must agree}';

    protected $description = 'Promote domain classifications that several tenants independently agree on';

    public function handle(GlobalDomainDirectory $directory): int
    {
        $min = (int) ($this->option('tenants') ?: GlobalDomainDirectory::CONFIRMATIONS_REQUIRED);

        $promoted = $directory->promoteFromOverrides($min);

        $this->info("{$promoted} domain(s) promoted on agreement from {$min}+ tenants.");

        return self::SUCCESS;
    }
}
