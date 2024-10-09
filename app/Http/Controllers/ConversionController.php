<?php

namespace App\Http\Controllers;

use App\AirwayBills;
use App\WayBillAddress;
use App\ConsignmentData;
use App\Agent;
use App\PaymentInfo;
use App\OtherCharge;
use App\OtherCustomInformation;
use Illuminate\Http\Request;
use DOMDocument;

class ConversionController extends Controller
{
    public function WayBillConversion($awb_id = 1070525)
    {
        // Fetch data from the database (this is just sample data for now)
        $waybill_data = AirwayBills::where([['id', $awb_id]])->first()->toArray();
        $waybill_address = WayBillAddress::where([['awb_id', $awb_id]])->limit(1)->first()->toArray();
        $consignment_data = ConsignmentData::where([['awb_id', $awb_id]])->limit(1)->first()->toArray();
        $agent_details = Agent::where('user_id', 1)->limit(1)->first()->toArray();
        $payment_details = PaymentInfo::where('awb_id', $awb_id)->limit(1)->first()->toArray();
        $other_charges = OtherCharge::where('awb_id', $awb_id)->limit(1)->get()->toArray();
        $custom_info = OtherCustomInformation::where('awb_id', $awb_id)->get()->toArray();
        // echo "<pre>";
        // print_r(json_decode($waybill_data['special_handling_info'],true));
        // echo "</pre>";
        // die();
        $utc_current_date = gmdate("Y-m-d H:i:s");
        $time = time();
        // Start conversion to XML
        $xml = new DOMDocument('1.0', 'UTF-8');
        $xml->formatOutput = true;

        // Create root element
        $waybill = $xml->createElementNS('iata:waybill:1', 'ns2:Waybill');
        $waybill->setAttribute('xmlns', 'iata:datamodel:5');
        $waybill->setAttribute('xmlns:ns2', 'iata:waybill:1');

        // Message Header Document
        $messageHeaderDocument = $xml->createElement('ns2:MessageHeaderDocument');
        $waybill->appendChild($messageHeaderDocument);
        $messageHeaderDocument->appendChild($xml->createElement('ID', $waybill_data['awb_code'] . '-' . $waybill_data['id'] . '_' . $time));
        $messageHeaderDocument->appendChild($xml->createElement('Name', 'Air Waybill'));
        $messageHeaderDocument->appendChild($xml->createElement('TypeCode', '740'));
        $messageHeaderDocument->appendChild($xml->createElement('IssueDateTime', $utc_current_date));
        $messageHeaderDocument->appendChild($xml->createElement('PurposeCode', 'Creation'));
        $messageHeaderDocument->appendChild($xml->createElement('VersionID', '5.00'));

        // SenderParty
        $senderParty1 = $xml->createElement('SenderParty');
        $senderParty1->appendChild($xml->createElement('PrimaryID', 'REUAGT82INKN/BLR01'));
        $senderParty1->firstChild->setAttribute('schemeID', 'P');
        $messageHeaderDocument->appendChild($senderParty1);

        $senderParty2 = $xml->createElement('SenderParty');
        $senderParty2->appendChild($xml->createElement('PrimaryID', 'KUEHNENAGELAGT'));
        $senderParty2->firstChild->setAttribute('schemeID', 'C');
        $messageHeaderDocument->appendChild($senderParty2);

        // RecipientParty
        $recipientParty1 = $xml->createElement('RecipientParty');
        $recipientParty1->appendChild($xml->createElement('PrimaryID', 'REUAIR08AFR'));
        $recipientParty1->firstChild->setAttribute('schemeID', 'P');
        $messageHeaderDocument->appendChild($recipientParty1);

        $recipientParty2 = $xml->createElement('RecipientParty');
        $recipientParty2->appendChild($xml->createElement('PrimaryID', 'REUAIR08AFR'));
        $recipientParty2->firstChild->setAttribute('schemeID', 'C');
        $messageHeaderDocument->appendChild($recipientParty2);

        // Business Header Document
        $businessHeaderDocument = $xml->createElement('ns2:BusinessHeaderDocument');
        $waybill->appendChild($businessHeaderDocument);

        $businessHeaderDocument->appendChild($xml->createElement('ID', $waybill_data['awb_code'] . '-' . $waybill_data['id']));

        // Included Header Note
        $includedHeaderNote = $xml->createElement('IncludedHeaderNote');
        $includedHeaderNote->appendChild($xml->createElement('ContentCode', 'D'));
        $includedHeaderNote->appendChild($xml->createElement('Content', 'Direct'));
        $businessHeaderDocument->appendChild($includedHeaderNote);

        // Signatory Consignor Authentication
        $signatoryConsignorAuth = $xml->createElement('SignatoryConsignorAuthentication');
        $signatoryConsignorAuth->appendChild($xml->createElement('Signatory', $agent_details['agent_issue_sign']));
        $businessHeaderDocument->appendChild($signatoryConsignorAuth);

        // Signatory Carrier Authentication
        $signatoryCarrierAuth = $xml->createElement('SignatoryCarrierAuthentication');
        $signatoryCarrierAuth->appendChild($xml->createElement('ActualDateTime', $utc_current_date));
        $signatoryCarrierAuth->appendChild($xml->createElement('Signatory', $agent_details['agent_name']));

        $issueAuthLocation = $xml->createElement('IssueAuthenticationLocation');
        $issueAuthLocation->appendChild($xml->createElement('Name', $agent_details['agent_issue_loc_code']));
        $signatoryCarrierAuth->appendChild($issueAuthLocation);
        $businessHeaderDocument->appendChild($signatoryCarrierAuth);

        // Master Consignment
        $masterConsignment = $xml->createElement('ns2:MasterConsignment');
        $waybill->appendChild($masterConsignment);

        $masterConsignment->appendChild($xml->createElement('NilCarriageValueIndicator', 'true'));
        $masterConsignment->appendChild($xml->createElement('NilCustomsValueIndicator', 'true'));
        $masterConsignment->appendChild($xml->createElement('NilInsuranceValueIndicator', 'true'));
        $masterConsignment->appendChild($xml->createElement('TotalChargePrepaidIndicator', $payment_details['payment_type']));
        $masterConsignment->appendChild($xml->createElement('TotalDisbursementPrepaidIndicator', $other_charges[0]['payment_type']));
        $masterConsignment->appendChild($xml->createElement('IncludedTareGrossWeightMeasure', $consignment_data['gross_weight']))->setAttribute('unitCode', $consignment_data['weight_code']);
        if (!empty($waybill_data['total_volume']))
            $masterConsignment->appendChild($xml->createElement('GrossVolumeMeasure', $waybill_data['total_volume']))->setAttribute('unitCode', $waybill_data['dimention_unit']);
        $masterConsignment->appendChild($xml->createElement('TotalPieceQuantity', '7'));

        // Consignor Party
        $consignor_street_name = $waybill_address['ship_address'] . (!empty($waybill_address['ship_address_line_2']) ? ',' . $waybill_address['ship_address_line_2'] : '');
        $consignorParty = $xml->createElement('ConsignorParty');
        $consignorParty->appendChild($xml->createElement('Name', $waybill_address['ship_name']));
        $consignorParty->appendChild($xml->createElement('AccountID', $waybill_address['ship_account']));
        $postalStructuredAddress1 = $xml->createElement('PostalStructuredAddress');
        $postalStructuredAddress1->appendChild($xml->createElement('PostcodeCode', $waybill_address['ship_post_code']));
        $postalStructuredAddress1->appendChild($xml->createElement('StreetName', $consignor_street_name));
        $postalStructuredAddress1->appendChild($xml->createElement('CityName', $waybill_address['ship_city']));
        $postalStructuredAddress1->appendChild($xml->createElement('CountryID', $waybill_address['ship_country']));
        // $postalStructuredAddress1->appendChild($xml->createElement('CountrySubDivisionName', $waybill_address['ship_state']));
        $consignorParty->appendChild($postalStructuredAddress1);

        if (!empty($waybill_address['ship_phone']) || !empty($waybill_address['ship_fax']) || !empty($waybill_address['ship_telex'])) {
            $DefinedTradeContact = $xml->createElement('DefinedTradeContact');
            if (!empty($waybill_address['ship_phone'])) {
                $DirectTelephoneCommunication = $xml->createElement('DirectTelephoneCommunication');
                $DirectTelephoneCommunication->appendChild($xml->createElement('CompleteNumber', $waybill_address['ship_phone']));
                $DefinedTradeContact->appendChild($DirectTelephoneCommunication);
            }
            if (!empty($waybill_address['ship_fax'])) {
                $FaxCommunication = $xml->createElement('FaxCommunication');
                $FaxCommunication->appendChild($xml->createElement('CompleteNumber', $waybill_address['ship_fax']));
                $DefinedTradeContact->appendChild($FaxCommunication);
            }
            if ($waybill_address['ship_telex']) {
                $TelexCommunication = $xml->createElement('TelexCommunication');
                $TelexCommunication->appendChild($xml->createElement('CompleteNumber', $waybill_address['ship_telex']));
                $DefinedTradeContact->appendChild($TelexCommunication);
            }
            $consignorParty->appendChild($DefinedTradeContact);
        }
        $masterConsignment->appendChild($consignorParty);

        // Consignee Party
        $consignee_street_name = $waybill_address['cons_address'] . (!empty($waybill_address['cons_address_line_2']) ? ',' . $waybill_address['cons_address_line_2'] : '');
        $consigneeParty = $xml->createElement('ConsigneeParty');
        $consigneeParty->appendChild($xml->createElement('Name', $waybill_address['cons_name']));
        $consigneeParty->appendChild($xml->createElement('AccountID', $waybill_address['cons_account']));
        $postalStructuredAddress2 = $xml->createElement('PostalStructuredAddress');
        $postalStructuredAddress2->appendChild($xml->createElement('PostcodeCode', $waybill_address['cons_post_code']));
        $postalStructuredAddress2->appendChild($xml->createElement('StreetName', $consignee_street_name));
        $postalStructuredAddress2->appendChild($xml->createElement('CityName', 'Paris'));
        $postalStructuredAddress2->appendChild($xml->createElement('CountryID', $waybill_address['cons_country']));
        // $postalStructuredAddress2->appendChild($xml->createElement('CountrySubDivisionName', $waybill_address['cons_state']));
        $consigneeParty->appendChild($postalStructuredAddress2);

        if (!empty($waybill_address['cons_phone']) || !empty($waybill_address['cons_fax']) || !empty($waybill_address['cons_telex'])) {
            $DefinedTradeContact = $xml->createElement('DefinedTradeContact');
            if (!empty($waybill_address['cons_phone'])) {
                $DirectTelephoneCommunication = $xml->createElement('DirectTelephoneCommunication');
                $DirectTelephoneCommunication->appendChild($xml->createElement('CompleteNumber', $waybill_address['cons_phone']));
                $DefinedTradeContact->appendChild($DirectTelephoneCommunication);
            }
            if (!empty($waybill_address['cons_fax'])) {
                $FaxCommunication = $xml->createElement('FaxCommunication');
                $FaxCommunication->appendChild($xml->createElement('CompleteNumber', $waybill_address['cons_fax']));
                $DefinedTradeContact->appendChild($FaxCommunication);
            }
            if ($waybill_address['cons_telex']) {
                $TelexCommunication = $xml->createElement('TelexCommunication');
                $TelexCommunication->appendChild($xml->createElement('CompleteNumber', $waybill_address['cons_telex']));
                $DefinedTradeContact->appendChild($TelexCommunication);
            }
            $consigneeParty->appendChild($DefinedTradeContact);
        }
        $masterConsignment->appendChild($consigneeParty);

        // Freight Forwarder Party
        $freightForwarderParty = $xml->createElement('FreightForwarderParty');
        $freightForwarderParty->appendChild($xml->createElement('Name', $agent_details['agent_name']));
        $freightForwarderParty->appendChild($xml->createElement('CargoAgentID', $agent_details['iata_agent_code']));
        $freightForwarderAddress = $xml->createElement('FreightForwarderAddress');
        $freightForwarderAddress->appendChild($xml->createElement('PostcodeCode', $agent_details['agent_pincode']));
        $freightForwarderAddress->appendChild($xml->createElement('StreetName', $agent_details['agent_address']));
        $freightForwarderAddress->appendChild($xml->createElement('CityName', $agent_details['agent_city']));
        $freightForwarderAddress->appendChild($xml->createElement('CountryID', $agent_details['agent_country'])); //
        $freightForwarderParty->appendChild($freightForwarderAddress);

        $DefinedTradeContact = $xml->createElement('DefinedTradeContact');
        $DirectTelephoneCommunication = $xml->createElement('DirectTelephoneCommunication');
        $DirectTelephoneCommunication->appendChild($xml->createElement('CompleteNumber', $agent_details['agent_contact_person_phone']));
        $DefinedTradeContact->appendChild($DirectTelephoneCommunication);
        $URIEmailCommunication = $xml->createElement('URIEmailCommunication');
        $URIEmailCommunication->appendChild($xml->createElement('URIID', $agent_details['agent_contact_person_email']));
        $DefinedTradeContact->appendChild($URIEmailCommunication);
        $freightForwarderParty->appendChild($DefinedTradeContact);
        $masterConsignment->appendChild($freightForwarderParty);

        // Origin Location
        $originLocation = $xml->createElement('OriginLocation');
        $originLocation->appendChild($xml->createElement('ID', $waybill_data['departure_airport']));
        $masterConsignment->appendChild($originLocation);

        // Final Destination Location
        $finalDestinationLocation = $xml->createElement('FinalDestinationLocation');
        $finalDestinationLocation->appendChild($xml->createElement('ID', $waybill_data['destination_airport']));
        $masterConsignment->appendChild($finalDestinationLocation);

        // ===========First route info=============
        if (!empty($waybill_data['by']) && !empty($waybill_data['flight'])) {
            // Create the SpecifiedLogisticsTransportMovement element
            $specifiedLogisticsTransportMovement = $xml->createElement('SpecifiedLogisticsTransportMovement');
            $specifiedLogisticsTransportMovement->appendChild($xml->createElement('StageCode', 'Main-Carriage'));
            $specifiedLogisticsTransportMovement->appendChild($xml->createElement('ModeCode', 4));
            $specifiedLogisticsTransportMovement->appendChild($xml->createElement('Mode', 'AIR TRANSPORT'));
            $specifiedLogisticsTransportMovement->appendChild($xml->createElement('ID', $waybill_data['by'] . $waybill_data['flight']));
            $specifiedLogisticsTransportMovement->appendChild($xml->createElement('SequenceNumeric', '1'));

            // Used Logistics Transport Means
            $usedLogisticsTransportMeans = $xml->createElement('UsedLogisticsTransportMeans');
            $usedLogisticsTransportMeans->appendChild($xml->createElement('Name', $waybill_data['by']));
            $specifiedLogisticsTransportMovement->appendChild($usedLogisticsTransportMeans);

            // Arrival Event
            $arrivalEvent = $xml->createElement('ArrivalEvent');
            $occurrenceArrivalLocation = $xml->createElement('OccurrenceArrivalLocation');
            $occurrenceArrivalLocation->appendChild($xml->createElement('ID', $waybill_data['to']));
            $occurrenceArrivalLocation->appendChild($xml->createElement('TypeCode', 'Airport'));
            $arrivalEvent->appendChild($occurrenceArrivalLocation);
            $specifiedLogisticsTransportMovement->appendChild($arrivalEvent);

            // Departure Event
            $departureEvent = $xml->createElement('DepartureEvent');
            $departureEvent->appendChild($xml->createElement('ScheduledOccurrenceDateTime', $waybill_data['date']));
            $OccurrenceDepartureLocation = $xml->createElement('OccurrenceDepartureLocation');
            $OccurrenceDepartureLocation->appendChild($xml->createElement('ID', $waybill_data['from']));
            $OccurrenceDepartureLocation->appendChild($xml->createElement('TypeCode', 'Airport'));
            $arrivalEvent->appendChild($OccurrenceDepartureLocation);
            $specifiedLogisticsTransportMovement->appendChild($departureEvent);

            $masterConsignment->appendChild($specifiedLogisticsTransportMovement);
            // =========== End First route info=============
        }
        if (!empty($waybill_data['by_2']) && !empty($waybill_data['flight_2'])) {
            // ===========Second route info=============
            $specifiedLogisticsTransportMovement = $xml->createElement('SpecifiedLogisticsTransportMovement');
            $specifiedLogisticsTransportMovement->appendChild($xml->createElement('StageCode', 'Main-Carriage'));
            $specifiedLogisticsTransportMovement->appendChild($xml->createElement('ModeCode', 4));
            $specifiedLogisticsTransportMovement->appendChild($xml->createElement('Mode', 'AIR TRANSPORT'));
            $specifiedLogisticsTransportMovement->appendChild($xml->createElement('ID', $waybill_data['by_2'] . $waybill_data['flight_2']));
            $specifiedLogisticsTransportMovement->appendChild($xml->createElement('SequenceNumeric', '2'));

            // Used Logistics Transport Means
            $usedLogisticsTransportMeans = $xml->createElement('UsedLogisticsTransportMeans');
            $usedLogisticsTransportMeans->appendChild($xml->createElement('Name', $waybill_data['by_2']));
            $specifiedLogisticsTransportMovement->appendChild($usedLogisticsTransportMeans);

            // Arrival Event
            $arrivalEvent = $xml->createElement('ArrivalEvent');
            $occurrenceArrivalLocation = $xml->createElement('OccurrenceArrivalLocation');
            $occurrenceArrivalLocation->appendChild($xml->createElement('ID', $waybill_data['to_2']));
            $occurrenceArrivalLocation->appendChild($xml->createElement('TypeCode', 'Airport'));
            $arrivalEvent->appendChild($occurrenceArrivalLocation);
            $specifiedLogisticsTransportMovement->appendChild($arrivalEvent);

            // Departure Event
            $departureEvent = $xml->createElement('DepartureEvent');
            $departureEvent->appendChild($xml->createElement('ScheduledOccurrenceDateTime', $waybill_data['date_2']));
            $OccurrenceDepartureLocation = $xml->createElement('OccurrenceDepartureLocation');
            $OccurrenceDepartureLocation->appendChild($xml->createElement('ID', $waybill_data['to']));
            $OccurrenceDepartureLocation->appendChild($xml->createElement('TypeCode', 'Airport'));
            $arrivalEvent->appendChild($OccurrenceDepartureLocation);
            $specifiedLogisticsTransportMovement->appendChild($departureEvent);

            $masterConsignment->appendChild($specifiedLogisticsTransportMovement);
            // ===========End Second route info=============
        }
        if (!empty($waybill_data['by_3']) && !empty($waybill_data['flight_3'])) {
            // ===========Third route info=============
            $specifiedLogisticsTransportMovement = $xml->createElement('SpecifiedLogisticsTransportMovement');
            $specifiedLogisticsTransportMovement->appendChild($xml->createElement('StageCode', 'Main-Carriage'));
            $specifiedLogisticsTransportMovement->appendChild($xml->createElement('ModeCode', 4));
            $specifiedLogisticsTransportMovement->appendChild($xml->createElement('Mode', 'AIR TRANSPORT'));
            $specifiedLogisticsTransportMovement->appendChild($xml->createElement('ID', $waybill_data['by_3'] . $waybill_data['flight_3']));
            $specifiedLogisticsTransportMovement->appendChild($xml->createElement('SequenceNumeric', '3'));

            // Used Logistics Transport Means
            $usedLogisticsTransportMeans = $xml->createElement('UsedLogisticsTransportMeans');
            $usedLogisticsTransportMeans->appendChild($xml->createElement('Name', $waybill_data['by_3']));
            $specifiedLogisticsTransportMovement->appendChild($usedLogisticsTransportMeans);

            // Arrival Event
            $arrivalEvent = $xml->createElement('ArrivalEvent');
            $occurrenceArrivalLocation = $xml->createElement('OccurrenceArrivalLocation');
            $occurrenceArrivalLocation->appendChild($xml->createElement('ID', $waybill_data['to_3']));
            $occurrenceArrivalLocation->appendChild($xml->createElement('TypeCode', 'Airport'));
            $arrivalEvent->appendChild($occurrenceArrivalLocation);
            $specifiedLogisticsTransportMovement->appendChild($arrivalEvent);

            // Departure Event
            $departureEvent = $xml->createElement('DepartureEvent');
            $departureEvent->appendChild($xml->createElement('ScheduledOccurrenceDateTime', $waybill_data['date_3']));
            $OccurrenceDepartureLocation = $xml->createElement('OccurrenceDepartureLocation');
            $OccurrenceDepartureLocation->appendChild($xml->createElement('ID', $waybill_data['to_2']));
            $OccurrenceDepartureLocation->appendChild($xml->createElement('TypeCode', 'Airport'));
            $arrivalEvent->appendChild($OccurrenceDepartureLocation);
            $specifiedLogisticsTransportMovement->appendChild($departureEvent);

            $masterConsignment->appendChild($specifiedLogisticsTransportMovement);
            // ===========End Third route info=============
        }

        $special_handling_info = json_decode($waybill_data['special_handling_info'], true);
        // Handling SPH Instructions
        for ($i = 0; $i < sizeof($special_handling_info); $i++) {
            $handlingSPHInstructions = $xml->createElement('HandlingSPHInstructions');
            $handlingSPHInstructions->appendChild($xml->createElement('DescriptionCode', $special_handling_info[$i]));
            $masterConsignment->appendChild($handlingSPHInstructions);
        }

        if (!empty($waybill_data['special_service_request'])) {
            // Handling SSR Instructions
            $handlingSSRInstructions = $xml->createElement('HandlingSSRInstructions');
            $handlingSSRInstructions->appendChild($xml->createElement('Description', $waybill_data['special_service_request']));
            $masterConsignment->appendChild($handlingSSRInstructions);
        }
        //also notify
        if (!empty($waybill_address['also_name'])) {
            $consignee_street_name = $waybill_address['also_address'] . (!empty($waybill_address['also_address_line_2']) ? ',' . $waybill_address['also_address_line_2'] : '');
            $AssociatedParty = $xml->createElement('AssociatedParty');
            $AssociatedParty->appendChild($xml->createElement('Name', $waybill_address['also_name']));

            $roleCode = $xml->createElement('RoleCode', 'NI');
            $roleCode->setAttribute('listID', '3035');
            $roleCode->setAttribute('listAgencyID', '6');
            $roleCode->setAttribute('listVersionID', 'D09A');
            $AssociatedParty->appendChild($roleCode);

            $postalStructuredAddress3 = $xml->createElement('PostalStructuredAddress');
            $postalStructuredAddress3->appendChild($xml->createElement('PostcodeCode', $waybill_address['also_post_code']));
            $postalStructuredAddress3->appendChild($xml->createElement('StreetName', $consignee_street_name));
            $postalStructuredAddress3->appendChild($xml->createElement('CityName', 'Paris'));
            $postalStructuredAddress3->appendChild($xml->createElement('CountryID', $waybill_address['also_country']));
            // $postalStructuredAddress3->appendChild($xml->createElement('CountrySubDivisionName', $waybill_address['also_state']));
            $AssociatedParty->appendChild($postalStructuredAddress3);

            if (!empty($waybill_address['also_phone']) || !empty($waybill_address['also_fax']) || !empty($waybill_address['also_telex'])) {
                $DefinedTradeContact = $xml->createElement('DefinedTradeContact');
                if (!empty($waybill_address['also_phone'])) {
                    $DirectTelephoneCommunication = $xml->createElement('DirectTelephoneCommunication');
                    $DirectTelephoneCommunication->appendChild($xml->createElement('CompleteNumber', $waybill_address['also_phone']));
                    $DefinedTradeContact->appendChild($DirectTelephoneCommunication);
                }
                if (!empty($waybill_address['also_fax'])) {
                    $FaxCommunication = $xml->createElement('FaxCommunication');
                    $FaxCommunication->appendChild($xml->createElement('CompleteNumber', $waybill_address['also_fax']));
                    $DefinedTradeContact->appendChild($FaxCommunication);
                }
                if ($waybill_address['also_telex']) {
                    $TelexCommunication = $xml->createElement('TelexCommunication');
                    $TelexCommunication->appendChild($xml->createElement('CompleteNumber', $waybill_address['also_telex']));
                    $DefinedTradeContact->appendChild($TelexCommunication);
                }
                $AssociatedParty->appendChild($DefinedTradeContact);
            }
            $masterConsignment->appendChild($AssociatedParty);
        }
        if (!empty($waybill_data['other_service_information'])) {
            // Handling SSR Instructions
            $HandlingOSIInstructions = $xml->createElement('HandlingOSIInstructions');
            $HandlingOSIInstructions->appendChild($xml->createElement('Description', $waybill_data['other_service_information']));
            $masterConsignment->appendChild($HandlingOSIInstructions);
        }
        if (!empty($waybill_data['letter_credit']) && !empty($waybill_data['accounting_information'])) {
            // Included Accounting Note
            $includedAccountingNote = $xml->createElement('IncludedAccountingNote');
            $includedAccountingNote->appendChild($xml->createElement('ContentCode', $waybill_data['letter_credit']));
            $includedAccountingNote->appendChild($xml->createElement('Content', $waybill_data['accounting_information']));
            $masterConsignment->appendChild($includedAccountingNote);
        }
        for ($i = 0; $i < sizeof($custom_info); $i++) {
            $IncludedCustomsNote = $xml->createElement('IncludedCustomsNote');
            $IncludedCustomsNote->appendChild($xml->createElement('ContentCode', $custom_info[$i]['custom_info_identifier']));
            $IncludedCustomsNote->appendChild($xml->createElement('Content', $custom_info[$i]['supplementary_info']));
            $IncludedCustomsNote->appendChild($xml->createElement('SubjectCode', $custom_info[$i]['info_identifier']));
            $IncludedCustomsNote->appendChild($xml->createElement('CountryID', $custom_info[$i]['country_code']));
            $masterConsignment->appendChild($IncludedCustomsNote);
        }
        if ($waybill_data['customs_origin_code']) {
            $AssociatedConsignmentCustomsProcedure = $xml->createElement('AssociatedConsignmentCustomsProcedure');
            $AssociatedConsignmentCustomsProcedure->appendChild($xml->createElement('GoodsStatusCode', $waybill_data['customs_origin_code']));
            $masterConsignment->appendChild($AssociatedConsignmentCustomsProcedure);
        }

        // Applicable Origin Currency Exchange
        $applicableOriginCurrencyExchange = $xml->createElement('ApplicableOriginCurrencyExchange');
        $applicableOriginCurrencyExchange->appendChild($xml->createElement('SourceCurrencyCode', 'INR'));
        $masterConsignment->appendChild($applicableOriginCurrencyExchange);

        if ($payment_details['payment_type']) {
            $ApplicableLogisticsServiceCharge = $xml->createElement('ApplicableLogisticsServiceCharge');
            $ApplicableLogisticsServiceCharge->appendChild($xml->createElement('TransportPaymentMethodCode', $payment_details['payment_type']));
            $masterConsignment->appendChild($ApplicableLogisticsServiceCharge);
        }

        // Applicable Logistics Allowance Charge (Multiple Entries)
        $allowanceCharges = [
            ['ID' => 'MC', 'ActualAmount' => '4585.00'],
            ['ID' => 'CG', 'ActualAmount' => '190.00'],
            ['ID' => 'MA', 'ActualAmount' => '1834.00'],
            ['ID' => 'MY', 'ActualAmount' => '102704.00'],
            ['ID' => 'SC', 'ActualAmount' => '14672.00'],
        ];

        foreach ($allowanceCharges as $charge) {
            $applicableLogisticsAllowanceCharge = $xml->createElement('ApplicableLogisticsAllowanceCharge');
            $applicableLogisticsAllowanceCharge->appendChild($xml->createElement('ID', $charge['ID']));
            $applicableLogisticsAllowanceCharge->appendChild($xml->createElement('PrepaidIndicator', 'P'));
            $applicableLogisticsAllowanceCharge->appendChild($xml->createElement('PartyTypeCode', 'C'));
            $applicableAmount = $xml->createElement('ActualAmount', $charge['ActualAmount']);
            $applicableAmount->setAttribute('currencyID', 'INR');
            $applicableLogisticsAllowanceCharge->appendChild($applicableAmount);
            $masterConsignment->appendChild($applicableLogisticsAllowanceCharge);
        }

        // Applicable Rating
        $applicableRating = $xml->createElement('ApplicableRating');
        $applicableRating->appendChild($xml->createElement('TypeCode', 'F'));

        $totalChargeAmount = $xml->createElement('TotalChargeAmount', '280602.00');
        $totalChargeAmount->setAttribute('currencyID', 'INR');
        $applicableRating->appendChild($totalChargeAmount);

        // Included Master Consignment Item
        $includedMasterConsignmentItem = $xml->createElement('IncludedMasterConsignmentItem');
        $includedMasterConsignmentItem->appendChild($xml->createElement('SequenceNumeric', '1'));
        $includedMasterConsignmentItem->appendChild($xml->createElement('TypeCode', ''));
        $includedMasterConsignmentItem->appendChild($xml->createElement('GrossWeightMeasure', '1834.0'))->setAttribute('unitCode', 'KGM');
        $includedMasterConsignmentItem->appendChild($xml->createElement('GrossVolumeMeasure', '4.299'))->setAttribute('unitCode', 'MTQ');
        $includedMasterConsignmentItem->appendChild($xml->createElement('PackageQuantity', '7'));
        $includedMasterConsignmentItem->appendChild($xml->createElement('PieceQuantity', '7'));
        $includedMasterConsignmentItem->appendChild($xml->createElement('Information', 'NDA'));

        // Nature Identification Transport Cargo
        $natureIdentificationTransportCargo = $xml->createElement('NatureIdentificationTransportCargo');
        $natureIdentificationTransportCargo->appendChild($xml->createElement('Identification', 'CONSOLIDATION AS PER ATTACHED MANIFEST'));
        $includedMasterConsignmentItem->appendChild($natureIdentificationTransportCargo);

        // Applicable Freight Rate Service Charge
        $applicableFreightRateServiceCharge = $xml->createElement('ApplicableFreightRateServiceCharge');
        $applicableFreightRateServiceCharge->appendChild($xml->createElement('CategoryCode', 'Q'));
        $applicableFreightRateServiceCharge->appendChild($xml->createElement('ChargeableWeightMeasure', '1834.0'))->setAttribute('unitCode', 'KGM');
        $applicableFreightRateServiceCharge->appendChild($xml->createElement('AppliedRate', '153.00'));
        $applicableAppliedAmount = $xml->createElement('AppliedAmount', '280602.00');
        $applicableAppliedAmount->setAttribute('currencyID', 'INR');
        $applicableFreightRateServiceCharge->appendChild($applicableAppliedAmount);
        $includedMasterConsignmentItem->appendChild($applicableFreightRateServiceCharge);

        // Append IncludedMasterConsignmentItem to ApplicableRating
        $applicableRating->appendChild($includedMasterConsignmentItem);
        $masterConsignment->appendChild($applicableRating);

        // Applicable Total Rating
        $applicableTotalRating = $xml->createElement('ApplicableTotalRating');
        $applicableTotalRating->appendChild($xml->createElement('TypeCode', 'F'));

        $applicablePrepaidCollectMonetarySummation = $xml->createElement('ApplicablePrepaidCollectMonetarySummation');
        $applicablePrepaidCollectMonetarySummation->appendChild($xml->createElement('PrepaidIndicator', 'P'));
        $applicablePrepaidCollectMonetarySummation->appendChild($xml->createElement('WeightChargeTotalAmount', '280602.00'))->setAttribute('currencyID', 'INR');
        $applicablePrepaidCollectMonetarySummation->appendChild($xml->createElement('ValuationChargeTotalAmount', '0.00'))->setAttribute('currencyID', 'INR');
        $applicablePrepaidCollectMonetarySummation->appendChild($xml->createElement('TaxTotalAmount', '0.00'))->setAttribute('currencyID', 'INR');
        $applicablePrepaidCollectMonetarySummation->appendChild($xml->createElement('AgentTotalDuePayableAmount', '0.00'))->setAttribute('currencyID', 'INR');
        $applicablePrepaidCollectMonetarySummation->appendChild($xml->createElement('CarrierTotalDuePayableAmount', '123985.00'))->setAttribute('currencyID', 'INR');
        $applicablePrepaidCollectMonetarySummation->appendChild($xml->createElement('GrandTotalAmount', '404587.00'))->setAttribute('currencyID', 'INR');
        $applicableTotalRating->appendChild($applicablePrepaidCollectMonetarySummation);
        $masterConsignment->appendChild($applicableTotalRating);

        // Append to the root element
        $xml->appendChild($waybill);

        // Prepare response as an XML download
        return response($xml->saveXML(), 200)
            ->header('Content-Type', 'application/xml');
    }
    public function check()
    {
        echo gmdate("Y-m-d H:i:s");
    }
}