<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class OcrController extends Controller
{
    public function extract(Request $request)
    {
        $request->validate([
            'pdf' => ['required','file','mimes:pdf']
        ]);

        $file = $request->file('pdf');
        $path = $file->storeAs('uploads', $file->getClientOriginalName());

        $python = config('common-data.python_path'); 
        $script = realpath(base_path('python/extract_awb.py')); 
        $pdf = realpath(storage_path('app/' . $path)); 

        $process = new Process([$python, $script, $pdf]);
        $process->setWorkingDirectory(base_path());
        $process->setEnv(['PYTHONHASHSEED' => '0']);

        try {
            $process->mustRun();
        } catch (ProcessFailedException $e) {
            \Log::error('Python failed: '.$process->getErrorOutput());
            throw $e;
        }

        $output = $process->getOutput();
        $data = json_decode($output, true) ?: [];

        // Option 1: redirect with data in session
        return redirect('/ocr')->with('data', $data);

        // Option 2: return JSON directly
        // return response()->json($data);
    }
}
