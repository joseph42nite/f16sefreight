<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('sea_containers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('job_id')->index();
            $table->string('container_number', 11);
            $table->string('seal_number', 30)->nullable();
            $table->enum('size_type', ['20GP', '40GP', '40HC', '20RF', '40RF', '20TK', '40OT']);
            $table->decimal('tare_weight', 10, 3)->nullable();
            $table->decimal('payload_weight', 10, 3)->nullable();
            $table->decimal('vgm_weight', 10, 3)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('sea_containers');
    }
};
