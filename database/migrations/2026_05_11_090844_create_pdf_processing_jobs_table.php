<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pdf_processing_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->string('original_filename');
            $table->string('temp_file_path')->nullable();    // e.g. pdf_temp/abc123.pdf
            $table->string('document_type')->nullable();     // ksr, ksr_house1, etc.
            $table->string('status')->default('pending');    // pending | processing | completed | failed
            $table->string('queue_job_id')->nullable();      // Laravel job UUID for tracking

            $table->json('extracted_data')->nullable();      // Final OCR JSON output
            $table->text('error_message')->nullable();

            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            
            // Query performance indexes
            $table->index(['user_id', 'status']);
            $table->index(['status', 'created_at']);
            $table->index('queue_job_id');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pdf_processing_jobs');
    }
};
