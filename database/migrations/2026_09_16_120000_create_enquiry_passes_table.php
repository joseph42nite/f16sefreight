<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * "Decline" on the Kanban's unassigned pool (user, 2026-09-16: pass on it): the enquiry leaves that person's pool
 * and stays in their colleagues'. One row per person who passed.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enquiry_passes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('enquiry_id');
            $table->foreign('enquiry_id')->references('id')->on('enquiries')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('created_at')->nullable();

            $table->unique(['enquiry_id', 'user_id'], 'uk_enquiry_passes');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enquiry_passes');
    }
};
