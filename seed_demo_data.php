<?php
// Seed script to populate demo data
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Company;
use App\User;
use App\Agent;
use App\EmailThread;
use App\InboundEmail;
use App\InboundAttachment;
use App\Job;
use App\MailboxConnection;
use App\Role;
use App\SalesTarget;
use App\FinancialSnapshot;
use App\AirShipmentDetail;
use App\SeaShipmentDetail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

// Temporarily disable mass assignment protection
User::unguard();
Agent::unguard();
Company::unguard();
EmailThread::unguard();
InboundEmail::unguard();
InboundAttachment::unguard();
Job::unguard();
MailboxConnection::unguard();
Role::unguard();
SalesTarget::unguard();
FinancialSnapshot::unguard();
AirShipmentDetail::unguard();
SeaShipmentDetail::unguard();
\App\AccountingPeriod::unguard();
\App\AccountsInvoice::unguard();
\App\BankStatement::unguard();
\App\AccountsLedgerEntry::unguard();
\App\ChartOfAccount::unguard();
\App\AirwayBills::unguard();

// Clean up old demo data to avoid constraints or dirty state
\Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
DB::table('inbound_attachments')->delete();
DB::table('inbound_emails')->delete();
DB::table('email_threads')->delete();
DB::table('jobs')->delete();
DB::table('mailbox_connections')->delete();
DB::table('sales_targets')->delete();
DB::table('financial_snapshots')->delete();
DB::table('air_shipment_details')->delete();
DB::table('sea_shipment_details')->delete();
DB::table('bank_statements')->delete();
DB::table('accounts_ledger_entries')->delete();
DB::table('gst_ledger_entries')->delete();
DB::table('chart_of_accounts')->delete();
DB::table('accounting_periods')->delete();
DB::table('accounts_invoices')->delete();
\Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

// Create/Fetch Companies
$coreCompany = Company::updateOrCreate(
    ['name' => 'Core Logix'],
    [
        'tier' => 'viper_core',
    ]
);

$commandCompany = Company::updateOrCreate(
    ['name' => 'Command Logix'],
    [
        'tier' => 'viper_command',
        'email_domain' => 'commandlogix.com',
    ]
);

$tacticalCompany = Company::updateOrCreate(
    ['name' => 'Tactical Logix'],
    [
        'tier' => 'viper_tactical',
        'email_domain' => 'tacticallogix.com',
    ]
);

// Create Agents
$coreAgent = Agent::updateOrCreate(
    ['agent_name' => 'Core HQ'],
    [
        'company_id' => $coreCompany->id,
        'agent_address' => '123 Core Ave',
    ]
);

$tacticalAgent = Agent::updateOrCreate(
    ['agent_name' => 'Tactical HQ'],
    [
        'company_id' => $tacticalCompany->id,
        'agent_address' => '789 Tactical Way',
    ]
);

$commandAgent = Agent::updateOrCreate(
    ['agent_name' => 'Command HQ'],
    [
        'company_id' => $commandCompany->id,
        'agent_address' => '456 Command Center',
    ]
);

$agent = $commandAgent; // Alias for historical seeds

