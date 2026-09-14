<?php

use App\Services\VirusScanner;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Sample files on the demo mails that say "Dimensions and packing list attached."
 *
 *     php artisan db:seed --class=DemoMailAttachmentsSeeder
 *
 * 🔴 The demo mails SAID a packing list was attached and carried none, because the demo
 * mailboxes are not real Outlook accounts and nothing could be fetched from them. These are
 * generated here, marked SAMPLE on the page, and stored as already fetched — so the chips,
 * opening a file and Extract all work in the demo.
 *
 * ⚠️ Scanned like any real attachment before it is stored; without a scanner this stops.
 */
class DemoMailAttachmentsSeeder extends Seeder
{
    private const SNIPPET = '%packing list attached%';

    /** A consignee at the destination, so the sample agrees with the lane in its mail. */
    private const CONSIGNEES = [
        'SIN' => ['Harbourline Trading Pte Ltd', '10 Pioneer Road', 'Singapore 628460, Singapore'],
        'FRA' => ['Mainfeld Industriebedarf GmbH', 'Hanauer Landstrasse 291', '60314 Frankfurt am Main, Germany'],
        'HAM' => ['Nordhafen Handels GmbH', 'Grosse Elbstrasse 145', '22767 Hamburg, Germany'],
        'DXB' => ['Creekside General Trading LLC', 'Warehouse 7, Al Quoz 3', 'Dubai, United Arab Emirates'],
        'JFK' => ['Atlantic Supply Co', '145-20 Rockaway Blvd', 'Jamaica, NY 11436, USA'],
        'LHR' => ['Thameside Components Ltd', 'Unit 4, Heathrow Way', 'Hounslow TW6 2GA, United Kingdom'],
    ];

    public function run(): void
    {
        $scanner = app(VirusScanner::class);
        $messages = DB::table('email_messages')
            ->where('direction', 'inbound')
            ->where('body_snippet', 'like', self::SNIPPET)
            ->whereNotExists(fn ($q) => $q->select(DB::raw(1))->from('email_attachments')
                ->whereColumn('email_attachments.email_message_id', 'email_messages.id'))
            ->get(['id', 'thread_key', 'subject', 'from', 'received_at']);

        foreach ($messages as $message) {
            $thread = DB::table('email_threads')->where('thread_key', $message->thread_key)->first(['staged_cargo', 'enquiry_id']);
            $facts = $this->facts($message, $thread);

            foreach (['Commercial Invoice (sample).pdf' => 'invoice', 'Packing List (sample).pdf' => 'packing'] as $name => $kind) {
                $bytes = Pdf::loadHTML($this->html($kind, $facts))->output();

                if (! $scanner->scan($bytes)['clean']) {
                    throw new RuntimeException("The virus scan refused the generated {$name}.");
                }

                $id = DB::table('email_attachments')->insertGetId([
                    'email_message_id' => $message->id, 'filename' => $name, 'mime_type' => 'application/pdf',
                    'size_bytes' => strlen($bytes), 'fetch_state' => 'cached',
                    'cache_expires_at' => now()->addDays(90), 'created_at' => now(), 'updated_at' => now(),
                ]);

                $path = 'mail-attachments/' . $id;
                Storage::disk('local')->put($path, $bytes);
                DB::table('email_attachments')->where('id', $id)->update(['file_path' => $path]);
            }
        }

        $this->command?->info('Sample attachments added to ' . $messages->count() . ' demo mail(s).');
    }

    /** What the sample documents say, taken from the thread so they agree with its mail. */
    private function facts(object $message, ?object $thread): array
    {
        $cargo = json_decode($thread->staged_cargo ?? 'null', true) ?: [];
        $customer = $thread && $thread->enquiry_id
            ? DB::table('enquiries')->join('customers', 'customers.id', '=', 'enquiries.customer_id')
                ->where('enquiries.id', $thread->enquiry_id)->value('customers.name')
            : null;

        return [
            'shipper' => $customer ?: ucfirst(explode('.', substr(strrchr($message->from, '@'), 1))[0]) . ' Exports',
            'origin' => $cargo['origin']['value'] ?? 'BOM',
            'destination' => $cargo['destination']['value'] ?? 'SIN',
            'pieces' => $cargo['pieces']['value'] ?? 3,
            'date' => substr((string) $message->received_at, 0, 10),
            'reference' => 'SAMPLE-' . $message->id,
        ];
    }

    private function html(string $kind, array $f): string
    {
        $e = fn ($v) => htmlspecialchars((string) $v, ENT_QUOTES);
        $title = $kind === 'invoice' ? 'COMMERCIAL INVOICE' : 'PACKING LIST';
        $rows = $kind === 'invoice'
            ? '<tr><td>Industrial fasteners, zinc plated</td><td>' . $e($f['pieces']) . ' pallets</td><td>USD 1,240.00</td></tr>'
            : '<tr><td>' . $e($f['pieces']) . ' pallets</td><td>120 x 100 x 110 CM each</td><td>Gross 480 kg · Net 452 kg</td></tr>';
        $head = $kind === 'invoice' ? '<th>Description</th><th>Quantity</th><th>Amount</th>' : '<th>Packages</th><th>Dimensions</th><th>Weight</th>';

        return '<html><body style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">'
            . '<p style="color:#b42318;font-weight:bold;">SAMPLE — demo data, not a real document</p>'
            . '<h2>' . $title . '</h2>'
            . '<p>No. ' . $e($f['reference']) . ' · Date ' . $e($f['date']) . '</p>'
            . '<table width="100%" cellpadding="4"><tr><td valign="top"><b>Shipper</b><br>' . $e($f['shipper'])
            . '<br>Plot 42/A, MIDC Andheri East<br>Mumbai 400093, Maharashtra, India</td>'
            . '<td valign="top"><b>Consignee</b><br>' . implode('<br>', array_map($e, self::CONSIGNEES[$f['destination']] ?? self::CONSIGNEES['SIN'])) . '</td></tr></table>'
            . '<p><b>Airport of departure:</b> ' . $e($f['origin']) . ' &nbsp; <b>Airport of destination:</b> ' . $e($f['destination']) . '</p>'
            . '<table width="100%" border="1" cellspacing="0" cellpadding="4"><tr>' . $head . '</tr>' . $rows . '</table>'
            . '</body></html>';
    }
}
