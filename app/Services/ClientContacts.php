<?php

namespace App\Services;

use App\Customer;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

/**
 * Every mail address a client writes from, saved to its contacts (user, 2026-09-16; PRD §5.2 / §7.3.7 "harvest
 * automatically, CC deliberately").
 *
 * An address on an incoming mail — sender or copied — whose domain is a client's domain is added to that client's
 * `customer_contacts`, or has its count and last-seen date moved on. When a client's domain is first written in,
 * the mail already received from it is gathered the same way.
 *
 * 🔴 Never sets `include_in_cc`, never touches `opted_out_at`: being copied on client email is a person's decision.
 * ⚠️ Free-mail domains are never a client's domain here — gmail.com would collect the whole internet.
 */
class ClientContacts
{
    public function __construct(private readonly GlobalDomainDirectory $domains) {}

    /** The addresses on one incoming mail. */
    public function record(int $agentId, array $addresses, CarbonInterface $at): void
    {
        $companyId = DB::table('agents_info')->where('id', $agentId)->value('company_id');
        $byDomain = collect($this->emails($addresses))->groupBy(fn ($email) => $this->domains->domainOf($email));

        if ($companyId === null || $byDomain->isEmpty()) {
            return;
        }

        // Client rows sharing a domain (Globex Mumbai, Globex Chennai) are one client group: each gets the address.
        $clients = DB::table('customers')->where('company_id', $companyId)
            ->whereIn(DB::raw('LOWER(email_domain)'), $byDomain->keys()->reject(fn ($d) => $this->domains->isFreeMail($d))->all())
            ->get(['id', 'email_domain']);

        foreach ($clients as $client) {
            foreach ($byDomain[strtolower($client->email_domain)] as $email) {
                $this->save((int) $companyId, $client->id, $email, 1, $at);
            }
        }
    }

    /**
     * The client a confirmed shipment is for, added to Clients & Partners if it is not there yet (user, 2026-09-17: "when
     * the shipment is confirmed you'll add the domain name there"). Found or created from the first sender of the
     * enquiry's conversation:
     *   - a company domain: the client with that domain, or a new one named by the domain (write the real name in later);
     *   - a free-mail address (gmail.com…): the client with that address, or a new one named by the address, no domain;
     *   - our own company's domain (a colleague forwarding the request): nobody — we are not our own client.
     * The sender is saved as one of its contacts. Returns the client's id, or null.
     */
    public function clientForConfirmedEnquiry(int $enquiryId): ?int
    {
        $thread = DB::table('email_threads')->where('enquiry_id', $enquiryId)->first(['agent_id', 'thread_key']);
        $first = $thread ? DB::table('email_messages')->where('thread_key', $thread->thread_key)->where('direction', 'inbound')
            ->orderBy('received_at')->first(['from', 'received_at']) : null;
        $email = $first ? ($this->emails([$first->from])[0] ?? null) : null;
        $companyId = $thread ? DB::table('agents_info')->where('id', $thread->agent_id)->value('company_id') : null;

        if ($email === null || $companyId === null) {
            return null;
        }

        $domain = $this->domains->domainOf($email);
        $ourDomains = DB::table('users')->where('company_name', $companyId)->pluck('email')
            ->map(fn ($e) => $this->domains->domainOf(strtolower($e)))->reject(fn ($d) => $this->domains->isFreeMail((string) $d))->unique();

        if ($ourDomains->contains($domain)) {
            return null;
        }

        $freeMail = $this->domains->isFreeMail($domain);
        $clients = DB::table('customers')->where('company_id', $companyId);
        $id = $freeMail
            ? (clone $clients)->whereRaw('LOWER(email) = ?', [$email])->value('id')
            : (clone $clients)->whereRaw('LOWER(email_domain) = ?', [$domain])->orderBy('id')->value('id');

        if ($id === null) {
            $customer = Customer::create($freeMail
                ? ['company_id' => $companyId, 'name' => $email, 'email' => $email]
                : ['company_id' => $companyId, 'name' => $domain, 'email_domain' => $domain]);
            $id = $customer->id;

            if (! $freeMail) {
                $this->backfill($customer); // every address already received from that domain
            }
        }

        $this->save((int) $companyId, (int) $id, $email, 1, \Illuminate\Support\Carbon::parse($first->received_at));

        return (int) $id;
    }

    /** The mail already received from a client's domain — run when the domain is written in or changed. */
    public function backfill(Customer $customer): void
    {
        $domain = strtolower((string) $customer->email_domain);

        if ($domain === '' || $this->domains->isFreeMail($domain)) {
            return;
        }

        $messages = DB::table('email_messages')
            ->whereIn('agent_id', DB::table('agents_info')->where('company_id', $customer->company_id)->select('id'))
            ->where('direction', 'inbound')
            ->where(fn ($q) => $q->where('from', 'like', "%@{$domain}%")->orWhere('cc', 'like', "%@{$domain}%"))
            ->get(['from', 'cc', 'received_at']);

        $seen = [];
        foreach ($messages as $m) {
            foreach ($this->emails([$m->from, $m->cc]) as $email) {
                if ($this->domains->domainOf($email) === $domain) {
                    $seen[$email]['count'] = ($seen[$email]['count'] ?? 0) + 1;
                    $seen[$email]['last'] = max($seen[$email]['last'] ?? '', (string) $m->received_at);
                }
            }
        }

        foreach ($seen as $email => $s) {
            $this->save($customer->company_id, $customer->id, $email, $s['count'], \Illuminate\Support\Carbon::parse($s['last']), true);
        }
    }

    /** One address: added, or its count moved on — or, from a backfill, set to the count found. */
    private function save(int $companyId, int $customerId, string $email, int $count, CarbonInterface $at, bool $setCount = false): void
    {
        DB::statement(
            'INSERT INTO customer_contacts (company_id, customer_id, email, source, message_count, last_seen_at, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
             ON DUPLICATE KEY UPDATE message_count = ' . ($setCount ? 'VALUES(message_count)' : 'message_count + VALUES(message_count)') . ',
                 last_seen_at = GREATEST(COALESCE(last_seen_at, VALUES(last_seen_at)), VALUES(last_seen_at)), updated_at = NOW()',
            [$companyId, $customerId, $email, 'inbound_harvest', $count, $at]
        );
    }

    /** Plain lower-case addresses out of "Name <a@b.com>, c@d.com" strings. */
    private function emails(array $values): array
    {
        preg_match_all('/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i', implode(',', array_filter($values)), $m);

        return array_values(array_unique(array_map('strtolower', $m[0])));
    }
}
