<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * customer_contacts — the per-client address book, and the CC source for sales outreach.
 *
 * `email_messages.from` is a raw log of everything ever received. THIS is the curated
 * directory: who actually works at the client, which branch they belong to, and whether
 * a human has cleared them to be copied on outreach.
 *
 * ── The whole point of this table: harvest automatically, CC deliberately ────
 * `include_in_cc` DEFAULTS TO FALSE and is never set by the harvester (PRD.md §5.2 /
 * §7.3.7). Every inbound sender on a matching domain is upserted here automatically —
 * which, over a year on a @globex.com thread, collects departed staff, personal
 * addresses, the client's customs broker, and a competitor who was CC'd once on a
 * quote. Blind-CC'ing that set is simultaneously a commercial incident and a DPDP one.
 * The system builds the list; a human ticks the boxes.
 *
 * ── opted_out_at is absolute ─────────────────────────────────────────────────
 * Non-NULL means NEVER contacted, overriding include_in_cc unconditionally (DPDP Act
 * 2023 — PRD.md §9.3). The harvester may still bump last_seen_at/message_count for
 * recency, but must never clear this column or re-enable the contact.
 *
 * ── idx_contacts_cc mirrors the outreach query exactly ───────────────────────
 * PRD.md §7.3.7 resolves recipients as:
 *     WHERE customer_id = ? AND include_in_cc = true AND opted_out_at IS NULL
 * The index columns are in that order deliberately. This runs at every draft
 * generation, so it must not degrade to a scan of the tenant's whole address book.
 *
 * ── Two cascades, both correct ───────────────────────────────────────────────
 * Deleting the tenant or the client branch removes their contacts. A contact has no
 * meaning without the customer it belongs to, and leaving orphans in an address book
 * that feeds outbound email is how mail gets sent to a client who was removed.
 *
 * ── UNIQUE is (customer_id, email), not email alone ──────────────────────────
 * One person legitimately appears under two branches of the same client group, and two
 * different tenants may both know the same freight contact. Uniqueness is per branch.
 *
 * ❓ NOTHING ENFORCES A SINGLE is_primary PER CUSTOMER. The DDL specifies no such
 * constraint, so two rows can both claim to be the default `To:` recipient and the
 * outreach draft's addressee becomes whichever the optimiser returns first. Left as
 * specified rather than invented — see implementation_guide.md §Batch 1a·5.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::create('customer_contacts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('customer_id');

            $table->string('email', 255);
            $table->string('name', 100)->nullable();
            $table->string('designation', 100)->nullable();
            $table->string('source', 20)->default('inbound_harvest'); // inbound_harvest | manual | onboarding

            $table->boolean('is_primary')->default(false);
            $table->boolean('include_in_cc')->default(false); // never set by the harvester

            $table->timestamp('verified_at')->nullable();
            $table->timestamp('last_seen_at')->nullable();
            $table->integer('message_count')->default(0);
            $table->timestamp('opted_out_at')->nullable(); // absolute; overrides include_in_cc

            $table->timestamps();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');

            $table->unique(['customer_id', 'email'], 'uk_contact_customer_email');
            $table->index(['company_id', 'email'], 'idx_contacts_tenant_email');
            $table->index(['customer_id', 'include_in_cc', 'opted_out_at'], 'idx_contacts_cc');
        });
    }

    public function down()
    {
        Schema::dropIfExists('customer_contacts');
    }
};
