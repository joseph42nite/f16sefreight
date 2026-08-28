<?php

namespace App\Services;

use App\Company;
use App\User;

/**
 * Decides how a document is extracted — guide §4.1.1.
 *
 * 🔴 **The route is tier × DOCUMENT CLASS, not tier alone.**
 *
 *   tier      structured (has a template)   unstructured        scanned / image
 *   core      /extract, free                upgrade_required    upgrade_required
 *   tactical  /extract, free                Gemma, free         Gemini, 1 credit
 *   command   /extract, free                Gemma, free         Gemini, 1 credit
 *
 * **A Core tenant uploading an invoice must be TOLD, not silently disappointed.**
 * pdfplumber needs a coordinate template and none exists for an arbitrary client
 * invoice, so extraction would return an empty form that looks broken. Failing before
 * processing with `upgrade_required` turns a confusing dead end into the upsell moment —
 * Core is the upsell tier, and a blank form wastes it.
 *
 * **Core never reaches the vision consent prompt at all.** Offering to spend credits a
 * tier cannot buy is a worse experience than the upgrade CTA.
 */
class OcrRoutingService
{
    public const PATH_COORDINATES = 'coordinates';
    public const PATH_TEXT        = 'text';
    public const PATH_VISION      = 'vision';
    public const PATH_NONE        = 'none';

    public const FAILURE_UPGRADE_REQUIRED = 'upgrade_required';
    public const FAILURE_CREDITS_EXHAUSTED = 'credits_exhausted';
    public const FAILURE_UNSUPPORTED_MIME  = 'unsupported_mime';
    public const FAILURE_EXTRACTION_FAILED = 'extraction_failed';
    public const FAILURE_AI_UNAVAILABLE    = 'ai_unavailable';

    /** Document classes that have a coordinate template in system_templates. */
    private const STRUCTURED_TYPES = ['MAWB', 'HAWB', 'AWB'];

    /** @var array<int,string> memoized per company — this runs on every upload */
    private array $tierCache = [];

    /**
     * Resolve the tenant tier for the uploading user.
     *
     * 🔴 **Must go through withoutTenantScope().** This runs in a queue worker with no
     * session, so the tenant global scope would return nothing and the tier would read as
     * missing — silently routing every upload as if it were Core.
     *
     * The chain is guaranteed: users.branch_name is NOT NULL with a foreign key, so every
     * user has a branch, therefore a company, therefore a tier. There is no
     * user-without-a-tier case to design around.
     */
    public function resolveTier(int $userId): ?string
    {
        $user = User::withoutGlobalScopes()->with('branch.companyName')->find($userId);

        $companyId = $user?->branch?->company_id;

        if ($companyId === null) {
            return null;
        }

        return $this->tierCache[$companyId] ??= Company::withoutGlobalScopes()
            ->whereKey($companyId)->value('tier');
    }

    public function isStructured(?string $documentType): bool
    {
        return in_array(strtoupper((string) $documentType), self::STRUCTURED_TYPES, true);
    }

    /**
     * What should happen to this document, before any processing begins.
     *
     * @return array{action: string, endpoint: ?string, failure_code: ?string, allow_vision: bool}
     */
    public function route(?string $tier, ?string $documentType): array
    {
        // Structured documents are free at every tier — coordinate extraction needs no AI.
        if ($this->isStructured($documentType)) {
            return [
                'action'       => 'extract',
                'endpoint'     => '/extract',
                'failure_code' => null,
                'allow_vision' => false,
            ];
        }

        // Core has no unstructured path at all. Fail BEFORE processing.
        if ($tier === 'core' || $tier === null) {
            return [
                'action'       => 'fail',
                'endpoint'     => null,
                'failure_code' => self::FAILURE_UPGRADE_REQUIRED,
                'allow_vision' => false,
            ];
        }

        // Tactical and Command: try text first, always free, never with vision.
        // Whether vision is needed is the PARSER's answer, not a guess made here.
        return [
            'action'       => 'extract_unstructured',
            'endpoint'     => '/extract-unstructured',
            'failure_code' => null,
            'allow_vision' => false, // 🔒 the first call is ALWAYS free
        ];
    }

    /**
     * Whether a job that came back with extraction_path = 'none' should park for consent.
     * Core never reaches here — it failed at route() with upgrade_required.
     */
    public function needsVisionConsent(?string $tier, ?string $extractionPath): bool
    {
        return $extractionPath === self::PATH_NONE
            && in_array($tier, ['tactical', 'command'], true);
    }
}
