<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    /**
     * Platform subscription tiers, in ascending order of entitlement.
     *
     * The order is load-bearing: tierAtLeast() compares by INDEX, so inserting a tier
     * in the wrong position silently changes who can reach what.
     */
    public const TIERS = ['core', 'tactical', 'command'];

    protected $fillable = [
        'name', 'code', 'tier', 'email_domain',
        'ocr_credits_balance', 'ocr_credits_monthly_allowance', 'ocr_credits_limit',
        'templates_config', 'in_testing_mode',
        // NULL follows the plan (config/f16s.php ai_monthly_limit_inr).
        'ai_monthly_limit_inr',
    ];

    protected $casts = [
        'templates_config' => 'array',
        // DECIMAL(12,2) in the database; without these casts MySQL hands back "500.00" as a
        // string and `$balance - $amount` quietly does string arithmetic.
        'ocr_credits_balance'          => 'float',
        'ocr_credits_monthly_allowance' => 'float',
        'ocr_credits_limit'            => 'float',
        'deleted_at'       => 'datetime',
    ];

    public function branches()
    {
        return $this->hasMany(Agent::class, 'company_id');
    }

    /** True when this tenant's tier meets or exceeds $tier. */
    public function tierAtLeast(string $tier): bool
    {
        $have = array_search($this->tier, self::TIERS, true);
        $need = array_search($tier, self::TIERS, true);

        // An unknown tier on either side denies rather than guesses.
        return $have !== false && $need !== false && $have >= $need;
    }

    /**
     * OCR credit entitlement, resolving NULL as "follow the tier".
     *
     * A non-NULL column value is a deliberate superadmin override pinned to this tenant,
     * which is why it wins: an ordinary tenant is lifted automatically on upgrade, while
     * a negotiated allowance is never silently overwritten by a tier change.
     */
    public function creditAllowance(): float
    {
        return (float) ($this->ocr_credits_monthly_allowance
            ?? config("f16s.credits.{$this->tier}.monthly_allowance", 0));
    }

    /**
     * ⚠️ FLOAT since credits learned decimals (2026-09-20). Casting this to int rounded a
     * -20.50 floor to -20 and refused the last half credit a tenant had actually been given.
     */
    public function creditFloor(): float
    {
        return (float) ($this->ocr_credits_limit
            ?? config("f16s.credits.{$this->tier}.overdraft_limit", 0));
    }
}
