import pdfplumber
import re
import json
import sys
from typing import List, Dict, Any, Optional
from pathlib import Path

def load_boxes_config(config_path: str = "boxes_config.json") -> Dict[str, Any]:
    """Load boxes configuration from JSON file"""
    try:
        with open(config_path, 'r') as f:
            config = json.load(f)
            return config.get('templates', {})
    except FileNotFoundError:
        print(f"Error: Configuration file '{config_path}' not found.")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in configuration file: {e}")
        sys.exit(1)

def extract_email(text: str) -> Optional[str]:
    """Extract email address from text"""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(email_pattern, text)
    return match.group(0) if match else None

def extract_phone(text: str) -> Optional[str]:
    """Extract phone number from text (looks for PHONE, TEL keywords)"""
    phone_pattern = r'(?:PHONE|TEL|Phone|Tel)\s*:\s*([+\d\s()-]+)'
    match = re.search(phone_pattern, text, re.IGNORECASE)
    return match.group(1).strip() if match else None

def extract_fax(text: str) -> Optional[str]:
    """Extract fax number from text"""
    fax_pattern = r'(?:FAX|Fax)\s*:\s*([+\d\s()-]+)'
    match = re.search(fax_pattern, text, re.IGNORECASE)
    return match.group(1).strip() if match else None

def extract_eori(text: str) -> Optional[str]:
    """Extract EORI number from text"""
    eori_pattern = r'(?:EORI|Eori)\s*:\s*([A-Z0-9]+)'
    match = re.search(eori_pattern, text, re.IGNORECASE)
    return match.group(1).strip() if match else None

def extract_pin(text: str) -> Optional[str]:
    """Extract PIN/postal code from text"""
    pin_pattern = r'\b\d{5,6}\b'
    match = re.search(pin_pattern, text)
    return match.group(0) if match else None

