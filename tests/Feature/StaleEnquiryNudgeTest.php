<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enquiry;
use App\Enums\EnquiryStatus;
use App\Job;
use App\MailboxConnection;
use App\Services\Mail\MessageIngestor;
use App\Services\Mail\NormalisedMessage;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * `enquiries:nudge-stale` — the escalation that ends in a decision.
 *
 * 🔴 **This command had NO tests, and it contained two branches that had never executed
 * once.** That is not a coincidence: a scheduler's failure mode is silence, so nothing
 * ever reported that the reopen path and the debounce reset were dead. Anything that
 * CLOSES a customer enquiry on its own has to be walked day by day, which is what these
 * tests do rather than asserting a single end state.
 */
class StaleEnquiryNudgeTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;

    /**
     * ⚠️ Time is FROZEN for these tests, not merely travelled through. Without a fixed
     * base, an enquiry created at 08:15 and a sweep run at `startOfDay()+7` compare across
     * a boundary that lands the wrong side of the window, and the ladder appears to be a
     * day out. The bug is then in the test, which is the worst place for it.
     */
    private Carbon $base;

    protected function setUp(): void
    {
        parent::setUp();

        $this->base = Carbon::parse('2026-05-04 09:00:00');
        Carbon::setTestNow($this->base);

        $this->company = Company::create(['name' => 'Nudge Co', 'code' => 'NDG', 'tier' => 'tactical']);
        $this->branch = Agent::create([
            'company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM',
        ]);
    }

    private function enquiry(array $overrides = []): Enquiry
    {
        return Enquiry::withoutGlobalScopes()->create($overrides + [
            'agent_id'       => $this->branch->id,
            'transport_mode' => 'air',
            'direction'      => 'export',
            // The column is narrow; a full uniqid overflows it. Short and still unique
            // within a transaction-wrapped test.
            'enquiry_no'     => 'ENQA-NDG-' . substr(uniqid('', false), -8),
            'status'         => EnquiryStatus::Quoted,
        ]);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    /** Run the sweep as it would run N days after the enquiry went quiet. */
    private function sweepOnDay(int $day): void
    {
        Carbon::setTestNow($this->base->copy()->addDays($day));
        Artisan::call('enquiries:nudge-stale');
        Carbon::setTestNow($this->base);
    }

    private function fresh(Enquiry $e): Enquiry
    {
        return Enquiry::withoutGlobalScopes()->find($e->id);
    }

    /**
     * The whole ladder, day by day. At the defaults (7-day window, 2 attempts) the client
     * gets a full window to answer EACH reminder, including the last one.
     */
    public function test_two_reminders_then_the_enquiry_closes_itself(): void
    {
        $e = $this->enquiry();

        $this->sweepOnDay(6);
        $this->assertSame(0, $this->fresh($e)->stale_nudge_count, 'nudged before the window elapsed');

        $this->sweepOnDay(7);
        $this->assertSame(1, $this->fresh($e)->stale_nudge_count);

        // ⚠️ Not on day 8. Each attempt needs the window to elapse AGAIN, or two
        // reminders and a closure would all land within a day of each other.
        $this->sweepOnDay(8);
        $this->assertSame(1, $this->fresh($e)->stale_nudge_count);

        $this->sweepOnDay(14);
        $this->assertSame(2, $this->fresh($e)->stale_nudge_count);

        // Still open: the client has a full window to answer the LAST reminder.
        $this->sweepOnDay(20);
        $this->assertSame(EnquiryStatus::Quoted, $this->fresh($e)->status);

        $this->sweepOnDay(21);
        $closed = $this->fresh($e);
        $this->assertSame(EnquiryStatus::Lost, $closed->status);
        $this->assertSame('delay_in_response', $closed->lost_reason);
        $this->assertNotNull($closed->lost_at);
    }

    /**
     * 🔴 An automatic loss must never pass as a human's diagnosis. "We replied too slowly"
     * is a commercial finding; "nobody ever came back" is an administrative one, and a
     * loss-reason report that cannot separate them is worse than no report.
     */
    public function test_an_automatic_loss_is_marked_as_one(): void
    {
        $e = $this->enquiry();

        foreach ([7, 14, 21] as $day) {
            $this->sweepOnDay($day);
        }

        $this->assertTrue($this->fresh($e)->lost_automatically);

        $this->assertDatabaseHas('audit_logs', [
            'action'     => 'enquiry.lost_automatically',
            'model_type' => 'enquiry',
            'model_id'   => $e->id,
        ]);
    }

    /** A loss a person declared is not flagged as the machine's. */
    public function test_a_human_loss_is_not_flagged_automatic(): void
    {
        $e = $this->enquiry();
        $e->update(['status' => EnquiryStatus::Lost, 'lost_reason' => 'rates_high']);

        $this->assertFalse($this->fresh($e)->lost_automatically);
    }

    /**
     * 🔴 THE FAILURE THIS FEATURE MUST NOT HAVE. Ingestion only ever wrote to
     * `email_threads`, so an enquiry's own row never moved when the client wrote back —
     * the clock ran against conversations that were actively being answered, and the
     * auto-close would have declared a live client dead.
     */
    public function test_a_client_reply_restarts_the_clock(): void
    {
        $e = $this->enquiry();

        $this->sweepOnDay(7);
        $this->sweepOnDay(14);
        $this->assertSame(2, $this->fresh($e)->stale_nudge_count, 'precondition: on the brink');

        $owner = \App\User::create([
            'name' => 'desk', 'email' => 'desk-' . substr(uniqid('', false), -8) . '@test.local',
            'password' => \Illuminate\Support\Facades\Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => 'pricing', 'is_active' => 1,
        ]);

        $connection = MailboxConnection::create([
            'agent_id'      => $this->branch->id,
            'user_id'       => $owner->id,
            'email_address' => 'desk-' . uniqid('', true) . '@test.local',
            'provider'      => 'graph',
            'is_active'     => 1,
            'auth_state'    => 'connected',
        ]);

        $threadKey = 'thr-' . substr(uniqid('', false), -10);
        DB::table('email_threads')->insert([
            'agent_id'   => $this->branch->id,
            'thread_key' => $threadKey,
            'enquiry_id' => $e->id,
            'status'     => 'new',
            'classification' => 'customer_enquiry',
            'latest_message_received_at' => now()->subDays(14),
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('email_messages')->insert([
            'agent_id'    => $this->branch->id,
            'mailbox_connection_id' => $connection->id,
            'thread_key'  => $threadKey,
            'message_id'  => '<first-' . substr(uniqid('', false), -8) . '@test.local>',
            'direction'   => 'inbound',
            'from'        => 'client@acme.test',
            'to'          => json_encode([$connection->email_address]),
            'subject'     => 'Quote please',
            'received_at' => now()->subDays(14),
            'created_at'  => now(), 'updated_at' => now(),
        ]);

        app(MessageIngestor::class)->ingest($connection, [new NormalisedMessage(
            messageId: '<reply-' . substr(uniqid('', false), -8) . '@test.local>',
            threadId: null,
            from: 'client@acme.test',
            to: [$connection->email_address],
            subject: 'Re: Quote please',
            snippet: 'Sorry for the delay — still interested.',
            receivedAt: now(),
            direction: 'inbound',
        )]);

        $replied = $this->fresh($e);
        $this->assertSame(0, $replied->stale_nudge_count, 'a reply must reset the count');
        $this->assertNull($replied->stale_nudged_at);

        // And the sweep now starts over rather than closing them on the next run.
        $this->sweepOnDay(21);
        $this->assertSame(EnquiryStatus::Quoted, $this->fresh($e)->status);
    }

    /** Reopening overturns the machine's call completely — flag, reason and count. */
    public function test_reopening_an_auto_closed_enquiry_clears_the_whole_loss(): void
    {
        $e = $this->enquiry();

        foreach ([7, 14, 21] as $day) {
            $this->sweepOnDay($day);
        }
        $this->assertTrue($this->fresh($e)->lost_automatically, 'precondition: auto-closed');

        $this->fresh($e)->update(['status' => EnquiryStatus::AwaitingClient]);

        $reopened = $this->fresh($e);
        $this->assertFalse($reopened->lost_automatically);
        $this->assertNull($reopened->lost_at);
        $this->assertNull($reopened->lost_reason);
        $this->assertNotNull($reopened->reopened_at);
        // 🔴 The sequence starts over. Carrying an exhausted count into a revived enquiry
        // would close it again after a SINGLE further reminder.
        $this->assertSame(0, $reopened->stale_nudge_count);
    }

    /**
     * A converted enquiry is a confirmed shipment. `EnquiryObserver` throws rather than
     * let it be marked lost, and an uncaught throw in a scheduler aborts the sweep for
     * every branch that had not run yet.
     */
    public function test_a_converted_enquiry_is_never_auto_closed(): void
    {
        $e = $this->enquiry();
        $this->sweepOnDay(7);
        $this->sweepOnDay(14);

        Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $e->id, 'transport_mode' => 'air',
        ]);

        $this->sweepOnDay(21);

        $this->assertSame(EnquiryStatus::Converted, $this->fresh($e)->status);
    }

    /** The tenant owns the numbers; 0 attempts means "keep nudging, never close". */
    public function test_zero_attempts_disables_auto_closing(): void
    {
        DB::table('tenant_policies')->insert([
            'company_id' => $this->company->id, 'agent_id' => null,
            'stale_nudge_attempts' => 0,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $e = $this->enquiry();

        foreach ([7, 14, 21, 28] as $day) {
            $this->sweepOnDay($day);
        }

        $this->assertSame(EnquiryStatus::Quoted, $this->fresh($e)->status);
    }
}
