<?php

namespace App;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

/**
 * A client of a tenant — shipper, consignee, notify party or debtor.
 *
 * NOT a platform tenant. `Company` holds the forwarding firms subscribing to F16s OS;
 * this holds THEIR clients, and `company_id` below is the owning tenant.
 *
 * 🔐 bank_account_no / bank_ifsc_code are ENCRYPTED AT REST by the casts below.
 * The columns are TEXT because the encrypted payload far exceeds the plaintext — a
 * 34-character IBAN encrypts to 256 chars, which is why VARCHAR(255) was wrong.
 * **Removing these casts silently starts storing bank details in plaintext**, and
 * existing rows then fail to decrypt.
 */
class Customer extends Model
{
    use BelongsToTenant;

    /** Tenant-WIDE: shared across all of this tenant's branches. */
    protected string $tenantColumn = 'company_id';

    protected $fillable = [
        'company_id', 'name', 'email_domain', 'email', 'phone', 'address',
        'gst_no', 'pan_no', 'duns_no',
        'bank_name', 'bank_account_no', 'bank_ifsc_code',
        'payment_terms_days', 'credit_limit',
        'default_port_id', 'branch_id', 'sales_id',
    ];

    protected $casts = [
        'bank_account_no'    => 'encrypted',
        'bank_ifsc_code'     => 'encrypted',
        'credit_limit'       => 'decimal:2',
        'payment_terms_days' => 'integer',
    ];

    /** Never expose banking detail through a default serialization. */
    protected $hidden = ['bank_account_no', 'bank_ifsc_code'];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function contacts()
    {
        return $this->hasMany(CustomerContact::class, 'customer_id');
    }

    public function jobs()
    {
        return $this->hasMany(Job::class, 'customer_id');
    }

    public function invoices()
    {
        return $this->hasMany(AccountsInvoice::class, 'customer_id');
    }

    /** The assigned sales rep — the scoping key for the Command-tier client book. */
    public function salesRep()
    {
        return $this->belongsTo(User::class, 'sales_id');
    }

    /** Advisory managing/proximity branch. NOT an isolation boundary (PRD §1.2). */
    public function branch()
    {
        return $this->belongsTo(Agent::class, 'branch_id');
    }

    public function defaultPort()
    {
        return $this->belongsTo(Port::class, 'default_port_id');
    }

    /**
     * The DERIVED client group: every customer row sharing (company_id, email_domain).
     *
     * That pair IS the grouping key — there is deliberately no parent_customer_id
     * (PRD.md §2.2). One client company with five branches is five rows sharing a domain,
     * which is what makes "how is Globex doing?" answerable without a new entity.
     *
     * ⚠️ Credit is NOT evaluated across the group. The credit gate blocks on this row's
     * own exposure: separate GSTINs are separate billing entities, and one branch's
     * overdue invoice must not freeze another branch's cargo. Group exposure is
     * DISPLAYED as a roll-up, never enforced on.
     */
    public function scopeGroup($query)
    {
        return $query->where('company_id', $this->company_id)
            ->where('email_domain', $this->email_domain);
    }
}
