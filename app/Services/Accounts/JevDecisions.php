<?php

namespace App\Services\Accounts;

use App\Company;
use App\Services\AiUsageService;
use App\Services\CompanyAiBudget;
use App\Services\JevClient;
use App\Services\OcrCreditService;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * Jev in accounts — the one path every decision point takes (implementation_guide §11.7; GAPS #412).
 *
 * 🔴 **It suggests; it never acts.** `ask()` returns an option PHP built, or nothing. What happens next is a person
 * confirming it on a screen whose own checks are unchanged — this class posts nothing, allocates nothing, and edits
 * no figure. `record()` only writes down what that person then did, which is how "how often is it right?" is known.
 *
 * The order of every ask, and why:
 *   1. switched on — globally (ACCOUNTS_AI), for this company, for this question — and the model configured
 *   2. asked before? the stored answer, free (UNIQUE subject + question + rubric version)
 *   3. fewer than two options: nothing to choose, nothing asked
 *   4. the company's AI budget, then its credits — reserved BEFORE the call, refunded if it fails (as mail)
 *   5. the answer validated against the options OFFERED — anything else is no answer
 *   6. under the question's own floor, or "none" / "can't tell": recorded, not suggested
 */
class JevDecisions
{
    /** Answers that are never suggestions: the model saying it does not know is a result, not a pick. */
    private const ABSTAIN = ['none_of_these', 'cannot_tell', 'not_sure'];

    public function __construct(
        private readonly JevClient $jev,
        private readonly OcrCreditService $credits,
        private readonly CompanyAiBudget $budget,
        private readonly AiUsageService $usage,
    ) {}

    public function enabled(?Company $company, string $question): bool
    {
        if ($company === null || ! config('accounts_decisions.enabled') || ! $this->jev->configured()
            || config("accounts_decisions.questions.{$question}") === null) {
            return false;
        }

        // No row is ON: a company switches a point off, it does not have to discover and switch each one on.
        $switch = DB::table('ai_decision_switches')->where('company_id', $company->id)->where('question', $question)->value('enabled');

        return $switch === null || (bool) $switch;
    }

    /**
     * One Choice about one subject.
     *
     * @param  array<string, string>  $criteria option key => what it means (PHP built every one of them)
     * @return array{id: int, answer: ?string, confidence: ?float, suggested: bool}|null  NULL: not asked
     */
    public function ask(string $question, int $agentId, string $subjectType, int $subjectId, array $state, array $criteria): ?array
    {
        $floor = (float) config("accounts_decisions.questions.{$question}.min_confidence", 0.9);

        return $this->run($question, $agentId, $subjectType, $subjectId, $state, array_keys($criteria),
            fn () => [$question => JevClient::choice(config("accounts_decisions.questions.{$question}.instructions"), $criteria)],
            function (array $answers) use ($question, $criteria, $floor) {
                $answer = $answers[$question] ?? [];
                $choice = is_string($answer['choice'] ?? null) && array_key_exists($answer['choice'], $criteria) ? $answer['choice'] : null;
                $confidence = $choice === null ? null : round((float) ($answer['confidence'] ?? 0), 4);

                return [$choice, $confidence,
                    $choice !== null && ! in_array($choice, self::ABSTAIN, true) && $confidence >= $floor];
            });
    }

    /**
     * The same yes/no about each of several things in ONE request (④: which of a client's bills a mail pays). The
     * state is sent once — the whole cost — so each extra question is nearly free; it is charged and recorded as one
     * decision whose answer is the ids that came back `$yes` above the floor, and whose confidence is the least sure
     * of them.
     *
     * @param  array<int, string>  $items id => what that thing is, e.g. one bill
     * @return array{id: int, answer: ?string, confidence: ?float, suggested: bool}|null
     */
    public function askEach(string $question, int $agentId, string $subjectType, int $subjectId, array $state, array $items, string $yes): ?array
    {
        $rubric = config("accounts_decisions.questions.{$question}");
        $floor = (float) ($rubric['min_confidence'] ?? 0.9);
        $keys = array_map(fn ($id) => "item_{$id}", array_keys($items));

        return $this->run($question, $agentId, $subjectType, $subjectId, $state, $keys,
            fn () => collect($items)->mapWithKeys(fn ($text, $id) => ["item_{$id}" => JevClient::choice(
                $rubric['instructions'] . ' This bill: ' . $text, $rubric['criteria'])])->all(),
            function (array $answers) use ($items, $yes, $floor, $rubric) {
                $picked = [];
                foreach (array_keys($items) as $id) {
                    $a = $answers["item_{$id}"] ?? [];
                    if (($a['choice'] ?? null) === $yes && array_key_exists($yes, $rubric['criteria']) && (float) ($a['confidence'] ?? 0) >= $floor) {
                        $picked[$id] = round((float) $a['confidence'], 4);
                    }
                }
                ksort($picked);

                return $picked === [] ? [null, null, false] : [implode(',', array_keys($picked)), min($picked), true];
            }, 1);   // each bill is its own yes/no — one bill is already a real question
    }

    /**
     * Every ask, one path: the switches, asked-once, budget, credits reserved before and refunded on failure, the
     * encrypted record. `$read` turns the answers into [answer, confidence, suggested] — validated against what was
     * offered, never trusted as returned.
     */
    private function run(string $question, int $agentId, string $subjectType, int $subjectId, array $state, array $optionKeys,
        callable $questions, callable $read, int $minimumOptions = 2): ?array
    {
        $company = $this->companyFor($agentId);
        $version = config('accounts_decisions.rubric_version');

        if (! $this->enabled($company, $question)) {
            return null;
        }

        $asked = DB::table('ai_decisions')->where('subject_type', $subjectType)->where('subject_id', $subjectId)
            ->where('question', $question)->where('rubric_version', $version)->first();

        if ($asked !== null) {
            return $this->shaped($asked);
        }

        if (count($optionKeys) < $minimumOptions || $this->budget->refusal($company, 'accounts_decisions') !== null) {
            return null;
        }

        $id = DB::table('ai_decisions')->insertGetId([
            'company_id' => $company->id, 'agent_id' => $agentId,
            'subject_type' => $subjectType, 'subject_id' => $subjectId,
            'question' => $question, 'rubric_version' => $version,
            'options' => json_encode($optionKeys),
            // 🔒 What Jev was shown, kept as evidence — encrypted, never readable in the table.
            'state' => Crypt::encryptString(json_encode($state)),
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $charge = $this->credits->chargeDecision($company, $id);

        if ($charge === null) {
            // Unaffordable: nothing was asked, so nothing is kept — the next look, with credits, asks.
            DB::table('ai_decisions')->where('id', $id)->delete();

            return null;
        }

        try {
            $reply = $this->jev->ask($state, $questions(), (int) config('accounts_decisions.timeout'));
        } catch (RuntimeException $e) {
            // A failed call is refunded and forgotten, so it can be asked again; the screen simply has no suggestion.
            $this->credits->refund($charge);
            DB::table('ai_decisions')->where('id', $id)->delete();
            report($e);

            return null;
        }

        $this->usage->log($reply['usage'], 'accounts_decisions', null, ['agent_id' => $agentId, 'company_id' => $company->id]);

        [$choice, $confidence, $suggested] = $read((array) ($reply['answers'] ?? []));

        DB::table('ai_decisions')->where('id', $id)->update([
            'answer' => $choice === null ? null : mb_substr($choice, 0, 60),
            'confidence' => $confidence,
            'suggested' => $suggested,
            'updated_at' => now(),
        ]);

        return $this->shaped(DB::table('ai_decisions')->find($id));
    }

    /**
     * What the person did with a suggestion: took it, or chose something else. Written once — the first
     * confirmation is the one that measured the suggestion — and only for a decision of their own company.
     */
    public function record(?int $decisionId, int $companyId, ?string $chosen, int $userId): void
    {
        if ($decisionId === null) {
            return;
        }

        $decision = DB::table('ai_decisions')->where('id', $decisionId)->where('company_id', $companyId)
            ->whereNull('outcome')->first();

        if ($decision === null) {
            return;
        }

        DB::table('ai_decisions')->where('id', $decision->id)->update([
            'outcome' => $decision->answer !== null && $chosen === $decision->answer ? 'accepted' : 'changed',
            'outcome_value' => $chosen === null ? null : mb_substr($chosen, 0, 60),
            'decided_by' => $userId, 'decided_at' => now(), 'updated_at' => now(),
        ]);
    }

    /** The decision already made about a subject, if any — for a screen that shows it without asking. */
    public function existing(string $subjectType, int $subjectId, string $question): ?array
    {
        $row = DB::table('ai_decisions')->where('subject_type', $subjectType)->where('subject_id', $subjectId)
            ->where('question', $question)->where('rubric_version', config('accounts_decisions.rubric_version'))->first();

        return $row === null ? null : $this->shaped($row);
    }

    /**
     * Each decision point for a company: whether it is on, and how it has done — asked, suggested, and of the
     * suggestions a person acted on, how many they took.
     */
    public function overview(int $companyId): array
    {
        $switches = DB::table('ai_decision_switches')->where('company_id', $companyId)->pluck('enabled', 'question');
        $counts = DB::table('ai_decisions')->where('company_id', $companyId)->groupBy('question')
            ->selectRaw("question, COUNT(*) AS asked, SUM(suggested) AS suggested,
                         SUM(suggested AND outcome = 'accepted') AS accepted, SUM(suggested AND outcome = 'changed') AS changed")
            ->get()->keyBy('question');

        return collect(config('accounts_decisions.questions'))->map(fn ($q, $key) => [
            'question' => $key,
            'label' => $q['label'],
            'where' => $q['where'],
            'enabled' => ! isset($switches[$key]) || (bool) $switches[$key],
            'asked' => (int) ($counts[$key]->asked ?? 0),
            'suggested' => (int) ($counts[$key]->suggested ?? 0),
            'accepted' => (int) ($counts[$key]->accepted ?? 0),
            'changed' => (int) ($counts[$key]->changed ?? 0),
        ])->values()->all();
    }

    public function setSwitch(int $companyId, string $question, bool $enabled, int $userId): void
    {
        DB::table('ai_decision_switches')->updateOrInsert(['company_id' => $companyId, 'question' => $question],
            ['enabled' => $enabled, 'updated_by' => $userId, 'updated_at' => now(), 'created_at' => now()]);
    }

    /** @return array{id: int, answer: ?string, confidence: ?float, suggested: bool} */
    private function shaped(object $row): array
    {
        return ['id' => (int) $row->id, 'answer' => $row->answer,
                'confidence' => $row->confidence === null ? null : (float) $row->confidence, 'suggested' => (bool) $row->suggested];
    }

    private function companyFor(int $agentId): ?Company
    {
        $companyId = DB::table('agents_info')->where('id', $agentId)->value('company_id');

        return $companyId === null ? null : Company::withoutGlobalScopes()->find($companyId);
    }
}
