<?php

namespace App\Http\Controllers\Freight;

use App\Customer;
use App\Http\Controllers\Controller;
use App\Services\Accounts\ClientPaymentReports;
use App\Services\Accounts\JevDecisions;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

/**
 * A client's payment report cards (GAPS #443): the last twelve months, and Jev's reading of their mail when it was
 * asked. Read on Command by everyone who sees the client book's money columns; a reading is confirmed by accounts or
 * the Boss — the people who decide whether to chase.
 */
class ClientPaymentController extends Controller
{
    public function __construct(private readonly JevDecisions $jev) {}

    public function index(Customer $customer): JsonResponse
    {
        abort_unless($this->mine($customer) && UserContext::for(auth()->user())->tierAtLeast('command'), 404);

        $cards = DB::table('client_payment_reports')->where('customer_id', $customer->id)
            ->orderByDesc('month')->limit(12)->get();
        $decisions = DB::table('ai_decisions')->whereIn('id', $cards->pluck('ai_decision_id')->filter())->get()->keyBy('id');
        $criteria = config('accounts_decisions.questions.' . ClientPaymentReports::JEV_QUESTION . '.criteria');

        return response()->json([
            'terms_days' => $customer->payment_terms_days,
            'cards' => $cards->map(function ($c) use ($decisions, $criteria) {
                $d = $c->ai_decision_id ? $decisions[$c->ai_decision_id] ?? null : null;

                return (array) $c + ['jev' => $d === null ? null : [
                    'answer' => $d->answer, 'meaning' => $criteria[$d->answer] ?? null, 'confidence' => $d->confidence !== null ? (float) $d->confidence : null,
                    // Shown as a suggestion only above its floor; below it, the card simply has no reading.
                    'suggested' => (bool) $d->suggested, 'outcome' => $d->outcome, 'confirmed_as' => $d->outcome_value,
                ]];
            }),
            'options' => $criteria,
        ]);
    }

    /** A person's answer to Jev's reading: what the mail really says, or that it says none of these. */
    public function confirm(Request $request, Customer $customer, int $report): JsonResponse
    {
        $this->authorize('viewFinancials');
        abort_unless($this->mine($customer), 404);

        $data = $request->validate(['chosen' => ['nullable', 'string',
            Rule::in(array_keys(config('accounts_decisions.questions.' . ClientPaymentReports::JEV_QUESTION . '.criteria')))]]);

        $card = DB::table('client_payment_reports')->where('id', $report)->where('customer_id', $customer->id)->first();
        abort_if($card === null || $card->ai_decision_id === null, 404);

        $this->jev->record((int) $card->ai_decision_id, (int) $customer->company_id, $data['chosen'] ?? null, (int) auth()->id());

        return $this->index($customer);
    }

    private function mine(Customer $customer): bool
    {
        return (int) $customer->company_id === (int) UserContext::for(auth()->user())->companyId;
    }
}
