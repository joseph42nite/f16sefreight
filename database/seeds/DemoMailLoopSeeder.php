<?php

use App\Agent;
use App\EmailThread;
use App\Enquiry;
use App\Http\Controllers\Logistics\GLNResponseController;
use App\Job;
use App\MailboxConnection;
use App\Services\EnquirySequenceService;
use App\Services\Mail\MessageIngestor;
use App\Services\Mail\NormalisedMessage;
use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Demo mail that goes through the REAL pipeline (user, 2026-09-16: "more mails and more loops").
 *
 *     php artisan db:seed --class='\DemoMailLoopSeeder'   (run by FreightDemoSeeder)
 *
 * Every message is handed to `MessageIngestor`, the code a mailbox sync runs, so threading, the regex classifier
 * (branch rules → known client domain → platform domain list → customer enquiry), cargo staging and the claim by
 * a pricing reply all happen as they would for real mail. Each client conversation is then carried as far through
 * the shipment as its row says, using the same models, observer and airline status receiver the app uses — so the
 * automated client updates appear at the step each conversation stopped at.
 */
class DemoMailLoopSeeder extends Seeder
{
    /**
     * Client conversations: [client domain, subject, first mail, where it stops, days ago it started].
     * Stops: new · quoted · lost_price · lost_cancelled · confirmed · draft_awb · booked · departed · arrived ·
     * delivered (completed, the "Delivered" mail still waiting — it shows in the Kanban's Completed column) ·
     * closed (completed and the mail sent — it does not)
     */
    private const LOOPS = [
        ['contoso.test',   'Rate request: 5 pallets BOM to FRA',   "Hello team,\nPlease quote air freight for 5 pallets, gross weight 820 kg, chargeable 910 kg, BOM to FRA. Cargo ready Thursday.", 'confirmed', 2],
        ['globex.test',    'Air quote 12 cartons MAA to DXB',      "Hi,\nWe have 12 cartons, 240 kgs, MAA - DXB. Please share your best rate and transit time.", 'draft_awb', 4],
        ['northwind.test', 'Pharma shipment 6 pcs BOM to JFK',     "Dear team,\n6 pcs temperature controlled pharma, gross 310 kg, BOM to JFK. Need 2-8 degrees handling.", 'booked', 5],
        ['contoso.test',   'Urgent: 3 pallets DEL to LHR',         "Hello,\nUrgent shipment, 3 pallets, gross 450 kg, DEL to LHR. Can you fly it this week?", 'departed', 6],
        ['northwind.test', 'Garments 11 cartons BOM to DXB',       "Hello,\n11 cartons garments, gross 260 kg, BOM to DXB. Please quote.", 'arrived', 3],
        ['globex.test',    'Machine parts 9 pcs BOM to SIN',       "Hi,\n9 pcs machine parts, gross 600 kg, chargeable 640 kg, BOM to SIN. Please quote.", 'delivered', 9],
        ['contoso.test',   'Auto parts 8 pcs BOM to FRA',          "Hello,\n8 pcs auto parts, gross 520 kg, BOM to FRA. Please quote.", 'closed', 12],
        ['northwind.test', 'Quote for 20 cartons BOM to FRA',      "Hello,\n20 cartons textiles, 380 kgs, BOM to FRA. Looking for a rate by tomorrow.", 'lost_price', 7],
        ['contoso.test',   'Rates for 2 pallets BOM to DXB',       "Hi,\nPlease quote 2 pallets, gross 300 kg, BOM to DXB.", 'lost_cancelled', 8],
        ['globex.test',    '4 pcs spare parts BOM to HAM',         "Hello,\n4 pcs spare parts, 95 kg, BOM to HAM. What is your rate?", 'quoted', 9],
        ['northwind.test', 'New enquiry: 7 cartons BOM to SIN',    "Good morning,\n7 cartons, gross 180 kg, BOM to SIN. Please quote air freight.", 'new', 0],
    ];

    /** Counterparty mail and what should classify it: [from, subject, body, days ago]. */
    private const NOTICES = [
        ['cargo@ekcargo.test',       'Flight EK 507 delayed by 3 hours',        'Please note EK 507 departure is delayed by 3 hours due to late inbound aircraft.', 1], // airline list
        ['ops@lhcargo.test',         'Space confirmed on LH 8403',              'Space is confirmed for your booking on LH 8403 tomorrow.', 2],                       // airline list
        ['filings@sharma.test',      'Bill of entry filed for your shipment',   'The bill of entry has been filed. Duty payment is due within 2 days.', 1],         // branch rule: subject
        ['dispatch@bluedart.test',   'Pickup scheduled tomorrow 0900 hrs',      'Truck will reach the shipper at 0900 hrs. Driver details to follow.', 3],          // branch rule: domain
        ['news@freightweekly.test',  'This week in air cargo',                  'Market rates, capacity and more. Unsubscribe at any time.', 4],                      // branch rule: body
    ];

