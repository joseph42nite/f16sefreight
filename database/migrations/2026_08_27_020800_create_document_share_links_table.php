<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * document_share_links — tokenised, expiring public document links, plus client approval.
 *
 * 🔐 **token_hash stores a SHA-256, never the token itself.**
 * The raw token exists only in the URL that was emailed. A dump of this table therefore
 * yields no working links — the same reason passwords are hashed. CHAR(64) is the hex
 * digest width. **Never add a column holding the raw token "for support purposes".**
 *
 * ── expires_at is NOT NULL, and that is the point ───────────────────────────
 * A share link with no expiry is a permanent public URL to a customs document. Default
 * +14 days (implementation_guide.md §Batch 1b·5). revoked_at is the separate manual kill
 * switch — expiry is automatic, revocation is a decision, and both must be checkable.
 *
 * ── The client is NOT a system user ─────────────────────────────────────────
 * They never log in, never see a dashboard, and reach nothing but the one document
 * (PRD.md §5.6). approver_name is typed by them and approver_email is captured for audit
 * and matched against customer_contacts — it is EVIDENCE OF WHO APPROVED, not
 * authentication. Do not build any access decision on top of it.
 *
 * 🔴 **chk_share_approval forces COLLATE utf8mb4_bin.**
 * Third of the constraints given this treatment. The columns collate utf8mb4_unicode_ci,
 * which is case-insensitive, so a plain IN would accept 'Approved' and 'APPROVED' — and
 * the frontend compares with `===`. A link whose status reads 'Approved' would be treated
 * as un-approved by the UI while the database considers it valid. Two remain after this:
 * chk_saq_audience and chk_saq_internal_no_draft.
 * The explicit `IS NULL` arm is redundant in SQL (NULL always passes a CHECK) but kept
 * from the DDL because it documents that a link without approval is the normal case.
 *
 * ── view_count / first_viewed_at / last_viewed_at ───────────────────────────
 * "Has the client actually opened it?" is the question operations asks before chasing.
 * first and last are kept separately: first answers "did it arrive", last answers "are
 * they still looking at it", and one column cannot do both.
 */
return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('document_share_links')) {
            Schema::create('document_share_links', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('job_document_id');
                $table->unsignedBigInteger('job_id');

                $table->char('token_hash', 64); // SHA-256 hex; raw token lives only in the URL
                $table->unsignedBigInteger('created_by');

                $table->timestamp('expires_at');            // NOT NULL — mandatory, default +14d
                $table->timestamp('revoked_at')->nullable(); // manual kill switch

                $table->boolean('requires_approval')->default(false);
                $table->string('approval_status', 20)->nullable();
                $table->string('approver_name', 100)->nullable();
                $table->string('approver_email', 255)->nullable(); // audit evidence, NOT auth
                $table->text('client_comment')->nullable();
                $table->timestamp('responded_at')->nullable();

                $table->timestamp('first_viewed_at')->nullable();
                $table->timestamp('last_viewed_at')->nullable();
                $table->integer('view_count')->default(0);

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('job_document_id')->references('id')->on('job_documents')->onDelete('cascade');
                $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
                $table->foreign('created_by')->references('id')->on('users');

                $table->unique(['token_hash'], 'uk_share_token');
                $table->index(['job_id', 'created_at'], 'idx_share_job');
                $table->index(['job_id', 'approval_status'], 'idx_share_approval');
            });
        }

        if (! $this->hasCheck('chk_share_approval')) {
            DB::statement("
                ALTER TABLE document_share_links ADD CONSTRAINT chk_share_approval CHECK (
                    approval_status IS NULL
                    OR (approval_status COLLATE utf8mb4_bin)
                        IN ('pending','approved','changes_requested')
                )
            ");
        }

        if (! $this->hasCheck('chk_share_approval')) {
            throw new RuntimeException(
                'chk_share_approval was not created. MySQL 8.0.16+ is required — earlier '
                . 'versions parse CHECK and silently ignore it. Server reports: '
                . DB::selectOne('SELECT VERSION() v')->v
            );
        }
    }

    private function hasCheck(string $name): bool
    {
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return true;
        }

        return DB::selectOne(
            'SELECT 1 AS found FROM information_schema.table_constraints
             WHERE table_schema = ? AND table_name = ? AND constraint_name = ?
               AND constraint_type = ?',
            [Schema::getConnection()->getDatabaseName(), 'document_share_links', $name, 'CHECK']
        ) !== null;
    }

    public function down()
    {
        Schema::dropIfExists('document_share_links');
    }
};
