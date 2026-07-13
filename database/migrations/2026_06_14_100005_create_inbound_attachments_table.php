<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('inbound_attachments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('inbound_email_id');
            $table->string('filename');
            $table->string('file_path');
            $table->string('mime_type', 100);
            $table->timestamps();

            $table->foreign('inbound_email_id')->references('id')->on('inbound_emails')->onDelete('cascade');
        });
    }
    public function down() {
        Schema::dropIfExists('inbound_attachments');
    }
};