    /**
     * The ordinary back-and-forth on a live shipment (user, 2026-09-16: longer conversations, so the inbox's
     * scrolling can be judged). Added to the shipments that ran furthest; [client, desk, client, …].
     */
    private const CHATTER = [
        "Thanks for the rate. Before we confirm — is the space firm for Thursday, and what is the latest we can hand over the cargo at the warehouse? Our factory finishes packing Wednesday evening and the transporter can reach you by 2100 hrs if that still works for the same flight.",
        "The rate holds and the space is firm for Thursday. Cut-off at the warehouse is 2200 hrs, so 2100 is comfortable. Please send the packing list and the commercial invoice whenever they are ready and we will start the paperwork in parallel.",
        "Packing list and invoice attached. One correction from our side: carton 7 is 3 kg heavier than the earlier list, so the gross goes up slightly. Volumetric should be unchanged as the box size is the same.",
        "Noted, thank you — we have used the revised gross. The chargeable weight is unchanged, so the rate stands as quoted. Nothing further needed from you at this point.",
        "Also, our consignee has asked whether the shipment can be insured through you, and what the premium would be. If it is simpler for them to arrange it at their end, please say so.",
        "We can arrange insurance at 0.35% of the invoice value plus 10%, minimum ₹750. If your consignee already has an open marine policy it is usually cheaper on their side — worth one call before you decide.",
        "Understood. They will use their own policy, so no insurance from your side. Please go ahead with the booking as discussed.",
        "Booked. We will raise the draft air waybill and send it for your check before anything goes to the airline.",
        "One last thing: please mark the AWB with our PO number 44820 in the handling information, the consignee's accounts team asks for it every time.",
        "PO 44820 will be shown in the handling information on the waybill. We will point it out on the draft so you can confirm the placement.",
    ];

    /** A few rules a branch would write, so each step of the classifier is visible. */
    private const RULES = [
        ['Customs filings',    'subject_keyword',     'bill of entry',  'clearance',     10],
        ['BlueDart trucking',  'sender_domain_match', 'bluedart.test',  'trucking_road', 10],
        ['Newsletters',        'body_keyword',        'unsubscribe',    'other',         20],
    ];

    private MailboxConnection $mailbox;
    private User $pricing;
    private User $operations;
    private Agent $branch;
    private int $messageNo = 0;

    public function run(): void
    {
        foreach (['DEMO', 'TACT'] as $code) {
            $company = DB::table('companies')->where('code', $code)->first();
            $prefix = strtolower($code);

            if ($company === null) {
                continue;
            }

            $this->branch = Agent::where('company_id', $company->id)->where('branch_code', 'BOM')->firstOrFail();
            $this->mailbox = MailboxConnection::withoutGlobalScopes()->where('agent_id', $this->branch->id)->firstOrFail();
            $this->pricing = User::where('email', "{$prefix}-pricing@demo.test")->firstOrFail();
            $this->operations = User::where('email', "{$prefix}-operations@demo.test")->firstOrFail();

            $this->seedRules();

            foreach (self::NOTICES as [$from, $subject, $body, $days]) {
                $this->mail($from, $this->mailbox->email_address, $subject, $body, now()->subDays($days)->setTime(10, 15));
            }

            foreach (self::LOOPS as $n => $loop) {
                $this->loop($n, ...$loop);
            }

            $this->command?->info("  {$code}: " . count(self::LOOPS) . ' client conversations and ' . count(self::NOTICES) . ' notices through the mail pipeline');
        }
    }

