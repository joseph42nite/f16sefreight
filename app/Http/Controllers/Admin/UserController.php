<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\User;
use App\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Company;
use Illuminate\Support\Facades\Cache;

class UserController extends Controller
{
    public function index($id = 0)
    {
        if ($id)
            $data = User::where([['id', $id]])->limit(1)->get()->toArray();
        else
            $data = User::orderBy('created_at', 'desc')->get()->toArray();

        return json_encode($data);
    }
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'origin_airport_code' => ['required', 'string', 'max:100'],
            'company_name' => ['required', 'max:100'],
            'branch_name' => ['nullable', 'max:50'],
            'can_send' => ['required'],
            'email' => ['required', 'string', 'email', 'max:100', 'unique:users'],
            'password' => ['required', 'string', 'min:4'],
            'default_port_id' => ['required', 'integer', 'exists:ports,id'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $current_date = date("Y-m-d");
        $current_date = date("Y-m-d", strtotime($current_date . " +1 week"));
        $user = new User();
        $user->name = $request->name;
        $user->origin_airport_code = $request->origin_airport_code;
        $user->company_name = $request->company_name;
        $user->branch_name = $request->branch_name;
        $user->email = $request->email;
        $user->can_send = $request->can_send;
        $user->password = Hash::make($request->password);
        $user->plan_expiry_date = $current_date;
        $user->pima_address = $request->pima_address;
        $user->default_port_id = $request->default_port_id;
        $user->save();

        $role = new Role();
        $role->email = $request->email;
        $role->role = 'user';
        $role->save();

        if ($user) {
            return response()->json(['user' => $user, 'status' => true]);
        } else {
            return response()->json(['status' => false]);
        }
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'company_name' => ['required', 'string', 'max:100'],
            'plan_expiry_date' => ['required'],
            'can_send' => ['required'],
            'default_port_id' => ['required', 'integer', 'exists:ports,id'],
            'pima_address' => ['nullable', 'string', 'max:20'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        $user->name = $request->name;
        $user->company_name = $request->company_name;
        $user->origin_airport_code = $request->origin_airport_code;
        // $user->daily_login_count=$request->daily_login_count;
        // $user->plan_expiry_date=$request->plan_expiry_date;
        $user->is_active = $request->is_active;
        $user->can_send = $request->can_send;
        $user->pima_address = $request->pima_address;
        $user->default_port_id = $request->default_port_id;
        if (!empty($request->password))
            $user->password = Hash::make($request->password);
        $user->save();
        if ($user) {
            return response()->json(['status' => true]);
        } else {
            return response()->json(['status' => false]);
        }
    }

    public function getCompaniesPublic()
    {
        $companies = Company::select('id', 'name')->orderBy('name', 'asc')->get();
        return response()->json($companies, 200);
    }

    public function setSessionContext(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_id' => ['required', 'integer', 'exists:companies,id'],
            'active_portal_scope' => ['required', 'string', 'in:air,sea'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        session([
            'company_id' => $request->company_id,
            'active_portal_scope' => $request->active_portal_scope,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Session context configured successfully',
            'session' => [
                'company_id' => session('company_id'),
                'active_portal_scope' => session('active_portal_scope')
            ]
        ], 200);
    }


    public function personal_update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $id = auth()->guard('user-api')->user()->id;
        $user = User::find($id);
        $user->name = $request->name;
        $user->save();
        if ($user) {
            return response()->json(['status' => true]);
        } else {
            return response()->json(['status' => false]);
        }
    }
    public function update_password(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => ['required', 'confirmed', 'min:4'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $id = auth()->guard('user-api')->user()->id;
        User::where('id', $id)->update(['password' => Hash::make($request->password)]);
        return json_encode(['status' => true, 'message' => "Password updated successful"]);
    }
    public function me(Request $request)
    {
        $user_data = auth()->guard('user-api')->user();
        if ($request->token == $user_data->latest_token) {
            $userPayload = $user_data->toArray();
            
            $companyName = $user_data->company_name;
            $company = Company::where('name', $companyName)->first();
            $userPayload['company'] = $company ? $company->toArray() : null;

            $templatesConfig = Cache::remember(
                "company_templates_{$companyName}",
                60,
                fn() => $company ? $company->templates_config : null
            );

            $userPayload['templates_config'] = $templatesConfig;

            return response()->json($userPayload);
        } else {
            auth()->guard('user-api')->logout();
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function logout()
    {
        auth()->guard('user-api')->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'token' => $token,
            'token_type' => 'bearer',
        ]);
    }
    public function delete($id)
    {
        $user = User::find($id);
        Role::where(['email' => $user['email'], 'role' => 'user'])->delete();
        $user->delete();
        return "User deleted";
    }

    public function getCompanyTemplates()
    {
        $user = auth()->guard('user-api')->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $companyName = $user->company_name;
        
        // TODO: Migrate to company_id FK on users table to eliminate string-match fragility
        $company = Company::where('id', $companyName)->first();
        
        $fallback = [
            'allowed_templates' => [
                ['key' => 'ksr', 'label' => 'KSR'],
                ['key' => 'ksr_house1', 'label' => 'House 1'],
                ['key' => 'ksr_house2', 'label' => 'House 2'],
                ['key' => 'ksr_apex_house', 'label' => 'Apex House'],
                ['key' => 'ksr_ligi_house', 'label' => 'Ligi'],
                ['key' => 'ksr_cfglobal_house', 'label' => 'CF Global']
            ],
            'default_focus_air' => 'ksr',
            'default_house_air' => 'ksr_house1'
        ];

        if (!$company || !$company->templates_config) {
            return response()->json($fallback);
        }

        return response()->json($company->templates_config ?: $fallback);
    }

    public function getPorts()
    {
        $ports = \App\Port::where('is_active', true)->orderBy('port_name', 'asc')->get();
        return response()->json($ports, 200);
    }

    public function registerOnboarding(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_name' => ['required', 'string', 'max:100', 'unique:companies,name'],
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:100', 'unique:users,email'],
            'password' => ['required', 'string', 'min:4'],
            'origin_airport_code' => ['required', 'string', 'max:100'],
            'pima_address' => ['required', 'string', 'max:100'],
            'default_port_id' => ['required', 'integer', 'exists:ports,id'],
            'tier' => ['nullable', 'string', 'in:viper_core,viper_tactical,viper_command'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        return \DB::transaction(function () use ($request) {
            // 1. Create Company
            $company = new Company();
            $company->name = $request->input('company_name');
            $company->tier = $request->input('tier', 'viper_command');
            $company->templates_config = [
                'allowed_templates' => [
                    ['key' => 'ksr', 'label' => 'KSR'],
                    ['key' => 'ksr_house1', 'label' => 'House 1'],
                    ['key' => 'ksr_house2', 'label' => 'House 2'],
                ],
                'default_focus_air' => 'ksr',
                'default_house_air' => 'ksr_house1'
            ];
            $company->save();

            // 2. Create User
            $current_date = date("Y-m-d");
            $current_date = date("Y-m-d", strtotime($current_date . " +1 week"));
            
            $user = new User();
            $user->name = $request->input('name');
            $user->email = $request->input('email');
            $user->password = Hash::make($request->input('password'));
            $user->company_name = $company->name;
            $user->origin_airport_code = $request->input('origin_airport_code');
            $user->pima_address = $request->input('pima_address');
            $user->default_port_id = $request->input('default_port_id');
            $user->can_send = 1;
            $user->is_active = true;
            $user->designation = 'pricing'; // Onboarding admin defaults to pricing designation
            $user->plan_expiry_date = $current_date;
            $user->save();

            // 3. Create Role
            $role = new Role();
            $role->email = $user->email;
            $role->role = 'user';
            $role->save();

            // 4. Return success
            return response()->json([
                'status' => true,
                'message' => 'Onboarding successful!',
                'company' => $company,
                'user' => $user
            ], 200);
        });
    }
}