// Create Users & Roles
$usersToCreate = [
    [
        'email' => 'core@f16s.com',
        'name' => 'Core Operator',
        'company' => $coreCompany,
        'agent' => $coreAgent,
        'designation' => 'operations',
    ],
    [
        'email' => 'tactical.ops@f16s.com',
        'name' => 'Tactical Ops',
        'company' => $tacticalCompany,
        'agent' => $tacticalAgent,
        'designation' => 'operations',
    ],
    [
        'email' => 'emma.ops@f16s.com',
        'name' => 'Emma Watson',
        'company' => $tacticalCompany,
        'agent' => $tacticalAgent,
        'designation' => 'operations',
    ],
    [
        'email' => 'liam.ops@f16s.com',
        'name' => 'Liam Neeson',
        'company' => $tacticalCompany,
        'agent' => $tacticalAgent,
        'designation' => 'operations',
    ],
    [
        'email' => 'olivia.ops@f16s.com',
        'name' => 'Olivia Wilde',
        'company' => $tacticalCompany,
        'agent' => $tacticalAgent,
        'designation' => 'operations',
    ],
    [
        'email' => 'tactical.pricing@f16s.com',
        'name' => 'Tactical Pricing',
        'company' => $tacticalCompany,
        'agent' => $tacticalAgent,
        'designation' => 'pricing',
    ],
    [
        'email' => 'tactical.sales@f16s.com',
        'name' => 'Tactical Sales',
        'company' => $tacticalCompany,
        'agent' => $tacticalAgent,
        'designation' => 'sales',
    ],
    [
        'email' => 'tactical.boss@f16s.com',
        'name' => 'Tactical Boss',
        'company' => $tacticalCompany,
        'agent' => $tacticalAgent,
        'designation' => 'boss',
    ],
    [
        'email' => 'command.ops@f16s.com',
        'name' => 'Command Ops',
        'company' => $commandCompany,
        'agent' => $commandAgent,
        'designation' => 'operations',
    ],
    [
        'email' => 'command.pricing@f16s.com',
        'name' => 'Command Pricing',
        'company' => $commandCompany,
        'agent' => $commandAgent,
        'designation' => 'pricing',
    ],
    [
        'email' => 'command.sales@f16s.com',
        'name' => 'Command Sales',
        'company' => $commandCompany,
        'agent' => $commandAgent,
        'designation' => 'sales',
    ],
    [
        'email' => 'command.accounts@f16s.com',
        'name' => 'Command Accounts',
        'company' => $commandCompany,
        'agent' => $commandAgent,
        'designation' => 'accounts',
    ],
    [
        'email' => 'command.boss@f16s.com',
        'name' => 'Command Boss',
        'company' => $commandCompany,
        'agent' => $commandAgent,
        'designation' => 'boss',
    ],
];

$createdUsers = [];
foreach ($usersToCreate as $uInfo) {
    $user = User::updateOrCreate(
        ['email' => $uInfo['email']],
        [
            'name' => $uInfo['name'],
            'password' => Hash::make('password'),
            'company_name' => $uInfo['company']->name,
            'branch_name' => $uInfo['agent']->id,
            'origin_airport_code' => 'BLR',
            'is_active' => true,
            'can_send' => true,
            'designation' => $uInfo['designation'],
        ]
    );

    $role = Role::updateOrCreate(
        ['email' => $uInfo['email']],
        ['role' => 'user']
    );

    $createdUsers[$uInfo['email']] = $user;
}

$commandUser = $createdUsers['command.pricing@f16s.com'];
$secUser = $createdUsers['command.ops@f16s.com'];

// Create Mailbox Connection for Command User
$conn = MailboxConnection::updateOrCreate(
    ['email_address' => 'ops@commandlogix.com'],
    [
        'user_id' => $commandUser->id,
        'provider' => 'gmail',
        'access_token' => 'mock_access_token',
        'refresh_token' => 'mock_refresh_token',
        'expires_at' => Carbon::now()->addHours(24),
        'is_active' => true,
    ]
);

// Create Client Companies (for on-demand summaries dropdown)
$client1 = Company::create([
    'name' => 'Global Shipping Ltd.',
    'tier' => 'viper_core',
]);

$client2 = Company::create([
    'name' => 'AutoParts International',
    'tier' => 'viper_core',
]);

$client3 = Company::create([
    'name' => 'FastLogistics Corp',
    'tier' => 'viper_core',
]);

// -------------------------------------------------------------
// Seed Rich Historical Operational Jobs & Thread Logs (Past 10 Days)
// -------------------------------------------------------------

$now = Carbon::now();

