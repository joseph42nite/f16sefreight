<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('sea_shipment_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('job_id')->unique();
            $table->enum('consol_type', ['agent_consol', 'buyers_consol', 'direct', 'back_to_back', 'none'])->nullable();
            $table->string('cargo_type', 20)->nullable();
            $table->enum('delivery_mode', ['fcl', 'lcl'])->nullable();
            $table->string('vessel_name', 100)->nullable();
            $table->string('voyage_no', 30)->nullable();
            $table->string('vessel_flag', 50)->nullable();
            $table->string('imo_number', 7)->nullable();
            $table->string('por_code', 6)->nullable();
            $table->string('pol_code', 6)->nullable();
            $table->string('pod_code', 6)->nullable();
            $table->string('del_code', 6)->nullable();
            $table->string('empty_depot', 100)->nullable();
            $table->string('delivery_address', 500)->nullable();
            $table->string('do_given_to', 100)->nullable();
            $table->integer('piece_count')->default(0);
            $table->decimal('gross_weight', 10, 3)->default(0.000);
            $table->decimal('net_weight', 10, 3)->default(0.000);
            $table->decimal('volume_cbm', 8, 3)->default(0.000);
            $table->timestamps();

            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
        });
    }
    public function down() {
        Schema::dropIfExists('sea_shipment_details');
    }
};
