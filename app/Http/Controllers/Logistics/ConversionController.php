<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;

use App\AirwayBills;
use App\HousewayBills;
use App\WayBillAddress;
use App\ConsignmentData;
use App\Agent;
use App\PaymentInfo;
use App\OtherCharge;
use App\OtherCustomInformation;
use App\Ams;
use App\Airline;
use App\Company;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use DOMDocument;

class ConversionController extends Controller
{
    // Builds the SpecifiedLogisticsTransportMovement element for one leg of
    // a (up to 3-leg) itinerary. Each leg's departure location is the
    // previous leg's arrival location (there's no separate from_2/from_3
    // column), so route 1 departs from $data['from'] while routes 2 and 3
    // depart from the previous route's 'to'/'to_2'. Returns null if this
    // leg has no by/flight (the route wasn't used).
    private function buildRouteMovementElement(DOMDocument $xml, array $data, int $routeNumber)
    {
        $suffix = $routeNumber === 1 ? '' : '_' . $routeNumber;
        $by = $data['by' . $suffix] ?? null;
        $flight = $data['flight' . $suffix] ?? null;
        if (empty($by) || empty($flight)) {
            return null;
        }

        $arrivalField = 'to' . $suffix;
        $departureField = $routeNumber === 1 ? 'from' : ($routeNumber === 2 ? 'to' : 'to_2');
        $dateField = 'date' . $suffix;

        $specifiedLogisticsTransportMovement = $xml->createElement('ram:SpecifiedLogisticsTransportMovement');
        $specifiedLogisticsTransportMovement->appendChild($xml->createElement('ram:StageCode', 'Main-Carriage'));
        $specifiedLogisticsTransportMovement->appendChild($xml->createElement('ram:ModeCode', 4));
        $specifiedLogisticsTransportMovement->appendChild($xml->createElement('ram:Mode', 'AIR TRANSPORT'));
        $specifiedLogisticsTransportMovement->appendChild($xml->createElement('ram:ID', $by . $flight));
        $specifiedLogisticsTransportMovement->appendChild($xml->createElement('ram:SequenceNumeric', (string) $routeNumber));

        // Used Logistics Transport Means
        $usedLogisticsTransportMeans = $xml->createElement('ram:UsedLogisticsTransportMeans');
        $usedLogisticsTransportMeans->appendChild($xml->createElement('ram:Name', $by));
        $specifiedLogisticsTransportMovement->appendChild($usedLogisticsTransportMeans);

        // Arrival Event
        $arrivalEvent = $xml->createElement('ram:ArrivalEvent');
        $occurrenceArrivalLocation = $xml->createElement('ram:OccurrenceArrivalLocation');
        $occurrenceArrivalLocation->appendChild($xml->createElement('ram:ID', substr($data[$arrivalField], 0, 3)));
        $occurrenceArrivalLocation->appendChild($xml->createElement('ram:TypeCode', 'Airport'));
        $arrivalEvent->appendChild($occurrenceArrivalLocation);
        $specifiedLogisticsTransportMovement->appendChild($arrivalEvent);

        // Departure Event
        $departureEvent = $xml->createElement('ram:DepartureEvent');
        $departureEvent->appendChild($xml->createElement('ram:ScheduledOccurrenceDateTime', str_replace(' ', 'T', $data[$dateField])));
        $OccurrenceDepartureLocation = $xml->createElement('ram:OccurrenceDepartureLocation');
        $OccurrenceDepartureLocation->appendChild($xml->createElement('ram:ID', substr($data[$departureField], 0, 3)));
        $OccurrenceDepartureLocation->appendChild($xml->createElement('ram:TypeCode', 'Airport'));
        $departureEvent->appendChild($OccurrenceDepartureLocation);
        $specifiedLogisticsTransportMovement->appendChild($departureEvent);

        return $specifiedLogisticsTransportMovement;
    }