    private function seedRules(): void
    {
        DB::table('email_classification_rules')->where('agent_id', $this->branch->id)->delete();

        foreach (self::RULES as [$name, $type, $pattern, $target, $priority]) {
            DB::table('email_classification_rules')->insert([
                'agent_id' => $this->branch->id, 'rule_name' => $name, 'rule_type' => $type, 'pattern' => $pattern,
                'target_classification' => $target, 'priority' => $priority, 'is_active' => true,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }

    private function loop(int $n, string $domain, string $subject, string $body, string $stop, int $daysAgo): void
    {
        $client = "shipping@{$domain}";
        $desk = $this->mailbox->email_address;
        $at = now()->subDays($daysAgo)->setTime(9, 30);
        $step = fn (int $hours) => $at->copy()->addHours($hours);

        // 1. The client writes. Sync + regex: classified from the client's domain, cargo and lane staged.
        $first = $this->mail($client, $desk, $subject, $body, $step(0));
        $thread = EmailThread::withoutGlobalScopes()->where('thread_key', $first['thread_key'])->first();

        if ($stop === 'new') {
            return;
        }

        // 2. Pricing answers from the desk mailbox: the first reply claims the conversation for them.
        $this->mail($desk, $client, "RE: {$subject}", "Hello,\nThank you for your enquiry. Our rate is attached, valid for 7 days.", $step(1), $first['message_id']);

        // A real shipment is a long conversation, not two mails: the ones that ran furthest carry the whole exchange.
        if (in_array($stop, ['departed', 'arrived', 'delivered', 'closed'], true)) {
            foreach (self::CHATTER as $i => $line) {
                $inbound = $i % 2 === 0;
                $this->mail(
                    $inbound ? $client : $desk, $inbound ? $desk : $client, "RE: {$subject}", $line,
                    $at->copy()->addHours(2)->addMinutes($i * 25), $first['message_id']
                );
            }
        }

        // 3. The enquiry is raised from what the mail said (as Classify does), and quoted.
        $enquiry = $this->raiseEnquiry($thread->fresh(), $step(1));

        $reply = match ($stop) {
            'quoted' => null,
            'lost_price' => 'Thanks, but your rate is higher than what we have from another forwarder.',
            'lost_cancelled' => 'Our buyer has cancelled the order, so we will not ship this one.',
            default => 'Rate accepted. Please go ahead and book.',
        };

        if ($reply === null) {
            // No answer for over a week: the nightly nudge (enquiries:nudge-stale) picks it up.
            $enquiry->forceFill(['updated_at' => $step(2)])->saveQuietly();

            return;
        }

        $this->mail($client, $desk, "RE: {$subject}", $reply, $step(5), $first['message_id']);

        if (str_starts_with($stop, 'lost')) {
            $enquiry->forceFill(['status' => 'lost', 'lost_reason' => $stop === 'lost_price' ? 'rates_high' : 'client_cancelled', 'lost_at' => $step(6)])->saveQuietly();

            return;
        }

        // 4. Confirmed: the job is created and the observer prepares "Shipment confirmed".
        $job = Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air', 'direction' => 'export',
            'execution_job_no' => app(EnquirySequenceService::class)->next($this->branch->id, 'JOBA'),
            'customer_id' => $enquiry->customer_id, 'pricing_id' => $this->pricing->id, 'ops_id' => $this->operations->id,
            'status' => 'Intake', 'cargo_type' => 'general', 'planned_clearance_date' => $step(48)->toDateString(),
            'awb_number' => '176-' . str_pad((string) (50000000 + $this->branch->id * 100 + $n), 8, '0', STR_PAD_LEFT),
        ]);
        DB::table('email_threads')->where('id', $thread->id)->update(['job_id' => $job->id]);

        // 5. Each later moment: the waiting update is sent before the shipment moves on; the last one is left waiting.
        $moments = [
            'draft_awb' => fn () => $job->update(['status' => 'PDF Generated']),
            'booked'    => fn () => $job->update(['status' => 'Sent to Airline']),
            'departed'  => fn () => $this->cargoStatus($job->awb_number, 'DEP'),
            'arrived'   => fn () => $this->cargoStatus($job->awb_number, 'RCF'),
            'delivered' => fn () => $this->cargoStatus($job->awb_number, 'DLV'),
        ];
        $order = ['confirmed', 'draft_awb', 'booked', 'departed', 'arrived', 'delivered'];
        $last = $stop === 'closed' ? 'delivered' : $stop;

        foreach (array_slice($order, 1, array_search($last, $order, true)) as $k => $moment) {
            $this->sendWaitingUpdate($thread->fresh(), $step(8 + $k * 20), $first['message_id']);
            $moments[$moment]();
        }

        if ($last === 'delivered') {
            $job->update(['status' => 'Completed']);
            if ($stop === 'closed') {
                $this->sendWaitingUpdate($thread->fresh(), $step(130), $first['message_id']);
            }
        }
    }

    /** What Classify does when pricing promotes the conversation: a numbered enquiry carrying the staged cargo. */
    private function raiseEnquiry(EmailThread $thread, Carbon $at): Enquiry
    {
        $cargo = $thread->staged_cargo ? json_decode($thread->staged_cargo, true) : [];
        $weight = $cargo['chargeable_weight']['value'] ?? $cargo['gross_weight']['value'] ?? null;
        $domain = substr(strrchr((string) DB::table('email_messages')->where('thread_key', $thread->thread_key)->where('direction', 'inbound')->value('from'), '@'), 1);

        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air', 'direction' => 'export', 'status' => 'quoted',
            'enquiry_no' => app(EnquirySequenceService::class)->next($this->branch->id, 'ENQA'),
            'customer_id' => DB::table('customers')->where('company_id', $this->branch->company_id)->where('email_domain', $domain)->value('id'),
            'pricing_id' => $this->pricing->id,
            'origin_code' => $cargo['origin']['value'] ?? null, 'dest_code' => $cargo['destination']['value'] ?? null,
            'extracted_pieces' => $cargo['pieces']['value'] ?? null, 'extracted_weight' => $weight,
            'cargo_type' => 'general', 'cargo_data_source' => 'regex',
            'quoted_amount' => 45000 + (int) ($weight ?? 100) * 180, 'quoted_currency' => 'INR',
            'created_at' => $at, 'updated_at' => $at,
        ]);

