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
use App\Services\AwbJobLinker;
use App\Support\AwbNumber;
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

    /**
     * Two tenants: one on Command, one on Tactical, so the tier locks are visible.
     *
     * ⚠️ `scale` exists so the two tenants produce VISIBLY DIFFERENT figures. With
     * identical deterministic data, a cross-tenant leak looks exactly like correct
     * output — both tenants reported 25,194.500 kg and the only way to tell isolation
     * was working was to read the query. Different magnitudes make a leak obvious at a
     * glance, which is the whole point of having two tenants in a demo.
     */
    private const TENANTS = [
        ['code' => 'DEMO', 'name' => 'Demo Freight Pvt Ltd', 'tier' => 'command',  'domain' => 'demofreight.test', 'scale' => 1.0],
        ['code' => 'TACT', 'name' => 'Tactical Cargo Co',    'tier' => 'tactical', 'domain' => 'tacticalcargo.test', 'scale' => 0.37],
    ];

    private const DESIGNATIONS = ['pricing', 'operations', 'sales', 'accounts', 'boss'];

    /** Real lanes, so the LOCODEs on screen are ones a freight person recognises. */
    private const AIR_LANES = [['INBOM', 'DEFRA'], ['INMAA', 'AEDXB'], ['INBOM', 'USJFK'], ['INDEL', 'GBLHR']];
    private const SEA_LANES = [['INNSA', 'DEHAM'], ['INMAA', 'SGSIN'], ['INMUN', 'NLRTM']];

    public function run(): void
    {
                // Platform reference data, seeded once before any tenant.
        $this->seedAirlines();

        foreach (self::TENANTS as $tenant) {
            $this->purge($tenant['code']);
            $this->seedTenant($tenant);
        }

        $this->seedPlatformStaff();
        $this->syncSequenceCounters();
        $this->summary();
    }

    /**
     * One F16s staff account for the `superadmin.` portal.
     *
     * ⚠️ **NOT a tenant user, and not on the `users` table at all.** Superadmin lives on
     * `super_admins` behind its own JWT guard — that separation is the reason a client's
     * Boss on `admin.` can never reach the platform monitor, however the URL is typed
     * (CONTEXT.md §6b). Seeded here only so the monitor and support desk are walkable.
     */
    private function seedPlatformStaff(): void
    {
        \App\SuperAdmin::updateOrCreate(
            ['email' => 'staff@f16s.test'],
            ['name' => 'F16s Staff', 'password' => Hash::make(self::PASSWORD)]
        );

        // 🔴 The SAME `roles` row mechanism every login uses. `LoginController` builds
        // the guard name as `roles.role . '-api'`, so `superAdmin` here resolves to the
        // `superAdmin-api` guard and the shared /api/login endpoint works for platform
        // staff too. Without this row the account exists and cannot sign in — the
        // credentials are correct and the response is a bare 401.
        DB::table('roles')->updateOrInsert(
            ['email' => 'staff@f16s.test'],
            ['role' => 'superAdmin', 'updated_at' => now(), 'created_at' => now()]
        );
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
            ['jobs', 'execution_job_no'],
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
        // 🔴 Purchase vouchers FIRST. `accounts_purchase_vouchers.job_id` is one of the
        // schema's three ON DELETE RESTRICT keys — a voucher is money owed to a vendor
        // against a shipment, so the database refuses to let a job be deleted out from
        // under one. It caught this purge the moment the cost sheet started creating
        // vouchers, which is the constraint doing exactly its job.
        $voucherIds = DB::table('accounts_purchase_vouchers')->whereIn('agent_id', $branchIds)->pluck('id');
        DB::table('accounts_purchase_items')->whereIn('purchase_voucher_id', $voucherIds)->delete();
        DB::table('accounts_purchase_vouchers')->whereIn('agent_id', $branchIds)->delete();

        DB::table('accounts_invoice_items')->whereIn('invoice_id', $invoiceIds)->delete();
        DB::table('accounts_ledger_entries')->whereIn('agent_id', $branchIds)->delete();
        DB::table('unposted_transactions_queue')->whereIn('agent_id', $branchIds)->delete();
        DB::table('bank_transactions')->whereIn('agent_id', $branchIds)->delete();
        DB::table('accounts_invoices')->whereIn('agent_id', $branchIds)->delete();
        DB::table('accounting_periods')->whereIn('agent_id', $branchIds)->delete();
        DB::table('chart_of_accounts')->whereIn('agent_id', $branchIds)->delete();

        // The air document layer. `way_bill_addresses` and the rest hang off `awb_id`,
        // which is the waybill's own numeric key, so they go first.
        $awbIds = DB::table('air_way_bills')->whereIn('agent_id', $branchIds)->pluck('id');
        DB::table('way_bill_addresses')->whereIn('awb_id', $awbIds)->delete();
        DB::table('air_way_bills')->whereIn('agent_id', $branchIds)->delete();

        DB::table('mailbox_connections')->whereIn('agent_id', $branchIds)->delete();
        $threadKeys = DB::table('email_threads')->whereIn('agent_id', $branchIds)->pluck('thread_key');
        DB::table('email_attachments')->whereIn('email_message_id',
            DB::table('email_messages')->whereIn('thread_key', $threadKeys)->pluck('id'))->delete();
        DB::table('email_messages')->whereIn('thread_key', $threadKeys)->delete();

        // ⚠️ Classification overrides FK to email_threads, so they go FIRST. Added with
        // the learning loop on 2026-09-03, and the purge did not know about them — the
        // next reseed failed with a foreign key violation as soon as anybody had
        // corrected a classification. A new table needs a line here as surely as it needs
        // a migration.
        DB::table('email_classification_overrides')->whereIn('agent_id', $branchIds)->delete();

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


        $this->seedPeriod($branches->first());

        foreach ($branches as $branch) {
            $this->seedLifecycle($branch, $customers, $users, $tenant['scale']);
            $this->seedTrailingHistory($branch, $customers[3], $users, $tenant['scale']);
            $this->seedPartners($company, $branch);
            $this->seedInbox($branch, $customers, $users);
            $this->seedWaybills($branch);
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

    /**
     * Partners belong to a BRANCH, because a GSTIN is a state registration.
     *
     * 🔴 The same broker in Mumbai and Chennai is two rows with two GSTINs — one row per
     * company could only hold one of them, and the purchase voucher raised against it
     * would claim input credit under the wrong registration. The seeder gives each branch
     * its own set with its own state number so that shape is visible in demo data rather
     * than only in the migration comment.
     */
    /**
     * The platform's carrier list — prefix, name, domain. Seeded ONCE, not per tenant.
     *
     * 🔴 `176` is Emirates whoever is looking. Curating it centrally is what lets an
     * operator pick a carrier instead of typing a prefix from memory, and what makes an
     * airline's mail classify the same way for every tenant.
     *
     * ⚠️ Real IATA prefixes, so the demo AWB numbers are ones a freight person recognises.
     */
    private function seedAirlines(): void
    {
        foreach ([
            ['prefix' => '176', 'code' => 'EK', 'name' => 'Emirates SkyCargo',  'domain' => 'ekcargo.test',  'country' => 'AE'],
            ['prefix' => '020', 'code' => 'LH', 'name' => 'Lufthansa Cargo',    'domain' => 'lhcargo.test',  'country' => 'DE'],
            ['prefix' => '098', 'code' => 'AI', 'name' => 'Air India Cargo',    'domain' => 'aicargo.test',  'country' => 'IN'],
            ['prefix' => '618', 'code' => 'SQ', 'name' => 'Singapore Airlines Cargo', 'domain' => 'sqcargo.test', 'country' => 'SG'],
            ['prefix' => '157', 'code' => 'QR', 'name' => 'Qatar Airways Cargo', 'domain' => 'qrcargo.test', 'country' => 'QA'],
        ] as $a) {
            DB::table('airlines')->updateOrInsert(
                ['prefix' => $a['prefix']],
                $a + ['is_active' => 1]
            );
        }
    }

    private function seedPartners(Company $company, Agent $branch): void
    {
        // GSTIN state codes: 27 Maharashtra, 33 Tamil Nadu, 07 Delhi. The prefix is what
        // makes the same vendor two registrations.
        $stateCode = match ($branch->branch_code) {
            'MAA'   => '33',
            'DEL'   => '07',
            default => '27',
        };

        foreach ([
            ['name' => 'Sharma CHA & Co',   'partner_type' => 'customs_broker'],
            ['name' => 'BlueDart Trucking', 'partner_type' => 'transporter'],
            ['name' => 'Konkan Clearing',   'partner_type' => 'customs_broker'],
        ] as $i => $p) {
            $slug = strtolower(explode(' ', $p['name'])[0]);

            Partner::create($p + [
                'company_id' => $company->id,
                'agent_id'   => $branch->id,
                'email' => 'bookings@' . $slug . '.test',
                'phone' => '+91 22 5000 ' . (2000 + $i),
                // The whole reason partners are per branch.
                'gst_no' => $stateCode . 'AAACG' . (1000 + $i) . 'A1Z5',
            ]);
        }

        // ⚠️ NO airlines or shipping lines here any more. A carrier is the same everywhere,
        // so it is platform reference data (`airlines`, curated by F16s) rather than a row
        // each branch of each tenant re-keys — see seedAirlines().
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
    private function seedLifecycle(Agent $branch, $customers, array $users, float $scale = 1.0): void
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

            // Two per mode, so the pool has cards to claim and the Staff matrix still has
            // plenty of assigned work beside it.
            //
            // ⚠️ These stand for a shipment confirmed from a thread NOBODY had claimed —
            // the one way a job legitimately reaches the pool now that the inbox claim
            // survives conversion. Before that fix every confirmed shipment landed here,
            // which is what made the pool look like the normal path rather than the
            // exception it is. The thread seeding below reads its claim back OFF the job,
            // so the two halves cannot disagree the way they used to.
            $unassignedYet = 2;

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
                    'extracted_weight' => round((320.5 + ($i * 47.25)) * $scale, 3),
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
                    // execution_job_no is OUR number (JOBA-…). job_order_no is the
                    // CLIENT's own reference — a different fact, often absent, and
                    // never ours to invent.
                    'execution_job_no' => sprintf('%s-%s-%s-%04d', $jPrefix, $agentCode, now()->format('y'), $seq[$mode]),
                    'customer_id' => $customer->id,
                    // 🔴 THE FIRST CONVERTED JOB OF EACH MODE STAYS UNASSIGNED. Every job
                    // had an operator, so the Kanban's Unassigned Pool was permanently
                    // empty and the claim endpoint had nothing to claim — the pool looked
                    // like a feature that did not work rather than one with no work in it.
                    //
                    // ⚠️ It is also the truthful shape: a job is converted the moment the
                    // client confirms, and sits in the pool until somebody picks it up.
                    'ops_id' => $unassignedYet-- > 0 ? null : $users['operations']->id,
                    'pricing_id' => $users['pricing']->id,
                    // A spread across the board so the Kanban has cards in every column.
                    // ⚠️ An unassigned job is at INTAKE: it cannot be in Verification when
                    // nobody has picked it up to verify anything.
                    'status' => $unassignedYet >= 0 ? 'Intake'
                        : ['Verification', 'PDF Generated', 'Airline Confirmed'][$i % 3],
                    // A spread of clearance dates so the Staff matrix has rows and the
                    // board's SLA bars actually fire: one clearing today (urgency ×3),
                    // one tomorrow (×2), one later (×1). Without dates every card is
                    // "later" and the whole urgency dimension is invisible.
                    'planned_clearance_date' => now()->addDays([0, 1, 5][$i % 3])->toDateString(),
                    'cargo_type' => $mode === 'sea' ? 'fcl' : 'general',
                    // 🔴 UNIQUE PER BRANCH. An AWB number is issued by the AIRLINE, so
                    // `air_way_bills.id` is a global primary key — but this line used to
                    // mint the same `176-1000000{$i}` for every branch of every tenant, and
                    // seeding the document layer then collided on the second branch with a
                    // duplicate-key error. Offsetting by branch is also the truthful shape:
                    // two forwarders never hold the same airway bill.
                    'awb_number' => $mode === 'air'
                        ? '176-' . str_pad((string) (10000000 + ($branch->id * 100) + $i), 8, '0', STR_PAD_LEFT)
                        : null,
                    'created_at' => now()->subDays(max($daysAgo, 1)),
                    'updated_at' => now()->subDays(max($daysAgo, 1)),
                ]);

                $this->seedShipmentDetails($job, $mode, $origin, $dest, $i, $scale);
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
    private function seedTrailingHistory(Agent $branch, Customer $customer, array $users, float $scale = 1.0): void
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
                'extracted_weight' => round((400 + (($i % 9) * 60)) * $scale, 3),
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
                    'execution_job_no' => sprintf('JOBA-%s-%s-%04d', $agentCode, $when->format('y'), $seq),
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
                    'gross_weight' => round((400 + (($i % 9) * 60)) * $scale, 3),
                    'chargeable_weight' => round((420 + (($i % 9) * 60)) * $scale, 3),
                    'created_at' => $when, 'updated_at' => $when,
                ]);
            }

            $day -= 8 + ($i % 4);   // 8–11 days: a real rhythm, not a metronome
            $i++;
        }
    }

    /** Tier 3 data — the authoritative figures billing and manifests read. */
    private function seedShipmentDetails(Job $job, string $mode, string $origin, string $dest, int $i, float $scale = 1.0): void
    {
        $common = [
            'job_id' => $job->id,
            'piece_count' => 6 + $i,
            'gross_weight' => round((320.5 + ($i * 47.25)) * $scale, 3),
            'chargeable_weight' => round((340.0 + ($i * 47.25)) * $scale, 3),
            'volume_cbm' => round((1.8 + ($i * 0.35)) * $scale, 3),
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

        // ── The workspace's Enquiry and Timing tabs are read from THESE rows ────────
        // 🔴 **Every thread used to carry `enquiry_id = NULL`**, so the Enquiry tab was
        // permanently stuck on "Not promoted to an enquiry yet" and there was no way to
        // see it working. And only ONE thread had a `first_response_at`, so Timing was
        // mostly em dashes.
        //
        // The last column promotes a thread to an enquiry of a given status, so the two
        // tabs can be checked against every state that matters:
        //
        //   promote  triaged  replied   what it demonstrates
        //   ───────  ───────  ───────   ────────────────────────────────────────────────
        //   null     no       no        the un-promoted empty state
        //   converted yes     yes       the happy path: looked, answered, became a job
        //   quoted   yes      no        🔴 somebody looked and the CLIENT IS STILL WAITING
        //   lost     yes      no        the same, with the outcome it leads to
        //
        // ⚠️ Those middle two are the whole reason `first_triage_at` and
        // `first_response_at` are separate columns. A time against triaged with a dash
        // against replied is what makes `lost_reason = 'delay_in_response'` provable
        // instead of asserted — and it cannot be seen at all unless the data contains it.
        $threads = [
            ['Quote request — 6 pallets INBOM to DEFRA', 'ops@contoso.test', 'customer_enquiry', 'unread', 0, false, 2, null],
            ['RE: Rates for Chennai–Dubai, 12 cartons', 'shipping@globex.test', 'customer_enquiry', 'triaged', 1, true, 4, 'converted'],
            ['Urgent: pharma shipment next Tuesday', 'exports@northwind.test', 'customer_enquiry', 'triaged', 0, false, 1, 'quoted'],
            ['Flight EK511 rescheduled to 04-Sep', 'cargo@emirates.test', 'airline', 'unread', 0, false, 1, null],
            ['MAWB 176-10000004 — space confirmed', 'bookings@lufthansa.test', 'airline', 'read', 1, false, 3, null],
            ['Bill of entry filed — INBOM/2026/0442', 'filings@sharmacha.test', 'clearance', 'unread', 0, false, 2, null],
            ['Pickup scheduled 02-Sep, 0900 hrs', 'dispatch@bluedart.test', 'trucking_road', 'read', 1, false, 1, null],
            ['Still awaiting your rate — 3 pallets INBOM to SGSIN', 'logistics@globex.test', 'customer_enquiry', 'triaged', 1, false, 2, 'lost'],
        ];

        // One enquiry is used once. Handing two threads the same enquiry would make the
        // Enquiry tab show the same number twice and hide the state it is meant to show.
        $claimed = [];

        $promoteTo = function (?string $status) use ($branch, &$claimed): ?int {
            if ($status === null) {
                return null;
            }

            $query = DB::table('enquiries')
                ->where('agent_id', $branch->id)
                ->where('transport_mode', 'air')
                ->where('status', $status)
                ->whereNotIn('id', $claimed ?: [0]);

            // 🔗 For a CONVERTED enquiry, prefer one whose job already carries an AWB.
            // The whole point of the thread is that enquiry → job → waybill is one chain,
            // and a converted thread whose job has no waybill demonstrates two thirds of
            // it — the extraction panel then opens with an empty number, which reads as
            // the prefill being broken rather than as there being nothing to prefill.
            if ($status === 'converted') {
                $withAwb = (clone $query)
                    ->whereExists(function ($q) {
                        $q->select(DB::raw(1))->from('jobs')
                            ->whereColumn('jobs.enquiry_id', 'enquiries.id')
                            ->whereNotNull('jobs.awb_number');
                    })
                    ->value('id');

                if ($withAwb !== null) {
                    $claimed[] = $withAwb;

                    return $withAwb;
                }
            }

            $id = $query->value('id');

            if ($id !== null) {
                $claimed[] = $id;
            }

            return $id;
        };

        foreach ($threads as $i => [$subject, $from, $classification, $status, $assigned, $replied, $messages, $promote]) {
            $opened = now()->subDays(9 - $i)->subHours(3);
            $key = 'thr_' . $branch->id . '_' . $i . '_' . substr(md5($subject . $branch->id), 0, 8);

            $enquiryId = $promoteTo($promote);

            // 🔴 THE THREAD'S CLAIM AND ITS JOB'S OWNER ARE ONE FACT, so they are read
            // from one place. Threads are seeded AFTER jobs and pick their enquiry
            // independently, so an `$assigned` flag decided up in the fixture table would
            // land a CLAIMED thread on an UNASSIGNED job — the exact state that
            // `EnquiryController::convert()` now makes unreachable, sitting in the demo
            // data as if it were normal. Seeded data that contradicts the code teaches
            // the wrong thing about the product and hides the fix.
            //
            // A job with no owner therefore means what it says: nobody claimed the
            // conversation, and the shipment was confirmed anyway.
            $jobOwner = $enquiryId === null ? null : DB::table('jobs')
                ->where('enquiry_id', $enquiryId)
                ->whereNull('deleted_at')
                ->value('ops_id');

            DB::table('email_threads')->insert([
                'agent_id' => $branch->id,
                // Unassigned rows are the pool — the claim endpoint needs something to
                // claim. For a converted thread the job is the authority; for one that
                // never became a job, the fixture's own flag decides.
                'assigned_ops_id' => $enquiryId !== null
                    ? $jobOwner
                    : ($assigned ? $users['operations']->id : null),
                'thread_key' => $key,
                'provider_thread_id' => 'gmail_' . substr(md5($key), 0, 16),
                'status' => $status,
                'classification' => $classification,
                // The workspace's Enquiry tab reads this. NULL is a real state — most
                // conversations never become an enquiry — so one thread deliberately
                // stays unpromoted.
                'enquiry_id' => $enquiryId,
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
    /**
     * One master air waybill per converted air job — the DOCUMENT half of FocusAir.
     *
     * 🔴 **`air_way_bills` and `house_way_bills` held ZERO rows** until this existed, so the
     * MAWB form, the HAWB form and consolidation all opened onto nothing, and there was no
     * way to see whether the document layer connected to anything. It did not: GAPS #39.
     *
     * ⚠️ **`job_id` is NOT set here.** It is left to `AwbJobLinker`, which the observer
     * fires when the job takes its `awb_number`. Writing it directly would seed a link that
     * looks correct while proving nothing about whether the linking actually works — and
     * that link failing silently is the exact defect this data exists to expose.
     *
     * ⚠️ The primary key is the eleven digits with no separator (`17610000008`); the NUMBER
     * is canonical with the hyphen (`176-10000008`). See `App\Support\AwbNumber`.
     */
    private function seedWaybills(Agent $branch): void
    {
        $jobs = DB::table('jobs')
            ->where('agent_id', $branch->id)
            ->where('transport_mode', 'air')
            ->whereNotNull('awb_number')
            ->get(['id', 'awb_number']);

        foreach ($jobs as $job) {
            $key = AwbNumber::key($job->awb_number);

            if ($key === null) {
                continue;
            }

            $canonical = AwbNumber::normalise($job->awb_number);
            [$code, $serial] = explode('-', $canonical);

            DB::table('air_way_bills')->insert([
                'id' => $key, 'awb_code' => $code, 'awb_no' => $serial,
                'agent_id' => $branch->id, 'status' => 'generate_pdf',
                'consolidated_mawb' => 'false', 'awb' => 'true',
                'departure_airport' => 'BOM', 'destination_airport' => 'DXB',
                'from' => 'BOM', 'to' => 'DXB', 'by' => 'EK', 'flight' => '0511',
                'date' => now()->addDays(3),
                'created_at' => now(), 'updated_at' => now(),
            ]);

            // Addresses that exercise the widened validation (GAPS #44): a slash, an
            // ampersand, parentheses and an umlaut — all of which the old rule refused.
            DB::table('way_bill_addresses')->insert([
                'awb_id' => (string) $key,
                'ship_name' => 'Müller & Co. Exports',
                'ship_address' => 'Plot 42/A, MIDC Andheri East (Gate 3)',
                'ship_city' => 'Mumbai', 'ship_state' => 'Maharashtra',
                'ship_country' => 'IN', 'ship_post_code' => '400093',
                'ship_airport_code' => 'BOM',
                'cons_name' => 'Emirates Trading LLC',
                'cons_address' => 'Warehouse 7, Jebel Ali Free Zone',
                'cons_city' => 'Dubai', 'cons_state' => 'Dubai',
                'cons_country' => 'AE', 'cons_post_code' => '17000',
                'cons_airport_code' => 'DXB',
                'created_at' => now(), 'updated_at' => now(),
            ]);

            // 🔗 The link is MADE, not seeded — through the same path production uses.
            app(AwbJobLinker::class)->link($key);
        }
    }

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
                'description' => 'Freight charges — ' . $job->execution_job_no,
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

        $this->command->line('  Platform staff (superadmin. portal, separate guard): staff@f16s.test');
        $this->command->newLine();
        $this->command->line('  Hosts (macOS maps *.localhost to 127.0.0.1 — no /etc/hosts edit needed):');
        foreach (['focusair', 'focussea', 'accounts', 'admin', 'superadmin'] as $host) {
            $this->command->line("    http://{$host}.localhost:8000");
        }
        $this->command->newLine();
    }
}
