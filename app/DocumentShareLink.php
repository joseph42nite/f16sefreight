<?php

namespace App;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * A tokenised, expiring public link to one document.
 *
 * 🔐 The raw token exists ONLY in the URL that was emailed. This table stores its
 * SHA-256, so a dump yields no working links. `issue()` is the only way to mint one and
 * it returns the raw token exactly once — there is deliberately no way to read it back.
 * **Never add a column holding the raw token "for support purposes".**
 *
 * The client is not a system user: approver_email is EVIDENCE of who approved, captured
 * for audit and matched against customer_contacts. Never build an access decision on it.
 */
class DocumentShareLink extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'agent_id', 'job_document_id', 'job_id', 'token_hash', 'created_by',
        'expires_at', 'revoked_at', 'requires_approval', 'approval_status',
        'approver_name', 'approver_email', 'client_comment', 'responded_at',
        'first_viewed_at', 'last_viewed_at', 'view_count',
    ];

    protected $casts = [
        'requires_approval' => 'boolean',
        'expires_at'        => 'datetime',
        'revoked_at'        => 'datetime',
        'responded_at'      => 'datetime',
        'first_viewed_at'   => 'datetime',
        'last_viewed_at'    => 'datetime',
    ];

    protected $hidden = ['token_hash'];

    /**
     * Mint a link. Returns [model, rawToken] — the raw token is unrecoverable afterwards.
     * expires_at defaults to +14 days and is NOT NULL at the database: a share link with
     * no expiry is a permanent public URL to a customs document.
     */
    public static function issue(array $attributes, int $validDays = 14): array
    {
        $raw = Str::random(48);

        $link = static::create(array_merge([
            'token_hash' => hash('sha256', $raw),
            'expires_at' => now()->addDays($validDays),
        ], $attributes));

        return [$link, $raw];
    }

    public static function findByRawToken(string $raw): ?self
    {
        return static::where('token_hash', hash('sha256', $raw))->first();
    }

    /** Expiry is automatic; revocation is a decision. Both must be checked. */
    public function scopeLive($query)
    {
        return $query->whereNull('revoked_at')->where('expires_at', '>', now());
    }

    public function document()
    {
        return $this->belongsTo(JobDocument::class, 'job_document_id');
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
