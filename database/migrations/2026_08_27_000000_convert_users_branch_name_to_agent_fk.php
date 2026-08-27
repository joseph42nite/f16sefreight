<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * users.branch_name: VARCHAR -> BIGINT UNSIGNED, with a real foreign key.
 *
 * The name is misleading and always has been. `branch_name` does not hold a name —
 * it holds `agents_info.id`. The admin user form's "Branch Location" dropdown saves
 * `data[i].id` while DISPLAYING `agent_city` (NewUsers.vue:241, fed by
 * BranchController@getCompanyBranch which selects only id and agent_city), and every
 * reader treats it as an id: `Agent::where('id', $user->branch_name)` appears in
 * ~40 places, e.g. app/Http/Traits/WaybillTrait.php:17.
 *
 * So this migration changes NO DATA. It tightens the column to match what is already
 * stored and lets the database enforce that the branch exists.
 *
 * ── Why it cannot stay VARCHAR ───────────────────────────────────────────────
 * This is the tenancy column: it decides which branch's records a user may see.
 * With a string column and no FK, MySQL coerces text in numeric comparisons, so
 * a corrupted value like '3abc' silently resolves to branch 3 — a REAL, DIFFERENT
 * branch — and leaks another tenant's data with nothing raised anywhere.
 *
 * ── The name is deliberately NOT changed ─────────────────────────────────────
 * Renaming to agent_id would touch ~40 call sites for no functional gain, and
 * database_relations_tree.md keeps `branch_name` too. A rename is a separate,
 * optional tidy-up.
 *
 * ── Why the checks are in here rather than in a runbook ──────────────────────
 * These were four SQL queries someone had to remember to run first. Automated
 * instead: the migration aborts with the exact offending rows rather than a
 * cryptic driver error, and it aborts BEFORE altering anything. MySQL has no
 * transactional DDL, so a half-applied ALTER cannot be rolled back.
 */
return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('users') || ! Schema::hasColumn('users', 'branch_name')) {
            return;
        }

        // Already converted (re-run after a partial failure) — nothing to do.
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            $type = DB::selectOne(
                'SELECT DATA_TYPE d FROM information_schema.columns
                 WHERE table_schema = ? AND table_name = ? AND column_name = ?',
                [Schema::getConnection()->getDatabaseName(), 'users', 'branch_name']
            );
            if ($type && strtolower($type->d) === 'bigint') {
                return;
            }
        }

        $rows = DB::table('users')->select('id', 'email', 'branch_name')->get();

        // 1. Values that are not integers cannot be cast. Never coerce past them —
        //    MySQL would turn '3abc' into 3 and point that user at a real branch.
        $nonNumeric = $rows->filter(fn ($u) => filled($u->branch_name) && ! ctype_digit((string) $u->branch_name));
        $this->abortWith($nonNumeric, 'branch_name is not an integer');

        // 2. Values pointing at a branch that does not exist would fail the FK.
        $validIds = DB::table('agents_info')->pluck('id')->map(fn ($i) => (string) $i)->flip();
        $orphans = $rows->filter(fn ($u) => filled($u->branch_name)
            && ctype_digit((string) $u->branch_name)
            && ! $validIds->has((string) $u->branch_name));
        $this->abortWith($orphans, 'branch_name references a branch that does not exist in agents_info');

        // 3. Users with no branch have no company and therefore no tier, which makes
        //    tier resolution in ProcessPdfOcrJob undefined. Every user has a branch:
        //    assign one before running this, rather than inventing a default here.
        $branchless = $rows->filter(fn ($u) => blank($u->branch_name));
        $this->abortWith($branchless, 'branch_name is empty — assign a branch before migrating');

        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('branch_name')->nullable(false)->change();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreign('branch_name', 'users_branch_name_foreign')
                ->references('id')->on('agents_info');
        });
    }

    /** Fail loudly, naming the rows, so the fix is obvious instead of a guess. */
    private function abortWith($rows, string $problem): void
    {
        if ($rows->isEmpty()) {
            return;
        }

        $sample = $rows->take(20)
            ->map(fn ($u) => sprintf('  user #%d <%s> branch_name=%s', $u->id, $u->email, var_export($u->branch_name, true)))
            ->implode(PHP_EOL);

        throw new RuntimeException(sprintf(
            "Cannot convert users.branch_name: %d row(s) where %s.%s%s%s",
            $rows->count(), $problem, PHP_EOL, $sample,
            $rows->count() > 20 ? PHP_EOL . '  … and ' . ($rows->count() - 20) . ' more' : ''
        ));
    }

    public function down()
    {
        if (! Schema::hasTable('users')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign('users_branch_name_foreign');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('branch_name', 50)->nullable()->change();
        });
    }
};