def extract_country(text: str) -> Optional[str]:
    """Extract country from address"""
    countries = [
        r'\bU\.?S\.?A\.?\b',
        r'\bUNITED STATES OF AMERICA\b',
        r'\bUNITED STATES\b',
        r'\bINDIA\b',
        r'\bDENMARK\b',
        r'\bGERMANY\b',
        r'\bCHINA\b',
        r'\bJAPAN\b',
        r'\bUNITED KINGDOM\b',
        r'\bU\.?K\.?\b',
        r'\bFRANCE\b',
        r'\bITALY\b',
        r'\bSPAIN\b',
        r'\bCANADA\b',
        r'\bAUSTRALIA\b',
        r'\bBRAZIL\b',
        r'\bMEXICO\b',
        r'\bNETHERLANDS\b',
        r'\bBELGIUM\b',
        r'\bSWITZERLAND\b',
        r'\bSWEDEN\b',
        r'\bNORWAY\b',
        r'\bFINLAND\b',
        r'\bPOLAND\b',
        r'\bTURKEY\b',
        r'\bSOUTH KOREA\b',
        r'\bSINGAPORE\b',
        r'\bMALAYSIA\b',
        r'\bTHAILAND\b',
        r'\bVIETNAM\b',
        r'\bINDONESIA\b',
        r'\bPHILIPPINES\b',
        r'\bUAE\b',
        r'\bUNITED ARAB EMIRATES\b',
        r'\bSAUDI ARABIA\b',
        r'\bSOUTH AFRICA\b',
        r'\bNEW ZEALAND\b',
        r'\bIRELAND\b',
        r'\bPORTUGAL\b',
        r'\bAUSTRIA\b',
        r'\bCZECH REPUBLIC\b',
        r'\bHUNGARY\b',
        r'\bROMANIA\b',
        r'\bAFGHANISTAN\b',
    r'\bISLAMIC REPUBLIC OF AFGHANISTAN\b',
    r'\bALBANIA\b',
    r'\bREPUBLIC OF ALBANIA\b',
    r'\bALGERIA\b',
    r'\bPEOPLE\'S DEMOCRATIC REPUBLIC OF ALGERIA\b',
    r'\bANDORRA\b',
    r'\bPRINCIPALITY OF ANDORRA\b',
    r'\bANGOLA\b',
    r'\bREPUBLIC OF ANGOLA\b',
    r'\bANTIGUA AND BARBUDA\b',
    r'\bARGENTINA\b',
    r'\bREPUBLIC OF ARGENTINA\b',
    r'\bARMENIA\b',
    r'\bREPUBLIC OF ARMENIA\b',
    r'\bAZERBAIJAN\b',
    r'\bREPUBLIC OF AZERBAIJAN\b',
    r'\bBAHAMAS\b',
    r'\bCOMMONWEALTH OF THE BAHAMAS\b',
    r'\bBAHRAIN\b',
    r'\bKINGDOM OF BAHRAIN\b',
    r'\bBANGLADESH\b',
    r'\bPEOPLE\'S REPUBLIC OF BANGLADESH\b',
    r'\bBARBADOS\b',
    r'\bBELARUS\b',
    r'\bREPUBLIC OF BELARUS\b',
    r'\bBELIZE\b',
    r'\bBENIN\b',
    r'\bREPUBLIC OF BENIN\b',
    r'\bBHUTAN\b',
    r'\bKINGDOM OF BHUTAN\b',
    r'\bBOLIVIA\b',
    r'\bPLURINATIONAL STATE OF BOLIVIA\b',
    r'\bBOSNIA AND HERZEGOVINA\b',
    r'\bBOTSWANA\b',
    r'\bREPUBLIC OF BOTSWANA\b',
    r'\bBRUNEI\b',
    r'\bBRUNEI DARUSSALAM\b',
    r'\bBULGARIA\b',
    r'\bREPUBLIC OF BULGARIA\b',
    r'\bBURKINA FASO\b',
    r'\bBURUNDI\b',
    r'\bREPUBLIC OF BURUNDI\b',
    r'\bCABO VERDE\b',
    r'\bCAPE VERDE\b',
    r'\bREPUBLIC OF CABO VERDE\b',
    r'\bCAMBODIA\b',
    r'\bKINGDOM OF CAMBODIA\b',
    r'\bCAMEROON\b',
    r'\bREPUBLIC OF CAMEROON\b',
    r'\bCENTRAL AFRICAN REPUBLIC\b',
    r'\bCHAD\b',
    r'\bREPUBLIC OF CHAD\b',
    r'\bCHILE\b',
    r'\bREPUBLIC OF CHILE\b',
    r'\bCOLOMBIA\b',
    r'\bREPUBLIC OF COLOMBIA\b',
    r'\bCOMOROS\b',
    r'\bUNION OF THE COMOROS\b',
    r'\bCONGO\b',
    r'\bREPUBLIC OF THE CONGO\b',
    r'\bCONGO BRAZZAVILLE\b',
    r'\bDEMOCRATIC REPUBLIC OF THE CONGO\b',
    r'\bDRC\b',
    r'\bCONGO KINSHASA\b',
    r'\bCOSTA RICA\b',
    r'\bREPUBLIC OF COSTA RICA\b',
    r'\bCROATIA\b',
    r'\bREPUBLIC OF CROATIA\b',
    r'\bCUBA\b',
    r'\bREPUBLIC OF CUBA\b',
    r'\bCYPRUS\b',
    r'\bREPUBLIC OF CYPRUS\b',
    r'\bDJIBOUTI\b',
    r'\bREPUBLIC OF DJIBOUTI\b',
    r'\bDOMINICA\b',
    r'\bCOMMONWEALTH OF DOMINICA\b',
    r'\bDOMINICAN REPUBLIC\b',
    r'\bECUADOR\b',
    r'\bREPUBLIC OF ECUADOR\b',
    r'\bEGYPT\b',
    r'\bARAB REPUBLIC OF EGYPT\b',
    r'\bEL SALVADOR\b',
    r'\bREPUBLIC OF EL SALVADOR\b',
    r'\bEQUATORIAL GUINEA\b',
    r'\bREPUBLIC OF EQUATORIAL GUINEA\b',
    r'\bERITREA\b',
    r'\bSTATE OF ERITREA\b',
    r'\bESTONIA\b',
    r'\bREPUBLIC OF ESTONIA\b',
    r'\bESWATINI\b',
    r'\bSWAZILAND\b',
    r'\bKINGDOM OF ESWATINI\b',
    r'\bETHIOPIA\b',
    r'\bFEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA\b',
    r'\bFIJI\b',
    r'\bREPUBLIC OF FIJI\b',
    r'\bGABON\b',
    r'\bGABONESE REPUBLIC\b',
    r'\bGAMBIA\b',
    r'\bREPUBLIC OF THE GAMBIA\b',
    r'\bGEORGIA\b',
    r'\bGHANA\b',
    r'\bREPUBLIC OF GHANA\b',
    r'\bGREECE\b',
    r'\bHELLENIC REPUBLIC\b',
    r'\bGRENADA\b',
    r'\bGUATEMALA\b',
    r'\bREPUBLIC OF GUATEMALA\b',
    r'\bGUINEA\b',
    r'\bREPUBLIC OF GUINEA\b',
    r'\bGUINEA-BISSAU\b',
    r'\bREPUBLIC OF GUINEA-BISSAU\b',
    r'\bGUYANA\b',
    r'\bCOOPERATIVE REPUBLIC OF GUYANA\b',
    r'\bHAITI\b',
    r'\bREPUBLIC OF HAITI\b',
    r'\bHONDURAS\b',
    r'\bREPUBLIC OF HONDURAS\b',
    r'\bICELAND\b',
    r'\bREPUBLIC OF ICELAND\b',
    r'\bIRAN\b',
    r'\bISLAMIC REPUBLIC OF IRAN\b',
    r'\bIRAQ\b',
    r'\bREPUBLIC OF IRAQ\b',
    r'\bISRAEL\b',
    r'\bSTATE OF ISRAEL\b',
    r'\bJAMAICA\b',
    r'\bJORDAN\b',
    r'\bHASHEMITE KINGDOM OF JORDAN\b',
    r'\bKAZAKHSTAN\b',
    r'\bREPUBLIC OF KAZAKHSTAN\b',
    r'\bKENYA\b',
    r'\bREPUBLIC OF KENYA\b',
    r'\bKIRIBATI\b',
    r'\bREPUBLIC OF KIRIBATI\b',
    r'\bNORTH KOREA\b',
    r'\bDEMOCRATIC PEOPLE\'S REPUBLIC OF KOREA\b',
    r'\bDPRK\b',
    r'\bKUWAIT\b',
    r'\bSTATE OF KUWAIT\b',
    r'\bKYRGYZSTAN\b',
    r'\bKYRGYZ REPUBLIC\b',
    r'\bLAOS\b',
    r'\bLAO PEOPLE\'S DEMOCRATIC REPUBLIC\b',
    r'\bLATVIA\b',
    r'\bREPUBLIC OF LATVIA\b',
    r'\bLEBANON\b',
    r'\bREPUBLIC OF LEBANON\b',
    r'\bLESOTHO\b',
    r'\bKINGDOM OF LESOTHO\b',
    r'\bLIBERIA\b',
    r'\bREPUBLIC OF LIBERIA\b',
    r'\bLIBYA\b',
    r'\bSTATE OF LIBYA\b',
    r'\bLIECHTENSTEIN\b',
    r'\bPRINCIPALITY OF LIECHTENSTEIN\b',
    r'\bLITHUANIA\b',
    r'\bREPUBLIC OF LITHUANIA\b',
    r'\bLUXEMBOURG\b',
    r'\bGRAND DUCHY OF LUXEMBOURG\b',
    r'\bMADAGASCAR\b',
    r'\bREPUBLIC OF MADAGASCAR\b',
    r'\bMALAWI\b',
    r'\bREPUBLIC OF MALAWI\b',
    r'\bMALDIVES\b',
    r'\bREPUBLIC OF MALDIVES\b',
    r'\bMALI\b',
    r'\bREPUBLIC OF MALI\b',
    r'\bMALTA\b',
    r'\bREPUBLIC OF MALTA\b',
    r'\bMARSHALL ISLANDS\b',
    r'\bREPUBLIC OF THE MARSHALL ISLANDS\b',
    r'\bMAURITANIA\b',
    r'\bISLAMIC REPUBLIC OF MAURITANIA\b',
    r'\bMAURITIUS\b',
    r'\bREPUBLIC OF MAURITIUS\b',
    r'\bMICRONESIA\b',
    r'\bFEDERATED STATES OF MICRONESIA\b',
    r'\bMOLDOVA\b',
    r'\bREPUBLIC OF MOLDOVA\b',
    r'\bMONACO\b',
    r'\bPRINCIPALITY OF MONACO\b',
    r'\bMONGOLIA\b',
    r'\bMONTENEGRO\b',
    r'\bMOROCCO\b',
    r'\bKINGDOM OF MOROCCO\b',
    r'\bMOZAMBIQUE\b',
    r'\bREPUBLIC OF MOZAMBIQUE\b',
    r'\bMYANMAR\b',
    r'\bBURMA\b',
    r'\bREPUBLIC OF THE UNION OF MYANMAR\b',
    r'\bNAMIBIA\b',
    r'\bREPUBLIC OF NAMIBIA\b',
    r'\bNAURU\b',
    r'\bREPUBLIC OF NAURU\b',
    r'\bNEPAL\b',
    r'\bFEDERAL DEMOCRATIC REPUBLIC OF NEPAL\b',
    r'\bNICARAGUA\b',
    r'\bREPUBLIC OF NICARAGUA\b',
    r'\bNIGER\b',
    r'\bREPUBLIC OF NIGER\b',
    r'\bNIGERIA\b',
    r'\bFEDERAL REPUBLIC OF NIGERIA\b',
    r'\bNORTH MACEDONIA\b',
    r'\bMACEDONIA\b',
    r'\bOMAN\b',
    r'\bSULTANATE OF OMAN\b',
    r'\bPAKISTAN\b',
    r'\bISLAMIC REPUBLIC OF PAKISTAN\b',
    r'\bPALAU\b',
    r'\bREPUBLIC OF PALAU\b',
    r'\bPANAMA\b',
    r'\bREPUBLIC OF PANAMA\b',
    r'\bPAPUA NEW GUINEA\b',
    r'\bPARAGUAY\b',
    r'\bREPUBLIC OF PARAGUAY\b',
    r'\bPERU\b',
    r'\bREPUBLIC OF PERU\b',
    r'\bQATAR\b',
    r'\bSTATE OF QATAR\b',
    r'\bRUSSIA\b',
    r'\bRUSSIAN FEDERATION\b',
    r'\bRWANDA\b',
    r'\bREPUBLIC OF RWANDA\b',
    r'\bSAINT KITTS AND NEVIS\b',
    r'\bSAINT LUCIA\b',
    r'\bSAINT VINCENT AND THE GRENADINES\b',
    r'\bSAMOA\b',
    r'\bINDEPENDENT STATE OF SAMOA\b',
    r'\bSAN MARINO\b',
    r'\bREPUBLIC OF SAN MARINO\b',
    r'\bSAO TOME AND PRINCIPE\b',
    r'\bDEMOCRATIC REPUBLIC OF SAO TOME AND PRINCIPE\b',
    r'\bSENEGAL\b',
    r'\bREPUBLIC OF SENEGAL\b',
    r'\bSERBIA\b',
    r'\bREPUBLIC OF SERBIA\b',
    r'\bSEYCHELLES\b',
    r'\bREPUBLIC OF SEYCHELLES\b',
    r'\bSIERRA LEONE\b',
    r'\bREPUBLIC OF SIERRA LEONE\b',
    r'\bSLOVAKIA\b',
    r'\bSLOVAK REPUBLIC\b',
    r'\bSLOVENIA\b',
    r'\bREPUBLIC OF SLOVENIA\b',
    r'\bSOLOMON ISLANDS\b',
    r'\bSOMALIA\b',
    r'\bFEDERAL REPUBLIC OF SOMALIA\b',
    r'\bSOUTH SUDAN\b',
    r'\bREPUBLIC OF SOUTH SUDAN\b',
    r'\bSRI LANKA\b',
    r'\bDEMOCRATIC SOCIALIST REPUBLIC OF SRI LANKA\b',
    r'\bSUDAN\b',
    r'\bREPUBLIC OF THE SUDAN\b',
    r'\bSURINAME\b',
    r'\bREPUBLIC OF SURINAME\b',
    r'\bSYRIA\b',
    r'\bSYRIAN ARAB REPUBLIC\b',
    r'\bTAIWAN\b',
    r'\bREPUBLIC OF CHINA\b',
    r'\bTAJIKISTAN\b',
    r'\bREPUBLIC OF TAJIKISTAN\b',
    r'\bTANZANIA\b',
    r'\bUNITED REPUBLIC OF TANZANIA\b',
    r'\bTIMOR-LESTE\b',
    r'\bDEMOCRATIC REPUBLIC OF TIMOR-LESTE\b',
    r'\bEAST TIMOR\b',
    r'\bTOGO\b',
    r'\bREPUBLIC OF TOGO\b',
    r'\bTONGA\b',
    r'\bKINGDOM OF TONGA\b',
    r'\bTRINIDAD AND TOBAGO\b',
    r'\bREPUBLIC OF TRINIDAD AND TOBAGO\b',
    r'\bTUNISIA\b',
    r'\bREPUBLIC OF TUNISIA\b',
    r'\bTURKMENISTAN\b',
    r'\bTUVALU\b',
    r'\bUGANDA\b',
    r'\bREPUBLIC OF UGANDA\b',
    r'\bUKRAINE\b',
    r'\bURUGUAY\b',
    r'\bORIENTAL REPUBLIC OF URUGUAY\b',
    r'\bUZBEKISTAN\b',
    r'\bREPUBLIC OF UZBEKISTAN\b',
    r'\bVANUATU\b',
    r'\bREPUBLIC OF VANUATU\b',
    r'\bVATICAN CITY\b',
    r'\bHOLY SEE\b',
    r'\bVENEZUELA\b',
    r'\bBOLIVARIAN REPUBLIC OF VENEZUELA\b',
    r'\bYEMEN\b',
    r'\bREPUBLIC OF YEMEN\b',
    r'\bZAMBIA\b',
    r'\bREPUBLIC OF ZAMBIA\b',
    r'\bZIMBABWE\b',
    r'\bREPUBLIC OF ZIMBABWE\b',
    ]
    
    for country_pattern in countries:
        match = re.search(country_pattern, text, re.IGNORECASE)
        if match:
            return match.group(0).strip()
    
    return None

