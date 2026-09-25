<?php

namespace App\Console\Commands;

use App\AccountsInvoice;
use App\AccountsPurchaseVoucher;
use App\Http\Controllers\Freight\InvoiceController;
use App\Http\Controllers\Freight\PurchaseVoucherController;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Write the GST register row for every POSTED document that does not have one (user, 2026-09-26, GAPS #396).
 *
 *     php artisan accounts:backfill-gst-register --dry-run
 *     php artisan accounts:backfill-gst-register
 *
 * Two kinds of gap, one fix: documents posted before `agents_info.gst_no` landed on 2026-09-22 (the split could
 * not be determined then, so nothing was written), and purchase vouchers, which never wrote a row at all until
 * today. Each row goes through the same `writeGstRegister()` the controllers call on post — nothing is computed
 * here that the product itself would not compute.
 *
 * ⚠️ Idempotent: a document that already has a row is skipped, so running it twice writes nothing the second
 * time. A document whose split is still undeterminable (no GSTIN on our branch, or none on the counterparty)
 * is skipped by `writeGstRegisterRow()` exactly as it would be on post, and counted as such.
 *
 * ⚠️ `created_at` on a backfilled row is when it was written — today. The register screen shows the document's
 * own date, and `GstReturnService` reads the register by document id, never by date, so nothing depends on it.
 */
class BackfillGstRegister extends Command
{
    protected $signature = 'accounts:backfill-gst-register {--dry-run : Count what would be written, write nothing}';

    protected $description = 'Write the GST register row for every posted invoice and purchase voucher that lacks one';

    public function handle(InvoiceController $invoices, PurchaseVoucherController $vouchers): int
    {
        // Zero-tax documents (exports, exempt brokerage) never get a row by design, so they are not candidates —
        // otherwise every run would report them as "skipped" and tell somebody to fix a GSTIN that is not the issue.
        $invoiceIds = AccountsInvoice::withoutGlobalScopes()
            ->where('is_posted', true)
            ->where('tax_amount', '>', 0)
            ->whereNotExists(fn ($q) => $q->from('gst_ledger_entries')
                ->where('voucher_type', 'invoice')->whereColumn('voucher_id', 'accounts_invoices.id'))
            ->pluck('id');

        // A voucher's posted state is DERIVED from the ledger, not stored — see PurchaseVoucherController::isPosted.
        // Its tax likewise lives only on the items; there is no header column to read.
        $voucherIds = AccountsPurchaseVoucher::withoutGlobalScopes()
            ->whereExists(fn ($q) => $q->from('accounts_ledger_entries')
                ->where('source_type', 'purchase_voucher')->whereColumn('source_id', 'accounts_purchase_vouchers.id'))
            ->whereExists(fn ($q) => $q->from('accounts_purchase_items')
                ->whereColumn('purchase_voucher_id', 'accounts_purchase_vouchers.id')->where('tax_amount', '>', 0))
            ->whereNotExists(fn ($q) => $q->from('gst_ledger_entries')
                ->where('voucher_type', 'purchase_voucher')->whereColumn('voucher_id', 'accounts_purchase_vouchers.id'))
            ->pluck('id');

        $this->line(sprintf('%d posted taxable invoice(s) and %d posted taxable purchase voucher(s) have no register row.',
            $invoiceIds->count(), $voucherIds->count()));

        if ($this->option('dry-run')) {
            $this->info('Dry run — nothing written.');

            return self::SUCCESS;
        }

        $before = DB::table('gst_ledger_entries')->count();

        DB::transaction(function () use ($invoiceIds, $voucherIds, $invoices, $vouchers) {
            AccountsInvoice::withoutGlobalScopes()->whereIn('id', $invoiceIds)->get()
                ->each(fn ($invoice) => $invoices->writeGstRegister($invoice));

            AccountsPurchaseVoucher::withoutGlobalScopes()->with(['vendor', 'items'])->whereIn('id', $voucherIds)->get()
                ->each(fn ($voucher) => $vouchers->writeGstRegister($voucher));
        });

        $written = DB::table('gst_ledger_entries')->count() - $before;
        $skipped = $invoiceIds->count() + $voucherIds->count() - $written;

        $this->info("{$written} register row(s) written.");

        if ($skipped > 0) {
            // Said, not hidden: these are the ones a branch or counterparty GSTIN would fix.
            $this->warn("{$skipped} skipped — the split is still undeterminable (no GSTIN on our branch or on the "
                . 'counterparty). Set the GSTIN and run this again.');
        }

        return self::SUCCESS;
    }
}
