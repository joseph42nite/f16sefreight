<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('air_shipment_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('job_id')->unique();
            $table->string('flight_number', 20)->nullable();
            $table->timestamp('flight_date')->nullable();
            $table->string('carrier_name', 100)->nullable();
            $table->string('pol_code', 6)->nullable();
            $table->string('pod_code', 6)->nullable();
            $table->string('do_given_to', 100)->nullable();
            $table->integer('piece_count')->default(0);
            $table->decimal('gross_weight', 10, 3)->default(0.000);
            $table->decimal('chargeable_weight', 10, 3)->default(0.000);
            $table->decimal('volume_cbm', 8, 3)->default(0.000);
            $table->timestamps();

            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
        });
    }
    public function down() {
        Schema::dropIfExists('air_shipment_details');
    }
};
