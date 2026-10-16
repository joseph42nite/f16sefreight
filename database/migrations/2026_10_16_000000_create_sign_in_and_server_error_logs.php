<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * What the platform Overview's last two graphs read (owner, 2026-10-16): who signed in, and which server errors
 * happened. Neither was kept — a user row holds only its latest token, and errors went to a log file.
 *
 * `sign_in_events`: one row per successful sign-in. `guard` says which table `account_id` is in (`user` → users,
 * `superAdmin` → super_admins). No IP address or device is kept: the graph needs who and when, nothing more.
 * `server_errors`: one row per unhandled server error — its class, the first 500 characters of its message and the
 * path; never the request body, which can hold passwords or a client's data.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::create('sign_in_events', function (Blueprint $table) {
            $table->id();
            $table->string('guard', 20);
            $table->unsignedBigInteger('account_id');
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('agent_id')->nullable();
            $table->string('portal', 20)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['created_at', 'company_id'], 'idx_sign_ins_day');
        });

        Schema::create('server_errors', function (Blueprint $table) {
            $table->id();
            $table->string('exception', 191);
            $table->string('message', 500)->nullable();
            $table->string('path', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('created_at', 'idx_server_errors_day');
        });
    }

    public function down()
    {
        Schema::dropIfExists('server_errors');
        Schema::dropIfExists('sign_in_events');
    }
};
