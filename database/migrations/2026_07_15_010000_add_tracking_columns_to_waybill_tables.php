<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('air_way_bills')) {
            Schema::table('air_way_bills', function (Blueprint $table) {
                if (!Schema::hasColumn('air_way_bills', 'status')) {
                    $table->string('status')->default('generate_pdf');
                }
                if (!Schema::hasColumn('air_way_bills', 'awb_email')) {
                    $table->string('awb_email')->nullable();
                }
                if (!Schema::hasColumn('air_way_bills', 't_id')) {
                    $table->string('t_id')->nullable();
                }
                if (!Schema::hasColumn('air_way_bills', 'send_created')) {
                    $table->string('send_created')->nullable();
                }
                if (!Schema::hasColumn('air_way_bills', 'send_status')) {
                    $table->string('send_status')->nullable();
                }
            });
        }

        if (Schema::hasTable('house_way_bills')) {
            Schema::table('house_way_bills', function (Blueprint $table) {
                if (!Schema::hasColumn('house_way_bills', 'status')) {
                    $table->string('status')->default('generate_pdf');
                }
                if (!Schema::hasColumn('house_way_bills', 't_id')) {
                    $table->string('t_id')->nullable();
                }
                if (!Schema::hasColumn('house_way_bills', 'send_created')) {
                    $table->string('send_created')->nullable();
                }
                if (!Schema::hasColumn('house_way_bills', 'send_status')) {
                    $table->string('send_status')->nullable();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('air_way_bills')) {
            Schema::table('air_way_bills', function (Blueprint $table) {
                $columns = [];
                if (Schema::hasColumn('air_way_bills', 'status')) $columns[] = 'status';
                if (Schema::hasColumn('air_way_bills', 'awb_email')) $columns[] = 'awb_email';
                if (Schema::hasColumn('air_way_bills', 't_id')) $columns[] = 't_id';
                if (Schema::hasColumn('air_way_bills', 'send_created')) $columns[] = 'send_created';
                if (Schema::hasColumn('air_way_bills', 'send_status')) $columns[] = 'send_status';
                if (!empty($columns)) {
                    $table->dropColumn($columns);
                }
            });
        }

        if (Schema::hasTable('house_way_bills')) {
            Schema::table('house_way_bills', function (Blueprint $table) {
                $columns = [];
                if (Schema::hasColumn('house_way_bills', 'status')) $columns[] = 'status';
                if (Schema::hasColumn('house_way_bills', 't_id')) $columns[] = 't_id';
                if (Schema::hasColumn('house_way_bills', 'send_created')) $columns[] = 'send_created';
                if (Schema::hasColumn('house_way_bills', 'send_status')) $columns[] = 'send_status';
                if (!empty($columns)) {
                    $table->dropColumn($columns);
                }
            });
        }
    }
};
