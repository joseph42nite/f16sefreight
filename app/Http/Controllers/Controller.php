<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * 🔒 A master or house waybill is read and written only by its own branch (2026-09-16 audit).
     *
     * The waybill tables carry no tenant scope and their key is the AWB / HAWB number, so an id was enough to read,
     * overwrite or send another forwarder's waybill. A number not yet on file is allowed: that is a new waybill.
     *
     * @param  class-string<\App\AirwayBills|\App\HousewayBills>  $model
     */
    protected function abortUnlessOwnWaybill(string $model, $id): void
    {
        $agentId = $id === null || $id === '' ? null : $model::whereKey($id)->value('agent_id');

        abort_if($agentId !== null && (int) $agentId !== (int) auth()->user()?->branch_name, 404, 'Waybill not found.');
    }
}
