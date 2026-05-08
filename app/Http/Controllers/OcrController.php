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
            'upload_file' => ['required', 'file', 'mimes:pdf'],
            'type' => ['required', 'string']
        ]);

        $type = $request->type;
        $file = $request->file('upload_file');
        $path = $file->storeAs('uploads', $file->getClientOriginalName());

        $python = config('common-data.python_path') ?: '/usr/bin/python3';
        $script = realpath(base_path('python/extract_awb_new.py'));
        $pdf = realpath(storage_path('app/' . $path));
        $box_path = realpath(base_path('python/boxes_config.json'));
        $process = new Process([$python, $script, $pdf, $type, $box_path]);
        $process->setWorkingDirectory(base_path());
        $process->setEnv(['PYTHONHASHSEED' => '0']);

        try {
            $process->mustRun();
        } catch (ProcessFailedException $e) {
            \Log::error('OCR Python Process Failed: ' . $process->getErrorOutput());
            return response()->json(['status' => false, 'error' => $process->getErrorOutput()], 500);
        }

        $output = $process->getOutput();
        \Log::info('OCR Output: ' . $output);
        $data = json_decode($output, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            \Log::error('OCR JSON Decode Error: ' . json_last_error_msg() . ' | Raw Output: ' . $output);
            return response()->json(['status' => false, 'error' => 'Invalid JSON output from OCR script'], 500);
        }

        return response()->json(['status' => true, 'data' => $data, 'msg' => '']);
        // Option 1: redirect with data in session
        // return redirect('/ocr')->with('data', $data);
    }
}