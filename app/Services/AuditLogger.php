<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

/**
 * The single write path into `audit_logs`.
 *
 * Everything that audits goes through here so attribution is decided in ONE place:
 * the acting user if there is one, otherwise the tenant's reserved system actor. No
 * caller should ever have to think about it, and none should be able to skip the row
 * because it could not find a user.
 *
 * ⚠️ The table is append-only at the database — two triggers refuse UPDATE and DELETE.
 * Anything written here is permanent, including a mistake. Write facts, not guesses.
 */
class AuditLogger
{
    /**
     * @param  string  $action      'enquiry.cargo_promoted', 'job.cancelled', …
     * @param  string  $modelType   a MORPH-MAP key ('enquiry', 'job', 'invoice'), never
     *                              a fully-qualified class name — a class rename would
     *                              otherwise orphan every historical row
     * @param  int|null $userId     the acting user, or NULL for an automated action
     */
    public function record(int $agentId, string $action, string $modelType, int $modelId, ?int $userId = null): void
    {
        DB::table('audit_logs')->insert([
            'agent_id'   => $agentId,
            'user_id'    => $userId ?? SystemActor::forBranch($agentId),
            'action'     => $action,
            'model_type' => $modelType,
            'model_id'   => $modelId,
            'created_at' => now(),
        ]);
    }

    /** Explicitly system-attributed — for schedulers and queue workers. */
    public function recordSystem(int $agentId, string $action, string $modelType, int $modelId): void
    {
        $this->record($agentId, $action, $modelType, $modelId, null);
    }
}
