{{-- Shared head of the two import documents: who issues it, what it is, and its number (GAPS #434). --}}
<style>
    body { font-family: DejaVu Sans, sans-serif; font-size: 10px; color: #111; }
    table { width: 100%; border-collapse: collapse; }
    td, th { border: 1px solid #333; vertical-align: top; padding: 5px 6px; }
    .label { font-size: 7.5px; text-transform: uppercase; letter-spacing: .5px; color: #555; display: block; margin-bottom: 2px; }
    .value { font-family: Courier, monospace; font-size: 10.5px; white-space: pre-line; }
    .title { font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
    .num { text-align: right; }
    .plain td { border: none; padding: 1px 0; }
    .sign td { height: 56px; }
</style>
<table>
    <tr>
        <td style="width: 58%">
            <strong style="font-size: 13px">{{ $doc['issuer']['name'] }}</strong>@if ($doc['issuer']['branch']) — {{ $doc['issuer']['branch'] }}@endif<br>
            {{ $doc['issuer']['address'] }}@if ($doc['issuer']['gst_no'])<br>GSTIN {{ $doc['issuer']['gst_no'] }}@endif
        </td>
        <td>
            <div class="title">{{ $title }}</div>
            <span class="label" style="margin-top: 6px">Number</span><span class="value">{{ $number }}</span>
            <span class="label" style="margin-top: 4px">Date</span><span class="value">{{ $date ? \Illuminate\Support\Carbon::parse($date)->format('d M Y') : '—' }}</span>
        </td>
    </tr>
</table>