def extract_city(address: str, country: Optional[str]) -> Optional[str]:
    """Extract city from address based on country context"""
    if not address:
        return None
    
    if country:
        country_upper = country.upper()
        
        # USA format: City, STATE ZIP
        if 'U.S.A' in country_upper or 'UNITED STATES' in country_upper:
            us_pattern = r'([A-Z][A-Z\s]+),\s*([A-Z]{2})\s+\d{5}'
            match = re.search(us_pattern, address)
            if match:
                return match.group(1).strip()
        
        # India format: CITY - PIN or CITY, STATE
        elif 'INDIA' in country_upper:
            states = [
                # === 28 States of India ===
                'ANDHRA PRADESH', 'ARUNACHAL PRADESH', 'ASSAM', 'BIHAR', 'CHHATTISGARH',
                'GOA', 'GUJARAT', 'HARYANA', 'HIMACHAL PRADESH', 'JHARKHAND', 'KARNATAKA',
                'KERALA', 'MADHYA PRADESH', 'MAHARASHTRA', 'MANIPUR', 'MEGHALAYA',
                'MIZORAM', 'NAGALAND', 'ODISHA', 'PUNJAB', 'RAJASTHAN', 'SIKKIM',
                'TAMIL NADU', 'TELANGANA', 'TRIPURA', 'UTTAR PRADESH', 'UTTARAKHAND',
                'WEST BENGAL',

                # === 8 Union Territories of India ===
                'ANDAMAN AND NICOBAR ISLANDS', 'CHANDIGARH',
                'DADRA AND NAGAR HAVELI AND DAMAN AND DIU', 'JAMMU AND KASHMIR',
                'LADAKH', 'LAKSHADWEEP', 'PUDUCHERRY',
                'NCT OF DELHI', 'NATIONAL CAPITAL TERRITORY OF DELHI',

                # === Common Indian Variations & Abbreviations ===
                'DELHI', 'NEW DELHI', 'ANDHRA', 'ORISSA', 'UTTARANCHAL', 'CHATTISGARH',
                'TAMILNADU', 'TELANGANA', 'PONDICHERRY',
                'AP', 'AR', 'AS', 'BR', 'CG', 'GA', 'GJ', 'HR', 'HP', 'JH', 'KA', 'KL',
                'MP', 'MH', 'MN', 'ML', 'MZ', 'NL', 'OD', 'OR', 'PB', 'RJ', 'SK', 'TN',
                'TS', 'TR', 'UP', 'UK', 'WB',
                'A&N', 'J&K', 'NCT DELHI', 'DAMAN DIU', 'DADRA NAGAR HAVELI',

                # === MIDDLE EAST - Major States / Provinces / Emirates / Governorates ===
                'RIYADH', 'MAKKAH', 'MADINAH', 'EASTERN PROVINCE', 'ASH SHARQIYAH',
                'ABU DHABI', 'DUBAI', 'SHARJAH', 'AJMAN', 'RAS AL KHAIMAH',
                'TEHRAN', 'ISFAHAN', 'BAGHDAD', 'BASRA', 'CAIRO', 'ALEXANDRIA',
                'AMMAN', 'BEIRUT', 'DAMASCUS', 'ISTANBUL', 'ANKARA',

                # === FAR EAST / EAST ASIA & SOUTHEAST ASIA - Major States / Provinces ===
                'GUANGDONG', 'SHANDONG', 'HENAN', 'SICHUAN', 'JIANGSU', 'SHANGHAI', 'BEIJING',
                'TOKYO', 'OSAKA', 'SEOUL', 'BUSAN', 'TAIPEI', 'JAKARTA', 'WEST JAVA',
                'BANGKOK', 'HO CHI MINH CITY', 'HANOI',

                # === EUROPE - Major States / Provinces / Regions (Key Countries) ===
                # Germany (Bundesländer)
                'BAVARIA', 'NORTH RHINE-WESTPHALIA', 'BADEN-WURTTEMBERG', 'BERLIN',
                'HESSE', 'SAXONY', 'LOWER SAXONY', 'BAVARIA', 'NRW',

                # France (Major Regions)
                'ILE DE FRANCE', 'PARIS REGION', 'PROVENCE ALPES COTE D AZUR', 'OCCITANIE',
                'AUVERGNE RHONE ALPES', 'HAUTS DE FRANCE', 'GRAND EST',

                # Italy (Major Regions)
                'LOMBARDY', 'LAZIO', 'CAMPANIA', 'VENETO', 'SICILY', 'EMILIA ROMAGNA',
                'PIEDMONT',

                # Spain (Major Autonomous Communities)
                'CATALONIA', 'ANDALUSIA', 'MADRID', 'VALENCIA', 'GALICIA', 'BASQUE COUNTRY',

                # United Kingdom (Countries & Key Regions)
                'ENGLAND', 'SCOTLAND', 'WALES', 'NORTHERN IRELAND',
                'LONDON', 'GREATER MANCHESTER', 'WEST MIDLANDS', 'YORKSHIRE',

                # Other Notable European Regions
                'VIENNA', 'LOWER AUSTRIA', 'FLANDERS', 'WALLONIA', 'BRUSSELS',
                'CATALONIA', 'BAVARIA', 'LOMBARDY',

                # === RUSSIA - Major Federal Subjects (Oblasts, Krais, Republics, Cities) ===
                'MOSCOW', 'MOSCOW OBLAST', 'SAINT PETERSBURG', 'LENINGRAD OBLAST',
                'KRASNOYARSK KRAI', 'KRASNOYARSK',
                'NOVOSIBIRSK OBLAST', 'EKATERINBURG', 'SVERDLOVSK OBLAST',
                'ROSTOV OBLAST', 'NIZHNY NOVGOROD OBLAST', 'SAMARA OBLAST',
                'CHELYABINSK OBLAST', 'OMSK OBLAST', 'VOLGOGRAD OBLAST',
                'KRASNODAR KRAI', 'TATARSTAN', 'BASHKORTOSTAN', 'DAGESTAN',
                'SIBERIA', 'FAR EAST', 'URAL',

                # Previous International Sections (kept for completeness)
                'CALIFORNIA', 'TEXAS', 'FLORIDA', 'NEW YORK', 'ONTARIO', 'QUEBEC',
                'NEW SOUTH WALES', 'VICTORIA', 'SAO PAULO', 'RIO DE JANEIRO'
            ]
            states_pattern = '|'.join(states)
            india_pattern = r'([A-Z][A-Z\s]+?)(?:\s*-\s*\d{6}|\s*,\s*(?:' + states_pattern + r'))'
            match = re.search(india_pattern, address, re.IGNORECASE)
            if match:
                city = match.group(1).strip()
                city = re.sub(r'\b(?:ROAD|STREET|AVENUE|MARKET|SOCIETY|ESTATE|FLOOR|BASEMENT|GROUND)\b', '', city, flags=re.IGNORECASE).strip()
                if city:
                    return city
        
        # Denmark/European format: ZIP CITY
        elif 'DENMARK' in country_upper or 'GERMANY' in country_upper or 'SWEDEN' in country_upper:
            eu_pattern = r'\b\d{4}\s+([A-Z][A-Z\s]+?)(?:,|\.|$)'
            match = re.search(eu_pattern, address)
            if match:
                return match.group(1).strip()
    
    # Generic fallback
    temp_address = address
    if country:
        temp_address = re.sub(re.escape(country), '', temp_address, flags=re.IGNORECASE)
    
    lines = [line.strip() for line in temp_address.split(',') if line.strip()]
    if len(lines) >= 2:
        for line in reversed(lines[-3:]):
            city_pattern = r'^[A-Z][A-Z\s]+$'
            digit_pattern = r'^\d+$'
            if re.match(city_pattern, line) and not re.match(digit_pattern, line):
                return line.strip()
    
    return None

