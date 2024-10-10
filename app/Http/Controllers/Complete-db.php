<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns2:Waybill xmlns="iata:datamodel:3" xmlns:ns2="iata:waybill:1">
    <ns2:MessageHeaderDocument>
        <ID>057-51987552_280824093140298</ID>
        <Name>MASTER AIR WAYBILL</Name>
        <TypeCode>741</TypeCode>
        <IssueDateTime>2024-08-28T09:31:40</IssueDateTime>
        <PurposeCode>Creation</PurposeCode>
        <VersionID>3.00</VersionID>
        <SenderParty>
            <PrimaryID schemeID="C">QVIFHAF</PrimaryID>
        </SenderParty>
        <SenderParty>
            <PrimaryID schemeID="P">QVIFHAF</PrimaryID>
        </SenderParty>
        <RecipientParty>
            <PrimaryID schemeID="P">QVIBGAF</PrimaryID>
        </RecipientParty>
        <RecipientParty>
            <PrimaryID schemeID="C">QVIBGAF</PrimaryID>
        </RecipientParty>
    </ns2:MessageHeaderDocument>
    <ns2:BusinessHeaderDocument>
        <ID>057-51987552</ID>
        <IncludedHeaderNote>
            <ContentCode>C</ContentCode>
            <Content>Consolidation</Content>
        </IncludedHeaderNote>
        <SignatoryCarrierAuthentication>
            <ActualDateTime>2024-08-24T00:00:00.000</ActualDateTime>
            <Signatory>KSR FREIGHT FORWARDE</Signatory>
            <IssueAuthenticationLocation>
                <Name>BANGALORE</Name>
            </IssueAuthenticationLocation>
        </SignatoryCarrierAuthentication>
    </ns2:BusinessHeaderDocument>
    <ns2:MasterConsignment>
        <ID>PRD-DIM</ID>
        <AdditionalID>AFKL-R21|SKT-DIM</AdditionalID>
        <NilCarriageValueIndicator>true</NilCarriageValueIndicator>
        <NilCustomsValueIndicator>true</NilCustomsValueIndicator>
        <NilInsuranceValueIndicator>true</NilInsuranceValueIndicator>
        <TotalChargePrepaidIndicator>true</TotalChargePrepaidIndicator>
        <TotalDisbursementPrepaidIndicator>true</TotalDisbursementPrepaidIndicator>
        <IncludedTareGrossWeightMeasure unitCode="KGM">174</IncludedTareGrossWeightMeasure>
        <GrossVolumeMeasure unitCode="MTQ">0.92</GrossVolumeMeasure>
        <TotalPieceQuantity>25</TotalPieceQuantity>
        <ProductID>R21</ProductID>
        <ConsignorParty>
            <Name>APEXGLOBAL FORWARDERS INDIA PRIVATE</Name>
            <PostalStructuredAddress>
                <PostcodeCode>560300</PostcodeCode>
                <StreetName>NO 146 D BLOCK CARGO VILLAGE BANGAL</StreetName>
                <CityName>BANGALORE</CityName>
                <CountryID>IN</CountryID>
                <CountryName>INDIA</CountryName>
                <CountrySubDivisionName>KA</CountrySubDivisionName>
            </PostalStructuredAddress>
            <DefinedTradeContact>
                <DirectTelephoneCommunication>
                    <CompleteNumber>918778317487</CompleteNumber>
                </DirectTelephoneCommunication>
            </DefinedTradeContact>
        </ConsignorParty>
        <ConsigneeParty>
            <Name>APEX LOGISTICS INTERNATIONAL INC</Name>
            <PostalStructuredAddress>
                <PostcodeCode>98031</PostcodeCode>
                <StreetName>20608 87TH AVENUE SOUTH</StreetName>
                <CityName>KENT</CityName>
                <CountryID>US</CountryID>
                <CountryName>UNITED STATES</CountryName>
                <CountrySubDivisionName>WA</CountrySubDivisionName>
            </PostalStructuredAddress>
            <DefinedTradeContact>
                <DirectTelephoneCommunication>
                    <CompleteNumber>2065922054</CompleteNumber>
                </DirectTelephoneCommunication>
            </DefinedTradeContact>
        </ConsigneeParty>
        <FreightForwarderParty>
            <Name>KSR FREIGHT FORWARDERS PVT LTD</Name>
            <CargoAgentID>1432027</CargoAgentID>
            <FreightForwarderAddress>
                <PostcodeCode>562157</PostcodeCode>
                <StreetName>77/10, MARANAYAKANAHALLI, CHIK KAJALA VILLAGE AND POST</StreetName>
                <CityName>BANGALORE</CityName>
                <CountryID>IN</CountryID>
                <CountryName>INDIA</CountryName>
                <CountrySubDivisionName>MAYSORE</CountrySubDivisionName>
            </FreightForwarderAddress>
            <DefinedTradeContact>
                <DirectTelephoneCommunication>
                    <CompleteNumber>918778317487</CompleteNumber>
                </DirectTelephoneCommunication>
            </DefinedTradeContact>
        </FreightForwarderParty>
        <OriginLocation>
            <ID>BLR</ID>
            <Name>BENGALURU INTERNATIONAL AIRPORT</Name>
        </OriginLocation>
        <FinalDestinationLocation>
            <ID>SEA</ID>
            <Name>SEATTLE-TACOMA INTERNATIONAL AIRPORT</Name>
        </FinalDestinationLocation>
        <SpecifiedLogisticsTransportMovement>
            <StageCode>Main-Carriage</StageCode>
            <ModeCode>4</ModeCode>
            <Mode>AIR TRANSPORT</Mode>
            <ID>AF0191</ID>
            <SequenceNumeric>1</SequenceNumeric>
            <UsedLogisticsTransportMeans>
                <Name>AF</Name>
            </UsedLogisticsTransportMeans>
            <ArrivalEvent>
                <OccurrenceArrivalLocation>
                    <ID>CDG</ID>
                    <Name>CHARLES DE GAULLE AIRPORT</Name>
                    <TypeCode>Airport</TypeCode>
                </OccurrenceArrivalLocation>
            </ArrivalEvent>
            <DepartureEvent>
                <ScheduledOccurrenceDateTime>2024-08-26T00:00:00.000</ScheduledOccurrenceDateTime>
                <OccurrenceDepartureLocation>
                    <ID>BLR</ID>
                    <Name>BENGALURU INTERNATIONAL AIRPORT</Name>
                    <TypeCode>Airport</TypeCode>
                </OccurrenceDepartureLocation>
            </DepartureEvent>
        </SpecifiedLogisticsTransportMovement>
        <SpecifiedLogisticsTransportMovement>
            <StageCode>Main-Carriage</StageCode>
            <SequenceNumeric>2</SequenceNumeric>
            <UsedLogisticsTransportMeans>
                <Name>AF</Name>
            </UsedLogisticsTransportMeans>
            <ArrivalEvent>
                <OccurrenceArrivalLocation>
                    <ID>SEA</ID>
                    <Name>SEATTLE-TACOMA INTERNATIONAL AIRPORT</Name>
                    <TypeCode>Airport</TypeCode>
                </OccurrenceArrivalLocation>
            </ArrivalEvent>
            <DepartureEvent>
                <OccurrenceDepartureLocation>
                    <ID>CDG</ID>
                    <Name>CHARLES DE GAULLE AIRPORT</Name>
                    <TypeCode>Airport</TypeCode>
                </OccurrenceDepartureLocation>
            </DepartureEvent>
        </SpecifiedLogisticsTransportMovement>


        <HandlingSPHInstructions>
            <DescriptionCode>ECC</DescriptionCode>
        </HandlingSPHInstructions>

        <HandlingSPHInstructions>
            <Description>SECURED FRGHT P C</Description>
            <DescriptionCode>SPX</DescriptionCode>
        </HandlingSPHInstructions>
        <HandlingSPHInstructions>
            <Description>ELECTR. AWB AND DOCS</Description>
            <DescriptionCode>EAP</DescriptionCode>
        </HandlingSPHInstructions>
        <HandlingOSIInstructions>
            <Description>PRD-DIM PRDCODE AFKL-R21 SKT-DIM</Description>
        </HandlingOSIInstructions>

        <IncludedCustomsNote>
            <ContentCode>RA</ContentCode>
            <Content>00001-02</Content>
            <SubjectCode>ISS</SubjectCode>
            <CountryID>IN</CountryID>
        </IncludedCustomsNote>

        <IncludedCustomsNote>
            <ContentCode>ED</ContentCode>
            <Content>0924</Content>
            <SubjectCode>ISS</SubjectCode>
            <CountryID>IN</CountryID>
        </IncludedCustomsNote>

        <IncludedCustomsNote>
            <ContentCode>SM</ContentCode>
            <Content>XRY</Content>
            <SubjectCode>ISS</SubjectCode>
            <CountryID>IN</CountryID>
        </IncludedCustomsNote>

        <IncludedCustomsNote>
            <ContentCode>SN</ContentCode>
            <Content>SHIJU P SAM SAMUEL KUTTY</Content>
            <SubjectCode>ISS</SubjectCode>
            <CountryID>IN</CountryID>
        </IncludedCustomsNote>

        <IncludedCustomsNote>
            <ContentCode>SD</ContentCode>
            <Content>25AUG241352</Content>
            <SubjectCode>ISS</SubjectCode>
            <CountryID>IN</CountryID>
        </IncludedCustomsNote>

        <IncludedCustomsNote>
            <ContentCode>RA</ContentCode>
            <Content>03001-12</Content>
            <SubjectCode>OSS</SubjectCode>
            <CountryID>FR</CountryID>
        </IncludedCustomsNote>

        <IncludedCustomsNote>
            <ContentCode>ED</ContentCode>
            <Content>0926</Content>
        </IncludedCustomsNote>

        <IncludedCustomsNote>
            <ContentCode>SN</ContentCode>
            <Content>Belise Veronique</Content>
        </IncludedCustomsNote>

        <AssociatedConsignmentCustomsProcedure>
            <GoodsStatusCode>T1</GoodsStatusCode>
        </AssociatedConsignmentCustomsProcedure>

        <ApplicableOriginCurrencyExchange>
            <SourceCurrencyCode>INR</SourceCurrencyCode>
        </ApplicableOriginCurrencyExchange>

        <ApplicableLogisticsServiceCharge>
            <TransportPaymentMethodCode>PX</TransportPaymentMethodCode>
        </ApplicableLogisticsServiceCharge>

        <ApplicableRating>
            <TypeCode>F</TypeCode>
            <TotalChargeAmount currencyID="INR">91872</TotalChargeAmount>
            <ConsignmentItemQuantity>1</ConsignmentItemQuantity>
            <IncludedMasterConsignmentItem>
                <SequenceNumeric>1</SequenceNumeric>
                <TypeCode listAgencyID="1">62064000</TypeCode>
                <GrossWeightMeasure unitCode="KGM">174</GrossWeightMeasure>
                <GrossVolumeMeasure unitCode="MTQ">0.92</GrossVolumeMeasure>
                <PieceQuantity>25</PieceQuantity>
                <NatureIdentificationTransportCargo>
                    <Identification>CONSOLIDATION</Identification>
                </NatureIdentificationTransportCargo>
                <TransportLogisticsPackage>
                    <ItemQuantity>22</ItemQuantity>
                    <GrossWeightMeasure unitCode="KGM">22</GrossWeightMeasure>
                    <LinearSpatialDimension>
                        <WidthMeasure unitCode="CMT">14</WidthMeasure>
                        <LengthMeasure unitCode="CMT">56</LengthMeasure>
                        <HeightMeasure unitCode="CMT">46</HeightMeasure>
                    </LinearSpatialDimension>
                </TransportLogisticsPackage>
                <TransportLogisticsPackage>
                    <ItemQuantity>3</ItemQuantity>
                    <GrossWeightMeasure unitCode="KGM">3</GrossWeightMeasure>
                    <LinearSpatialDimension>
                        <WidthMeasure unitCode="CMT">17</WidthMeasure>
                        <LengthMeasure unitCode="CMT">56</LengthMeasure>
                        <HeightMeasure unitCode="CMT">46</HeightMeasure>
                    </LinearSpatialDimension>
                </TransportLogisticsPackage>
                <ApplicableFreightRateServiceCharge>
                    <CategoryCode>Q</CategoryCode>
                    <ChargeableWeightMeasure unitCode="KGM">174</ChargeableWeightMeasure>
                    <AppliedRate>528</AppliedRate>
                    <AppliedAmount currencyID="INR">91872</AppliedAmount>
                </ApplicableFreightRateServiceCharge>
            </IncludedMasterConsignmentItem>
        </ApplicableRating>




        
        <ApplicableTotalRating>
            <TypeCode>F</TypeCode>
            <ApplicablePrepaidCollectMonetarySummation>
                <PrepaidIndicator>true</PrepaidIndicator>
                <WeightChargeTotalAmount currencyID="INR">91872</WeightChargeTotalAmount>
                <GrandTotalAmount currencyID="INR">91872</GrandTotalAmount>
            </ApplicablePrepaidCollectMonetarySummation>
        </ApplicableTotalRating>
    </ns2:MasterConsignment>
</ns2:Waybill>