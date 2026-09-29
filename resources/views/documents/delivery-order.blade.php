{{--
  Delivery order (PRD §5.8 [Sea], §5.9 [Air]) — GAPS #434. Printed only once the release gate passes.
  ❓ PROPOSED layout; no legal wording is invented — it names who the cargo is released to, and the shipment.
--}}
@include('documents.partials.import-head', ['title' => 'Delivery Order', 'number' => $doc['do']->do_number, 'date' => $doc['do']->do_date])

<table style="margin-top: 8px">
    <tr>
        <td style="width: 50%"><span class="label">DO given to</span><span class="value">{{ $doc['do']->do_given_to ?: '—' }}</span></td>
        <td><span class="label">Consignee</span><span class="value">@if ($doc['consignee']){{ $doc['consignee']['name'] }}
{{ $doc['consignee']['address'] }}@elseif ($doc['client']){{ $doc['client']->name }}@else—@endif</span></td>
    </tr>
    <tr>
        <td><span class="label">Against arrival notice</span><span class="value">{{ $doc['can']->notice_number ?? '—' }}</span></td>
        <td><span class="label">DO fee</span><span class="value">{{ $doc['do']->fee !== null ? 'INR ' . number_format((float) $doc['do']->fee, 2) : '—' }}</span></td>
    </tr>
</table>

@include('documents.partials.import-cargo')

<table class="sign" style="margin-top: 10px"><tr><td style="width: 50%"><span class="label">Received by</span></td><td><span class="label">For {{ $doc['issuer']['name'] }}</span><br><br><span class="label">Authorised signatory</span></td></tr></table>
