<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * sea_shipment_details + air_shipment_details — the ACTUAL shipped figures.
 *
 * 🔴 **A job populates exactly ONE of these. Never both.**
 * Two separate 1-to-1 tables rather than one wide table with half the columns always
 * NULL: air and sea are different documents, different units and different customs
 * regimes (PRD.md §5.2.7). `job_id` is UNIQUE on each, which is what makes it 1-to-1.
 * The "exactly one" half is enforced in the model boot and asserted in tests — the
 * database cannot express it, so a sea job carrying air details is an application bug
 * that no constraint will catch.
 *
 * ── These figures NEVER write back to the enquiry ───────────────────────────
 * `enquiries.extracted_*` is what the client DECLARED; these are what actually shipped.
 * The gap between them is the under-declaration signal — the single most valuable thing
 * the two tables produce together — so both sides must survive independently. Variance
 * is computed as a join when needed and flagged above 20% (guide §4.5).
 *
 * ── Sea carries five separate partner roles ────────────────────────────────
 * carrier, customs broker, transporter, haulage provider, handling agent — all FKs into
 * `partners`, all nullable, all RESTRICT. Five columns rather than five job_entities
 * rows because these are structural fields on the shipment document itself, populated
 * from the FocusSea tabs, not free-form parties.
 *
 * ── Route codes are LOCODEs, and there are four of them for sea ─────────────
 * POR / POL / POD / DEL — place of receipt, port of loading, port of discharge, place of
 * delivery. Air needs only POL/POD because there is no inland leg in the document.
 * CHAR(5) matches `ports.locode`; deliberately NOT foreign-keyed, because the port
 * directory is not loaded yet (GAPS.md #1) and a hard FK would block every sea job.
 *
 * ── sea soft-deletes; air does NOT ─────────────────────────────────────────
 * PRD.md §9.3 names six soft-deleting tables and `sea_shipment_details` is among them
 * while `air_shipment_details` is not. Asymmetric, and deliberately preserved as
 * specified rather than "tidied" into consistency.
 */
return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('sea_shipment_details')) {
            Schema::create('sea_shipment_details', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('job_id')->unique(); // UNIQUE = the 1-to-1

                $table->unsignedBigInteger('carrier_id')->nullable();
                $table->string('vessel_name', 100)->nullable();
                $table->string('voyage_no', 30)->nullable();
                $table->string('vessel_flag', 50)->nullable();
                $table->string('imo_number', 20)->nullable();

                // UN/LOCODEs — not FK'd; the ports directory is not loaded yet.
                $table->char('por_code', 5)->nullable(); // place of receipt
                $table->char('pol_code', 5)->nullable(); // port of loading
                $table->char('pod_code', 5)->nullable(); // port of discharge
                $table->char('del_code', 5)->nullable(); // place of delivery
                $table->boolean('transshipment_required')->default(false);

                // Dangerous goods: an IMDG class requires a UN number (cross-field rule,
                // validated in the form — guide §4.1.2 — not at the database).
                $table->string('imdg_class', 10)->nullable();
                $table->string('un_number', 10)->nullable();

                $table->string('hbl_number', 30)->nullable();
                $table->string('mbl_number', 30)->nullable();
                $table->string('freight_terms', 20)->nullable();

                $table->integer('piece_count')->default(0);
                $table->decimal('gross_weight', 10, 3)->default(0);
                $table->decimal('net_weight', 10, 3)->default(0);
                $table->decimal('chargeable_weight', 10, 3)->default(0);
                $table->decimal('volume_cbm', 8, 3)->default(0);

                $table->string('filing_status', 20)->default('pending');

                $table->unsignedBigInteger('customs_broker_id')->nullable();
                $table->unsignedBigInteger('transporter_id')->nullable();
                $table->unsignedBigInteger('haulage_provider_id')->nullable();
                $table->unsignedBigInteger('handling_agent_id')->nullable();

                $table->string('shipping_bill_no', 30)->nullable();
                $table->date('shipping_bill_date')->nullable();
                $table->string('igm_no', 30)->nullable();
                $table->date('igm_date')->nullable();
                $table->string('container_type', 20)->nullable();

                $table->timestamps();
                $table->softDeletes();

                $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
                foreach (['carrier_id', 'customs_broker_id', 'transporter_id', 'haulage_provider_id', 'handling_agent_id'] as $col) {
                    $table->foreign($col)->references('id')->on('partners');
                }
            });
        }

        if (! Schema::hasTable('air_shipment_details')) {
            Schema::create('air_shipment_details', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('job_id')->unique();

                $table->string('flight_number', 20)->nullable();
                $table->timestamp('flight_date')->nullable();
                // Free text, not an FK: the operating carrier on an air waybill is often
                // recorded before the partner record exists.
                $table->string('carrier_name', 100)->nullable();

                $table->char('pol_code', 5)->nullable();
                $table->char('pod_code', 5)->nullable();

                $table->string('do_given_to', 100)->nullable();
                $table->string('pickup_address', 500)->nullable();
                $table->string('delivery_address', 500)->nullable();

                $table->integer('piece_count')->default(0);
                $table->decimal('gross_weight', 10, 3)->default(0);
                // No net_weight on air — the DDL omits it; air prices on chargeable weight.
                $table->decimal('chargeable_weight', 10, 3)->default(0);
                $table->decimal('volume_cbm', 8, 3)->default(0);

                $table->timestamps(); // no softDeletes — see the docblock

                $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('air_shipment_details');
        Schema::dropIfExists('sea_shipment_details');
    }
};