def clean_address(text: str) -> str:
    """
    Removes phone, email, fax, and EORI details from the string 
    to leave only the physical address.
    """
    patterns_to_remove = [
        r'(?:PHONE|TEL|Phone|Tel)\s*:\s*[+\d\s()-]+',
        r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        r'(?:FAX|Fax)\s*:\s*[+\d\s()-]+',
        r'(?:EORI|Eori)\s*:\s*[A-Z0-9]+',
        r'E-MAIL\s*:\s*\S+'
    ]
    
    cleaned = text
    for pattern in patterns_to_remove:
        cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE)
    
    cleaned = re.sub(r',\s*,', ',', cleaned)
    cleaned = cleaned.strip().strip(',')
    cleaned = re.sub(r'\s+', ' ', cleaned)
    
    return cleaned.strip()

def normalize_text(text: str) -> str:
    """Normalize text by replacing newlines with spaces and cleaning whitespace"""
    text = text.replace('\n', ' ')
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def transform_address_box(text: str) -> Dict[str, Any]:
    """Transform address box data"""
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    clean_text = clean_address(text)
    clean_lines = [line.strip() for line in clean_text.split('\n') if line.strip()]
    
    country = extract_country(text)
    
    address_str = normalize_text(', '.join(clean_lines[1:])) if len(clean_lines) > 1 else normalize_text(clean_lines[0]) if clean_lines else ''
    
    city = extract_city(address_str, country)
    
    result = {
        'full_details': normalize_text(text),
        'name': lines[0] if lines else '',
        'address': address_str,
        'city': city,
        'country': country,
        'pin': extract_pin(text),
        'phone': extract_phone(text),
        'fax': extract_fax(text),
        'eori': extract_eori(text),
        'email': extract_email(text)
    }
    
    return result

