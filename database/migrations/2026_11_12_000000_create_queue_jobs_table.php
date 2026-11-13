<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The `database` queue connection's own table (2026-11-10 audit §4).
 *
 * `config/queue.php` named `jobs`, which here is the shipments table, so choosing QUEUE_CONNECTION=database would
 * have written queued work into it. Redis is what runs today; this exists so the fallback is safe to pick.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('queue_jobs')) {
            return;
        }

        Schema::create('queue_jobs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('queue')->index();
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('queue_jobs');
    }
};
