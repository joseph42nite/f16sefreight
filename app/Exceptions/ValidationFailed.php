<?php

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use RuntimeException;

/**
 * A section of a multi-table write rejected its input.
 *
 * 🔴 THIS EXISTS TO UNWIND A TRANSACTION. `AirwayBillController` writes a waybill across
 * eleven tables in sequence, and each section used to `return` a 422 on bad input — which
 * left every section before it committed. A returned response cannot roll anything back;
 * only an exception can, so the response travels inside one and is unwrapped by the caller.
 *
 * ⚠️ It carries the ORIGINAL response rather than re-deriving one. The section already
 * built the exact validation payload the client expects, field errors and all, and
 * rebuilding it here would drift from whatever the section actually validated.
 */
class ValidationFailed extends RuntimeException
{
    public function __construct(public readonly JsonResponse $response)
    {
        parent::__construct('A waybill section rejected its input.');
    }
}
