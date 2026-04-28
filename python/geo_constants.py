"""
geo_constants.py
----------------
Centralised geographic reference data and pre-compiled regex patterns
for address parsing in pdf_extractor.py.

All patterns are compiled once at import time.
"""

import re
from typing import Dict, List


# ============================================================
# RAW GEOGRAPHIC DATA
# ============================================================

GEO_DATA: Dict[str, Dict] = {

    "INDIA": {
        "country_patterns": [r'\bINDIA\b'],
        "states": [
            # 28 States
            'ANDHRA PRADESH', 'ARUNACHAL PRADESH', 'ASSAM', 'BIHAR',
            'CHHATTISGARH', 'GOA', 'GUJARAT', 'HARYANA', 'HIMACHAL PRADESH',
            'JHARKHAND', 'KARNATAKA', 'KERALA', 'MADHYA PRADESH', 'MAHARASHTRA',
            'MANIPUR', 'MEGHALAYA', 'MIZORAM', 'NAGALAND', 'ODISHA', 'PUNJAB',
            'RAJASTHAN', 'SIKKIM', 'TAMIL NADU', 'TELANGANA', 'TRIPURA',
            'UTTAR PRADESH', 'UTTARAKHAND', 'WEST BENGAL',
            # 8 Union Territories
            'ANDAMAN AND NICOBAR ISLANDS', 'CHANDIGARH',
            'DADRA AND NAGAR HAVELI AND DAMAN AND DIU',
            'JAMMU AND KASHMIR', 'LADAKH', 'LAKSHADWEEP', 'PUDUCHERRY',
            'NCT OF DELHI', 'NATIONAL CAPITAL TERRITORY OF DELHI',
            # Common variants
            'DELHI', 'NEW DELHI', 'ANDHRA', 'ORISSA', 'UTTARANCHAL',
            'CHATTISGARH', 'TAMILNADU', 'PONDICHERRY',
        ],
        "state_codes": [
            'AP', 'AR', 'AS', 'BR', 'CG', 'GA', 'GJ', 'HR', 'HP', 'JH',
            'KA', 'KL', 'MP', 'MH', 'MN', 'ML', 'MZ', 'NL', 'OD', 'OR',
            'PB', 'RJ', 'SK', 'TN', 'TS', 'TR', 'UP', 'UK', 'WB', 'DL',
        ],
        # code_guard: pattern that must follow a 2-letter code to confirm it's a state
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{6})\b(?!\d)',
        "city_strategy": "state_then_pin",
        "cities": [
            'MUMBAI', 'DELHI', 'BENGALURU', 'BANGALORE', 'HYDERABAD', 'AHMEDABAD',
            'CHENNAI', 'MADRAS', 'KOLKATA', 'CALCUTTA', 'PUNE', 'SURAT', 'JAIPUR',
            'LUCKNOW', 'KANPUR', 'NAGPUR', 'INDORE', 'THANE', 'BHOPAL',
            'VISAKHAPATNAM', 'PIMPRI-CHINCHWAD', 'PATNA', 'VADODARA', 'GHAZIABAD',
            'LUDHIANA', 'AGRA', 'NASHIK', 'FARIDABAD', 'MEERUT', 'RAJKOT',
            'KALYAN-DOMBIVLI', 'VASAI-VIRAR', 'VARANASI', 'SRINAGAR', 'AURANGABAD',
            'DHANBAD', 'AMRITSAR', 'NAVI MUMBAI', 'PRAYAGRAJ', 'ALLAHABAD',
            'HOWRAH', 'RANCHI', 'GWALIOR', 'JABALPUR', 'COIMBATORE', 'VIJAYAWADA',
            'JODHPUR', 'MADURAI', 'RAIPUR', 'CHANDIGARH', 'GUNTUR', 'GUWAHATI',
            'SOLAPUR', 'HUBLI-DHARWAD', 'MYSORE', 'TIRUCHIRAPPALLI', 'BAREILLY',
            'ALIGARH', 'TIRUPPUR', 'GURGAON', 'MORADABAD', 'JALANDHAR',
            'BHUBANESWAR', 'SALEM', 'WARANGAL', 'MIRA-BHAYANDAR', 'JALGAON',
            'THIRUVANANTHAPURAM', 'BHIWANDI', 'SAHARANPUR', 'AMRAVATI', 'NOIDA',
            'JAMSHEDPUR', 'BHILAI', 'CUTTACK', 'FIROZABAD', 'KOCHI', 'COCHIN',
            'NELLORE', 'BHAVNAGAR', 'DEHRADUN', 'DURGAPUR', 'ASANSOL', 'ROURKELA',
            'NANDED', 'KOLHAPUR', 'AJMER', 'AKOLA', 'GULBARGA', 'JAMNAGAR',
            'UJJAIN', 'LONI', 'SILIGURI', 'JHANSI', 'ULHASNAGAR', 'JAMMU',
            'SANGLI-MIRAJ & KUPWAD', 'MANGALORE', 'ERODE', 'BELGAUM', 'KURNOOL',
            'AMBATTUR', 'RAJAHMUNDRY', 'TIRUNELVELI', 'MALEGAON', 'GAYA',
            'UDAIPUR', 'KAKINADA', 'DAVANAGERE', 'KOZHIKODE', 'MAHESHTALA',
            'RAJPUR SONARPUR', 'BOKARO', 'SOUTH DUMDUM', 'BELLARY', 'PATIALA',
            'GOPALPUR', 'AGARTALA', 'BHAGALPUR', 'MUZAFFARNAGAR', 'BHATPARA',
            'PANIHATI', 'LATUR', 'DHULE', 'ROHTAK', 'SAGAR', 'KORBA', 'BHILWARA',
            'BERHAMPUR', 'MUZAFFARPUR', 'AHMEDNAGAR', 'MATHURA', 'KOLLAM', 'AVADI',
            'KADAPA', 'KAMARHATI', 'SAMBALPUR', 'BILASPUR', 'SHAHJAHANPUR',
            'SATARA', 'BIJAPUR', 'RAMPUR', 'SHIMOGA', 'CHANDRAPUR', 'JUNAGADH',
            'THRISSUR', 'ALWAR', 'BARDHAMAN', 'KULTI', 'NIZAMABAD', 'PARBHANI',
            'TUMKUR', 'KHAMMAM', 'UZHAVARKARAI', 'BIHAR SHARIF', 'PANIPAT',
            'DARBHANGA', 'BALLY', 'AIZAWL', 'DEWAS', 'ICHALKARANJI', 'KARNAL',
            'BATHINDA', 'JALNA', 'ELURU', 'BARASAT', 'PURNIA', 'SATNA', 'MAU',
            'SONIPAT', 'FARRUKHABAD', 'DURG', 'IMPHAL', 'RATLAM', 'HAPUR', 'ARRAH',
            'ANANTAPUR', 'KARIMNAGAR', 'ETAWAH', 'AMBERNATH', 'BHARATPUR',
            'BEGUSARAI', 'NEW DELHI', 'GANDHIDHAM', 'BARON', 'KATNI', 'SAMBHAL',
            'GANDHINAGAR', 'NADIAD', 'YAMUNANAGAR', 'PALLAVARAM', 'SECUNDERABAD',
            'BAHRAICH', 'MAUNATH Bhanjan', 'RAICHUR', 'SIRSA', 'DANAPUR', 'SHIMLA',
        ],
    },

   "USA": {
    "country_patterns": [
        r'\bU\.?S\.?A?\.?\b',
        r'\bUNITED STATES OF AMERICA\b',
        r'\bUNITED STATES\b',
        r'\bU\.?S\.?\b(?!\s+Virgin Islands)',  # Avoid false positive with USVI
        r'\bAMERICA\b',  # Context-dependent, often paired with "United" or "North"
        r'\bUS\b',       # Very common in addresses
    ],
    "states": [
        'ALABAMA', 'ALASKA', 'ARIZONA', 'ARKANSAS', 'CALIFORNIA', 'COLORADO',
        'CONNECTICUT', 'DELAWARE', 'FLORIDA', 'GEORGIA', 'HAWAII', 'IDAHO',
        'ILLINOIS', 'INDIANA', 'IOWA', 'KANSAS', 'KENTUCKY', 'LOUISIANA',
        'MAINE', 'MARYLAND', 'MASSACHUSETTS', 'MICHIGAN', 'MINNESOTA',
        'MISSISSIPPI', 'MISSOURI', 'MONTANA', 'NEBRASKA', 'NEVADA',
        'NEW HAMPSHIRE', 'NEW JERSEY', 'NEW MEXICO', 'NEW YORK',
        'NORTH CAROLINA', 'NORTH DAKOTA', 'OHIO', 'OKLAHOMA', 'OREGON',
        'PENNSYLVANIA', 'RHODE ISLAND', 'SOUTH CAROLINA', 'SOUTH DAKOTA',
        'TENNESSEE', 'TEXAS', 'UTAH', 'VERMONT', 'VIRGINIA', 'WASHINGTON',
        'WEST VIRGINIA', 'WISCONSIN', 'WYOMING', 'DISTRICT OF COLUMBIA',
        # Common territories / possessions (for broader location detection)
        'PUERTO RICO', 'GUAM', 'AMERICAN SAMOA', 'NORTHERN MARIANA ISLANDS',
        'VIRGIN ISLANDS', 'UNITED STATES VIRGIN ISLANDS'
    ],
    "state_codes": [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
        # Territories
        'PR', 'GU', 'AS', 'MP', 'VI',
        # Military "states"
        'AA', 'AE', 'AP'
    ],
    # Stronger guard to prevent false positives on common words like "IN", "OR", "ME", "LA", etc.
    "code_guard": r'(?:\s+(?:[A-Z][a-z]+|\d{5}))',  # state code followed by city-like word or ZIP
    "postcode_pattern": r'(?<!\d)\b(\d{5})(?:-\d{4})?\b(?!\d)',
    "city_strategy": "city_state_zip",

    # Optional: Additional helpful patterns
    "extra_patterns": [
        # APO/FPO/DPO military addresses (common in US contexts)
        r'\b(?:APO|FPO|DPO)\s+[A-Z]{2}\s+\d{5}(?:-\d{4})?\b',
        # ZIP+4 with optional hyphen
        r'(?<!\d)\b\d{5}-\d{4}\b(?!\d)',
        # Common city-state-zip combos (can be used for validation)
        r'\b[A-Za-z\s]+,\s+[A-Z]{2}\s+\d{5}(?:-\d{4})?\b',
    ],
    },

  "UNITED KINGDOM": {
    "country_patterns": [
        r'\bUNITED KINGDOM\b',
        r'\bU\.?K\.?\b',
        r'\bGREAT BRITAIN\b',
        r'\bBRITAIN\b',
        r'\bBRITISH\b',           # often appears in "British" addresses
        r'\bUK\b',
        r'\bUNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND\b'
    ],
    "states": [
        # Countries / Nations
        'ENGLAND', 'SCOTLAND', 'WALES', 'NORTHERN IRELAND',
        # Major regions and counties (most common in addresses)
        'GREATER LONDON', 'GREATER MANCHESTER', 'WEST MIDLANDS', 'WEST YORKSHIRE',
        'SOUTH YORKSHIRE', 'MERSEYSIDE', 'TYNE AND WEAR',
        'KENT', 'ESSEX', 'HAMPSHIRE', 'SURREY', 'LANCASHIRE', 'CHESHIRE',
        'DEVON', 'CORNWALL', 'DORSET', 'SOMERSET', 'GLOUCESTERSHIRE',
        'OXFORDSHIRE', 'BUCKINGHAMSHIRE', 'HERTFORDSHIRE', 'BEDFORDSHIRE',
        'NORFOLK', 'SUFFOLK', 'CAMBRIDGESHIRE', 'LINCOLNSHIRE',
        'NORTH YORKSHIRE', 'EAST YORKSHIRE', 'SOUTH YORKSHIRE',
        'DERBYSHIRE', 'NOTTINGHAMSHIRE', 'LEICESTERSHIRE', 'WARWICKSHIRE',
        'STAFFORDSHIRE', 'SHROPSHIRE', 'HEREFORDSHIRE', 'WORCESTERSHIRE',
        # Scottish council areas (commonly used)
        'HIGHLANDS', 'ABERDEENSHIRE', 'FIFE', 'PERTHSHIRE', 'AYRSHIRE',
        # Welsh counties
        'POWYS', 'GWENT', 'DYFED', 'CLWYD'
    ],
    "state_codes": [
        # No official state codes like US, but including common county abbreviations
        # and some historic/postal codes that appear in data
        'LONDON', 'MANCHESTER', 'BIRMINGHAM', 'LEEDS', 'GLASGOW', 'EDINBURGH',
        'LIVERPOOL', 'BRISTOL', 'SHEFFIELD', 'NEWCASTLE'
    ],
    # Guard helps avoid false positives (UK postcodes can look similar to other patterns)
    "code_guard": r'(?:\s+[A-Z0-9]{2,})',  
    "postcode_pattern": r'\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b',
    
    # Alternative postcode patterns (more flexible)
    "postcode_patterns": [
        r'\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b',                    # Standard
        r'\b([A-Z]{1,2}\d{1,2}\s*\d[A-Z]{2})\b',                       # Without letter after first digit
        r'\b([A-Z]{1,2}\d[A-Z]?\s*\d[A-Z]{2})\b'                       # More variations
    ],
    
    "city_strategy": "before_postcode",

    # Extra helpful patterns
    "extra_patterns": [
        # Common UK address formats
        r'\b(?:London|Manchester|Birmingham|Glasgow|Edinburgh|Liverpool|Leeds|Sheffield|Bristol)\b',
        # "England", "Scotland", etc. at the end of address
        r'(?:England|Scotland|Wales|Northern Ireland)\s*$',
    ],
},

