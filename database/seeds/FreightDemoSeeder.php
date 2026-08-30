<?php

use App\AccountsInvoice;
use App\AccountsInvoiceItem;
use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\Job;
use App\Partner;
use App\Services\SystemActor;
use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * A walkable demo tenant — every login, every tier, both portals, real lifecycle data.
 *
 *     php artisan db:seed --class=FreightDemoSeeder
 *
 * ═══ WHY THIS EXISTS ════════════════════════════════════════════════════════
 * Everything built through Step 5 is invisible without data: the six logins, the tier
 * locks, the credit gate, the ledger and the funnel are all correct and all render
 * empty screens. This seeder is what turns a passing test suite into something you can
 * open in a browser and click through.
 *
 * ═══ 🔴 A LOGIN NEEDS A `roles` ROW, NOT JUST A `users` ROW ═════════════════
 * `LoginController` resolves the auth GUARD from `roles.email` before it ever touches
 * `users`. A user seeded without its roles row returns 401 Unauthorized with a correct
 * password — which reads as a broken password, not as missing data, and costs an hour
 * to diagnose. Every user here gets both.
 *
 * ═══ IDEMPOTENT ════════════════════════════════════════════════════════════
 * Re-running wipes only what it created, by company code. It never truncates a table:
 * the legacy demo rows (`user@gmail.com`, the blog, the waybills) belong to the live
 * product and are not this seeder's to remove.
 *
 * ═══ WHAT YOU CAN WALK THROUGH ═════════════════════════════════════════════
 *   focusair.localhost:8000   pricing / operations / sales — air only
 *   focussea.localhost:8000   the same people, sea only, and the data DIFFERS
 *   accounts.localhost:8000   the AR register, the credit gate, the ledger
 *   admin.localhost:8000      the Boss: read-only financials, cross-mode
 *
 * Password for every account below: **demo1234**
 */
class FreightDemoSeeder extends Seeder
{
    private const PASSWORD = 'demo1234';

    /** Two tenants: one on Command, one on Tactical, so the tier locks are visible. */
    private const TENANTS = [
        ['code' => 'DEMO', 'name' => 'Demo Freight Pvt Ltd', 'tier' => 'command',  'domain' => 'demofreight.test'],
        ['code' => 'TACT', 'name' => 'Tactical Cargo Co',    'tier' => 'tactical', 'domain' => 'tacticalcargo.test'],
    ];

    private const DESIGNATIONS = ['pricing', 'operations', 'sales', 'accounts', 'boss'];

    /** Real lanes, so the LOCODEs on screen are ones a freight person recognises. */
    private const AIR_LANES = [['INBOM', 'DEFRA'], ['INMAA', 'AEDXB'], ['INBOM', 'USJFK'], ['INDEL', 'GBLHR']];
    private const SEA_LANES = [['INNSA', 'DEHAM'], ['INMAA', 'SGSIN'], ['INMUN', 'NLRTM']];

    public function run(): void
    {
        foreach (self::TENANTS as $tenant) {
            $this->purge($tenant['code']);
            $this->seedTenant($tenant);
        }

        $this->syncSequenceCounters();
        $this->summary();
    }

    /**
     * 🔴 **ADVANCE `sequence_counters` PAST EVERYTHING THIS SEEDER WROTE.**
     *
     * The seeder inserts enquiry, job and invoice numbers directly, which leaves the
     * shared counter at zero while the tables already hold `…-0001` upward. The first
     * genuine mint then collides — found by promoting a thread in the browser and
     * getting `1062 Duplicate entry '40-ENQA-DEMOBOM-26-0001'`.
     *
     * The UNIQUE key caught it, which is the system working: a duplicate document
     * number on customs paperwork is not recoverable. But a demo that breaks the
     * moment you use it is worse than no demo, and the fix belongs here — anything
     * that writes a number outside `EnquirySequenceService` owes the counter an update.
     */
    private function syncSequenceCounters(): void
    {
        // April–March, matching EnquirySequenceService::fiscalYear().
        $fy = now()->month >= 4 ? now()->format('y') : now()->subYear()->format('y');

        $sources = [
            ['enquiries', 'enquiry_no'],
            ['jobs', 'job_order_no'],
            ['accounts_invoices', 'invoice_no'],
        ];

        foreach (DB::table('agents_info')->pluck('id') as $agentId) {
            $highest = [];

            foreach ($sources as [$table, $column]) {
                $rows = DB::table($table)->where('agent_id', $agentId)
                    ->whereNotNull($column)->pluck($column);

                foreach ($rows as $number) {
                    // PREFIX-AGENTCODE-YY-NNNN
                    $parts = explode('-', (string) $number);
                    if (count($parts) !== 4) {
                        continue;
                    }

                    [$prefix, , $year, $seq] = $parts;
                    if ($year !== $fy) {
                        continue;
                    }

                    $highest[$prefix] = max($highest[$prefix] ?? 0, (int) $seq);
                }
            }

            foreach ($highest as $prefix => $value) {
                DB::table('sequence_counters')->updateOrInsert(
                    ['agent_id' => $agentId, 'prefix' => $prefix, 'fiscal_year' => $fy],
                    ['current_value' => $value, 'updated_at' => now(), 'created_at' => now()]
                );
            }
        }
    }

