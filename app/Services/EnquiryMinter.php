<?php

namespace App\Services;

use App\Enquiry;
use App\EmailThread;
use App\Job;
use Illuminate\Support\Facades\DB;

/**
 * An enquiry number for a customer-enquiry conversation, and taking it away again (user, 2026-09-17).
 *
 * "The regex is to determine if it's a customer enquiry or not": a conversation filed as a customer enquiry — by the
 * classifier as mail arrives, or by a person with Filed as — gets its enquiry at once, so it is in the Kanban pool and
 * on the Enquiries page. Filed as something else, the enquiry is REMOVED, not marked lost: "it could just not be an
 * enquiry". Its number is not reused.
 */
class EnquiryMinter
{
    public function __construct(private readonly EnquirySequenceService $sequences, private readonly AuditLogger $audit) {}

    /** Creates the enquiry and links it; the caller runs this in a transaction. */
    public function mint(EmailThread $thread, ?int $actorId = null): Enquiry
    {
        $mode = app()->bound('active_portal_scope') ? app('active_portal_scope') : 'air';

        $enquiry = Enquiry::create([
            'agent_id'          => $thread->agent_id,
            'transport_mode'    => $mode,
            'enquiry_no'        => $this->sequences->next($thread->agent_id, ['air' => 'ENQA', 'sea' => 'ENQS', 'road' => 'ENQR'][$mode]),
            'status'            => 'new',
            'cargo_data_source' => 'manual',
            // WHO it is from, by the first sender's domain; null for a prospect not on the client list yet.
            'customer_id'       => $this->customerFor($thread),
        ]);

        EmailThread::withoutTenantScope()->whereKey($thread->id)->update(['enquiry_id' => $enquiry->id]);
        $thread->enquiry_id = $enquiry->id;
        $this->audit->record($thread->agent_id, 'thread.promoted', 'enquiry', $enquiry->id, $actorId);

        return $enquiry;
    }

    /** Mail filed as a customer enquiry as it arrives: its enquiry, unless it already has one. */
    public function mintForArrivedMail(string $threadKey): void
    {
        $thread = EmailThread::withoutTenantScope()->where('thread_key', $threadKey)->first();

        if ($thread === null || $thread->classification !== 'customer_enquiry' || $thread->enquiry_id !== null) {
            return;
        }

        DB::transaction(fn () => $this->mint($thread), EnquirySequenceService::DEADLOCK_ATTEMPTS);
    }

    /**
     * Filed as something else: the enquiry goes (its passes with it; AI and credit logs keep their rows, unlinked).
     * 🔴 Never once a shipment exists — the caller refuses that first.
     */
    public function remove(EmailThread $thread, ?int $actorId = null): void
    {
        if ($thread->enquiry_id === null
            || Job::withoutTenantScope()->where('enquiry_id', $thread->enquiry_id)->where('status', '!=', 'Cancelled')->exists()) {
            return;
        }

        $id = $thread->enquiry_id;
        EmailThread::withoutTenantScope()->whereKey($thread->id)->update(['enquiry_id' => null]);
        $thread->enquiry_id = null;

        // With a cancelled shipment the enquiry and the shipment are KEPT — every cancellation stays for the Boss to review
        // (PRD §5.4) — and only the conversation lets go of them.
        if (! Job::withoutTenantScope()->where('enquiry_id', $id)->exists()) {
            Enquiry::withoutGlobalScopes()->whereKey($id)->forceDelete();
        }
        $this->audit->record($thread->agent_id, 'thread.enquiry_removed', 'enquiry', $id, $actorId);
    }

    private function customerFor(EmailThread $thread): ?int
    {
        $from = DB::table('email_messages')->where('thread_key', $thread->thread_key)->where('direction', 'inbound')
            ->orderBy('received_at')->value('from');
        $at = $from === null ? false : strrpos($from, '@');

        if ($at === false) {
            return null;
        }

        return DB::table('customers')
            ->where('company_id', DB::table('agents_info')->where('id', $thread->agent_id)->value('company_id'))
            ->whereRaw('LOWER(email_domain) = ?', [strtolower(substr($from, $at + 1))])
            ->value('id');
    }
}