def transform_flight_routing(text_data: str) -> List[Dict[str, Any]]:
    """Transform flight routing data"""
    airport_pattern = r'\b[A-Z]{3}\b'
    flight_pattern = r'\b[A-Z]{2}-?\d{1,4}\b'
    date_pattern = r'\d{2}-[A-Z]{3}-\d{4}'

    results = []
    blocks = [b.strip() for b in text_data.strip().split('\n\n') if b.strip()]

    for block in blocks:
        lines = block.split('\n')
        
        all_airports = re.findall(airport_pattern, lines[0])
        transit_airports = all_airports[:-1] if all_airports else []
        
        raw_flights = re.findall(flight_pattern, block)
        dates = re.findall(date_pattern, block)
        
        flights_list = [
            {"flight_number": f.replace("-", ""), "date": d}
            for f, d in zip(raw_flights, dates)
        ]
        
        results.append({
            "transit_airports": transit_airports,
            "flights": flights_list
        })
        
    return results

def extract_hs_codes(text: str) -> List[str]:
    """Extract HS codes from text"""
    hs_pattern = r'\b\d{8}\b'
    return re.findall(hs_pattern, text)

def extract_dimensions(text: str) -> List[Dict[str, Any]]:
    """Extract dimensions and their counts"""
    dimensions = []
    
    patterns = [
        (r'(\d+)\s*/\s*(\d+)\s*[Xx*]\s*(\d+)\s*[Xx*]\s*(\d+)', True),
        (r'\(\s*(\d+)\s*\)\s*(\d+)\s*[Xx*]\s*(\d+)\s*[Xx*]\s*(\d+)', True),
        (r'(\d+)\s*=\s*(\d+)\s*[Xx*]\s*(\d+)\s*[Xx*]\s*(\d+)', True),
        (r'(\d+)\s*[Xx*]\s*(\d+)\s*[Xx*]\s*(\d+)\s*\(\s*(\d+)\s*\)', False),
        (r'(\d+)\s*[Xx*]\s*(\d+)\s*[Xx*]\s*(\d+)\s*/\s*(\d+)', False),
        (r'(\d+)\s*[Xx*]\s*(\d+)\s*[Xx*]\s*(\d+)\s*=\s*(\d+)', False),
    ]
    
    for pattern, count_first in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            if count_first:
                count, length, width, height = match
            else:
                length, width, height, count = match
            dimensions.append({
                'dimension': f"{length}X{width}X{height}",
                'count': int(count)
            })
    
    pattern_no_count = r'\b(\d+)\s*[Xx*]\s*(\d+)\s*[Xx*]\s*(\d+)\b'
    matches = re.findall(pattern_no_count, text, re.IGNORECASE)
    for match in matches:
        length, width, height = match
        dim_str = f"{length}X{width}X{height}"
        if not any(d['dimension'] == dim_str for d in dimensions):
            dimensions.append({
                'dimension': dim_str,
                'count': 1
            })
    
    return dimensions

