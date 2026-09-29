{{--
  Cargo arrival notice (PRD §8.1: arrival time, storage grace period, release fees) — GAPS #434.
  ❓ PROPOSED layout; no wording is invented. The fees listed are the shipment's issued bills, never an estimate.
--}}
@include('documents.partials.import-head', ['title' => 'Cargo Arrival Notice', 'number' => $doc['can']->notice_number, 'date' => $doc['can']->created_at])

<table style="margin-top: 8px">
    <tr>
        <td style="width: 50%"><span class="label">To</span><span class="value">@if ($doc['consignee']){{ $doc['consignee']['name'] }}
{{ $doc['consignee']['address'] }}@elseif ($doc['client']){{ $doc['client']->name }}
{{ $doc['client']->address }}@else—@endif</span></td>
        <td><span class="label">Free storage</span><span class="value">{{ $doc['free_days'] !== null ? $doc['free_days'] . ' day(s)' : '—' }}</span>
            <span class="label" style="margin-top: 4px">Storage charges from</span><span class="value">{{ $doc['storage_from'] ? \Illuminate\Support\Carbon::parse($doc['storage_from'])->format('d M Y') : '—' }}</span></td>
    </tr>
</table>

@include('documents.partials.import-cargo')

<table style="margin-top: 8px">
    <tr><th style="text-align: left">Charges billed on this shipment</th><th class="num" style="width: 22%">Amount</th><th class="num" style="width: 22%">Still due</th></tr>
    @forelse ($doc['bills'] as $b)
        <tr><td class="value">{{ $b->invoice_no }}{{ $b->type === 'credit_note' ? ' (credit)' : '' }}</td>
            <td class="value num">{{ $b->currency }} {{ number_format((float) $b->grand_total, 2) }}</td>
            <td class="value num">{{ $b->currency }} {{ number_format(max(0, (float) $b->grand_total - (float) $b->amount_paid), 2) }}</td></tr>
    @empty
        <tr><td colspan="3">No charges billed yet.</td></tr>
    @endforelse
</table>

<table class="sign" style="margin-top: 10px"><tr><td style="width: 50%"></td><td><span class="label">For {{ $doc['issuer']['name'] }}</span><br><br><span class="label">Authorised signatory</span></td></tr></table>
