<?php

namespace App\Services\Billing;

use App\AccountsInvoice;
use App\MailboxConnection;
use App\Services\Mail\MailBody;
use App\Services\Mail\MailProviderRegistry;
use App\Services\Mail\SignatureImage;
use App\Services\Mail\ThreadMailer;
use App\Support\Inr;
use App\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * The invoice mail to the client's accounts team (owner, 2026-10-10): "the invoices are sent immediately after the
 * shipment has been executed … a draft message for accounts to send the invoice, with the AWB and the invoice number in
 * the subject line."
 *
 * 🔴 NOTHING GOES ON ITS OWN (guide §4.6). Finalizing drafts it on the bill (`accounts_invoices.client_mail`); accounts
 * sends it as edited, from their own Outlook with the bill attached as a PDF, or skips it. Either way it is kept.
 * The job number is ours and never goes into it; the AWB (air) or the bill of lading (sea) is the client's reference.
 */
class InvoiceMail
{
    /** Who on the client's side pays bills: the contact whose address or role says so. */
    private const ACCOUNTS = '/account|finance|billing|payabl|invoice|\bap\b|^ap@/i';

    /** Draft the mail for a finalized bill a client pays. A credit note, or a bill to a partner, gets none. */
    public function stage(AccountsInvoice $invoice): void
    {
        if (! in_array($invoice->type, ['invoice', 'debit_note'], true) || $invoice->customer_id === null) {
            return;
        }

        $invoice->forceFill(['client_mail' => $this->draft($invoice) + ['state' => 'waiting', 'staged_at' => now()->toIso8601String()]])->save();
    }

    /** @return array{to: array, cc: array, subject: string, body: string} */
    public function draft(AccountsInvoice $invoice): array
    {
        $job = $invoice->job_id ? DB::table('jobs')->where('id', $invoice->job_id)->first(['id', 'awb_number', 'transport_mode', 'enquiry_id']) : null;
        $sea = ($job->transport_mode ?? null) === 'sea';
        $bill = $sea ? DB::table('sea_shipment_details')->where('job_id', $job->id)->first(['hbl_number', 'mbl_number']) : null;
        $reference = $sea ? (($bill->hbl_number ?? null) ?: ($bill->mbl_number ?? null)) : ($job->awb_number ?? null);
        $refLabel = $sea ? 'BL' : 'AWB';
        $enquiry = $job?->enquiry_id ? DB::table('enquiries')->where('id', $job->enquiry_id)->first(['origin_code', 'dest_code']) : null;

        $label = $invoice->type === 'debit_note' ? 'Debit note' : 'Invoice';
        $amount = ($invoice->currency ?: 'INR') . ' ' . Inr::format((float) $invoice->grand_total);
        $terms = DB::table('customers')->where('id', $invoice->customer_id)->value('payment_terms_days');
        $due = $invoice->due_date ? Carbon::parse($invoice->due_date)->format('d M Y') : null;

        $lane = ($enquiry->origin_code ?? null) && ($enquiry->dest_code ?? null) ? " from {$enquiry->origin_code} to {$enquiry->dest_code}" : '';
        $shipment = $reference ? "your shipment{$lane} under {$refLabel} {$reference}" : "your shipment{$lane}";
        $when = (int) $terms === 0 ? 'It is payable now, before the shipment is released.' : ($due ? "It is due by {$due}." : '');

        return [
            'to' => $this->accountsContacts($invoice->customer_id),
            'cc' => [],
            'subject' => trim("{$label} {$invoice->invoice_no}" . ($reference ? " · {$refLabel} {$reference}" : '')),
            'body' => "Hello,\n\nPlease find attached our " . strtolower($label) . " {$invoice->invoice_no} for {$shipment}, for {$amount}. {$when}\n\nKind regards,",
        ];
    }

    /**
     * Send or skip the waiting mail — accounts' approval. Sent from the sender's own Outlook, with the bill attached.
     *
     * @return array{ok: bool, error?: string, reason?: string, status?: int}
     */
    public function decide(AccountsInvoice $invoice, User $by, string $decision, array $edits = []): array
    {
        $mail = $invoice->client_mail;

        if (($mail['state'] ?? null) !== 'waiting') {
            return ['ok' => false, 'error' => 'This mail has already been dealt with.', 'reason' => 'not_waiting', 'status' => 409];
        }

        $mail = array_merge($mail, array_filter($edits, fn ($v) => $v !== null));

        if ($decision === 'send') {
            $result = $this->send($invoice, $by, $mail);
            if (! $result['ok']) {
                return $result;
            }
        }

        $invoice->forceFill(['client_mail' => array_merge($mail, [
            'state' => $decision === 'send' ? 'sent' : 'skipped', 'by' => $by->id, 'by_name' => $by->name, 'at' => now()->toIso8601String(),
        ])])->save();

        return ['ok' => true];
    }

    private function send(AccountsInvoice $invoice, User $by, array $mail): array
    {
        $to = array_values(array_filter((array) ($mail['to'] ?? [])));
        if ($to === []) {
            return ['ok' => false, 'error' => 'Say who it goes to.', 'reason' => 'no_recipient', 'status' => 422];
        }

        $connection = MailboxConnection::withoutGlobalScopes()->where('user_id', $by->id)->where('is_active', true)
            ->whereNull('disconnected_at')->where('auth_state', 'connected')->latest('id')->first();
        if ($connection === null) {
            return ['ok' => false, 'error' => 'Connect your Outlook first (in Settings), so the invoice goes from you.', 'reason' => 'no_mailbox', 'status' => 422];
        }

        $pdf = app(BillPdf::class);
        $attachments = [['name' => $pdf->filename([$invoice->invoice_no]), 'mime_type' => 'application/pdf', 'bytes' => $pdf->render([$invoice])]];
        $signature = app(ThreadMailer::class)->signatureFor($connection, $by);
        $image = app(SignatureImage::class)->for($connection);
        if ($image !== null) {
            $attachments[] = $image;
        }

        $result = app(MailProviderRegistry::class)->for($connection->provider)->send(
            $connection, $to, array_values(array_filter((array) ($mail['cc'] ?? []))), (string) $mail['subject'],
            app(MailBody::class)->forEmail((string) $mail['body'], $signature, $image), null, $attachments
        );

        return $result['ok'] ? ['ok' => true]
            : ['ok' => false, 'error' => $result['error'] ?? 'The mail provider refused the message.', 'reason' => 'send_failed', 'status' => 502];
    }

    /** The client's accounts people; failing that, the one they write from most. Never someone who opted out. */
    private function accountsContacts(int $customerId): array
    {
        $contacts = DB::table('customer_contacts')->where('customer_id', $customerId)->whereNull('opted_out_at')
            ->orderByDesc('message_count')->get(['email', 'designation']);

        $accounts = $contacts->filter(fn ($c) => preg_match(self::ACCOUNTS, $c->email . ' ' . $c->designation))->pluck('email');

        return ($accounts->isNotEmpty() ? $accounts : $contacts->take(1)->pluck('email'))->values()->all();
    }
}
