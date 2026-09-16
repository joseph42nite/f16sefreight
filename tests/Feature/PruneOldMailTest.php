<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/** Mail goes three months after a conversation's last message; the figures stay (user, 2026-09-16). */
class PruneOldMailTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private int $mailbox;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Prune Co', 'code' => 'PRN', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $owner = User::create(['name' => 'p', 'email' => 'p-prn@test.local', 'password' => Hash::make('x'), 'company_name' => $company->id,
            'branch_name' => $this->branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $this->mailbox = DB::table('mailbox_connections')->insertGetId(['agent_id' => $this->branch->id, 'user_id' => $owner->id,
            'email_address' => 'desk-prn@test.local', 'provider' => 'outlook', 'is_active' => 1, 'auth_state' => 'connected', 'created_at' => now(), 'updated_at' => now()]);
    }

    /** A conversation: the client writes at $start, we reply 45 minutes later, the last message is at $latest. */
    private function conversation(string $start, string $latest, ?int $enquiryId = null): array
    {
        $key = 'prn-' . uniqid('', true);
        $thread = DB::table('email_threads')->insertGetId(['agent_id' => $this->branch->id, 'thread_key' => $key, 'classification' => 'customer_enquiry',
            'enquiry_id' => $enquiryId, 'latest_message_received_at' => $latest, 'first_response_at' => date('Y-m-d H:i:s', strtotime($start) + 45 * 60),
            'created_at' => $start, 'updated_at' => $latest]);
        $message = null;
        foreach ([[$start, 'inbound'], [$latest, 'outbound']] as $n => [$at, $direction]) {
            $message = DB::table('email_messages')->insertGetId(['agent_id' => $this->branch->id, 'mailbox_connection_id' => $this->mailbox, 'thread_key' => $key,
                'direction' => $direction, 'message_id' => "<{$key}-{$n}@t>", 'from' => 'a@client.test', 'to' => 'desk-prn@test.local', 'subject' => 'Rates',
                'received_at' => $at, 'created_at' => $at, 'updated_at' => $at]);
        }

        return [$thread, $message];
    }

    public function test_mail_older_than_three_months_goes_and_the_figures_stay(): void
    {
        Storage::fake('local');
        Storage::disk('local')->put('mail-attachments/old.pdf', '%PDF');

        $enquiry = DB::table('enquiries')->insertGetId(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-PRN-26-0001', 'created_at' => now()->subMonths(5), 'updated_at' => now()->subMonths(5)]);
        [$old, $oldMessage] = $this->conversation(now()->subMonths(5)->toDateTimeString(), now()->subMonths(4)->toDateTimeString(), $enquiry);
        [$stillActive] = $this->conversation(now()->subMonths(5)->toDateTimeString(), now()->subWeek()->toDateTimeString());

        DB::table('email_attachments')->insert(['email_message_id' => $oldMessage, 'filename' => 'old.pdf', 'mime_type' => 'application/pdf', 'file_path' => 'mail-attachments/old.pdf',
            'fetch_state' => 'cached', 'created_at' => now(), 'updated_at' => now()]);
        DB::table('email_classification_overrides')->insert(['agent_id' => $this->branch->id, 'email_thread_id' => $old, 'original_classification' => 'airline',
            'corrected_classification' => 'customer_enquiry', 'email_subject' => 'Rates', 'sender_domain' => 'client.test', 'sender_email' => 'a@client.test',
            'corrected_by' => DB::table('users')->where('email', 'p-prn@test.local')->value('id'), 'created_at' => now()]);
        DB::table('notifications')->insert(['id' => (string) \Illuminate\Support\Str::uuid(), 'agent_id' => $this->branch->id, 'type' => 'ThreadAssigned',
            'notifiable_type' => 'App\\User', 'notifiable_id' => 1, 'data' => json_encode(['thread_id' => $old]), 'priority' => 0, 'created_at' => now(), 'updated_at' => now()]);

        $this->artisan('mail:prune')->assertSuccessful();

        // Gone: the conversation, its mail, the attachment and its file, the bell notice.
        $this->assertDatabaseMissing('email_threads', ['id' => $old]);
        $this->assertDatabaseMissing('email_messages', ['id' => $oldMessage]);
        $this->assertSame(0, DB::table('email_attachments')->where('email_message_id', $oldMessage)->count());
        Storage::disk('local')->assertMissing('mail-attachments/old.pdf');
        $this->assertSame(0, DB::table('notifications')->whereRaw("JSON_EXTRACT(data, '$.thread_id') = ?", [$old])->count());

        // Kept: the figures — the enquiry with its 45-minute first reply, and the correction without its conversation.
        $this->assertSame(45, (int) DB::table('enquiries')->where('id', $enquiry)->value('first_reply_minutes'));
        $this->assertNull(DB::table('email_classification_overrides')->where('sender_email', 'a@client.test')->value('email_thread_id'));
        $this->assertSame(1, DB::table('email_classification_overrides')->where('sender_email', 'a@client.test')->count());

        // Still in use: started five months ago, answered last week — judged by its latest message, so it stays.
        $this->assertDatabaseHas('email_threads', ['id' => $stillActive]);
    }
}
