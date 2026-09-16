<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Company;
use App\SystemTemplate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class CompanyController extends Controller
{
    public function index($id = 0)
    {
        $columns = ['id', 'name', 'templates_config', 'outlook_approved_at'];
        if ($id) {
            $data = Company::where([['id', $id]])->limit(1)->get($columns);
        } else {
            $data = Company::all($columns);
        }

        return response()->json($data);
    }

    /**
     * The link to send a company's IT admin so everyone there can connect Outlook (user, 2026-09-16). It only records
     * the approval against this company; Microsoft checks the admin.
     */
    public function outlookApprovalLink(int $company, \App\Services\Mail\GraphMailProvider $graph)
    {
        $row = Company::withoutGlobalScopes()->findOrFail($company);

        try {
            $url = $graph->adminConsentUrl(\App\Http\Controllers\Freight\MailboxController::APPROVAL_STATE
                . \Illuminate\Support\Facades\Crypt::encryptString((string) $row->id));
        } catch (\RuntimeException $e) {
            return response()->json(['error' => 'Outlook is not set up on this server yet: add GRAPH_CLIENT_ID, GRAPH_CLIENT_SECRET and GRAPH_REDIRECT_URI to .env.'], 503);
        }

        return response()->json(['url' => $url, 'approved_at' => $row->outlook_approved_at]);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'templates_config' => ['nullable', 'array'],
            'templates_config.allowed_templates' => ['nullable', 'array'],
            'templates_config.default_focus_air' => ['nullable', 'string'],
            'templates_config.default_house_air' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($error = $this->validateTemplatesConfig($request->templates_config)) {
            return $error;
        }

        $company = new Company();
        $company->name = $request->name;
        $company->templates_config = $request->templates_config;
        $company->save();
        
        // Bust the short-lived cache so users see new templates immediately
        Cache::forget("company_templates_{$company->name}");
        
        return response()->json(['status' => 'success', 'company' => $company]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'templates_config' => ['nullable', 'array'],
            'templates_config.allowed_templates' => ['nullable', 'array'],
            'templates_config.default_focus_air' => ['nullable', 'string'],
            'templates_config.default_house_air' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($error = $this->validateTemplatesConfig($request->templates_config)) {
            return $error;
        }

        $company = Company::find($id);
        if (!$company) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $company->name = $request->name;
        $company->templates_config = $request->templates_config;
        $company->save();
        
        // Bust the short-lived cache so users see new templates immediately
        Cache::forget("company_templates_{$company->name}");
        
        return response()->json(['status' => 'success']);
    }

    public function getAvailableTemplates()
    {
        $templates = Cache::remember('f16s_available_templates', 3600, function () {
            return SystemTemplate::orderBy('key', 'asc')->pluck('key');
        });

        return response()->json($templates);
    }

    private function validateTemplatesConfig(?array $config)
    {
        if (!$config || !isset($config['allowed_templates'])) {
            return null;
        }
        
        $allowed = $config['allowed_templates'];
        // Extract keys from mapped object list
        $allowedKeys = is_array($allowed) ? array_column($allowed, 'key') : [];
        
        $pairs = [
            'default_focus_air' => 'Focus Air',
            'default_house_air' => 'House Waybill'
        ];

        foreach ($pairs as $key => $label) {
            if (!empty($config[$key]) && !in_array($config[$key], $allowedKeys)) {
                return response()->json([
                    'errors' => ["templates_config.{$key}" => ["{$label} default must be in the allowed list."]]
                ], 422);
            }
        }

        return null;
    }
}