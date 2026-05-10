<table class="table table-sm table-bordered">
  <tbody>
  @foreach($data as $key => $value)
    <tr>
      <th style="width:30%">{{ ucwords(str_replace('_',' ', $key)) }}</th>
      <td>
        @if(is_array($value))
          @include('tools.ocr.json-table', ['data' => $value])
        @else
          {{ $value ?? '—' }}
        @endif
      </td>
    </tr>
  @endforeach
  </tbody>
</table>
