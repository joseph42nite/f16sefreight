<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The help copilot (PRD §5.10), as the user decided it on 2026-09-14.
 *
 * - F16s staff UPLOAD one .md or .docx per portal page; re-uploading replaces it. The AI finds the
 *   right section itself, so each document is split into sections (`help_chunks`) and each section
 *   is embedded. Vectors live HERE, in MySQL, not in ChromaDB (user's choice: no extra service).
 * - Every question is kept (`help_questions`): the ones it could not answer tell F16s which page
 *   needs a better document, and a ticket carries the conversation that led to it.
 * - Questions have their own daily limit per user, separate from document extraction.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('help_documents', function (Blueprint $table) {
            $table->id();
            $table->string('title', 150);
            // The portal page it is about, e.g. `/inbox`. Nullable: a general document covers many.
            $table->string('route', 150)->nullable();
            $table->string('filename', 255);
            $table->string('format', 10);                 // md | docx
            $table->longText('content');                  // the text as read from the file
            $table->string('content_hash', 64);
            $table->unsignedInteger('chunk_count')->default(0);
            $table->string('embedding_model', 80)->nullable();
            // indexed | not_indexed — not_indexed when the embedding call failed or no key is set.
            $table->string('status', 20)->default('not_indexed');
            $table->string('error', 255)->nullable();
            $table->unsignedBigInteger('uploaded_by')->nullable();   // super_admins.id
            $table->timestamps();
        });

        Schema::create('help_chunks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('help_document_id')->constrained('help_documents')->cascadeOnDelete();
            $table->unsignedInteger('position');
            $table->string('heading', 255)->nullable();
            $table->text('text');
            // Packed float32, unit length — a dot product is the cosine.
            $table->binary('embedding')->nullable();
            $table->timestamps();
        });

        Schema::create('help_questions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('route', 255)->nullable();
            $table->text('question');
            $table->text('answer')->nullable();
            $table->boolean('found')->default(false);
            $table->json('steps')->nullable();
            $table->json('chunk_ids')->nullable();
            $table->decimal('best_score', 5, 4)->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at'], 'idx_help_q_user_time');
            $table->index(['found', 'created_at'], 'idx_help_q_found_time');
        });

        Schema::table('ai_budget_settings', function (Blueprint $table) {
            $table->unsignedInteger('per_user_daily_questions')->default(30)->after('per_user_daily_limit');
        });

        Schema::table('support_tickets', function (Blueprint $table) {
            // The copilot conversation a ticket came from, captured by the portal — not written by the model.
            $table->json('help_transcript')->nullable()->after('console_logs');
        });
    }

    public function down(): void
    {
        Schema::table('support_tickets', fn (Blueprint $table) => $table->dropColumn('help_transcript'));
        Schema::table('ai_budget_settings', fn (Blueprint $table) => $table->dropColumn('per_user_daily_questions'));
        Schema::dropIfExists('help_questions');
        Schema::dropIfExists('help_chunks');
        Schema::dropIfExists('help_documents');
    }
};