    /**
     * Reset only the TRANSACTIONAL layer. Identity and audit survive.
     *
     * ⚠️ Deliberately not `truncate`. The legacy demo data is the live product's, and a
     * seeder that clears tables it did not fill is a seeder nobody dares run twice.
     *
     * 🔴 **`audit_logs` IS NEVER TOUCHED — the database refuses.** An earlier version of
     * this method deleted it, and the first re-run after anything had actually audited
     * died on `SQLSTATE[45000] 1644 audit_logs is append-only: DELETE is forbidden`.
     * The trigger was right and the seeder was wrong: an audit trail that a seeder can
     * erase is not an audit trail. Companies, branches, users and their `roles` rows are
     * therefore reused rather than recreated — which also keeps the demo logins stable
     * across re-seeds, so a bookmarked session does not break every time this runs.
     */
    private function purge(string $code): void
    {
        $company = Company::where('code', $code)->first();

        if ($company === null) {
            return;
        }

        $branchIds = Agent::where('company_id', $company->id)->pluck('id');
        $jobIds = Job::withoutGlobalScopes()->whereIn('agent_id', $branchIds)->pluck('id');
        $invoiceIds = AccountsInvoice::withoutGlobalScopes()->whereIn('agent_id', $branchIds)->pluck('id');

        // Children first — several of these FKs are RESTRICT precisely so a real
        // liability cannot be orphaned, and they will refuse a parent-first delete.
        DB::table('accounts_invoice_items')->whereIn('invoice_id', $invoiceIds)->delete();
        DB::table('accounts_ledger_entries')->whereIn('agent_id', $branchIds)->delete();
        DB::table('unposted_transactions_queue')->whereIn('agent_id', $branchIds)->delete();
        DB::table('bank_transactions')->whereIn('agent_id', $branchIds)->delete();
        DB::table('accounts_invoices')->whereIn('agent_id', $branchIds)->delete();
        DB::table('accounting_periods')->whereIn('agent_id', $branchIds)->delete();
        DB::table('chart_of_accounts')->whereIn('agent_id', $branchIds)->delete();

        DB::table('mailbox_connections')->whereIn('agent_id', $branchIds)->delete();
        $threadKeys = DB::table('email_threads')->whereIn('agent_id', $branchIds)->pluck('thread_key');
        DB::table('email_attachments')->whereIn('email_message_id',
            DB::table('email_messages')->whereIn('thread_key', $threadKeys)->pluck('id'))->delete();
        DB::table('email_messages')->whereIn('thread_key', $threadKeys)->delete();
        DB::table('email_threads')->whereIn('agent_id', $branchIds)->delete();

        DB::table('sea_shipment_details')->whereIn('job_id', $jobIds)->delete();
        DB::table('air_shipment_details')->whereIn('job_id', $jobIds)->delete();
        DB::table('sea_containers')->whereIn('agent_id', $branchIds)->delete();
        DB::table('manifest_filings')->whereIn('agent_id', $branchIds)->delete();
        DB::table('milestone_performance_logs')->whereIn('agent_id', $branchIds)->delete();

        DB::table('sales_action_queue')->whereIn('agent_id', $branchIds)->delete();
        DB::table('customer_performance_snapshots')->whereIn('agent_id', $branchIds)->delete();
        DB::table('customer_lane_stats')->whereIn('agent_id', $branchIds)->delete();
        DB::table('customer_cadence_profiles')->whereIn('agent_id', $branchIds)->delete();

        // enquiries.reinitiated_from_job_id points BACK at jobs, so break the cycle
        // before deleting either side.
        DB::table('enquiries')->whereIn('agent_id', $branchIds)->update(['reinitiated_from_job_id' => null]);
        DB::table('jobs')->whereIn('agent_id', $branchIds)->delete();
        DB::table('enquiries')->whereIn('agent_id', $branchIds)->delete();

        DB::table('customers')->where('company_id', $company->id)->delete();
        DB::table('partners')->where('company_id', $company->id)->delete();
        DB::table('sequence_counters')->whereIn('agent_id', $branchIds)->delete();

        // audit_logs, users, roles, agents_info and companies are NOT deleted —
        // see the docblock. audit_logs.user_id and .agent_id are real foreign keys,
        // so the append-only trail also pins the identities it refers to.
    }