$jobDataList = [
    // --- operator: Command Manager ($commandUser->id) ---
    [
        'transport_mode' => 'air',
        'direction' => 'export',
        'status' => 'Completed',
        'enquiry_no' => 'ENQA-26-5001',
        'execution_job_no' => 'JOBA-26-0001',
        'client_id' => $client1->id,
        'operator_id' => $commandUser->id,
        'created_offset' => 9, // days ago
        'weight' => 1250, // 1.25 tons
        'pol' => 'BLR',
        'pod' => 'FRA',
        'reply_latency' => 8, // minutes to reply
        'lost_reason' => null
    ],
    [
        'transport_mode' => 'air',
        'direction' => 'import',
        'status' => 'Verification',
        'enquiry_no' => 'ENQA-26-5002',
        'execution_job_no' => null,
        'client_id' => $client1->id,
        'operator_id' => $commandUser->id,
        'created_offset' => 6, // days ago
        'weight' => 950, // 0.95 tons
        'pol' => 'MAA',
        'pod' => 'LHR',
        'reply_latency' => 14,
        'lost_reason' => null
    ],
    [
        'transport_mode' => 'sea',
        'direction' => 'export',
        'status' => 'AI Extraction',
        'enquiry_no' => 'ENQA-26-5003',
        'execution_job_no' => null,
        'client_id' => $client2->id,
        'operator_id' => $commandUser->id,
        'created_offset' => 3, // days ago
        'weight' => 14000, // 14 tons
        'pol' => 'MAA',
        'pod' => 'SIN',
        'reply_latency' => 20,
        'lost_reason' => null
    ],
    [
        'transport_mode' => 'sea',
        'direction' => 'import',
        'status' => 'Verification',
        'enquiry_no' => 'ENQA-26-5004',
        'execution_job_no' => 'JOBS-26-1001',
        'client_id' => $client2->id,
        'operator_id' => $commandUser->id,
        'created_offset' => 2, // days ago
        'weight' => 22000, // 22 tons
        'pol' => 'RTM',
        'pod' => 'MAA',
        'reply_latency' => 5,
        'lost_reason' => null
    ],
    [
        'transport_mode' => 'air',
        'direction' => 'export',
        'status' => 'Sent to Airline',
        'enquiry_no' => 'ENQA-26-5005',
        'execution_job_no' => 'JOBA-26-0002',
        'client_id' => $client1->id,
        'operator_id' => $commandUser->id,
        'created_offset' => 1, // days ago
        'weight' => 3500, // 3.5 tons
        'pol' => 'BLR',
        'pod' => 'DXB',
        'reply_latency' => 11,
        'lost_reason' => null
    ],

    // --- operator: Operations Assistant ($secUser->id) ---
    [
        'transport_mode' => 'air',
        'direction' => 'export',
        'status' => 'Completed',
        'enquiry_no' => 'ENQA-26-5006',
        'execution_job_no' => 'JOBA-26-0003',
        'client_id' => $client3->id,
        'operator_id' => $secUser->id,
        'created_offset' => 8, // days ago
        'weight' => 2800, // 2.8 tons
        'pol' => 'BLR',
        'pod' => 'FRA',
        'reply_latency' => 12,
        'lost_reason' => null
    ],
    [
        'transport_mode' => 'sea',
        'direction' => 'export',
        'status' => 'Sent to Airline',
        'enquiry_no' => 'ENQA-26-5007',
        'execution_job_no' => 'JOBS-26-0001',
        'client_id' => $client3->id,
        'operator_id' => $secUser->id,
        'created_offset' => 5, // days ago
        'weight' => 18000, // 18 tons
        'pol' => 'MAA',
        'pod' => 'RTM',
        'reply_latency' => 19,
        'lost_reason' => null
    ],
    [
        'transport_mode' => 'air',
        'direction' => 'import',
        'status' => 'Lost',
        'enquiry_no' => 'ENQA-26-5008',
        'execution_job_no' => null,
        'client_id' => $client1->id,
        'operator_id' => $secUser->id,
        'created_offset' => 7, // days ago
        'weight' => 1500, // 1.5 tons
        'pol' => 'LHR',
        'pod' => 'BLR',
        'reply_latency' => 25,
        'lost_reason' => 'rates_high'
    ],
    [
        'transport_mode' => 'sea',
        'direction' => 'import',
        'status' => 'Lost',
        'enquiry_no' => 'ENQA-26-5009',
        'execution_job_no' => null,
        'client_id' => $client2->id,
        'operator_id' => $secUser->id,
        'created_offset' => 4, // days ago
        'weight' => 9200, // 9.2 tons
        'pol' => 'SIN',
        'pod' => 'MAA',
        'reply_latency' => 30,
        'lost_reason' => 'capacity_issue'
    ],
    [
        'transport_mode' => 'air',
        'direction' => 'export',
        'status' => 'Lost',
        'enquiry_no' => 'ENQA-26-5010',
        'execution_job_no' => null,
        'client_id' => $client3->id,
        'operator_id' => $secUser->id,
        'created_offset' => 3, // days ago
        'weight' => 500, // 0.5 tons
        'pol' => 'BLR',
        'pod' => 'DXB',
        'reply_latency' => 15,
        'lost_reason' => 'other'
    ],
];

