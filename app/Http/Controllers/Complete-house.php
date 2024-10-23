<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns2:HouseWaybill xmlns="iata:datamodel:3" xmlns:ns2="iata:housewaybill:1">
    <ns2:MessageHeaderDocument>
        <ID>AEMAA2400723_a7259879-a15f-491f-ad1d-ae3ea19abc13</ID>
        <Name>House waybill</Name>
        <TypeCode>703</TypeCode>
        <IssueDateTime>2024-08-25T21:47:00.000</IssueDateTime>
        <PurposeCode>Creation</PurposeCode>
        <VersionID>3.00</VersionID>
        <SenderParty>
            <PrimaryID schemeID="C">QVIDOAF</PrimaryID>
        </SenderParty>
        <RecipientParty>
            <PrimaryID schemeID="C">QVIBGAF</PrimaryID>
        </RecipientParty>
    </ns2:MessageHeaderDocument>
    <ns2:BusinessHeaderDocument>
        <ID>AEMAA2400723</ID>
        <SignatoryConsignorAuthentication>
            <Signatory>GOKALDAS EXPORTS LTD</Signatory>
        </SignatoryConsignorAuthentication>
        <SignatoryCarrierAuthentication>
            <ActualDateTime>2024-08-25T14:20:47.257</ActualDateTime>
            <Signatory>UNSIGNED</Signatory>
        </SignatoryCarrierAuthentication>
    </ns2:BusinessHeaderDocument>
    <ns2:MasterConsignment>
        <IncludedTareGrossWeightMeasure unitCode="KGM">174</IncludedTareGrossWeightMeasure>
        <TotalPieceQuantity>25</TotalPieceQuantity>

        <TransportContractDocument>
            <ID>057-51987552</ID>
        </TransportContractDocument>
        <OriginLocation>
            <ID>BLR</ID>
        </OriginLocation>
        <FinalDestinationLocation>
            <ID>SEA</ID>
        </FinalDestinationLocation>
        <IncludedHouseConsignment>
            <NilCarriageValueIndicator>true</NilCarriageValueIndicator>
            <NilCustomsValueIndicator>true</NilCustomsValueIndicator>
            <NilInsuranceValueIndicator>true</NilInsuranceValueIndicator>
            <TotalChargePrepaidIndicator>true</TotalChargePrepaidIndicator>
            <WeightTotalChargeAmount currencyID="INR">174</WeightTotalChargeAmount>
            <IncludedTareGrossWeightMeasure unitCode="KGM">174</IncludedTareGrossWeightMeasure>
            <PackageQuantity>25</PackageQuantity>
            <TotalPieceQuantity>25</TotalPieceQuantity>
            <SummaryDescription>100 POLYESTER</SummaryDescription>
            <ConsignorParty>
                <Name>GOKALDAS EXPORTS LTD</Name>
                <PostalStructuredAddress>
                    <PostcodeCode>560022</PostcodeCode>
                    <StreetName>NO 25 2ND CROSS 3RD MAIN INDUSTRIAL</StreetName>
                    <CityName>BANGALORE</CityName>
                    <CountryID>IN</CountryID>
                    <CountrySubDivisionID>KA</CountrySubDivisionID>
                </PostalStructuredAddress>
            </ConsignorParty>
            <ConsigneeParty>
                <Name>SANMAR CORPORATION</Name>
                <PostalStructuredAddress>
                    <PostcodeCode>98027</PostcodeCode>
                    <StreetName>30500 SE 79TH ST</StreetName>
                    <CityName>ISSAQUAH</CityName>
                    <CountryID>US</CountryID>
                    <CountrySubDivisionName>WAYANAD K</CountrySubDivisionName>
                    <CountrySubDivisionID>WA</CountrySubDivisionID>
                </PostalStructuredAddress>
            </ConsigneeParty>
            <OriginLocation>
                <ID>BLR</ID>
            </OriginLocation>
            <FinalDestinationLocation>
                <ID>SEA</ID>
            </FinalDestinationLocation>
            <SpecifiedLogisticsTransportMovement>
                <StageCode>MAIN-CARRIAGE</StageCode>
                <ModeCode>4</ModeCode>
                <Mode>AIR TRANSPORT</Mode>
                <ID>AF0191</ID>
                <DepartureEvent>
                    <ScheduledOccurrenceDateTime>2024-08-26T01:45:00.000Z</ScheduledOccurrenceDateTime>
                </DepartureEvent>
            </SpecifiedLogisticsTransportMovement>
            <ApplicableOriginCurrencyExchange>
                <SourceCurrencyCode>INR</SourceCurrencyCode>
            </ApplicableOriginCurrencyExchange>
            <IncludedHouseConsignmentItem>
                <TypeCode>62064000</TypeCode>
                <GrossWeightMeasure unitCode="KGM">174</GrossWeightMeasure>
                <PieceQuantity>25</PieceQuantity>
                <NatureIdentificationTransportCargo>
                    <Identification>100 POLYESTER</Identification>
                </NatureIdentificationTransportCargo>
                <ApplicableFreightRateServiceCharge>
                    <ChargeableWeightMeasure unitCode="KGM">174</ChargeableWeightMeasure>
                </ApplicableFreightRateServiceCharge>
            </IncludedHouseConsignmentItem>
        </IncludedHouseConsignment>
    </ns2:MasterConsignment>
</ns2:HouseWaybill>