        DB::table('email_threads')->where('id', $thread->id)->update([
            'enquiry_id' => $enquiry->id, 'status' => 'triaged', 'first_triage_at' => $at,
        ]);

        return $enquiry;
    }

    /** The owner sends the waiting update as drafted: it goes out as a reply and is recorded as sent. */
    private function sendWaitingUpdate(EmailThread $thread, Carbon $at, string $replyTo): void
    {
        $draft = $thread->pending_client_notification;

        if ($draft === null) {
            return;
        }

        // The person filling the draft in: the review link is minted at send, the booking date and airline are typed.
        $body = str_replace(
            ['[review link]', '[date]', '[airline]'],
            [url('/api/d/demo-link'), $at->copy()->addDays(2)->format('j F Y'), 'Emirates SkyCargo'],
            $draft['body']
        );

        $this->mail($this->mailbox->email_address, $draft['to'][0], $draft['subject'], $body, $at, $replyTo);

        $thread->forceFill([
            'pending_client_notification' => null,
            'client_updates' => ($thread->client_updates ?? []) + [$draft['stage'] => ['decision' => 'sent', 'by' => $this->pricing->id, 'at' => $at->toIso8601String()]],
        ])->save();

        DB::table('notifications')->where('type', 'ClientUpdateReady')
            ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.thread_id')) = ?", [(string) $thread->id])->delete();
    }

    /** The airline's Cargo Status message, through the same receiver GLN posts to. */
    private function cargoStatus(string $awb, string $code): void
    {
        $xml = '<rsm:Response xmlns:rsm="iata:response:3" xmlns:ram="iata:datamodel:3"><rsm:MessageHeaderDocument>'
            . '<ram:ID>DEMO-' . substr(md5($awb . $code), 0, 10) . '</ram:ID><ram:Name>Cargo Status</ram:Name><ram:IssueDateTime>' . now()->format('Y-m-d\TH:i:s') . '</ram:IssueDateTime>'
            . '</rsm:MessageHeaderDocument><rsm:BusinessHeaderDocument><ram:ID>' . $awb . $code . '</ram:ID><ram:Name>Air Waybill</ram:Name>'
            . '</rsm:BusinessHeaderDocument></rsm:Response>';

        app(GLNResponseController::class)->store(Request::create('/api/gln-response', 'POST', [], [], [], ['CONTENT_TYPE' => 'application/xml'], $xml));
    }

    /** One message through MessageIngestor. Outbound when it is from the desk mailbox. */
    private function mail(string $from, string $to, string $subject, string $body, Carbon $at, ?string $replyTo = null): array
    {
        $messageId = '<loop-' . $this->branch->id . '-' . (++$this->messageNo) . '@demo.test>';

        app(MessageIngestor::class)->ingest($this->mailbox, [new NormalisedMessage(
            messageId: $messageId, threadId: null, from: $from, to: [$to], cc: [], bcc: [], subject: $subject, snippet: $body,
            receivedAt: $at, direction: $from === $this->mailbox->email_address ? 'outbound' : 'inbound',
            references: $replyTo ? [$replyTo] : [],
        )]);

        return ['message_id' => $messageId, 'thread_key' => DB::table('email_messages')->where('message_id', $messageId)->value('thread_key')];
    }
}