    public function WayBillConversion($awb_id = "12312345678")
    {
        // Fetch data from the database (this is just sample data for now)
        $user_data = auth()->guard('user-api')->user();
        $branch_id = $user_data->branch_name;
        $waybill_data = AirwayBills::where([['id', $awb_id]])->first()->toArray();
        $waybill_address = WayBillAddress::where([['awb_id', $awb_id]])->limit(1)->first()->toArray();
        $consignment_data = ConsignmentData::where([['awb_id', $awb_id]])->limit(1)->first()->toArray();
        $agent_details = Agent::where('id', $branch_id)->limit(1)->first()->toArray();
        $payment_details = PaymentInfo::where('awb_id', $awb_id)->limit(1)->first()->toArray();
        $other_charges = OtherCharge::where('awb_id', $awb_id)->get()->toArray();
        $custom_info = OtherCustomInformation::where('awb_id', $awb_id)->get()->toArray();

        $utc_current_date = gmdate("Y-m-d H:i:s");
        $utc_current_date = str_replace(' ', 'T', $utc_current_date);
        $time = time();

        $description = $consignment_data['description'];
        $words = ['CONSOLIDATION', 'CONSOLE', 'CONSOL', 'CONSOLIDATED'];
        $found = false;
        foreach ($words as $word) {
            if (stripos($description, $word) !== false) {
                $found = true;
                break;
            }
        }
        $waybill_name = '';
        $waybill_code = '';
        if ($found || $waybill_data['consolidated_mawb'] != 'false') {
            $waybill_name = 'Master Air Waybill';
            $waybill_code = 741;
        } else {
            $waybill_name = 'Air Waybill';
            $waybill_code = 740;
        }

        // Start conversion to XML
        $xml = new DOMDocument();
        $xml->formatOutput = true;

        // Create root element
        $waybill = $xml->createElementNS('iata:waybill:1', 'rsm:Waybill');
        $waybill->setAttribute('xmlns:ram', 'iata:datamodel:3');
        $waybill->setAttribute('xmlns:rsm', 'iata:waybill:1');

        // Message Header Document
        $messageHeaderDocument = $xml->createElement('rsm:MessageHeaderDocument');
        // $messageHeaderDocument->setAttribute('xmlns:ram', 'iata:datamodel:3');
        $waybill->appendChild($messageHeaderDocument);
        $messageHeaderDocument->appendChild($xml->createElement('ram:ID', $waybill_data['awb_code'] . '-' . $waybill_data['awb_no']));
        $messageHeaderDocument->appendChild($xml->createElement('ram:Name', $waybill_name));
        $messageHeaderDocument->appendChild($xml->createElement('ram:TypeCode', $waybill_code));
        $messageHeaderDocument->appendChild($xml->createElement('ram:IssueDateTime', $utc_current_date));
        $messageHeaderDocument->appendChild($xml->createElement('ram:PurposeCode', 'Creation'));
        $messageHeaderDocument->appendChild($xml->createElement('ram:VersionID', '3.00'));

        // SenderParty
        $senderParty1 = $xml->createElement('ram:SenderParty');
        $senderParty1->appendChild($xml->createElement('ram:PrimaryID', "{$user_data->pima_address}"));
        $senderParty1->firstChild->setAttribute('schemeID', 'P');
        $messageHeaderDocument->appendChild($senderParty1);

        // RecipientParty
        $recipientParty1 = $xml->createElement('ram:RecipientParty');
        $recipientParty1->appendChild($xml->createElement('ram:PrimaryID', 'TDVSYS03GLNUNADDR'));
        $recipientParty1->firstChild->setAttribute('schemeID', 'P');
        $messageHeaderDocument->appendChild($recipientParty1);

        // Business Header Document
        $businessHeaderDocument = $xml->createElement('rsm:BusinessHeaderDocument');
        $businessHeaderDocument->setAttribute('xmlns:ram', 'iata:datamodel:3');
        $waybill->appendChild($businessHeaderDocument);

        $businessHeaderDocument->appendChild($xml->createElement('ram:ID', $waybill_data['awb_code'] . '-' . $waybill_data['awb_no']));

        // Included Header Note
        $includedHeaderNote = $xml->createElement('ram:IncludedHeaderNote');
        $includedHeaderNote->appendChild($xml->createElement('ram:ContentCode', 'D'));
        $includedHeaderNote->appendChild($xml->createElement('ram:Content', 'Direct'));
        $businessHeaderDocument->appendChild($includedHeaderNote);

        // Signatory Consignor Authentication
        $signatoryConsignorAuth = $xml->createElement('ram:SignatoryConsignorAuthentication');
        $signatoryConsignorAuth->appendChild($xml->createElement('ram:Signatory', $agent_details['agent_issue_sign']));
        $businessHeaderDocument->appendChild($signatoryConsignorAuth);

        // Signatory Carrier Authentication
        $signatoryCarrierAuth = $xml->createElement('ram:SignatoryCarrierAuthentication');
        $signatoryCarrierAuth->appendChild($xml->createElement('ram:ActualDateTime', $utc_current_date));
        $signatoryCarrierAuth->appendChild($xml->createElement('ram:Signatory', $agent_details['agent_name']));

        $issueAuthLocation = $xml->createElement('ram:IssueAuthenticationLocation');
        $issueAuthLocation->appendChild($xml->createElement('ram:Name', $agent_details['agent_issue_loc_code']));
        $signatoryCarrierAuth->appendChild($issueAuthLocation);
        $businessHeaderDocument->appendChild($signatoryCarrierAuth);

        // Master Consignment
        $masterConsignment = $xml->createElement('rsm:MasterConsignment');
        $waybill->appendChild($masterConsignment);

        if ($payment_details['declear_value_carriage'] == 'NVD')
            $masterConsignment->appendChild($xml->createElement('ram:NilCarriageValueIndicator', 'true'));
        else {
            $masterConsignment->appendChild($xml->createElement('ram:NilCarriageValueIndicator', 'false'));
            $masterConsignment->appendChild($xml->createElement('ram:DeclaredValueForCarriageAmount', $payment_details['declear_value_carriage']))->setAttribute('currencyID', $payment_details['currency']);
        }
        if ($payment_details['declear_value_customs'] == 'NCV')
            $masterConsignment->appendChild($xml->createElement('ram:NilCustomsValueIndicator', 'true'));
        else {
            $masterConsignment->appendChild($xml->createElement('ram:NilCustomsValueIndicator', 'false'));
            $masterConsignment->appendChild($xml->createElement('ram:DeclaredValueForCustomsAmount', $payment_details['declear_value_customs']))->setAttribute('currencyID', $payment_details['currency']);
        }
        if ($payment_details['declear_value_insurance'] == 'XXX')
            $masterConsignment->appendChild($xml->createElement('ram:NilInsuranceValueIndicator', 'true'));
        else {
            $masterConsignment->appendChild($xml->createElement('ram:NilInsuranceValueIndicator', 'false'));
            $masterConsignment->appendChild($xml->createElement('ram:InsuranceValueAmount', $payment_details['declear_value_insurance']))->setAttribute('currencyID', $payment_details['currency']);
        }
        $masterConsignment->appendChild($xml->createElement('ram:TotalChargePrepaidIndicator', $payment_details['type_of_payment'] == 'PP' ? 'true' : 'false'));
        $masterConsignment->appendChild($xml->createElement('ram:TotalDisbursementPrepaidIndicator', $other_charges[0]['payment_type'] == 'P' ? 'true' : 'false'));
        $masterConsignment->appendChild($xml->createElement('ram:IncludedTareGrossWeightMeasure', $consignment_data['gross_weight']))->setAttribute('unitCode', $consignment_data['weight_code'] ?? 'KGM');
        if (!empty($waybill_data['total_volume']))
            $masterConsignment->appendChild($xml->createElement('ram:GrossVolumeMeasure', substr($waybill_data['total_volume'], 0, 9)))->setAttribute('unitCode', $waybill_data['dimention_unit'] ?? 'MTQ');
        $masterConsignment->appendChild($xml->createElement('ram:TotalPieceQuantity', $consignment_data['pieces']));

        // Consignor Party
        $consignor_street_name = $waybill_address['ship_address'] . (!empty($waybill_address['ship_address_line_2']) ? ',' . $waybill_address['ship_address_line_2'] : '');
        $consignorParty = $xml->createElement('ram:ConsignorParty');
        $consignorParty->appendChild(($e = $xml->createElement('ram:Name')))->appendChild($xml->createTextNode($waybill_address['ship_name']));
        $consignorParty->appendChild($xml->createElement('ram:AccountID', $waybill_address['ship_account']));
        $postalStructuredAddress1 = $xml->createElement('ram:PostalStructuredAddress');
        $postalStructuredAddress1->appendChild($xml->createElement('ram:PostcodeCode', $waybill_address['ship_post_code']));
        $postalStructuredAddress1->appendChild($xml->createElement('ram:StreetName', $consignor_street_name));
        $postalStructuredAddress1->appendChild($xml->createElement('ram:CityName', $waybill_address['ship_city']));
        $postalStructuredAddress1->appendChild($xml->createElement('ram:CountryID', $waybill_address['ship_country']));
        if ($waybill_address['ship_state'])
            $postalStructuredAddress1->appendChild($xml->createElement('ram:CountrySubDivisionID', $waybill_address['ship_state']));
        $consignorParty->appendChild($postalStructuredAddress1);

        if (!empty($waybill_address['ship_phone']) || !empty($waybill_address['ship_fax']) || !empty($waybill_address['ship_telex'])) {
            $DefinedTradeContact = $xml->createElement('ram:DefinedTradeContact');
            if (!empty($waybill_address['ship_phone'])) {
                $DirectTelephoneCommunication = $xml->createElement('ram:DirectTelephoneCommunication');
                $DirectTelephoneCommunication->appendChild($xml->createElement('ram:CompleteNumber', $waybill_address['ship_phone']));
                $DefinedTradeContact->appendChild($DirectTelephoneCommunication);
            }
            if (!empty($waybill_address['ship_fax'])) {
                $FaxCommunication = $xml->createElement('ram:FaxCommunication');
                $FaxCommunication->appendChild($xml->createElement('ram:CompleteNumber', $waybill_address['ship_fax']));
                $DefinedTradeContact->appendChild($FaxCommunication);
            }
            if ($waybill_address['ship_telex']) {
                $TelexCommunication = $xml->createElement('ram:TelexCommunication');
                $TelexCommunication->appendChild($xml->createElement('ram:CompleteNumber', $waybill_address['ship_telex']));
                $DefinedTradeContact->appendChild($TelexCommunication);
            }
            $consignorParty->appendChild($DefinedTradeContact);
        }
        $masterConsignment->appendChild($consignorParty);

        // Consignee Party
        $consignee_street_name = $waybill_address['cons_address'] . (!empty($waybill_address['cons_address_line_2']) ? ',' . $waybill_address['cons_address_line_2'] : '');
        $consigneeParty = $xml->createElement('ram:ConsigneeParty');
        $consigneeParty->appendChild(($e = $xml->createElement('ram:Name')))->appendChild($xml->createTextNode($waybill_address['cons_name']));
        $consigneeParty->appendChild($xml->createElement('ram:AccountID', $waybill_address['cons_account']));
        $postalStructuredAddress2 = $xml->createElement('ram:PostalStructuredAddress');
        $postalStructuredAddress2->appendChild($xml->createElement('ram:PostcodeCode', $waybill_address['cons_post_code']));
        $postalStructuredAddress2->appendChild($xml->createElement('ram:StreetName', $consignee_street_name));
        $postalStructuredAddress2->appendChild($xml->createElement('ram:CityName', $waybill_address['cons_city']));
        $postalStructuredAddress2->appendChild($xml->createElement('ram:CountryID', $waybill_address['cons_country']));
        if ($waybill_address['cons_state'])
            $postalStructuredAddress2->appendChild($xml->createElement('ram:CountrySubDivisionID', $waybill_address['cons_state']));
        $consigneeParty->appendChild($postalStructuredAddress2);

        if (!empty($waybill_address['cons_phone']) || !empty($waybill_address['cons_fax']) || !empty($waybill_address['cons_telex'])) {
            $DefinedTradeContact = $xml->createElement('ram:DefinedTradeContact');
            if (!empty($waybill_address['cons_phone'])) {
                $DirectTelephoneCommunication = $xml->createElement('ram:DirectTelephoneCommunication');
                $DirectTelephoneCommunication->appendChild($xml->createElement('ram:CompleteNumber', $waybill_address['cons_phone']));
                $DefinedTradeContact->appendChild($DirectTelephoneCommunication);
            }
            if (!empty($waybill_address['cons_fax'])) {
                $FaxCommunication = $xml->createElement('ram:FaxCommunication');
                $FaxCommunication->appendChild($xml->createElement('ram:CompleteNumber', $waybill_address['cons_fax']));
                $DefinedTradeContact->appendChild($FaxCommunication);
            }
            if ($waybill_address['cons_telex']) {
                $TelexCommunication = $xml->createElement('ram:TelexCommunication');
                $TelexCommunication->appendChild($xml->createElement('ram:CompleteNumber', $waybill_address['cons_telex']));
                $DefinedTradeContact->appendChild($TelexCommunication);
            }
            $consigneeParty->appendChild($DefinedTradeContact);
        }
        $masterConsignment->appendChild($consigneeParty);

        // Freight Forwarder Party
        $freightForwarderParty = $xml->createElement('ram:FreightForwarderParty');
        $freightForwarderParty->appendChild($xml->createElement('ram:Name', $agent_details['agent_name']));
        $freightForwarderParty->appendChild($xml->createElement('ram:CargoAgentID', $agent_details['iata_agent_code']));
        $freightForwarderAddress = $xml->createElement('ram:FreightForwarderAddress');
        $freightForwarderAddress->appendChild($xml->createElement('ram:PostcodeCode', $agent_details['agent_pincode']));
        $freightForwarderAddress->appendChild($xml->createElement('ram:StreetName', $agent_details['agent_address']));
        $freightForwarderAddress->appendChild($xml->createElement('ram:CityName', $agent_details['agent_city']));
        $freightForwarderAddress->appendChild($xml->createElement('ram:CountryID', $agent_details['agent_country'])); //
        $freightForwarderParty->appendChild($freightForwarderAddress);
        $SpecifiedCargoAgentLocation = $xml->createElement('ram:SpecifiedCargoAgentLocation');
        $SpecifiedCargoAgentLocation->appendChild($xml->createElement('ram:ID', $agent_details['iata_agent_cass']));
        $freightForwarderParty->appendChild($SpecifiedCargoAgentLocation);

        $DefinedTradeContact = $xml->createElement('ram:DefinedTradeContact');
        $DirectTelephoneCommunication = $xml->createElement('ram:DirectTelephoneCommunication');
        $DirectTelephoneCommunication->appendChild($xml->createElement('ram:CompleteNumber', $agent_details['agent_contact_person_phone']));
        $DefinedTradeContact->appendChild($DirectTelephoneCommunication);
        $URIEmailCommunication = $xml->createElement('ram:URIEmailCommunication');
        $URIEmailCommunication->appendChild($xml->createElement('ram:URIID', $agent_details['agent_contact_person_email']));
        $DefinedTradeContact->appendChild($URIEmailCommunication);
        $freightForwarderParty->appendChild($DefinedTradeContact);
        $masterConsignment->appendChild($freightForwarderParty);

        //also notify
        if (!empty($waybill_address['also_name'])) {
            $consignee_street_name = $waybill_address['also_address'] . (!empty($waybill_address['also_address_line_2']) ? ',' . $waybill_address['also_address_line_2'] : '');
            $AssociatedParty = $xml->createElement('ram:AssociatedParty');
            $AssociatedParty->appendChild($xml->createElement('ram:Name', $waybill_address['also_name']));

            $roleCode = $xml->createElement('ram:RoleCode', 'NI');
            $roleCode->setAttribute('listID', '3035');
            $roleCode->setAttribute('listAgencyID', '6');
            $roleCode->setAttribute('listVersionID', 'D09A');
            $AssociatedParty->appendChild($roleCode);

            $postalStructuredAddress3 = $xml->createElement('ram:PostalStructuredAddress');
            $postalStructuredAddress3->appendChild($xml->createElement('ram:PostcodeCode', $waybill_address['also_post_code']));
            $postalStructuredAddress3->appendChild($xml->createElement('ram:StreetName', $consignee_street_name));
            $postalStructuredAddress3->appendChild($xml->createElement('ram:CityName', $waybill_address['also_city']));
            $postalStructuredAddress3->appendChild($xml->createElement('ram:CountryID', $waybill_address['also_country']));
            if ($waybill_address['also_state'])
                $postalStructuredAddress3->appendChild($xml->createElement('ram:CountrySubDivisionName', $waybill_address['also_state']));
            $AssociatedParty->appendChild($postalStructuredAddress3);

            if (!empty($waybill_address['also_phone']) || !empty($waybill_address['also_fax']) || !empty($waybill_address['also_telex'])) {
                $DefinedTradeContact = $xml->createElement('ram:DefinedTradeContact');
                if (!empty($waybill_address['also_phone'])) {
                    $DirectTelephoneCommunication = $xml->createElement('ram:DirectTelephoneCommunication');
                    $DirectTelephoneCommunication->appendChild($xml->createElement('ram:CompleteNumber', $waybill_address['also_phone']));
                    $DefinedTradeContact->appendChild($DirectTelephoneCommunication);
                }
                if (!empty($waybill_address['also_fax'])) {
                    $FaxCommunication = $xml->createElement('ram:FaxCommunication');
                    $FaxCommunication->appendChild($xml->createElement('ram:CompleteNumber', $waybill_address['also_fax']));
                    $DefinedTradeContact->appendChild($FaxCommunication);
                }
                if ($waybill_address['also_telex']) {
                    $TelexCommunication = $xml->createElement('ram:TelexCommunication');
                    $TelexCommunication->appendChild($xml->createElement('ram:CompleteNumber', $waybill_address['also_telex']));
                    $DefinedTradeContact->appendChild($TelexCommunication);
                }
                $AssociatedParty->appendChild($DefinedTradeContact);
            }
            $masterConsignment->appendChild($AssociatedParty);
        }

        // Origin Location
        $originLocation = $xml->createElement('ram:OriginLocation');
        $originLocation->appendChild($xml->createElement('ram:ID', substr($waybill_data['departure_airport'], 0, 3)));
        $masterConsignment->appendChild($originLocation);

        // Final Destination Location
        $finalDestinationLocation = $xml->createElement('ram:FinalDestinationLocation');
        $finalDestinationLocation->appendChild($xml->createElement('ram:ID', substr($waybill_data['destination_airport'], 0, 3)));
        $masterConsignment->appendChild($finalDestinationLocation);

        foreach ([1, 2, 3] as $routeNumber) {
            $movement = $this->buildRouteMovementElement($xml, $waybill_data, $routeNumber);
            if ($movement) {
                $masterConsignment->appendChild($movement);
            }
        }

        $special_handling_info = $waybill_data['special_handling_info'] ? json_decode($waybill_data['special_handling_info'], true) : [];
        // Handling SPH Instructions
        for ($i = 0; $i < sizeof($special_handling_info); $i++) {
            $handlingSPHInstructions = $xml->createElement('ram:HandlingSPHInstructions');
            $handlingSPHInstructions->appendChild($xml->createElement('ram:DescriptionCode', $special_handling_info[$i]));
            $masterConsignment->appendChild($handlingSPHInstructions);
        }

        if (!empty($waybill_data['special_service_request'])) {
            // Handling SSR Instructions
            $handlingSSRInstructions = $xml->createElement('ram:HandlingSSRInstructions');
            $description_element = $xml->createElement('ram:Description');
            $description_element->appendChild($xml->createTextNode($waybill_data['special_service_request']));
            $handlingSSRInstructions->appendChild($description_element);
            $masterConsignment->appendChild($handlingSSRInstructions);
        }
        if (!empty($waybill_data['other_service_information'])) {
            // Handling SSR Instructions
            $HandlingOSIInstructions = $xml->createElement('ram:HandlingOSIInstructions');
            $description_element = $xml->createElement('ram:Description');
            $description_element->appendChild($xml->createTextNode($waybill_data['other_service_information']));
            $HandlingOSIInstructions->appendChild($description_element);
            $masterConsignment->appendChild($HandlingOSIInstructions);
        }
        if (!empty($waybill_data['letter_credit']) && !empty($waybill_data['accounting_information'])) {
            // Included Accounting Note
            $includedAccountingNote = $xml->createElement('ram:IncludedAccountingNote');
            $includedAccountingNote->appendChild($xml->createElement('ram:ContentCode', $waybill_data['letter_credit']));
            $includedAccountingNote->appendChild($xml->createElement('ram:Content', $waybill_data['accounting_information']));
            $masterConsignment->appendChild($includedAccountingNote);
        }
        if ($custom_info) {
            for ($i = 0; $i < sizeof($custom_info); $i++) {
                $IncludedCustomsNote = $xml->createElement('ram:IncludedCustomsNote');
                $IncludedCustomsNote->appendChild($xml->createElement('ram:ContentCode', $custom_info[$i]['custom_info_identifier']));
                $IncludedCustomsNote->appendChild($xml->createElement('ram:Content', $custom_info[$i]['supplementary_info']));
                $IncludedCustomsNote->appendChild($xml->createElement('ram:SubjectCode', $custom_info[$i]['info_identifier']));
                $IncludedCustomsNote->appendChild($xml->createElement('ram:CountryID', $custom_info[$i]['country_code']));
                $masterConsignment->appendChild($IncludedCustomsNote);
            }
        }
        if ($waybill_data['customs_origin_code']) {
            $AssociatedConsignmentCustomsProcedure = $xml->createElement('ram:AssociatedConsignmentCustomsProcedure');
            $AssociatedConsignmentCustomsProcedure->appendChild($xml->createElement('ram:GoodsStatusCode', $waybill_data['customs_origin_code']));
            $masterConsignment->appendChild($AssociatedConsignmentCustomsProcedure);
        }

        // Applicable Origin Currency Exchange
        $applicableOriginCurrencyExchange = $xml->createElement('ram:ApplicableOriginCurrencyExchange');
        $applicableOriginCurrencyExchange->appendChild($xml->createElement('ram:SourceCurrencyCode', 'INR'));
        $masterConsignment->appendChild($applicableOriginCurrencyExchange);

        if ($payment_details['type_of_payment']) {
            $ApplicableLogisticsServiceCharge = $xml->createElement('ram:ApplicableLogisticsServiceCharge');
            $ApplicableLogisticsServiceCharge->appendChild($xml->createElement('ram:TransportPaymentMethodCode', $payment_details['type_of_payment']));
            if ($consignment_data['service_code'])
                $ApplicableLogisticsServiceCharge->appendChild($xml->createElement('ram:ServiceTypeCode', $consignment_data['service_code']));
            $masterConsignment->appendChild($ApplicableLogisticsServiceCharge);
        }

        // Applicable Logistics Allowance Charge (Multiple Entries)
        for ($i = 0; $i < sizeof($other_charges); $i++) {
            $applicableLogisticsAllowanceCharge = $xml->createElement('ram:ApplicableLogisticsAllowanceCharge');
            $applicableLogisticsAllowanceCharge->appendChild($xml->createElement('ram:ID', substr($other_charges[$i]['other_charge_code'], 0, 2)));
            $applicableLogisticsAllowanceCharge->appendChild($xml->createElement('ram:PrepaidIndicator', $other_charges[$i]['payment_type'] == 'P' ? 'true' : 'false'));
            $applicableLogisticsAllowanceCharge->appendChild($xml->createElement('ram:PartyTypeCode', $other_charges[$i]['due']));
            $applicableAmount = $xml->createElement('ram:ActualAmount', $other_charges[$i]['amount']);
            $applicableAmount->setAttribute('currencyID', $payment_details['currency']);
            $applicableLogisticsAllowanceCharge->appendChild($applicableAmount);
            $masterConsignment->appendChild($applicableLogisticsAllowanceCharge);
        }

        // Applicable Rating
        $applicableRating = $xml->createElement('ram:ApplicableRating');
        $applicableRating->appendChild($xml->createElement('ram:TypeCode', 'F'));

        $totalChargeAmount = $xml->createElement('ram:TotalChargeAmount', $waybill_data['total_amount']);
        $totalChargeAmount->setAttribute('currencyID', $payment_details['currency']);
        $applicableRating->appendChild($totalChargeAmount);
        $applicableRating->appendChild($xml->createElement('ram:ConsignmentItemQuantity', 1));

        // Included Master Consignment Item
        $includedMasterConsignmentItem = $xml->createElement('ram:IncludedMasterConsignmentItem');
        $includedMasterConsignmentItem->appendChild($xml->createElement('ram:SequenceNumeric', $i + 1));
        $hs_code = json_decode($consignment_data['hs_code'], true);
        $TypeCode = $xml->createElement('ram:TypeCode', $hs_code[0] ?? '');
        $TypeCode->setAttribute('listAgencyID', 1);
        $includedMasterConsignmentItem->appendChild($TypeCode);
        $includedMasterConsignmentItem->appendChild($xml->createElement('ram:GrossWeightMeasure', $consignment_data['gross_weight']))->setAttribute('unitCode', $consignment_data['weight_code'] ?? 'KGM');
        $includedMasterConsignmentItem->appendChild($xml->createElement('ram:GrossVolumeMeasure', substr($waybill_data['total_volume'], 0, 9)))->setAttribute('unitCode', $waybill_data['dimention_unit'] ?? 'MTQ');
        if (!empty($consignment_data['slac']))
            $includedMasterConsignmentItem->appendChild($xml->createElement('ram:PackageQuantity', $consignment_data['slac']));
        $includedMasterConsignmentItem->appendChild($xml->createElement('ram:PieceQuantity', $consignment_data['pieces']));
        $includedMasterConsignmentItem->appendChild($xml->createElement('ram:Information', 'NDA'));
        // Nature Identification Transport Cargo
        if (!empty($consignment_data['description'])) {
            $natureIdentificationTransportCargo = $xml->createElement('ram:NatureIdentificationTransportCargo');
            $ident = $xml->createElement('ram:Identification');
            $ident->appendChild($xml->createTextNode($consignment_data['description']));
            $natureIdentificationTransportCargo->appendChild($ident);
            $includedMasterConsignmentItem->appendChild($natureIdentificationTransportCargo);
        }
        if (!empty($consignment_data['country_origin_goods'])) {
            $OriginCountry = $xml->createElement('ram:OriginCountry');
            $OriginCountry->appendChild($xml->createElement('ram:ID', $consignment_data['country_origin_goods']));
            $includedMasterConsignmentItem->appendChild($OriginCountry);
        }
        //for the uld
        $uld_info = json_decode($consignment_data['uld_info'], true);
        for ($j = 0; $j < sizeof($uld_info); $j++) {
            $AssociatedUnitLoadTransportEquipment = $xml->createElement('ram:AssociatedUnitLoadTransportEquipment');
            $AssociatedUnitLoadTransportEquipment->appendChild($xml->createElement('ram:ID', $uld_info[$j]['uld_serial']));
            $AssociatedUnitLoadTransportEquipment->appendChild($xml->createElement('ram:CharacteristicCode', $uld_info[$j]['uld_type']));
            $OperatingParty = $xml->createElement("ram:OperatingParty");
            $PrimaryID = $xml->createElement("ram:PrimaryID", $uld_info[$j]['owner']);
            $PrimaryID->setAttribute('schemeAgencyID', $j + 1);
            $OperatingParty->appendChild($PrimaryID);
            $AssociatedUnitLoadTransportEquipment->appendChild($OperatingParty);
            $includedMasterConsignmentItem->appendChild($AssociatedUnitLoadTransportEquipment);
        }
        //for the pieces info
        $pieces_info = json_decode($consignment_data['pieces_info'], true);
        for ($j = 0; $j < sizeof($pieces_info); $j++) {
            $TransportLogisticsPackage = $xml->createElement('ram:TransportLogisticsPackage');
            $TransportLogisticsPackage->appendChild($xml->createElement('ram:ItemQuantity', $pieces_info[$j]['pcs']));
            if (isset($pieces_info[$j]['gross_weight'])) {
                $GrossWeightMeasure = $xml->createElement('ram:GrossWeightMeasure', $pieces_info[$j]['gross_weight']);
                $GrossWeightMeasure->setAttribute('unitCode', 'KGM');
                $TransportLogisticsPackage->appendChild($GrossWeightMeasure);
            }
            $LinearSpatialDimension = $xml->createElement('ram:LinearSpatialDimension');
            $WidthMeasure = $xml->createElement('ram:WidthMeasure', $pieces_info[$j]['width']);
            $WidthMeasure->setAttribute('unitCode', $pieces_info[$j]['unit'] ?? 'CMT');
            $LinearSpatialDimension->appendChild($WidthMeasure);
            $LengthMeasure = $xml->createElement('ram:LengthMeasure', $pieces_info[$j]['length']);
            $LengthMeasure->setAttribute('unitCode', $pieces_info[$j]['unit'] ?? 'CMT');
            $LinearSpatialDimension->appendChild($LengthMeasure);
            $HeightMeasure = $xml->createElement('ram:HeightMeasure', $pieces_info[$j]['height']);
            $HeightMeasure->setAttribute('unitCode', $pieces_info[$j]['unit'] ?? 'CMT');
            $LinearSpatialDimension->appendChild($HeightMeasure);
            $TransportLogisticsPackage->appendChild($LinearSpatialDimension);
            $includedMasterConsignmentItem->appendChild($TransportLogisticsPackage);
        }

        // Applicable Freight Rate Service Charge
        $applicableFreightRateServiceCharge = $xml->createElement('ram:ApplicableFreightRateServiceCharge');
        $applicableFreightRateServiceCharge->appendChild($xml->createElement('ram:CategoryCode', $consignment_data['rate_class']));
        if ($consignment_data['commodity_item'])
            $applicableFreightRateServiceCharge->appendChild($xml->createElement('ram:CommodityItemID', $consignment_data['commodity_item']));
        $applicableFreightRateServiceCharge->appendChild($xml->createElement('ram:ChargeableWeightMeasure', $consignment_data['chargable_weight']))->setAttribute('unitCode', $consignment_data['weight_code'] ?? 'KGM');
        $applicableFreightRateServiceCharge->appendChild($xml->createElement('ram:AppliedRate', $consignment_data['rate'] ?? 0));
        $applicableAppliedAmount = $xml->createElement('ram:AppliedAmount', $waybill_data['total_amount']);
        $applicableAppliedAmount->setAttribute('currencyID', $payment_details['currency']);
        $applicableFreightRateServiceCharge->appendChild($applicableAppliedAmount);
        $includedMasterConsignmentItem->appendChild($applicableFreightRateServiceCharge);

        //for uld rate class
        if ($consignment_data['uld_rate_class']) {
            $ApplicableUnitLoadDeviceRateClass = $xml->createElement('ram:ApplicableUnitLoadDeviceRateClass');
            $ApplicableUnitLoadDeviceRateClass->appendChild($xml->createElement('ram:TypeCode', $consignment_data['uld_rate_class']));
            $includedMasterConsignmentItem->appendChild($ApplicableUnitLoadDeviceRateClass);
        }

        // Append IncludedMasterConsignmentItem to ApplicableRating
        $applicableRating->appendChild($includedMasterConsignmentItem);
        //adding master consignment
        $masterConsignment->appendChild($applicableRating);

        // Applicable Total Rating
        $applicableTotalRating = $xml->createElement('ram:ApplicableTotalRating');
        $applicableTotalRating->appendChild($xml->createElement('ram:TypeCode', 'F'));
        if ($payment_details['type_of_payment'] == 'PP')
            $prepaid_collect_text = "prepaid";
        else
            $prepaid_collect_text = "collect";
        $applicablePrepaidCollectMonetarySummation = $xml->createElement('ram:ApplicablePrepaidCollectMonetarySummation');
        $applicablePrepaidCollectMonetarySummation->appendChild($xml->createElement('ram:PrepaidIndicator', $payment_details['type_of_payment'] == 'PP' ? 'true' : 'false'));
        $applicablePrepaidCollectMonetarySummation->appendChild($xml->createElement('ram:WeightChargeTotalAmount', $payment_details['weight_charge']))->setAttribute('currencyID', $payment_details['currency']);
        if ($payment_details['taxes'])
            $applicablePrepaidCollectMonetarySummation->appendChild($xml->createElement('ram:TaxTotalAmount', $payment_details['taxes']))->setAttribute('currencyID', $payment_details['currency']);
        if ($payment_details['other_charges_due_agent_' . $prepaid_collect_text])
            $applicablePrepaidCollectMonetarySummation->appendChild($xml->createElement('ram:AgentTotalDuePayableAmount', $payment_details['other_charges_due_agent_' . $prepaid_collect_text]))->setAttribute('currencyID', $payment_details['currency']);
        if ($payment_details['other_charges_due_carrier_' . $prepaid_collect_text])
            $applicablePrepaidCollectMonetarySummation->appendChild($xml->createElement('ram:CarrierTotalDuePayableAmount', $payment_details['other_charges_due_carrier_' . $prepaid_collect_text]))->setAttribute('currencyID', $payment_details['currency']);
        $applicablePrepaidCollectMonetarySummation->appendChild($xml->createElement('ram:GrandTotalAmount', $payment_details['total_charges_' . $prepaid_collect_text]))->setAttribute('currencyID', $payment_details['currency']);
        $applicableTotalRating->appendChild($applicablePrepaidCollectMonetarySummation);
        $masterConsignment->appendChild($applicableTotalRating);

        // Append to the root element
        $xml->appendChild($waybill);
        // Prepare response as an XML download
        $xml_file_name = 'xml_airway_bill_' . $awb_id . '.xml';
        Storage::put('xml-conversion-files/' . $xml_file_name, $xml->saveXML());
        $send_response = $this->sendXmlToDescartes($xml_file_name);
        return $send_response;
        // return response($xml->saveXML(), 200)->header('Content-Type', 'application/xml');
    }
    public function HouseWayBillConversion($hawb_no = '57HOUSE10')
    {
        // Fetch data from the database (this is just sample data for now)
        $user_data = auth()->guard('user-api')->user();
        $branch_id = $user_data->branch_name;
        $house_data = HousewayBills::where([['id', $hawb_no]])->first()->toArray();
        $house_address = WayBillAddress::where([['awb_id', $hawb_no]])->limit(1)->first()->toArray();
        $consignment_data = ConsignmentData::where([['awb_id', $hawb_no]])->limit(1)->first()->toArray();
        $agent_details = Agent::where('id', $branch_id)->limit(1)->first()->toArray();
        $payment_details = PaymentInfo::where('awb_id', $hawb_no)->limit(1)->first()->toArray();
        $other_charges = OtherCharge::where('awb_id', $hawb_no)->get()->toArray();
        $custom_info = OtherCustomInformation::where('awb_id', $hawb_no)->get()->toArray();

        $utc_current_date = gmdate("Y-m-d H:i:s");
        $utc_current_date = str_replace(' ', 'T', $utc_current_date);
        $time = time();

        //update refrance id
        // HousewayBills::where([['id', $hawb_no]])->update(['reference_id', $time]);

        // Start conversion to XML
        $xml = new DOMDocument();
        $xml->formatOutput = true;

        // Create root element
        $housewaybill = $xml->createElementNS('iata:housewaybill:1', 'rsm:HouseWaybill');
        $housewaybill->setAttribute('xmlns:ram', 'iata:datamodel:3');
        $housewaybill->setAttribute('xmlns:rsm', 'iata:housewaybill:1');

        // Message Header Document
        $messageHeaderDocument = $xml->createElement('rsm:MessageHeaderDocument');
        $housewaybill->appendChild($messageHeaderDocument);
        $messageHeaderDocument->appendChild($xml->createElement('ram:ID', $house_data['id'] . '_' . $time));
        $messageHeaderDocument->appendChild($xml->createElement('ram:Name', 'House waybill'));
        $messageHeaderDocument->appendChild($xml->createElement('ram:TypeCode', '703'));
        $messageHeaderDocument->appendChild($xml->createElement('ram:IssueDateTime', $utc_current_date));
        $messageHeaderDocument->appendChild($xml->createElement('ram:PurposeCode', 'Creation'));
        $messageHeaderDocument->appendChild($xml->createElement('ram:VersionID', '3.00'));

        // SenderParty
        $senderParty1 = $xml->createElement('ram:SenderParty');
        $senderParty1->appendChild($xml->createElement('ram:PrimaryID', "{$user_data->pima_address}"));
        $senderParty1->firstChild->setAttribute('schemeID', 'P');
        $messageHeaderDocument->appendChild($senderParty1);

        // RecipientParty
        $recipientParty2 = $xml->createElement('ram:RecipientParty');
        $recipientParty2->appendChild($xml->createElement('ram:PrimaryID', 'TDVSYS03GLNUNADDR'));
        $recipientParty2->firstChild->setAttribute('schemeID', 'C');
        $messageHeaderDocument->appendChild($recipientParty2);

        // Business Header Document
        $businessHeaderDocument = $xml->createElement('rsm:BusinessHeaderDocument');
        $housewaybill->appendChild($businessHeaderDocument);

        $businessHeaderDocument->appendChild($xml->createElement('ram:ID', $house_data['id']));

        // Included Header Note
        $includedHeaderNote = $xml->createElement('ram:IncludedHeaderNote');
        $includedHeaderNote->appendChild($xml->createElement('ram:ContentCode', 'C'));
        $includedHeaderNote->appendChild($xml->createElement('ram:Content', 'Consolidation'));
        $businessHeaderDocument->appendChild($includedHeaderNote);

        // Signatory Consignor Authentication
        $signatoryConsignorAuth = $xml->createElement('ram:SignatoryConsignorAuthentication');
        $signatoryConsignorAuth->appendChild($xml->createElement('ram:Signatory', $agent_details['agent_issue_sign']));
        $businessHeaderDocument->appendChild($signatoryConsignorAuth);

        // Signatory Carrier Authentication
        $signatoryCarrierAuth = $xml->createElement('ram:SignatoryCarrierAuthentication');
        $signatoryCarrierAuth->appendChild($xml->createElement('ram:ActualDateTime', $utc_current_date));
        $signatoryCarrierAuth->appendChild($xml->createElement('ram:Signatory', $agent_details['agent_name']));

        $issueAuthLocation = $xml->createElement('ram:IssueAuthenticationLocation');
        $issueAuthLocation->appendChild($xml->createElement('ram:Name', substr($agent_details['agent_issue_loc_code'], 0, 3)));
        $signatoryCarrierAuth->appendChild($issueAuthLocation);
        $businessHeaderDocument->appendChild($signatoryCarrierAuth);

        // Master Consignment
        $masterConsignment = $xml->createElement('rsm:MasterConsignment');
        $housewaybill->appendChild($masterConsignment);
        $masterConsignment->appendChild($xml->createElement('ram:IncludedTareGrossWeightMeasure', $house_data['master_weight']))->setAttribute('unitCode', 'KGM');
        $masterConsignment->appendChild($xml->createElement('ram:TotalPieceQuantity', $house_data['master_pcs']));

        $TransportContractDocument = $xml->createElement('ram:TransportContractDocument');
        $TransportContractDocument->appendChild($xml->createElement('ram:ID', $house_data['awb_code'] . '-' . $house_data['awb_no']));
        $masterConsignment->appendChild($TransportContractDocument);

        $OriginLocation = $xml->createElement('ram:OriginLocation');
        $OriginLocation->appendChild($xml->createElement('ram:ID', substr($house_data['master_origin'], 0, 3)));
        $masterConsignment->appendChild($OriginLocation);

        $FinalDestinationLocation = $xml->createElement('ram:FinalDestinationLocation');
        $FinalDestinationLocation->appendChild($xml->createElement('ram:ID', substr($house_data['master_destination'], 0, 3)));
        $masterConsignment->appendChild($FinalDestinationLocation);

        //main house waybill data
        $IncludedHouseConsignment = $xml->createElement('ram:IncludedHouseConsignment');
        $masterConsignment->appendChild($IncludedHouseConsignment);

        if ($payment_details['declear_value_carriage'] == 'NVD')
            $IncludedHouseConsignment->appendChild($xml->createElement('ram:NilCarriageValueIndicator', 'true'));
        else {
            $IncludedHouseConsignment->appendChild($xml->createElement('ram:NilCarriageValueIndicator', 'false'));
            $IncludedHouseConsignment->appendChild($xml->createElement('ram:DeclaredValueForCarriageAmount', $payment_details['declear_value_carriage']))->setAttribute('currencyID', $payment_details['currency']);
        }
        if ($payment_details['declear_value_customs'] == 'NCV')
            $IncludedHouseConsignment->appendChild($xml->createElement('ram:NilCustomsValueIndicator', 'true'));
        else {
            $IncludedHouseConsignment->appendChild($xml->createElement('ram:NilCustomsValueIndicator', 'false'));
            $IncludedHouseConsignment->appendChild($xml->createElement('ram:DeclaredValueForCustomsAmount', $payment_details['declear_value_customs']))->setAttribute('currencyID', $payment_details['currency']);
        }
        if ($payment_details['declear_value_insurance'] == 'XXX')
            $IncludedHouseConsignment->appendChild($xml->createElement('ram:NilInsuranceValueIndicator', 'true'));
        else {
            $IncludedHouseConsignment->appendChild($xml->createElement('ram:NilInsuranceValueIndicator', 'false'));
            $IncludedHouseConsignment->appendChild($xml->createElement('ram:InsuranceValueAmount', $payment_details['declear_value_insurance']))->setAttribute('currencyID', $payment_details['currency']);
        }
        $IncludedHouseConsignment->appendChild($xml->createElement('ram:TotalChargePrepaidIndicator', $payment_details['type_of_payment'] == 'PP' ? 'true' : 'false'));
        $IncludedHouseConsignment->appendChild($xml->createElement('ram:TotalDisbursementPrepaidIndicator', $other_charges[0]['payment_type'] ?? '' == 'P' ? 'true' : 'false'));
        $IncludedHouseConsignment->appendChild($xml->createElement('ram:IncludedTareGrossWeightMeasure', $consignment_data['gross_weight']))->setAttribute('unitCode', $consignment_data['weight_code'] ?? 'KGM');
        if (!empty($waybill_data['total_volume']))
            $IncludedHouseConsignment->appendChild($xml->createElement('ram:GrossVolumeMeasure', substr(($house_data['total_volume'] ?? 0), 0, 9)))->setAttribute('unitCode', $house_data['dimention_unit'] ?? 'MTQ');
        $IncludedHouseConsignment->appendChild($xml->createElement('ram:TotalPieceQuantity', $consignment_data['pieces']));
        $ident = $xml->createElement('ram:SummaryDescription');
        $ident->appendChild($xml->createTextNode($consignment_data['description']));
        $IncludedHouseConsignment->appendChild($ident);

        // Consignor Party
        $consignor_street_name = $house_address['ship_address'] . (!empty($house_address['ship_address_line_2']) ? ',' . $house_address['ship_address_line_2'] : '');
        $consignorParty = $xml->createElement('ram:ConsignorParty');
        $consignorParty->appendChild(($e = $xml->createElement('ram:Name')))->appendChild($xml->createTextNode($house_address['ship_name']));
        $consignorParty->appendChild($xml->createElement('ram:AccountID', $house_address['ship_account']));
        $postalStructuredAddress1 = $xml->createElement('ram:PostalStructuredAddress');
        $postalStructuredAddress1->appendChild($xml->createElement('ram:PostcodeCode', $house_address['ship_post_code']));
        $postalStructuredAddress1->appendChild($xml->createElement('ram:StreetName', $consignor_street_name));
        $postalStructuredAddress1->appendChild($xml->createElement('ram:CityName', $house_address['ship_city']));
        $postalStructuredAddress1->appendChild($xml->createElement('ram:CountryID', $house_address['ship_country']));
        if ($house_address['ship_state'])
            $postalStructuredAddress1->appendChild($xml->createElement('ram:CountrySubDivisionID', $house_address['ship_state']));
        $consignorParty->appendChild($postalStructuredAddress1);

        if (!empty($house_address['ship_phone']) || !empty($house_address['ship_fax']) || !empty($house_address['ship_telex'])) {
            $DefinedTradeContact = $xml->createElement('ram:DefinedTradeContact');
            if (!empty($house_address['ship_phone'])) {
                $DirectTelephoneCommunication = $xml->createElement('ram:DirectTelephoneCommunication');
                $DirectTelephoneCommunication->appendChild($xml->createElement('ram:CompleteNumber', $house_address['ship_phone']));
                $DefinedTradeContact->appendChild($DirectTelephoneCommunication);
            }
            if (!empty($house_address['ship_fax'])) {
                $FaxCommunication = $xml->createElement('ram:FaxCommunication');
                $FaxCommunication->appendChild($xml->createElement('ram:CompleteNumber', $house_address['ship_fax']));
                $DefinedTradeContact->appendChild($FaxCommunication);
            }
            if ($house_address['ship_telex']) {
                $TelexCommunication = $xml->createElement('ram:TelexCommunication');
                $TelexCommunication->appendChild($xml->createElement('ram:CompleteNumber', $house_address['ship_telex']));
                $DefinedTradeContact->appendChild($TelexCommunication);
            }
            $consignorParty->appendChild($DefinedTradeContact);
        }
        $IncludedHouseConsignment->appendChild($consignorParty);

        // Consignee Party
        $consignee_street_name = $house_address['cons_address'] . (!empty($house_address['cons_address_line_2']) ? ',' . $house_address['cons_address_line_2'] : '');
        $consigneeParty = $xml->createElement('ram:ConsigneeParty');
        $consigneeParty->appendChild(($e = $xml->createElement('ram:Name')))->appendChild($xml->createTextNode($house_address['cons_name']));
        $consigneeParty->appendChild($xml->createElement('ram:AccountID', $house_address['cons_account']));
        $postalStructuredAddress2 = $xml->createElement('ram:PostalStructuredAddress');
        $postalStructuredAddress2->appendChild($xml->createElement('ram:PostcodeCode', $house_address['cons_post_code']));
        $postalStructuredAddress2->appendChild($xml->createElement('ram:StreetName', $consignee_street_name));
        $postalStructuredAddress2->appendChild($xml->createElement('ram:CityName', $house_address['cons_city']));
        $postalStructuredAddress2->appendChild($xml->createElement('ram:CountryID', $house_address['cons_country']));
        if ($house_address['cons_state'])
            $postalStructuredAddress2->appendChild($xml->createElement('ram:CountrySubDivisionID', $house_address['cons_state']));
        $consigneeParty->appendChild($postalStructuredAddress2);

        if (!empty($house_address['cons_phone']) || !empty($house_address['cons_fax']) || !empty($house_address['cons_telex'])) {
            $DefinedTradeContact = $xml->createElement('ram:DefinedTradeContact');
            if (!empty($house_address['cons_phone'])) {
                $DirectTelephoneCommunication = $xml->createElement('ram:DirectTelephoneCommunication');
                $DirectTelephoneCommunication->appendChild($xml->createElement('ram:CompleteNumber', $house_address['cons_phone']));
                $DefinedTradeContact->appendChild($DirectTelephoneCommunication);
            }
            if (!empty($house_address['cons_fax'])) {
                $FaxCommunication = $xml->createElement('ram:FaxCommunication');
                $FaxCommunication->appendChild($xml->createElement('ram:CompleteNumber', $house_address['cons_fax']));
                $DefinedTradeContact->appendChild($FaxCommunication);
            }
            if ($house_address['cons_telex']) {
                $TelexCommunication = $xml->createElement('ram:TelexCommunication');
                $TelexCommunication->appendChild($xml->createElement('ram:CompleteNumber', $house_address['cons_telex']));
                $DefinedTradeContact->appendChild($TelexCommunication);
            }
            $consigneeParty->appendChild($DefinedTradeContact);
        }
        $IncludedHouseConsignment->appendChild($consigneeParty);

        //also notify
        if (!empty($house_address['also_name'])) {
            $consignee_street_name = $house_address['also_address'] . (!empty($house_address['also_address_line_2']) ? ',' . $house_address['also_address_line_2'] : '');
            $AssociatedParty = $xml->createElement('ram:AssociatedParty');
            $AssociatedParty->appendChild($xml->createElement('ram:Name', $house_address['also_name']));

            $roleCode = $xml->createElement('ram:RoleCode', 'NI');
            $roleCode->setAttribute('listID', '3035');
            $roleCode->setAttribute('listAgencyID', '6');
            $roleCode->setAttribute('listVersionID', 'D09A');
            $AssociatedParty->appendChild($roleCode);

            $postalStructuredAddress3 = $xml->createElement('ram:PostalStructuredAddress');
            $postalStructuredAddress3->appendChild($xml->createElement('ram:PostcodeCode', $house_address['also_post_code']));
            $postalStructuredAddress3->appendChild($xml->createElement('ram:StreetName', $consignee_street_name));
            $postalStructuredAddress3->appendChild($xml->createElement('ram:CityName', $house_address['also_city']));
            $postalStructuredAddress3->appendChild($xml->createElement('ram:CountryID', $house_address['also_country']));
            $AssociatedParty->appendChild($postalStructuredAddress3);

            if (!empty($house_address['also_phone']) || !empty($house_address['also_fax']) || !empty($house_address['also_telex'])) {
                $DefinedTradeContact = $xml->createElement('ram:DefinedTradeContact');
                if (!empty($house_address['also_phone'])) {
                    $DirectTelephoneCommunication = $xml->createElement('ram:DirectTelephoneCommunication');
                    $DirectTelephoneCommunication->appendChild($xml->createElement('ram:CompleteNumber', $house_address['also_phone']));
                    $DefinedTradeContact->appendChild($DirectTelephoneCommunication);
                }
                if (!empty($house_address['also_fax'])) {
                    $FaxCommunication = $xml->createElement('ram:FaxCommunication');
                    $FaxCommunication->appendChild($xml->createElement('ram:CompleteNumber', $house_address['also_fax']));
                    $DefinedTradeContact->appendChild($FaxCommunication);
                }
                if ($house_address['also_telex']) {
                    $TelexCommunication = $xml->createElement('ram:TelexCommunication');
                    $TelexCommunication->appendChild($xml->createElement('ram:CompleteNumber', $house_address['also_telex']));
                    $DefinedTradeContact->appendChild($TelexCommunication);
                }
                $AssociatedParty->appendChild($DefinedTradeContact);
            }
            $IncludedHouseConsignment->appendChild($AssociatedParty);
        }

        // Origin Location
        $originLocation = $xml->createElement('ram:OriginLocation');
        $originLocation->appendChild($xml->createElement('ram:ID', substr($house_data['departure_airport'], 0, 3)));
        $IncludedHouseConsignment->appendChild($originLocation);

        // Final Destination Location
        $finalDestinationLocation = $xml->createElement('ram:FinalDestinationLocation');
        $finalDestinationLocation->appendChild($xml->createElement('ram:ID', substr($house_data['destination_airport'], 0, 3)));
        $IncludedHouseConsignment->appendChild($finalDestinationLocation);

        foreach ([1, 2, 3] as $routeNumber) {
            $movement = $this->buildRouteMovementElement($xml, $house_data, $routeNumber);
            if ($movement) {
                $IncludedHouseConsignment->appendChild($movement);
            }
        }

        $special_handling_info = json_decode($house_data['special_handling_info'], true) ?? [];
        // Handling SPH Instructions
        for ($i = 0; $i < sizeof($special_handling_info); $i++) {
            $handlingSPHInstructions = $xml->createElement('ram:HandlingSPHInstructions');
            $handlingSPHInstructions->appendChild($xml->createElement('ram:DescriptionCode', $special_handling_info[$i]));
            $IncludedHouseConsignment->appendChild($handlingSPHInstructions);
        }

        if (!empty($house_data['special_service_request'])) {
            // Handling SSR Instructions
            $handlingSSRInstructions = $xml->createElement('ram:HandlingSSRInstructions');
            $description_element = $xml->createElement('ram:Description');
            $description_element->appendChild($xml->createTextNode($house_data['special_service_request']));
            $handlingSSRInstructions->appendChild($description_element);
            $IncludedHouseConsignment->appendChild($handlingSSRInstructions);
        }
        if (!empty($house_data['other_service_information'])) {
            // Handling SSR Instructions
            $HandlingOSIInstructions = $xml->createElement('ram:HandlingOSIInstructions');
            $description_element = $xml->createElement('ram:Description');
            $description_element->appendChild($xml->createTextNode($house_data['other_service_information']));
            $HandlingOSIInstructions->appendChild($description_element);
            $IncludedHouseConsignment->appendChild($HandlingOSIInstructions);
        }
        if (!empty($house_data['letter_credit']) && !empty($house_data['accounting_information'])) {
            // Included Accounting Note
            $includedAccountingNote = $xml->createElement('ram:IncludedAccountingNote');
            $includedAccountingNote->appendChild($xml->createElement('ram:ContentCode', $house_data['letter_credit']));
            $includedAccountingNote->appendChild($xml->createElement('ram:Content', $house_data['accounting_information']));
            $IncludedHouseConsignment->appendChild($includedAccountingNote);
        }
        for ($i = 0; $i < sizeof($custom_info); $i++) {
            $IncludedCustomsNote = $xml->createElement('ram:IncludedCustomsNote');
            $IncludedCustomsNote->appendChild($xml->createElement('ram:ContentCode', $custom_info[$i]['custom_info_identifier']));
            $IncludedCustomsNote->appendChild($xml->createElement('ram:Content', $custom_info[$i]['supplementary_info']));
            $IncludedCustomsNote->appendChild($xml->createElement('ram:SubjectCode', $custom_info[$i]['info_identifier']));
            $IncludedCustomsNote->appendChild($xml->createElement('ram:CountryID', $custom_info[$i]['country_code']));
            $IncludedHouseConsignment->appendChild($IncludedCustomsNote);
        }
        if ($house_data['customs_origin_code']) {
            $AssociatedConsignmentCustomsProcedure = $xml->createElement('ram:AssociatedConsignmentCustomsProcedure');
            $AssociatedConsignmentCustomsProcedure->appendChild($xml->createElement('ram:GoodsStatusCode', $house_data['customs_origin_code']));
            $IncludedHouseConsignment->appendChild($AssociatedConsignmentCustomsProcedure);
        }

        // Applicable Origin Currency Exchange
        $applicableOriginCurrencyExchange = $xml->createElement('ram:ApplicableOriginCurrencyExchange');
        $applicableOriginCurrencyExchange->appendChild($xml->createElement('ram:SourceCurrencyCode', 'INR'));
        $IncludedHouseConsignment->appendChild($applicableOriginCurrencyExchange);

        if ($consignment_data['service_code']) {
            $ApplicableLogisticsServiceCharge = $xml->createElement('ram:ApplicableLogisticsServiceCharge');
            $ApplicableLogisticsServiceCharge->appendChild($xml->createElement('ram:ServiceTypeCode', $consignment_data['service_code']));
            $IncludedHouseConsignment->appendChild($ApplicableLogisticsServiceCharge);
        }

        // Applicable Logistics Allowance Charge (Multiple Entries)
        for ($i = 0; $i < sizeof($other_charges); $i++) {
            $applicableLogisticsAllowanceCharge = $xml->createElement('ram:ApplicableLogisticsAllowanceCharge');
            $applicableLogisticsAllowanceCharge->appendChild($xml->createElement('ram:ID', substr($other_charges[$i]['other_charge_code'], 0, 2)));
            $applicableLogisticsAllowanceCharge->appendChild($xml->createElement('ram:PartyTypeCode', $other_charges[$i]['due']));
            $applicableAmount = $xml->createElement('ram:ActualAmount', $other_charges[$i]['amount']);
            $applicableAmount->setAttribute('currencyID', $payment_details['currency']);
            $applicableLogisticsAllowanceCharge->appendChild($applicableAmount);
            $IncludedHouseConsignment->appendChild($applicableLogisticsAllowanceCharge);
        }

        // ==========Included House Consignment Item===========
        $IncludedHouseConsignmentItem = $xml->createElement('ram:IncludedHouseConsignmentItem');
        $IncludedHouseConsignmentItem->appendChild($xml->createElement('ram:SequenceNumeric', 1));
        $hs_code = json_decode($consignment_data['hs_code'], true);
        $TypeCode = $xml->createElement('ram:TypeCode', $hs_code[0] ?? '');
        $TypeCode->setAttribute('listAgencyID', 1);
        $IncludedHouseConsignmentItem->appendChild($TypeCode);
        $IncludedHouseConsignmentItem->appendChild($xml->createElement('ram:GrossWeightMeasure', $consignment_data['gross_weight']))->setAttribute('unitCode', $consignment_data['weight_code'] ?? 'KGM');
        $IncludedHouseConsignmentItem->appendChild($xml->createElement('ram:GrossVolumeMeasure', substr(($house_data['total_volume'] ?? 0), 0, 9)))->setAttribute('unitCode', $house_data['dimention_unit'] ?? 'MTQ');
        $totalChargeAmount = $xml->createElement('ram:TotalChargeAmount', $house_data['total_amount']);
        $totalChargeAmount->setAttribute('currencyID', $payment_details['currency']);
        $IncludedHouseConsignmentItem->appendChild($totalChargeAmount);
        if (!empty($consignment_data['slac']))
            $IncludedHouseConsignmentItem->appendChild($xml->createElement('ram:PackageQuantity', $consignment_data['slac']));
        $IncludedHouseConsignmentItem->appendChild($xml->createElement('ram:PieceQuantity', $consignment_data['pieces']));
        $IncludedHouseConsignmentItem->appendChild($xml->createElement('ram:Information', 'NDA'));
        // Nature Identification Transport Cargo
        if (!empty($consignment_data['description'])) {
            $natureIdentificationTransportCargo = $xml->createElement('ram:NatureIdentificationTransportCargo');
            $ident = $xml->createElement('ram:Identification');
            $ident->appendChild($xml->createTextNode($consignment_data['description']));
            $natureIdentificationTransportCargo->appendChild($ident);
            $IncludedHouseConsignmentItem->appendChild($natureIdentificationTransportCargo);
        }
        if (!empty($consignment_data['country_origin_goods'])) {
            $OriginCountry = $xml->createElement('ram:OriginCountry');
            $OriginCountry->appendChild($xml->createElement('ram:ID', $consignment_data['country_origin_goods']));
            $IncludedHouseConsignmentItem->appendChild($OriginCountry);
        }
        //for the uld
        $uld_info = json_decode($consignment_data['uld_info'], true);
        for ($j = 0; $j < sizeof($uld_info); $j++) {
            $AssociatedUnitLoadTransportEquipment = $xml->createElement('ram:AssociatedUnitLoadTransportEquipment');
            $AssociatedUnitLoadTransportEquipment->appendChild($xml->createElement('ram:ID', $uld_info[$j]['uld_serial']));
            $AssociatedUnitLoadTransportEquipment->appendChild($xml->createElement('ram:CharacteristicCode', $uld_info[$j]['uld_type']));
            $OperatingParty = $xml->createElement("OperatingParty");
            $PrimaryID = $xml->createElement("PrimaryID", $uld_info[$j]['owner']);
            $PrimaryID->setAttribute('schemeAgencyID', $j + 1);
            $OperatingParty->appendChild($PrimaryID);
            $AssociatedUnitLoadTransportEquipment->appendChild($OperatingParty);
            $IncludedHouseConsignmentItem->appendChild($AssociatedUnitLoadTransportEquipment);
        }
        //for the pieces info
        $pieces_info = json_decode($consignment_data['pieces_info'], true);
        for ($j = 0; $j < sizeof($pieces_info); $j++) {
            $TransportLogisticsPackage = $xml->createElement('ram:TransportLogisticsPackage');
            $TransportLogisticsPackage->appendChild($xml->createElement('ram:ItemQuantity', $pieces_info[$j]['pcs']));
            if (isset($pieces_info[$j]['gross_weight'])) {
                $GrossWeightMeasure = $xml->createElement('ram:GrossWeightMeasure', $pieces_info[$j]['gross_weight']);
                $GrossWeightMeasure->setAttribute('unitCode', 'KGM');
                $TransportLogisticsPackage->appendChild($GrossWeightMeasure);
            }
            $LinearSpatialDimension = $xml->createElement('ram:LinearSpatialDimension');
            $WidthMeasure = $xml->createElement('ram:WidthMeasure', $pieces_info[$j]['width']);
            $WidthMeasure->setAttribute('unitCode', $pieces_info[$j]['unit'] ?? 'CMT');
            $LinearSpatialDimension->appendChild($WidthMeasure);
            $LengthMeasure = $xml->createElement('ram:LengthMeasure', $pieces_info[$j]['length']);
            $LengthMeasure->setAttribute('unitCode', $pieces_info[$j]['unit'] ?? 'CMT');
            $LinearSpatialDimension->appendChild($LengthMeasure);
            $HeightMeasure = $xml->createElement('ram:HeightMeasure', $pieces_info[$j]['height']);
            $HeightMeasure->setAttribute('unitCode', $pieces_info[$j]['unit'] ?? 'CMT');
            $LinearSpatialDimension->appendChild($HeightMeasure);
            $TransportLogisticsPackage->appendChild($LinearSpatialDimension);
            $IncludedHouseConsignmentItem->appendChild($TransportLogisticsPackage);
        }

        // Applicable Freight Rate Service Charge
        $applicableFreightRateServiceCharge = $xml->createElement('ram:ApplicableFreightRateServiceCharge');
        $applicableFreightRateServiceCharge->appendChild($xml->createElement('ram:CategoryCode', $consignment_data['rate_class']));
        if ($consignment_data['commodity_item'])
            $applicableFreightRateServiceCharge->appendChild($xml->createElement('ram:CommodityItemID', $consignment_data['commodity_item']));
        $applicableFreightRateServiceCharge->appendChild($xml->createElement('ram:ChargeableWeightMeasure', $consignment_data['chargable_weight']))->setAttribute('unitCode', $consignment_data['weight_code'] ?? 'KGM');
        $applicableFreightRateServiceCharge->appendChild($xml->createElement('ram:AppliedRate', $consignment_data['rate'] ?? 0));
        $applicableAppliedAmount = $xml->createElement('ram:AppliedAmount', $house_data['total_amount']);
        $applicableAppliedAmount->setAttribute('currencyID', $payment_details['currency']);
        $applicableFreightRateServiceCharge->appendChild($applicableAppliedAmount);
        $IncludedHouseConsignmentItem->appendChild($applicableFreightRateServiceCharge);

        //adding house consignment
        $IncludedHouseConsignment->appendChild($IncludedHouseConsignmentItem);

        // Append to the root element
        $xml->appendChild($housewaybill);
        // Prepare response as an XML download
        $xml_file_name = 'xml_houseway_bill_' . $hawb_no . '.xml';
        Storage::put('xml-conversion-files/' . $xml_file_name, $xml->saveXML());
        $send_response = $this->sendXmlToDescartes($xml_file_name);
        return $send_response;
        // return response($xml->saveXML(), 200)->header('Content-Type', 'application/xml');
    }
    function ResponseMessage()
    {

        $xmlString = '<rsm:Response xmlns:rsm="iata:response:3" xmlns:ram="iata:datamodel:3">
                        <script/>
                        <rsm:MessageHeaderDocument>
                        <ram:ID>8258f5d1-b68f-44d1-9b01-c370623003c4</ram:ID>
                        <ram:Name>Application acknowledgement and error report</ram:Name>
                        <ram:TypeCode>294</ram:TypeCode>
                        <ram:IssueDateTime>2019-07-10T20:38:50.856Z</ram:IssueDateTime>
                        <ram:PurposeCode>Response</ram:PurposeCode>
                        <ram:VersionID>3.00</ram:VersionID>
                        <ram:ConversationID>XXXXXXXXXX</ram:ConversationID>
                        <ram:SenderParty>
                        <ram:PrimaryID schemeID="C">REUAIR08AFR</ram:PrimaryID>
                        </ram:SenderParty>
                        <ram:SenderParty>
                        <ram:PrimaryID schemeID="T">QVIBDAF</ram:PrimaryID>
                        </ram:SenderParty>
                        <ram:RecipientParty>
                        <ram:PrimaryID schemeID="C">CARGEX S.A.</ram:PrimaryID>
                        </ram:RecipientParty>
                        </rsm:MessageHeaderDocument>
                        <rsm:BusinessHeaderDocument>
                        <ram:ID>810-87309320_37711</ram:ID>
                        <ram:Name>Air Waybill</ram:Name>
                        <ram:TypeCode>740</ram:TypeCode>
                        <ram:StatusCode>Rejected</ram:StatusCode>
                        </rsm:BusinessHeaderDocument>
                        <rsm:ResponseStatus>
                            <ram:ConditionCode>Error</ram:ConditionCode>
                            <ram:ReasonCode>RTD600D</ram:ReasonCode>
                            <ram:Reason>invalid spatial dimensions : unit codes are not all equal at masterConsignment.applicableRating[0].includedMasterConsignmentItem[0].transportLogisticsPackage[0].linearSpatialDimension</ram:Reason>
                            <ram:Information>MTQ</ram:Information>
                        </rsm:ResponseStatus>
                        <rsm:ResponseStatus>
                            <ram:ConditionCode>Error</ram:ConditionCode>
                            <ram:ReasonCode>RTD611E</ram:ReasonCode>
                            <ram:Reason>measure type code is not valid at masterConsignment.applicableRating[0].includedMasterConsignmentItem[0].transportLogisticsPackage[0].linearSpatialDimension.widthMeasure</ram:Reason>
                            <ram:Information>MTQ</ram:Information>
                        </rsm:ResponseStatus>
                    </rsm:Response>';

        // Create a new DOMDocument instance
        $xml = new DOMDocument;
        $xml->loadXML($xmlString);

        // Extracting elements from the XML
        $messageHeader = $xml->getElementsByTagName('MessageHeaderDocument')->item(0);
        $businessHeader = $xml->getElementsByTagName('BusinessHeaderDocument')->item(0);
        $responseStatus = $xml->getElementsByTagName('ResponseStatus')->item(0);
        $responseStatus1 = $xml->getElementsByTagName('ResponseStatus')->item(1);

        // Extracting data from the elements
        $messageId = $messageHeader->getElementsByTagName('ID')->item(0)->nodeValue;
        $messageTypeCode = $messageHeader->getElementsByTagName('TypeCode')->item(0)->nodeValue;
        $statusCode = $businessHeader->getElementsByTagName('StatusCode')->item(0)->nodeValue;
        $conditionCode = $responseStatus->getElementsByTagName('ConditionCode')->item(0)->nodeValue;
        $reason = $responseStatus->getElementsByTagName('Reason')->item(0)->nodeValue;

        $conditionCode1 = $responseStatus1->getElementsByTagName('ConditionCode')->item(0)->nodeValue;
        $reason1 = $responseStatus1->getElementsByTagName('Reason')->item(0)->nodeValue;

        // Output the extracted data (You can also store or manipulate it as needed)
        echo "Message ID: $messageId<br>";
        echo "Message Type Code: $messageTypeCode<br>";
        echo "Status Code: $statusCode<br>";
        echo "Condition Code: $conditionCode<br>";
        echo "Reason: $reason<br>";
        echo "Condition Code1: $conditionCode1<br>";
        echo "Reason1: $reason1<br>";
        echo "==========================================================<br>";
    }
    function GenericRequestMessage()
    {
        $awb_id = '571070525';
        $hawb_no = '57HOUSE10';
        $check_particular_value = 1;
        $request_code = 703;
        $waybill_data = AirwayBills::where([['id', $awb_id]])->first()->toArray();
        $house_data = HousewayBills::where([['id', $hawb_no]])->first()->toArray();
        $agent_details = Agent::where('id', 1)->limit(1)->first()->toArray();
        $message_format = config("xml_message_format.$request_code");
        $utc_current_date = gmdate("Y-m-d H:i:s");
        $utc_current_date = str_replace(' ', 'T', $utc_current_date);
        if ($request_code == 703)
            $main_data = $house_data;
        else
            $main_data = $waybill_data;

        // Start conversion to XML
        $xml = new DOMDocument('1.0', 'UTF-8');
        $xml->formatOutput = true;
        // Create root element
        $generic_request = $xml->createElementNS('iata:GenericRequest:1', 'rsm:GenericRequest');
        $generic_request->setAttribute('xmlns:rsm', 'iata:GenericRequest:1');
        $generic_request->setAttribute('xmlns', 'iata:datamodel:3');

        // Message Header Document
        $messageHeaderDocument = $xml->createElement('rsm:MessageHeaderDocument');
        $generic_request->appendChild($messageHeaderDocument);
        $messageHeaderDocument->appendChild($xml->createElement('ID', $main_data['reference_id']));
        $messageHeaderDocument->appendChild($xml->createElement('Name', 'Query'));
        $messageHeaderDocument->appendChild($xml->createElement('TypeCode', '21'));
        $messageHeaderDocument->appendChild($xml->createElement('IssueDateTime', $utc_current_date));
        $messageHeaderDocument->appendChild($xml->createElement('PurposeCode', 'Request'));
        $messageHeaderDocument->appendChild($xml->createElement('VersionID', '5.00'));

        // SenderParty
        $senderParty1 = $xml->createElement('SenderParty');
        $senderParty1->appendChild($xml->createElement('PrimaryID', 'REUAGT82INKN/BLR01'));
        $senderParty1->firstChild->setAttribute('schemeID', 'P');
        $messageHeaderDocument->appendChild($senderParty1);

        // RecipientParty
        $recipientParty2 = $xml->createElement('RecipientParty');
        $recipientParty2->appendChild($xml->createElement('PrimaryID', 'REUAIR08AFR'));
        $recipientParty2->firstChild->setAttribute('schemeID', 'C');
        $messageHeaderDocument->appendChild($recipientParty2);

        // Business Header Document
        $businessHeaderDocument = $xml->createElement('rsm:BusinessHeaderDocument');

        $businessHeaderDocument->appendChild($xml->createElement('Name', $message_format['name']));
        $businessHeaderDocument->appendChild($xml->createElement('TypeCode', $message_format['type_code']));
        $businessHeaderDocument->appendChild($xml->createElement('ShortName', $message_format['short_code']));

        $generic_request->appendChild($businessHeaderDocument);


        // Master Consignment
        $masterConsignment = $xml->createElement('rsm:MasterConsignment');

        $TransportContractDocument = $xml->createElement('TransportContractDocument');
        $TransportContractDocument->appendChild($xml->createElement('ID', $main_data['awb_code'] . '-' . $main_data['awb_no']));
        $masterConsignment->appendChild($TransportContractDocument);

        $OriginLocation = $xml->createElement('OriginLocation');
        $OriginLocation->appendChild($xml->createElement('ID', $main_data['departure_airport']));
        $masterConsignment->appendChild($OriginLocation);
        $FinalDestinationLocation = $xml->createElement('FinalDestinationLocation');
        $FinalDestinationLocation->appendChild($xml->createElement('ID', $main_data['destination_airport']));
        $masterConsignment->appendChild($FinalDestinationLocation);

        if (($request_code == 703 && !empty($check_particular_value)) || ($request_code == 34 && !empty($check_particular_value))) {
            //for getting the house waybill data
            $IncludedHouseConsignment = $xml->createElement('IncludedHouseConsignment');
            $TransportContractDocumentHouse = $xml->createElement('TransportContractDocument');
            $TransportContractDocumentHouse->appendChild($xml->createElement('ID', $house_data['id']));
            $IncludedHouseConsignment->appendChild($TransportContractDocumentHouse);

            $OriginLocation = $xml->createElement('OriginLocation');
            $OriginLocation->appendChild($xml->createElement('ID', $house_data['departure_airport']));
            $IncludedHouseConsignment->appendChild($OriginLocation);
            $FinalDestinationLocation = $xml->createElement('FinalDestinationLocation');
            $FinalDestinationLocation->appendChild($xml->createElement('ID', $house_data['destination_airport']));
            $IncludedHouseConsignment->appendChild($FinalDestinationLocation);

            $masterConsignment->appendChild($IncludedHouseConsignment);
        }

        $generic_request->appendChild($masterConsignment);
        // Append to the root element
        $xml->appendChild($generic_request);

        // Prepare response as an XML download
        return response($xml->saveXML(), 200)
            ->header('Content-Type', 'application/xml');
    }
    function StatusMessage() {}
    public function HouseManifestMessage($awb_id = "0571070525")
    {
        // Fetch data from the database (this is just sample data for now)
        $waybill_data = AirwayBills::where([['id', $awb_id]])->first()->toArray();
        $consignment_data = ConsignmentData::where([['awb_id', $awb_id]])->limit(1)->first()->toArray();
        $custom_info = OtherCustomInformation::where('awb_id', $awb_id)->get()->toArray();
        $utc_current_date = gmdate("Y-m-d H:i:s");
        $utc_current_date = str_replace(' ', 'T', $utc_current_date);
        // Start conversion to XML
        $xml = new DOMDocument();
        $xml->formatOutput = true;

        // Create root element
        $housemanifest = $xml->createElementNS('iata:housemanifest:1', 'rsm:HouseManifest');
        $housemanifest->setAttribute('xmlns:ram', 'iata:datamodel:3');
        $housemanifest->setAttribute('xmlns:rsm', 'iata:housemanifest:1');

        // Message Header Document
        $messageHeaderDocument = $xml->createElement('rsm:MessageHeaderDocument');
        $housemanifest->appendChild($messageHeaderDocument);
        $messageHeaderDocument->appendChild($xml->createElement('ram:ID', $waybill_data['awb_code'] . '-' . $waybill_data['id'] . '_' . $waybill_data['reference_id']));
        $messageHeaderDocument->appendChild($xml->createElement('ram:Name', 'Cargo Manifest'));
        $messageHeaderDocument->appendChild($xml->createElement('ram:TypeCode', '785'));
        $messageHeaderDocument->appendChild($xml->createElement('ram:IssueDateTime', $utc_current_date));
        $messageHeaderDocument->appendChild($xml->createElement('ram:PurposeCode', 'Creation'));
        $messageHeaderDocument->appendChild($xml->createElement('ram:VersionID', '3.00'));

        // SenderParty
        $senderParty1 = $xml->createElement('ram:SenderParty');
        $senderParty1->appendChild($xml->createElement('ram:PrimaryID', 'TDVAGT03BASTEST/BOM1'));
        $senderParty1->firstChild->setAttribute('schemeID', 'P');
        $messageHeaderDocument->appendChild($senderParty1);

        $recipientParty2 = $xml->createElement('ram:RecipientParty');
        $recipientParty2->appendChild($xml->createElement('ram:PrimaryID', 'TDVSYS03GLNUNADDR'));
        $recipientParty2->firstChild->setAttribute('schemeID', 'C');
        $messageHeaderDocument->appendChild($recipientParty2);

        // Business Header Document
        $businessHeaderDocument = $xml->createElement('rsm:BusinessHeaderDocument');
        $housemanifest->appendChild($businessHeaderDocument);

        $businessHeaderDocument->appendChild($xml->createElement('ram:ID', $waybill_data['awb_code'] . '-' . $waybill_data['id']));

        // Master Consignment
        $masterConsignment = $xml->createElement('rsm:MasterConsignment');
        $housemanifest->appendChild($masterConsignment);
        $masterConsignment->appendChild($xml->createElement('ram:IncludedTareGrossWeightMeasure', $consignment_data['gross_weight']))->setAttribute('unitCode', $consignment_data['weight_code'] ?? 'KGM');
        $masterConsignment->appendChild($xml->createElement('ram:ConsignmentItemQuantity', 1));
        if (!empty($consignment_data['slac']))
            $masterConsignment->appendChild($xml->createElement('ram:PackageQuantity', $consignment_data['slac']));
        $masterConsignment->appendChild($xml->createElement('ram:TotalPieceQuantity', $consignment_data['pieces']));

        $TransportContractDocument = $xml->createElement('ram:TransportContractDocument');
        $TransportContractDocument->appendChild($xml->createElement('ram:ID', $waybill_data['awb_code'] . '-' . $waybill_data['awb_no']));
        $masterConsignment->appendChild($TransportContractDocument);

        // Origin Location
        $originLocation = $xml->createElement('ram:OriginLocation');
        $originLocation->appendChild($xml->createElement('ram:ID', substr($waybill_data['departure_airport'], 0, 3)));
        $masterConsignment->appendChild($originLocation);

        // Final Destination Location
        $finalDestinationLocation = $xml->createElement('ram:FinalDestinationLocation');
        $finalDestinationLocation->appendChild($xml->createElement('ram:ID', substr($waybill_data['destination_airport'], 0, 3)));
        $masterConsignment->appendChild($finalDestinationLocation);

        for ($i = 0; $i < sizeof($custom_info); $i++) {
            $IncludedCustomsNote = $xml->createElement('ram:IncludedCustomsNote');
            $IncludedCustomsNote->appendChild($xml->createElement('ram:ContentCode', $custom_info[$i]['custom_info_identifier']));
            $IncludedCustomsNote->appendChild($xml->createElement('ram:Content', $custom_info[$i]['supplementary_info']));
            $IncludedCustomsNote->appendChild($xml->createElement('ram:SubjectCode', $custom_info[$i]['info_identifier']));
            $IncludedCustomsNote->appendChild($xml->createElement('ram:CountryID', $custom_info[$i]['country_code']));
            $masterConsignment->appendChild($IncludedCustomsNote);
        }

        //============House data====================
        $awb_code = substr($awb_id, 0, 3);
        $awb_no = substr($awb_id, 3);
        $house_data = HousewayBills::where([['awb_code', $awb_code], ['awb_no', $awb_no]])->get()->toArray();
        for ($i = 0; $i < sizeof($house_data); $i++) {
            $hawb_no = $house_data[$i]['id'];
            $house_consignment_data = ConsignmentData::where([['awb_id', $hawb_no]])->limit(1)->first()->toArray();
            $housewaybill = $xml->createElement('ram:IncludedHouseConsignment');
            $masterConsignment->appendChild($housewaybill);
            $housewaybill->appendChild($xml->createElement('ram:SequenceNumeric', $i + 1));
            $housewaybill->appendChild($xml->createElement('ram:GrossWeightMeasure', $house_consignment_data['gross_weight']))->setAttribute('unitCode', $house_consignment_data['weight_code'] ?? 'KGM');
            if (!empty($house_consignment_data['slac']))
                $housewaybill->appendChild($xml->createElement('ram:PackageQuantity', $house_consignment_data['slac']));
            $housewaybill->appendChild($xml->createElement('ram:TotalPieceQuantity', $house_consignment_data['pieces']));
            if (!empty($house_consignment_data['description']))
                $housewaybill->appendChild($xml->createElement('ram:SummaryDescription', $house_consignment_data['description']));

            $TransportContractDocument = $xml->createElement('ram:TransportContractDocument');
            $TransportContractDocument->appendChild($xml->createElement('ram:ID', $house_data[$i]['id']));
            $housewaybill->appendChild($TransportContractDocument);

            // Origin Location
            $originLocation = $xml->createElement('ram:OriginLocation');
            $originLocation->appendChild($xml->createElement('ram:ID', substr($house_data[$i]['departure_airport'], 0, 3)));
            $housewaybill->appendChild($originLocation);

            // Final Destination Location
            $finalDestinationLocation = $xml->createElement('ram:FinalDestinationLocation');
            $finalDestinationLocation->appendChild($xml->createElement('ram:ID', substr($house_data[$i]['destination_airport'], 0, 3)));
            $housewaybill->appendChild($finalDestinationLocation);

            $special_handling_info = json_decode($house_data[$i]['special_handling_info'], true);
            // Handling SPH Instructions
            for ($i = 0; $i < sizeof($special_handling_info); $i++) {
                $handlingSPHInstructions = $xml->createElement('ram:HandlingSPHInstructions');
                $handlingSPHInstructions->appendChild($xml->createElement('ram:DescriptionCode', $special_handling_info[$i]));
                $housewaybill->appendChild($handlingSPHInstructions);
            }

            if (!empty($house_data[$i]['special_service_request'])) {
                // Handling SSR Instructions
                $handlingSSRInstructions = $xml->createElement('ram:HandlingSSRInstructions');
                $handlingSSRInstructions->appendChild($xml->createElement('ram:Description', $house_data[$i]['special_service_request']));
                $housewaybill->appendChild($handlingSSRInstructions);
            }

            if (!empty($house_data[$i]['other_service_information'])) {
                // Handling SSR Instructions
                $HandlingOSIInstructions = $xml->createElement('ram:HandlingOSIInstructions');
                $HandlingOSIInstructions->appendChild($xml->createElement('ram:Description', $house_data[$i]['other_service_information']));
                $housewaybill->appendChild($HandlingOSIInstructions);
            }
            $house_custom_info = OtherCustomInformation::where('awb_id', $hawb_no)->get()->toArray();
            for ($j = 0; $j < sizeof($house_custom_info); $j++) {
                $IncludedCustomsNote = $xml->createElement('ram:IncludedCustomsNote');
                $IncludedCustomsNote->appendChild($xml->createElement('ram:ContentCode', $house_custom_info[$j]['custom_info_identifier']));
                $IncludedCustomsNote->appendChild($xml->createElement('ram:Content', $house_custom_info[$j]['supplementary_info']));
                $IncludedCustomsNote->appendChild($xml->createElement('ram:SubjectCode', $house_custom_info[$j]['info_identifier']));
                $IncludedCustomsNote->appendChild($xml->createElement('ram:CountryID', $house_custom_info[$j]['country_code']));
                $housewaybill->appendChild($IncludedCustomsNote);
            }
        }

        // Append to the root element
        $xml->appendChild($housemanifest);
        // Prepare response as an XML download HouseManifestMessage
        $xml_file_name = 'xml_house_mainfest_message_' . $awb_id . '.xml';
        Storage::put('xml-conversion-files/' . $xml_file_name, $xml->saveXML());
        $send_response = $this->sendXmlToDescartes($xml_file_name);
        return $send_response;
        // Prepare response as an XML download
        // return response($xml->saveXML(), 200)->header('Content-Type', 'application/xml');
    }
    public function DirectDataMessage($awb_id = "0571070525")
    {
        // Fetch data from the database (this is just sample data for now)
        $waybill_data = AirwayBills::where([['id', $awb_id]])->limit(1)->first()->toArray();
        $carrier_code = Ams::select('carrier_code')->where('carrier_prefix', $waybill_data['awb_code'])->limit(1)->first()->toArray()['carrier_code'];
        $house_data = HousewayBills::where([['awb_code', $waybill_data['awb_code']], ['awb_no', $waybill_data['awb_no']]])->get()->toArray();
        $waybill_address = WayBillAddress::where([['awb_id', $awb_id]])->limit(1)->first()->toArray();
        $consignment_data = ConsignmentData::where([['awb_id', $awb_id]])->limit(1)->first()->toArray();
        $agent_details = Agent::where('id', 1)->limit(1)->first()->toArray();
        $payment_details = PaymentInfo::where('awb_id', $awb_id)->limit(1)->first()->toArray();
        $other_charges = OtherCharge::where('awb_id', $awb_id)->get()->toArray();
        $custom_info = OtherCustomInformation::where('awb_id', $awb_id)->get()->toArray();
        $utc_current_date = gmdate("Y-m-d H:i:s");
        $utc_current_date = str_replace(' ', 'T', $utc_current_date);
        $time = time();

        // Start conversion to XML
        $xml = new DOMDocument('1.0', 'UTF-8');
        $xml->formatOutput = true;

        // Create root element
        $direct_data = $xml->createElementNS('iata:directdataexchange:1', 'rsm:DirectDataExchange');
        $direct_data->setAttribute('xmlns', 'iata:datamodel:3');
        $direct_data->setAttribute('xmlns:rsm', 'iata:directdataexchange:1');

        // Message Header Document
        $messageHeaderDocument = $xml->createElement('rsm:MessageHeaderDocument');
        $direct_data->appendChild($messageHeaderDocument);
        $messageHeaderDocument->appendChild($xml->createElement('ID', $time));
        $messageHeaderDocument->appendChild($xml->createElement('Name', 'Invoicing data sheet'));
        $messageHeaderDocument->appendChild($xml->createElement('TypeCode', '130'));
        $messageHeaderDocument->appendChild($xml->createElement('IssueDateTime', $utc_current_date));
        $messageHeaderDocument->appendChild($xml->createElement('PurposeCode', 'Creation'));
        $messageHeaderDocument->appendChild($xml->createElement('VersionID', '2.00'));

        // SenderParty
        $senderParty1 = $xml->createElement('SenderParty');
        $senderParty1->appendChild($xml->createElement('PrimaryID', 'REUAGT82INKN/BLR01'));
        $senderParty1->firstChild->setAttribute('schemeID', 'P');
        $messageHeaderDocument->appendChild($senderParty1);

        $recipientParty2 = $xml->createElement('RecipientParty');
        $recipientParty2->appendChild($xml->createElement('PrimaryID', 'REUAIR08AFR'));
        $recipientParty2->firstChild->setAttribute('schemeID', 'C');
        $messageHeaderDocument->appendChild($recipientParty2);

        $XDDHeader = $xml->createElement('XDDHeader');
        $XDDHeader->appendChild($xml->createElement('SequenceNumeric', '1'));
        $CarrierParty = $xml->createElement('CarrierParty');
        $CarrierParty->appendChild($xml->createElement('TwoLetterPrefixID', $carrier_code));
        $CarrierParty->appendChild($xml->createElement('ThreeLetterPrefixID', $waybill_data['awb_code']));
        $XDDHeader->appendChild($CarrierParty);
        $XDDHeader->appendChild($xml->createElement('AWBID', $waybill_data['awb_code'] . '-' . $waybill_data['awb_no']));
        $XDDHeader->appendChild($xml->createElement('AWBCheckDigitNumeric', substr($waybill_data['awb_no'], -1)));
        $XDDHeader->appendChild($xml->createElement('AWBFlownDateTime', $waybill_data['date']));
        $XDDHeader->appendChild($xml->createElement('AWBAccountDateTime', $waybill_data['execution_date_time']));
        $XDDHeader->appendChild($xml->createElement('AWBExecutionDateTime', $waybill_data['execution_date_time']));
        $XDDHeader->appendChild($xml->createElement('ConsolidationIndicator', $house_data ? 'true' : 'false'));
        $XDDHeader->appendChild($xml->createElement('ElectronicIndicator', !$waybill_data['awb'] ? 'true' : 'false'));

        // Origin Location
        $WaybillOriginLocation = $xml->createElement('WaybillOriginLocation');
        $WaybillOriginLocation->appendChild($xml->createElement('ID', $waybill_data['departure_airport']));
        $XDDHeader->appendChild($WaybillOriginLocation);

        // Final Destination Location
        $WaybillDestinationLocation = $xml->createElement('WaybillDestinationLocation');
        $WaybillDestinationLocation->appendChild($xml->createElement('ID', $waybill_data['destination_airport']));
        $XDDHeader->appendChild($WaybillDestinationLocation);

        // Freight Forwarder Party
        $freightForwarderParty = $xml->createElement('FreightForwarderParty');
        $freightForwarderParty->appendChild($xml->createElement('Name', $agent_details['agent_name']));
        $freightForwarderParty->appendChild($xml->createElement('CargoAgentID', $agent_details['iata_agent_code']));
        $freightForwarderParty->appendChild($xml->createElement('CASSAccountIndicator', 'true'));
        $freightForwarderAddress = $xml->createElement('FreightForwarderAddress');
        $freightForwarderAddress->appendChild($xml->createElement('PostcodeCode', $agent_details['agent_pincode']));
        $freightForwarderAddress->appendChild($xml->createElement('StreetName', $agent_details['agent_address']));
        $freightForwarderAddress->appendChild($xml->createElement('CityName', $agent_details['agent_city']));
        $freightForwarderAddress->appendChild($xml->createElement('CountryID', $agent_details['agent_country'])); //
        $freightForwarderParty->appendChild($freightForwarderAddress);
        $SpecifiedCargoAgentLocation = $xml->createElement('ram:SpecifiedCargoAgentLocation');
        $SpecifiedCargoAgentLocation->appendChild($xml->createElement('ram:ID', $agent_details['iata_agent_cass']));
        $freightForwarderParty->appendChild($SpecifiedCargoAgentLocation);

        $DefinedTradeContact = $xml->createElement('DefinedTradeContact');
        $DirectTelephoneCommunication = $xml->createElement('DirectTelephoneCommunication');
        $DirectTelephoneCommunication->appendChild($xml->createElement('CompleteNumber', $agent_details['agent_contact_person_phone']));
        $DefinedTradeContact->appendChild($DirectTelephoneCommunication);
        $URIEmailCommunication = $xml->createElement('URIEmailCommunication');
        $URIEmailCommunication->appendChild($xml->createElement('URIID', $agent_details['agent_contact_person_email']));
        $DefinedTradeContact->appendChild($URIEmailCommunication);
        $freightForwarderParty->appendChild($DefinedTradeContact);
        $XDDHeader->appendChild($freightForwarderParty);

        $special_handling_info = json_decode($waybill_data['special_handling_info'], true);
        $check_custome_sph = ['ACT', 'AOG', 'ATT', 'AVI', 'BIG', 'BUP', 'CAO', 'CAT', 'COL', 'COM', 'CRT', 'DGD', 'DIP', 'EAP', 'EAW', 'EAT', 'ECC', 'ELI', 'ELM', 'EMD', 'ERT', 'FIL', 'FRI', 'FRO', 'GCO', 'GOG', 'HEA', 'HEG', 'HUM', 'ICE', 'LHO', 'LIC', 'MAG', 'MAL', 'MUW', 'NDA', 'NWP', 'OBX', 'OCI', 'OHG', 'OSI', 'PAC', 'PEA', 'PEF', 'PEM', 'PEP', 'PER', 'PES', 'PIL', 'QRT', 'RAC', 'RBI', 'RBM', 'RCL', 'RCM', 'RCX', 'RDS', 'REQ', 'REX', 'RFG', 'RFL', 'RFS', 'RFW', 'RGX', 'RIS', 'RLI', 'RLM', 'RMD', 'RNG', 'ROP', 'ROX', 'RPB', 'RPG', 'RRE', 'RRW', 'RRY', 'RSB', 'RSC', 'RXB', 'RXC', 'RXD', 'RXE', 'RXG', 'RXS', 'SAL', 'SCO', 'SFX', 'SHL', 'SHR', 'SPF', 'SPX', 'SUR', 'SWP', 'VAL', 'VOL', 'VUN', 'WET', 'XPH', 'XPS'];
        // Handling SPH Instructions
        for ($i = 0; $i < sizeof($special_handling_info); $i++) {
            $handlingSPHInstructions = $xml->createElement('HandlingSPHInstructions');
            $handlingSPHInstructions->appendChild($xml->createElement('CustomizationIndicator', in_array($special_handling_info[$i], $check_custome_sph) ? 'false' : 'true'));
            $handlingSPHInstructions->appendChild($xml->createElement('DescriptionCode', $special_handling_info[$i]));
            $XDDHeader->appendChild($handlingSPHInstructions);
        }

        if (!empty($waybill_data['special_service_request'])) {
            // Handling SSR Instructions
            $handlingSSRInstructions = $xml->createElement('HandlingSSRInstructions');
            $handlingSSRInstructions->appendChild($xml->createElement('Description', $waybill_data['special_service_request']));
            $XDDHeader->appendChild($handlingSSRInstructions);
        }
        //also notify
        if (!empty($waybill_address['also_name'])) {
            $consignee_street_name = $waybill_address['also_address'] . (!empty($waybill_address['also_address_line_2']) ? ',' . $waybill_address['also_address_line_2'] : '');
            $OtherParty = $xml->createElement('OtherParty');
            $OtherParty->appendChild($xml->createElement('Name', $waybill_address['also_name']));

            $roleCode = $xml->createElement('RoleCode', 'NI');
            $roleCode->setAttribute('listID', '3035');
            $roleCode->setAttribute('listAgencyID', '6');
            $roleCode->setAttribute('listVersionID', 'D09A');
            $OtherParty->appendChild($roleCode);

            $postalStructuredAddress3 = $xml->createElement('PostalStructuredAddress');
            $postalStructuredAddress3->appendChild($xml->createElement('PostcodeCode', $waybill_address['also_post_code']));
            $postalStructuredAddress3->appendChild($xml->createElement('StreetName', $consignee_street_name));
            $postalStructuredAddress3->appendChild($xml->createElement('CityName', $waybill_address['also_city']));
            $postalStructuredAddress3->appendChild($xml->createElement('CountryID', $waybill_address['also_country']));
            // $postalStructuredAddress3->appendChild($xml->createElement('CountrySubDivisionName', $waybill_address['also_state']));
            $OtherParty->appendChild($postalStructuredAddress3);

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
                $OtherParty->appendChild($DefinedTradeContact);
            }
            $XDDHeader->appendChild($OtherParty);
        }

