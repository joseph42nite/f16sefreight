<?php

namespace App\Services;

use App\AccountsInvoice;
use App\AccountsPurchaseVoucher;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * Every document that has been raised and has not reached the ledger (PRD §6.2 document 8).
 *
 * 🔴 **THE TABLE EXISTED AND NOTHING EVER WROTE TO IT.** `LedgerPostingService::write()` deleted from it, the
 * register read it, the Today card counted it — and no code path ever inserted a row. So "Not yet posted" was
 * permanently empty, and worse: **closing an accounting period checks this queue and would therefore always
 * allow the close**, however many documents were still outside the ledger. That is the guard that stops a month
 * being signed off with revenue missing from it.
 *
 * ⚠️ Bookkeeping must never break the document. If the queue row cannot be written — no user to attribute it to
 * on a system-created document — the document still saves. A missing queue row is a gap in a worklist; a refused
 * invoice is a shipment that cannot be billed.
 */
class UnpostedQueue
{
    /** What the ledger calls each document, and where its total comes from. */
    private const SOURCES = [
        AccountsInvoice::class => 'invoice',
        AccountsPurchaseVoucher::class => 'purchase_voucher',
    ];

    /** Put a newly raised document on the queue. */
    public function track(Model $document): void
    {
        $type = self::SOURCES[get_class($document)] ?? null;

        if ($type === null || $this->isPosted($document)) {
            return;
        }

        $createdBy = $document->created_by ?? auth()->id() ?? $this->anyUserOf($document->agent_id);

        if ($createdBy === null) {
            return;   // see the class docblock: bookkeeping never breaks the document
        }

        DB::table('unposted_transactions_queue')->insertOrIgnore([
            'agent_id' => $document->agent_id,
            'company_id' => DB::table('agents_info')->where('id', $document->agent_id)->value('company_id'),
            'created_by' => $createdBy,
            'source_id' => $document->id,
            'source_type' => $type,
            'net_amount' => $this->total($document),
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    /**
     * Keep the queue in step with the document: its total while it is still a draft, and OFF the queue once it is
     * posted or voided — a void document will never reach the ledger, so it is not waiting for anything.
     */
    public function refresh(Model $document): void
    {
        $type = self::SOURCES[get_class($document)] ?? null;

        if ($type === null) {
            return;
        }

        if ($this->isPosted($document) || ($document->status ?? null) === 'void') {
            $this->clear($type, $document->id);

            return;
        }

        $updated = DB::table('unposted_transactions_queue')
            ->where('source_type', $type)->where('source_id', $document->id)
            ->update(['net_amount' => $this->total($document), 'updated_at' => now()]);

        // A document raised before this queue was written to has no row; give it one the first time it changes.
        if ($updated === 0) {
            $this->track($document);
        }
    }

    public function clear(string $type, int $id): void
    {
        DB::table('unposted_transactions_queue')->where('source_type', $type)->where('source_id', $id)->delete();
    }

    /** A voucher carries no header total at all — its lines are the only source there is. */
    private function total(Model $document): float
    {
        return $document instanceof AccountsInvoice
            ? round((float) $document->grand_total, 2)
            : round((float) $document->items()->sum('net_amount'), 2);
    }

    private function isPosted(Model $document): bool
    {
        return $document instanceof AccountsInvoice
            ? (bool) $document->is_posted
            : DB::table('accounts_ledger_entries')->where('source_type', 'purchase_voucher')
                ->where('source_id', $document->id)->exists();
    }

    /** Somebody of that branch's company, for a document the system raised with nobody signed in. */
    private function anyUserOf(?int $agentId): ?int
    {
        if ($agentId === null) {
            return null;
        }

        return DB::table('users')->where('branch_name', $agentId)->orderBy('id')->value('id');
    }
}
