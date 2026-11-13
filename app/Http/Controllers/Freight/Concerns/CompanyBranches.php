<?php

namespace App\Http\Controllers\Freight\Concerns;

use App\BankAccount;
use App\Support\UserContext;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * The signed-in user's company branches, for the accounts screens that cover every branch of the company.
 *
 * This was the same five lines in twelve controllers (2026-11-10 audit §6). It is the tenant boundary for those
 * screens: a document is "ours" when its `agent_id` is one of these ids, so it is worth having in one place.
 */
trait CompanyBranches
{
    /** @return Collection<int, object{id:int, name:string}> */
    private function branches(): Collection
    {
        $context = UserContext::for(auth()->user());

        return DB::table('agents_info')->where('company_id', $context->companyId)
            ->orderBy('agent_name')->get(['id', 'agent_name as name']);
    }

    /** One of this company's bank accounts, or null — never another company's, whatever id was sent. */
    private function bankAccount(?int $id): ?BankAccount
    {
        return $id === null ? null : BankAccount::withoutTenantScope()->where('id', $id)
            ->whereIn('agent_id', $this->branches()->pluck('id'))->first();
    }
}