    private function seedTenant(array $tenant): void
    {
        $company = Company::firstOrCreate(
            ['code' => $tenant['code']],
            ['name' => $tenant['name'], 'tier' => $tenant['tier'],
             'email_domain' => $tenant['domain'], 'ocr_credits_balance' => 500]
        );
        // The tier may have been changed by hand between runs; put it back.
        $company->update(['tier' => $tenant['tier'], 'name' => $tenant['name']]);

        // Two branches, so branch isolation and the per-branch credit rule are visible.
        $branches = collect([
            ['agent_name' => 'Mumbai', 'branch_code' => 'BOM', 'agent_city' => 'Mumbai'],
            ['agent_name' => 'Chennai', 'branch_code' => 'MAA', 'agent_city' => 'Chennai'],
        ])->map(fn ($b) => Agent::firstOrCreate(
            ['company_id' => $company->id, 'branch_code' => $b['branch_code']],
            $b + ['company_id' => $company->id, 'agent_country' => 'India']
        ));

        // Every tenant needs its reserved system actor before anything audits.
        SystemActor::forBranch($branches->first()->id);

        $users = $this->seedUsers($company, $branches->first(), $tenant['code']);
        $customers = $this->seedCustomers($company, $branches->first(), $users['sales']);
        $this->seedPartners($company);

        $this->seedPeriod($branches->first());

        foreach ($branches as $branch) {
            $this->seedLifecycle($branch, $customers, $users);
            $this->seedTrailingHistory($branch, $customers[3], $users);
            $this->seedInbox($branch, $customers, $users);
        }

        // Only the Command tenant gets financials — below Command there is no ledger.
        if ($tenant['tier'] === 'command') {
            $this->seedFinancials($branches->first(), $customers, $users);
        }
    }

    /** @return array<string, User> */
    private function seedUsers(Company $company, Agent $branch, string $code): array
    {
        $prefix = strtolower($code);
        $users = [];

        foreach (self::DESIGNATIONS as $designation) {
            $email = "{$prefix}-{$designation}@demo.test";

            $users[$designation] = User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => ucfirst($designation) . " ({$code})",
                    'password' => Hash::make(self::PASSWORD),
                    'company_name' => $company->id, // stores the company ID — see LoginController
                    'branch_name' => $branch->id,
                    'designation' => $designation,
                    'is_active' => 1,
                ]
            );