"CANADA": {
        "country_patterns": [
            r'\bCANADA\b',
            r'\bCA\b(?!\s*(?:US|USA|United States))',  # careful with CA as California
        ],
        "states": [
            'ALBERTA', 'BRITISH COLUMBIA', 'MANITOBA', 'NEW BRUNSWICK',
            'NEWFOUNDLAND AND LABRADOR', 'NORTHWEST TERRITORIES', 'NOVA SCOTIA',
            'NUNAVUT', 'ONTARIO', 'PRINCE EDWARD ISLAND', 'QUEBEC',
            'SASKATCHEWAN', 'YUKON',
            # Common French names
            'QUÉBEC', 'TERRE-NEUVE-ET-LABRADOR', 'NOUVEAU-BRUNSWICK'
        ],
        "state_codes": [
            'AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU',
            'ON', 'PE', 'QC', 'SK', 'YT'
        ],
        # Strong guard: province code followed by postal code (with possible spaces)
        "code_guard": r'\s+[A-Z]\d[A-Z]',
        "postcode_pattern": r'\b([A-Z]\d[A-Z]\s*\d[A-Z]\d)\b',
        "postcode_patterns": [
            r'\b([A-Z]\d[A-Z]\s*\d[A-Z]\d)\b',           # Standard with space
            r'\b([A-Z]\d[A-Z]\d[A-Z]\d)\b'               # Without space (sometimes seen)
        ],
        "city_strategy": "city_state_zip",
        "extra_patterns": [
            r'\b(?:Toronto|Montreal|Vancouver|Calgary|Ottawa|Edmonton)\b'
        ]
    },

    "AUSTRALIA": {
        "country_patterns": [
            r'\bAUSTRALIA\b',
            r'\bAUS\b',
            r'\bAU\b'
        ],
        "states": [
            'NEW SOUTH WALES', 'VICTORIA', 'QUEENSLAND', 'SOUTH AUSTRALIA',
            'WESTERN AUSTRALIA', 'TASMANIA', 'NORTHERN TERRITORY',
            'AUSTRALIAN CAPITAL TERRITORY',
            # Common short forms that appear
            'NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'
        ],
        "state_codes": ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
        "code_guard": r'\s+\d{4}',  # state code followed by 4-digit postcode
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "city_state_zip",
        "extra_patterns": [
            r'\b(?:Sydney|Melbourne|Brisbane|Perth|Adelaide|Hobart|Darwin|Canberra)\b'
        ]
    },

    "GERMANY": {
        "country_patterns": [
            r'\bGERMANY\b',
            r'\bDEUTSCHLAND\b',
            r'\bDE\b(?!\s*(?:Belgium|Netherlands))',  # avoid DE as Delaware or other
            r'\bFEDERAL REPUBLIC OF GERMANY\b'
        ],
        "states": [
            'BAVARIA', 'NORTH RHINE-WESTPHALIA', 'BADEN-WÜRTTEMBERG',
            'LOWER SAXONY', 'HESSE', 'SAXONY', 'RHINELAND-PALATINATE',
            'BERLIN', 'HAMBURG', 'BREMEN', 'THURINGIA', 'SAXONY-ANHALT',
            'MECKLENBURG-VORPOMMERN', 'SAARLAND', 'BRANDENBURG',
            'SCHLESWIG-HOLSTEIN',
            # German names (common in addresses)
            'BAYERN', 'NORDRHEIN-WESTFALEN', 'BADEN-WUERTTEMBERG',
            'NIEDERSACHSEN', 'HESSEN', 'SACHSEN', 'BERLIN', 'HAMBURG'
        ],
        "state_codes": [],  # Germany rarely uses short codes in addresses
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "postcode_then_city",
        "extra_patterns": [
            r'\b(?:Berlin|München|Hamburg|Frankfurt|Köln|Stuttgart|Düsseldorf)\b'
        ]
    },

    "FRANCE": {
        "country_patterns": [
            r'\bFRANCE\b',
            r'\bFRENCH REPUBLIC\b',
            r'\bFR\b(?!\s*(?:Germany|Belgium))'
        ],
        "states": [
            'ILE-DE-FRANCE', 'PROVENCE-ALPES-CÔTE D\'AZUR', 'AUVERGNE-RHÔNE-ALPES',
            'NOUVELLE-AQUITAINE', 'OCCITANIE', 'HAUTS-DE-FRANCE',
            'GRAND EST', 'PAYS DE LA LOIRE', 'NORMANDIE', 'BRETAGNE',
            'BOURGOGNE-FRANCHE-COMTÉ', 'CENTRE-VAL DE LOIRE',
            'CORSICA', 'CORSE',
            # Older regions that still appear
            'AQUITAINE', 'LANGUEDOC-ROUSSILLON', 'MIDI-PYRÉNÉES'
        ],
        "state_codes": [],  # Uses departments (2-digit in postcode)
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "postcode_then_city",
        "extra_patterns": [
            r'\b(?:Paris|Marseille|Lyon|Toulouse|Nice|Bordeaux|Nantes|Strasbourg)\b'
        ]
    },

    "NETHERLANDS": {
        "country_patterns": [
            r'\bNETHERLANDS\b',
            r'\bHOLLAND\b',
            r'\bTHE NETHERLANDS\b',
            r'\bNL\b'
        ],
        "states": [
            'NORTH HOLLAND', 'SOUTH HOLLAND', 'UTRECHT', 'GELDERLAND',
            'NORTH BRABANT', 'LIMBURG', 'OVERIJSSEL', 'GRONINGEN',
            'FRIESLAND', 'DRENTHE', 'ZEELAND', 'FLEVOLAND',
            # Dutch names
            'NOORD-HOLLAND', 'ZUID-HOLLAND', 'NOORD-BRABANT'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'\b(\d{4}\s*[A-Z]{2})\b',
        "postcode_patterns": [
            r'\b(\d{4}\s*[A-Z]{2})\b',      # With space
            r'\b(\d{4}[A-Z]{2})\b'          # Without space (common in data)
        ],
        "city_strategy": "postcode_then_city",
        "extra_patterns": [
            r'\b(?:Amsterdam|Rotterdam|The Hague|Den Haag|Utrecht|Eindhoven)\b'
        ]
    },

    "RUSSIA": {
        "country_patterns": [
            r'\bRUSSIA\b',
            r'\bRUSSIAN FEDERATION\b',
            r'\bRF\b',
            r'\bROSSIYA\b'
        ],
        "states": [  # Your original list is good; kept + minor additions
            'MOSCOW OBLAST', 'LENINGRAD OBLAST', 'KRASNODAR KRAI', 'TATARSTAN',
            'SVERDLOVSK OBLAST', 'NOVOSIBIRSK OBLAST', 'CHELYABINSK OBLAST',
            'NIZHNY NOVGOROD OBLAST', 'SAMARA OBLAST', 'OMSK OBLAST',
            'ROSTOV OBLAST', 'BASHKORTOSTAN', 'PERM KRAI', 'VOLGOGRAD OBLAST',
            'MOSCOW', 'SAINT PETERSBURG', 'KRASNOYARSK KRAI'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{6})\b(?!\d)',
        "city_strategy": "state_then_pin",
        "extra_patterns": [
            r'\b(?:Moscow|Saint Petersburg|Sankt-Peterburg|Sochi|Novosibirsk)\b'
        ]
    },

    "UAE": {
        "country_patterns": [
            r'\bUAE\b',
            r'\bUNITED ARAB EMIRATES\b',
            r'\bEMIRATES\b',
            r'\bDUBAI\b', r'\bABU DHABI\b'  # often used as country proxy
        ],
        "states": [
            'ABU DHABI', 'DUBAI', 'SHARJAH', 'AJMAN',
            'RAS AL KHAIMAH', 'FUJAIRAH', 'UMM AL QUWAIN',
            'RAS AL KHAIMAH', 'RAK'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": None,  # UAE mostly doesn't use postcodes (or very new/optional)
        "city_strategy": "state_anchor",
        "extra_patterns": [
            r'\b(?:Dubai|Abu Dhabi|Sharjah|Ajman)\b'
        ]
    },

    "SAUDI ARABIA": {
        "country_patterns": [
            r'\bSAUDI ARABIA\b',
            r'\bKSA\b',
            r'\bKINGDOM OF SAUDI ARABIA\b'
        ],
        "states": [
            'RIYADH', 'MAKKAH', 'MADINAH', 'EASTERN PROVINCE', 'ASH SHARQIYAH',
            'ASIR', 'TABUK', 'HAIL', 'NAJRAN', 'JIZAN', 'AL JAWF', 'AL BAHA',
            'NORTHERN BORDERS', 'QASSIM', 'AL QASSIM',
            'JEDDAH', 'MECCA', 'MEDINA'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "state_anchor",
        "extra_patterns": [
            r'\b(?:Riyadh|Jeddah|Mecca|Medina|Dammam)\b'
        ]
    }
}


# ============================================================
# PRE-COMPILED PATTERNS  (built once at import time)
# ============================================================

def _build_country_pattern(geo: Dict) -> re.Pattern:
    """Compile all country_patterns for one entry into a single pattern."""
    alts = '|'.join(geo["country_patterns"])
    return re.compile(alts, re.IGNORECASE)


def _build_state_pattern(geo: Dict) -> re.Pattern:
    """Compile full state names (longest first) into a single pattern."""
    states = sorted(geo["states"], key=len, reverse=True)
    if not states:
        return None
    alts   = '|'.join(re.escape(s) for s in states)
    return re.compile(rf'\b({alts})\b', re.IGNORECASE)


def _build_code_pattern(geo: Dict) -> "re.Pattern | None":
    """Compile 2/3-letter state codes with optional guard suffix."""
    if not geo.get("state_codes"):
        return None
    codes  = geo["state_codes"]
    alts   = '|'.join(re.escape(c) for c in codes)
    guard  = geo.get("code_guard") or ""
    return re.compile(rf'\b({alts})\b{guard}')


def _build_postcode_pattern(geo: Dict) -> "re.Pattern | None":
    raw = geo.get("postcode_pattern")
    return re.compile(raw) if raw else None


def _build_city_pattern(geo: Dict) -> "re.Pattern | None":
    """Compile city names (longest first) into a single pattern."""
    cities = geo.get("cities", [])
    if not cities:
        return None
    alts = '|'.join(re.escape(c) for c in sorted(cities, key=len, reverse=True))
    return re.compile(rf'\b({alts})\b', re.IGNORECASE)


# Build compiled lookup tables keyed by country key
COUNTRY_PATTERNS:  Dict[str, re.Pattern] = {}
STATE_PATTERNS:    Dict[str, "re.Pattern | None"] = {}
CODE_PATTERNS:     Dict[str, "re.Pattern | None"] = {}
POSTCODE_PATTERNS: Dict[str, "re.Pattern | None"] = {}
CITY_PATTERNS:     Dict[str, "re.Pattern | None"] = {}

for _key, _geo in GEO_DATA.items():
    COUNTRY_PATTERNS[_key]  = _build_country_pattern(_geo)
    STATE_PATTERNS[_key]    = _build_state_pattern(_geo)
    CODE_PATTERNS[_key]     = _build_code_pattern(_geo)
    POSTCODE_PATTERNS[_key] = _build_postcode_pattern(_geo)
    CITY_PATTERNS[_key]     = _build_city_pattern(_geo)


# ============================================================
# SHARED STATIC PATTERNS (used by extract_city, clean_address)
# ============================================================

STREET_NOISE: re.Pattern = re.compile(
    r'\b(?:ROAD|STREET|AVENUE|LANE|DRIVE|CLOSE|COURT|PLACE|BOULEVARD|BLVD|'
    r'CRESCENT|TERRACE|GROVE|WAY|WALK|MEWS|RISE|GARDENS|PARK|SQUARE|'
    r'INDUSTRIAL|ESTATE|COMPLEX|ZONE|SECTOR|PHASE|PLOT|BLOCK|FLOOR|'
    r'GROUND|BASEMENT|BUILDING|TOWER|HOUSE|CENTRE|CENTER|HUB|POINT|'
    r'MARKET|SOCIETY|NAGAR|VIHAR|ENCLAVE|COLONY|LAYOUT|EXTENSION|'
    r'NORTH|SOUTH|EAST|WEST|UPPER|LOWER|OLD|NEW|UNIT|NO\.?)\b',
    re.IGNORECASE
)

CLEAN_ADDRESS_PATTERNS: List[re.Pattern] = [
    re.compile(r'(?:PHONE|TEL|Phone|Tel|PH|Ph)\s*:?\s*[+\d\s()\-]{7,}', re.IGNORECASE),
    re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b'),
    re.compile(r'(?:FAX|Fax)\s*:?\s*[+\d\s()\-]{7,}',                   re.IGNORECASE),
    re.compile(r'(?:EORI|Eori)\s*:\s*[A-Z0-9]+',                         re.IGNORECASE),
    re.compile(r'E-?MAIL\s*:\s*\S+',                                      re.IGNORECASE),
]