def transform_description(text: str) -> Dict[str, Any]:
    """Transform cargo description"""
    return {
        'description': normalize_text(text),
        'hs_codes': extract_hs_codes(text),
        'dimensions': extract_dimensions(text)
    }

def transform_weight_charge(text: str) -> Dict[str, Any]:
    """Transform weight and charge data"""
    numbers = re.findall(r'\d+\.?\d*', text)
    
    return {
        'chargeable_weight': float(numbers[0]) if numbers else 0.0,
        'rate': float(numbers[1]) if len(numbers) > 1 else 0.0
    }

def transform_piece_weight(text: str) -> Dict[str, Any]:
    """Transform piece and weight data"""
    text = normalize_text(text)
    parts = text.split()
    
    return {
        'no_of_pieces': int(parts[0]) if len(parts) > 0 and parts[0].replace('.', '').isdigit() else 0,
        'gross_weight': float(parts[1]) if len(parts) > 1 and parts[1].replace('.', '').isdigit() else 0.0,
        'total': ' '.join(parts[2:]) if len(parts) > 2 else ''
    }

def transform_awb_number(text: str) -> str:
    """Transform AWB number"""
    text = normalize_text(text)
    parts = text.split()
    if len(parts) >= 3:
        return f"{parts[0]}-{parts[2]}"
    return text

