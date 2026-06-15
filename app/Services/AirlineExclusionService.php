<?php

namespace App\Services;

use App\InboundEmail;
use App\EmailThread;
use App\Airline;
use App\Job;
use App\Enums\JobStatus;
use App\Events\EmailClassified;
use App\Services\EnquirySequenceService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AirlineExclusionService
{
    /**
     * @var \App\Services\EnquirySequenceService
     */
    protected $sequenceService;

    /**
     * Constructor.
     *
     * @param  \App\Services\EnquirySequenceService  $sequenceService
     */
    public function __construct(EnquirySequenceService $sequenceService)
    {
        $this->sequenceService = $sequenceService;
    }

    /**
     * Process classification for a newly received inbound email.
     *
     * @param  \App\InboundEmail  $email
     * @return void
     */
    public function process(InboundEmail $email)
    {
        $thread = $email->thread;
        if (!$thread) {
            return;
        }

        // If thread already has a job_id or status is archived, skip to avoid double triage
        if ($thread->job_id || $thread->status === 'archived') {
            return;
        }

        // Only run classification on the first email of a thread (prevents duplicate runs/costs on replies)
        $earlierEmailsCount = InboundEmail::where('thread_key', $thread->thread_key)
            ->where('id', '<', $email->id)
            ->count();

        if ($earlierEmailsCount > 0) {
            return;
        }

        $senderEmail = $email->from;
        $domain = strtolower(substr(strrchr($senderEmail, "@"), 1));

        // 1. Blocklist Filter: Check if sender domain matches standard airline domains in the database
        $isAirlineDomain = Airline::whereNotNull('email_domain')
            ->where('email_domain', $domain)
            ->exists();

        if ($isAirlineDomain) {
            $this->archiveThread($thread, 'airline');
            return;
        }

        // 2. Subject Keywords: Filter out automated airline/system notices
        $subject = $email->subject ?? '';
        $blocklistPatterns = [
            '/\b(status update|booking confirmation|flight status|flight change|pre-alert|flight alert|schedule change|track trace|milestone alert|cargo status|shipment alert)\b/i'
        ];

        foreach ($blocklistPatterns as $pattern) {
            if (preg_match($pattern, $subject)) {
                $this->archiveThread($thread, 'airline');
                return;
            }
        }

        // 3. LLM Classifier (Fallback): Run Gemini Flash check via microservice
        try {
            $ocrUrl = rtrim(config('services.ocr.url'), '/') . '/classify-email';
            
            $response = Http::timeout(10)->post($ocrUrl, [
                'subject'    => $subject,
                'body'       => strip_tags($email->body_html ?: ($email->body_text ?: '')),
                'from_email' => $senderEmail,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $classification = $data['classification'] ?? 'system';

                if ($classification === 'system') {
                    $this->archiveThread($thread, 'system');
                } else {
                    $this->createJobForThread($thread, $email);
                }
            } else {
                throw new \RuntimeException('FastAPI classification endpoint failed: ' . $response->status());
            }
        } catch (\Throwable $e) {
            Log::error('FastAPI/Gemini Classification Failure: ' . $e->getMessage());
            
            // Unavailability Fallback: Leave as unread & unclassified (job_id is null, status is unread)
            // This allows manual operator triage without dropping any emails.
            $thread->status = 'unread';
            $thread->save();

            try {
                broadcast(new EmailClassified($thread, 'unclassified'));
            } catch (\Throwable $bcError) {
                // Ignore broadcast exception in CLI/queue
            }
        }
    }

    /**
     * Archive the thread as a system/airline alert.
     *
     * @param  \App\EmailThread  $thread
     * @param  string  $classification
     * @return void
     */
    protected function archiveThread(EmailThread $thread, string $classification)
    {
        $thread->status = 'archived';
        $thread->save();

        try {
            broadcast(new EmailClassified($thread, $classification));
        } catch (\Throwable $e) {
            // Ignore
        }
    }

    /**
     * Create operational Job for customer inquiry.
     *
     * @param  \App\EmailThread  $thread
     * @param  \App\InboundEmail  $email
     * @return void
     */
    protected function createJobForThread(EmailThread $thread, InboundEmail $email)
    {
        // Enforce sequence generation
        // Default mode to 'air' (can be triaged later)
        $enquiryNo = $this->sequenceService->nextEnquiryNumber($thread->agent_id, 'air');

        $job = Job::create([
            'agent_id'       => $thread->agent_id,
            'transport_mode' => 'air',
            'direction'      => 'export',
            'enquiry_no'     => $enquiryNo,
            'status'         => JobStatus::Intake,
        ]);

        $thread->job_id = $job->id;
        $thread->status = 'unread';
        $thread->save();

        try {
            broadcast(new EmailClassified($thread, 'customer'));
        } catch (\Throwable $e) {
            // Ignore
        }
    }
}
