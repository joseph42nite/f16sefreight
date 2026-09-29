<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Import, both modes (GAPS #434) — `database_relations_tree.md` #46 and #47.
 *
 * `air_import_details` holds PRD §8.1's air import fields; `delivery_orders` is the DO of PRD §5.8 (sea) and §5.9
 * (air), one per job. Sea import needs no table of its own: `sea_shipment_details` already carries the IGM.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('air_import_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('job_id')->unique();
            $table->dateTime('arrived_at')->nullable();
            $table->unsignedSmallInteger('free_storage_days')->nullable();
            $table->date('storage_from')->nullable();
            $table->string('igm_no', 20)->nullable();
            $table->date('igm_date')->nullable();
            $table->string('filing_status', 20)->default('not_filed');
            $table->unsignedBigInteger('handling_agent_id')->nullable();
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
            $table->foreign('handling_agent_id')->references('id')->on('partners')->nullOnDelete();
        });

        DB::statement("ALTER TABLE air_import_details ADD CONSTRAINT chk_air_import_filing
            CHECK (filing_status IN ('not_filed','submitted','cleared','rejected'))");

        Schema::create('delivery_orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('job_id')->unique();
            $table->string('do_number', 30);
            $table->date('do_date');
            $table->string('do_given_to', 150)->nullable();
            $table->unsignedBigInteger('can_id')->nullable();
            $table->unsignedBigInteger('invoice_id')->nullable();
            $table->decimal('fee', 12, 2)->nullable();
            $table->string('status', 12)->default('draft');
            $table->timestamp('released_at')->nullable();
            $table->unsignedBigInteger('released_by')->nullable();
            $table->timestamps();

            $table->unique(['agent_id', 'do_number'], 'uq_do_agent_no');
            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
            $table->foreign('can_id')->references('id')->on('cargo_arrival_notices')->nullOnDelete();
            $table->foreign('invoice_id')->references('id')->on('accounts_invoices')->nullOnDelete();
            $table->foreign('released_by')->references('id')->on('users')->nullOnDelete();
        });

        DB::statement("ALTER TABLE delivery_orders ADD CONSTRAINT chk_do_status CHECK (status IN ('draft','released'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_orders');
        Schema::dropIfExists('air_import_details');
    }
};
