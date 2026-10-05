<?php

namespace App\Http\Controllers\Freight;

use App\Support\UserContext;

/**
 * A Command salesperson's own mails to the team (owner, 2026-10-05; GAPS #457): the quarterly review of each of their
 * clients, to the ops and pricing staff who worked it. The Boss's mail flow, scoped to rows the salesperson owns.
 * 🔒 Their own rows, their own company, Command only. 🔴 Nothing is sent until they press Send.
 */
class SalesTeamMailController extends BossMailController
{
    protected function viewer(): UserContext
    {
        $this->authorize('viewSales');
        $context = UserContext::for(auth()->user());
        abort_unless($context->designation === 'sales' && $context->tierAtLeast('command'), 403,
            'Mails to the team are for Command salespeople.');

        return $context;
    }

    protected function scoped($query, UserContext $context, string $prefix = '')
    {
        $query->where($prefix . 'company_id', $context->companyId)->where($prefix . 'owner_user_id', $context->userId);

        // FocusAir shows the air reviews, FocusSea the sea ones — air and sea are never blended (PRD §7.3.2).
        $mode = \App\Support\Portal::fromHost(request()->getHost())->scope();

        return $mode === null ? $query
            : $query->whereRaw("JSON_UNQUOTE(JSON_EXTRACT({$prefix}facts, '$.mode')) = ?", [$mode]);
    }
}
