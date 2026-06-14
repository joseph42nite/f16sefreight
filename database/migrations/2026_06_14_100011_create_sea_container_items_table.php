<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('sea_container_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('container_id');
            $table->unsignedBigInteger('job_id');
            $table->integer('stuffed_pieces')->default(0);
            $table->decimal('stuffed_weight', 10, 3)->default(0.000);
            $table->decimal('stuffed_volume', 8, 3)->default(0.000);
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('container_id')->references('id')->on('sea_containers')->onDelete('cascade');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
        });
    }
    public function down() {
        Schema::dropIfExists('sea_container_items');
    }
};
