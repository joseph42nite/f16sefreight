<!doctype html>
<html lang="en">
<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        .routing-and-destination {
        border-bottom: 1px solid #000;
        position: relative;
        }
        .routing-and-destination::before,
        .routing-and-destination::after {
            content: "";
            position: absolute;
            height: 9px;
            border: 1px solid #000;
            top: 0px;
        }
        .routing-and-destination::before {
            left: -3px;
            border-left: none;
            transform: skew(33deg);
        }
        .routing-and-destination::after {
            right: -3px;
            border-right: none;
            transform: skew(-33deg);
        }
        


        .optional-Shipping-information {
        border-bottom: 1px solid #000;
        position: relative;
        }
        .optional-Shipping-information::before,
        .optional-Shipping-information::after {
            content: "";
            position: absolute;
            height: 11px;
            border: 1px solid #000;
            top: 0px;
        }
        .optional-Shipping-information::before {
            left: -6px;
            border-left: none;
            transform: skew(40deg);
        }
        .optional-Shipping-information::after {
            right: -6px;
            border-right: none;
            transform: skew(-40deg);
        }
    </style>
</head>
<body style="word-spacing:normal;margin: 0 auto;">
    <table align="center" cellpadding="0" cellspacing="0" align="center" width="600px">
        <tr>
            <td align="center" valign="top">
                <table cellpadding="0" cellspacing="0" width="100%">
                    <!-- UDR Section -->
                    <tr>
                        <td align="center" valign="top" width="600px" style="padding-bottom:5px;">
                            <table cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <!-- first section code -->
                                    <td align="left" valign="top" width="300px">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td align="left" valign="top" style="font-size: 14px;line-height: 21px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left:10px;">
                                                    @php
                                                    $departure_airport =  explode(',', $airWayBill->departure_airport);
                                                    $departure_airport = $departure_airport[0] ?? '';
                                                    @endphp
                                                    {{$airWayBill->awb_code .' '. $departure_airport .' '. $airWayBill->awb_no ?? ''}}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <!-- first section code -->
                                    <!-- second section code -->
                                    <td align="center" valign="top" width="300px">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td align="center" valign="top" width="60px" style="font-size: 14px;line-height: 21px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                    &nbsp;
                                                    </td>
                                                <td align="center" valign="top" width="140px" style="font-size: 14px;line-height: 21px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                    {{$airWayBill->awb_code . ' - '. $airWayBill->awb_no ?? ''}}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <!-- second section code -->
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- UDR Section -->
                    <!-- Main Border Section Code -->
                    <tr>
                        <td align="center" valign="top">
                            <table cellpadding="0" cellspacing="0" width="600px">
                                <!-- Shipper's Name and Address Code -->
                                <tr>
                                    <td align="center" valign="top" style="border:1px solid #000000;">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <!-- first column section -->
                                                <td align="center" valign="top" width="300px" style="border-right: 1px solid #000000;">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="left" valign="top" width="280px" style="padding-left: 5px;">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <!-- first column code-->
                                                                        <td align="left" valign="top" width="140px">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                        Shipper's Name and Address
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 11px;line-height: 14px;font-family:Times , Arial,sans-serif;color: #000000;font-weight: 700;padding: 10px 10px 10px 5px;">
                                                                                        {{ $airWayBill->wayBillAddress->ship_name ?? ''}} <br/>
                                                                                        {{ $airWayBill->wayBillAddress->ship_address ?? ''}}
                                                                                        {{ $airWayBill->wayBillAddress->ship_city ?? ''}}
                                                                                        {{ $airWayBill->wayBillAddress->ship_post_code ?? ''}}
                                                                                        {{ $airWayBill->wayBillAddress->ship_state ?? ''}}
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <!-- first column code -->
                                                                        <!-- second column code-->
                                                                        <td align="center" valign="top" width="140px">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="center" valign="top" style="border-left:1px solid #000000;border-bottom:1px solid #000000; padding: 0px 0px 20px 0px;">
                                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    Shipper's Account Number
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td align="center" valign="bottom" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                    {{ $airWayBill->wayBillAddress->ship_account ?? ''}}
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <!-- second column code -->
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                 </td>
                                                <!-- first column section -->
                                                <!-- second column section -->
                                                <td align="center" valign="top" width="300px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="left" valign="top" width="280px">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <!-- first column code-->
                                                                        <td align="left" valign="top" width="60px" style="padding-left: 5px;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                        Not Negotiable
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-top: 12px;">
                                                                                        Issued by
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <!-- first column code -->
                                                                        <!-- second column code-->
                                                                        <td align="left" valign="top" width="220px">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="center" valign="top" style="font-size: 14px;line-height: 21px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;margin: 0;">
                                                                                        Air Waybill
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 12px;line-height: 16px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                        Air France<br arai-hidden="true"> 45 Rue de Paris<br arai-hidden="true"> 957 47 Charles de Gaulle <br arai-hidden="true">France
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <!-- second column code -->
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- second column section -->
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Shipper's Name and Address Code -->
                                <!-- Consignee Section Code -->
                                <tr>
                                    <td align="center" valign="top" style="border:1px solid #000000;">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <!-- first column section -->
                                                <td align="center" valign="top" width="300px" style="border-right: 1px solid #000000;">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <!-- first column code-->
                                                            <td align="left" valign="top" width="150px">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left:5px;">
                                                                            Consignee's Name and Address
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 11px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding: 10px;">
                                                                            {{ $airWayBill->wayBillAddress->cons_name ?? ''}}<br/>
                                                                            {{ $airWayBill->wayBillAddress->cons_address ?? ''}}
                                                                            {{ $airWayBill->wayBillAddress->cons_city ?? ''}}
                                                                            {{ $airWayBill->wayBillAddress->cons_post_code ?? ''}}
                                                                            {{ $airWayBill->wayBillAddress->cons_state ?? ''}}
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <!-- first column code -->
                                                            <!-- second column code-->
                                                            <td align="center" valign="top" width="150px">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="center" valign="top" bgcolor="bee3fe" style="border-left:1px solid #000000;border-bottom:1px solid #000000; padding: 0px 0px 20px 0px;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                        Consignee's Account Number
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                       {{ $airWayBill->wayBillAddress->cons_account ?? ''}}
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <!-- second column code -->
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- first column section -->
                                                <!-- second column section -->
                                                <td align="center" valign="top" width="300px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="center" valign="top" >
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 8px;line-height: 10px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding: 0px 5px 10px;">
                                                                            It is agreed that the goods described herein are accepted in apparent good order and condition (except as noted) for carriage SUBJECT TO THE CONDITIONS OF CONTRACT ON THE REVERSE HEREOF. ALL GOODS MAY BE CARRIED BY ANY OTHER MEANS INCLUDING ROAD OR ANY OTHER CARRIER UNLESS SPECIFIC CONTRARY INSTRUCTIONS ARE GIVEN HEREON BY THE SHIPPER, AND SHIPPER AGREES THAT THE SHIPMENT MAY BE CARRIED VIA INTERMEDIATE STOPPING PLACES WHICH THE CARRIER DEEMS APPROPRIATE. THE SHIPPER'S ATTENTION IS DRAWN TO THE NOTICE CONCERNING CARRIER'S LIMITATION OF LIABILITY. Shipper may increase such limitation of liability by declaring a higher value for carriage and paying a supplemental charge if required.
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- second column section -->
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Consignee Section Code -->
                                <!-- Issuing Carrier's Agent Name and City Section Code -->
                                <tr>
                                    <td align="center" valign="top" style="border:1px solid #000000;">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <!-- first column section -->
                                                <td align="center" valign="top" width="300px" style="border-right: 1px solid #000000;text-align:center;">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <!-- Top column code-->
                                                            <td align="left" valign="top" style="border-bottom: 1px solid #000000;">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left: 5px">
                                                                            Issuing Carrier's Agent Name and City
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left" valign="top" style="font-size: 11px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding: 0px 10px 20px;">
                                                                            {{ $airWayBill->agentsInfo->agent_name ?? '' }}
                                                                            <br>
                                                                            {{ $airWayBill->agentsInfo->agent_address ?? ''}}
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <!-- Top column code -->
                                                        </tr>
                                                        <tr>
                                                            <!-- first column code-->
                                                            <td align="left" valign="top">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <!-- first column code-->
                                                                        <td align="left" valign="top" width="150px" style="border-right: 1px solid #000000;">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left: 5px;padding-bottom: 20px;">
                                                                                        Agent's IATA Code
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" width="150px">
                                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                                            <tr>
                                                                                                <!-- first column code -->
                                                                                                <td align="center" valign="top" width="75px">
                                                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" style="font-size: 11px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left:5px;">
                                                                                                                {{ $airWayBill->agentsInfo->iata_agent_code ?? ''}}  
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                                <!-- first column code -->
                                                                                                <!-- second column code -->
                                                                                                <td align="center" valign="top" width="75px">
                                                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" style="font-size: 11px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                            {{ $airWayBill->agentsInfo->iata_agent_cass ?? ''}}   
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                                <!-- second column code -->
                                                                                            </tr>
                                                                                        </table>        
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <!-- first column code -->
                                                                        <!-- second column code-->
                                                                        <td align="center" valign="top" width="150px">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left:5px;">
                                                                                        Agent's Account no.
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <!-- first column code -->
                                                                                    <td align="center" valign="bottom">
                                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                                            <tr>
                                                                                                <td align="center" valign="bottom" style="font-size: 11px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-top:19px;">
                                                                                                    {{ $airWayBill->agentsInfo->agent_account ?? ''}}  
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- first column code -->
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <!-- second column code -->
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <!-- first column code -->
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- first column section -->
                                                <!-- second column section -->
                                                <td align="center" valign="top" width="300px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="left" valign="top" width="280px">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 8px;line-height: 10px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left: 5px;padding-right: 5px;">
                                                                                        Accounting Information
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
                                                <!-- second column section -->
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Issuing Carrier's Agent Name and City Section Code -->
                                <!-- Airport of Departure (Addr. of First Carrier and Requested Routing) Section Code -->
                                <tr>
                                    <td align="center" valign="top" style="border:1px solid #000000;">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <!-- first column section -->
                                                <td align="center" valign="top" width="300px" style="border-right:1px solid #000;">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="left" valign="top" width="292px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left:5px;">
                                                                Airport of Departure (Addr. of First Carrier and Requested Routing)
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="left" valign="top" width="292px" style="font-size: 11px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 10px;padding-top:10px;">
                                                                @php
                                                                // $departureAirport = explode(',', $airWayBill->departure_airport);
                                                                // $departureAirport = $departureAirport[0] . ' - ' . $departureAirport[2];  
                                                                @endphp
                                                                {{-- {{ $departureAirport }} --}}
                                                                {{ $airWayBill->departure_airport ?? ''}}
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- first column section -->
                                                <!-- second column section -->
                                                <td align="center" valign="top" width="300px">
                                                    <table cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td align="left" valign="top" width="300px">
                                                                <table cellpadding="0" cellspacing="0">
                                                                    <tr> 
                                                                        <td align="left" valign="top" width="125px">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left:5px;">
                                                                                        Reference Number
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <td align="center" valign="top" width="175px">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="center" valign="top" width="140px" class="optional-Shipping-information" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                        Optional Shipping Information
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="left" valign="top" width="300px">
                                                                <table cellpadding="0" cellspacing="0">
                                                                    <tr> 
                                                                        <td align="left" valign="top" width="148px" height="23px">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                        &nbsp;
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <td align="left" valign="top" width="88px" style="border-left:1px solid #000;border-right:1px solid #000;">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                        &nbsp;
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <td align="center" valign="top" width="64px">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
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
                                                <!-- second column section -->
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Airport of Departure (Addr. of First Carrier and Requested Routing) Section Code -->
                                <!--Routing and Destination Section Code -->
                                <tr>
                                    <td align="center" valign="top" style="border:1px solid #000000;">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                
                                                <tr>
                                                    <!-- first section -->
                                                    <td align="center" valign="top"  width="300px" style="border-right:1px solid #000000;">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tr>
                                                                <!-- first column code -->
                                                                <td align="center" valign="top" width="35px" style="border-right: 1px solid #000000;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tr>
                                                                            <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left:5px;">
                                                                                to
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center" valign="bottom" style="vertical-align:bottom;font-size: 9px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 5px;padding-top:13px;">
                                                                                @php
                                                                                    $to1 = explode(',', $airWayBill->to);
                                                                                    $to1 = $to1[0];
                                                                                @endphp
                                                                                {{ $to1 ?? ''}}
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <!-- first column code -->
                                                                <!-- second column code -->
                                                                <td align="left" valign="top" width="66px">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tr>
                                                                            <td align="left" valign="top" style="font-size: 7px;line-height: 10px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left:5px;">
                                                                                By First Carrier
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="left" valign="bottom" style="vertical-align:bottom;font-size: 9px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left:5px;padding-top:13px;">
                                                                                {{ $airWayBill->by ?? ''}}
                                                                            </td>
                                                                    </tr>
                                                                    </table>
                                                                </td>
                                                                <!-- second column code -->
                                                                <!-- third column code -->
                                                                <td align="center" valign="top" width="80px" style="border-right: 1px solid #000000;padding-right:6px;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tr>
                                                                            <td align="center" valign="top" class="routing-and-destination" style="font-size: 7px;line-height: 10px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left: 2px;padding-right: 2px;">
                                                                                Routing and Destination
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <!-- third column code -->
                                                                <!-- fourth column code -->
                                                                <td align="center" valign="top" width="30px" style="border-right: 1px solid #000000;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tr>
                                                                            <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left: 5px;">
                                                                                to
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center" valign="bottom" style="vertical-align:bottom;font-size: 9px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-top:13px;">
                                                                                @php
                                                                                    $to2 = explode(',', $airWayBill->to_2);
                                                                                    $to2 = $to2[0];
                                                                                @endphp
                                                                                {{ $to2 ?? ''}}
                                                                            </td>
                                                                            </tr>
                                                                    </table>
                                                                </td>
                                                                <!-- fourth column code -->
                                                                <!-- fifth column code -->
                                                                <td align="center" valign="top" width="30px" style="border-right: 1px solid #000000;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tr>
                                                                            <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left: 5px;">
                                                                                by
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center" valign="bottom" style="vertical-align:bottom;font-size: 9px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-top:13px;">
                                                                                {{ $airWayBill->by_2 ?? ''}}
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <!-- fifth column code -->
                                                                <!-- sixth column code -->
                                                                <td align="center" valign="top" width="30px" style="border-right: 1px solid #000000;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tr>
                                                                            <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left: 5px;">
                                                                                to
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center" valign="bottom" style="vertical-align:bottom;font-size: 9px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-top:13px;">
                                                                                @php
                                                                                    $to3 = explode(',', $airWayBill->to_3);
                                                                                    $to3 = $to3[0];
                                                                                @endphp
                                                                                {{ $to3 ?? ''}}
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <!-- sixth column code -->
                                                                <!-- seven column code -->
                                                                <td align="center" valign="top" width="30px">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tr>
                                                                            <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left: 5px;">
                                                                                by
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center" valign="bottom" style="vertical-align:bottom;font-size: 9px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-top:13px;">
                                                                                {{ $airWayBill->by_3 ?? ''}}
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <!-- seven column code -->
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <!-- first section -->
                                                    <!-- second section -->
                                                    <td align="center" valign="top" width="300px">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tr>
                                                                <!-- first column code -->
                                                                <td align="center" valign="top" width="30px" style="border-right: 1px solid #000000;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tr>
                                                                            <td align="center" valign="top" style="font-size: 7px;line-height: 10px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-bottom: 0px;">
                                                                                Currency
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center" valign="bottom" style="vertical-align:bottom;font-size: 9px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-top:15px;">
                                                                                {{ $airWayBill->paymentInfo->currency ?? ''}} 
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <!-- first column code -->
                                                                <!-- second column code -->
                                                                <td align="center" valign="top" width="25px" bgcolor="bee3fe" style="border-right: 1px solid #000000;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tr>
                                                                            <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-bottom: 0px;">
                                                                                CHGS
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center" valign="bottom" style="vertical-align:bottom;font-size: 9px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-top:13px;">
                                                                                {{ $airWayBill->paymentInfo->type_of_payment ?? ''}}
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <!-- second column code -->
                                                                <!-- third column code -->
                                                                <td align="center" valign="top" width="40px" style="border-right: 1px solid #000000;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tr>
                                                                            <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left: 5px;padding-bottom: 0px;border-bottom: 1px solid #000000;">
                                                                                WT/VAL
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center" valign="top">
                                                                                <table cellpadding="0" cellspacing="0">
                                                                                    <tr>
                                                                                        <td align="center" valign="top" width="20px" style="border-right: 1px solid #000000;">
                                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                <tr>
                                                                                                    <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-bottom: 0px;">
                                                                                                        PPD
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td align="center" valign="bottom" style="vertical-align:bottom;font-size: 9px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                        @php
                                                                                                            if (!empty($airWayBill->paymentInfo->weight_charge) && $airWayBill->paymentInfo->type_of_payment == 'PP') {
                                                                                                                echo "X";
                                                                                                            }
                                                                                                        @endphp
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                        <td align="center" valign="top" width="20px">
                                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                <tr>
                                                                                                    <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-bottom: 0px;">
                                                                                                        COLL
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td align="center" valign="bottom" height="12px" style="vertical-align:bottom;font-size: 9px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                        @php
                                                                                                        if (!empty($airWayBill->paymentInfo->weight_charge) && $airWayBill->paymentInfo->type_of_payment == 'CC') {
                                                                                                            echo "X";
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
                                                                <!-- third column code -->
                                                                <!-- fourth column code -->
                                                                <td align="center" valign="top" width="40px" style="border-right: 1px solid #000000;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tr>
                                                                            <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left: 5px;padding-bottom: 0px;border-bottom: 1px solid #000000;">
                                                                                Other
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center" valign="top">
                                                                                <table cellpadding="0" cellspacing="0">
                                                                                    <tr>
                                                                                        <td align="center" valign="top" width="20px" style="border-right: 1px solid #000000;">
                                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                <tr>
                                                                                                    <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-bottom: 0px;">
                                                                                                        PPD
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td align="center" valign="bottom" style="vertical-align:bottom;font-size: 9px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                        @php
                                                                                                            if (!empty($airWayBill->paymentInfo->weight_charge) && $airWayBill->paymentInfo->type_of_payment == 'PP') {
                                                                                                                echo "X";
                                                                                                            }
                                                                                                        @endphp
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                        <td align="center" valign="top" width="20px">
                                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                <tr>
                                                                                                    <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-bottom: 0px;">
                                                                                                        COLL
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td align="center" valign="bottom" style="vertical-align:bottom;font-size: 9px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                        @php
                                                                                                            if (!empty($airWayBill->paymentInfo->weight_charge) && $airWayBill->paymentInfo->type_of_payment == 'CC') {
                                                                                                                echo "X";
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
                                                                <!-- fourth column code -->
                                                                <!-- fifth column code -->
                                                                <td align="center" valign="top" width="84px" style="border-right: 1px solid #000000;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tr>
                                                                            <td align="center" valign="top" style="font-size: 7px;line-height: 10px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-bottom: 0px;">
                                                                                Declared Value for Carriage
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center" valign="top" style="font-size: 9px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-top:13px;">
                                                                                {{ $airWayBill->paymentInfo->declear_value_carriage ?? ''}}
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <!-- fifth column code -->
                                                                <!-- sixth column code -->
                                                                <td align="center" valign="top" width="84px">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tr>
                                                                            <td align="center" valign="top" style="font-size: 7px;line-height: 10px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-bottom: 0px;">
                                                                                Declared Value for Customs
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center" valign="top" style="font-size: 9px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-top:13px;">
                                                                                {{ $airWayBill->paymentInfo->declear_value_customs ?? ''}}
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <!-- sixth column code -->
                                                            </tr>
                                                        </table>
                                                    </td>
                                                <!-- second section -->
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!--Routing and Destination Section Code -->

                                <!-- Airport of Destination Section Code -->
                                <tr>
                                    <td align="center" valign="top" style="border:1px solid #000000;">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <!-- first column section -->
                                                <td align="center" valign="top" width="300px" style="border-right: 1px solid #000000;">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="left" valign="top" width="280px">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <!-- first column code-->
                                                                        <td align="center" valign="top" width="120px" style="border:2px solid #000000;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-bottom:5px;">
                                                                                        Airport of Destination
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" valign="bottom" style="font-size: 10px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;vertical-align:bottom;">
                                                                                        {{ $airWayBill->destination_airport ?? ''}}
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <!-- first column code -->
                                                                        <!-- second column code-->
                                                                        <td align="center" valign="top" width="160px">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="center" valign="top" style="padding-left:20px;padding-right:40px;">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="100px" class="optional-Shipping-information" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left: 2px ;padding-right: 2px;">
                                                                                                    Requested Flight/Date 
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" valign="bottom" width="140px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <!-- first column code -->
                                                                                                <td align="center" valign="bottom" width="70px" style="border-right:1px solid #000000;">
                                                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="bottom" width="70px" height="34px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                                {{ $airWayBill->by.''.$airWayBill->flight.' / '.$airWayBill->date ?? ''}}
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>           
                                                                                                </td>
                                                                                                <!-- first column code -->
                                                                                                <!-- second column code -->
                                                                                                <td align="center" valign="bottom" width="70px">
                                                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="bottom" width="70px" height="34px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                                {{ $airWayBill->by.''.$airWayBill->flight.' / '.$airWayBill->date ?? ''}}
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>           
                                                                                                </td>
                                                                                                <!-- second column code -->
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <!-- second column code -->
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- first column section -->
                                                <!-- second column section -->
                                                <td align="center" valign="top" width="300px">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="left" valign="top" width="280px">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <!-- first column code-->
                                                                        <td align="left" valign="top" width="100px" style="padding-left: 5px;border-right:1px solid #000000;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="height:36px;width:100px;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                        Amount of Insurance
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                        {{ $airWayBill->paymentInfo->declear_value_insurance ?? ''}}
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <!-- first column code -->
                                                                        <!-- second column code-->
                                                                        <td align="left" valign="top" width="180px" style="padding-left: 5px;padding-right: 5px;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 8px;line-height: 10px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                        INSURANCE: If Carrier offers insurance, and such insurance is requested in accordance with the conditions thereof, indicate amount to be insured in figures in box marked 'Amount of Insurance'
                                                                                    </td>
                                                                                </tr>
                                                                                
                                                                            </table>
                                                                        </td>
                                                                        <!-- second column code -->
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- second column section -->
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Airport of Destination Section Code -->
                                <!-- Handling Information -->
                                <tr>
                                    <td align="center" valign="top" style="border:1px solid #000000;">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <!-- first column section -->
                                                <td align="center" valign="top" width="430px" style="width:430px;text-align:center;">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="left" valign="top" >
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <!-- first column code-->
                                                                        <td align="left" valign="top" width="140px" style="width:140px;text-align:left;">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left:1px;">
                                                                                        Handling Information
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <!-- first column code -->
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- first column section -->

                                                <!-- second column section -->
                                                <td align="center" valign="top" width="190px;" style="width:190px;text-align:center;">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="left" valign="top" >
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <!-- first column code-->
                                                                        
                                                                        <td align="left" valign="top" width="95px" style="width:95px;text-align:left;">
                                                                            <table cellpadding="0" cellspacing="0" >
                                                                                <tr>
                                                                                    <td align="left" valign="top" >
                                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                                            <tr>
                                                                                                <td align="left" valign="top" style="font-size: 7px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;margin: 0;padding-left: 5px;padding-right: 5px;">
                                                                                                    Special Handling Codes:
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;margin: 0;padding-left: 5px;padding-right: 5px;">
                                                                                                    @php
                                                                                                        echo str_replace('"', '', $specialHandlingInfo);
                                                                                                    @endphp
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <!-- first column code-->
                                                                        <!-- second column code-->
                                                                        <td align="left" valign="bottom" width="95px" style="width:95px;text-align:left;padding-top: 40px;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="bottom"  style="border-top: 1px solid #000000;border-left: 1px solid #000000;">
                                                                                    <table cellpadding="0" cellspacing="0" >
                                                                                        <tr>
                                                                                            <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;margin: 0;padding-left: 5px;padding-right: 5px;">
                                                                                                SCI
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td> 
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <!-- second column code-->
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- second column section -->
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Handling Information -->
                                <!-- Pieces -->
                                <tr>
                                    <td align="center">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td align="center">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <!-- One -->
                                                            <td align="center" valign="top" width="100px" style="border-right:1px solid #000000;border-left: 1px solid #000000;">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="center" valign="top" style="border-bottom:1px solid #000000;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <!-- One -->
                                                                                    <td align="center" valign="top" style="border-right:1px solid #000000;">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="39px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    No. of Pieces RCP 
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- One -->
                                                                                    <!-- Two -->
                                                                                    <td align="center" valign="top" style="border-right:1px solid #000000;">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="40px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    Gross Weight 
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- Two -->
                                                                                    <!-- Three -->
                                                                                    <td align="center" valign="top">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="20px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    kg lb 
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- Three -->
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <!-- One -->
                                                                                    <td align="right" valign="top" style="border-right:1px solid #000000;border-bottom:1px solid #000000;">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="right" valign="top" width="39px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                    {{ $airWayBill->consignmentData->pieces ?? ''}} 
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- One -->
                                                                                    <!-- Two -->
                                                                                    <td align="right" valign="top" style="border-right:1px solid #000000;border-bottom:1px solid #000000;">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="right" valign="top" width="40px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                    {{ $airWayBill->consignmentData->gross_weight ?? ''}}
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- Two -->
                                                                                    <!-- Three -->
                                                                                    <td align="center" valign="top">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="20px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-bottom: 130px;">
                                                                                                    K 
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- Three -->
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="right" valign="bottom">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <!-- One -->
                                                                                    <td align="right" valign="bottom" style="border-right:1px solid #000000;">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="right" valign="bottom" width="39px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                    {{ $airWayBill->consignmentData->pieces ?? ''}}
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- One -->
                                                                                    <!-- Two -->
                                                                                    <td align="right" valign="bottom" style="border-right:1px solid #000000;">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="right" valign="bottom" width="40px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                    {{ $airWayBill->consignmentData->gross_weight ?? ''}}
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- Two -->
                                                                                    <!-- Three -->
                                                                                    <td align="right" valign="bottom">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="right" valign="bottom" width="20px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    &nbsp; 
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- Three -->
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <!-- One -->
                                                            <!-- Two -->
                                                            <td align="center" valign="top" width="8px" bgcolor="bee3fe" >
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="center" valign="top" width="8px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-top:40px;">
                                                                                                   {{ $airWayBill->consignmentData->service_code ?? ''}} 
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
                                                            <!-- Two -->
                                                            <!-- Three -->
                                                            <td align="center" valign="top" width="100px" style="border-right:1px solid #000000;border-left: 1px solid #000000;">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="center" valign="top" >
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <!-- One -->
                                                                                    <td align="center" valign="top">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="100px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    Rate Class
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                    <!-- One -->
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <!-- One -->
                                                                                    <td align="center" valign="top" style="padding-top: 10px;">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="20px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-bottom:158px;">
                                                                                                    {{ $airWayBill->consignmentData->rate_class ?? ''}}
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- One -->
                                                                                    <!-- Two -->
                                                                                    <td align="center" valign="top"  width="80px" style="border-left:1px solid #000000;border-top: 1px solid #000000;">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="80px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;border-bottom: 1px solid #000000;">
                                                                                                    Commodity <br />Item No. 
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- Two -->
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <!-- Three -->
                                                            <!-- Four -->
                                                            <td align="center" valign="top" width="8px" bgcolor="bee3fe" >
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="center" valign="top" width="8px">
                                                                                        &nbsp;
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <!-- Four -->
                                                            <!-- Five -->
                                                            <td align="center" valign="top" width="70px" style="border-right:1px solid #000000;border-left: 1px solid #000000;">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="center" valign="top" style="border-bottom:1px solid #000000;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <!-- One -->
                                                                                    <td align="center" valign="top">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="70px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    Chargable<br /> Weight
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="70px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    &nbsp;
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                    <!-- One -->
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="right" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <!-- One -->
                                                                                    <td align="right" valign="top">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="right" valign="top" width="70px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                    {{ $airWayBill->consignmentData->chargable_weight ?? ''}}
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- One -->
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr> 
                                                                </table>
                                                            </td>
                                                            <!-- Five -->
                                                            <!-- Six -->
                                                            <td align="center" valign="top" width="8px" bgcolor="bee3fe" >
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="center" valign="top" width="8px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                        &nbsp; 
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <!-- Six -->
                                                            <!-- Seven -->
                                                            <td align="center" valign="top" width="50px" style="border-right:1px solid #000000;border-left: 1px solid #000000;">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="center" valign="top" style="border-bottom:1px solid #000000;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="center" valign="top">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding:0px 10px;">
                                                                                                    Rate / Charge 
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    &nbsp;
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    &nbsp;
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    {{-- <td align="center" valign="top">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="2px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    / 
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td> --}}
                                                                                    {{-- <td align="center" valign="top">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="24px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td> --}}
                                                                                </tr>
                                                                                
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center" valign="top" style="">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <!-- One -->
                                                                                    <td align="right" valign="top">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="right" valign="top" width="75px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                    {{ $airWayBill->consignmentData->rate ?? ''}} 
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- One -->
                                                                                    
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    
                                                                </table>
                                                            </td>
                                                            <!-- Seven -->
                                                            <!-- Eight -->
                                                            <td align="center" valign="top" width="8px" bgcolor="bee3fe" >
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="center" valign="top" width="8px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                        &nbsp; 
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    
                                                                </table>
                                                            </td>
                                                            <!-- Eight -->
                                                            <!-- Nine -->
                                                            <td align="center" valign="top" width="80px;" style="border-right:1px solid #000000;border-left: 1px solid #000000;">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="center" valign="top" style="border-bottom:1px solid #000000;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <!-- One -->
                                                                                    <td align="center" valign="top">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="80px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    Total
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="80px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    &nbsp;
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="80px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    &nbsp;
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                    <!-- One -->
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="right" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <!-- One -->
                                                                                    <td align="right" valign="top" style="border-bottom: 1px solid #000;padding-bottom: 130px;">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="right" valign="top" width="80px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                    {{ $airWayBill->total_amount ?? ''}}  
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- One -->
                                                                                    
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="right" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <!-- One -->
                                                                                    <td align="right" valign="top">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="right" valign="top" width="80px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                    {{ $airWayBill->total_amount ?? ''}} 
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- One -->
                                                                                    
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <!-- Nine -->
                                                            <!-- Ten -->
                                                            <td align="center" valign="top" width="8px" bgcolor="bee3fe" >
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td lign="center" valign="top" width="8px">
                                                                                        &nbsp;
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <!-- Ten -->
                                                            <!-- Eleven -->
                                                            <td align="center" valign="top" width="162px" style="border-right:1px solid #000000;border-left: 1px solid #000000;">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <tr>
                                                                        <td align="center" valign="top" style="border-bottom:1px solid #000000;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <!-- One -->
                                                                                    <td align="center" valign="top" width="160px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    Nature and Quantity of Goods (incl. Dimensions or Volume)
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    &nbsp;
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                    <!-- One -->
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center" valign="top" style="">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <!-- One -->
                                                                                    <td align="left" valign="top" width="160px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="left" valign="top" width="160px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left:5px;">
                                                                                                    {{ $airWayBill->consignmentData->description ?? ''}}<br>

                                                                                                        @php
                                                                                                        if (isset($airWayBill->consignmentData) && isset($airWayBill->consignmentData->pieces_info)) {
                                                                                                            $decodedInfo = json_decode($airWayBill->consignmentData->pieces_info, true);
                                                                                                            foreach ($decodedInfo as $key => $value) 
                                                                                                            {
                                                                                                                echo $piecesInfo = $decodedInfo[$key]['pcs'].'/'.$decodedInfo[$key]['length'].'x'.$decodedInfo[$key]['width'].'x'.$decodedInfo[$key]['height'].' '.$decodedInfo[$key]['unit'].'<br/>' ;

                                                                                                            }
                                                                                                            // Getting Hs code
                                                                                                            if (!empty($hsCode)) {
                                                                                                                $hsCode = str_replace('"', '', $hsCode);
                                                                                                                $hsCode = explode(' ', $hsCode);
                                                                                                                foreach ($hsCode as $value) {
                                                                                                                    echo "Hs Code: ".$value."<br>";
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                        @endphp
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- One -->
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left" valign="bottom" style="">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <!-- One -->
                                                                                    <td align="left" valign="bottom" style="text-align:center;">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="left" valign="bottom" width="160px" style="padding-left:5px;font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                    Total Volume: 6MC 
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- One -->
                                                                                    
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <!-- Eleven -->    
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Pieces -->
                                <!-- MJ-Miscellaneous  -->
                                <tr>
                                    <td align="center" valign="top" style="border:1px solid #000000;border-bottom:none;border-right:none">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td align="center" valign="top">
                                                    <table  cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <!-- first section -->
                                                            <td align="center" valign="top" width="280px" style="border-right:1px solid #000000;">
                                                                <table cellpadding="0" cellspacing="0">
                                                                    <!-- Prepaid Weight Charge Collect -->
                                                                    <tr>
                                                                        <td align="center" valign="top" width="280px">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <!-- One -->
                                                                                    <td align="center" valign="top" width="80px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="40px" style="padding:0px 0px 0px 10px;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" width="40px" class="optional-Shipping-information" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding: 0px 5px;">
                                                                                                                Prepaid   
                                                                                                            </td>
                                                                                                        </tr>  
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- One -->

                                                                                    <!-- Two -->
                                                                                    <td align="center" valign="top" width="120px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="100px">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" width="100px" class="optional-Shipping-information" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding: 0px 10px;">
                                                                                                                Weight Charge   
                                                                                                            </td>
                                                                                                        </tr>  
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- Two -->

                                                                                    <!-- three -->
                                                                                    <td align="center" valign="top" width="80px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top"width="40px" style="padding-left:20px;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" width="40px" class="optional-Shipping-information" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding: 0px 5px;">
                                                                                                            Collect   
                                                                                                            </td>
                                                                                                        </tr>  
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- three -->
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="right" valign="top">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="right" valign="top" width="280px">
                                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                                            <tr>
                                                                                                <td align="right" valign="bottom" width="130px" height="20px" style="border-right:1px solid #000000;border-bottom:1px solid #000;font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                                                    @php
                                                                                                        $prepaidTaxType = $airWayBill->paymentInfo->type_of_payment ?? '';
                                                                                                        if ($prepaidTaxType == "PP") {
                                                                                                            echo $airWayBill->paymentInfo->total_charges_prepaid;
                                                                                                        }
                                                                                                    @endphp
                                                                                                </td>
                                                                                                <td align="right" valign="bottom" width="146px" height="20px" style="border-bottom:1px solid #000;font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                                                    @php
                                                                                                        $prepaidTaxType = $airWayBill->paymentInfo->type_of_payment ?? '';
                                                                                                        if ($prepaidTaxType == "CC") {
                                                                                                            echo $airWayBill->paymentInfo->total_charges_collect;
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
                                                                    <!-- Prepaid Weight Charge Collect -->
                                                                    <!-- Valuation Charge -->
                                                                    <tr>
                                                                        <td align="center" valign="top"  width="280px">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="center" valign="top">
                                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                                            <tr>
                                                                                                <!-- one -->
                                                                                                <td align="center" valign="top" width="80px">
                                                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top">
                                                                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                                    <tr>
                                                                                                                        <td align="center" valign="top" width="80px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                                            &nbsp;
                                                                                                                        </td>
                                                                                                                    </tr>  
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                                <!-- one -->
                                                                                                <!-- Two -->
                                                                                                <td align="center" valign="top" width="120px">
                                                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" style="padding-left:10px; padding-right:20px;">
                                                                                                                <table cellpadding="0" cellspacing="0">
                                                                                                                    <tr>
                                                                                                                        <td align="center" valign="top" width="90px" class="optional-Shipping-information" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                                            Valuation Charge   
                                                                                                                        </td>
                                                                                                                    </tr>  
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                                <!-- Two -->
                                                                                                <!-- Three -->
                                                                                                <td align="center" valign="top" width="80px">
                                                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top">
                                                                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                                    <tr>
                                                                                                                        <td align="center" valign="top" width="80px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                                            &nbsp;  
                                                                                                                        </td>
                                                                                                                    </tr>  
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                                <!-- Three -->
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="right" valign="top"  width="280px">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="right" valign="top" width="280px">
                                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                                            <tr>
                                                                                                <td align="right" valign="bottom" width="130px" height="20px" style="border-right:1px solid #000000;border-bottom:1px solid #000;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                                                    &nbsp;
                                                                                                </td>
                                                                                                <td align="right" valign="bottom" width="146px" height="20px" style="border-bottom:1px solid #000;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                                                    &nbsp;
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>                                                          
                                                                        </td>
                                                                    </tr>
                                                                    <!-- Valuation Charge -->
                                                                    <!-- TAX -->
                                                                    <tr>
                                                                        <td align="center" valign="top"  width="280px">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="center" valign="top">
                                                                                        <table cellpadding="0" cellspacing="0"  width="100%">
                                                                                            <tr>
                                                                                                <!-- one -->
                                                                                                <td align="center" valign="top" width="100px">
                                                                                                    <table cellpadding="0" cellspacing="0"  width="100%">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top">
                                                                                                                <table cellpadding="0" cellspacing="0"  width="100%">
                                                                                                                    <tr>
                                                                                                                        <td align="center" valign="top" width="100px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                                            &nbsp;
                                                                                                                        </td>
                                                                                                                    </tr>  
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                                <!-- one -->
                                                                                                <!-- Two -->
                                                                                                <td align="center" valign="top" width="80px">
                                                                                                    <table cellpadding="0" cellspacing="0"  width="100%">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" style="padding-left:5px; padding-right:20px;">
                                                                                                                <table cellpadding="0" cellspacing="0"  width="100%">
                                                                                                                    <tr>
                                                                                                                        <td align="center" valign="top" width="40px" class="optional-Shipping-information" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                                            Tax   
                                                                                                                        </td>
                                                                                                                    </tr>  
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                                <!-- Two -->
                                                                                                <!-- Three -->
                                                                                                <td align="center" valign="top" width="100px">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top">
                                                                                                                <table cellpadding="0" cellspacing="0">
                                                                                                                    <tr>
                                                                                                                        <td align="center" valign="top" width="100px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                                            &nbsp;  
                                                                                                                        </td>
                                                                                                                    </tr>  
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                                <!-- Three -->
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="right" valign="top">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="right" valign="top" width="280px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="right" valign="bottom" height="20px" width="130px" style="border-right:1px solid #000000;border-bottom:1px solid #000;font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                                                    @php
                                                                                                        $prepaidTaxType = $airWayBill->paymentInfo->type_of_payment ?? '';
                                                                                                        if ($prepaidTaxType == "PP") {
                                                                                                            echo $airWayBill->paymentInfo->taxes;
                                                                                                        }
                                                                                                    @endphp
                                                                                                </td>
                                                                                                <td align="right" valign="bottom" width="146px" height="20px" style="border-bottom:1px solid #000;font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                                                    @php
                                                                                                        $prepaidTaxType = $airWayBill->paymentInfo->type_of_payment ?? '';
                                                                                                        if ($prepaidTaxType == "CC") {
                                                                                                            echo $airWayBill->paymentInfo->taxes;
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
                                                                    <!-- TAX -->
                                                                    <!-- Total Other Charges Due Agent -->
                                                                    <tr>
                                                                        <td align="center" valign="top"  width="280px" style="width:280px;">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="center" valign="top">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <!-- one -->
                                                                                                <td align="center" valign="top" width="40px">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top">
                                                                                                                <table cellpadding="0" cellspacing="0">
                                                                                                                    <tr>
                                                                                                                        <td align="center" valign="top" width="40px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                                            &nbsp;
                                                                                                                        </td>
                                                                                                                    </tr>  
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                                <!-- one -->
                                                                                                <!-- Two -->
                                                                                                <td align="center" valign="top" width="200px">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top">
                                                                                                                <table cellpadding="0" cellspacing="0">
                                                                                                                    <tr>
                                                                                                                        <td align="center" valign="top" width="180px" class="optional-Shipping-information" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding: 0px 10px;">
                                                                                                                            Total Other Charges Due Agent   
                                                                                                                        </td>
                                                                                                                    </tr>  
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                                <!-- Two -->
                                                                                                <!-- Three -->
                                                                                                <td align="center" valign="top" width="40px">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top">
                                                                                                                <table cellpadding="0" cellspacing="0">
                                                                                                                    <tr>
                                                                                                                        <td align="center" valign="top" width="40px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                                            &nbsp;  
                                                                                                                        </td>
                                                                                                                    </tr>  
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                                <!-- Three -->
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="right" valign="top">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="right" valign="top" width="280px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="right" valign="bottom" height="20px" width="130px" style="border-right:1px solid #000000;border-bottom:1px solid #000;font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                                                    {{ $airWayBill->paymentInfo->other_charges_due_agent_prepaid ?? ''}}
                                                                                                </td>
                                                                                                <td align="right" valign="bottom" height="20px" width="146px" style="border-bottom:1px solid #000;font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                                                    {{ $airWayBill->paymentInfo->other_charges_due_agent_collect ?? ''}}
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>                                                          
                                                                        </td>
                                                                    </tr>
                                                                    <!-- Total Other Charges Due Agent -->
                                                                    <!-- Total Other Charges Due Carrier -->
                                                                    <tr>
                                                                        <td align="center" valign="top" width="280px">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <!-- One -->
                                                                                    <td align="center" valign="top" width="40px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="40px">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding: 0px 5px;">
                                                                                                                &nbsp;  
                                                                                                            </td>
                                                                                                        </tr>  
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- One -->
                                                                                    <!-- Two -->
                                                                                    <td align="center" valign="top" width="200px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" width="180px" class="optional-Shipping-information" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding: 0px 10px;">
                                                                                                                Total Other Charges Due Carrier
                                                                                                            </td>
                                                                                                        </tr>  
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- Two -->

                                                                                    <!-- three -->
                                                                                    <td align="center" valign="top" width="40px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="40px">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding: 0px 5px;">
                                                                                                                &nbsp;
                                                                                                            </td>
                                                                                                        </tr>  
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <!-- three -->
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="right" valign="top">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="right" valign="top" width="280px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="right" valign="bottom"  height="20px" width="130px" style="border-right:1px solid #000000;border-bottom:1px solid #000;font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                                                    {{ $airWayBill->paymentInfo->other_charges_due_carrier_prepaid ?? ''}}
                                                                                                </td>
                                                                                                <td align="right" valign="bottom"  height="20px" width="146px" style="border-bottom:1px solid #000;font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                                                    {{ $airWayBill->paymentInfo->other_charges_due_carrier_collect ?? ''}}
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>                                                          
                                                                        </td>
                                                                    </tr>
                                                                    <!-- Total Other Charges Due Carrier -->
                                                                    <!-- Blank Row -->
                                                                    <tr>
                                                                        <td align="right" valign="top" bgcolor="bee3fe">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="right" valign="top" width="280px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="right" valign="bottom" height="30px" width="132px" style="border-right:1px solid #000000;border-bottom:1px solid #000;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                    &nbsp;
                                                                                                </td>
                                                                                                <td align="right" valign="bottom" height="30px" width="148px" style="border-bottom:1px solid #000;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                    &nbsp;
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>                                                          
                                                                        </td>
                                                                    </tr>
                                                                    <!-- Blank row -->
                                                                    <!-- Total prepaid Total collect -->
                                                                    <tr>
                                                                        <td align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="center" valign="top" width="280px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="92px" style="border-right:1px solid #000;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding: 0px 20px;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" width="90px" class="optional-Shipping-information" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                                Total Prepaid
                                                                                                            </td>
                                                                                                        </tr>  
                                                                                                    </table>
                                                                                                </td>
                                                                                                <td align="center" valign="top" width="108px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding: 0px 20px;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" width="100px" class="optional-Shipping-information" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                                Total Collect
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
                                                                    <tr>
                                                                        <td align="right" valign="top" style="border-bottom: 1px solid #000;">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="right" valign="top" width="280px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="right" valign="bottom" width="132px" style="border-right:1px solid #000;font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="right" valign="bottom" height="20px" width="130px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                                                                {{ $airWayBill->paymentInfo->total_charges_prepaid ?? ''}}
                                                                                                            </td>
                                                                                                        </tr>  
                                                                                                    </table>
                                                                                                </td>
                                                                                                <td align="right" valign="bottom" width="148px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="right" valign="bottom" height="20px" width="146px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                                                                {{ $airWayBill->paymentInfo->total_charges_collect ?? ''}}
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
                                                                    <!-- Total prepaid Total collect -->
                                                                    <!-- Currency Conversion Rates -->
                                                                    <tr>
                                                                        <td align="center" valign="top" bgcolor="bee3fe">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="center" valign="top" width="280px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="112px" style="border-right:1px solid #000;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding:0px 10px;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" width="112px" class="optional-Shipping-information" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                                Currency Conversion Rates
                                                                                                            </td>
                                                                                                        </tr>  
                                                                                                    </table>
                                                                                                </td>
                                                                                                <td align="center" valign="top" width="128px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding:0px 10px;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" width="128px" class="optional-Shipping-information" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                                CC Charges in Dest. Currency
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
                                                                    <tr>
                                                                        <td align="center" valign="top" bgcolor="bee3fe" style="border-bottom:1px solid #000;">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="right" valign="top" width="280px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="right" valign="top" width="132px" style="border-right:1px solid #000;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="right" valign="top" height="20px" width="130px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-right:2px;">
                                                                                                                &nbsp;
                                                                                                            </td>
                                                                                                        </tr>  
                                                                                                    </table>
                                                                                                </td>
                                                                                                <td align="center" valign="top" width="148px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" height="20px" width="146px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-right:2px;">
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
                                                                    </tr>
                                                                    <!-- Currency Conversion Rates -->
                                                                    <!-- Charges at Destination -->
                                                                    <tr>
                                                                        <td align="center" valign="top" bgcolor="bee3fe">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="center" valign="top" width="280px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="112px" style="width: 112px;border-right:1px solid #000;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding:0px 10px;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" width="112px" style="width:112px;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                                For Carrier's use only at Destinations
                                                                                                            </td>
                                                                                                        </tr>  
                                                                                                    </table>
                                                                                                </td>
                                                                                                <td align="center" valign="top" width="108px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding:0px 20px;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" width="108px" class="optional-Shipping-information" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                                Charges at Destination
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
                                                                    <tr>
                                                                        <td align="center" valign="top" bgcolor="bee3fe" style="border-bottom:1px solid #000;">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="right" valign="top" width="280px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="right" valign="top" width="132px" style="width: 132px;border-right:1px solid #000;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="right" valign="top" width="132px" style="width:132px;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                                                &nbsp;
                                                                                                            </td>
                                                                                                        </tr>  
                                                                                                    </table>
                                                                                                </td>
                                                                                                <td align="center" valign="top" width="148px" style="width: 148px;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" width="100px" style="width:100px;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
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
                                                                    </tr>
                                                                    <!-- Charges at Destination -->
                                                                </table>
                                                            </td>
                                                            <!-- first section -->
                                                            <!-- second section -->
                                                            <td align="left" valign="top" width="370px" style="width:370px;">
                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                    <!-- First Column -->
                                                                    <tr>
                                                                        <td align="left" valign="top" width="370px" style="border-bottom:1px solid #000000;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="border-right:1px solid #000;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding-left: 5px;">
                                                                                        Other Charges
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" height="77px" style="border-right:1px solid #000;font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left: 10px;">
                                                                                        @foreach ($airWayBill->otherCharge as $charge)
                                                                                            {{ $charge->other_charge_code ?? ''}} {{ $charge->due ?? ''}} {{ $charge->amount ?? ''}}<br> 
                                                                                        @endforeach
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" valign="top" style="border-right:1px solid #000;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;">
                                                                                       &nbsp;
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <!-- First column -->
                                                                    <!-- Second column -->
                                                                    <tr>
                                                                        <td align="left" valign="top"  style="border-right:1px solid #000;">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="left" valign="top" height="68px" width="370px" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;" >
                                                                                        Shipper certifies that the particulars on the face hereof are correct and that insofar as any part of the consignment contains dangerous goods, such part is properly described by name and is in proper condition for carriage by air according to the applicable Dangerous Goods Regulations
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" valign="bottom" style="padding:0px 35px 5px;border-bottom:1px solid #000;">
                                                                                        <table cellpadding="0" cellspacing="0" width="370px" style="width:370px;text-align:center;">
                                                                                            <tr>
                                                                                                <td align="center" valign="bottom">
                                                                                                    <table cellpadding="0" cellspacing="0" style="width:300px;">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="bottom" style="border-bottom:1px dotted #000000;font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding: 0px 0px;" >
                                                                                                                {{ $airWayBill->agentsInfo->agent_name ?? ''}}
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td align="center" valign="middle">
                                                                                                    <table cellpadding="0" cellspacing="0" style="width:300px;">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding: 0px 0px;text-align:center;" >
                                                                                                                Signature of Shipper or his Agent
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
                                                                    <tr>
                                                                        <td align="center" valign="bottom"  width="370px" height="68px" style="border-right:1px solid #000;border-bottom: 1px solid #000000;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tr>
                                                                                    <td align="center" valign="bottom">
                                                                                        <table cellpadding="0" cellspacing="0" width="300px" style="padding:0px 35px;">
                                                                                        <tr>
                                                                                            <td align="center" valign="bottom" style="border-bottom:1px dotted #000000;">
                                                                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                    <tr>
                                                                                                        <td align="center" valign="bottom" width="70px">
                                                                                                            <table cellpadding="0" cellspacing="0"> 
                                                                                                                <tr>
                                                                                                                    <td align="center" valign="bottom" width="70px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;" >
                                                                                                                        @php
                                                                                                                            echo $agentIssueDate = !empty($airWayBill->agentsInfo) && !empty($airWayBill->agentsInfo->agent_issue_date) 
                                                                                                                            ? date('d-M-y', strtotime($airWayBill->agentsInfo->agent_issue_date)) 
                                                                                                                            : '';
                                                                                                                           // echo $agentIssueDate = date('d-M-y', strtotime($airWayBill->agentsInfo->agent_issue_date));
                                                                                                                        @endphp
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                        <td align="center" valign="top" width="70px">
                                                                                                            <table cellpadding="0" cellspacing="0"> 
                                                                                                                <tr>
                                                                                                                    <td align="center" valign="top" width="70px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;" >
                                                                                                                        @php
                                                                                                                            //$locationCode = explode(',', $airWayBill->agentsInfo->agent_issue_loc_code);
                                                                                                                            //echo $locationCode = $locationCode[0] ?? '';
                                                                                                                            $locationCode = '';
                                                                                                                                if (!empty($airWayBill->agentsInfo) && !empty($airWayBill->agentsInfo->agent_issue_loc_code)) {
                                                                                                                                    $locationCodeArray = explode(',', $airWayBill->agentsInfo->agent_issue_loc_code);
                                                                                                                                    $locationCode = $locationCodeArray[0] ?? '';
                                                                                                                                }
                                                                                                                                echo $locationCode;
                                                                                                                        @endphp
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                        <td align="center" valign="top" width="160px">
                                                                                                            <table cellpadding="0" cellspacing="0"> 
                                                                                                                <tr>
                                                                                                                    <td align="center" valign="top" width="160px" style="font-size: 10px;line-height: 14px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;" >
                                                                                                                        {{ $airWayBill->agentsInfo->agent_issue_sign ?? ''}}
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
                                                                                <tr>
                                                                                    <td align="center" valign="middle" style="padding-bottom:6px;">
                                                                                        <table cellpadding="0" cellspacing="0" width="300px"  style="padding:0px 35px;">
                                                                                        <tr>
                                                                                            <td align="center" valign="top" width="70px" style="width:70px">
                                                                                                <table cellpadding="0" cellspacing="0"> 
                                                                                                    <tr>
                                                                                                        <td align="center" valign="top" style="width:70px;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;" >
                                                                                                            Executed on (Date)
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </table>
                                                                                            </td>
                                                                                            <td align="center" valign="top" width="70px" style="width:70px">
                                                                                                <table cellpadding="0" cellspacing="0"> 
                                                                                                    <tr>
                                                                                                        <td align="center" valign="top" style="width:70px;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;" >
                                                                                                            at (Place)
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </table>
                                                                                            </td>
                                                                                            <td align="center" valign="top" width="160px" style="width:160px">
                                                                                                <table cellpadding="0" cellspacing="0"> 
                                                                                                    <tr>
                                                                                                        <td align="center" valign="top" style="width:160px;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;" >
                                                                                                            Signature of Issuing Carrier or his Agent
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
                                                                    <tr>
                                                                        <td align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="center" valign="top" width="370px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="112px"  bgcolor="bee3fe" style="border-right:1px solid #000;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding:0px 20px;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" width="112px" class="optional-Shipping-information" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                                Total Collect Charges
                                                                                                            </td>
                                                                                                        </tr>  
                                                                                                    </table>
                                                                                                </td>
                                                                                                <td align="center" valign="top" width="108px" style="font-size: 14px;line-height: 21px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" width="108px" style="font-size: 14px;line-height: 21px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-left:30px;">
                                                                                                                {{$airWayBill->awb_code . ' '. $airWayBill->awb_no ?? ''}}
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
                                                                    <tr>
                                                                        <td align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0">
                                                                                <tr>
                                                                                    <td align="center" valign="top" width="370px">
                                                                                        <table cellpadding="0" cellspacing="0">
                                                                                            <tr>
                                                                                                <td align="center" valign="top" width="112px"  bgcolor="bee3fe" style="width: 112px;border-bottom:1px solid #000;border-right:1px solid #000;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding:0px 20px;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" width="112px" style="height:23px;width:112px;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                               &nbsp;
                                                                                                            </td>
                                                                                                        </tr>  
                                                                                                    </table>
                                                                                                </td>
                                                                                                <td align="center" valign="top" width="108px" style="width: 108px;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
                                                                                                    <table cellpadding="0" cellspacing="0">
                                                                                                        <tr>
                                                                                                            <td align="center" valign="top" width="108px" style="width:108px;font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;">
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
                                                                    </tr>
                                                                    <!-- Second column -->
                                                                </table>
                                                            </td>
                                                            <!-- second section -->                                                                   
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- MJ-Miscellaneous -->
                            </table>
                        </td>
                    </tr>
                    <!-- Main Border Section Code -->
                </table>
            </td>
        </tr>
        @if (isset($page))
        <tr>
            <td align="center" valign="top" width="108px" style="width:108px;font-size: 12px;line-height: 16px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding-top:0px;">
                @php
                    if ($page == 'ORIGINAL-1') {
                        echo "ORIGINAL 1 - (FOR ISSUING CARRIER)";
                    }
                    elseif ($page == 'ORIGINAL-2') {
                        echo "ORIGINAL 2 - (FOR CONSIGNEE)";
                    }
                    elseif ($page == 'ORIGINAL-3') {
                        echo "ORIGINAL 3 (FOR SHIPPER)";
                    }
                    elseif ($page == 'COPY-4') {
                        echo "COPY 4 (DELIVERY RECEIPT)";
                    }
                    elseif ($page == 'COPY-5') {
                        echo "COPY 5 (EXTRA COPY)";
                    }
                    elseif ($page == 'COPY-6') {
                        echo "COPY 6 (EXTRA COPY)";
                    }
                    elseif ($page == 'COPY-7') {
                        echo "COPY 7 (EXTRA COPY)";
                    }
                    elseif ($page == 'COPY-8') {
                        echo "COPY 8 (FOR AGENT)";
                    }
                    elseif ($page == 'EXTRA-COPY-1') {
                        echo "EXTRA COPY";
                    }
                    elseif ($page == 'EXTRA-COPY-2') {
                        echo "EXTRA COPY";
                    }
                    elseif ($page == 'EXTRA-COPY-3') {
                        echo "EXTRA COPY";
                    }
                @endphp
            </td>
        </tr>
    @endif
    </table>
    <!-- Second Page code --> 
    @if (isset($showBothPage) && $showBothPage == true)
        <table cellpadding="0" cellspacing="0" width="600px" align="center">
            <tr>
                <td align="center" valign="top" width="600px">
                    <table cellpadding="0" cellspacing="0" width="100%"> 
                        <tr>
                            <td align="center" valign="middle" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding: 0px;" >
                                <img src="{{ public_path('media/custome/iata-logo.png') }}" alt="IATA ICON" width="50px" height="auto">
                            </td>
                        </tr>
                        <tr>
                            <td align="center" valign="middle" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding: 0px;" >
                                NOTICE CONCERNING CARRIER’S LIMITATION OF LIABILITY 
                            </td>
                        </tr>
                        <tr>
                            <td align="center" valign="middle" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding: 0px 0px" >
                                If the carriage involves an ultimate destination or stop in a country other than the country of departure, the Montreal Convention or the Warsaw Convention may be applicable to the liability of the Carrier in respect of loss of, damage or delay to cargo. Carrier's limitation of liability in accordance with those Conventions shall be as set forth in subparagraph 4 unless a higher value is declared.
                            </td>
                        </tr>
                        <tr>
                            <td align="center" valign="middle" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 700;padding: 10px 0px;" >
                                CONDITIONS OF CONTRACT
                            </td>
                        </tr>
                        <tr>
                            <td align="center" valign="middle">
                                <table cellpadding="0" cellspacing="0" width="600px" align="center">
                                    <tr>
                                        <td align="center" valign="top">
                                            <table cellpadding="0" cellspacing="0" width="100%"> 
                                                <tr>
                                                    <td width="280px" align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding: 0px 10px;" >
                                                        <b>1.</b> In this contract and the Notices appearing hereon:<br aria-hidden="true" />
                                                        CARRIER includes the air carrier issuing this air waybill and all carriers that carry or undertake to carry the cargo or perform any other services related to such carriage. SPECIAL DRAWING RIGHT (SDR) is a Special Drawing Right as defined by the International Monetary Fund. WARSAW CONVENTION means whichever of the following instruments is applicable to the contract of carriage: the Convention for the Unification of Certain Rules Relating to International Carriage by Air, signed at Warsaw, 12 October 1929; that Convention as amended at The Hague on 28 September 1955; that Convention as amended at The Hague 1955 and by Montreal Protocol No. 1, 2, or 4 (1975) as the case may be. MONTREAL CONVENTION means the Convention for the Unification of Certain Rules for International Carriage by Air, done at Montreal on 28 May 1999. 
                                                        <br aria-hidden="true" />
                                                        <b>2.</b>/<b>2.1</b> Carriage is subject to the rules relating to liability established by the Warsaw Convention or the Montreal Convention unless such carriage is not “international carriage” as defined by the applicable Conventions.
                                                        <br aria-hidden="true" />
                                                        <b>2.2</b> To the extent not in conflict with the foregoing, carriage and other
                                                        related services performed by each Carrier are subject to:
                                                        <br aria-hidden="true" />
                                                        <b>2.2.1</b> applicable laws and government regulations;
                                                        <br aria-hidden="true" />
                                                        <b>2.2.2</b> provisions contained in the air waybill, Carrier’s conditions of
                                                        carriage and related rules, regulations, and timetables (but not the times of
                                                        departure and arrival stated therein) and applicable tariffs of such Carrier,
                                                        which are made part hereof, and which may be inspected at any airports
                                                        or other cargo sales offices from which it operates regular services. When
                                                        carriage is to/from the USA, the shipper and the consignee are entitled,
                                                        upon request, to receive a free copy of the Carrier’s conditions of carriage.
                                                        The Carrier’s conditions of carriage include, but are not limited to:
                                                        <br aria-hidden="true" />
                                                        <b>2.2.2.1</b> limits on the Carrier’s liability for loss, damage or delay of goods,
                                                        including fragile or perishable goods;
                                                        <br aria-hidden="true" />
                                                        <b>2.2.2.2</b> claims restrictions, including time periods within which shippers
                                                        or consignees must file a claim or bring an action against the Carrier for
                                                        its acts or omissions, or those of its agents;
                                                        <br aria-hidden="true" />
                                                        <b>2.2.2.3</b> rights, if any, of the Carrier to change the terms of the contract;
                                                        <br aria-hidden="true" />
                                                        <b>2.2.2.4</b> rules about Carrier’s right to refuse to carry;
                                                        <br aria-hidden="true" />
                                                        <b>2.2.2.5</b> rights of the Carrier and limitations concerning delay or failure to
                                                        perform service, including schedule changes, substitution of alternate
                                                        Carrier or aircraft and rerouting.
                                                        <br aria-hidden="true" />
                                                        <b>3</b> The agreed stopping places (which may be altered by Carrier in case of
                                                        necessity) are those places, except the place of departure and place of
                                                        destination, set forth on the face hereof or shown in Carrier’s timetables
                                                        as scheduled stopping places for the route. Carriage to be performed
                                                        hereunder by several successive Carriers is regarded as a single operation.
                                                        <br aria-hidden="true" />
                                                        <b>4</b> For carriage to which the Montreal Convention does not apply,
                                                        Carrier’s liability limitation for cargo lost, damaged or delayed shall be
                                                        22 SDRs per kilogram unless a greater per kilogram monetary limit is
                                                        provided in any applicable Convention or in Carrier’s tariffs or general
                                                        conditions of carriage.        
                                                        <br aria-hidden="true" />
                                                        <b>5.</b>/<b>5.1</b> Except when the Carrier has extended credit to the consignee
                                                        without the written consent of the shipper, the shipper guarantees payment
                                                        of all charges for the carriage due in accordance with Carrier’s tariff,
                                                        conditions of carriage and related regulations, applicable laws (including
                                                        national laws implementing the Warsaw Convention and the Montreal
                                                        Convention),<br>
                                                        government regulations, orders and requirements. 
                                                        <br aria-hidden="true" />
                                                        <b>5.2</b> When no part of the consignment is delivered, a claim with respect to
                                                        such consignment will be considered even though transportation charges
                                                        thereon are unpaid.                                     
                                                        <br aria-hidden="true" />
                                                        <b>6.</b>/<b>6.1</b> For cargo accepted for carriage, the Warsaw Convention and the
                                                        Montreal Convention permit shipper to increase the limitation of liability
                                                        by declaring a higher value for carriage and paying a supplemental charge
                                                        if required
                                                        <br aria-hidden="true" />
                                                        <b>6.2</b> In carriage to which neither the Warsaw Convention nor the Montreal                               
                                                    </td>
                                                    <td width="280px" align="left" valign="top" style="font-size: 8px;line-height: 12px;font-family:Segoe UI, Helvatica, Arial,sans-serif;color: #000000;font-weight: 400;padding: 0px 10px;" >
                                                        Convention applies Carrier shall, in accordance with the procedures set
                                                        forth in its general conditions of carriage and applicable tariffs, permit
                                                        shipper to increase the limitation of liability by declaring a higher value
                                                        for carriage and paying a supplemental charge if so required. 
                                                        <br aria-hidden="true" />
                                                        <b>7.</b>/<b>7.1</b> In cases of loss of, damage or delay to part of the cargo, the weight
                                                        to be taken into account in determining Carrier’s limit of liability shall
                                                        be only the weight of the package or packages concerned.
                                                        <br aria-hidden="true" />
                                                        <b>7.2</b> Notwithstanding any other provisions, for “foreign air
                                                        transportation” as defined by the U.S. Transportation Code:                                                             
                                                        <br aria-hidden="true" />
                                                        <b>7.2.1</b>  in the case of loss of, damage or delay to a shipment, the weight to
                                                        be used in determining Carrier’s limit of liability shall be the weight
                                                        which is used to determine the charge for carriage of such shipment; and
                                                        <br aria-hidden="true" />
                                                        <b>7.2.2</b> in the case of loss of, damage or delay to a part of a shipment, the
                                                        shipment weight in 7.2.1 shall be prorated to the packages covered by
                                                        the same air waybill whose value is affected by the loss, damage or delay.
                                                        The weight applicable in the case of loss or damage to one or more
                                                        articles in a package shall be the weight of the entire package.
                                                        <br aria-hidden="true" />
                                                        <b>8</b> Any exclusion or limitation of liability applicable to Carrier shall
                                                        apply to Carrier’s agents, employees, and representatives and to any
                                                        person whose aircraft or equipment is used by Carrier for carriage and
                                                        such person’s agents, employees and representatives.                                                             
                                                        <br aria-hidden="true" />
                                                        <b>9</b> Carrier undertakes to complete the carriage with reasonable dispatch.
                                                        Where permitted by applicable laws, tariffs and government regulations,
                                                        Carrier may use alternativecarriers, aircraft or modes of transport
                                                        without notice but with due regard to the interests of the shipper. Carrier
                                                        is authorized by the shipper to select the routing and all intermediate
                                                        stopping places that it deems appropriate or to change or deviate from
                                                        the routing shown on the face hereof.                                                             
                                                        <br aria-hidden="true" />
                                                        <b>10</b> Receipt by the person entitled to delivery of the cargo without
                                                        complaint shall be prima facie evidence that the cargo has been delivered
                                                        in good condition and in accordance with the contract of carriage.
                                                        <br aria-hidden="true" />
                                                        <b>10.1</b> In the case of loss of, damage or delay to cargo a written complaint
                                                        must be made to Carrier by the person entitled to delivery. Such
                                                        complaint must be made:
                                                        <br aria-hidden="true" />
                                                        <b>10.1.1</b> in the case of damage to the cargo, immediately after discovery
                                                        of the damage and at the latest within 14 days from the date of receipt of
                                                        the cargo;                                                             
                                                        <br aria-hidden="true" />
                                                        <b>10.1.2</b> in the case of delay, within 21 days from the date on which the
                                                        cargo was placed at the disposal of the person entitled to delivery. 
                                                        <br aria-hidden="true" />
                                                        <b>10.1.3</b>  in the case of non-delivery of the cargo, within 120 days from the
                                                        date of issue of the air waybill, or if an air waybill has not been issued,
                                                        within 120 days from the date of receipt of the cargo for transportation
                                                        by the Carrier.                                                                 
                                                        <br aria-hidden="true" />
                                                        <b>10.2</b>  Such complaint may be made to the Carrier whose air waybill was
                                                        used, or to the first Carrier or to the last Carrier or to the Carrier, which
                                                        performed the carriage during which the loss, damage or delay took
                                                        place.                                                             
                                                        <br aria-hidden="true" />
                                                        <b>10.3</b>  Unless a written complaint is made within the time limits specified
                                                        in 10.1 no action may be brought against Carrier.                                                                                                  
                                                        <br aria-hidden="true" />
                                                        <b>10.4</b>  Any rights to damages against Carrier shall be extinguished unless
                                                        an action is brought within two years from the date of arrival at the
                                                        destination, or from the date on which the aircraft ought to have arrived,
                                                        or from the date on which the carriage stopped.
                                                        <br aria-hidden="true" />
                                                        <b>11</b> Shipper shall comply with all applicable laws and government
                                                        regulations of any country to or from which the cargo may be carried,
                                                        including those relating to the packing, carriage or delivery of the cargo,
                                                        and shall furnish such information and attach such
                                                        documents to the air waybill as may be necessary to comply with such
                                                        laws and regulations. Carrier is not liable to shipper and shipper shall
                                                        indemnify Carrier for loss or expense due to shipper’s failure to comply
                                                        with this provision.
                                                        <br aria-hidden="true" />
                                                        <b>12</b>  No agent, employee or representative of Carrier has authority to alter,
                                                        modify or waive any provisions of this contract.                            
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
    @endif
</body>
</html>