        if (!empty($waybill_data['other_service_information'])) {
            // Handling SSR Instructions
            $HandlingOSIInstructions = $xml->createElement('HandlingOSIInstructions');
            $HandlingOSIInstructions->appendChild($xml->createElement('Description', $waybill_data['other_service_information']));
            $XDDHeader->appendChild($HandlingOSIInstructions);
        }
        $StatisticalConsignment = $xml->createElement('StatisticalConsignment');
        $StatisticalConsignment->appendChild($xml->createElement('TotalPieceQuantity', $consignment_data['pieces']));
        $XDDHeader->appendChild($StatisticalConsignment);

        $direct_data->appendChild($XDDHeader);


        // Append to the root element
        $xml->appendChild($direct_data);

        // Prepare response as an XML download
        return response($xml->saveXML(), 200)
            ->header('Content-Type', 'application/xml');
    }
    public function CreatePartner()
    {
        $agent_details = Agent::where('id', 1)->limit(1)->first()->toArray();
        $utc_current_date = gmdate("Y-m-d H:i:s");
        $utc_current_date = str_replace(' ', 'T', $utc_current_date);
        $time = time();

        // Start conversion to XML
        $xml = new DOMDocument('1.0', 'UTF-8');
        $xml->formatOutput = true;

        // Create root element
        $register_partner = $xml->createElementNS('iata:registrationforcargopartner:1', 'rsm:RegistrationforCargoPartner');
        $register_partner->setAttribute('xmlns', 'iata:datamodel:3');
        $register_partner->setAttribute('xmlns:rsm', 'iata:registrationforcargopartner:1');

        // Message Header Document
        $messageHeaderDocument = $xml->createElement('rsm:MessageHeaderDocument');
        $register_partner->appendChild($messageHeaderDocument);
        $messageHeaderDocument->appendChild($xml->createElement('ID', $time));
        $messageHeaderDocument->appendChild($xml->createElement('Name', 'Registration document'));
        $TypeCode = $xml->createElement('TypeCode', '101');
        $TypeCode->setAttribute('listID', 1001);
        $TypeCode->setAttribute('listVersionID', 'D09A');
        $messageHeaderDocument->appendChild($TypeCode);
        $messageHeaderDocument->appendChild($xml->createElement('IssueDateTime', $utc_current_date));
        $messageHeaderDocument->appendChild($xml->createElement('PurposeCode', 'Creation'));
        $messageHeaderDocument->appendChild($xml->createElement('VersionID', '1.00'));

        // SenderParty
        $senderParty1 = $xml->createElement('SenderParty');
        $senderParty1->appendChild($xml->createElement('PrimaryID', 'REUAGT82INKN/BLR01'));
        $senderParty1->firstChild->setAttribute('schemeID', 'P');
        $messageHeaderDocument->appendChild($senderParty1);

        $recipientParty2 = $xml->createElement('RecipientParty');
        $recipientParty2->appendChild($xml->createElement('PrimaryID', 'REUAIR08AFR'));
        $recipientParty2->firstChild->setAttribute('schemeID', 'C');
        $messageHeaderDocument->appendChild($recipientParty2);

        $InformationHeaderDocument = $xml->createElement('rsm:InformationHeaderDocument');
        $InformationHeaderDocument->appendChild($xml->createElement('ID', $time));
        $register_partner->appendChild($InformationHeaderDocument);

        $RegistrationforCargoPartnerHeaderDocument = $xml->createElement('rsm:RegistrationforCargoPartnerHeaderDocument');
        $RegistrationforCargoPartnerHeaderDocument->appendChild($xml->createElement('ID', $time));
        $SpecifiedDigitalConnectArea = $xml->createElement('SpecifiedDigitalConnectArea');
        $SpecifiedDigitalConnectArea->appendChild($xml->createElement('CityID', $agent_details['agent_issue_loc_code']));
        $SpecifiedDigitalConnectArea->appendChild($xml->createElement('CityName', $agent_details['agent_city']));
        $SpecifiedDigitalConnectArea->appendChild($xml->createElement('CountryID', $agent_details['agent_country']));
        $RegistrationforCargoPartnerHeaderDocument->appendChild($SpecifiedDigitalConnectArea);

        $SpecifiedDigitalConnectParty = $xml->createElement('SpecifiedDigitalConnectParty');
        $SpecifiedDigitalConnectParty->appendChild($xml->createElement('Name', $agent_details['agent_name']));
        $RoleCode = $xml->createElement('RoleCode', 'FW');
        $RoleCode->setAttribute('listID', 3035);
        $RoleCode->setAttribute('listVersionID', 'D09A');
        $SpecifiedDigitalConnectParty->appendChild($RoleCode);
        $SpecifiedDigitalConnectParty->appendChild($xml->createElement('AccountTypeIndicator', 'true'));
        $PostalStructuredAddress = $xml->createElement('PostalStructuredAddress');
        $PostalStructuredAddress->appendChild($xml->createElement('PostcodeCode', $agent_details['agent_pincode']));
        $PostalStructuredAddress->appendChild($xml->createElement('StreetName', $agent_details['agent_address']));
        $PostalStructuredAddress->appendChild($xml->createElement('CityName', $agent_details['agent_city']));
        $PostalStructuredAddress->appendChild($xml->createElement('CountryID', $agent_details['agent_country']));
        $SpecifiedDigitalConnectParty->appendChild($PostalStructuredAddress);

        $DefinedTradeContact = $xml->createElement('DefinedTradeContact');
        $DirectTelephoneCommunication = $xml->createElement('DirectTelephoneCommunication');
        $DirectTelephoneCommunication->appendChild($xml->createElement("CompleteNumber", $agent_details['agent_contact_person_phone']));
        $DefinedTradeContact->appendChild($DirectTelephoneCommunication);

        $URIEmailCommunication = $xml->createElement('URIEmailCommunication');
        $URIEmailCommunication->appendChild($xml->createElement("URIID", $agent_details['agent_contact_person_email']));
        $DefinedTradeContact->appendChild($URIEmailCommunication);
        $SpecifiedDigitalConnectParty->appendChild($DefinedTradeContact);

        $AssociatedCargoAgentParty = $xml->createElement('AssociatedCargoAgentParty');
        $AssociatedCargoAgentParty->appendChild($xml->createElement('CargoAgentID', $agent_details['iata_agent_code']));
        $SpecifiedCargoAgentLocation = $xml->createElement('SpecifiedCargoAgentLocation');
        $SpecifiedCargoAgentLocation->appendChild($xml->createElement('ID', $agent_details['iata_agent_cass']));
        $AssociatedCargoAgentParty->appendChild($SpecifiedCargoAgentLocation);
        $SpecifiedDigitalConnectParty->appendChild($AssociatedCargoAgentParty);

        $RegistrationforCargoPartnerHeaderDocument->appendChild($SpecifiedDigitalConnectParty);

        $SpecifiedDataExchangeIdentity = $xml->createElement('SpecifiedDataExchangeIdentity');
        $SpecifiedDataExchangeIdentity->appendChild($xml->createElement('ActionTypeCode', 'Create'));
        $SpecifiedDataExchangeIdentity->appendChild($xml->createElement('TypeCode', 'PIMA'));
        $SpecifiedDataExchangeIdentity->appendChild($xml->createElement('PartyID', 'TO BE ISSUED'));
        $RegistrationforCargoPartnerHeaderDocument->appendChild($SpecifiedDataExchangeIdentity);

        //for XFWB
        $SpecifiedDataExchangeDocument = $xml->createElement('SpecifiedDataExchangeDocument');
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('TypeCode', 'Main'));
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('StandardName', 'CARGO-XML'));
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('MessageID', 'XFWB'));
        $SupportedMessageVersion = $xml->createElement('SupportedMessageVersion');
        $SupportedMessageVersion->appendChild($xml->createElement('ID', "5.00"));
        $SupportedMessageVersion->appendChild($xml->createElement('CapabilityTypeCode', 'Transmit'));
        $SpecifiedDataExchangeDocument->appendChild($SupportedMessageVersion);
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('ConversionIndicator', "false"));
        $RegistrationforCargoPartnerHeaderDocument->appendChild($SpecifiedDataExchangeDocument);

        //for XFZB
        $SpecifiedDataExchangeDocument = $xml->createElement('SpecifiedDataExchangeDocument');
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('TypeCode', 'Main'));
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('StandardName', 'CARGO-XML'));
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('MessageID', 'XFZB'));
        $SupportedMessageVersion = $xml->createElement('SupportedMessageVersion');
        $SupportedMessageVersion->appendChild($xml->createElement('ID', "5.00"));
        $SupportedMessageVersion->appendChild($xml->createElement('CapabilityTypeCode', 'Transmit'));
        $SpecifiedDataExchangeDocument->appendChild($SupportedMessageVersion);
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('ConversionIndicator', "false"));
        $RegistrationforCargoPartnerHeaderDocument->appendChild($SpecifiedDataExchangeDocument);

        //for XFHL
        $SpecifiedDataExchangeDocument = $xml->createElement('SpecifiedDataExchangeDocument');
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('TypeCode', 'Main'));
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('StandardName', 'CARGO-XML'));
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('MessageID', 'XFHL'));
        $SupportedMessageVersion = $xml->createElement('SupportedMessageVersion');
        $SupportedMessageVersion->appendChild($xml->createElement('ID', "3.00"));
        $SupportedMessageVersion->appendChild($xml->createElement('CapabilityTypeCode', 'Transmit'));
        $SpecifiedDataExchangeDocument->appendChild($SupportedMessageVersion);
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('ConversionIndicator', "false"));
        $RegistrationforCargoPartnerHeaderDocument->appendChild($SpecifiedDataExchangeDocument);

        //for XGRQ
        $SpecifiedDataExchangeDocument = $xml->createElement('SpecifiedDataExchangeDocument');
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('TypeCode', 'Main'));
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('StandardName', 'CARGO-XML'));
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('MessageID', 'XGRQ'));
        $SupportedMessageVersion = $xml->createElement('SupportedMessageVersion');
        $SupportedMessageVersion->appendChild($xml->createElement('ID', "1.00"));
        $SupportedMessageVersion->appendChild($xml->createElement('CapabilityTypeCode', 'Transmit'));
        $SpecifiedDataExchangeDocument->appendChild($SupportedMessageVersion);
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('ConversionIndicator', "false"));
        $RegistrationforCargoPartnerHeaderDocument->appendChild($SpecifiedDataExchangeDocument);

        //for XFSU
        $SpecifiedDataExchangeDocument = $xml->createElement('SpecifiedDataExchangeDocument');
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('TypeCode', 'Main'));
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('StandardName', 'CARGO-XML'));
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('MessageID', 'XFSU'));
        $SupportedMessageVersion = $xml->createElement('SupportedMessageVersion');
        $SupportedMessageVersion->appendChild($xml->createElement('ID', "6.00"));
        $SupportedMessageVersion->appendChild($xml->createElement('CapabilityTypeCode', 'Both'));
        $SpecifiedDataExchangeDocument->appendChild($SupportedMessageVersion);
        $SpecifiedDataExchangeDocument->appendChild($xml->createElement('ConversionIndicator', "false"));
        $RegistrationforCargoPartnerHeaderDocument->appendChild($SpecifiedDataExchangeDocument);
        $register_partner->appendChild($RegistrationforCargoPartnerHeaderDocument);

        $airlines = explode(',', $agent_details['agent_airlines']);
        for ($i = 0; $i < sizeof($airlines); $i++) {
            $airline_data = Airline::where('code', $airlines[$i])->limit(1)->first()->toArray();
            $PartnerInformationDocument = $xml->createElement('PartnerInformationDocument');

            $SpecifiedPartnerParty = $xml->createElement('SpecifiedPartnerParty');
            $SpecifiedPartnerParty->appendChild($xml->createElement('Name', $airline_data['name']));
            $RoleCode = $xml->createElement('RoleCode', 'CA');
            $RoleCode->setAttribute('listID', 3035);
            $RoleCode->setAttribute('listVersionID', 'D094');
            $SpecifiedPartnerParty->appendChild($RoleCode);
            $SpecifiedPartnerParty->appendChild($xml->createElement('AccountTypeIndicator', 'true'));
            $PartnerInformationDocument->appendChild($SpecifiedPartnerParty);

            $AssociatedCargoAgentParty = $xml->createElement('AssociatedCargoAgentParty');
            $AssociatedCargoAgentParty->appendChild($xml->createElement('CargoAgentID', $agent_details['iata_agent_code']));
            $SpecifiedCargoAgentLocation = $xml->createElement('SpecifiedCargoAgentLocation');
            $SpecifiedCargoAgentLocation->appendChild($xml->createElement('ID', $agent_details['iata_agent_cass']));
            $AssociatedCargoAgentParty->appendChild($SpecifiedCargoAgentLocation);
            $PartnerInformationDocument->appendChild($AssociatedCargoAgentParty);

            $AssociatedCarrierParty = $xml->createElement('AssociatedCarrierParty');
            $AssociatedCarrierParty->appendChild($xml->createElement('TwoLetterPrefixID', $airline_data['code']));
            $AssociatedCarrierParty->appendChild($xml->createElement('PrefixID', $airline_data['prefix']));
            $AssociatedCarrierParty->appendChild($xml->createElement('Name', strtoupper($airline_data['name'])));
            $PartnerInformationDocument->appendChild($AssociatedCarrierParty);

            $register_partner->appendChild($PartnerInformationDocument);
        }
        // Append to the root element
        $xml->appendChild($register_partner);

        // Prepare response as an XML download
        return response($xml->saveXML(), 200)
            ->header('Content-Type', 'application/xml');
    }
    public function sendXmlToDescartes($xml_file_name)
    {
        $fullPath = Storage::path("xml-conversion-files/$xml_file_name");
        $username = config('common-data.descartes_username');
        $password = config('common-data.descartes_password');
        $user_data = auth()->guard('user-api')->user();
        $company_id = $user_data->company_name;
        $is_testing = Company::where('id', $company_id)->value('in_testing_mode');
        $api_url = $is_testing ? config('common-data.descartes_upload_url_testing') : config('common-data.descartes_upload_url');
        $response = Http::attach(
            'file',
            file_get_contents($fullPath),
            basename($fullPath)
        )->withBasicAuth($username, $password)->post($api_url);
        if (!$response->successful()) {
            return response()->json(['error' => 'Upload failed.', 'status' => $response->status(), 'data' => $response->body()]);
        } else {
            $xml = simplexml_load_string($response->body());
            $response_data = json_decode(json_encode($xml), true);
            return response()->json([
                'status' => 'success',
                'data' => $response_data,
            ]);
            // $data = [
            //     'host' => (string) $xml->host,
            //     'service' => (string) $xml->service,
            //     'created' => (string) $xml->created,
            //     'version' => (string) $xml->version,
            //     'bytesReceived' => (int) $xml->bytesReceived,
            //     'transaction_id' => (string) $xml->tid,
            //     'error' => (string) $xml->error,
            //     'errorDetail' => (string) $xml->errorDetail,
            // ];
        }
    }
}
