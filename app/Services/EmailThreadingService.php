<?php

namespace App\Services;

use App\EmailThread;
use App\InboundEmail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class EmailThreadingService
{
    /**
     * Normalize standard subject prefixes (Re:, Fwd:, etc.) to a clean lowercase string.
     *
     * @param  string  $subject
     * @return string
     */
    public function normalizeSubject(string $subject): string
    {
        $subject = preg_replace('/^(re|fwd|fw|reply|aw)\s*:\s*/i', '', trim($subject));
        return trim(strtolower($subject));
    }

    /**
     * Determine the correct thread key for an incoming email based on provider thread ID,
     * In-Reply-To/References headers, or normalized subject.
     *
     * @param  array  $emailData
     * @return string
     */
    public function determineThreadKey(array $emailData): string
    {
        // 1. Check if provider-specific thread info is available
        if (!empty($emailData['provider']) && !empty($emailData['provider_thread_id'])) {
            $providerThreadKey = md5(strtolower($emailData['provider'] . '_' . $emailData['provider_thread_id']));
            if (EmailThread::where('thread_key', $providerThreadKey)->exists()) {
                return $providerThreadKey;
            }
            return $providerThreadKey;
        }

        // 2. Check In-Reply-To header
        if (!empty($emailData['in_reply_to'])) {
            $parentEmail = InboundEmail::where('message_id', $emailData['in_reply_to'])->first();
            if ($parentEmail) {
                return $parentEmail->thread_key;
            }
        }

        // 3. Check References header
        if (!empty($emailData['references'])) {
            $refs = preg_split('/\s+/', trim($emailData['references']));
            foreach ($refs as $ref) {
                if (!empty($ref)) {
                    $parentEmail = InboundEmail::where('message_id', $ref)->first();
                    if ($parentEmail) {
                        return $parentEmail->thread_key;
                    }
                }
            }
        }

        // 4. Subject-based matching fallback
        if (!empty($emailData['subject'])) {
            $cleanSubject = $this->normalizeSubject($emailData['subject']);
            if (!empty($cleanSubject)) {
                $existingThread = EmailThread::where('agent_id', $emailData['agent_id'])
                    ->where(function ($query) use ($cleanSubject) {
                        $query->where('subject', 'LIKE', '%' . $cleanSubject . '%');
                    })
                    ->latest('latest_message_received_at')
                    ->first();

                if ($existingThread) {
                    return $existingThread->thread_key;
                }
            }
        }

        // 5. Fallback: generate a new cryptographically secure random key
        return md5(Str::uuid());
    }

    /**
     * Get an existing thread or create a new one, updating timestamps and participants list.
     *
     * @param  string  $threadKey
     * @param  array  $emailData
     * @return \App\EmailThread
     */
    public function getOrCreateThread(string $threadKey, array $emailData): EmailThread
    {
        $thread = EmailThread::where('thread_key', $threadKey)->first();

        $participants = [];
        if (!empty($emailData['from'])) {
            $participants[] = strtolower(trim($emailData['from']));
        }
        if (!empty($emailData['to'])) {
            $participants[] = strtolower(trim($emailData['to']));
        }

        $receivedAt = !empty($emailData['received_at'])
            ? Carbon::parse($emailData['received_at'])
            : now();

        if (!$thread) {
            $thread = EmailThread::create([
                'agent_id'               => $emailData['agent_id'],
                'mailbox_connection_id'  => $emailData['mailbox_connection_id'] ?? null,
                'provider'               => $emailData['provider'] ?? null,
                'provider_thread_id'     => $emailData['provider_thread_id'] ?? null,
                'thread_key'             => $threadKey,
                'subject'                => $emailData['subject'] ?? 'No Subject',
                'latest_message_received_at' => $receivedAt,
                'participant_emails'     => $participants,
                'status'                 => 'unread',
            ]);
        } else {
            $currentParticipants = $thread->participant_emails ?? [];
            $newParticipants = array_unique(array_merge($currentParticipants, $participants));
            
            $thread->participant_emails = $newParticipants;
            $thread->status = 'unread';

            if ($receivedAt->gt($thread->latest_message_received_at)) {
                $thread->latest_message_received_at = $receivedAt;
            }
            
            $thread->save();
        }

        return $thread;
    }
}
