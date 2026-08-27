<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * partners — carriers, airlines, co-loaders, transporters, brokers, agents and vendors
 * onboarded by a tenant. The counterpart to `customers`: money goes OUT to these.
 *
 * Eleven foreign keys land here as the schema fills in — every buy-side and carrier
 * reference in the product (purchase vouchers, CASS statements, brokerage and consol
 * invoice details, all five party roles on sea_shipment_details, and the polymorphic
 * party_id on job_entities / rate_cards / accounts_invoices).
 *
 * ── Why this exists alongside the legacy `airlines` table ────────────────────
 * Both are kept, and they are not duplicates (PRD.md §10, CONTEXT.md §5). `airlines`
 * is retained for the email exclusion engine's carrier-DOMAIN list — it answers "is
 * this inbound mail from a carrier?". `partners` holds the accounting and operational
 * record — who we owe money to, who carried the cargo. Do not merge them and do not
 * write new accounting logic against `airlines`.
 *
 * ── One table, nine partner_type values, deliberately ────────────────────────
 * A freight partner is routinely more than one thing at once: the same company is the
 * co-loader on one shipment and the transporter on another. Separate tables per type
 * would duplicate the party and split its ledger. Role is a property of the
 * RELATIONSHIP (job_entities.role, sea_shipment_details' five FKs), not of the party —
 * partner_type is only the primary classification for filtering and defaults.
 *
 * ── 🔐 bank_account_no / bank_ifsc_code are TEXT — same correction as customers ──
 * The schema doc again gives two widths (VARCHAR(50) in the column table, VARCHAR(255)
 * in the DDL) and both fail against the encrypted cast, measured 2026-08-27:
 * a 10-char account number encrypts to 200 chars, and a 34-char IBAN to 256 — one over
 * VARCHAR(255). Vendor payouts run through these columns, so a truncated account number
 * is a payment to nowhere. TEXT costs nothing; they are never indexed.
 *
 * ⚠️ THE COLUMN TYPE ENCRYPTS NOTHING — the `encrypted` cast on the model does, and
 * that is Step 2. Until it exists, any write stores vendor bank details IN PLAINTEXT.
 * See GAPS.md #3.
 *
 * ── No deleted_at ────────────────────────────────────────────────────────────
 * PRD.md §9.3 names six soft-deleting tables and this is not one. A partner referenced
 * by a posted voucher must not vanish; deactivation is a later product concern.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id');
            $table->string('name', 100);

            // airline | shipping_line | co-loader | transporter | customs_broker
            // | agent | broker | vendor | other
            $table->string('partner_type', 30);

            $table->string('email', 100)->nullable();
            $table->string('phone', 30)->nullable();
            $table->text('address')->nullable();

            $table->string('gst_no', 30)->nullable();
            $table->string('pan_no', 20)->nullable();

            $table->string('bank_name', 100)->nullable();
            $table->text('bank_account_no')->nullable(); // encrypted cast — see above
            $table->text('bank_ifsc_code')->nullable();  // encrypted cast — see above

            $table->timestamps();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('partners');
    }
};