foreach ($jobDataList as $index => $item) {
    $createdAt = (clone $now)->subDays($item['created_offset'])->subHours(2)->subMinutes(rand(10, 50));
    
    // 1. Create Job
    $job = Job::create([
        'agent_id' => $agent->id,
        'transport_mode' => $item['transport_mode'],
        'direction' => $item['direction'],
        'enquiry_no' => $item['enquiry_no'],
        'execution_job_no' => $item['execution_job_no'],
        'client_id' => $item['client_id'],
        'operator_id' => $item['operator_id'],
        'status' => $item['status'],
        'lost_reason' => $item['lost_reason'],
        'lost_at' => $item['lost_reason'] ? (clone $createdAt)->addHours(4) : null,
        'created_at' => $createdAt,
        'updated_at' => $createdAt,
    ]);

    // 2. Create Shipment Details
    if ($item['transport_mode'] === 'air') {
        AirShipmentDetail::create([
            'job_id' => $job->id,
            'flight_number' => 'AI-' . rand(100, 999),
            'flight_date' => (clone $createdAt)->addDays(3),
            'carrier_name' => 'Air India',
            'pol_code' => $item['pol'],
            'pod_code' => $item['pod'],
            'piece_count' => rand(10, 50),
            'gross_weight' => $item['weight'],
            'chargeable_weight' => $item['weight'] + 50,
            'volume_cbm' => round($item['weight'] / 167, 2),
        ]);
    } else {
        SeaShipmentDetail::create([
            'job_id' => $job->id,
            'consol_type' => 'direct',
            'cargo_type' => 'General',
            'delivery_mode' => 'lcl',
            'vessel_name' => 'MAERSK LINE',
            'voyage_no' => 'VY-' . rand(100, 999),
            'pol_code' => $item['pol'],
            'pod_code' => $item['pod'],
            'piece_count' => rand(1, 5),
            'gross_weight' => $item['weight'],
            'net_weight' => $item['weight'] - 200,
            'volume_cbm' => round($item['weight'] / 350, 2),
            'vessel_etd' => (clone $createdAt)->addDays(5),
        ]);
    }

    // 3. Create Associated Email Thread
    $threadKey = 'historical_t' . ($index + 1);
    $thread = EmailThread::create([
        'agent_id' => $agent->id,
        'job_id' => $job->id,
        'thread_key' => $threadKey,
        'subject' => "Inquiry regarding payload shipment " . $item['enquiry_no'],
        'latest_message_received_at' => $createdAt,
        'participant_emails' => ['shipper@client.com', 'ops@commandlogix.com'],
        'status' => 'replied',
        'assigned_operator_id' => $item['operator_id'],
        'first_reply_at' => (clone $createdAt)->addMinutes($item['reply_latency']),
        'created_at' => $createdAt,
        'updated_at' => $createdAt,
    ]);

    // 4. Create Inbound Email (Simulating customer message)
    InboundEmail::create([
        'agent_id' => $agent->id,
        'mailbox_connection_id' => $conn->id,
        'message_id' => 'msg_hist_' . ($index + 1) . '_1',
        'thread_key' => $threadKey,
        'from' => 'shipper@client.com',
        'to' => 'ops@commandlogix.com',
        'subject' => "Inquiry regarding payload shipment " . $item['enquiry_no'],
        'body_text' => "Dear Team,\n\nWe need to book space for a shipment.\nWeight: " . $item['weight'] . " Kgs\nRoute: " . $item['pol'] . " -> " . $item['pod'] . "\n\nPlease share rates.",
        'received_at' => $createdAt,
        'created_at' => $createdAt,
        'updated_at' => $createdAt,
    ]);

    // 5. Create Outbound Email (Simulating quick reply)
    InboundEmail::create([
        'agent_id' => $agent->id,
        'mailbox_connection_id' => $conn->id,
        'message_id' => 'msg_hist_' . ($index + 1) . '_2',
        'thread_key' => $threadKey,
        'from' => 'ops@commandlogix.com',
        'to' => 'shipper@client.com',
        'subject' => "Re: Inquiry regarding payload shipment " . $item['enquiry_no'],
        'body_text' => "Hello, thank you for the inquiry. Here are our rates...",
        'received_at' => (clone $createdAt)->addMinutes($item['reply_latency']),
        'created_at' => (clone $createdAt)->addMinutes($item['reply_latency']),
        'updated_at' => (clone $createdAt)->addMinutes($item['reply_latency']),
    ]);
}

