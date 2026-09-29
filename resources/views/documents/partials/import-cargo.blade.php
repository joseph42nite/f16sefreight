{{-- The shipment a notice or an order is about — the same block on both. --}}
<table style="margin-top: 8px">
    <tr>
        <td style="width: 25%"><span class="label">{{ $doc['document']['label'] }}</span><span class="value">{{ $doc['document']['no'] ?: '—' }}</span></td>
        <td style="width: 25%"><span class="label">{{ $doc['mode'] === 'sea' ? 'Vessel / voyage' : 'Carrier / flight' }}</span><span class="value">{{ $doc['carriage'] ?: '—' }}</span></td>
        <td style="width: 25%"><span class="label">From → to</span><span class="value">{{ $doc['from'] ?: '—' }} → {{ $doc['to'] ?: '—' }}</span></td>
        <td style="width: 25%"><span class="label">{{ $doc['mode'] === 'sea' ? 'ETA' : 'Arrived' }}</span><span class="value">{{ $doc['arrival'] ? \Illuminate\Support\Carbon::parse($doc['arrival'])->format('d M Y H:i') : '—' }}</span></td>
    </tr>
    <tr>
        <td><span class="label">Job no</span><span class="value">{{ $doc['job_no'] }}</span></td>
        <td><span class="label">IGM no / date</span><span class="value">{{ $doc['igm_no'] ?: '—' }}{{ $doc['igm_date'] ? ' / ' . \Illuminate\Support\Carbon::parse($doc['igm_date'])->format('d M Y') : '' }}</span></td>
        <td><span class="label">Pieces</span><span class="value">{{ $doc['pieces'] !== null ? number_format((int) $doc['pieces']) : '—' }}</span></td>
        <td><span class="label">Gross weight</span><span class="value">{{ $doc['gross'] !== null ? number_format((float) $doc['gross'], 3) . ' kg' : '—' }}</span></td>
    </tr>
    @if ($doc['containers'])
        <tr><td colspan="4"><span class="label">Containers</span><span class="value">@foreach ($doc['containers'] as $c){{ $c->container_number }} {{ $c->container_type }}@if ($c->seal_number) · seal {{ $c->seal_number }}@endif
@endforeach</span></td></tr>
    @endif
</table>
