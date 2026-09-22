<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Our own GSTIN — GAPS.md #36, open since 2026-08-27 and due "before the first GST return is filed".
 *
 * 🔴 **`gst_no` existed on `customers` and `partners` — the COUNTERPARTIES — and nowhere on us.** PRD §1550's
 * split rule is *"if the first two digits of the counterparty GSTIN match **our branch state code**, apply
 * CGST + SGST, otherwise IGST"*, and our own state code was not stored anywhere. `GstSplitService` therefore
 * refused to guess and returned `supplier_gstin_missing`, which meant **no `gst_ledger_entries` row was ever
 * written for any document** — the register the return is filed from was structurally empty.
 *
 * ⚠️ **It hangs off the BRANCH, not the company** (user, 2026-09-22: "add gst_no for agent_info as well").
 * A GSTIN is issued per registered place of business per state: a forwarder with offices in Maharashtra and
 * Tamil Nadu holds two, files two GSTR-1s, and the CGST/SGST-versus-IGST answer for the same client differs
 * between them. Putting it on `companies` would force one state's answer onto every branch — and the split is
 * precisely the thing that cannot be got wrong, because the invoice total is identical either way and nothing
 * looks broken until the customer cannot claim their input credit.
 *
 * `gst_ledger_entries` keeps BOTH `agent_id` and `company_id` for the same reason: the ledger is per branch,
 * and the company is how the branches of one business are told from another's.
 *
 * Nullable: an overseas branch has no GSTIN, and a real one is a fact somebody must enter rather than a
 * default we can invent. Until it is entered the split stays undeterminable — visible, and refusing to guess.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('agents_info', function (Blueprint $table) {
            // VARCHAR(30) to match `customers.gst_no` and `partners.gst_no`. A GSTIN is 15 characters;
            // the extra room is what the counterparty columns already chose, and one width for one fact
            // is worth more than three saved bytes.
            $table->string('gst_no', 30)->nullable()->after('branch_code');
        });
    }

    public function down(): void
    {
        Schema::table('agents_info', function (Blueprint $table) {
            $table->dropColumn('gst_no');
        });
    }
};
