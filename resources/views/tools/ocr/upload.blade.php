<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AWB OCR Extractor</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container py-5">
  
  <h3 class="mb-4 text-center">Extract AWB Details</h3>
  
  <form action="{{ route('ocr.extract') }}" method="POST" enctype="multipart/form-data" class="card p-4 shadow-sm">
    @csrf
    <div class="mb-3">
      <label class="form-label">Upload AWB PDF</label>
      <input type="file" name="pdf" class="form-control" required>
    </div>
    <button type="submit" class="btn btn-primary w-100">Extract</button>
  </form>

  @if(session('data'))
  <div class="card mt-4 p-4 shadow-sm">
    <h5>Extracted AWB Details</h5>
    @include('tools.ocr.json-table', ['data' => session('data')])
  </div>
  @endif
</div>
</body>
</html>