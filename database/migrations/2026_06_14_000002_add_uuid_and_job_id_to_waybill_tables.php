<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('air_way_bills', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->unique()->after('id');
            $table->unsignedBigInteger('job_id')->nullable()->after('uuid');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('set null');
        });
        Schema::table('houseway_bills', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->unique()->after('id');
            $table->unsignedBigInteger('job_id')->nullable()->after('uuid');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('set null');
        });
    }
    public function down() {
        Schema::table('air_way_bills', function (Blueprint $table) {
            $table->dropForeign(['job_id']);
            $table->dropColumn(['uuid', 'job_id']);
        });
        Schema::table('houseway_bills', function (Blueprint $table) {
            $table->dropForeign(['job_id']);
            $table->dropColumn(['uuid', 'job_id']);
        });
    }
};
