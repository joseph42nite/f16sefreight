<?php

namespace App;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * One of the company's own bank accounts, and the ledger code it posts to.
 *
 * 🔐 `account_no` and `ifsc_code` are ENCRYPTED AT REST by the casts below and `$hidden` from every response.
 * `last_four` is kept in the clear on purpose — it is what lets somebody match a statement to an account by eye
 * without the full number ever leaving the database.
 */
class BankAccount extends Model
{
    use BelongsToTenant;

    /** Every bank account's code begins here, so the chart groups them together. */
    public const CODE_PREFIX = '1100-Bank';

    protected $fillable = [
        'agent_id', 'name', 'bank_name', 'account_no', 'ifsc_code', 'branch_name',
        'currency', 'account_code', 'last_four', 'provider', 'provider_ref', 'is_default', 'is_active',
    ];

    protected $casts = [
        'account_no' => 'encrypted',
        'ifsc_code' => 'encrypted',
        'is_default' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected $hidden = ['account_no', 'ifsc_code'];

    /**
     * The ledger code for a new account: `1100-Bank-HDFC-4321`, or the name when there is no number.
     *
     * ⚠️ Derived ONCE, at creation, and never recomputed — renaming an account must not move where its history
     * is posted. That is why `account_code` is a stored column rather than an accessor.
     */
    public static function codeFor(?string $bankName, ?string $lastFour, string $name): string
    {
        $parts = array_filter([
            Str::upper(Str::slug((string) ($bankName ?: $name), '')),
            $lastFour,
        ]);

        return Str::limit(self::CODE_PREFIX . '-' . implode('-', $parts), 30, '');
    }

    /** The last four digits of an account number, however it was typed. */
    public static function lastFour(?string $accountNo): ?string
    {
        $digits = preg_replace('/\D/', '', (string) $accountNo);

        return strlen($digits) >= 4 ? substr($digits, -4) : null;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
