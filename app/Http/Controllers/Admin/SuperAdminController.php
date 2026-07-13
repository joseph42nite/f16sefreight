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
        $query = \App\AirwayBills::with(['consignmentData', 'agentsInfo.companyName'])
            ->withCount('houseWayBills')
            ->orderBy('created_at', 'desc');

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

        if ($request->filled('date')) {
            $query->whereDate('created_at', '=', $request->date);
        }

        $shipments = $query->get();

        // Fetch all status responses for these shipments
        $awbIdsWithHyphen = $shipments->map(function ($awb) {
            return $awb->awb_code . '-' . $awb->awb_no;
        })->toArray();

        $statusResponses = \App\StatusReponse::whereIn('business_id', $awbIdsWithHyphen)->get();

        // Map status responses to shipments
        $shipments->each(function ($awb) use ($statusResponses) {
            $key = $awb->awb_code . '-' . $awb->awb_no;
            $fnaResponse = $statusResponses->first(function ($res) use ($key) {
                return $res->business_id == $key && $res->business_status_code == 'Rejected';
            });
            $awb->fna_received = $fnaResponse ? true : false;
            $awb->fna_reason = $fnaResponse ? $fnaResponse->reason : null;
        });

        // Filter by FNA Status if specified
        if ($request->filled('fna_status')) {
            if ($request->fna_status === 'yes') {
                $shipments = $shipments->filter(function ($awb) {
                    return $awb->fna_received === true;
                })->values();
            } elseif ($request->fna_status === 'no') {
                $shipments = $shipments->filter(function ($awb) {
                    return $awb->fna_received === false;
                })->values();
            }
        }

        // Calculate counts
        $totalAwb = $shipments->count();
        $totalHawb = $shipments->sum('house_way_bills_count');

        return response()->json([
            'shipments' => $shipments,
            'total_awb' => $totalAwb,
            'total_hawb' => $totalHawb
        ]);
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
}
