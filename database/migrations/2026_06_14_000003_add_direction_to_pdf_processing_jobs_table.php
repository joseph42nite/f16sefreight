<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('pdf_processing_jobs', function (Blueprint $table) {
            $table->string('direction', 20)->default('export')->after('id');
        });
    }
    public function down() {
        Schema::table('pdf_processing_jobs', function (Blueprint $table) {
            $table->dropColumn('direction');
        });
    }
};
