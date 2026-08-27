<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * Per-tenant (and optionally per-branch) overrides for the adjustable numbers.
 *
 * 🔴 EVERY COLUMN IS NULLABLE AND NULL IS MEANINGFUL: "inherit from config/f16s.php".
 * This table stores only deliberate overrides, so defaults live in exactly one place.
 * Resolution is always **branch -> company -> config**.
 *
 * Removing an override means setting the COLUMN back to NULL so it falls through — never
 * deleting the row.
 *
 * `policy_scope_gate` is database-generated (COALESCE(agent_id, 0)) and must never be
 * written; it is what makes "one company-wide row per company" enforceable.
 */
class TenantPolicy extends Model
{
    protected $table = 'tenant_policies';

    protected $guarded = ['id', 'policy_scope_gate'];

    /** agent_id NULL = company-wide. */
    public function scopeCompanyWide($query)
    {
        return $query->whereNull('agent_id');
    }

    /**
     * Resolve one setting: branch override, then company-wide, then the config default.
     */
    public static function resolve(int $companyId, ?int $agentId, string $column)
    {
        $value = $agentId === null ? null : static::where('company_id', $companyId)
            ->where('agent_id', $agentId)->value($column);

        $value ??= static::where('company_id', $companyId)->whereNull('agent_id')->value($column);

        return $value ?? config("f16s.policies.{$column}");
    }
}
