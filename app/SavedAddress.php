<?php

namespace App;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

/**
 * A reusable party address — the shipper, consignee or notify party a branch keeps typing.
 *
 * 🔴 **BRANCH-SCOPED, added 2026-09-03.** This model carried NO tenant scope at all, and
 * `getAddressByType()` fetched by raw id with no filter — so any authenticated user could
 * read any branch's, and any TENANT's, saved party by guessing an id. The table was empty
 * so nothing leaked, but the endpoint is live and the AWB forms call it.
 *
 * ⚠️ Branch and not company: an address book is what one office types every day, and the
 * consignee list of a Chennai desk is not the Mumbai desk's to browse.
 */
class SavedAddress extends Model
{
    use BelongsToTenant;

    /** @see BelongsToTenant — the default, stated because this model's scoping was the bug. */
    protected string $tenantColumn = 'agent_id';

    protected $fillable = [
        'awb_id',
        'agent_id',
        'user_id',
        'address_type',
        'name',
        'name_2',
        'account',
        'address',
        'address_line_2',
        'city',
        'airport_code',
        'post_code',
        'state',
        'country',
        'phone',
        'fax',
        'telex',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

