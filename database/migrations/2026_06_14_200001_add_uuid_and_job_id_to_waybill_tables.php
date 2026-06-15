<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('air_way_bills', function (Blueprint $table) {
            if (!Schema::hasColumn('air_way_bills', 'uuid')) {
                $table->uuid('uuid')->nullable()->unique()->after('id');
            }
            if (!Schema::hasColumn('air_way_bills', 'job_id')) {
                $table->unsignedBigInteger('job_id')->nullable()->after('uuid');
            }
        });

        // Add foreign key constraint if it doesn't exist, wrapped in separate check to be safe
        Schema::table('air_way_bills', function (Blueprint $table) {
            // Note: SQLite doesn't support dropping foreign keys easily, but adding is fine
            // We just ensure we don't duplicate constraints. 
            // In Laravel, SQLite foreign key adds are ignored/handled gracefully if table exists.
            try {
                $table->foreign('job_id')->references('id')->on('jobs')->onDelete('set null');
            } catch (\Exception $e) {}
        });

        Schema::table('house_way_bills', function (Blueprint $table) {
            if (!Schema::hasColumn('house_way_bills', 'uuid')) {
                $table->uuid('uuid')->nullable()->unique()->after('id');
            }
            if (!Schema::hasColumn('house_way_bills', 'job_id')) {
                $table->unsignedBigInteger('job_id')->nullable()->after('uuid');
            }
        });

        Schema::table('house_way_bills', function (Blueprint $table) {
            try {
                $table->foreign('job_id')->references('id')->on('jobs')->onDelete('set null');
            } catch (\Exception $e) {}
        });
    }

    public function down() {
        Schema::table('air_way_bills', function (Blueprint $table) {
            try {
                $table->dropForeign(['job_id']);
            } catch (\Exception $e) {}
            if (Schema::hasColumn('air_way_bills', 'job_id')) {
                $table->dropColumn(['job_id']);
            }
            if (Schema::hasColumn('air_way_bills', 'uuid')) {
                $table->dropColumn(['uuid']);
            }
        });
        Schema::table('house_way_bills', function (Blueprint $table) {
            try {
                $table->dropForeign(['job_id']);
            } catch (\Exception $e) {}
            if (Schema::hasColumn('house_way_bills', 'job_id')) {
                $table->dropColumn(['job_id']);
            }
            if (Schema::hasColumn('house_way_bills', 'uuid')) {
                $table->dropColumn(['uuid']);
            }
        });
    }
};