// -------------------------------------------------------------
// Seed Unreplied Threads to Simulate Current SLA Warning & Breaches
// -------------------------------------------------------------

// Active Thread 1: Warning SLA (received 11 minutes ago, no reply)
$tActive1 = EmailThread::create([
    'agent_id' => $agent->id,
    'thread_key' => 'active_t1',
    'subject' => 'URGENT: Space needed BLR-LHR Tuesday',
    'latest_message_received_at' => Carbon::now()->subMinutes(11),
    'participant_emails' => ['shipper@client.com', 'ops@commandlogix.com'],
    'status' => 'unread',
    'created_at' => Carbon::now()->subMinutes(11),
]);
InboundEmail::create([
    'agent_id' => $agent->id,
    'mailbox_connection_id' => $conn->id,
    'message_id' => 'msg_active1_1',
    'thread_key' => 'active_t1',
    'from' => 'shipper@client.com',
    'to' => 'ops@commandlogix.com',
    'subject' => 'URGENT: Space needed BLR-LHR Tuesday',
    'body_text' => "Please verify booking for BLR-LHR.",
    'received_at' => Carbon::now()->subMinutes(11),
]);

// Active Thread 2: Breached SLA (received 22 minutes ago, no reply)
$jobBreached = Job::create([
    'agent_id' => $agent->id,
    'transport_mode' => 'air',
    'direction' => 'import',
    'enquiry_no' => 'ENQA-26-9001',
    'client_id' => $client1->id,
    'operator_id' => $commandUser->id,
    'status' => 'AI Extraction',
    'created_at' => Carbon::now()->subMinutes(22),
]);
$tActive2 = EmailThread::create([
    'agent_id' => $agent->id,
    'job_id' => $jobBreached->id,
    'thread_key' => 'active_t2',
    'subject' => 'Customs delay for AWB-901828',
    'latest_message_received_at' => Carbon::now()->subMinutes(22),
    'participant_emails' => ['shipper@client.com', 'ops@commandlogix.com'],
    'status' => 'unread',
    'created_at' => Carbon::now()->subMinutes(22),
]);
InboundEmail::create([
    'agent_id' => $agent->id,
    'mailbox_connection_id' => $conn->id,
    'message_id' => 'msg_active2_1',
    'thread_key' => 'active_t2',
    'from' => 'shipper@client.com',
    'to' => 'ops@commandlogix.com',
    'subject' => 'Customs delay for AWB-901828',
    'body_text' => "Our cargo is stuck. Please check.",
    'received_at' => Carbon::now()->subMinutes(22),
]);

// -------------------------------------------------------------
// Seed Sales Targets (Revenue & Tonnage)
// -------------------------------------------------------------
SalesTarget::create([
    'target_type' => 'branch',
    'target_id' => $agent->id,
    'quarter' => '2026-Q2',
    'revenue_target' => 500000.00,
    'tonnage_target' => 1200.00,
]);

