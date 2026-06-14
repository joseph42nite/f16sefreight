<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('job_documents', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('job_id');
            $table->string('document_type', 50);
            $table->string('filename');
            $table->string('file_path');
            $table->string('mime_type', 50);
            $table->unsignedBigInteger('uploaded_by');
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
            $table->foreign('uploaded_by')->references('id')->on('users');
        });
    }
    public function down() {
        Schema::dropIfExists('job_documents');
    }
};
