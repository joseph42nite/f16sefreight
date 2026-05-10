<!doctype html>
<html lang="en">
<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>

    </style>
</head>
<body style="word-spacing:normal;margin: 0 auto;">
    <table align="center" cellpadding="0" cellspacing="0" align="center" width="600px">
        <tr>
            <td align="center" valign="top">
                <table cellpadding="0" cellspacing="0" width="100%">
                    <!-- main first row Section -->
                    <tr>
                        <td align="center" valign="top" width="600px">
                            <table cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <!-- first section code -->
                                    <!-- left section code -->
                                    <td align="left" valign="top" width="300px">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td align="left" valign="top" style="font-size: 12px;line-height: 16px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;">
                                                    <font style="font-size:16px;line-height:22px;"><b>{{ $agentInfo->agent_name ?? ''}}</b></font><br/>
                                                    {{ $agentInfo->agent_address ?? ''}}<br>
                                                    {{ $agentInfo->agent_city ?? ''}} - {{ $agentInfo->agent_pincode ?? ''}},{{ $agentInfo->agent_country ?? ''}}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <!-- left section code -->
                                    <!-- right section code -->
                                    <td align="right" valign="top" width="300px">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td align="right" valign="top" width="230px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="right" valign="top" style="font-size: 12px;line-height: 16px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;">
                                                                &nbsp;
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td align="right" valign="top" width="170px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="left" valign="top" style="color: #000000;padding-bottom:2px;">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 12px;line-height: 16px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;padding-left:2px;border:1px solid #000;">
                                                                            <b>CONSOL</b>
                                                                            <br />
                                                                            &nbsp;
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="left" valign="top" style="padding-bottom:2px;">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 12px;line-height: 16px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;padding-left:2px;border:1px solid #000;">
                                                                            <b>MAWB</b>
                                                                            <br />
                                                                            {{ $airWayBill->awb_code ?? ''}} - {{ $airWayBill->awb_no ?? ''}}
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="left" valign="top">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 12px;line-height: 16px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;padding-left:2px;border:1px solid #000;">
                                                                            <b>DATE</b>
                                                                            <br />
                                                                            @php
                                                                                echo date('d-M-Y', strtotime($airWayBill->created_at ?? ''));
                                                                            @endphp
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <!-- right section code -->
                                    <!-- first section code -->
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- main first row Section -->
                    <!-- main second row Section -->
                    <tr>
                        <td align="center" valign="top" width="600px" style="padding-top:2px;">
                            <table cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" valign="top" width="600px" style="border:1px solid #000;">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <!-- first section code -->
                                                <!-- left section code -->
                                                <td align="left" valign="top" width="500px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="left" valign="top" style="font-size: 12px;line-height: 16px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left:2px;">
                                                                <font style="font-size:16px;line-height:20px;"><b>Air Freight Manifest</b></font>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- left section code -->
                                                <!-- right section code -->
                                                <td align="right" valign="top" width="140px" style="border-left:1px solid #000;">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="right" valign="top" style="font-size: 12px;line-height: 16px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                <font style="font-size:16px;line-height:20px;"><b>Page 1 of 1</b></font>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- right section code -->
                                                <!-- first section code -->
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- main second row Section -->
                    <!-- main third row Section -->
                    <tr>
                        <td align="center" valign="top" width="600px">
                            <table cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" valign="top" width="600px" style="padding:3px 0px;">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <!-- first section code -->
                                                <!-- left section code -->
                                                <td align="left" valign="top" width="500px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="left" valign="top" style="font-size: 12px;line-height: 16px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                <b>CONSOL DETAILS </b>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- left section code -->
                                                <!-- right section code -->
                                                <td align="right" valign="top">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="right" valign="top" style="font-size: 12px;line-height: 16px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                <b>PRINTED BY : {{ $agentInfo->agent_issue_sign ?? ''}}</b>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- right section code -->
                                                <!-- first section code -->
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- main third row Section -->
                    <!-- main forth row Section -->
                    <tr>
                        <td align="center" valign="top" width="600px" style="border-top:1px solid #000;">
                            <table cellpadding="0" cellspacing="0" width="100%">
                                <!-- Forth first row code -->
                                <tr>
                                    <td align="center" valign="top" width="600px">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <!-- first section code -->
                                                <!-- left section code -->
                                                <td align="right" valign="top" width="300px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="right" valign="top">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;border-bottom:1px solid #000;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-right:1px solid #000;padding: 0px 0px 5px 2px;">
                                                                                        <b>EXPORT AGENT</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" height="110px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-right:1px solid #000;padding: 0px 0px 0px 2px;">
                                                                                        {{ $wayBillAddress->ship_name ?? ''}}<br />
                                                                                        {{ $wayBillAddress->ship_address ?? ''}}<br />
                                                                                        {{ $wayBillAddress->ship_address_line_2 ?? ''}}<br />
                                                                                        {{ $wayBillAddress->ship_city ?? ''}} - {{ $wayBillAddress->ship_post_code ?? ''}},<br />
                                                                                        {{ $wayBillAddress->ship_state ?? ''}}, {{ $wayBillAddress->ship_country ?? ''}}
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- left section code -->
                                                <!-- middle section code -->
                                                <td align="right" valign="top" width="300px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="right" valign="top">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-right:1px solid #000;padding: 0px 0px 5px 2px;">
                                                                                        <b>IMPORT AGENT</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" height="110px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-right:1px solid #000;padding: 0px 0px 0px 2px;">
                                                                                        {{ $wayBillAddress->cons_name ?? ''}}<br />
                                                                                        {{ $wayBillAddress->cons_address ?? ''}}<br />
                                                                                        {{ $wayBillAddress->cons_address_line_2 ?? ''}}<br />
                                                                                        {{ $wayBillAddress->cons_city ?? ''}} - {{ $wayBillAddress->cons_post_code ?? ''}},<br />
                                                                                        {{ $wayBillAddress->cons_state ?? ''}}, {{ $wayBillAddress->cons_country ?? ''}}
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr> 
                                        </table>
                                    </td>
                                </tr>
                                <!-- Forth first row code -->
                                <!-- Forth Second row code -->
                                <tr>
                                    <td align="center" valign="top" width="600px" style="padding-top:2px;">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <!-- first section code -->
                                                <!-- left section code -->
                                                <td align="right" valign="top" width="220px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="right" valign="top">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-top:1px solid #000;border-right:1px solid #000;padding: 0px 0px 5px 2px;">
                                                                                        <b>TOTAL WEIGHT</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;padding: 0px 0px 0px 2px;">
                                                                                        {{ $wayBillConsignmentData->gross_weight ?? ''}}
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-top:1px solid #000;border-right:1px solid #000;padding: 0px 0px 5px 2px;">
                                                                                        <b>TOTAL VOLUME</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;padding: 0px 0px 0px 2px;">
                                                                                        {{ $airWayBill->total_volume ?? ''}} {{ $airWayBill->dimention_unit ?? ''}}
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-top:1px solid #000;border-right:1px solid #000;padding: 0px 0px 5px 2px;">
                                                                                        <b>CHARGEABLE</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;padding: 0px 0px 0px 2px;">
                                                                                        {{ $wayBillConsignmentData->chargable_weight ?? ''}} {{ $wayBillConsignmentData->weight_code ?? ''}}  
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- left section code -->
                                                <!-- middle section code -->
                                                <td align="right" valign="top" width="190px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="right" valign="top">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-top:1px solid #000;border-right:1px solid #000;padding: 0px 0px 5px 2px;">
                                                                                        <b>CARRIER</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;padding: 0px 0px 0px 2px;">
                                                                                        @php
                                                                                            if ($airWayBill->by != null) {
                                                                                                echo  $airWayBill->by.", ";
                                                                                            }
                                                                                            if ($airWayBill->by_2 != null) {
                                                                                                echo  $airWayBill->by_2.", ";
                                                                                            }
                                                                                            if ($airWayBill->by_3 != null) {
                                                                                                echo  $airWayBill->by_3;
                                                                                            }
                                                                                        @endphp
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- middle section code -->
                                                <!-- right section code -->
                                                <td align="right" valign="top" width="190px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="left" valign="top" style="font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 9px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-top:1px solid #000;border-right:1px solid #000;padding: 0px 0px 5px 2px;">
                                                                            <b>CUSTOMS ENTRY No.</b>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 9px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;padding: 0px 0px 0px 2px;">
                                                                            &nbsp;
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <td align="left" valign="top" style="font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 9px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-top:1px solid #000;border-right:1px solid #000;padding: 0px 0px 5px 2px;">
                                                                            <b>DECL VALUE (CUSTOMS)</b>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 9px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;padding: 0px 0px 0px 2px;">
                                                                           {{ $paymentInfo->declear_value_carriage ?? ''}}
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- right section code -->
                                                <!-- first section code -->
                                            </tr> 
                                        </table>
                                    </td>
                                </tr>
                                <!-- Forth Second row code -->
                                <!-- Forth Third row code -->
                                <tr>
                                    <td align="center" valign="top" width="600px" style="padding-top:2px;">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <!-- first section code -->
                                                <!-- left section code -->
                                                <td align="right" valign="top" width="220px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="right" valign="top">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-top:1px solid #000;border-right:1px solid #000;padding: 0px 0px 5px 2px;">
                                                                                        <b>PACKAGES</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;padding: 0px 0px 0px 2px;">
                                                                                        @php
                                                                                         if (isset($wayBillConsignmentData->pieces_info)) {
                                                                                            $decodedInfo = json_decode($wayBillConsignmentData->pieces_info, true);
                                                                                            echo $decodedInfo[0]['pcs'].' NOS';
                                                                                         }
                                                                                        @endphp
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="center" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-top:1px solid #000;border-right:1px solid #000;padding: 0px 0px 5px 2px;">
                                                                                        <b>MASTER FREIGHT</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;padding: 0px 0px 0px 2px;">
                                                                                        @php
                                                                                            $prepaidTaxType = $paymentInfo->type_of_payment ?? '';
                                                                                            if ($prepaidTaxType == "PP") {
                                                                                                echo "Prepaid";
                                                                                            }
                                                                                            else {
                                                                                                echo "Collect";
                                                                                            }
                                                                                        @endphp
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- left section code -->
                                                <!-- middle section code -->
                                                <td align="right" valign="top" width="190px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="right" valign="top">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-top:1px solid #000;padding: 0px 0px 5px 2px;">
                                                                                        <b>ORIGIN</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-left:1px solid #000;padding: 0px 0px 0px 2px;">
                                                                                        {{ $airWayBill->departure_airport ?? '' }}
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="right" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-top:1px solid #000;border-right:1px solid #000;padding: 0px 2px 5px 2px;">
                                                                                        <b>ETD</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="right" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-right:1px solid #000;padding: 0px 2px 0px 2px;">
                                                                                        {{ $airWayBill->date ?? '' }}
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- middle section code -->
                                                <!-- right section code -->
                                                <td align="right" valign="top" width="190px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-top:1px solid #000;padding: 0px 0px 5px 2px;">
                                                                            <b>DESTINATION</b>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-left:1px solid #000;padding: 0px 0px 0px 2px;">
                                                                            {{ $airWayBill->destination_airport ?? '' }}
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="right" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-top:1px solid #000;border-right:1px solid #000;padding: 0px 2px 5px 2px;">
                                                                            <b>ETA</b>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="right" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-right:1px solid #000;padding: 0px 2px 0px 2px;">
                                                                            {{ $airWayBill->date_3 ?? '' }}
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- right section code -->
                                                <!-- first section code -->
                                            </tr> 
                                        </table>
                                    </td>
                                </tr>
                                <!-- Forth Third row code -->
                                <!-- Forth forth row code -->
                                <tr>
                                    <td align="center" valign="top" width="600px" style="padding-top:2px;">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <!-- first section code -->
                                                <!-- left section code -->
                                                <td align="right" valign="top" width="220px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="right" valign="top">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-top:1px solid #000;border-right:1px solid #000;padding: 0px 0px 5px 2px;">
                                                                                        <b>CARRIER BOOKING REFERENCE</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;padding: 0px 0px 0px 2px;">
                                                                                        &nbsp;
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- left section code -->
                                                <!-- middle section code -->
                                                <td align="right" valign="top" width="190px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="right" valign="top">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-right:1px solid #000;border-top:1px solid #000;padding: 0px 0px 5px 2px;">
                                                                                        <b>AGENT'S REFERENCE</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;padding: 0px 0px 0px 2px;">
                                                                                        &nbsp;
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- middle section code -->
                                                <!-- right section code -->
                                                <td align="right" valign="top" width="190px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="right" valign="top">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;border-right:1px solid #000;border-top:1px solid #000;padding: 0px 0px 5px 2px;">
                                                                                        <b>LAST FOREIGN PORT</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;padding: 0px 0px 0px 2px;">
                                                                                        &nbsp;
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- right section code -->
                                                <!-- first section code -->
                                            </tr> 
                                        </table>
                                    </td>
                                </tr>
                                <!-- Forth fourth row code -->
                                <!-- Forth fifth row Section -->
                                <tr>
                                    <td align="center" valign="top" width="600px">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td align="center" valign="top" width="600px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="right" valign="top" width="600px">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="right" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;;">
                                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                                            <tr>
                                                                                                <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-right:1px solid #000;border-left:1px solid #000;padding:5px 0px 5px 2px;">
                                                                                                    <b>ROUTING INFORMATION</b>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr> 
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- forth fifth row Section -->
                                <!-- Forth sixth row Section -->
                                <tr>
                                    <td align="center" valign="top" width="600px">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td align="center" valign="top" width="600px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="right" valign="top" width="600px">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="right" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;">
                                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                                            <tr>
                                                                                                <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-left:1px solid #000;padding-left: 2px;">
                                                                                                    <b>Mode</b>
                                                                                                </td>
                                                                                                <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;padding-left: 2px;">
                                                                                                    <b>Flight</b>
                                                                                                </td>
                                                                                                <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;padding-left: 2px;">
                                                                                                    <b>Carrier</b>
                                                                                                </td>
                                                                                                <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;padding-left: 2px;">
                                                                                                    <b>Load</b>
                                                                                                </td>
                                                                                                <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;padding-left: 2px;">
                                                                                                    <b>Disch</b>
                                                                                                </td>
                                                                                                <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;padding-left: 2px;">
                                                                                                    <b>ETD</b>
                                                                                                </td>
                                                                                                <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;border-right:1px solid #000;padding-left: 2px;">
                                                                                                    <b>ETA</b>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <?php
                                                                                                if ($airWayBill->flight != null) 
                                                                                                { 
                                                                                                    ?>
                                                                                                    <tr>
                                                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;padding-left: 2px;">
                                                                                                            <b>Air</b>
                                                                                                        </td>
                                                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;">
                                                                                                            <b>{{ $airWayBill->flight }}</b>
                                                                                                        </td>
                                                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;">
                                                                                                            <b>{{ $airWayBill->by }}</b>
                                                                                                        </td>
                                                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;">
                                                                                                            <b>INBLR</b>
                                                                                                        </td>
                                                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;">
                                                                                                            <b>LKCMB</b>
                                                                                                        </td>
                                                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;">
                                                                                                            <b>31-Oct-2024</b>
                                                                                                        </td>
                                                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;border-right:1px solid #000;">
                                                                                                            <b>31-Oct-2024</b>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    
                                                                                                    <?php
                                                                                                }
                                                                                            ?>
                                                                                            <?php
                                                                                            if ($airWayBill->flight_2 != null) 
                                                                                            { 
                                                                                                ?>
                                                                                                <tr>
                                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;padding-left: 2px;">
                                                                                                        <b>Air</b>
                                                                                                    </td>
                                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;">
                                                                                                        <b>{{ $airWayBill->flight_2 }}</b>
                                                                                                    </td>
                                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;">
                                                                                                        <b>{{ $airWayBill->by_2 }}</b>
                                                                                                    </td>
                                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;">
                                                                                                        <b>INBLR</b>
                                                                                                    </td>
                                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;">
                                                                                                        <b>LKCMB</b>
                                                                                                    </td>
                                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;">
                                                                                                        <b>31-Oct-2024</b>
                                                                                                    </td>
                                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;border-right:1px solid #000;">
                                                                                                        <b>31-Oct-2024</b>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                
                                                                                                <?php
                                                                                            }
                                                                                            ?>

                                                                                            <?php
                                                                                            if ($airWayBill->flight_3 != null) 
                                                                                            { 
                                                                                                ?>
                                                                                                <tr>
                                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-left:1px solid #000;padding-left: 2px;">
                                                                                                        <b>Air</b>
                                                                                                    </td>
                                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;">
                                                                                                        <b>{{ $airWayBill->flight_3 }}</b>
                                                                                                    </td>
                                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;">
                                                                                                        <b>{{ $airWayBill->by_3 }}</b>
                                                                                                    </td>
                                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;">
                                                                                                        <b>INBLR</b>
                                                                                                    </td>
                                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;">
                                                                                                        <b>LKCMB</b>
                                                                                                    </td>
                                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;">
                                                                                                        <b>31-Oct-2024</b>
                                                                                                    </td>
                                                                                                    <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 2px;border-right:1px solid #000;">
                                                                                                        <b>31-Oct-2024</b>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                
                                                                                                <?php
                                                                                            }

                                                                                            ?>
                                                                                            
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr> 
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- forth sixth row Section -->
                            </table>
                        </td>
                    </tr>
                    <!-- main forth row Section -->
                    <!-- main fifth row Section -->
                    <tr>
                        <td align="center" valign="top" width="600px">
                            <table cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" valign="top">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td align="right" valign="top">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="left" valign="top" style="font-size: 12px;line-height: 16px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;">
                                                                &nbsp;
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="right" valign="top">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 12px;line-height: 16px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;padding-left: 2px;">
                                                                                        <b>SHIPMENT DETAILS</b>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr> 
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- main fifth row Section -->
                    <!-- main sixth row Section -->
                    <tr>
                        <td align="center" valign="top" width="600px">
                            <table cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" valign="top">
                                        <table cellpadding="0" cellspacing="0" width="100%">

                                            <tr>
                                                <td align="center" valign="top">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="center" valign="top" width="200px" style="font-size: 10px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;">
                                                                HOUSE
                                                            </td>
                                                            <td align="left" valign="top" style="font-size: 10px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;">
                                                                SHIPPER
                                                            </td>
                                                            <td align="left" valign="top" style="font-size: 10px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;">
                                                                CONSIGNEE
                                                            </td>
                                                            <td align="left" valign="top" style="font-size: 10px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;">
                                                                NATURE OF GOODS
                                                            </td>
                                                            <td align="left" valign="top" width="135px" style="font-size: 10px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;border-bottom:1px solid #000;">
                                                                HANDLING INSTRUCTIONS
                                                            </td>
                                                        </tr>
                                                        @foreach ($houseWayBills as $houseWayBill)
                                                            <tr>
                                                                <td align="left" valign="top" width="200px" style="font-size: 10px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;border-bottom:1px solid #000;padding-left: 2px;padding: 0px 2px 10px;">
                                                                    <b>HAWB&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b>&nbsp;{{ $houseWayBill->id }}<br />
                                                                    {{-- <b>Job Ref&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b>&nbsp;HRS/AE/0538/24-25<br /> --}}
                                                                    @php
                                                                    if (isset($wayBillConsignmentData->pieces_info)) {
                                                                        $decodedInfo = json_decode($wayBillConsignmentData->pieces_info, true);
                                                                    }
                                                                    @endphp
                                                                    <b>Wgt / Vol / Pkg&nbsp;:</b>&nbsp;{{ $decodedInfo[0]['wgt'] }} / {{ $houseWayBill->total_volume }} / {{ $decodedInfo[0]['pcs'].' NOS' }}<br />
                                                                    {{-- <b>INCO Terms&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b>&nbsp;EX WORKS<br /> --}}
                                                                    <b>Origin&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b>&nbsp;{{ $airWayBill->departure_airport ?? ''}}<br />
                                                                    <b>Destination&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b>&nbsp;{{ $airWayBill->destination_airport ?? ''}}<br />
                                                                    {{-- <b>Shippers Ref&nbsp;&nbsp;&nbsp;:</b>&nbsp;<br /> --}}
                                                                    <b>Master&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b>&nbsp;{{ $houseWayBill->awb_code ?? ''.' - '.$houseWayBill->awb_no ?? '' }}
                                                                </td>
                                                                <td align="left" valign="top" style="font-size: 10px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;border-bottom:1px solid #000;padding-left: 2px;padding: 0px 2px 10px;">
                                                                    {{ $wayBillAddress->ship_name ?? '' }}<br />
                                                                    {{ $wayBillAddress->ship_address ?? '' }}<br />
                                                                    {{ $wayBillAddress->ship_address_line_2 ?? '' }}<br />
                                                                    {{ $wayBillAddress->ship_city ?? '' }} - {{ $wayBillAddress->ship_post_code ?? '' }},<br />
                                                                    {{ $wayBillAddress->ship_state ?? '' }}, {{ $wayBillAddress->ship_country ?? '' }}
                                                                </td>
                                                                <td align="left" valign="top" style="font-size: 10px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;border-bottom:1px solid #000;padding-left: 2px;padding: 0px 2px 10px;">
                                                                    {{ $wayBillAddress->cons_name ?? '' }}<br />
                                                                    {{ $wayBillAddress->cons_address ?? '' }}<br />
                                                                    {{ $wayBillAddress->cons_address_line_2 ?? '' }}<br />
                                                                    {{ $wayBillAddress->cons_city ?? '' }} - {{ $wayBillAddress->cons_post_code ?? '' }},<br />
                                                                    {{ $wayBillAddress->cons_state ?? '' }}, {{ $wayBillAddress->cons_country ?? '' }}
                                                                </td>
                                                                <td align="left" valign="top" style="font-size: 10px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;border-bottom:1px solid #000;padding-left: 2px;padding: 0px 2px 10px;">
                                                                    <b>Goods Description&nbsp;:</b>
                                                                    {{ $wayBillConsignmentData->description ?? '' }}
                                                                    HS CODE: 
                                                                    <br>
                                                                    @php
                                                                    if (isset($wayBillConsignmentData->hs_code)) {
                                                                        $decodedInfo = json_decode($wayBillConsignmentData->hs_code, true);
                                                                        foreach ($decodedInfo as $key => $value) 
                                                                        {
                                                                            echo $decodedInfo[$key].'<br/>' ;

                                                                        }
                                                                    }
                                                                    @endphp
                                                                </td>
                                                                <td align="left" valign="top" width="135px" style="font-size: 10px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;border-bottom:1px solid #000;padding: 0px 2px 10px;">
                                                                    {{ $houseWayBill->other_service_information ?? '' }}
                                                                </td>
                                                            </tr>
                                                        @endforeach
                                                    </table>
                                                </td>
                                            </tr> 
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- main sixth row Section -->
                    <!-- last row Section -->
                    <tr>
                        <td align="center" valign="top" width="600px" style="font-size: 10px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;padding: 20px 0px 0px;">
                            END OF DOCUMENT
                        </td>
                    </tr>
                    <!-- last row Section -->
                </table>
            </td>
        </tr>
    </table>
</body>
</html>