SalesTarget::create([
    'target_type' => 'user',
    'target_id' => $commandUser->id,
    'quarter' => '2026-Q2',
    'revenue_target' => 150000.00,
    'tonnage_target' => 300.00,
]);

SalesTarget::create([
    'target_type' => 'user',
    'target_id' => $secUser->id,
    'quarter' => '2026-Q2',
    'revenue_target' => 100000.00,
    'tonnage_target' => 200.00,
]);

// -------------------------------------------------------------
// Seed Financial Snapshot (Not Stale)
// -------------------------------------------------------------
FinancialSnapshot::create([
    'agent_id' => $agent->id,
    'snapshot_date' => Carbon::now(),
    'accounting_period_id' => null,
    'total_receivables' => 125000.00,
    'total_payables' => 78000.00,
    'net_cash_flow' => 47000.00,
    'cash_on_hand' => 285000.00,
    'unbilled_revenue' => 18500.00,
    'accrued_expenses' => 9500.00,
    'last_computed_at' => Carbon::now()->subMinutes(15), // active/fresh
]);

// -------------------------------------------------------------
// Seed Open Accounting Period & Invoices for Reconciliation
// -------------------------------------------------------------
$period = \App\AccountingPeriod::create([
    'agent_id' => $agent->id,
    'start_date' => '2026-06-01',
    'end_date' => '2026-06-30',
    'status' => 'open',
]);

// Fetch jobs created above to link them
$job1 = Job::where('execution_job_no', 'JOBA-26-0001')->first();
if ($job1) {
    \App\AccountsInvoice::create([
        'agent_id' => $agent->id,
        'type' => 'invoice',
        'invoice_no' => 'INV-2026-0001',
        'document_date' => '2026-06-15',
        'job_id' => $job1->id,
        'client_id' => $client1->id,
        'currency' => 'INR',
        'exchange_rate' => 1.00,
        'subtotal' => 1400.00,
        'tax_amount' => 252.00,
        'grand_total' => 1652.00,
        'status' => 'finalized',
        'is_posted' => true,
        'due_date' => '2026-07-15',
        'created_by' => $commandUser->id,
    ]);
}

$job2 = Job::where('execution_job_no', 'JOBA-26-0002')->first();
if ($job2) {
    // Create matched airway bills for Level 1 matching
    \App\AirwayBills::create([
        'awb_code' => '123',
        'awb_no' => '45678901',
        'job_id' => $job2->id,
        'agent_id' => $agent->id,
    ]);

    \App\AccountsInvoice::create([
        'agent_id' => $agent->id,
        'type' => 'invoice',
        'invoice_no' => 'INV-2026-0002',
        'document_date' => '2026-06-15',
        'job_id' => $job2->id,
        'client_id' => $client1->id,
        'currency' => 'INR',
        'exchange_rate' => 1.00,
        'subtotal' => 10000.00,
        'tax_amount' => 2500.00,
        'grand_total' => 12500.00,
        'status' => 'finalized',
        'is_posted' => true,
        'due_date' => '2026-07-15',
        'created_by' => $commandUser->id,
    ]);
}

$job3 = Job::where('enquiry_no', 'ENQA-26-5003')->first();
if ($job3) {
    \App\AccountsInvoice::create([
        'agent_id' => $agent->id,
        'type' => 'invoice',
        'invoice_no' => 'INV-2026-0003',
        'document_date' => '2026-06-15',
        'job_id' => $job3->id,
        'client_id' => $client2->id,
        'currency' => 'INR',
        'exchange_rate' => 1.00,
        'subtotal' => 3000.00,
        'tax_amount' => 200.00,
        'grand_total' => 3200.00,
        'status' => 'finalized',
        'is_posted' => true,
        'due_date' => '2026-07-15',
        'created_by' => $commandUser->id,
    ]);
}

// Seed Initial Unreconciled Bank Statements for immediate UI display
\App\BankStatement::create([
    'agent_id' => $agent->id,
    'plaid_transaction_id' => 'tx_seeder_1',
    'booking_date' => '2026-06-15',
    'value_date' => '2026-06-15',
    'amount' => 1652.00,
    'sender_reference' => 'WIRE IN: Job #JOBA-26-0001 Clearances',
    'status' => 'unreconciled',
]);

