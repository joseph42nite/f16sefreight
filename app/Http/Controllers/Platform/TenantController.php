<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Tenants, one page (owner, 2026-10-11: "I don't want so many pages to open"): every client company with how many
 * branches and people it has, and one company opened — its branches (code, city, GSTIN, IATA) and its people (role,
 * branch). Replaces opening Company, Branch and Users separately. F16s staff only (`superAdmin-api`).
 */
class TenantController extends Controller
{
    public function index(): JsonResponse
    {
        $branches = DB::table('agents_info')->selectRaw('company_id, COUNT(*) AS n')->groupBy('company_id')->pluck('n', 'company_id');
        $people = DB::table('users')->selectRaw('company_name, COUNT(*) AS n')->groupBy('company_name')->pluck('n', 'company_name');

        $companies = DB::table('companies')->orderBy('name')->get(['id', 'name', 'code', 'tier', 'created_at'])
            ->map(fn ($c) => [
                'id' => (int) $c->id, 'name' => $c->name, 'code' => $c->code, 'tier' => $c->tier,
                'branches' => (int) ($branches[$c->id] ?? 0), 'people' => (int) ($people[(string) $c->id] ?? 0),
                'created_at' => $c->created_at,
            ]);

        return response()->json(['companies' => $companies]);
    }

    public function show(int $company): JsonResponse
    {
        $row = DB::table('companies')->where('id', $company)->first(['id', 'name', 'code', 'tier', 'created_at']);
        abort_if($row === null, 404);

        $people = DB::table('users')->where('company_name', (string) $company)->orderBy('name')
            ->get(['id', 'name', 'email', 'designation', 'branch_name', 'is_active']);
        $perBranch = $people->countBy('branch_name');

        $branches = DB::table('agents_info')->where('company_id', $company)->orderBy('agent_name')
            ->get(['id', 'agent_name', 'branch_code', 'agent_city', 'gst_no', 'iata_agent_code', 'iata_agent_cass'])
            ->map(fn ($b) => (array) $b + ['people' => (int) ($perBranch[$b->id] ?? 0)]);
        $names = $branches->pluck('agent_name', 'id');

        return response()->json([
            'company' => $row,
            'branches' => $branches->values(),
            'people' => $people->map(fn ($p) => [
                'id' => $p->id, 'name' => $p->name, 'email' => $p->email, 'designation' => $p->designation,
                'branch_id' => $p->branch_name, 'branch' => $names[$p->branch_name] ?? null, 'is_active' => (bool) $p->is_active,
            ])->values(),
        ]);
    }
}
