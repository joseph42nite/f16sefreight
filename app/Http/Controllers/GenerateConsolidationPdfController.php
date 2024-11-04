<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\App;
use Barryvdh\DomPDF\Facade\Pdf;

class GenerateConsolidationPdfController extends Controller
{
    public function downloadConsolidationPdf($awb_code = '57', $awbId = '51929872')
    {
        $pdf = Pdf::loadView('generate-Consolidation-pdf')->setPaper('a4', 'portrait')->set_option('isHtml5ParserEnabled', true);
        return $pdf->stream();
    
    }
}