\App\BankStatement::create([
    'agent_id' => $agent->id,
    'plaid_transaction_id' => 'tx_seeder_2',
    'booking_date' => '2026-06-16',
    'value_date' => '2026-06-16',
    'amount' => 12500.00,
    'sender_reference' => 'FT RECEIPT: HAWB Ref 123-45678901 payment',
    'status' => 'unreconciled',
]);

\App\BankStatement::create([
    'agent_id' => $agent->id,
    'plaid_transaction_id' => 'tx_seeder_3',
    'booking_date' => '2026-06-17',
    'value_date' => '2026-06-17',
    'amount' => 3200.00,
    'sender_reference' => 'PAYMENT FROM: AutoParts International INC',
    'status' => 'unreconciled',
]);

\App\BankStatement::create([
    'agent_id' => $agent->id,
    'plaid_transaction_id' => 'tx_seeder_4',
    'booking_date' => '2026-06-18',
    'value_date' => '2026-06-18',
    'amount' => 540.00,
    'sender_reference' => 'WIRE IN: Unknown Client - Payment Ref 9999',
    'status' => 'unreconciled',
]);

// -------------------------------------------------------------
// Seed Demo Data for Tactical HQ (Focus Air Operators & Jobs)
// -------------------------------------------------------------

// Create Mailbox Connection for Tactical Ops (so we can associate inbound messages/threads)
$tacticalConn = MailboxConnection::updateOrCreate(
    ['email_address' => 'ops@tacticallogix.com'],
    [
        'user_id' => $createdUsers['tactical.ops@f16s.com']->id,
        'provider' => 'gmail',
        'access_token' => 'mock_access_token_tactical',
        'refresh_token' => 'mock_refresh_token_tactical',
        'expires_at' => Carbon::now()->addHours(24),
        'is_active' => true,
    ]
);

$tacticalJobsToSeed = [
    [
        'transport_mode' => 'air',
        'direction' => 'export',
        'status' => 'Verification',
        'enquiry_no' => 'ENQA-26-8001',
        'execution_job_no' => null,
        'client_id' => $client1->id,
        'operator_id' => $createdUsers['tactical.ops@f16s.com']->id,
        'created_offset' => 2,
        'weight' => 1200,
        'pol' => 'BLR',
        'pod' => 'LHR',
        'flight_date_offset' => 2,
    ],
    [
        'transport_mode' => 'air',
        'direction' => 'import',
        'status' => 'AI Extraction',
        'enquiry_no' => 'ENQA-26-8002',
        'execution_job_no' => null,
        'client_id' => $client2->id,
        'operator_id' => $createdUsers['tactical.ops@f16s.com']->id,
        'created_offset' => 1,
        'weight' => 600,
        'pol' => 'SIN',
        'pod' => 'BLR',
        'flight_date_offset' => 1,
    ],
    [
        'transport_mode' => 'air',
        'direction' => 'export',
        'status' => 'Verification',
        'enquiry_no' => 'ENQA-26-8003',
        'execution_job_no' => 'JOBA-26-8001',
        'client_id' => $client3->id,
        'operator_id' => $createdUsers['emma.ops@f16s.com']->id,
        'created_offset' => 3,
        'weight' => 1500,
        'pol' => 'BLR',
        'pod' => 'FRA',
        'flight_date_offset' => 3,
    ],
    [
        'transport_mode' => 'air',
        'direction' => 'import',
        'status' => 'Sent to Airline',
        'enquiry_no' => 'ENQA-26-8004',
        'execution_job_no' => 'JOBA-26-8002',
        'client_id' => $client1->id,
        'operator_id' => $createdUsers['liam.ops@f16s.com']->id,
        'created_offset' => 4,
        'weight' => 850,
        'pol' => 'DXB',
        'pod' => 'BLR',
        'flight_date_offset' => -1, // Overdue
    ],
    [
        'transport_mode' => 'air',
        'direction' => 'export',
        'status' => 'Completed',
        'enquiry_no' => 'ENQA-26-8005',
        'execution_job_no' => 'JOBA-26-8003',
        'client_id' => $client2->id,
        'operator_id' => $createdUsers['olivia.ops@f16s.com']->id,
        'created_offset' => 5,
        'weight' => 2200,
        'pol' => 'BLR',
        'pod' => 'SIN',
        'flight_date_offset' => -3,
    ],
    // Unassigned Jobs (for pricing to assign!)
    [
        'transport_mode' => 'air',
        'direction' => 'export',
        'status' => 'Intake',
        'enquiry_no' => 'ENQA-26-8006',
        'execution_job_no' => null,
        'client_id' => $client3->id,
        'operator_id' => null,
        'created_offset' => 1,
        'weight' => 350,
        'pol' => 'BLR',
        'pod' => 'HKG',
        'flight_date_offset' => 4,
    ],
    [
        'transport_mode' => 'air',
        'direction' => 'import',
        'status' => 'Intake',
        'enquiry_no' => 'ENQA-26-8007',
        'execution_job_no' => null,
        'client_id' => $client1->id,
        'operator_id' => null,
        'created_offset' => 2,
        'weight' => 1800,
        'pol' => 'FRA',
        'pod' => 'BLR',
        'flight_date_offset' => 1,
    ],
];

