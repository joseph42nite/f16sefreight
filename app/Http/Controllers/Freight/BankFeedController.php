<?php

namespace App\Http\Controllers\Freight;

use App\BankAccount;
use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use App\Services\Bank\BankFeedService;
use App\Services\Bank\SetuAccountAggregator;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * Connecting a bank account to Setu, and reading its statement (PRD §6.4, GAPS #442). READ-ONLY — see BankFeedService.
 *
 * Accounts connect and read (`reconcile`: the people who work the statement). HQ accounts manage every branch's
 * accounts centrally, as PRD §6.4 says, so the account may be any branch of the company.
 */
class BankFeedController extends Controller
{
    public function __construct(
        private readonly BankFeedService $feed,
        private readonly SetuAccountAggregator $setu,
        private readonly AuditLogger $audit,
    ) {}

    public function connect(Request $request, int $id): JsonResponse
    {
        $this->authorize('reconcile');
        $account = $this->account($id);

        // The mobile number the bank holds for this account — where the holder gets the approval request.
        $data = $request->validate(['mobile' => ['required', 'string', 'regex:/^[6-9]\d{9}$/']],
            ['mobile.regex' => 'The 10-digit mobile number registered with the bank for this account.']);

        if (! $this->setu->configured()) {
            return response()->json(['error' => 'Setu is not connected yet: ' . implode(', ', $this->setu->missing()) . ' not set in .env.',
                'reason' => 'setu_not_configured'], 422);
        }

        try {
            $url = $this->feed->connect($account, $data['mobile']);
        } catch (RuntimeException $e) {
            return response()->json(['error' => $e->getMessage(), 'reason' => 'feed_refused'], 422);
        }

        $this->audit->record($account->agent_id, 'bank_account.feed_requested', 'bank_account', $account->id, auth()->id());

        return response()->json(['approve_url' => $url, 'account' => $account->fresh()]);
    }

    /** Fetch now: the consent's state, and the statement if it can be read. */
    public function sync(int $id): JsonResponse
    {
        $this->authorize('reconcile');
        $account = $this->account($id);

        $result = $this->feed->sync($account, force: true);

        return response()->json(['result' => $result, 'account' => $account->fresh()]);
    }

    public function disconnect(int $id): JsonResponse
    {
        $this->authorize('reconcile');
        $account = $this->account($id);

        $this->feed->disconnect($account);
        $this->audit->record($account->agent_id, 'bank_account.feed_disconnected', 'bank_account', $account->id, auth()->id());

        return response()->json(['account' => $account->fresh()]);
    }

    /**
     * Setu's notice that a consent changed or a statement is ready.
     *
     * 🔴 UNAUTHENTICATED, SO NOTHING IN THE BODY IS BELIEVED. It is used only to find which account to look at; that
     * account is then read from Setu with our own keys, exactly as the sweep would. A forged notice can at most make us
     * ask Setu a question early. The answer is always 200 with nothing in it, so it tells a prober nothing.
     */
    public function notify(Request $request): JsonResponse
    {
        $consentId = (string) ($request->input('consentId') ?? $request->input('data.consentId') ?? '');

        if ($consentId !== '' && ($account = BankAccount::withoutGlobalScopes()->where('provider', 'setu')
            ->where('provider_ref', $consentId)->first())) {
            $this->feed->sync($account);
        }

        return response()->json([]);
    }

    private function account(int $id): BankAccount
    {
        $branches = DB::table('agents_info')->where('company_id', UserContext::for(auth()->user())->companyId)->pluck('id');

        return BankAccount::withoutGlobalScopes()->whereIn('agent_id', $branches)->findOrFail($id);
    }
}
