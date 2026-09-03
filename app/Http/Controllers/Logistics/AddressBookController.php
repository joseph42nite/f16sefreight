<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\SavedAddress;
use Illuminate\Http\Request;

class AddressBookController extends Controller
{
    /**
     * Get paginated saved addresses (Shipper & Consignee only) scoped to the user's branch.
     */
    public function index(Request $request)
    {
        $user = auth()->guard('user-api')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // ⚠️ `also_notify_address` is now selectable too. The list was hardcoded to two
        // types, so a notify party could be SAVED and never offered back — the address
        // book quietly forgot a third of what it held.
        $types = $request->filled('address_type')
            ? [$request->string('address_type')->toString()]
            : ['shipper_address', 'consignee_address', 'also_notify_address'];

        $query = SavedAddress::with('user:id,name,email')
            ->whereIn('address_type', $types);

        // Scope by branch / agent_id if set
        $agentId = $user->branch_name;
        if ($agentId) {
            $query->where(function ($q) use ($agentId) {
                $q->where('agent_id', $agentId)
                  ->orWhereNull('agent_id');
            });
        }

        // Address type filter (shipper_address / consignee_address)
        if ($request->has('address_type') && !empty($request->address_type)) {
            $query->where('address_type', $request->address_type);
        }

        // Search filter
        if ($request->has('search') && !empty($request->search)) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('name_2', 'LIKE', "%{$search}%")
                  ->orWhere('account', 'LIKE', "%{$search}%")
                  ->orWhere('address', 'LIKE', "%{$search}%")
                  ->orWhere('city', 'LIKE', "%{$search}%")
                  ->orWhere('country', 'LIKE', "%{$search}%");
            });
        }

        $perPage = (int) $request->input('per_page', 10);
        $addresses = $query->orderBy('updated_at', 'desc')->paginate($perPage);

        return response()->json([
            'status' => true,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'branch' => $user->branch_name,
                'company' => $user->company_name,
            ],
            'data' => $addresses
        ]);
    }

    /**
     * Update a saved address record.
     */
    public function update(Request $request, $id)
    {
        $user = auth()->guard('user-api')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $address = SavedAddress::find($id);
        if (!$address) {
            return response()->json(['message' => 'Saved address not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'name_2' => 'nullable|string|max:150',
            'account' => 'nullable|string|max:100',
            'address' => 'required|string|max:250',
            'address_line_2' => 'nullable|string|max:250',
            'city' => 'required|string|max:100',
            'airport_code' => 'nullable|string|max:100',
            'post_code' => 'nullable|string|max:50',
            'state' => 'nullable|string|max:100',
            'country' => 'required|string|max:100',
            'phone' => 'nullable|string|max:50',
            'fax' => 'nullable|string|max:50',
            'telex' => 'nullable|string|max:50',
        ]);

        $validated['user_id'] = $user->id;
        if ($user->branch_name && empty($address->agent_id)) {
            $validated['agent_id'] = $user->branch_name;
        }

        $address->update($validated);
        $address->load('user:id,name,email');

        return response()->json([
            'status' => true,
            'message' => 'Address updated successfully',
            'data' => $address
        ]);
    }
}
