<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('company_name',100)->nullable();
            $table->string('origin_airport_code',10)->nullable();
            $table->string('password');
            $table->boolean('is_active')->default(true);
            $table->string('latest_token',500)->nullable();
            $table->tinyInteger('daily_login_count')->nullable();
            $table->date('current_date')->nullable();
            $table->date('plan_expiry_date')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
