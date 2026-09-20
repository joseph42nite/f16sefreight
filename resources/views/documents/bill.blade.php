{{--
  One printed bill — invoice, debit note, credit note, brokerage or consol (user, 2026-09-19).

  🔴 Every figure comes from the document row and its items. Nothing is recomputed here: a template that adds its own
  totals can print a number the ledger never saw.
--}}
<style>
    body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #111; }
    .head { border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 12px; }
    .company { font-size: 16px; font-weight: bold; }
    .muted { color: #555; }
    .title { font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
    table { width: 100%; border-collapse: collapse; }
    .meta td { padding: 2px 0; vertical-align: top; }
    .lines th { background: #f0f0f0; border: 1px solid #bbb; padding: 5px; text-align: left; font-size: 10px; }
    .lines td { border: 1px solid #ddd; padding: 5px; }
    .num { text-align: right; }
    .totals td { padding: 3px 5px; }
    .grand { font-weight: bold; border-top: 1px solid #111; }
    .foot { margin-top: 24px; font-size: 10px; color: #555; }
    .page { page-break-after: always; }
    .page:last-child { page-break-after: auto; }
</style>

@foreach ($bills as $bill)
    <div class="page">
        <div class="head">
            <table>
                <tr>
                    <td>
                        <div class="company">{{ $bill['company'] }}</div>
                        <div class="muted">{{ $bill['branch'] }}</div>
                        @if ($bill['gst_no'])<div class="muted">GSTIN {{ $bill['gst_no'] }}</div>@endif
                    </td>
                    <td class="num">
                        <div class="title">{{ $bill['title'] }}</div>
                        <div>{{ $bill['invoice_no'] }}</div>
                        <div class="muted">{{ $bill['document_date'] }}</div>
                    </td>
                </tr>
            </table>
        </div>

        <table class="meta">
            <tr>
                <td width="55%">
                    <strong>Bill to</strong><br />
                    {{ $bill['organization'] }}<br />
                    @if ($bill['organization_gst'])<span class="muted">GSTIN {{ $bill['organization_gst'] }}</span>@endif
                </td>
                <td>
                    @if ($bill['job_no'])<div>Shipment: {{ $bill['job_no'] }}</div>@endif
                    @if ($bill['awb_number'])<div>AWB: {{ $bill['awb_number'] }}</div>@endif
                    @if ($bill['due_date'])<div>Due: {{ $bill['due_date'] }}</div>@endif
                    @if ($bill['parent_no'])<div>Against invoice: {{ $bill['parent_no'] }}</div>@endif
                    @if ($bill['irn'])<div class="muted">IRN {{ $bill['irn'] }}</div>@endif
                </td>
            </tr>
        </table>

        @if ($bill['reason'])<p><strong>Reason:</strong> {{ $bill['reason'] }}</p>@endif

        <table class="lines" style="margin-top: 12px;">
            <thead>
                <tr>
                    <th width="38%">Description</th>
                    <th>HSN/SAC</th>
                    <th class="num">Qty</th>
                    <th class="num">Rate</th>
                    <th class="num">Amount</th>
                    <th class="num">Tax</th>
                    <th class="num">Net</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($bill['items'] as $item)
                    <tr>
                        <td>{{ $item->description }}</td>
                        <td>{{ $item->hsn_sac_code }}</td>
                        <td class="num">{{ rtrim(rtrim(number_format((float) $item->quantity, 3), '0'), '.') }}</td>
                        <td class="num">{{ number_format((float) $item->rate, 2) }}</td>
                        <td class="num">{{ number_format((float) $item->amount, 2) }}</td>
                        <td class="num">{{ number_format((float) $item->tax_amount, 2) }} @if ((float) $item->tax_percentage > 0)<span class="muted">({{ rtrim(rtrim(number_format((float) $item->tax_percentage, 2), '0'), '.') }}%)</span>@endif</td>
                        <td class="num">{{ number_format((float) $item->net_amount, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <table class="totals" style="margin-top: 10px;">
            <tr><td></td><td width="30%" class="num">Subtotal</td><td width="18%" class="num">{{ $bill['currency'] }} {{ number_format($bill['subtotal'], 2) }}</td></tr>
            <tr><td></td><td class="num">Tax</td><td class="num">{{ $bill['currency'] }} {{ number_format($bill['tax_amount'], 2) }}</td></tr>
            <tr class="grand"><td></td><td class="num">Total</td><td class="num">{{ $bill['currency'] }} {{ number_format($bill['grand_total'], 2) }}</td></tr>
            @if ($bill['currency'] !== 'INR')
                <tr><td></td><td class="num muted">In INR at {{ $bill['exchange_rate'] }}</td><td class="num muted">INR {{ number_format($bill['amount_inr'], 2) }}</td></tr>
            @endif
        </table>

        @if ($bill['narration'])<p class="muted" style="margin-top: 14px;">{{ $bill['narration'] }}</p>@endif

        <div class="foot">
            {{ $bill['status_line'] }}
        </div>
    </div>
@endforeach
