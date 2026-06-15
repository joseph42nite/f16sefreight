<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\EmailThread;
use App\InboundEmail;
use App\Job;
use App\User;
use App\Services\MailboxReplyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class EmailInboxController extends Controller
{
    /**
     * Retrieve folder counts for the inbox navigation.
     * GET /api/user/inbox/folders
     */
    public function getFolders(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $agentId = $user->branch_name;

        // Base query for tenant-isolated email threads
        $baseQuery = EmailThread::where('agent_id', $agentId);

        // Inbox: status is not archived
        $inboxCount = (clone $baseQuery)->where('status', '!=', 'archived')->count();

        // Assigned: active and has operator
        $assignedCount = (clone $baseQuery)->where('status', '!=', 'archived')
            ->whereNotNull('assigned_operator_id')
            ->count();

        // Unassigned: active and has no operator
        $unassignedCount = (clone $baseQuery)->where('status', '!=', 'archived')
            ->whereNull('assigned_operator_id')
            ->count();

        // Processing: active and linked to an active job (not Completed/Lost)
        $processingCount = (clone $baseQuery)->where('status', '!=', 'archived')
            ->whereHas('job', function ($q) {
                $q->whereNotIn('status', ['Completed', 'Lost']);
            })
            ->count();

        // Awaiting Client: status is 'replied'
        $awaitingClientCount = (clone $baseQuery)->where('status', 'replied')->count();

        // Completed: linked to a job that has Completed status
        $completedCount = (clone $baseQuery)
            ->whereHas('job', function ($q) {
                $q->where('status', 'Completed');
            })
            ->count();

        return response()->json([
            'inbox' => $inboxCount,
            'assigned' => $assignedCount,
            'unassigned' => $unassignedCount,
            'processing' => $processingCount,
            'awaiting_client' => $awaitingClientCount,
            'completed' => $completedCount,
        ], 200);
    }

    /**
     * Retrieve a list of threads for a selected folder.
     * GET /api/user/inbox/threads
     */
    public function getThreads(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $agentId = $user->branch_name;
        $folder = $request->query('folder', 'inbox');

        $query = EmailThread::with(['assignedOperator', 'job'])
            ->where('agent_id', $agentId);

        // Apply folder filter
        switch (strtolower($folder)) {
            case 'assigned':
                $query->where('status', '!=', 'archived')
                    ->whereNotNull('assigned_operator_id');
                break;
            case 'unassigned':
                $query->where('status', '!=', 'archived')
                    ->whereNull('assigned_operator_id');
                break;
            case 'processing':
                $query->where('status', '!=', 'archived')
                    ->whereHas('job', function ($q) {
                        $q->whereNotIn('status', ['Completed', 'Lost']);
                    });
                break;
            case 'awaiting_client':
                $query->where('status', 'replied');
                break;
            case 'completed':
                $query->whereHas('job', function ($q) {
                    $q->where('status', 'Completed');
                });
                break;
            case 'inbox':
            default:
                $query->where('status', '!=', 'archived');
                break;
        }

        $threads = $query->orderBy('latest_message_received_at', 'desc')->get();

        // Map and compute SLA timers
        $now = Carbon::now();
        $formattedThreads = $threads->map(function ($thread) use ($now) {
            $slaStatus = 'inactive';
            $slaRemainingSeconds = null;

            // Check if SLA is active
            $isJobFinished = $thread->job && in_array($thread->job->status, ['Completed', 'Lost']);
            $isThreadArchivedOrReplied = in_array($thread->status, ['replied', 'archived']);

            if (!$isJobFinished && !$isThreadArchivedOrReplied) {
                // SLA Limit: latest_message_received_at + 15 minutes
                $latestReceived = Carbon::parse($thread->latest_message_received_at);
                $slaLimit = $latestReceived->copy()->addMinutes(15);
                $slaRemainingSeconds = $now->diffInSeconds($slaLimit, false);

                if ($slaRemainingSeconds > 300) {
                    $slaStatus = 'normal';
                } elseif ($slaRemainingSeconds > 0) {
                    $slaStatus = 'warning';
                } else {
                    $slaStatus = 'breached';
                }
            }

            // Get the last message preview
            $latestEmail = InboundEmail::where('thread_key', $thread->thread_key)
                ->orderBy('received_at', 'desc')
                ->first();

            return [
                'id' => $thread->id,
                'thread_key' => $thread->thread_key,
                'subject' => $thread->subject,
                'latest_message_received_at' => $thread->latest_message_received_at->toIso8601String(),
                'status' => $thread->status,
                'assigned_operator' => $thread->assignedOperator ? [
                    'id' => $thread->assignedOperator->id,
                    'name' => $thread->assignedOperator->name,
                ] : null,
                'job' => $thread->job ? [
                    'id' => $thread->job->id,
                    'status' => $thread->job->status,
                    'enquiry_no' => $thread->job->enquiry_no,
                ] : null,
                'sla_status' => $slaStatus,
                'sla_remaining_seconds' => $slaRemainingSeconds,
                'snippet' => $latestEmail ? mb_substr(strip_tags($latestEmail->body_text ?: $latestEmail->body_html ?: ''), 0, 100) : '',
                'sender' => $latestEmail ? $latestEmail->from : '',
            ];
        });

        return response()->json($formattedThreads, 200);
    }

    /**
     * Retrieve detailed conversation timeline for a single thread.
     * GET /api/user/inbox/threads/{thread_key}
     */
    public function getThreadDetails(Request $request, $threadKey)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $agentId = $user->branch_name;

        $thread = EmailThread::with(['assignedOperator', 'job'])
            ->where('thread_key', $threadKey)
            ->where('agent_id', $agentId)
            ->firstOrFail();

        // Automatically mark thread as read if currently unread
        if ($thread->status === 'unread') {
            $thread->update(['status' => 'read']);
        }

        $emails = InboundEmail::with('attachments')
            ->where('thread_key', $threadKey)
            ->orderBy('received_at', 'asc')
            ->get();

        return response()->json([
            'thread' => [
                'id' => $thread->id,
                'thread_key' => $thread->thread_key,
                'subject' => $thread->subject,
                'status' => $thread->status,
                'assigned_operator' => $thread->assignedOperator,
                'job' => $thread->job,
            ],
            'emails' => $emails->map(function ($email) {
                return [
                    'id' => $email->id,
                    'from' => $email->from,
                    'to' => $email->to,
                    'subject' => $email->subject,
                    'body_text' => $email->body_text,
                    'body_html' => $email->body_html,
                    'received_at' => $email->received_at->toIso8601String(),
                    'attachments' => $email->attachments->map(function ($att) {
                        return [
                            'id' => $att->id,
                            'filename' => $att->filename,
                            'file_path' => $att->file_path,
                            'mime_type' => $att->mime_type,
                        ];
                    }),
                ];
            }),
        ], 200);
    }

    /**
     * Assign a thread to an operator.
     * POST /api/user/inbox/threads/{thread_key}/assign
     */
    public function assignOperator(Request $request, $threadKey)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $agentId = $user->branch_name;

        $request->validate([
            'assigned_operator_id' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        $thread = EmailThread::where('thread_key', $threadKey)
            ->where('agent_id', $agentId)
            ->firstOrFail();

        $operatorId = $request->input('assigned_operator_id');

        $thread->update([
            'assigned_operator_id' => $operatorId,
        ]);

        // Keep associated Job operator in sync if a job is linked
        if ($thread->job_id) {
            $job = Job::find($thread->job_id);
            if ($job) {
                $job->update([
                    'operator_id' => $operatorId,
                ]);
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Operator successfully assigned to thread.',
            'assigned_operator_id' => $operatorId,
        ], 200);
    }

    /**
     * Retrieve list of operators in the same branch.
     * GET /api/user/inbox/operators
     */
    public function getOperators(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $agentId = $user->branch_name;
        $operators = User::where('branch_name', $agentId)->select('id', 'name', 'email')->get();

        return response()->json($operators, 200);
    }

    /**
     * Send a reply to an email thread via the originating mailbox connection.
     *
     * POST /api/user/inbox/threads/{thread_key}/reply
     *
     * The reply is dispatched through the exact same OAuth-connected mailbox
     * (Gmail or Outlook) that originally received the thread, so the customer
     * receives the message from the operator's real business email address.
     */
    public function sendReply(Request $request, $threadKey)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $request->validate([
            'body' => ['required', 'string', 'min:1'],
        ]);

        $agentId = $user->branch_name;

        // Load thread scoped to the user's branch
        $thread = EmailThread::with('mailboxConnection')
            ->where('thread_key', $threadKey)
            ->where('agent_id', $agentId)
            ->first();

        if (!$thread) {
            return response()->json(['error' => 'Thread not found.'], 404);
        }

        $this->authorize('reply', $thread);

        // Ensure the thread has a linked mailbox connection to send from
        if (!$thread->mailboxConnection) {
            return response()->json([
                'error' => 'No mailbox connection linked to this thread. Cannot send reply.',
            ], 422);
        }

        // Get the last inbound email in the thread (provides the "To" address for the reply)
        $lastEmail = InboundEmail::where('thread_key', $threadKey)
            ->orderBy('received_at', 'desc')
            ->first();

        if (!$lastEmail) {
            return response()->json(['error' => 'No messages found in this thread.'], 422);
        }

        try {
            $replyService = app(MailboxReplyService::class);
            $outbound = $replyService->sendReply(
                $thread->mailboxConnection,
                $thread,
                $lastEmail,
                $request->input('body')
            );

            return response()->json([
                'status'  => true,
                'message' => 'Reply sent successfully.',
                'email'   => [
                    'id'          => $outbound->id,
                    'from'        => $outbound->from,
                    'to'          => $outbound->to,
                    'subject'     => $outbound->subject,
                    'body_text'   => $outbound->body_text,
                    'body_html'   => null,
                    'received_at' => $outbound->received_at->toIso8601String(),
                    'attachments' => [],
                ],
            ], 200);
        } catch (\RuntimeException $e) {
            return response()->json([
                'error' => 'Failed to send reply: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Triage a thread as a Job/Enquiry, Airline mail, Escalation, or Clearance.
     * POST /api/user/inbox/threads/{thread_key}/triage
     */
    public function triageThread(Request $request, $threadKey)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $request->validate([
            'classification' => ['required', 'string', 'in:job,airline,escalation,clearance'],
            'existing_job_id' => ['nullable', 'integer', 'exists:jobs,id'],
        ]);

        $agentId = $user->branch_name;

        $thread = EmailThread::where('thread_key', $threadKey)
            ->where('agent_id', $agentId)
            ->firstOrFail();

        $classification = $request->input('classification');
        $existingJobId = $request->input('existing_job_id');

        if (!$thread->first_triage_at) {
            $thread->first_triage_at = Carbon::now();
        }

        if ($classification === 'job') {
            if ($existingJobId) {
                $thread->job_id = $existingJobId;
                $thread->save();
            } else {
                // Determine active transport mode based on thread subject or default to 'air'
                $subject = strtolower($thread->subject ?: '');
                $transportMode = 'air';
                if (str_contains($subject, 'sea') || str_contains($subject, 'ocean') || str_contains($subject, 'vessel') || str_contains($subject, 'container')) {
                    $transportMode = 'sea';
                }

                $sequenceService = app(\App\Services\EnquirySequenceService::class);
                $enquiryNo = $sequenceService->nextEnquiryNumber($agentId, $transportMode);

                $job = Job::create([
                    'agent_id' => $agentId,
                    'transport_mode' => $transportMode,
                    'direction' => 'export',
                    'enquiry_no' => $enquiryNo,
                    'status' => 'Intake',
                ]);

                $thread->job_id = $job->id;
                $thread->save();
            }
        } elseif ($classification === 'airline') {
            $thread->status = 'archived';
            $thread->save();
        }

        // Return updated thread details
        return response()->json([
            'status' => true,
            'message' => 'Thread successfully triaged.',
            'thread' => [
                'id' => $thread->id,
                'thread_key' => $thread->thread_key,
                'subject' => $thread->subject,
                'status' => $thread->status,
                'assigned_operator' => $thread->assignedOperator,
                'job' => $thread->job ? [
                    'id' => $thread->job->id,
                    'status' => $thread->job->status,
                    'enquiry_no' => $thread->job->enquiry_no,
                ] : null,
            ]
        ], 200);
    }

    /**
     * Confirm a shipment (Execution stage): allocate AWB/MBL, assign operator & planned clearance date.
     * POST /api/user/inbox/threads/{thread_key}/confirm
     */
    public function confirmShipment(Request $request, $threadKey)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        // Gating: Restrict to Pricing Staff only (Operations staff see empty confirm panels / buttons hidden)
        if ($user->designation !== 'pricing') {
            return response()->json(['error' => 'Forbidden. Only pricing staff can confirm shipments.'], 403);
        }

        $request->validate([
            'awb_number' => ['required', 'string', 'min:3'],
            'operator_id' => ['required', 'integer', 'exists:users,id'],
            'planned_clearance_date' => ['required', 'date'],
        ]);

        $agentId = $user->branch_name;

        $thread = EmailThread::with('job')
            ->where('thread_key', $threadKey)
            ->where('agent_id', $agentId)
            ->firstOrFail();

        if (!$thread->job) {
            return response()->json(['error' => 'No operational Job linked to this thread yet.'], 422);
        }

        $job = $thread->job;
        $operatorId = $request->input('operator_id');
        $awbNumber = $request->input('awb_number');
        $plannedClearanceDate = Carbon::parse($request->input('planned_clearance_date'));

        $sequenceService = app(\App\Services\EnquirySequenceService::class);
        $executionJobNo = $sequenceService->nextExecutionJobNumber($agentId, $job->transport_mode);

        // Update Job fields
        $job->update([
            'execution_job_no' => $executionJobNo,
            'operator_id' => $operatorId,
            'status' => 'AI Extraction', // Transition to processing stage
        ]);

        // Keep thread assigned operator in sync
        $thread->update([
            'assigned_operator_id' => $operatorId,
        ]);

        // Create or update draft waybill and shipment details based on transport mode
        if ($job->transport_mode === 'air') {
            // AirShipmentDetail
            \App\AirShipmentDetail::updateOrCreate(
                ['job_id' => $job->id],
                [
                    'flight_date' => $plannedClearanceDate,
                ]
            );

            // Parse awb_number
            $cleanAwb = preg_replace('/[^0-9]/', '', $awbNumber);
            $awbCode = null;
            $awbNo = $cleanAwb;
            if (strlen($cleanAwb) >= 11) {
                $awbCode = substr($cleanAwb, 0, 3);
                $awbNo = substr($cleanAwb, 3, 8);
            }

            $awbId = $awbCode . $awbNo;

            // Find or instantiate AirwayBills
            $waybill = \App\AirwayBills::find($awbId);
            if (!$waybill) {
                $waybill = new \App\AirwayBills();
                $waybill->id = $awbId;
            }
            $waybill->awb_code = $awbCode;
            $waybill->awb_no = $awbNo;
            $waybill->job_id = $job->id;
            $waybill->agent_id = $agentId;
            $waybill->save();
        } else {
            // SeaShipmentDetail
            \App\SeaShipmentDetail::updateOrCreate(
                ['job_id' => $job->id],
                [
                    'vessel_etd' => $plannedClearanceDate,
                ]
            );

            // Find or instantiate HousewayBills
            $hwbId = uniqid('hwb_');
            $waybill = new \App\HousewayBills();
            $waybill->id = $hwbId;
            $waybill->uuid = (string) \Illuminate\Support\Str::uuid();
            $waybill->awb_no = intval(preg_replace('/[^0-9]/', '', $awbNumber)) ?: null;
            $waybill->reference_id = $awbNumber;
            $waybill->job_id = $job->id;
            $waybill->agent_id = $agentId;
            $waybill->save();
        }

        return response()->json([
            'status' => true,
            'message' => 'Shipment successfully confirmed and task assigned.',
            'job' => $job,
        ], 200);
    }

    /**
     * Mark an operational job as Lost.
     * POST /api/user/inbox/threads/{thread_key}/lost
     */
    public function markLost(Request $request, $threadKey)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $request->validate([
            'lost_reason' => ['required', 'string', 'in:rates_high,delay_in_response,client_cancelled,capacity_issue,other'],
            'lost_reason_custom' => ['nullable', 'string', 'max:255'],
        ]);

        $agentId = $user->branch_name;

        $thread = EmailThread::with('job')
            ->where('thread_key', $threadKey)
            ->where('agent_id', $agentId)
            ->firstOrFail();

        if (!$thread->job) {
            return response()->json(['error' => 'No operational Job linked to this thread.'], 422);
        }

        $job = $thread->job;
        $job->update([
            'status' => 'Lost',
            'lost_reason' => $request->input('lost_reason'),
            'lost_reason_custom' => $request->input('lost_reason_custom'),
            'lost_at' => Carbon::now(),
        ]);

        // Archive thread to halt SLA timers
        $thread->update([
            'status' => 'archived',
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Job marked as Lost.',
            'job' => $job,
        ], 200);
    }

    /**
     * Get active workloads for all staff members in the active user's branch.
     * GET /api/user/inbox/staff-workloads
     */
    public function getStaffWorkloads(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $agentId = $user->branch_name;

        $operators = User::where('branch_name', $agentId)
            ->select('id', 'name', 'email', 'designation')
            ->get();

        $workloads = $operators->map(function ($op) {
            $activeJobs = Job::where('operator_id', $op->id)
                ->whereNotIn('status', ['Completed', 'Lost'])
                ->count();
            return [
                'id' => $op->id,
                'name' => $op->name,
                'email' => $op->email,
                'designation' => $op->designation,
                'active_jobs' => $activeJobs,
            ];
        });

        return response()->json($workloads, 200);
    }

    public function getActiveJobs(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $agentId = $user->branch_name;
        $includeCompleted = $request->query('include_completed', false);

        $excludeStatuses = ['Lost'];
        if (!$includeCompleted) {
            $excludeStatuses[] = 'Completed';
        }

        $query = Job::with(['operator', 'client', 'airShipmentDetail', 'seaShipmentDetail', 'airwayBills', 'housewayBills', 'emailThreads'])
            ->where('agent_id', $agentId)
            ->whereNotIn('status', $excludeStatuses);

        if ($request->has('unassociated') && $request->input('unassociated') == 'true') {
            $query->whereNull('parent_job_id');
        }

        if ($request->has('is_consolidation')) {
            $query->where('is_consolidation', $request->input('is_consolidation') == 'true');
        }

        if ($request->has('is_sub_shipment')) {
            $query->where('is_sub_shipment', $request->input('is_sub_shipment') == 'true');
        }

        $jobs = $query->get();

        return response()->json($jobs, 200);
    }

    /**
     * Get or create the Job Cost Sheet (decoupled Draft Invoice and Purchase Voucher) for a job.
     * GET /api/user/inbox/jobs/{job_id}/cost-sheet
     */
    public function getJobCostSheet(Request $request, $jobId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $job = Job::where('agent_id', $user->branch_name)
            ->where('id', $jobId)
            ->firstOrFail();

        // 1. Get or create draft AccountsInvoice (Sell Side)
        $invoice = \App\AccountsInvoice::where('job_id', $job->id)
            ->where('status', 'draft')
            ->first();

        if (!$invoice) {
            $qty = 1.00;
            if ($job->transport_mode === 'air') {
                $airwayBill = \App\AirwayBills::where('job_id', $job->id)->first();
                if ($airwayBill) {
                    $consignment = \App\ConsignmentData::where('awb_id', $airwayBill->id)->first();
                    if ($consignment) {
                        $qty = floatval($consignment->chargable_weight ?: 1.00);
                    }
                }
            }

            $invoice = \App\AccountsInvoice::create([
                'agent_id' => $user->branch_name,
                'transport_mode' => $job->transport_mode->value ?? $job->transport_mode,
                'type' => 'invoice',
                'invoice_no' => 'INV-' . strtoupper(uniqid()),
                'document_date' => Carbon::now(),
                'job_id' => $job->id,
                'client_id' => $job->client_id ?: (\App\Company::first()->id ?? 1),
                'billed_party_role' => 'client',
                'currency' => 'USD',
                'exchange_rate' => 1.000000,
                'subtotal' => 0.00,
                'tax_amount' => 0.00,
                'grand_total' => 0.00,
                'status' => 'draft',
                'is_posted' => false,
                'due_date' => Carbon::now()->addDays(30),
                'created_by' => $user->id,
            ]);

            \App\AccountsInvoiceItem::create([
                'invoice_id' => $invoice->id,
                'charge_type' => $job->transport_mode === 'air' ? 'Air Freight Charge' : 'Ocean Freight Charge',
                'description' => 'Freight operational charges auto-calculated from waybill details.',
                'qty' => $qty,
                'unit_rate' => 2.50,
                'tax_rate' => 18.00,
                'subtotal' => $qty * 2.50,
                'tax_amount' => ($qty * 2.50) * 0.18,
                'total_amount' => ($qty * 2.50) * 1.18,
            ]);

            $invoice->subtotal = $qty * 2.50;
            $invoice->tax_amount = ($qty * 2.50) * 0.18;
            $invoice->grand_total = ($qty * 2.50) * 1.18;
            $invoice->save();
        }

        // 2. Get or create draft AccountsPurchaseVoucher (Buy Side)
        $voucher = \App\AccountsPurchaseVoucher::where('job_id', $job->id)
            ->where('status', 'draft')
            ->first();

        if (!$voucher) {
            $qty = 1.00;
            if ($job->transport_mode === 'air') {
                $airwayBill = \App\AirwayBills::where('job_id', $job->id)->first();
                if ($airwayBill) {
                    $consignment = \App\ConsignmentData::where('awb_id', $airwayBill->id)->first();
                    if ($consignment) {
                        $qty = floatval($consignment->chargable_weight ?: 1.00);
                    }
                }
            }

            $voucher = \App\AccountsPurchaseVoucher::create([
                'agent_id' => $user->branch_name,
                'voucher_no' => 'PV-' . strtoupper(uniqid()),
                'document_date' => Carbon::now(),
                'job_id' => $job->id,
                'vendor_id' => \App\Company::first()->id ?? 1,
                'currency' => 'USD',
                'exchange_rate' => 1.000000,
                'subtotal' => 0.00,
                'tax_amount' => 0.00,
                'grand_total' => 0.00,
                'status' => 'draft',
                'is_posted' => false,
                'created_by' => $user->id,
            ]);

            \App\AccountsPurchaseItem::create([
                'voucher_id' => $voucher->id,
                'charge_type' => $job->transport_mode === 'air' ? 'Air Freight Buy' : 'Ocean Freight Buy',
                'description' => 'Carrier costs auto-populated from manifest data.',
                'qty' => $qty,
                'unit_rate' => 1.80,
                'tax_rate' => 18.00,
                'subtotal' => $qty * 1.80,
                'tax_amount' => ($qty * 1.80) * 0.18,
                'total_amount' => ($qty * 1.80) * 1.18,
            ]);

            $voucher->subtotal = $qty * 1.80;
            $voucher->tax_amount = ($qty * 1.80) * 0.18;
            $voucher->grand_total = ($qty * 1.80) * 1.18;
            $voucher->save();
        }

        return response()->json([
            'status' => true,
            'invoice' => $invoice->load('items'),
            'purchase_voucher' => $voucher->load('items'),
        ], 200);
    }

    /**
     * Save the Job Cost Sheet (updates items and totals).
     * POST /api/user/inbox/jobs/{job_id}/cost-sheet
     */
    public function saveJobCostSheet(Request $request, $jobId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $job = Job::where('agent_id', $user->branch_name)
            ->where('id', $jobId)
            ->firstOrFail();

        $request->validate([
            'invoice_items' => ['required', 'array'],
            'invoice_items.*.charge_type' => ['required', 'string'],
            'invoice_items.*.description' => ['nullable', 'string'],
            'invoice_items.*.qty' => ['required', 'numeric'],
            'invoice_items.*.unit_rate' => ['required', 'numeric'],
            'invoice_items.*.tax_rate' => ['required', 'numeric'],

            'purchase_items' => ['required', 'array'],
            'purchase_items.*.charge_type' => ['required', 'string'],
            'purchase_items.*.description' => ['nullable', 'string'],
            'purchase_items.*.qty' => ['required', 'numeric'],
            'purchase_items.*.unit_rate' => ['required', 'numeric'],
            'purchase_items.*.tax_rate' => ['required', 'numeric'],
        ]);

        // 1. Update Invoice Items
        $invoice = \App\AccountsInvoice::where('job_id', $job->id)
            ->where('status', 'draft')
            ->firstOrFail();

        $invoice->items()->delete();
        $invSubtotal = 0;
        $invTax = 0;

        foreach ($request->input('invoice_items') as $item) {
            $qty = floatval($item['qty']);
            $rate = floatval($item['unit_rate']);
            $taxRate = floatval($item['tax_rate']);

            $sub = $qty * $rate;
            $tax = $sub * ($taxRate / 100);
            $total = $sub + $tax;

            $invSubtotal += $sub;
            $invTax += $tax;

            \App\AccountsInvoiceItem::create([
                'invoice_id' => $invoice->id,
                'charge_type' => $item['charge_type'],
                'description' => $item['description'] ?? '',
                'qty' => $qty,
                'unit_rate' => $rate,
                'tax_rate' => $taxRate,
                'subtotal' => $sub,
                'tax_amount' => $tax,
                'total_amount' => $total,
            ]);
        }

        $invoice->update([
            'subtotal' => $invSubtotal,
            'tax_amount' => $invTax,
            'grand_total' => $invSubtotal + $invTax,
        ]);

        // 2. Update Purchase Voucher Items
        $voucher = \App\AccountsPurchaseVoucher::where('job_id', $job->id)
            ->where('status', 'draft')
            ->firstOrFail();

        $voucher->items()->delete();
        $pvSubtotal = 0;
        $pvTax = 0;

        foreach ($request->input('purchase_items') as $item) {
            $qty = floatval($item['qty']);
            $rate = floatval($item['unit_rate']);
            $taxRate = floatval($item['tax_rate']);

            $sub = $qty * $rate;
            $tax = $sub * ($taxRate / 100);
            $total = $sub + $tax;

            $pvSubtotal += $sub;
            $pvTax += $tax;

            \App\AccountsPurchaseItem::create([
                'voucher_id' => $voucher->id,
                'charge_type' => $item['charge_type'],
                'description' => $item['description'] ?? '',
                'qty' => $qty,
                'unit_rate' => $rate,
                'tax_rate' => $taxRate,
                'subtotal' => $sub,
                'tax_amount' => $tax,
                'total_amount' => $total,
            ]);
        }

        $voucher->update([
            'subtotal' => $pvSubtotal,
            'tax_amount' => $pvTax,
            'grand_total' => $pvSubtotal + $pvTax,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Job Cost Sheet updated successfully.',
            'invoice' => $invoice->load('items'),
            'purchase_voucher' => $voucher->load('items'),
        ], 200);
    }

    /**
     * Update a Job's status, operator, or planned clearance date from Kanban drops.
     * POST /api/user/inbox/jobs/{job_id}/update-status
     */
    public function updateJobStatus(Request $request, $jobId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $job = Job::where('agent_id', $user->branch_name)
            ->where('id', $jobId)
            ->firstOrFail();

        $request->validate([
            'status' => ['nullable', 'string'],
            'operator_id' => ['nullable', 'integer'],
            'planned_clearance_date' => ['nullable', 'date'],
        ]);

        if ($request->has('status')) {
            $job->status = $request->input('status');
        }
        if ($request->has('operator_id')) {
            // Null or integer is acceptable
            $job->operator_id = $request->input('operator_id');
        }
        if ($request->has('planned_clearance_date')) {
            $date = Carbon::parse($request->input('planned_clearance_date'));
            if ($job->transport_mode === 'air') {
                \App\AirShipmentDetail::updateOrCreate(
                    ['job_id' => $job->id],
                    ['flight_date' => $date]
                );
            } else {
                \App\SeaShipmentDetail::updateOrCreate(
                    ['job_id' => $job->id],
                    ['vessel_etd' => $date]
                );
            }
        }

        $job->save();

        return response()->json([
            'status' => true,
            'message' => 'Job updated successfully.',
            'job' => $job,
        ], 200);
    }

    public function linkHblToMbl(Request $request, $masterId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $request->validate([
            'child_job_id' => ['required', 'integer', 'exists:jobs,id'],
        ]);

        $masterJob = Job::where('agent_id', $user->branch_name)
            ->where('id', $masterId)
            ->firstOrFail();

        $childJob = Job::where('agent_id', $user->branch_name)
            ->where('id', $request->input('child_job_id'))
            ->firstOrFail();

        $childJob->parent_job_id = $masterJob->id;
        $childJob->is_sub_shipment = true;
        $childJob->save();

        return response()->json([
            'status' => true,
            'message' => 'HBL linked to MBL successfully.',
            'child_job' => $childJob
        ], 200);
    }
}
