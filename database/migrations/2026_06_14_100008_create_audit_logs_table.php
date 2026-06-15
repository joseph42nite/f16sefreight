<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up() {
        Schema::dropIfExists('audit_logs');
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->string('auditable_type');
            $table->unsignedBigInteger('auditable_id');
            $table->string('event');
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });

        if (config('database.default') === 'sqlite') {
            DB::unprepared("
                CREATE TRIGGER audit_logs_prevent_update
                BEFORE UPDATE ON audit_logs
                FOR EACH ROW
                BEGIN
                    SELECT RAISE(ABORT, 'audit_logs is append-only');
                END;
            ");
            DB::unprepared("
                CREATE TRIGGER audit_logs_prevent_delete
                BEFORE DELETE ON audit_logs
                FOR EACH ROW
                BEGIN
                    SELECT RAISE(ABORT, 'audit_logs is append-only');
                END;
            ");
        } else {
            DB::unprepared("
                CREATE TRIGGER audit_logs_prevent_update
                BEFORE UPDATE ON audit_logs
                FOR EACH ROW
                BEGIN
                    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'audit_logs is append-only';
                END;
            ");
            DB::unprepared("
                CREATE TRIGGER audit_logs_prevent_delete
                BEFORE DELETE ON audit_logs
                FOR EACH ROW
                BEGIN
                    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'audit_logs is append-only';
                END;
            ");
        }
    }
    public function down() {
        DB::unprepared("DROP TRIGGER IF EXISTS audit_logs_prevent_update");
        DB::unprepared("DROP TRIGGER IF EXISTS audit_logs_prevent_delete");
        Schema::dropIfExists('audit_logs');
    }
};
