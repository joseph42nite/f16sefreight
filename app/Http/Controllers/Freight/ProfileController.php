<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * A person's own name (user, 2026-09-16).
 *
 * The name is what clients read: "Priya Nair from our operations team will be taking care of it", and it signs the
 * automated updates. Accounts are created by superadmin, often with a placeholder, so everyone can put their real
 * name in from Settings. Only their own row, and only the name — role, branch and company are not theirs to change.
 */
class ProfileController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:100']]);

        $user = auth()->user();
        $user->forceFill(['name' => trim($data['name'])])->save();

        return response()->json(['name' => $user->name]);
    }
}
