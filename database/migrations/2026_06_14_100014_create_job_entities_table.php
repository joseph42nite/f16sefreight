<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('job_entities', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('job_id');
            $table->unsignedBigInteger('company_id');
            $table->enum('role', [
                'shipper',
                'consignee',
                'customer',
                'origin_agent',
                'dest_agent',
                'selling_agent',
                'notify_party',
                'customs_broker',
                'consigned_order',
                'transporter',
                'high_sea_buyer',
            ]);
            $table->text('address')->nullable();
            $table->string('contact_person', 100)->nullable();
            $table->timestamps();

            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('companies');
        });
    }

    public function down()
    {
        Schema::dropIfExists('job_entities');
    }
};