            // 🔴 Without this row the login returns 401 with a CORRECT password, because
            // LoginController resolves the auth guard from `roles.email` before it ever
            // looks at `users`. That reads as a bad password, not as missing data.
            DB::table('roles')->updateOrInsert(
                ['email' => $email],
                ['role' => 'user', 'updated_at' => now(), 'created_at' => now()]
            );
        }

        return $users;
    }

    /**
     * Four clients, each chosen to make one credit-gate behaviour visible on screen.
     *
     * @return \Illuminate\Support\Collection<Customer>
     */
    private function seedCustomers(Company $company, Agent $branch, User $sales)
    {
        return collect([
            // 🔴 NULL is not zero. No limit configured — the gate does NOT block, and
            // the screen must read "Not configured", never "0.00".
            ['name' => 'Northwind Traders', 'credit_limit' => null, 'payment_terms_days' => 30],

            // Comfortably inside its limit — the ordinary case.
            ['name' => 'Contoso Exports',   'credit_limit' => 2500000.00, 'payment_terms_days' => 45],

            // Will be pushed AT its limit below, so [Finalize] returns 422 on screen.
            ['name' => 'Globex Mumbai',     'credit_limit' => 300000.00, 'payment_terms_days' => 30],

            // Same email domain as Globex Mumbai => the group roll-up appears, and the
            // per-branch rule is demonstrable: this one still ships while Mumbai cannot.
            ['name' => 'Globex Chennai',    'credit_limit' => 500000.00, 'payment_terms_days' => 30],
        ])->map(fn ($c, $i) => Customer::create($c + [
            'company_id' => $company->id,
            'email_domain' => str_starts_with($c['name'], 'Globex')
                ? 'globex.test'
                : strtolower(explode(' ', $c['name'])[0]) . '.test',
            'email' => 'ops@' . (str_starts_with($c['name'], 'Globex') ? 'globex.test' : strtolower(explode(' ', $c['name'])[0]) . '.test'),
            'phone' => '+91 22 4000 ' . (1000 + $i),
            'gst_no' => '27AAACG' . (1000 + $i) . 'A1Z5',
            'branch_id' => $branch->id,
            'sales_id' => $sales->id,
        ]));
    }

    private function seedPartners(Company $company): void
    {
        foreach ([
            ['name' => 'Emirates SkyCargo', 'partner_type' => 'airline'],
            ['name' => 'Lufthansa Cargo',   'partner_type' => 'airline'],
            ['name' => 'Maersk Line',       'partner_type' => 'shipping_line'],
            ['name' => 'Sharma CHA & Co',   'partner_type' => 'customs_broker'],
            ['name' => 'BlueDart Trucking', 'partner_type' => 'transporter'],
        ] as $i => $p) {
            Partner::create($p + [
                'company_id' => $company->id,
                'email' => 'bookings@' . strtolower(explode(' ', $p['name'])[0]) . '.test',
                'phone' => '+91 22 5000 ' . (2000 + $i),
            ]);
        }
    }

    /** Posting needs an open period covering today, or every [Post Ledger] returns 422. */
    private function seedPeriod(Agent $branch): void
    {
        DB::table('accounting_periods')->insert([
            'agent_id' => $branch->id,
            'period_name' => 'FY' . now()->format('y'),
            'start_date' => now()->startOfYear()->toDateString(),
            'end_date' => now()->endOfYear()->toDateString(),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    /**
     * Enquiries and jobs across the whole lifecycle, in BOTH modes.
     *
     * The mode split is the point: log in at focusair. and focussea. as the same person
     * and the boards hold different work. A demo where both portals show the same rows
     * proves nothing about the thing the portals exist to do.
     */
    private function seedLifecycle(Agent $branch, $customers, array $users): void
    {
        $agentCode = Company::find($branch->company_id)->code . $branch->branch_code;
        $seq = ['air' => 0, 'sea' => 0];

        foreach ([['air', self::AIR_LANES, 'ENQA', 'JOBA'], ['sea', self::SEA_LANES, 'ENQS', 'JOBS']] as [$mode, $lanes, $ePrefix, $jPrefix]) {
            // A spread that makes the Kanban and the funnel both look like a real week.
            $plan = [
                ['new', null], ['new', null], ['quoted', null], ['quoted', null],
                ['awaiting_client', null],
                ['lost', 'rates_high'], ['lost', 'delay_in_response'], ['lost', 'rates_high'],
                ['converted', null], ['converted', null], ['converted', null],
            ];

            foreach ($plan as $i => [$status, $lostReason]) {
                [$origin, $dest] = $lanes[$i % count($lanes)];
                $customer = $customers[$i % $customers->count()];
                $daysAgo = 30 - ($i * 2);

                $enquiry = Enquiry::create([
                    'agent_id' => $branch->id,
                    'transport_mode' => $mode,
                    'direction' => 'export',
                    'enquiry_no' => sprintf('%s-%s-%s-%04d', $ePrefix, $agentCode, now()->format('y'), ++$seq[$mode]),
                    'customer_id' => $customer->id,
                    'sales_id' => $users['sales']->id,
                    'pricing_id' => $users['pricing']->id,
                    'status' => $status,
                    'origin_code' => $origin,
                    'dest_code' => $dest,
                    'extracted_pieces' => 6 + $i,
                    'extracted_weight' => round(320.5 + ($i * 47.25), 3),
                    'extracted_volume' => round(1.8 + ($i * 0.35), 3),
                    'cargo_description' => ['Machine parts', 'Textiles', 'Pharma (temp-controlled)', 'Auto components'][$i % 4],
                    'cargo_type' => $mode === 'sea' ? 'fcl' : 'general',
                    'cargo_data_source' => 'regex',
                    // 🔴 The highest-value column in the PRD: without the amount,
                    // 'rates_high' records THAT we lost on price but never by how much.
                    'quoted_amount' => in_array($status, ['new'], true) ? null : round(85000 + ($i * 12500), 2),
                    'quoted_currency' => 'INR',
                    'lost_reason' => $lostReason,
                    'lost_at' => $lostReason ? now()->subDays(max($daysAgo - 1, 1)) : null,
                    'created_at' => now()->subDays(max($daysAgo, 1)),
                    'updated_at' => now()->subDays(max($daysAgo, 1)),
                ]);

                if ($status !== 'converted') {
                    continue;
                }

                $job = Job::create([
                    'agent_id' => $branch->id,
                    'enquiry_id' => $enquiry->id,
                    'transport_mode' => $mode,
                    'direction' => 'export',
                    'job_order_no' => sprintf('%s-%s-%s-%04d', $jPrefix, $agentCode, now()->format('y'), $seq[$mode]),
                    'customer_id' => $customer->id,
                    'ops_id' => $users['operations']->id,
                    'pricing_id' => $users['pricing']->id,
                    // A spread across the board so the Kanban has cards in every column.
                    'status' => ['Verification', 'PDF Generated', 'Airline Confirmed'][$i % 3],
                    'cargo_type' => $mode === 'sea' ? 'fcl' : 'general',
                    'awb_number' => $mode === 'air' ? '176-' . str_pad((string) (10000000 + $i), 8, '0', STR_PAD_LEFT) : null,
                    'created_at' => now()->subDays(max($daysAgo, 1)),
                    'updated_at' => now()->subDays(max($daysAgo, 1)),
                ]);

                $this->seedShipmentDetails($job, $mode, $origin, $dest, $i);
            }
        }
    }

    /**
     * Fourteen months of air shipments on a ~9-day rhythm for ONE client, then silence.
     *
     * 🔴 **WITHOUT THIS THE ENGINE HAS NOTHING TO MEASURE AND EVERY INDEX IS NULL.**
     * The guard rails require >= 5 distinct shipment days before a cadence profile is
     * emitted and >= 5 closed enquiries before a win rate is, and they are right to:
     * one loss out of one enquiry is a 100% service-loss rate. But a demo where every
     * figure is correctly NULL demonstrates the guard rails and nothing else.
     *
     * The gap at the end is deliberate — it reproduces the PRD's own worked example:
     * *"Globex normally ships air every 9 days; it has been 26."* That is what makes
     * the churn action fire, with real arithmetic behind it rather than a seeded row
     * in `sales_action_queue` pretending an engine ran.
     */
    private function seedTrailingHistory(Agent $branch, Customer $customer, array $users): void
    {
        $agentCode = Company::find($branch->company_id)->code . $branch->branch_code;
        $lanes = self::AIR_LANES;
        $seq = 500;

        // ~9-day rhythm with jitter, stopping 26 days ago: overdue_ratio ≈ 2.9 -> DORMANT.
        $day = 430;
        $i = 0;

        while ($day > 26) {
            [$origin, $dest] = $lanes[$i % count($lanes)];
            $when = now()->subDays($day);

            // Mostly won, some lost — enough closed enquiries to clear the win-rate
            // and loss-split minimums, with a loss mix that makes the split meaningful.
            $lostReason = match ($i % 7) {
                3 => 'rates_high',
                6 => 'delay_in_response',
                default => null,
            };
            $status = $lostReason ? 'lost' : 'converted';

            $enquiry = Enquiry::create([
                'agent_id' => $branch->id, 'transport_mode' => 'air', 'direction' => 'export',
                'enquiry_no' => sprintf('ENQA-%s-%s-%04d', $agentCode, $when->format('y'), ++$seq),
                'customer_id' => $customer->id,
                'sales_id' => $users['sales']->id, 'pricing_id' => $users['pricing']->id,
                'status' => $status,
                'origin_code' => $origin, 'dest_code' => $dest,
                'extracted_pieces' => 8 + ($i % 5),
                'extracted_weight' => round(400 + (($i % 9) * 60), 3),
                'cargo_description' => 'Machine parts', 'cargo_type' => 'general',
                'cargo_data_source' => 'regex',
                'quoted_amount' => round(92000 + (($i % 6) * 8000), 2), 'quoted_currency' => 'INR',
                'lost_reason' => $lostReason,
                'lost_at' => $lostReason ? $when : null,
                'created_at' => $when, 'updated_at' => $when,
            ]);

            if ($status === 'converted') {
                $job = Job::create([
                    'agent_id' => $branch->id, 'enquiry_id' => $enquiry->id,
                    'transport_mode' => 'air', 'direction' => 'export',
                    'job_order_no' => sprintf('JOBA-%s-%s-%04d', $agentCode, $when->format('y'), $seq),
                    'customer_id' => $customer->id, 'ops_id' => $users['operations']->id,
                    'pricing_id' => $users['pricing']->id, 'status' => 'Completed',
                    'cargo_type' => 'general', 'completed_at' => $when->copy()->addDays(4),
                    'created_at' => $when, 'updated_at' => $when,
                ]);

                DB::table('air_shipment_details')->insert([
                    'job_id' => $job->id,
                    'flight_number' => 'EK511', 'carrier_name' => 'Emirates SkyCargo',
                    'pol_code' => $origin, 'pod_code' => $dest,
                    'piece_count' => 8 + ($i % 5),
                    'gross_weight' => round(400 + (($i % 9) * 60), 3),
                    'chargeable_weight' => round(420 + (($i % 9) * 60), 3),
                    'created_at' => $when, 'updated_at' => $when,
                ]);
            }

            $day -= 8 + ($i % 4);   // 8–11 days: a real rhythm, not a metronome
            $i++;
        }
    }

    /** Tier 3 data — the authoritative figures billing and manifests read. */
    private function seedShipmentDetails(Job $job, string $mode, string $origin, string $dest, int $i): void
    {
        $common = [
            'job_id' => $job->id,
            'piece_count' => 6 + $i,
            'gross_weight' => round(320.5 + ($i * 47.25), 3),
            'chargeable_weight' => round(340.0 + ($i * 47.25), 3),
            'volume_cbm' => round(1.8 + ($i * 0.35), 3),
            'created_at' => now(), 'updated_at' => now(),
        ];

        if ($mode === 'sea') {
            DB::table('sea_shipment_details')->insert($common + [
                'vessel_name' => ['MV Ever Given', 'MV Maersk Sentosa', 'MV MSC Gulsun'][$i % 3],
                'voyage_no' => 'V' . (240 + $i) . 'E',
                'imo_number' => '93' . str_pad((string) (10000 + $i), 5, '0', STR_PAD_LEFT),
                'por_code' => $origin, 'pol_code' => $origin,
                'pod_code' => $dest, 'del_code' => $dest,
                'mbl_number' => 'MAEU' . (74000000 + $i),
                'hbl_number' => 'HBL' . str_pad((string) (1000 + $i), 6, '0', STR_PAD_LEFT),
                'container_type' => ['40HC', '20GP', '40GP'][$i % 3],
                'freight_terms' => 'prepaid',
                'net_weight' => round(300.0 + ($i * 47.25), 3),
                'filing_status' => 'pending',
            ]);

            // A REAL container number — the ISO 6346 check digit is computed on filing,
            // and a fabricated one would make every demo manifest fail validation.
            DB::table('sea_containers')->insert([
                'agent_id' => $job->agent_id, 'job_id' => $job->id,
                'container_number' => ['CSQU3054383', 'MSKU6874230'][$i % 2],
                'seal_number' => 'SEAL' . str_pad((string) (100 + $i), 6, '0', STR_PAD_LEFT),
                'created_at' => now(), 'updated_at' => now(),
            ]);

            return;
        }

        DB::table('air_shipment_details')->insert($common + [
            'flight_number' => ['EK511', 'LH757', 'AI101'][$i % 3],
            'flight_date' => now()->addDays(2 + $i)->toDateString(),
            'carrier_name' => ['Emirates SkyCargo', 'Lufthansa Cargo', 'Air India'][$i % 3],
            'pol_code' => $origin, 'pod_code' => $dest,
            // Deliberately inside the 35-char Cargo-IMP line limit — an over-length
            // line is a validation demo, not a default.
            'pickup_address' => "Plot 14, MIDC Andheri\nMumbai 400093",
            'delivery_address' => "Cargo City Sud, Geb 456\nFrankfurt 60549",
        ]);
    }

    /**
     * The unified inbox — threads and their messages.
     *
     * ⚠️ **Live mail sync is blocked on the Google CASA assessment (GAPS #15), but the
     * inbox itself is not.** The threads below are ordinary rows in the same tables
     * `PollMailboxes` will write to, so the triage surface can be built, used and
     * tested today; when OAuth clears, the seeder stops being the source and nothing
     * above it changes.
     *
     * The mix is chosen so triage has something to decide:
     *   - real enquiries, some already promoted, some still unclassified
     *   - airline and clearance chatter that must NOT become enquiries
     *   - one thread already replied to, so response latency is measurable
     *   - several unassigned, so the claim race has something to race for
     */
    private function seedInbox(Agent $branch, $customers, array $users): void
    {
        // 🔴 `email_messages.mailbox_connection_id` is NOT NULL — every message came
        // from a specific connected mailbox, and which one is not reconstructable
        // later. The connection is seeded as `auth_state = 'connected'` but holds no
        // real tokens: nothing here can actually talk to Gmail, and pretending
        // otherwise would let a sync job try.
        $connectionId = DB::table('mailbox_connections')->insertGetId([
            'agent_id' => $branch->id,
            'user_id' => $users['pricing']->id,
            // ⚠️ UNIQUE across the platform — one mailbox belongs to one connection.
            // A shared per-branch address is also the realistic shape: an operations
            // desk works a branch inbox, not five personal ones.
            'email_address' => 'inbox-' . strtolower($branch->branch_code) . '-'
                               . strtolower(Company::find($branch->company_id)->code) . '@demo.test',
            'provider' => 'gmail',
            'is_active' => 1,
            'auth_state' => 'connected',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $threads = [
            ['Quote request — 6 pallets INBOM to DEFRA', 'ops@contoso.test', 'customer_enquiry', 'unread', 0, false, 2],
            ['RE: Rates for Chennai–Dubai, 12 cartons', 'shipping@globex.test', 'customer_enquiry', 'triaged', 1, true, 4],
            ['Urgent: pharma shipment next Tuesday', 'exports@northwind.test', 'customer_enquiry', 'unread', 0, false, 1],
            ['Flight EK511 rescheduled to 04-Sep', 'cargo@emirates.test', 'airline', 'unread', 0, false, 1],
            ['MAWB 176-10000004 — space confirmed', 'bookings@lufthansa.test', 'airline', 'read', 1, false, 3],
            ['Bill of entry filed — INBOM/2026/0442', 'filings@sharmacha.test', 'clearance', 'unread', 0, false, 2],
            ['Pickup scheduled 02-Sep, 0900 hrs', 'dispatch@bluedart.test', 'trucking_road', 'read', 1, false, 1],
            ['Enquiry: FCL Nhava Sheva to Hamburg', 'logistics@globex.test', 'customer_enquiry', 'unread', 0, false, 2],
        ];

        foreach ($threads as $i => [$subject, $from, $classification, $status, $assigned, $replied, $messages]) {
            $opened = now()->subDays(9 - $i)->subHours(3);
            $key = 'thr_' . $branch->id . '_' . $i . '_' . substr(md5($subject . $branch->id), 0, 8);

            DB::table('email_threads')->insert([
                'agent_id' => $branch->id,
                // Unassigned rows are the pool — the claim endpoint needs something to claim.
                'assigned_ops_id' => $assigned ? $users['operations']->id : null,
                'thread_key' => $key,
                'provider_thread_id' => 'gmail_' . substr(md5($key), 0, 16),
                'status' => $status,
                'classification' => $classification,
                'latest_message_received_at' => $opened->copy()->addHours($messages),
                // 🔴 first_response_at is the first OUTBOUND message, and it is what
                // makes lost_reason = 'delay_in_response' provable. first_triage_at is
                // internal — somebody looked. Conflating them reports an SLA the client
                // never experienced, because nothing was actually sent.
                'first_response_at' => $replied ? $opened->copy()->addMinutes(38) : null,
                'first_triage_at' => $status === 'unread' ? null : $opened->copy()->addMinutes(12),
                'created_at' => $opened, 'updated_at' => $opened,
            ]);

            for ($m = 0; $m < $messages; $m++) {
                $inbound = $m % 2 === 0;

                DB::table('email_messages')->insert([
                    'agent_id' => $branch->id,
                    'mailbox_connection_id' => $connectionId,
                    'thread_key' => $key,
                    'provider_thread_id' => 'gmail_' . substr(md5($key), 0, 16),
                    'direction' => $inbound ? 'inbound' : 'outbound',
                    'message_id' => '<' . substr(md5($key . $m), 0, 20) . '@mail.test>',
                    'from' => $inbound ? $from : $users['pricing']->email,
                    'to' => $inbound ? $users['pricing']->email : $from,
                    'subject' => $m === 0 ? $subject : 'RE: ' . $subject,
                    'body_snippet' => $inbound
                        ? 'Please quote for the shipment described below. Dimensions and packing list attached.'
                        : 'Thank you for the enquiry — our rate for this lane is attached. Validity 7 days.',
                    'received_at' => $opened->copy()->addHours($m),
                    // Outbound mail is STORED but never classified: classifying our own
                    // reply mints a second enquiry from the same conversation and
                    // inflates the conversion denominator.
                    'sent_via_portal' => $inbound ? 0 : 1,
                    'send_state' => $inbound ? null : 'sent',
                    'is_historical' => 0,
                    'created_at' => $opened->copy()->addHours($m),
                    'updated_at' => $opened->copy()->addHours($m),
                ]);
            }
        }
    }

    /**
     * Invoices in every status, including one that puts a client AT its limit.
     *
     * That last one is the whole point: open /financials, hit [Finalize] on the Globex
     * Mumbai draft, and watch the gate return 422 — while Globex Chennai, same group,
     * same domain, still finalizes. The per-branch rule stops being a paragraph in a
     * docblock and becomes something you can see.
     */
    private function seedFinancials(Agent $branch, $customers, array $users): void
    {
        $agentCode = Company::find($branch->company_id)->code . $branch->branch_code;
        $jobs = Job::withoutGlobalScopes()->where('agent_id', $branch->id)->get();
        $n = 0;

        $plan = [
            // [customer index, amount, status, paid]
            [1, 180000.00, 'paid',           180000.00],
            [1, 240000.00, 'sent',                0.00],
            [0, 320000.00, 'finalized',            0.00],   // no credit limit configured
            [2, 300000.00, 'sent',                0.00],   // puts Globex Mumbai AT its limit
            [2,  95000.00, 'draft',                0.00],   // finalizing this must 422
            [3, 140000.00, 'draft',                0.00],   // same group, still fine
            [1,  62000.00, 'partially_paid',  30000.00],
        ];

        foreach ($plan as [$ci, $amount, $status, $paid]) {
            // 🐞 An invoice must hang off a job belonging to ITS OWN customer. An
            // earlier version cycled through every job in the branch, so invoices
            // landed on other clients' shipments — which made the rollup compute
            // revenue and credit utilisation against (customer, mode) pairs that had
            // no invoices at all, and every money figure came back 0.00.
            $job = $jobs->firstWhere('customer_id', $customers[$ci]->id);
            if ($job === null) {
                continue;
            }

            $tax = round($amount * 0.18, 2);
            $n++;

            $invoice = AccountsInvoice::create([
                'agent_id' => $branch->id,
                'job_id' => $job->id,
                'transport_mode' => $job->transport_mode,
                'customer_id' => $customers[$ci]->id,
                'created_by' => $users['accounts']->id,
                // ❓ EVERY invoice carries a number, drafts included, because the schema
                // says `invoice_no VARCHAR(30) NOT NULL`. That contradicts the comment in
                // InvoiceController::finalize claiming the number is minted at
                // finalization so a rejected invoice cannot burn one. Both cannot be
                // true; seeded to the SCHEMA, which is the authority for columns, and
                // raised in GAPS.md #27 rather than resolved by inventing a placeholder
                // convention the rest of the system would have to learn.
                'invoice_no' => sprintf('INV-%s-%s-%04d', $agentCode, now()->format('y'), $n),
                'type' => 'invoice',
                'document_date' => now()->subDays(20 - $n)->toDateString(),
                'status' => $status,
                'subtotal' => $amount,
                'tax_amount' => $tax,
                'grand_total' => round($amount + $tax, 2),
                'amount_paid' => $paid,
                'currency' => 'INR',
            ]);

            AccountsInvoiceItem::create([
                'invoice_id' => $invoice->id,
                'charge_type' => $job->transport_mode === 'air' ? 'air_freight' : 'ocean_freight',
                'description' => 'Freight charges — ' . $job->job_order_no,
                'quantity' => 1, 'rate' => $amount, 'amount' => $amount,
                'tax_percentage' => 18.00, 'tax_amount' => $tax,
                'net_amount' => round($amount + $tax, 2),
            ]);
        }

        // Unmatched bank credits for the reconciliation screen. The first matches an
        // invoice balance exactly; the second is 500 short, which is the write-off case.
        foreach ([212400.00, 211900.00] as $i => $amount) {
            DB::table('bank_transactions')->insert([
                'agent_id' => $branch->id,
                'plaid_transaction_id' => 'demo_txn_' . $branch->id . '_' . $i,
                'amount' => $amount, 'reconciliation_status' => 'unreconciled',
                'created_at' => now()->subDays(2), 'updated_at' => now()->subDays(2),
            ]);
        }
    }

    private function summary(): void
    {
        $this->command->newLine();
        $this->command->info('  Demo tenants seeded. Password for every account: ' . self::PASSWORD);
        $this->command->newLine();

        $rows = [];
        foreach (self::TENANTS as $t) {
            foreach (self::DESIGNATIONS as $d) {
                $rows[] = [$t['tier'], strtolower($t['code']) . "-{$d}@demo.test", $d];
            }
        }

        $this->command->table(['Tier', 'Email', 'Designation'], $rows);

        $this->command->line('  Hosts (macOS maps *.localhost to 127.0.0.1 — no /etc/hosts edit needed):');
        foreach (['focusair', 'focussea', 'accounts', 'admin'] as $host) {
            $this->command->line("    http://{$host}.localhost:8000");
        }
        $this->command->newLine();
    }
}
