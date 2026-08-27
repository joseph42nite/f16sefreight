<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * customers — the shippers, consignees, notify parties and debtors a tenant onboards.
 *
 * NOT platform tenants. `companies` holds the forwarding firms subscribing to F16s OS;
 * this holds THEIR clients. `tier` and the credit columns on `companies` mean nothing
 * here, and `company_id` below is the owning tenant, not the customer's own company.
 *
 * ── email_domain does three jobs, and the third is structural ────────────────
 * It attributes inbound mail (sender @suffix -> customer -> sales_id), powers domain
 * search, and — the load-bearing one — IS THE CLIENT-GROUP KEY. Every row sharing
 * (company_id, email_domain) is one client company with several branches. The group is
 * DERIVED from that pair; there is deliberately no parent_customer_id. Accepts a
 * comma-separated list where a client uses several domains.
 *
 * ── credit_limit is PER BRANCH, deliberately ─────────────────────────────────
 * The credit gate blocks on this row's own exposure, never the group total: separate
 * GSTINs are separate billing entities, and one branch's overdue invoice must not
 * freeze another branch's cargo. Group exposure is DISPLAYED as a roll-up, never
 * enforced on.
 *
 * ── The two indexes are NOT optional ─────────────────────────────────────────
 * idx_customers_domain is hit on EVERY inbound mail; idx_customers_sales on EVERY
 * Command-tier sales-dashboard query. Both are the hottest paths in the product, and
 * both lead with company_id because every query is tenant-scoped first.
 *
 * ── 🔐 bank_account_no / bank_ifsc_code are TEXT, and that is a correction ────
 * The schema doc gives two different widths — VARCHAR(50) in the column table,
 * VARCHAR(255) in the DDL — and MEASURED against Laravel's encrypted cast on
 * 2026-08-27, both fail:
 *     10-char account no -> 200 chars encrypted   (VARCHAR(50) fails on every row)
 *     31-char IBAN (Malta, longest common) -> 228
 *     34-char IBAN (ISO 13616 maximum)     -> 256  <-- one char over VARCHAR(255)
 * A 34-character IBAN is legal, so VARCHAR(255) silently breaks for real customers of
 * the exact kind an international forwarder has. TEXT costs nothing for short values
 * and removes the cliff entirely. These columns are never indexed, so nothing is lost.
 *
 * ⚠️ THE COLUMN TYPE DOES NOT ENCRYPT ANYTHING. The `encrypted` cast on the Eloquent
 * model does, and the model is Step 2. Until that cast exists, ANY write to these two
 * columns stores the customer's bank details IN PLAINTEXT. Add the cast with the model,
 * not after (implementation_guide.md §Batch 1a, "Encrypt at rest").
 *
 * ── Foreign keys are inline here, not deferred ───────────────────────────────
 * The guide defers customers -> ports / agents_info / users to a cyclic-constraint
 * ALTER at the end of Batch 1c. That deferral is an artifact of the greenfield DDL
 * script, where `users` is created AFTER `customers`. In this codebase users and
 * agents_info are live and `ports` was created in step 2 of this batch, so there is no
 * cycle to break — every target already exists. Declaring them now means the database
 * enforces integrity from the first row rather than from the end of Batch 1c.
 *
 * ⚠️ The three optional FKs are RESTRICT (no ON DELETE clause in the DDL). See the note
 * in implementation_guide.md §Batch 1a·4 — SET NULL may well be intended for sales_id.
 * RESTRICT is the safe reading: a blocked delete is loud and fixable, a silent
 * unassignment is neither.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id');
            $table->string('name', 100);
            $table->string('email_domain', 100)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('phone', 30)->nullable();
            $table->text('address')->nullable();

            $table->string('gst_no', 30)->nullable();
            $table->string('pan_no', 20)->nullable();
            $table->string('duns_no', 20)->nullable();

            $table->string('bank_name', 100)->nullable();
            $table->text('bank_account_no')->nullable(); // encrypted cast — see above
            $table->text('bank_ifsc_code')->nullable();  // encrypted cast — see above

            $table->integer('payment_terms_days')->default(30);
            $table->decimal('credit_limit', 15, 2)->default(0.00);

            $table->unsignedBigInteger('default_port_id')->nullable();
            $table->unsignedBigInteger('branch_id')->nullable();
            $table->unsignedBigInteger('sales_id')->nullable();

            $table->timestamps();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('default_port_id', 'fk_customers_default_port')->references('id')->on('ports');
            $table->foreign('branch_id', 'fk_customers_branch')->references('id')->on('agents_info');
            $table->foreign('sales_id', 'fk_customers_sales')->references('id')->on('users');

            $table->index(['company_id', 'email_domain'], 'idx_customers_domain');
            $table->index(['company_id', 'sales_id'], 'idx_customers_sales');
        });
    }

    public function down()
    {
        Schema::dropIfExists('customers');
    }
};
