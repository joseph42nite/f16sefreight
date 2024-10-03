<?php

namespace App\Http\Controllers;

use App\AirwayBills;
use App\WayBillAddress;
use App\ConsignmentData;
use Illuminate\Http\Request;
use DOMDocument;

class ConversionController extends Controller
{
    public function WayBillConversion($awb_id = 1070525)
    {
        // Fetch data from the database (this is just sample data for now)
        $waybill_data = AirwayBills::where([['id', $awb_id]])->first()->toArray();
        $waybill_address = WayBillAddress::where([['awb_id', $awb_id]])->limit(1)->get()->toArray();
        $consignment_data = ConsignmentData::where([['awb_id', $awb_id]])->limit(1)->get()->toArray();
        $utc_current_date=gmdate("Y-m-d H:i:s");
        $time=time();
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
        $messageHeaderDocument->appendChild($xml->createElement('ID', $waybill_data['awb_code'] . '-' . $waybill_data['id'].'_'.$time));
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
        $includedHeaderNote->appendChild($xml->createElement('ContentCode', 'C'));
        $includedHeaderNote->appendChild($xml->createElement('Content', 'Consolidation'));
        $businessHeaderDocument->appendChild($includedHeaderNote);

        // Signatory Consignor Authentication
        $signatoryConsignorAuth = $xml->createElement('SignatoryConsignorAuthentication');
        $signatoryConsignorAuth->appendChild($xml->createElement('ActualDateTime',$waybill_data['updated_at']));
        $signatoryConsignorAuth->appendChild($xml->createElement('Signatory', 'Shubha Covilakum'));
        $businessHeaderDocument->appendChild($signatoryConsignorAuth);

        // Signatory Carrier Authentication
        $signatoryCarrierAuth = $xml->createElement('SignatoryCarrierAuthentication');
        $signatoryCarrierAuth->appendChild($xml->createElement('ActualDateTime', '2014-01-27T00:00:00'));
        $signatoryCarrierAuth->appendChild($xml->createElement('Signatory', 'KUEHNE + NAGEL PV'));

        $issueAuthLocation = $xml->createElement('IssueAuthenticationLocation');
        $issueAuthLocation->appendChild($xml->createElement('Name', 'BANGALORE'));
        $signatoryCarrierAuth->appendChild($issueAuthLocation);
        $businessHeaderDocument->appendChild($signatoryCarrierAuth);

        // Master Consignment
        $masterConsignment = $xml->createElement('ns2:MasterConsignment');
        $waybill->appendChild($masterConsignment);

        $masterConsignment->appendChild($xml->createElement('FreightForwarderAssignedID', '4733285340108900'));
        $masterConsignment->appendChild($xml->createElement('NilCarriageValueIndicator', 'true'));
        $masterConsignment->appendChild($xml->createElement('NilCustomsValueIndicator', 'true'));
        $masterConsignment->appendChild($xml->createElement('NilInsuranceValueIndicator', 'true'));
        $masterConsignment->appendChild($xml->createElement('TotalChargePrepaidIndicator', 'P'));
        $masterConsignment->appendChild($xml->createElement('TotalDisbursementPrepaidIndicator', 'P'));
        $masterConsignment->appendChild($xml->createElement('IncludedTareGrossWeightMeasure', '1834.0'))->setAttribute('unitCode', 'KGM');
        $masterConsignment->appendChild($xml->createElement('TotalPieceQuantity', '7'));
        $masterConsignment->appendChild($xml->createElement('ProductID', 'DIM'));

        // Consignor Party
        $consignorParty = $xml->createElement('ConsignorParty');
        $consignorParty->appendChild($xml->createElement('Name', 'KUEHNE + NAGEL PVT. LTD. MUNEESH LEGACY II FLOOR'));
        $postalStructuredAddress1 = $xml->createElement('PostalStructuredAddress');
        $postalStructuredAddress1->appendChild($xml->createElement('PostcodeCode', '560 071'));
        $postalStructuredAddress1->appendChild($xml->createElement('StreetName', '156/1 DOMLUR VILLAGE'));
        $postalStructuredAddress1->appendChild($xml->createElement('CityName', 'BANGALORE'));
        $postalStructuredAddress1->appendChild($xml->createElement('CountryID', 'IN'));
        $postalStructuredAddress1->appendChild($xml->createElement('CountryName', 'INDIA'));
        $consignorParty->appendChild($postalStructuredAddress1);
        $masterConsignment->appendChild($consignorParty);

        // Consignee Party
        $consigneeParty = $xml->createElement('ConsigneeParty');
        $consigneeParty->appendChild($xml->createElement('Name', 'KUEHNE + NAGEL (FRANCE) S.A. AEROPORT CHARLES DE GAULLE'));
        $postalStructuredAddress2 = $xml->createElement('PostalStructuredAddress');
        $postalStructuredAddress2->appendChild($xml->createElement('PostcodeCode', '95707'));
        $postalStructuredAddress2->appendChild($xml->createElement('StreetName', 'BP 16417'));
        $postalStructuredAddress2->appendChild($xml->createElement('CityName', 'Paris'));
        $postalStructuredAddress2->appendChild($xml->createElement('CountryID', 'FR'));
        $consigneeParty->appendChild($postalStructuredAddress2);
        $masterConsignment->appendChild($consigneeParty);

        // Freight Forwarder Party
        $freightForwarderParty = $xml->createElement('FreightForwarderParty');
        $freightForwarderParty->appendChild($xml->createElement('Name', 'KUEHNE + NAGEL PVT. LTD. MUNEESH LEGACY II FLOOR'));
        $freightForwarderParty->appendChild($xml->createElement('CargoAgentID', '1433544'));
        $freightForwarderAddress = $xml->createElement('FreightForwarderAddress');
        $freightForwarderAddress->appendChild($xml->createElement('PostcodeCode', '560 071'));
        $freightForwarderAddress->appendChild($xml->createElement('StreetName', '156/1 DOMLUR VILLAGE'));
        $freightForwarderAddress->appendChild($xml->createElement('CityName', 'BANGALORE'));
        $freightForwarderAddress->appendChild($xml->createElement('CountryID', 'IN'));
        $freightForwarderParty->appendChild($freightForwarderAddress);
        $specifiedCargoAgentLocation = $xml->createElement('SpecifiedCargoAgentLocation');
        $specifiedCargoAgentLocation->appendChild($xml->createElement('ID', '0022'));
        $freightForwarderParty->appendChild($specifiedCargoAgentLocation);
        $masterConsignment->appendChild($freightForwarderParty);

        // Origin Location
        $originLocation = $xml->createElement('OriginLocation');
        $originLocation->appendChild($xml->createElement('ID', 'BLR'));
        $originLocation->appendChild($xml->createElement('Name', 'BANGALORE'));
        $masterConsignment->appendChild($originLocation);

        // Final Destination Location
        $finalDestinationLocation = $xml->createElement('FinalDestinationLocation');
        $finalDestinationLocation->appendChild($xml->createElement('ID', 'CDG'));
        $finalDestinationLocation->appendChild($xml->createElement('Name', 'AEROPORT CHARLES DE GAULLE'));
        $masterConsignment->appendChild($finalDestinationLocation);

        // Create the SpecifiedLogisticsTransportMovement element
        $specifiedLogisticsTransportMovement = $xml->createElement('SpecifiedLogisticsTransportMovement');

        // Stage Code
        $specifiedLogisticsTransportMovement->appendChild($xml->createElement('StageCode', 'MAIN-CARRIAGE'));
        // ID
        $specifiedLogisticsTransportMovement->appendChild($xml->createElement('ID', 'AF991'));
        // Sequence Numeric
        $specifiedLogisticsTransportMovement->appendChild($xml->createElement('SequenceNumeric', '1'));

        // Used Logistics Transport Means
        $usedLogisticsTransportMeans = $xml->createElement('UsedLogisticsTransportMeans');
        $usedLogisticsTransportMeans->appendChild($xml->createElement('Name', 'AF'));
        $specifiedLogisticsTransportMovement->appendChild($usedLogisticsTransportMeans);

        // Arrival Event
        $arrivalEvent = $xml->createElement('ArrivalEvent');
        $occurrenceArrivalLocation = $xml->createElement('OccurrenceArrivalLocation');
        $occurrenceArrivalLocation->appendChild($xml->createElement('ID', 'CDG'));
        $occurrenceArrivalLocation->appendChild($xml->createElement('TypeCode', 'AIRPORT'));
        $arrivalEvent->appendChild($occurrenceArrivalLocation);
        $specifiedLogisticsTransportMovement->appendChild($arrivalEvent);

        // Departure Event
        $departureEvent = $xml->createElement('DepartureEvent');
        $departureEvent->appendChild($xml->createElement('ScheduledOccurrenceDateTime', '2014-01-28T00:00:00'));
        $specifiedLogisticsTransportMovement->appendChild($departureEvent);

        $masterConsignment->appendChild($specifiedLogisticsTransportMovement);

        // Handling SPH Instructions
        $handlingSPHInstructions = $xml->createElement('HandlingSPHInstructions');
        $handlingSPHInstructions->appendChild($xml->createElement('DescriptionCode', 'EAW'));
        $masterConsignment->appendChild($handlingSPHInstructions);

        // Handling SSR Instructions
        $handlingSSRInstructions = $xml->createElement('HandlingSSRInstructions');
        $handlingSSRInstructions->appendChild($xml->createElement('Description', 'PLS INFORM CONSINGEE UPON ARRIVAL. DOCS ATTD TO THE HAWB'));
        $masterConsignment->appendChild($handlingSSRInstructions);

        // Included Accounting Note
        $includedAccountingNote = $xml->createElement('IncludedAccountingNote');
        $includedAccountingNote->appendChild($xml->createElement('ContentCode', 'GEN'));
        $includedAccountingNote->appendChild($xml->createElement('Content', 'PAYMENT BY CERTIFIED CHEQUE'));
        $masterConsignment->appendChild($includedAccountingNote);

        // Applicable Origin Currency Exchange
        $applicableOriginCurrencyExchange = $xml->createElement('ApplicableOriginCurrencyExchange');
        $applicableOriginCurrencyExchange->appendChild($xml->createElement('SourceCurrencyCode', 'INR'));
        $masterConsignment->appendChild($applicableOriginCurrencyExchange);

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
    public function check(){
        echo gmdate("Y-m-d H:i:s"); 
    }
}
