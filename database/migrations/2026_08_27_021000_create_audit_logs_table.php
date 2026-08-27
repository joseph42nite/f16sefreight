<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * audit_logs — append-only. INSERT is the only permitted operation.
 *
 * ── Enforced by database trigger, not by application discipline ─────────────
 * An audit trail an application can rewrite is not an audit trail. The two BEFORE
 * triggers below make UPDATE and DELETE fail at the engine, so it holds for anything
 * connecting with these credentials — Tinker, a migration, a console command, a
 * compromised controller.
 *
 * ⚠️ **These MySQL trigger bodies had NEVER been executed before 2026-08-27** — the
 * SQLite forms were tested with 12 assertions, the MySQL ones were translations
 * carried in prose only (CONTEXT.md §8, GAPS.md #5). This migration is where they
 * first run, and it verifies both landed rather than trusting DDL that returned
 * without error.
 *
 * ── Three things these triggers deliberately do NOT stop ────────────────────
 * 1. **TRUNCATE TABLE** — MySQL does not fire DELETE triggers on truncate. Mitigation is
 *    a privilege one: the application user must not hold DROP on this schema.
 * 2. **Foreign-key CASCADE deletes** — MySQL does not fire triggers for rows removed by
 *    a cascade. ✅ Safe here because both FKs are plain RESTRICT.
 *    🔴 **If agent_id or user_id is ever changed to CASCADE, this protection is silently
 *    voided** — the triggers stay in place and simply stop being consulted.
 * 3. **DROP TABLE / migrate:fresh** — intended; local dev must stay resettable.
 *
 * ── updated_at is deliberately omitted ──────────────────────────────────────
 * The DDL carries `updated_at ... ON UPDATE CURRENT_TIMESTAMP`, which can never fire on a
 * table where UPDATE aborts. The schema doc flags it as dead weight that "advertises a
 * capability the table does not have". Dropped: `created_at` alone is the honest shape
 * for an append-only log.
 */
return new class extends Migration
{
    private const TRIGGERS = ['trg_audit_logs_no_update', 'trg_audit_logs_no_delete'];

    public function up()
    {
        if (! Schema::hasTable('audit_logs')) {
            Schema::create('audit_logs', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('user_id');

                $table->string('action', 255);
                $table->string('model_type', 100);
                $table->unsignedBigInteger('model_id');

                // created_at only — an append-only row is never updated. See above.
                $table->timestamp('created_at')->nullable();

                // RESTRICT on both, and that is load-bearing: a CASCADE here would stop
                // the append-only triggers from firing at all.
                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('user_id')->references('id')->on('users');

                $table->index(['agent_id', 'created_at'], 'idx_audit_agent_time');
                $table->index(['model_type', 'model_id'], 'idx_audit_model');
            });
        }

        $this->createTriggers();
        $this->assertTriggersExist();
    }

    private function createTriggers(): void
    {
        $driver = Schema::getConnection()->getDriverName();
        $existing = $this->triggerNames();

        foreach (['update' => 'UPDATE', 'delete' => 'DELETE'] as $suffix => $op) {
            $name = "trg_audit_logs_no_{$suffix}";

            if (in_array($name, $existing, true)) {
                continue;
            }

            $message = "audit_logs is append-only: {$op} is forbidden";

            $body = $driver === 'mysql'
                ? "CREATE TRIGGER {$name} BEFORE {$op} ON audit_logs FOR EACH ROW
                   BEGIN
                       SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '{$message}';
                   END"
                : "CREATE TRIGGER {$name} BEFORE {$op} ON audit_logs FOR EACH ROW
                   BEGIN
                       SELECT RAISE(ABORT, '{$message}');
                   END";

            DB::unprepared($body);
        }
    }

    /** @return string[] */
    private function triggerNames(): array
    {
        $conn = Schema::getConnection();

        if ($conn->getDriverName() !== 'mysql') {
            return array_map(
                fn ($r) => $r->name,
                DB::select("SELECT name FROM sqlite_master WHERE type = 'trigger'")
            );
        }

        $rows = DB::select(
            'SELECT trigger_name FROM information_schema.triggers
             WHERE trigger_schema = ? AND event_object_table = ?',
            [$conn->getDatabaseName(), 'audit_logs']
        );

        return array_map(fn ($r) => $r->trigger_name ?? $r->TRIGGER_NAME, $rows);
    }

    private function assertTriggersExist(): void
    {
        $found = $this->triggerNames();

        foreach (self::TRIGGERS as $name) {
            if (! in_array($name, $found, true)) {
                throw new RuntimeException(
                    "{$name} was not created. audit_logs would be silently mutable, which "
                    . 'defeats the entire purpose of the table.'
                );
            }
        }
    }

    public function down()
    {
        foreach (self::TRIGGERS as $name) {
            DB::unprepared("DROP TRIGGER IF EXISTS {$name}");
        }

        Schema::dropIfExists('audit_logs');
    }
};