foreach ($tacticalJobsToSeed as $index => $item) {
    $createdAt = (clone $now)->subDays($item['created_offset'])->subHours(2)->subMinutes(rand(10, 50));
    
    $job = Job::create([
        'agent_id' => $tacticalAgent->id,
        'transport_mode' => $item['transport_mode'],
        'direction' => $item['direction'],
        'enquiry_no' => $item['enquiry_no'],
        'execution_job_no' => $item['execution_job_no'],
        'client_id' => $item['client_id'],
        'operator_id' => $item['operator_id'],
        'status' => $item['status'],
        'created_at' => $createdAt,
        'updated_at' => $createdAt,
    ]);

    AirShipmentDetail::create([
        'job_id' => $job->id,
        'flight_number' => 'AI-' . rand(100, 999),
        'flight_date' => (clone $createdAt)->addDays($item['flight_date_offset']),
        'carrier_name' => 'Air India',
        'pol_code' => $item['pol'],
        'pod_code' => $item['pod'],
        'piece_count' => rand(10, 50),
        'gross_weight' => $item['weight'],
        'chargeable_weight' => $item['weight'] + 50,
        'volume_cbm' => round($item['weight'] / 167, 2),
    ]);

    // Create Associated Email Thread for Tactical Logix
    $threadKey = 'tactical_t' . ($index + 1);
    $thread = EmailThread::create([
        'agent_id' => $tacticalAgent->id,
        'job_id' => $job->id,
        'thread_key' => $threadKey,
        'subject' => "Tactical Inquiry: " . $item['enquiry_no'] . " route " . $item['pol'] . "-" . $item['pod'],
        'latest_message_received_at' => $createdAt,
        'participant_emails' => ['shipper@client.com', 'ops@tacticallogix.com'],
        'status' => 'replied',
        'assigned_operator_id' => $item['operator_id'],
        'first_reply_at' => (clone $createdAt)->addMinutes(10),
        'created_at' => $createdAt,
        'updated_at' => $createdAt,
    ]);

    InboundEmail::create([
        'agent_id' => $tacticalAgent->id,
        'mailbox_connection_id' => $tacticalConn->id,
        'message_id' => 'msg_tac_' . ($index + 1) . '_1',
        'thread_key' => $threadKey,
        'from' => 'shipper@client.com',
        'to' => 'ops@tacticallogix.com',
        'subject' => "Tactical Inquiry: " . $item['enquiry_no'],
        'body_text' => "We need transport for " . $item['weight'] . " Kgs from " . $item['pol'] . " to " . $item['pod'],
        'received_at' => $createdAt,
        'created_at' => $createdAt,
        'updated_at' => $createdAt,
    ]);
}

echo "Demo workspace successfully seeded with rich historical data and Segment B financial testbeds!\n";
