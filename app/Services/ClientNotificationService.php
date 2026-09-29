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
 * Each moment is prepared ONCE per conversation (`email_threads.client_updates`). The job number is internal and never
 * goes into these mails; the AWB number (air) or the bill of lading number (sea) is the client's reference.
 *
 * ── 🔴 THE DRAFT PROTOCOL — air and sea alike (owner, 2026-09-29) ──────────
 *   1. ONE draft waits per conversation (`pending_client_notification`).
 *   2. A newer moment lands ON TOP of a draft nobody acted on: the old one is recorded as `superseded` (still shown
 *      in the conversation as "not sent") and the new one is what the person acts on. Nobody has to clear a queue.
 *   3. The bell FOLLOWS the draft: one card per conversation, for the draft now waiting — removed, read or not, when
 *      it is sent, skipped or replaced. A card never points at a draft that is gone.
 *   4. Acting on a replaced draft answers 409 with the draft now on top, so the screen shows it instead of a dead end.
 *   5. A moment with nothing true to say (no AWB / no BL yet, or the other desk's moment) prepares nothing and rings
 *      nothing — and leaves any waiting draft where it is.
 */
class ClientNotificationService
{
    /** The moments, in shipment order, with the title the operator sees. */
    public const STAGES = [
        'claimed'   => 'We have your enquiry',
        'confirmed' => 'Shipment confirmed',
        'draft_awb' => 'Draft AWB ready',
        // Sea's draft to approve (owner, 2026-09-29) — the bill of lading, prepared by the same job status as air's.
        'draft_bl'  => 'Draft bill of lading ready',
        'booked'    => 'Booked with the airline',
        'departed'  => 'Departed',
        'arrived'   => 'Arrived with all pieces',
        'delivered' => 'Delivered',
    ];

    /** Written in the draft where the secure review link goes; the link is made only when the mail is sent. */
    public const REVIEW_LINK = '[review link]';

    /**
     * Blanks the person fills in before sending (user, 2026-09-16: the booking date and airline are entered by hand).
     * A mail still carrying one is refused rather than sent with "[date]" in it.
     */
    public const BLANKS = '/\[(date|airline|shipping line)\]/';

    public const BELL_TYPE = 'ClientUpdateReady';

    /** What a sea client is told a moment is, where air's words would be wrong. */
    private const SEA_TITLES = ['booked' => 'Booked with the shipping line'];

    /** Moments only one desk has: a sea client never hears of an air waybill, nor an air client of a bill of lading. */
    private const AIR_ONLY = ['draft_awb', 'departed', 'arrived'];
    private const SEA_ONLY = ['draft_bl'];

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

        // 🔴 Each desk tells its own moments (GAPS #427): the other desk's is not prepared at all.
        if (in_array($stage, $f['sea'] ? self::AIR_ONLY : self::SEA_ONLY, true)) {
            return null;
        }

        // Booked and after are told by the bill's own number — the AWB, or the BL; without one there is nothing true to say.
        if (($f['sea'] ? $f['bl'] : $f['awb']) === '' && in_array($stage, ['booked', 'departed', 'arrived', 'delivered'], true)) {
            return null;
        }

        $body = $f['sea'] ? $this->seaBody($stage, $f) : match ($stage) {
            'claimed'   => "Thank you for your enquiry. We have received it and {$f['owner']} is looking after it. We will come back to you with our rates shortly.",
            'confirmed' => $f['sea']
                ? "Thank you for confirming. Your shipment{$f['lane']}{$f['cargo']} is booked in with us and we have started the paperwork.{$f['operator']}\n\n"
                    . "Your shipment is booked on [date] with [shipping line].\n\nWe will send you the draft bill of lading to check next."
                : "Thank you for confirming. Your shipment{$f['lane']}{$f['cargo']} is booked in with us and we have started the paperwork.{$f['operator']}\n\n"
                    . "Your shipment is booked on [date] with [airline].\n\nWe will send you the draft air waybill to check next.",
            'draft_awb' => "The draft air waybill for your shipment{$f['lane']} is ready. Please check it and approve it, or tell us what to change, here:\n" . self::REVIEW_LINK . "\n\nThe link stays open for 14 days.",
            'booked'    => "Your shipment{$f['lane']} is booked with the airline under AWB {$f['awb']}{$f['flight']}."
                . ($f['pdf'] ? ($f['houses'] ? ' The air waybill and the house air waybill' . (count($f['houses']) > 1 ? 's are' : ' is') . ' attached.' : ' The air waybill is attached.') : ''),
            'departed'  => "Your shipment under AWB {$f['awb']} has departed{$f['from']}{$f['flight']}. We will let you know when it is delivered.",
            'arrived'   => "Your shipment under AWB {$f['awb']} has reached the hub{$f['to']} and all {$f['pieces']}pieces have been received. We will let you know when it is delivered.",
            'delivered' => "Your shipment under AWB {$f['awb']} has been delivered{$f['to']}. Thank you for shipping with us.",
        };

        return [
            'stage' => $stage,
            'title' => $f['sea'] ? (self::SEA_TITLES[$stage] ?? self::STAGES[$stage]) : self::STAGES[$stage],
            'to' => [$client],
            'cc' => [],
            'subject' => preg_match('/^re:/i', $subject) ? $subject : 'Re: ' . $subject,
            'body' => "Hello,\n\n{$body}\n\nKind regards,",
            'attachment' => $stage !== 'booked' ? null : ($f['sea'] ? $this->blFileName($f['bl'])
                : ($f['pdf'] ? implode(', ', array_merge(['AWB-' . $f['awb'] . '.pdf'], array_column($f['houses'], 'file'))) : null)),
        ];
    }

    /** Sea's words for each moment. `confirmed` keeps its own two-desk wording above. */
    private function seaBody(string $stage, array $f): string
    {
        return match ($stage) {
            'claimed'   => "Thank you for your enquiry. We have received it and {$f['owner']} is looking after it. We will come back to you with our rates shortly.",
            'confirmed' => "Thank you for confirming. Your shipment{$f['lane']}{$f['cargo']} is booked in with us and we have started the paperwork.{$f['operator']}\n\n"
                . "Your shipment is booked on [date] with [shipping line].\n\nWe will send you the draft bill of lading to check next.",
            'draft_bl'  => "The draft bill of lading for your shipment{$f['lane']} is ready. Please check it and approve it, or tell us what to change, here:\n" . self::REVIEW_LINK . "\n\nThe link stays open for 14 days.",
            'booked'    => "Your shipment{$f['lane']} is booked with {$f['carrier']}{$f['vessel']} under bill of lading {$f['bl']}{$f['etd']}. The bill of lading is attached.",
            'delivered' => "Your shipment under bill of lading {$f['bl']} has been delivered{$f['to']}. Thank you for shipping with us.",
        };
    }

    private function blFileName(string $bl): string
    {
        return 'BL-' . preg_replace('/[^A-Za-z0-9\-]/', '', $bl) . '.pdf';
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
            $updates[$pending['stage']] = ['decision' => 'superseded', 'by' => null, 'at' => now()->toIso8601String(),
                'subject' => $pending['subject'] ?? null, 'body' => $pending['body'] ?? null];
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
            // Protocol rule 4: the draft now on top comes back, so the screen shows it instead of a dead end.
            return ['ok' => false, 'error' => $pending ? 'A newer update has replaced this one — it is shown now.' : 'This update has already been dealt with.',
                'reason' => 'not_waiting', 'status' => 409, 'client_update' => $pending];
        }

        if ($decision === 'send') {
            $draft = array_merge($pending ?? $this->draft($thread, $stage) ?? [], array_filter($edits, fn ($v) => $v !== null));
            $result = $this->send($thread, $by, $stage, $draft);

            if (! $result['ok']) {
                return $result;
            }
        }

        $updates = $thread->client_updates ?? [];
        $updates[$stage] = ['decision' => $decision === 'send' ? 'sent' : 'skipped', 'by' => $by->id, 'at' => now()->toIso8601String()]
            // A skipped mail is kept in full: the conversation should still show what was suggested and not sent.
            + ($decision === 'send' ? [] : ['subject' => $pending['subject'] ?? null, 'body' => $pending['body'] ?? null]);

        $thread->forceFill([
            'client_updates' => $updates,
            'pending_client_notification' => ($pending['stage'] ?? null) === $stage ? null : $pending,
        ])->save();

        if ($thread->pending_client_notification === null) {
            $this->dissolveBell($thread);
        }

        return ['ok' => true];
    }

    /**
     * The suggested mails that never went — skipped, or replaced by a later moment — in the order they were decided,
     * so the conversation can show them alongside the mail that did go out.
     *
     * @return array<int, array{stage: string, title: string, decision: string, at: string, by: ?string, subject: ?string, body: string}>
     */
    public function notSent(EmailThread $thread): array
    {
        $names = User::whereIn('id', collect($thread->client_updates ?? [])->pluck('by')->filter())->pluck('name', 'id');

        return collect($thread->client_updates ?? [])
            ->filter(fn ($u) => filled($u['body'] ?? null) && in_array($u['decision'] ?? '', ['skipped', 'superseded'], true))
            ->map(fn ($u, $stage) => [
                'stage' => $stage,
                'title' => self::STAGES[$stage] ?? $stage,
                'decision' => $u['decision'],
                'at' => $u['at'],
                'by' => $names[$u['by']] ?? null,
                'subject' => $u['subject'] ?? null,
                'body' => $u['body'],
            ])
            ->sortBy('at')->values()->all();
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

        // 🔴 Never send a blank the person was meant to fill in.
        if (preg_match(self::BLANKS, $body, $blank)) {
            return ['ok' => false, 'error' => "Fill in the {$blank[1]} before sending — the mail still says {$blank[0]}.",
                    'reason' => 'blank_left', 'status' => 422];
        }

        if (in_array($stage, ['draft_awb', 'draft_bl'], true) && str_contains($body, self::REVIEW_LINK)) {
            $document = $stage === 'draft_bl' ? $this->blDocument($thread, $by->id) : $this->awbDocument($thread, $by->id);
            if ($document === null) {
                return ['ok' => false, 'error' => $stage === 'draft_bl' ? 'There is no bill of lading on this shipment to link to yet.'
                    : 'There is no air waybill on this shipment to link to yet.', 'reason' => $stage === 'draft_bl' ? 'no_bl' : 'no_awb', 'status' => 422];
            }

            [, $raw] = DocumentShareLink::issue([
                'agent_id' => $document->agent_id, 'job_document_id' => $document->id, 'job_id' => $document->job_id,
                'created_by' => $by->id, 'requires_approval' => true, 'view_count' => 0,
            ], 14);
            $body = str_replace(self::REVIEW_LINK, url('/api/d/' . $raw), $body);
        }

        if ($stage === 'booked' && ($job = $this->jobFor($thread)) && $job->transport_mode === 'sea') {
            // The bill as it stands when the mail goes — made fresh, never a stale copy.
            $f = $this->facts($thread);
            $attachments[] = ['name' => $this->blFileName($f['bl']), 'mime_type' => 'application/pdf', 'bytes' => app(BlPdf::class)->render($job)];
        } elseif ($stage === 'booked') {
            if (($document = $this->awbDocument($thread, $by->id)) && Storage::exists($document->file_path)) {
                $attachments[] = ['name' => $document->file_name, 'mime_type' => 'application/pdf', 'bytes' => Storage::get($document->file_path)];
            }
            // Each house waybill beside the master (GAPS #303). A house that cannot be drawn is left out, not faked.
            foreach ($this->facts($thread)['houses'] as $house) {
                $bytes = rescue(fn () => app(\App\Http\Controllers\Generators\GenerateHawbPdfController::class)->pdfBytes($house['id']), null);
                if (filled($bytes)) {
                    $attachments[] = ['name' => $house['file'], 'mime_type' => 'application/pdf', 'bytes' => $bytes];
                }
            }
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

    /** The job's bill of lading as a filed document, drawn fresh from the record — the review link points at it. */
    private function blDocument(EmailThread $thread, int $userId): ?JobDocument
    {
        $job = $this->jobFor($thread);

        if ($job === null || $job->transport_mode !== 'sea') {
            return null;
        }

        $path = "documents/bl/{$job->id}.pdf";
        Storage::put($path, app(BlPdf::class)->render($job));

        return JobDocument::withoutGlobalScopes()->updateOrCreate(['job_id' => $job->id, 'document_type' => 'bl'], [
            'agent_id' => $job->agent_id, 'file_name' => $this->blFileName($this->facts($thread)['bl'] ?: 'draft'),
            'file_path' => $path, 'mime_type' => 'application/pdf', 'file_size' => Storage::size($path), 'uploaded_by' => $userId,
        ]);
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

        $sea = ($job?->transport_mode ?? $enquiry?->transport_mode) === 'sea';
        $bill = $sea && $job ? DB::table('sea_shipment_details')->where('job_id', $job->id)->first() : null;
        $etd = filled($bill->etd ?? null) ? rescue(fn () => \Illuminate\Support\Carbon::parse($bill->etd)->format('j M Y'), null, false) : null;

        $origin = $bill->pol_code ?? $waybill->departure_airport ?? $enquiry?->origin_code;
        $destination = $bill->pod_code ?? $waybill->destination_airport ?? $enquiry?->dest_code;
        $pieces = $enquiry?->extracted_pieces;
        $weight = $enquiry?->extracted_weight;
        $owner = $thread->assigned_ops_id ? User::whereKey($thread->assigned_ops_id)->value('name') : null;

        return [
            'sea' => $sea,
            // Sea: the client's reference is the house bill, or the master's on a direct shipment.
            'bl' => (string) ($bill->hbl_number ?? null ?: ($bill->mbl_number ?? '')),
            'carrier' => ($bill->carrier_id ?? null) ? (DB::table('partners')->where('id', $bill->carrier_id)->value('name') ?: 'the shipping line') : 'the shipping line',
            'vessel' => filled($bill->vessel_name ?? null) ? ' on ' . $bill->vessel_name . (filled($bill->voyage_no ?? null) ? ' voyage ' . $bill->voyage_no : '') : '',
            'etd' => $etd ? ", sailing {$etd}" : '',
            // Air: the house waybills on this job, attached to "Booked" beside the master.
            'houses' => $job && ! $sea ? DB::table('house_way_bills')->where('job_id', $job->id)->get(['id', 'awb_no'])
                ->map(fn ($h) => ['id' => $h->id, 'file' => 'HAWB-' . preg_replace('/[^A-Za-z0-9\-]/', '', (string) $h->awb_no) . '.pdf'])->all() : [],
            'owner' => $owner ?: 'our team',
            'lane' => $origin && $destination ? " from {$origin} to {$destination}" : '',
            'cargo' => $pieces && $weight ? ' (' . $pieces . ' pcs, ' . rtrim(rtrim(number_format((float) $weight, 2, '.', ''), '0'), '.') . ' kg)' : '',
            'awb' => $job?->awb_number ?? '',
            'pieces' => $pieces ? $pieces . ' ' : '',
            // Who will run it, once a shipment has an operator: the client knows whom they are dealing with.
            'operator' => $job?->ops_id && ($name = User::whereKey($job->ops_id)->value('name'))
                ? " {$name} from our operations team will be taking care of it."
                : '',
            'flight' => filled($waybill->flight ?? null) ? ' on flight ' . $waybill->flight . ($date ? ' on ' . $date : '') : '',
            // The AWB PDF can be attached: it is filed, or there is a waybill to make it from when the mail is sent.
            'pdf' => $waybill !== null || ($job && JobDocument::where('job_id', $job->id)->where('document_type', 'awb')->exists()),
            'from' => $origin ? " from {$origin}" : '',
            'to' => $destination ? " at {$destination}" : '',
        ];
    }

    /**
     * The conversation's bell card goes — READ OR NOT (protocol rule 3). Deleting only unread cards left an opened card
     * pointing at a draft that had been replaced or sent: a notification with nothing behind it.
     */
    private function dissolveBell(EmailThread $thread): void
    {
        DB::table('notifications')->where('type', self::BELL_TYPE)
            ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.thread_id')) = ?", [(string) $thread->id])
            ->delete();
    }
}
