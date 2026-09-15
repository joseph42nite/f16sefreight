<?php

namespace App\Http\Controllers\Logistics;

use App\AirwayBills;
use App\HousewayBills;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

/**
 * A 5-minute signed link to a waybill PDF (2026-09-16 audit).
 *
 * The PDFs open in a new browser tab, which sends no sign-in token, so the download routes were public and any
 * AWB or HAWB could be fetched by its number. Now the page asks here first — with its token — for the path it wants
 * (`download-awb-pdf/17610000008`); this checks the waybill is the caller's branch and returns a signed URL.
 */
class PdfLinkController extends Controller
{
    private const MINUTES = 5;

    public function __invoke(Request $request): JsonResponse
    {
        $path = trim((string) $request->validate(['path' => ['required', 'string', 'max:200']])['path'], '/');

        try {
            $route = Route::getRoutes()->match(Request::create('/' . $path));
        } catch (HttpExceptionInterface) {
            abort(422, 'Not a waybill PDF.');
        }

        abort_unless(str_starts_with((string) $route->getName(), 'pdf.'), 422, 'Not a waybill PDF.');
        $params = $route->parameters();

        if (isset($params['id'])) {
            $model = str_contains($route->getName(), 'hawb') ? HousewayBills::class : AirwayBills::class;
            abort_unless($model::whereKey($params['id'])->exists(), 404, 'Waybill not found.');
            $this->abortUnlessOwnWaybill($model, $params['id']);
        } else {
            $master = AirwayBills::where('awb_code', $params['awb_code'])->where('awb_no', $params['awb_no'])->value('id');
            abort_if($master === null, 404, 'Waybill not found.');
            $this->abortUnlessOwnWaybill(AirwayBills::class, $master);
        }

        return response()->json(['url' => URL::temporarySignedRoute($route->getName(), now()->addMinutes(self::MINUTES), $params)]);
    }
}