def read_box_from_pdf(pdf_path: str, page_number: int, bbox: List) -> str:
    """Read text from a specific box in PDF"""
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[page_number]
        cropped_page = page.within_bbox(tuple(bbox))
        text = cropped_page.extract_text()
        return text if text else ''

def process_box(box_name: str, text: str) -> Any:
    """Process extracted text based on box name"""
    if box_name in ['shipper', 'consignee']:
        return transform_address_box(text)
    elif box_name == 'transit':
        return transform_flight_routing(text)
    elif box_name == 'cargo':
        return transform_description(text)
    elif box_name == 'weight_charge':
        return transform_weight_charge(text)
    elif box_name == 'piece_weight':
        return transform_piece_weight(text)
    elif box_name == 'awb_number':
        return transform_awb_number(text)
    else:
        return normalize_text(text)

def extract_all_boxes(pdf_path: str, template_name: str, 
                     config_path: str = "boxes_config.json", 
                     page_num: int = 0) -> Dict[str, Any]:
    """Extract and process all boxes from PDF for a given template"""
    templates = load_boxes_config(config_path)
    
    if template_name not in templates:
        print(f"Error: Template '{template_name}' not found in configuration.")
        print(f"Available templates: {', '.join(templates.keys())}")
        sys.exit(1)
    
    template = templates[template_name]
    
    result = {}
    for box_name, bbox in template.items():
        text = read_box_from_pdf(pdf_path, page_num, bbox)
        result[box_name] = process_box(box_name, text)
    
    return result

def main():
    """Main function to handle command-line arguments"""
    if len(sys.argv) < 3:
        print("Usage: python pdf_extractor.py <pdf_file> <template_name> [config_file] [page_number]")
        print("\nExamples:")
        print("  python pdf_extractor.py temp.pdf dhl")
        print("  python pdf_extractor.py temp.pdf fedex boxes_config.json")
        print("  python pdf_extractor.py temp.pdf default boxes_config.json 0")
        sys.exit(1)
    
    pdf_file = sys.argv[1]
    template_name = sys.argv[2]
    config_file = sys.argv[3] if len(sys.argv) > 3 else "boxes_config.json"
    page_num = int(sys.argv[4]) if len(sys.argv) > 4 else 0
    
    if not Path(pdf_file).exists():
        print(f"Error: PDF file '{pdf_file}' not found.")
        sys.exit(1)
    
    try:
        result = extract_all_boxes(pdf_file, template_name, config_file, page_num)
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Error processing PDF: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()