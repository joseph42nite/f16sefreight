<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\SuperAdmin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
class SuperAdminController extends Controller
{
    public function register(Request $request){
        $superadmin=new SuperAdmin();
        $superadmin->name=$request->name;
        $superadmin->email=$request->email;
        $superadmin->password=Hash::make($request->password);
        $superadmin->save();
        if($superadmin){
            return response()->json(['user'=>$superadmin,'status'=>true]);
        }
        else{
           return response()->json(['status'=>false]);
        }
    }

    public function me()
    {
        return response()->json(auth()->guard('superAdmin-api')->user());
    }

    public function logout()
    {
        auth()->guard('superAdmin-api')->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }
    protected function respondWithToken($token)
    {
        return response()->json([
            'token' => $token,
            'token_type' =>  'bearer',
        ]);
    }

    public function update(Request $request){
        $id=auth()->guard('superAdmin-api')->user()->id;
        SuperAdmin::where('id',$id)->update(['name'=>$request->name]);
        return json_encode(['status'=>true,'message'=>"Data updated successful"]);
    }
    public function update_password(Request $request){
        $validator = Validator::make($request->all(), [
            'password' => ['required', 'confirmed','min:4'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $id=auth()->guard('superAdmin-api')->user()->id;
        SuperAdmin::where('id', $id)->update(['password'=>Hash::make($request->password)]);
        return json_encode(['status'=>true,'message'=>"Password updated successful"]);
    }

    public function getClientShipments(Request $request)
    {
        $query = \App\AirwayBills::query();

        if ($request->filled('company_id')) {
            $query->whereHas('agentsInfo', function ($q) use ($request) {
                $q->where('company_id', $request->company_id);
            });
        }

        // Search filters
        if ($request->filled('origin')) {
            $query->where('departure_airport', 'like', '%' . $request->origin . '%');
        }

        if ($request->filled('destination')) {
            $query->where('destination_airport', 'like', '%' . $request->destination . '%');
        }

        // AWB Number Search
        if ($request->filled('search')) {
            $search = trim($request->search);
            if (strpos($search, '-') !== false) {
                $parts = explode('-', $search, 2);
                $query->where('awb_code', $parts[0])
                      ->where('awb_no', $parts[1]);
            } else {
                $query->where(function ($q) use ($search) {
                    $q->where('awb_no', 'like', '%' . $search . '%')
                      ->orWhere('awb_code', 'like', '%' . $search . '%');
                });
            }
        }

        if ($request->has('dates') && is_array($request->dates) && count($request->dates) > 0) {
            $query->where(function($q) use ($request) {
                foreach ($request->dates as $date) {
                    if (!empty($date)) {
                        $q->orWhereDate('created_at', '=', $date);
                    }
                }
            });
        }

        if ($request->has('months') && is_array($request->months) && count($request->months) > 0) {
            $query->where(function($q) use ($request) {
                foreach ($request->months as $month) {
                    if (!empty($month)) {
                        $parts = explode('-', $month);
                        if (count($parts) === 2) {
                            $q->orWhere(function($sub) use ($parts) {
                                $sub->whereYear('created_at', $parts[0])
                                    ->whereMonth('created_at', $parts[1]);
                            });
                        }
                    }
                }
            });
        }

        // Database-level filtering for FNA Status
        if ($request->filled('fna_status')) {
            $driver = \Illuminate\Support\Facades\DB::getDriverName();
            $concatSql = $driver === 'sqlite' 
                ? "awb_code || '-' || awb_no" 
                : "CONCAT(awb_code, '-', awb_no)";

            if ($request->fna_status === 'yes') {
                $query->whereExists(function ($q) use ($concatSql) {
                    $q->select(\Illuminate\Support\Facades\DB::raw(1))
                      ->from('status_response')
                      ->whereRaw("status_response.business_id = {$concatSql}")
                      ->where('status_response.business_status_code', 'Rejected')
                      ->whereRaw("status_response.id = (SELECT MAX(sr2.id) FROM status_response sr2 WHERE sr2.business_id = {$concatSql})");
                });
            } elseif ($request->fna_status === 'no') {
                $query->where(function ($outer) use ($concatSql) {
                    $outer->whereNotExists(function ($q) use ($concatSql) {
                        $q->select(\Illuminate\Support\Facades\DB::raw(1))
                          ->from('status_response')
                          ->whereRaw("status_response.business_id = {$concatSql}");
                    })->orWhereExists(function ($q) use ($concatSql) {
                        $q->select(\Illuminate\Support\Facades\DB::raw(1))
                          ->from('status_response')
                          ->whereRaw("status_response.business_id = {$concatSql}")
                          ->where('status_response.business_status_code', '!=', 'Rejected')
                          ->whereRaw("status_response.id = (SELECT MAX(sr2.id) FROM status_response sr2 WHERE sr2.business_id = {$concatSql})");
                    });
                });
            }
        }

        // Calculate counts before pagination/limit
        $totalAwb = $query->count();
        
        $totalHawbQuery = (clone $query)->withCount('houseWayBills');
        $totalHawb = \Illuminate\Support\Facades\DB::table(\Illuminate\Support\Facades\DB::raw("({$totalHawbQuery->toSql()}) as sub"))
            ->mergeBindings($totalHawbQuery->getQuery())
            ->sum('house_way_bills_count');

        // Order and Eager load
        $query->with(['consignmentData', 'agentsInfo.companyName'])
            ->withCount('houseWayBills')
            ->orderBy('updated_at', 'desc');

        if ($request->get('export') === 'all') {
            $shipments = $query->get();
        } else {
            $perPage = (int) $request->get('per_page', 50);
            if ($perPage <= 0) $perPage = 50;

            $paginator = $query->paginate($perPage);
            $shipments = collect($paginator->items());
        }

        // Fetch status responses only for the retrieved shipments list
        $awbIdsWithHyphen = $shipments->map(function ($awb) {
            return $awb->awb_code . '-' . $awb->awb_no;
        })->toArray();

        // Fetch the latest status response per AWB (by highest id)
        $allResponses = \App\StatusReponse::whereIn('business_id', $awbIdsWithHyphen)
            ->orderBy('id', 'desc')
            ->get();
        $statusResponses = $allResponses->unique('business_id')->keyBy('business_id');

        // Map status responses details back to models
        $shipments->each(function ($awb) use ($statusResponses) {
            $key = $awb->awb_code . '-' . $awb->awb_no;
            $latestResponse = $statusResponses->get($key);
            // Only mark as FNA if the LATEST response is Rejected
            $isFna = $latestResponse && $latestResponse->business_status_code === 'Rejected';
            $awb->fna_received = $isFna;
            $awb->fna_reason = $isFna ? $latestResponse->reason : null;
            $awb->fma_reason = (!$isFna && $latestResponse) ? $latestResponse->reason : null;
            $awb->latest_status = $latestResponse ? $latestResponse->business_status_code : 'FMA';
        });

        $responseData = [
            'shipments' => $shipments,
            'total_awb' => $totalAwb,
            'total_hawb' => (int) $totalHawb,
        ];

        if ($request->get('export') !== 'all') {
            $responseData['pagination'] = [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ];
        }

        return response()->json($responseData);
    }

    public function getShipmentXml($awb_id)
    {
        $fileName = "xml-conversion-files/xml_airway_bill_{$awb_id}.xml";
        if (\Illuminate\Support\Facades\Storage::exists($fileName)) {
            $content = \Illuminate\Support\Facades\Storage::get($fileName);
            return response($content, 200)->header('Content-Type', 'application/xml');
        }

        // Fallback: Generate mockup/simulated XML if it doesn't exist for test purposes
        $awb = \App\AirwayBills::with(['consignmentData', 'agentsInfo'])->where('id', $awb_id)->first();
        if ($awb) {
            $xml = new \SimpleXMLElement('<ShipmentMessage/>');
            $xml->addChild('AwbNumber', $awb->awb_code . '-' . $awb->awb_no);
            $xml->addChild('Origin', $awb->departure_airport);
            $xml->addChild('Destination', $awb->destination_airport);
            $xml->addChild('Pieces', $awb->consignmentData->pieces ?? 0);
            $xml->addChild('Weight', $awb->consignmentData->gross_weight ?? 0);
            $xml->addChild('SentAt', $awb->created_at);
            $xml->addChild('Note', 'Simulated XML generated on the fly as file was not found');
            return response($xml->asXML(), 200)->header('Content-Type', 'application/xml');
        }

        return response()->json(['error' => 'XML file not found'], 404);
    }

    public function getMawbHawbs($awb_code, $awb_no)
    {
        try {
            $houseWayBills = \App\HousewayBills::where('awb_code', $awb_code)
                ->where('awb_no', $awb_no)
                ->with('consignmentData')
                ->get();

            $hawbIds = $houseWayBills->pluck('id')->toArray();
            
            $allResponses = \App\StatusReponse::whereIn('business_id', $hawbIds)
                ->orderBy('id', 'desc')
                ->get();
                
            $statusResponses = $allResponses->unique('business_id')->keyBy('business_id');

            $houseWayBills->each(function ($hawb) use ($statusResponses) {
                $latestResponse = $statusResponses->get($hawb->id);
                $isFna = $latestResponse && $latestResponse->business_status_code === 'Rejected';
                $hawb->fna_received = $isFna;
                $hawb->fna_reason = $isFna ? $latestResponse->reason : null;
                $hawb->latest_status = $latestResponse ? $latestResponse->business_status_code : 'FMA';
                $hawb->fma_reason = (!$isFna && $latestResponse) ? $latestResponse->reason : null;
            });

            return response()->json($houseWayBills);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch house way bills',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getHawbXml($hawb_id)
    {
        $fileName = "xml-conversion-files/xml_houseway_bill_{$hawb_id}.xml";
        if (\Illuminate\Support\Facades\Storage::exists($fileName)) {
            $content = \Illuminate\Support\Facades\Storage::get($fileName);
            return response($content, 200)->header('Content-Type', 'application/xml');
        }

        // Fallback: Generate mockup/simulated XML if it doesn't exist for test purposes
        $hawb = \App\HousewayBills::with(['consignmentData'])->where('id', $hawb_id)->first();
        if ($hawb) {
            $xml = new \SimpleXMLElement('<HouseShipmentMessage/>');
            $xml->addChild('HouseAwbNumber', $hawb->id);
            $xml->addChild('MasterAwbNumber', $hawb->awb_code . '-' . $hawb->awb_no);
            $xml->addChild('Destination', $hawb->destination_airport);
            $xml->addChild('Pieces', $hawb->consignmentData->pieces ?? 0);
            $xml->addChild('Weight', $hawb->consignmentData->gross_weight ?? 0);
            $xml->addChild('SentAt', $hawb->created_at);
            $xml->addChild('Note', 'Simulated HAWB XML generated on the fly as file was not found');
            return response($xml->asXML(), 200)->header('Content-Type', 'application/xml');
        }

        return response()->json(['error' => 'XML file not found'], 404);
    }
}
