{{--
  The printed bill of lading — House or Master (guide Step 12.3, GAPS #433).

  ❓ PROPOSED LAYOUT — the conventional box layout, filled only from what the FocusSea form stores. Anything the form
  does not hold (place and date of issue, number of originals, shipped-on-board date) is left as a blank box rather
  than guessed. Shown to the owner before it is called done.
--}}
<style>
    body { font-family: DejaVu Sans, sans-serif; font-size: 9.5px; color: #111; }
    table { width: 100%; border-collapse: collapse; }
    td, th { border: 1px solid #333; vertical-align: top; padding: 4px 5px; }
    .label { font-size: 7.5px; text-transform: uppercase; letter-spacing: .5px; color: #555; display: block; margin-bottom: 2px; }
    .value { font-size: 10px; white-space: pre-line; }
    .title { font-size: 15px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
    .number { font-size: 13px; font-weight: bold; font-family: DejaVu Sans Mono, monospace; }
    .mono { font-family: DejaVu Sans Mono, monospace; }
    .goods th { background: #eee; font-size: 7.5px; text-transform: uppercase; text-align: left; }
    .num { text-align: right; }
    .tall { height: 58px; }
    .blank { color: #999; }
    .draft { position: fixed; top: 38%; left: 12%; font-size: 90px; color: rgba(200, 0, 0, .12); transform: rotate(-30deg); font-weight: bold; }
    .foot td { height: 48px; }
</style>

@if ($bl['draft'])
    <div class="draft">DRAFT</div>
@endif

<table>
    <tr>
        <td style="width: 55%" class="tall">
            <span class="label">Shipper</span>
            <span class="value">@if ($bl['shipper']){{ $bl['shipper']['name'] }}
{{ $bl['shipper']['address'] }}@else<span class="blank">—</span>@endif</span>
        </td>
        <td rowspan="2">
            <div class="title">{{ $bl['title'] }}</div>
            <span class="label" style="margin-top: 6px">B/L No.</span>
            <div class="number">{{ $bl['number'] ?: 'NOT YET NUMBERED' }}</div>
            @if ($bl['bl_type'] || $bl['release'])
                <div style="margin-top: 4px">{{ collect([$bl['bl_type'] ? strtoupper($bl['bl_type']) : null, $bl['release'] ? 'Release: ' . ucfirst($bl['release']) : null])->filter()->join(' · ') }}</div>
            @endif
            <table style="margin-top: 8px">
                @foreach ($bl['refs'] as $label => $value)
                    @if ($value)
                        <tr><td style="border: none; padding: 1px 0; width: 40%"><span class="label">{{ $label }}</span></td>
                            <td style="border: none; padding: 1px 0" class="mono">{{ $value }}</td></tr>
                    @endif
                @endforeach
            </table>
            <div style="margin-top: 8px">
                <span class="label">Issued by</span>
                <strong>{{ $bl['issuer']['name'] }}</strong>@if ($bl['issuer']['branch']) — {{ $bl['issuer']['branch'] }}@endif<br>
                {{ $bl['issuer']['address'] }}
                @if ($bl['issuer']['gst_no'])<br>GSTIN {{ $bl['issuer']['gst_no'] }}@endif
            </div>
        </td>
    </tr>
    <tr>
        <td class="tall">
            <span class="label">Consignee</span>
            <span class="value">@if ($bl['consignee']){{ $bl['consignee']['name'] }}
{{ $bl['consignee']['address'] }}@else<span class="blank">—</span>@endif</span>
        </td>
    </tr>
    <tr>
        <td class="tall">
            <span class="label">Notify party</span>
            <span class="value">@if ($bl['notify']){{ $bl['notify']['name'] }}
{{ $bl['notify']['address'] }}@else<span class="blank">—</span>@endif</span>
        </td>
        <td>
            <span class="label">Carrier</span>
            <span class="value">{{ $bl['carrier'] ?: '—' }}</span>
            @if ($bl['via'])
                <span class="label" style="margin-top: 6px">Transshipment via</span>
                <span class="value mono">{{ implode(' → ', $bl['via']) }}</span>
            @endif
        </td>
    </tr>
</table>

<table style="margin-top: -1px">
    <tr>
        <td style="width: 25%"><span class="label">Place of receipt</span><span class="value mono">{{ $bl['por'] ?: '—' }}</span></td>
        <td style="width: 25%"><span class="label">Vessel / voyage</span><span class="value">{{ $bl['vessel'] ?: '—' }}</span>
            @if ($bl['flag'] || $bl['imo'])<br><span class="mono">{{ collect([$bl['flag'], $bl['imo'] ? 'IMO ' . $bl['imo'] : null])->filter()->join(' · ') }}</span>@endif
        </td>
        <td style="width: 25%"><span class="label">Port of loading</span><span class="value mono">{{ $bl['pol'] ?: '—' }}</span>
            @if ($bl['etd'])<br>ETD {{ \Illuminate\Support\Carbon::parse($bl['etd'])->format('d M Y') }}@endif
        </td>
        <td style="width: 25%"><span class="label">Port of discharge</span><span class="value mono">{{ $bl['pod'] ?: '—' }}</span>
            @if ($bl['eta'])<br>ETA {{ \Illuminate\Support\Carbon::parse($bl['eta'])->format('d M Y') }}@endif
        </td>
    </tr>
    <tr>
        <td><span class="label">Place of delivery</span><span class="value mono">{{ $bl['del'] ?: '—' }}</span></td>
        <td><span class="label">Freight</span><span class="value">{{ $bl['freight_terms'] ? ucfirst($bl['freight_terms']) : '—' }}</span></td>
        <td colspan="2"><span class="label">Place and date of issue · Number of originals</span><span class="blank">(not held on the form)</span></td>
    </tr>
</table>

<table class="goods" style="margin-top: 8px">
    <thead>
        <tr>
            <th style="width: 24%">Marks &amp; numbers · Container / seal</th>
            <th style="width: 12%">Packages</th>
            <th>Description of goods</th>
            <th style="width: 13%" class="num">Gross weight</th>
            <th style="width: 11%" class="num">Measurement</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="value" style="height: 240px">@if ($bl['marks']){{ $bl['marks'] }}
@endif
@foreach ($bl['containers'] as $c)
<span class="mono">{{ $c->container_number }}</span> {{ $c->container_type }}@if ($c->seal_number) · Seal <span class="mono">{{ $c->seal_number }}</span>@endif

@endforeach</td>
            <td class="value">{{ $bl['pieces'] !== null ? number_format((int) $bl['pieces']) : '—' }} {{ $bl['package'] }}</td>
            <td class="value">{{ $bl['commodity'] ?: '—' }}
@if ($bl['hs_code'])HS {{ $bl['hs_code'] }}
@endif
@if ($bl['imdg'])DANGEROUS GOODS — IMDG {{ $bl['imdg'] }}
@endif
@if ($bl['kind'] === 'master' && $bl['houses'])Consolidated cargo: {{ $bl['houses'] }} house bill(s) as per attached list
@endif</td>
            <td class="value num">{{ $bl['gross'] !== null ? number_format((float) $bl['gross'], 3) : '—' }} {{ $bl['weight_unit'] }}
@if ($bl['net'])Net {{ number_format((float) $bl['net'], 3) }}@endif</td>
            <td class="value num">{{ $bl['volume'] !== null ? number_format((float) $bl['volume'], 3) : '—' }} {{ $bl['volume_unit'] }}</td>
        </tr>
    </tbody>
</table>

<table class="foot" style="margin-top: 8px">
    <tr>
        <td style="width: 50%"><span class="label">Shipped on board — date</span><span class="blank">(not held on the form)</span></td>
        <td><span class="label">For {{ $bl['issuer']['name'] }}</span><br><br><span class="label">Authorised signatory</span></td>
    </tr>
</table>
