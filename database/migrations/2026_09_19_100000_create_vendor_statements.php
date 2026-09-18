<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * What a supplier says we owe, beside what we booked (user, 2026-09-19: "about the CASS, create based on per client —
 * vendor could be airlines, trucking, misc, add all types").
 *
 * 🔴 **Not an airline table.** CASS is the airlines' own settlement, and `accounts_cass_statements` holds its shape;
 * but a trucker's monthly bill, a broker's statement and a warehouse's charges pose the identical question — *does
 * this agree with our vouchers?* — so one pair of tables serves every `partners.partner_type`, CASS included.
 *
 * 🔴 **Their figures are never edited.** A statement line keeps what the supplier billed, exactly; our side is read
 * from the vouchers each time it is compared. An imported figure that could be corrected in place is a figure nobody
 * can argue from.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendor_statements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id')->index();
            $table->unsignedBigInteger('vendor_id');
            // Copied from the partner at import so a statement still reads correctly if the partner is re-classified.
            $table->string('vendor_type', 30);
            $table->string('period', 50);
            $table->string('statement_no', 60)->nullable();
            $table->date('statement_date')->nullable();
            $table->string('currency', 3)->default('INR');
            $table->decimal('their_total', 15, 2)->default(0);
            $table->string('status', 20)->default('imported');
            $table->unsignedBigInteger('imported_by')->nullable();
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('vendor_id')->references('id')->on('partners');
            $table->unique(['agent_id', 'vendor_id', 'period'], 'uq_vendor_statement_period');
        });

        Schema::create('vendor_statement_lines', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vendor_statement_id');
            // What the supplier calls the shipment: an AWB for an airline, a job or a docket for anyone else.
            $table->string('reference', 60)->nullable();
            $table->string('description', 255)->nullable();
            $table->date('charge_date')->nullable();
            $table->decimal('chargeable_weight', 12, 2)->nullable();
            $table->decimal('rate', 15, 4)->nullable();
            $table->decimal('their_amount', 15, 2)->default(0);
            // Filled when the line is compared: what our vouchers hold for that shipment and supplier.
            $table->unsignedBigInteger('matched_job_id')->nullable();
            $table->unsignedBigInteger('matched_voucher_id')->nullable();
            $table->decimal('our_amount', 15, 2)->nullable();
            $table->decimal('difference', 15, 2)->nullable();
            $table->string('state', 20)->default('unmatched');
            $table->string('dispute_note', 500)->nullable();
            $table->timestamps();

            $table->foreign('vendor_statement_id')->references('id')->on('vendor_statements')->cascadeOnDelete();
            $table->foreign('matched_job_id')->references('id')->on('jobs')->nullOnDelete();
            $table->foreign('matched_voucher_id')->references('id')->on('accounts_purchase_vouchers')->nullOnDelete();
            $table->index(['vendor_statement_id', 'state']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendor_statement_lines');
        Schema::dropIfExists('vendor_statements');
    }
};
