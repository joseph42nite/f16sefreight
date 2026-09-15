<?php

namespace App\Services;

use App\DocumentShareLink;
use App\EmailMessage;
use App\EmailThread;
use App\Http\Controllers\Generators\GenerateAwbPdfController;
use App\Job;
use App\JobDocument;
use App\Services\Mail\ThreadMailer;
use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Automated client updates — the client hears where their shipment is (user, 2026-09-16).
 *
 * 🔴 **NOTHING IS EMAILED TO A CLIENT WITHOUT A PERSON APPROVING IT** (guide §4.6). A moment in the shipment
 * prepares a draft from a fixed template; the draft waits as a card on the conversation (and in the owner's bell)
 * until someone sends, edits or skips it. Only `decide()` sends, and it needs the person who approved.
 *
 * Each moment is prepared ONCE per conversation (`email_threads.client_updates`). A newer moment replaces a draft
 * nobody acted on — a client does not need "draft AWB ready" once the shipment is booked. The job number is internal
 * and never goes into these mails; the AWB number is the client's reference.
 */
class ClientNotificationService
{
    /** The moments, in shipment order, with the title the operator sees. */
    public const STAGES = [
        'claimed'   => 'We have your enquiry',
        'confirmed' => 'Shipment confirmed',
        'draft_awb' => 'Draft AWB ready',
        'booked'    => 'Booked with the airline',
        'departed'  => 'Departed',
        'delivered' => 'Delivered',
    ];

    /** Written in the draft where the secure review link goes; the link is made only when the mail is sent. */
    public const REVIEW_LINK = '[review link]';

    public const BELL_TYPE = 'ClientUpdateReady';

    /** The draft for one moment, from its template. NULL when there is no client address to write to. */
    public function draft(EmailThread $thread, string $stage): ?array
    {
        $client = EmailMessage::where('thread_key', $thread->thread_key)->where('direction', 'inbound')
            ->orderBy('received_at')->value('from');

        if ($client === null || ! isset(self::STAGES[$stage])) {
            return null;
        }

        $subject = (string) EmailMessage::where('thread_key', $thread->thread_key)->orderBy('received_at')->value('subject');
        $f = $this->facts($thread);

        // Booked, departed and delivered are told by AWB number; without one there is nothing true to say.
        if ($f['awb'] === '' && in_array($stage, ['booked', 'departed', 'delivered'], true)) {
            return null;
        }

        $body = match ($stage) {
            'claimed'   => "Thank you for your enquiry. We have received it and {$f['owner']} is looking after it. We will come back to you with our rates shortly.",
            'confirmed' => "Thank you for confirming. Your shipment{$f['lane']}{$f['cargo']} is booked in with us and we have started the paperwork. We will send you the draft air waybill to check next.",
            'draft_awb' => "The draft air waybill for your shipment{$f['lane']} is ready. Please check it and approve it, or tell us what to change, here:\n" . self::REVIEW_LINK . "\n\nThe link stays open for 14 days.",
            'booked'    => "Your shipment{$f['lane']} is booked with the airline under AWB {$f['awb']}{$f['flight']}." . ($f['pdf'] ? ' The air waybill is attached.' : ''),
            'departed'  => "Your shipment under AWB {$f['awb']} has departed{$f['from']}{$f['flight']}. We will let you know when it is delivered.",
            'delivered' => "Your shipment under AWB {$f['awb']} has been delivered{$f['to']}. Thank you for shipping with us.",
        };

        return [
            'stage' => $stage,
            'title' => self::STAGES[$stage],
            'to' => [$client],
            'cc' => [],
            'subject' => preg_match('/^re:/i', $subject) ? $subject : 'Re: ' . $subject,
            'body' => "Hello,\n\n{$body}\n\nKind regards,",
            'attachment' => $stage === 'booked' && $f['pdf'] ? 'AWB-' . $f['awb'] . '.pdf' : null,
        ];
    }

    /** Park the draft for a moment on the job's conversation and tell its owner. */
    public function prepareForJob(Job $job, string $stage): bool
    {
        $thread = EmailThread::withoutGlobalScopes()
            ->where(fn ($q) => $q->where('job_id', $job->id)
                ->when($job->enquiry_id, fn ($q) => $q->orWhere('enquiry_id', $job->enquiry_id)))
            ->orderByDesc('latest_message_received_at')
            ->first();

        return $thread !== null && $this->prepare($thread, $stage, $job);
    }

    public function prepare(EmailThread $thread, string $stage, ?Job $job = null): bool
    {
        $pending = $thread->pending_client_notification;

        if ($thread->classification !== 'customer_enquiry' || $this->handled($thread, $stage)
            || ($pending['stage'] ?? null) === $stage) {
            return false;
        }

        $draft = $this->draft($thread, $stage);

        if ($draft === null) {
            return false;
        }

        $updates = $thread->client_updates ?? [];
        if (isset($pending['stage'])) {
            $updates[$pending['stage']] = ['decision' => 'superseded', 'by' => null, 'at' => now()->toIso8601String()];
        }

        $thread->forceFill(['pending_client_notification' => $draft + ['staged_at' => now()->toIso8601String()], 'client_updates' => $updates ?: null])->save();

        $job ??= $this->jobFor($thread);
        $owner = $thread->assigned_ops_id ?? $job?->pricing_id ?? $job?->ops_id;

        $this->dissolveBell($thread);
        if ($owner !== null) {
            app(BellNotificationService::class)->notify($thread->agent_id, $owner, self::BELL_TYPE, [
                'thread_id' => $thread->id, 'stage' => $stage, 'title' => $draft['title'], 'subject' => $draft['subject'],
            ], BellNotificationService::PRIORITY_APPROVAL);
        }

        return true;
    }

    /**
     * Send or skip a moment's mail — the person's approval. Sending uses their edits to the draft.
     *
     * The claim pop-up decides `claimed` before anything is parked; every other moment must be the waiting draft.
     *
     * @return array{ok: bool, error?: string, reason?: string, status?: int}
     */
    public function decide(EmailThread $thread, User $by, string $stage, string $decision, array $edits = []): array
    {
        $pending = $thread->pending_client_notification;
        $waiting = ($pending['stage'] ?? null) === $stage || ($stage === 'claimed' && ! $this->handled($thread, 'claimed'));

        if (! $by->exists || ! $waiting) {
            return ['ok' => false, 'error' => 'This update has already been dealt with.', 'reason' => 'not_waiting', 'status' => 409];
        }

        if ($decision === 'send') {
            $draft = array_merge($pending ?? $this->draft($thread, $stage) ?? [], array_filter($edits, fn ($v) => $v !== null));
            $result = $this->send($thread, $by, $stage, $draft);

            if (! $result['ok']) {
                return $result;
            }
        }

        $updates = $thread->client_updates ?? [];
        $updates[$stage] = ['decision' => $decision === 'send' ? 'sent' : 'skipped', 'by' => $by->id, 'at' => now()->toIso8601String()];

        $thread->forceFill([
            'client_updates' => $updates,
            'pending_client_notification' => ($pending['stage'] ?? null) === $stage ? null : $pending,
        ])->save();

        if ($thread->pending_client_notification === null) {
            $this->dissolveBell($thread);
        }

        return ['ok' => true];
    }

    /** A moment somebody already sent, skipped or answered in their own words. */
    public function handled(EmailThread $thread, string $stage): bool
    {
        return isset(($thread->client_updates ?? [])[$stage]);
    }

    /** The conversation was answered by hand, so there is no "we have your enquiry" mail to offer. */
    public function markReplied(EmailThread $thread): void
    {
        if (! $this->handled($thread, 'claimed')) {
            $thread->forceFill(['client_updates' => ($thread->client_updates ?? []) + [
                'claimed' => ['decision' => 'replied', 'by' => $thread->assigned_ops_id, 'at' => now()->toIso8601String()],
            ]])->save();
        }
    }

    private function send(EmailThread $thread, User $by, string $stage, array $draft): array
    {
        $body = (string) ($draft['body'] ?? '');
        $attachments = [];

        if ($stage === 'draft_awb' && str_contains($body, self::REVIEW_LINK)) {
            $document = $this->awbDocument($thread, $by->id);
            if ($document === null) {
                return ['ok' => false, 'error' => 'There is no air waybill on this shipment to link to yet.', 'reason' => 'no_awb', 'status' => 422];
            }

            [, $raw] = DocumentShareLink::issue([
                'agent_id' => $document->agent_id, 'job_document_id' => $document->id, 'job_id' => $document->job_id,
                'created_by' => $by->id, 'requires_approval' => true, 'view_count' => 0,
            ], 14);
            $body = str_replace(self::REVIEW_LINK, url('/api/d/' . $raw), $body);
        }

        if ($stage === 'booked' && ($document = $this->awbDocument($thread, $by->id)) && Storage::exists($document->file_path)) {
            $attachments[] = ['name' => $document->file_name, 'mime_type' => 'application/pdf', 'bytes' => Storage::get($document->file_path)];
        }

        return app(ThreadMailer::class)->send($thread, $by, (array) ($draft['to'] ?? []), (array) ($draft['cc'] ?? []),
            (string) ($draft['subject'] ?? ''), $body, $attachments);
    }

    /** The job's AWB PDF; when a user is sending and it was never published, it is made now from the linked waybill. */
    private function awbDocument(EmailThread $thread, ?int $userId = null): ?JobDocument
    {
        $job = $this->jobFor($thread);

        if ($job === null) {
            return null;
        }

        $document = JobDocument::withoutGlobalScopes()->where('job_id', $job->id)->where('document_type', 'awb')->first();

        if ($document === null && $userId !== null && ($waybill = \App\AirwayBills::where('job_id', $job->id)->first())) {
            $document = app(GenerateAwbPdfController::class)->storeDocument($waybill, $userId);
        }

        return $document;
    }

    private function jobFor(EmailThread $thread): ?Job
    {
        return Job::withoutGlobalScopes()
            ->where(fn ($q) => $q->where('id', $thread->job_id)
                ->when($thread->enquiry_id, fn ($q) => $q->orWhere('enquiry_id', $thread->enquiry_id)))
            ->orderByDesc('id')->first();
    }

    /** The words the templates fill in, each ready to drop into a sentence or empty. */
    private function facts(EmailThread $thread): array
    {
        $job = $this->jobFor($thread);
        $enquiry = $thread->enquiry()->withoutGlobalScopes()->first();
        $waybill = $job ? DB::table('air_way_bills')->where('job_id', $job->id)
            ->first(['departure_airport', 'destination_airport', 'flight', 'date']) : null;
        $date = filled($waybill->date ?? null) ? rescue(fn () => \Illuminate\Support\Carbon::parse($waybill->date)->format('j M Y'), $waybill->date, false) : null;

        $origin = $waybill->departure_airport ?? $enquiry?->origin_code;
        $destination = $waybill->destination_airport ?? $enquiry?->dest_code;
        $pieces = $enquiry?->extracted_pieces;
        $weight = $enquiry?->extracted_weight;
        $owner = $thread->assigned_ops_id ? User::whereKey($thread->assigned_ops_id)->value('name') : null;

        return [
            'owner' => $owner ?: 'our team',
            'lane' => $origin && $destination ? " from {$origin} to {$destination}" : '',
            'cargo' => $pieces && $weight ? ' (' . $pieces . ' pcs, ' . rtrim(rtrim(number_format((float) $weight, 2, '.', ''), '0'), '.') . ' kg)' : '',
            'awb' => $job?->awb_number ?? '',
            'flight' => filled($waybill->flight ?? null) ? ' on flight ' . $waybill->flight . ($date ? ' on ' . $date : '') : '',
            // The AWB PDF can be attached: it is filed, or there is a waybill to make it from when the mail is sent.
            'pdf' => $waybill !== null || ($job && JobDocument::where('job_id', $job->id)->where('document_type', 'awb')->exists()),
            'from' => $origin ? " from {$origin}" : '',
            'to' => $destination ? " at {$destination}" : '',
        ];
    }

    /** The owner's bell card goes once nothing is waiting — a bell is a list of things still to do. */
    private function dissolveBell(EmailThread $thread): void
    {
        DB::table('notifications')->where('type', self::BELL_TYPE)->whereNull('read_at')
            ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.thread_id')) = ?", [(string) $thread->id])
            ->delete();
    }
}
