<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\SystemTemplate;
use App\Company;
use Illuminate\Support\Facades\Cache;

class TemplateController extends Controller
{
    public function index()
    {
        $templates = SystemTemplate::orderBy('key', 'asc')->get();
        
        // Derive the canonical schema directly from canonical entry (e.g., 'ksr') or first result 
        // as dynamic fallback, securing backend drift prevention.
        $reference = $templates->firstWhere('key', 'ksr') ?? $templates->first();
        $schemaKeys = $reference ? array_keys($reference->coordinates) : [
            'shipper', 'consignee', 'departure', 'destination', 'transit', 
            'cargo', 'weight_charge', 'piece_weight', 'awb_number', 'chrg_code'
        ];

        return response()->json([
            'templates' => $templates,
            'schema' => $schemaKeys
        ]);
    }

    public function save(Request $request)
    {
        $request->validate([
            'key' => 'required|string',
            'coordinates' => 'required|array',
            'coordinates.*' => 'required|array|size:4',
            'coordinates.*.*' => 'required|integer|min:0'
        ]);

        // Native Database concurrency manages record perfectly
        SystemTemplate::updateOrCreate(
            ['key' => $request->key],
            ['coordinates' => $request->coordinates]
        );

        $this->regenerateConfigFile();
        Cache::forget('f16s_available_templates');

        return response()->json(['success' => true]);
    }

    public function delete($id)
    {
        $template = SystemTemplate::findOrFail($id);
        $key = $template->key;

        // Orphan Check Protection: Prevent deletion of actively assigned configs
        $inUse = Company::whereJsonContains('templates_config->allowed_templates', [['key' => $key]])->exists();
        if ($inUse) {
            return response()->json([
                'message' => 'Delete Failed: System Template actively bound to customer profiles.'
            ], 409);
        }

        $template->delete();

        $this->regenerateConfigFile();
        Cache::forget('f16s_available_templates');

        return response()->json(['success' => true]);
    }

    /**
     * Securely re-packages database entities into physical distribution JSON file.
     */
    private function regenerateConfigFile()
    {
        // Aggregate database content mapped to key index
        $templates = SystemTemplate::all()->keyBy('key')->map(function($t) {
            return $t->coordinates;
        });

        $configPayload = ['templates' => $templates->toArray()];

        $basePath = base_path('python/boxes_config.json');
        $tmpPath = $basePath . '.tmp';

        // Bulletproof atomic swap
        file_put_contents($tmpPath, json_encode($configPayload, JSON_PRETTY_PRINT));
        rename($tmpPath, $basePath);
    }
}
