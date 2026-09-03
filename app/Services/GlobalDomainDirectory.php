<?php

namespace App\Services;

use App\Partner;
use Illuminate\Support\Facades\DB;

/**
 * The platform's shared knowledge of which domains belong to whom.
 *
 * 🔴 **This is the progressive loop.** A tenant classifies mail from an airline once; the
 * domain enters the directory; every OTHER tenant's inbox classifies that airline
 * correctly from then on, without anybody typing a rule. Airline, broker and trucker
 * domains are the same everywhere, so learning them per tenant means learning the same
 * fact hundreds of times.
 *
 * 🔐 **Only three things cross the tenant boundary: domain, classification, count.** Never
 * a subject, a sender, a thread, a client, or which tenant said so. "lhcargo.test is an
 * airline" is an industry fact. "Globex emailed about a pharma shipment" is a client's
 * business, and nothing in this class can carry it.
 *
 * ⚠️ **A tenant's own rules always win.** This supplies a default, never a verdict.
 */
class GlobalDomainDirectory
{
    /**
     * How many DISTINCT tenants must agree before a correction becomes an industry fact.
     *
     * ⚠️ One tenant correcting the same domain fifty times is one opinion, repeated —
     * possibly a local habit, possibly a mistake. Three arriving independently is
     * evidence, and the count is of TENANTS for exactly that reason.
     */
    public const CONFIRMATIONS_REQUIRED = 3;

    /**
     * `partners.partner_type` → the inbox vocabulary.
     *
     * 🔴 `shipping_line` is deliberately ABSENT. The classifications are
     * customer_enquiry | airline | clearance | trucking_road — an air-shaped list with no
     * slot for a sea carrier. Mapping Maersk to `airline` to fill the gap would put sea
     * carriers in the air folder and make the mistake invisible. The vocabulary needs a
     * sea class before this line can exist (GAPS).
     */
    private const PARTNER_TYPE_MAP = [
        'airline'        => 'airline',
        'customs_broker' => 'clearance',
        'transporter'    => 'trucking_road',
    ];

    /** What this domain is, platform-wide, or NULL if the platform has never seen it. */
    public function classify(?string $domain): ?string
    {
        if (blank($domain)) {
            return null;
        }

        return DB::table('global_domain_classifications')
            ->where('domain', strtolower($domain))
            ->value('classification');
    }

    /**
     * Record what a partner tells us about a domain.
     *
     * 🔴 An operator adding "Lufthansa Cargo, airline, ops@lhcargo.test" has just stated an
     * industry fact as a side effect of ordinary work. That is the cheapest, most reliable
     * signal the product has, and it costs the operator nothing extra.
     *
     * ⚠️ A free-mail domain is REFUSED. A broker who lists a gmail address would otherwise
     * classify every personal mail on the platform as clearance.
     */
    public function observePartner(Partner $partner): bool
    {
        $classification = self::PARTNER_TYPE_MAP[$partner->partner_type] ?? null;
        $domain = $this->domainOf($partner->email);

        if ($classification === null || $domain === null || $this->isFreeMail($domain)) {
            return false;
        }

        $existing = DB::table('global_domain_classifications')->where('domain', $domain)->first();

        if ($existing === null) {
            DB::table('global_domain_classifications')->insert([
                'domain' => $domain, 'classification' => $classification,
                'source' => 'partner', 'confirmations' => 1,
                'created_at' => now(), 'updated_at' => now(),
            ]);

            return true;
        }

        // ⚠️ An existing entry is NOT overwritten by a later, differing opinion. Two
        // tenants disagreeing about a domain is a thing to look at, not a race in which
        // the last writer is right.
        if ($existing->classification === $classification) {
            DB::table('global_domain_classifications')->where('id', $existing->id)
                ->update(['confirmations' => $existing->confirmations + 1, 'updated_at' => now()]);
        }

        return false;
    }

    /**
     * Promote domains that enough DISTINCT tenants have independently corrected the same way.
     *
     * @return int how many were promoted
     */
    public function promoteFromOverrides(int $minTenants = self::CONFIRMATIONS_REQUIRED): int
    {
        // 🔐 The only columns read are the domain and the corrected classification. The
        // tenant column is COUNTED and discarded — it never reaches the directory.
        $candidates = DB::table('email_classification_overrides as o')
            ->join('agents_info as a', 'a.id', '=', 'o.agent_id')
            ->whereNotNull('o.sender_domain')
            ->where('o.corrected_classification', '!=', 'customer_enquiry')
            ->groupBy('o.sender_domain', 'o.corrected_classification')
            ->havingRaw('COUNT(DISTINCT a.company_id) >= ?', [$minTenants])
            ->get([
                'o.sender_domain',
                'o.corrected_classification',
                DB::raw('COUNT(DISTINCT a.company_id) as tenants'),
            ]);

        $promoted = 0;

        foreach ($candidates as $row) {
            $domain = strtolower($row->sender_domain);

            if ($this->isFreeMail($domain)) {
                continue;
            }

            $exists = DB::table('global_domain_classifications')->where('domain', $domain)->exists();

            if ($exists) {
                continue;
            }

            DB::table('global_domain_classifications')->insert([
                'domain' => $domain,
                'classification' => $row->corrected_classification,
                'source' => 'promoted',
                'confirmations' => (int) $row->tenants,
                'created_at' => now(), 'updated_at' => now(),
            ]);

            $promoted++;
        }

        return $promoted;
    }

    public function domainOf(?string $email): ?string
    {
        $at = $email === null ? false : strrpos($email, '@');

        return $at === false ? null : strtolower(substr($email, $at + 1));
    }

    /**
     * 🔴 A shared mailbox provider is never an industry fact about one party. One broker
     * using gmail would otherwise classify the entire platform's personal mail as
     * clearance — the single most damaging thing this directory could learn.
     */
    public function isFreeMail(string $domain): bool
    {
        return in_array($domain, [
            'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'hotmail.com',
            'outlook.com', 'live.com', 'aol.com', 'icloud.com', 'protonmail.com',
            'rediffmail.com', 'zoho.com', 'mail.com', 'gmx.com', 'yandex.com',
        ], true);
    }
}
