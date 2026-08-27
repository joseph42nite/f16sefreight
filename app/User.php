<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{

    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'designation',
        'branch_name',
        'origin_port_id',
        'signature_text',
    ];

    /** In-tenant roles. `superadmin` is NOT here — that is platform-level, not a designation. */
    public const DESIGNATIONS = ['pricing', 'operations', 'sales', 'accounts', 'boss'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * The branch this user belongs to.
     *
     * The column is called `branch_name` but holds `agents_info.id` — verified in code,
     * not assumed (CONTEXT.md §6). It is NOT NULL with a real foreign key as of
     * 2026_08_27_000000, which is what makes tier resolution total: every user has a
     * branch, therefore a company, therefore a tier.
     */
    public function branch()
    {
        return $this->belongsTo(Agent::class, 'branch_name');
    }

    /**
     * The tenant, resolved through the branch — NEVER through `company_name`.
     *
     * `users.company_name` also stores an ID despite its name, but it is legacy and
     * unconstrained. `user -> branch -> company` is the authoritative path (guide §3.0).
     */
    public function company()
    {
        return $this->hasOneThrough(
            Company::class, Agent::class,
            'id',           // agents_info.id
            'id',           // companies.id
            'branch_name',  // users.branch_name -> agents_info.id
            'company_id'    // agents_info.company_id -> companies.id
        );
    }

    public function originPort()
    {
        return $this->belongsTo(Port::class, 'origin_port_id');
    }

    public function getJWTIdentifier(){
        return $this->getKey();
    }

    /**
     * Deliberately empty — identity only.
     *
     * `designation` and `tier` must NOT be token claims: a demotion or a tier downgrade
     * would then take effect only at token expiry rather than on the next request
     * (guide §3.0 rule 2). They are re-read per request by App\Support\UserContext.
     */
    public function getJWTCustomClaims(){
        return [];
    }
}
