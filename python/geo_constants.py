"""
geo_constants.py
================
Centralised geographic reference data and pre-compiled regex patterns
for address parsing in pdf_extractor.py.

HOW TO ADD A NEW COUNTRY
─────────────────────────
1. Find the correct continent dict below (ASIA, EUROPE, etc.).
2. Add a new key — use the country name EXACTLY as it will appear in AWB text.
3. Fill in at minimum: country_patterns, postcode_pattern, city_strategy.
4. states / state_codes / cities are optional but improve extraction accuracy.
5. Do NOT edit GEO_DATA directly — it is built by merging all continent dicts.

FIELD REFERENCE
───────────────
country_patterns  list[str]   raw regex alternates that identify this country in text
states            list[str]   full state / province / region names
state_codes       list[str]   2-3 letter abbreviations (if used in addresses)
code_guard        str|None    regex suffix that must follow a state code to confirm it
cities            list[str]   major cities — aids city extraction
postcode_pattern  str|None    raw regex for one postcode token
city_strategy     str         extraction hint used by extract_city():
                                'city_state_zip'          CITY, ST ZIPCODE   (US, CA, AU)
                                'postcode_then_city'      ZIPCODE CITY        (DE, FR, NL)
                                'before_postcode'         CITY POSTCODE       (UK, MY, …)
                                'before_postcode_dotted'  CITY. POSTCODE      (UK variant)
                                'state_then_pin'          CITY – PIN STATE    (IN, RU)
                                'state_anchor'            city == state name  (UAE, SA)
                                'generic'                 last-resort fallback

All patterns are compiled once at import time into the lookup tables at the
bottom of this file. Always import from those tables, never re.compile here.
"""

import re
from typing import Dict, List, Optional


# ═══════════════════════════════════════════════════════════════════════════════
# ASIA
# ═══════════════════════════════════════════════════════════════════════════════

ASIA: Dict[str, Dict] = {

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
            'PB', 'RJ', 'SK', 'TN', 'TS', 'TR', 'UP', 'UK', 'WB', 'DL', 'UP'
        ],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{6}|\d{3}\s\d{3})\b(?!\d)',
        "city_strategy": "state_then_pin",
        "cities": [
            'MUMBAI', 'DELHI', 'BENGALURU', 'BANGALORE', 'HYDERABAD', 'AHMEDABAD',
            'CHENNAI', 'MADRAS', 'KOLKATA', 'CALCUTTA', 'PUNE', 'SURAT', 'JAIPUR',
            'LUCKNOW', 'KANPUR', 'NAGPUR', 'INDORE', 'THANE', 'BHOPAL',
            'VISAKHAPATNAM', 'PATNA', 'VADODARA', 'GHAZIABAD', 'LUDHIANA', 'AGRA',
            'NASHIK', 'FARIDABAD', 'MEERUT', 'RAJKOT', 'VARANASI', 'SRINAGAR',
            'AURANGABAD', 'DHANBAD', 'AMRITSAR', 'NAVI MUMBAI', 'PRAYAGRAJ',
            'ALLAHABAD', 'HOWRAH', 'RANCHI', 'GWALIOR', 'JABALPUR', 'COIMBATORE',
            'VIJAYAWADA', 'JODHPUR', 'MADURAI', 'RAIPUR', 'CHANDIGARH', 'GUNTUR',
            'GUWAHATI', 'SOLAPUR', 'MYSORE', 'MYSURU', 'TIRUCHIRAPPALLI',
            'BAREILLY', 'ALIGARH', 'TIRUPPUR', 'GURGAON', 'GURUGRAM', 'MORADABAD',
            'JALANDHAR', 'BHUBANESWAR', 'SALEM', 'WARANGAL', 'JALGAON',
            'THIRUVANANTHAPURAM', 'BHIWANDI', 'SAHARANPUR', 'AMRAVATI', 'NOIDA',
            'JAMSHEDPUR', 'BHILAI', 'CUTTACK', 'KOCHI', 'COCHIN', 'NELLORE',
            'BHAVNAGAR', 'DEHRADUN', 'DURGAPUR', 'ASANSOL', 'ROURKELA', 'NANDED',
            'KOLHAPUR', 'AJMER', 'AKOLA', 'GULBARGA', 'JAMNAGAR', 'UJJAIN',
            'SILIGURI', 'JHANSI', 'ULHASNAGAR', 'JAMMU', 'MANGALORE', 'ERODE',
            'BELGAUM', 'KURNOOL', 'RAJAHMUNDRY', 'TIRUNELVELI', 'MALEGAON', 'GAYA',
            'UDAIPUR', 'KAKINADA', 'DAVANAGERE', 'KOZHIKODE', 'BELLARY', 'PATIALA',
            'AGARTALA', 'BHAGALPUR', 'MUZAFFARPUR', 'AHMEDNAGAR', 'MATHURA',
            'KOLLAM', 'KADAPA', 'SAMBALPUR', 'BILASPUR', 'SHAHJAHANPUR', 'SATARA',
            'BIJAPUR', 'RAMPUR', 'SHIMOGA', 'CHANDRAPUR', 'JUNAGADH', 'THRISSUR',
            'ALWAR', 'BARDHAMAN', 'NIZAMABAD', 'PARBHANI', 'TUMKUR', 'KHAMMAM',
            'PANIPAT', 'DARBHANGA', 'AIZAWL', 'DEWAS', 'ICHALKARANJI', 'KARNAL',
            'BATHINDA', 'JALNA', 'ELURU', 'BARASAT', 'PURNIA', 'SATNA', 'MAU',
            'SONIPAT', 'FARRUKHABAD', 'DURG', 'IMPHAL', 'RATLAM', 'HAPUR',
            'ANANTAPUR', 'KARIMNAGAR', 'ETAWAH', 'AMBERNATH', 'BHARATPUR',
            'BEGUSARAI', 'GANDHIDHAM', 'KATNI', 'SAMBHAL', 'GANDHINAGAR', 'NADIAD',
            'YAMUNANAGAR', 'SECUNDERABAD', 'BAHRAICH', 'RAICHUR', 'SIRSA',
            'SHIMLA', 'FIROZABAD', 'ROHTAK', 'NOIDA'
        ],
    },

    "CHINA": {
        "country_patterns": [r'\bCHINA\b', r'\bPRC\b', r"\bPEOPLE'S REPUBLIC OF CHINA\b"],
        "states": [
            'ANHUI', 'FUJIAN', 'GANSU', 'GUANGDONG', 'GUIZHOU', 'HAINAN',
            'HEBEI', 'HEILONGJIANG', 'HENAN', 'HUBEI', 'HUNAN', 'JIANGSU',
            'JIANGXI', 'JILIN', 'LIAONING', 'QINGHAI', 'SHAANXI', 'SHANDONG',
            'SHANXI', 'SICHUAN', 'YUNNAN', 'ZHEJIANG',
            'BEIJING', 'CHONGQING', 'SHANGHAI', 'TIANJIN',
            'GUANGXI', 'INNER MONGOLIA', 'NINGXIA', 'TIBET', 'XINJIANG',
            'HONG KONG', 'MACAU',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{6})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'BEIJING', 'SHANGHAI', 'GUANGZHOU', 'SHENZHEN', 'CHENGDU',
            'TIANJIN', 'CHONGQING', 'WUHAN', 'XIAN', 'HANGZHOU', 'NANJING',
            'SHENYANG', 'QINGDAO', 'ZHENGZHOU', 'DALIAN', 'JINAN', 'HARBIN',
            'SUZHOU', 'KUNMING', 'CHANGSHA', 'XIAMEN', 'FUZHOU', 'NINGBO',
            'HONG KONG',
        ],
    },

    "JAPAN": {
        "country_patterns": [r'\bJAPAN\b', r'\bJPN\b'],
        "states": [
            'HOKKAIDO', 'AOMORI', 'IWATE', 'MIYAGI', 'AKITA', 'YAMAGATA',
            'FUKUSHIMA', 'IBARAKI', 'TOCHIGI', 'GUNMA', 'SAITAMA', 'CHIBA',
            'TOKYO', 'KANAGAWA', 'NIIGATA', 'TOYAMA', 'ISHIKAWA', 'FUKUI',
            'YAMANASHI', 'NAGANO', 'SHIZUOKA', 'AICHI', 'MIE', 'SHIGA',
            'KYOTO', 'OSAKA', 'HYOGO', 'NARA', 'WAKAYAMA', 'TOTTORI',
            'SHIMANE', 'OKAYAMA', 'HIROSHIMA', 'YAMAGUCHI', 'TOKUSHIMA',
            'KAGAWA', 'EHIME', 'KOCHI', 'FUKUOKA', 'SAGA', 'NAGASAKI',
            'KUMAMOTO', 'OITA', 'MIYAZAKI', 'KAGOSHIMA', 'OKINAWA',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'\b(\d{3}-\d{4})\b',
        "city_strategy": "before_postcode",
        "cities": [
            'TOKYO', 'YOKOHAMA', 'OSAKA', 'NAGOYA', 'SAPPORO', 'FUKUOKA',
            'KOBE', 'KAWASAKI', 'KYOTO', 'SAITAMA', 'HIROSHIMA', 'SENDAI',
            'CHIBA', 'KITAKYUSHU', 'SAKAI', 'NIIGATA', 'HAMAMATSU', 'OKAYAMA',
            'SAGAMIHARA', 'SHIZUOKA',
        ],
    },

    "SINGAPORE": {
        "country_patterns": [r'\bSINGAPORE\b', r'\bSGP\b'],
        "states": [],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{6})\b(?!\d)',
        "city_strategy": "generic",
        "cities": ['SINGAPORE'],
    },

    "MALAYSIA": {
        "country_patterns": [r'\bMALAYSIA\b', r'\bMYS\b'],
        "states": [
            'JOHOR', 'KEDAH', 'KELANTAN', 'MELAKA', 'NEGERI SEMBILAN',
            'PAHANG', 'PERAK', 'PERLIS', 'PULAU PINANG', 'SABAH', 'SARAWAK',
            'SELANGOR', 'TERENGGANU', 'KUALA LUMPUR', 'LABUAN', 'PUTRAJAYA',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'KUALA LUMPUR', 'GEORGE TOWN', 'IPOH', 'SHAH ALAM', 'PETALING JAYA',
            'JOHOR BAHRU', 'MALACCA', 'KOTA KINABALU', 'KUCHING', 'SUBANG JAYA',
        ],
    },

    "THAILAND": {
        "country_patterns": [r'\bTHAILAND\b', r'\bTHA\b'],
        "states": [
            'BANGKOK', 'CHIANG MAI', 'CHIANG RAI', 'NONTHABURI', 'PATHUM THANI',
            'PHUKET', 'CHONBURI', 'RAYONG', 'NAKHON RATCHASIMA', 'KHON KAEN',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'BANGKOK', 'CHIANG MAI', 'PHUKET', 'PATTAYA', 'HAT YAI',
            'NONTHABURI', 'UDON THANI', 'KHON KAEN', 'NAKHON RATCHASIMA',
        ],
    },

    "UAE": {
        "country_patterns": [
            r'\bUAE\b', r'\bUNITED ARAB EMIRATES\b', r'\bEMIRATES\b',
        ],
        "states": [
            'ABU DHABI', 'DUBAI', 'SHARJAH', 'AJMAN',
            'RAS AL KHAIMAH', 'FUJAIRAH', 'UMM AL QUWAIN',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": None,   # UAE postcodes are rare / optional
        "city_strategy": "state_anchor",
        "cities": ['DUBAI', 'ABU DHABI', 'SHARJAH', 'AL AIN', 'AJMAN'],
    },

    "SAUDI ARABIA": {
        "country_patterns": [
            r'\bSAUDI ARABIA\b', r'\bKSA\b', r'\bKINGDOM OF SAUDI ARABIA\b',
        ],
        "states": [
            'RIYADH', 'MAKKAH', 'MADINAH', 'EASTERN PROVINCE', 'ASH SHARQIYAH',
            'ASIR', 'TABUK', 'HAIL', 'NAJRAN', 'JIZAN', 'AL JAWF', 'AL BAHA',
            'NORTHERN BORDERS', 'QASSIM', 'AL QASSIM', 'JEDDAH', 'MECCA', 'MEDINA',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "state_anchor",
        "cities": ['RIYADH', 'JEDDAH', 'MECCA', 'MEDINA', 'DAMMAM', 'KHOBAR'],
    },

    "BANGLADESH": {
        "country_patterns": [r'\bBANGLADESH\b', r'\bBGD\b'],
        "states": [
            'DHAKA', 'CHITTAGONG', 'RAJSHAHI', 'KHULNA',
            'BARISHAL', 'SYLHET', 'RANGPUR', 'MYMENSINGH',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'DHAKA', 'CHITTAGONG', 'SYLHET', 'RAJSHAHI', 'KHULNA',
            'COMILLA', 'GAZIPUR', 'NARAYANGANJ',
        ],
    },

    "SRI LANKA": {
        "country_patterns": [r'\bSRI LANKA\b', r'\bLKA\b'],
        "states": [
            'WESTERN', 'CENTRAL', 'SOUTHERN', 'NORTHERN', 'EASTERN',
            'NORTH WESTERN', 'NORTH CENTRAL', 'UVA', 'SABARAGAMUWA',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'COLOMBO', 'KANDY', 'GALLE', 'JAFFNA', 'NEGOMBO',
            'BATTICALOA', 'ANURADHAPURA', 'TRINCOMALEE',
        ],
    },

    "PAKISTAN": {
        "country_patterns": [r'\bPAKISTAN\b', r'\bPAK\b'],
        "states": [
            'PUNJAB', 'SINDH', 'KHYBER PAKHTUNKHWA', 'BALOCHISTAN',
            'GILGIT BALTISTAN', 'AZAD KASHMIR', 'ISLAMABAD',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'KARACHI', 'LAHORE', 'ISLAMABAD', 'RAWALPINDI', 'FAISALABAD',
            'MULTAN', 'PESHAWAR', 'QUETTA', 'SIALKOT', 'GUJRANWALA',
        ],
    },

    "INDONESIA": {
        "country_patterns": [r'\bINDONESIA\b', r'\bIDN\b'],
        "states": [
            'ACEH', 'BALI', 'BANTEN', 'BENGKULU', 'CENTRAL JAVA',
            'EAST JAVA', 'EAST KALIMANTAN', 'JAKARTA', 'JAMBI', 'LAMPUNG',
            'MALUKU', 'NORTH SULAWESI', 'NORTH SUMATRA', 'PAPUA', 'RIAU',
            'SOUTH KALIMANTAN', 'SOUTH SULAWESI', 'SOUTH SUMATRA',
            'WEST JAVA', 'WEST KALIMANTAN', 'WEST SUMATRA', 'YOGYAKARTA',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'JAKARTA', 'SURABAYA', 'BANDUNG', 'MEDAN', 'SEMARANG',
            'MAKASSAR', 'PALEMBANG', 'TANGERANG', 'DEPOK', 'BEKASI',
        ],
    },

    "VIETNAM": {
        "country_patterns": [r'\bVIETNAM\b', r'\bVNM\b', r'\bVIET NAM\b'],
        "states": [
            'HA NOI', 'HO CHI MINH CITY', 'DA NANG', 'HAI PHONG', 'CAN THO',
            'AN GIANG', 'BA RIA VUNG TAU', 'BAC GIANG', 'BAC NINH', 'BEN TRE',
            'BINH DINH', 'BINH DUONG', 'BINH THUAN', 'CA MAU', 'DAK LAK',
            'DONG NAI', 'GIA LAI', 'KHANH HOA', 'KIEN GIANG', 'LAM DONG',
            'LONG AN', 'NGHE AN', 'NINH BINH', 'PHU THO', 'QUANG NAM',
            'QUANG NGAI', 'QUANG NINH', 'SOC TRANG', 'THAI NGUYEN', 'THANH HOA',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{6})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'HANOI', 'HO CHI MINH CITY', 'SAIGON', 'DA NANG', 'HAI PHONG',
            'CAN THO', 'BIEN HOA', 'HUE', 'NHA TRANG', 'VUNG TAU',
        ],
    },

   "SOUTH KOREA": {
        "country_patterns": [
        r'\bSOUTH KOREA\b', r'\bKOREA\b', r'\bROK\b', r'\bREPUBLIC OF KOREA\b',
        ],
        "states": [
        'SEOUL', 'BUSAN', 'DAEGU', 'INCHEON', 'GWANGJU', 'DAEJEON', 'ULSAN',
        'SEJONG', 'GYEONGGI', 'GANGWON', 'CHUNGCHEONGNAM', 'CHUNGCHEONGBUK',
        'JEOLLANAM', 'JEOLLABUK', 'GYEONGSANGNAM', 'GYEONGSANGBUK', 'JEJU',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
        'SEOUL', 'BUSAN', 'INCHEON', 'DAEGU', 'DAEJEON', 'GWANGJU', 'SUWON',
        'ULSAN', 'YONGIN', 'GOYANG', 'CHANGWON', 'SEONGNAM', 'CHEONGJU',
        'ANSAN', 'JEONJU', 'CHEONAN', 'GIMHAE', 'POHANG', 'JEJU CITY',
    ],
    },
    "PHILIPPINES": {
        "country_patterns": [r'\bPHILIPPINES\b', r'\bPHL\b', r'\bPH\b'],
        "states": [
        'METRO MANILA', 'ABRA', 'AGUSAN', 'AKLAN', 'ALBAY', 'ANTIQUE',
        'BATAAN', 'BATANES', 'BATANGAS', 'BENGUET', 'BOHOL', 'BULACAN',
        'CAGAYAN', 'CAVITE', 'CEBU', 'DAVAO', 'ILOILO', 'LAGUNA', 'LEYTE',
        'PAMPANGA', 'PANGASINAN', 'QUEZON', 'RIZAL', 'ZAMBALES',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
        'QUEZON CITY', 'MANILA', 'DAVAO CITY', 'CALOOCAN', 'CEBU CITY',
        'ZAMBOANGA CITY', 'TAGUIG', 'ANTIPOLO', 'PASIG', 'CAGAYAN DE ORO',
        'PARAÑAQUE', 'DASMARIÑAS', 'VALENZUELA', 'BACOOR', 'GENERAL SANTOS',
        'MAKATI', 'BAGUIO', 'ILIGAN',
    ],
    },
    "VIETNAM": {
        "country_patterns": [r'\bVIETNAM\b', r'\bVIET NAM\b', r'\bVNM\b'],
        "states": [
            'HA NOI', 'HO CHI MINH CITY', 'DA NANG', 'HAI PHONG', 'CAN THO',
            'AN GIANG', 'BA RIA VUNG TAU', 'BAC GIANG', 'BAC NINH', 'BEN TRE',
            'BINH DINH', 'BINH DUONG', 'BINH THUAN', 'CA MAU', 'DAK LAK',
            'DONG NAI', 'GIA LAI', 'KHANH HOA', 'KIEN GIANG', 'LAM DONG',
            'LONG AN', 'NGHE AN', 'NINH BINH', 'PHU THO', 'QUANG NAM',
            'QUANG NGAI', 'QUANG NINH', 'SOC TRANG', 'THAI NGUYEN', 'THANH HOA',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5,6})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'HANOI', 'HO CHI MINH CITY', 'SAIGON', 'DA NANG', 'HAI PHONG',
            'CAN THO', 'BIEN HOA', 'HUE', 'NHA TRANG', 'VUNG TAU', 'DA LAT',
        ],
    },


    # ==================== NEW COUNTRIES ====================

    "TAIWAN": {
        "country_patterns": [r'\bTAIWAN\b', r'\bROC\b', r'\bREPUBLIC OF CHINA\b'],
        "states": [
            'TAIPEI', 'NEW TAIPEI', 'TAOYUAN', 'TAICHUNG', 'TAINAN', 'KAOHSIUNG',
            'KEELUNG', 'HSINCHU', 'CHIayi', 'PINGTUNG', 'TAITUNG', 'HUALIEN',
            'YILAN', 'NANTou', 'CHANGHUA', 'YUNLIN', 'MIAOLI', 'KINMEN', 'MATSU',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{3,5})\b(?!\d)',  # usually 3 or 5 digits
        "city_strategy": "before_postcode",
        "cities": [
            'TAIPEI', 'KAOHSIUNG', 'TAICHUNG', 'TAINAN', 'NEW TAIPEI',
            'TAOYUAN', 'HSINCHU', 'KEELUNG', 'CHIayi', 'PINGTUNG',
        ],
    },

    "HONG KONG": {
        "country_patterns": [r'\bHONG KONG\b', r'\bHK\b', r'\bHONGKONG\b'],
        "states": [
            'HONG KONG ISLAND', 'KOWLOON', 'NEW TERRITORIES',
            'CENTRAL', 'WAN CHAI', 'EASTERN', 'SOUTHERN',
            'YAU TSIM MONG', 'SHAM SHUI PO', 'KOWLOON CITY',
            'WONG TAI SIN', 'KWUN TONG', 'TSUEN WAN', 'TUEN MUN',
            'YUEN LONG', 'NORTH', 'TAI PO', 'SHA TIN', 'SAI KUNG',
            'ISLANDS',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": None,  # Hong Kong does not use postcodes (rarely 999077 etc.)
        "city_strategy": "generic",
        "cities": ['HONG KONG', 'KOWLOON', 'HONG KONG ISLAND', 'NEW TERRITORIES'],
    },

    "NEPAL": {
        "country_patterns": [r'\bNEPAL\b', r'\bNPL\b'],
        "states": [
            'BAGMATI', 'MADHESH', 'PROVINCE 1', 'GANDAKI', 'LUMBINI',
            'KARNALI', 'SUDURPASCHIM', 'KATHMANDU', 'POKHARA', 'BIRATNAGAR',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'KATHMANDU', 'POKHARA', 'LALITPUR', 'BIRATNAGAR', 'BHAKTAPUR',
            'BIRGUNJ', 'DHARAN', 'BUTWAL', 'NEPALGUNJ', 'DHANGADHI',
        ],
    },

    "MYANMAR": {
        "country_patterns": [r'\bMYANMAR\b', r'\bBURMA\b', r'\bMMR\b'],
        "states": [
            'YANGON', 'MANDALAY', 'NAYPYIDAW', 'BAGO', 'AYEYARWADY',
            'SAGAING', 'MAGWAY', 'TANINTHARYI', 'KACHIN', 'KAYAH',
            'KAYIN', 'CHIN', 'MON', 'RAKHINE', 'SHAN',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'YANGON', 'RANGOON', 'MANDALAY', 'NAYPYIDAW', 'BAGO',
            'MOULMEIN', 'PATHEIN', 'SITTWE', 'TAUNGGYI', 'MYITKYINA',
        ],
    },

    "CAMBODIA": {
        "country_patterns": [r'\bCAMBODIA\b', r'\bKHMER\b', r'\bKHM\b'],
        "states": [
            'PHNOM PENH', 'SIEM REAP', 'BATTAMBANG', 'KAMPONG CHAM',
            'SIHANOUKVILLE', 'KAMPOT', 'TAKEO', 'KAMPONG SPEU',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5,6})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'PHNOM PENH', 'SIEM REAP', 'SIHANOUKVILLE', 'BATTAMBANG',
            'KAMPONG CHAM', 'POIPET', 'KAMPOT',
        ],
    },

    "LAOS": {
        "country_patterns": [r'\bLAOS\b', r'\bLAO PDR\b', r'\bLAO\b'],
        "states": [
            'VIENTIANE', 'LUANG PRABANG', 'SAVANNAKHET', 'CHAMPASAK',
            'XIENG KHUANG', 'HOUAPHAN', 'BOKAEO',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'VIENTIANE', 'LUANG PRABANG', 'SAVANNAKHET', 'PAKSE',
            'THAKHEK', 'XAYABOURY',
        ],
    },

    "BRUNEI": {
        "country_patterns": [r'\bBRUNEI\b', r'\bBRN\b'],
        "states": [
            'BRUNEI-MUARA', 'BELAIT', 'TUTONG', 'TEMBURONG',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',  # or BSxxxx format sometimes
        "city_strategy": "before_postcode",
        "cities": ['BANDAR SERI BEGAWAN', 'KUALA BELAIT', 'SERIA', 'TUTONG'],
    },

    "MONGOLIA": {
        "country_patterns": [r'\bMONGOLIA\b', r'\bMNG\b'],
        "states": [
            'ULAANBAATAR', 'ARKHANGAY', 'BAYAN-OLGII', 'BAYANKHONGOR',
            'BULGAN', 'DARKHAN-UUL', 'DORNOD', 'DORNOGOVI', 'DUNDGOVI',
            'GOVI-ALTAI', 'GOVISUMBER', 'KHENTII', 'KHOVD', 'KHUVSGUL',
            'ORHON', 'OVORKHANGAI', 'SELVENG', 'SUKHBAATAR', 'TUV', 'ZAVKHAN',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": ['ULAANBAATAR', 'ERDENET', 'DARKHAN', 'CHOIBALSAN'],
    },

    "MALDIVES": {
        "country_patterns": [r'\bMALDIVES\b', r'\bMDV\b'],
        "states": [
            'MALE', 'ADDU CITY', 'FUVAHMULAH', 'KULHUDHUFFUSHI',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "generic",
        "cities": ['MALE', 'ADDU CITY', 'FUVAHMULAH'],
    },

    "QATAR": {
        "country_patterns": [r'\bQATAR\b', r'\bQAT\b'],
        "states": [
            'DOHA', 'AL RAYYAN', 'AL WAKRAH', 'AL KHOR', 'UMM SALAL',
            'AL DAAYEN', 'AL SHAMAL', 'AL SHAHANIYA', 'LUSAIL'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": None,   # Qatar does not use postal codes (PO Box based)
        "city_strategy": "state_anchor",
        "cities": ['DOHA', 'LUSAIL', 'AL WAKRAH', 'AL KHOR', 'AL RAYYAN'],
    },

    "OMAN": {
        "country_patterns": [r'\bOMAN\b', r'\bOMN\b'],
        "states": [
            'MUSCAT', 'DHOFAR', 'AL BATINAH', 'AL SHARQIYAH', 'AL DHAHIRAH',
            'AL BURAYMI', 'AL WUSTA', 'MUSANDAM', 'SOHAR', 'SALALAH'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{3})\b(?!\d)',  # 3-digit postcodes
        "city_strategy": "before_postcode",
        "cities": ['MUSCAT', 'SALALAH', 'SOHAR', 'NIZWA', 'SUR', 'IBRA'],
    },

    "KUWAIT": {
        "country_patterns": [r'\bKUWAIT\b', r'\bKWT\b'],
        "states": [
            'AL ASIMAH', 'HAWALLI', 'AL FARWANIYAH', 'AL JAHRA', 
            'AL AHMADI', 'MUBARAK AL KABEER'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',  # 5 digits
        "city_strategy": "before_postcode",
        "cities": ['KUWAIT CITY', 'HAWALLI', 'SALMIYA', 'AL AHMADI', 'AL JAHRA', 'FARWANIYA'],
    },

    "BAHRAIN": {
        "country_patterns": [r'\bBAHRAIN\b', r'\bBHR\b'],
        "states": [
            'CAPITAL', 'MUHARRAQ', 'NORTHERN', 'SOUTHERN', 'RIFFA', 'MANAMA'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',  # 4 or 5 digits
        "city_strategy": "before_postcode",
        "cities": ['MANAMA', 'MUHARRAQ', 'RIFFA', 'ISA TOWN', 'HAMAD TOWN', 'SITRA'],
    },

    "IRAN": {
        "country_patterns": [r'\bIRAN\b', r'\bIRN\b', r'\bISLAMIC REPUBLIC OF IRAN\b'],
        "states": [
            'TEHRAN', 'ISFAHAN', 'MASHHAD', 'SHIRAZ', 'TABRIZ', 'KARAJ',
            'AHVAZ', 'QOM', 'KERMANSHAH', 'RAZAVI KHORASAN'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5}-\d{5})\b(?!\d)',  # 10 digits with hyphen (e.g. 12345-67890)
        "city_strategy": "before_postcode",
        "cities": ['TEHRAN', 'MASHHAD', 'ISFAHAN', 'SHIRAZ', 'TABRIZ', 'KARAJ', 'AHVAZ'],
    },

    "KAZAKHSTAN": {
        "country_patterns": [r'\bKAZAKHSTAN\b', r'\bKAZ\b'],
        "states": [
            'ALMATY', 'ASTANA', 'SHYMKENT', 'AKMOLA', 'AKTOBE', 'ALMATY REGION',
            'ATYRAU', 'EAST KAZAKHSTAN', 'KARAGANDA', 'KOSTANAY', 'MANGYSTAU',
            'NORTH KAZAKHSTAN', 'PAVLODAR', 'TURKESTAN', 'WEST KAZAKHSTAN'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{6})\b(?!\d)',  # 6 digits (old system widely used)
        "city_strategy": "before_postcode",
        "cities": ['ALMATY', 'ASTANA', 'NUR-SULTAN', 'SHYMKENT', 'KARAGANDA', 'AKTOBE'],
    },

    "UZBEKISTAN": {
        "country_patterns": [r'\bUZBEKISTAN\b', r'\bUZB\b'],
        "states": [
            'TASHKENT', 'SAMARKAND', 'BUKHARA', 'FERGANA', 'ANDIJAN', 'NAMANGAN',
            'NAVOI', 'KHORAZM', 'KASHKADARYA', 'SURKHANDARYA'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{6})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": ['TASHKENT', 'SAMARKAND', 'BUKHARA', 'FERGANA', 'ANDIJAN', 'NAMANGAN'],
    },

    "BHUTAN": {
        "country_patterns": [r'\bBHUTAN\b', r'\bBTN\b'],
        "states": [
            'THIMPHU', 'PARO', 'PUNAKHA', 'WANGDUE', 'TRASHIGANG', 'SAMTSE'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',  # 5 digits
        "city_strategy": "before_postcode",
        "cities": ['THIMPHU', 'PHUENTSHOLING', 'PARO', 'GEYLEGPHUG', 'SAMDRUP JONGKHAR'],
    },

    "AFGHANISTAN": {
        "country_patterns": [r'\bAFGHANISTAN\b', r'\bAFG\b'],
        "states": [
            'KABUL', 'KANDAHAR', 'HERAT', 'MAZAR-I-SHARIF', 'JALALABAD', 'KUNDUZ'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',  # 4 digits
        "city_strategy": "before_postcode",
        "cities": ['KABUL', 'KANDAHAR', 'HERAT', 'MAZAR-I-SHARIF', 'JALALABAD'],
    },
}

# ═══════════════════════════════════════════════════════════════════════════════
# EUROPE
# ═══════════════════════════════════════════════════════════════════════════════

EUROPE: Dict[str, Dict] = {

  "UNITED KINGDOM": {
        "country_patterns": [
            r'\bUNITED KINGDOM\b', r'\bU\.?K\.?\b', r'\bGREAT BRITAIN\b',
            r'\bBRITAIN\b', r'\bUK\b',
            r'\bUNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND\b',
        ],
        "states": [
            'ENGLAND', 'SCOTLAND', 'WALES', 'NORTHERN IRELAND',
            'GREATER LONDON', 'GREATER MANCHESTER', 'WEST MIDLANDS',
            'WEST YORKSHIRE', 'SOUTH YORKSHIRE', 'MERSEYSIDE', 'TYNE AND WEAR',
            'KENT', 'ESSEX', 'HAMPSHIRE', 'SURREY', 'LANCASHIRE', 'CHESHIRE',
            'DEVON', 'CORNWALL', 'DORSET', 'SOMERSET', 'GLOUCESTERSHIRE',
            'OXFORDSHIRE', 'BUCKINGHAMSHIRE', 'HERTFORDSHIRE', 'BEDFORDSHIRE',
            'NORFOLK', 'SUFFOLK', 'CAMBRIDGESHIRE', 'LINCOLNSHIRE',
            'NORTH YORKSHIRE', 'EAST YORKSHIRE', 'DERBYSHIRE', 'NOTTINGHAMSHIRE',
            'LEICESTERSHIRE', 'WARWICKSHIRE', 'STAFFORDSHIRE', 'SHROPSHIRE',
            'HEREFORDSHIRE', 'WORCESTERSHIRE', 'HIGHLANDS', 'ABERDEENSHIRE',
            'FIFE', 'PERTHSHIRE', 'AYRSHIRE', 'POWYS', 'GWENT', 'DYFED', 'CLWYD',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b',
        "city_strategy": "before_postcode_dotted",
        "cities": [
            'LONDON', 'BIRMINGHAM', 'MANCHESTER', 'GLASGOW', 'LIVERPOOL',
            'LEEDS', 'SHEFFIELD', 'EDINBURGH', 'BRISTOL', 'LEICESTER',
            'COVENTRY', 'BRADFORD', 'NOTTINGHAM', 'KINGSTON UPON HULL',
            'NEWCASTLE UPON TYNE', 'STOKE-ON-TRENT', 'SOUTHAMPTON',
            'DERBY', 'PORTSMOUTH', 'BRIGHTON', 'PLYMOUTH', 'WOLVERHAMPTON',
            'NORWICH', 'SWANSEA', 'CARDIFF', 'BELFAST', 'ABERDEEN',
            'CHEADLE HULME', 'CHEADLE', 'STOCKPORT', 'SALFORD', 'BOLTON',
            'MANCHESTER', 'LIVERPOOL', 'GLASGOW'
        ],
    },

    "GERMANY": {
        "country_patterns": [
            r'\bGERMANY\b', r'\bDEUTSCHLAND\b', r'\bFEDERAL REPUBLIC OF GERMANY\b',
        ],
        "states": [
            'BAVARIA', 'NORTH RHINE-WESTPHALIA', 'BADEN-WÜRTTEMBERG',
            'LOWER SAXONY', 'HESSE', 'SAXONY', 'RHINELAND-PALATINATE',
            'BERLIN', 'HAMBURG', 'BREMEN', 'THURINGIA', 'SAXONY-ANHALT',
            'MECKLENBURG-VORPOMMERN', 'SAARLAND', 'BRANDENBURG',
            'SCHLESWIG-HOLSTEIN',
            'BAYERN', 'NORDRHEIN-WESTFALEN', 'NIEDERSACHSEN', 'HESSEN', 'SACHSEN',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "postcode_then_city",
        "cities": [
            'BERLIN', 'HAMBURG', 'MUNICH', 'MÜNCHEN', 'COLOGNE', 'KÖLN',
            'FRANKFURT', 'STUTTGART', 'DÜSSELDORF', 'DORTMUND', 'ESSEN',
            'LEIPZIG', 'BREMEN', 'DRESDEN', 'HANOVER', 'HANNOVER', 'NUREMBERG',
            'NÜRNBERG', 'DUISBURG', 'BOCHUM', 'WUPPERTAL', 'BIELEFELD',
            'BONN', 'MÜNSTER', 'KARLSRUHE', 'MANNHEIM', 'AUGSBURG'
        ],
    },

    "FRANCE": {
        "country_patterns": [r'\bFRANCE\b', r'\bFRENCH REPUBLIC\b'],
        "states": [
            'ILE-DE-FRANCE', 'PROVENCE-ALPES-CÔTE D\'AZUR',
            'AUVERGNE-RHÔNE-ALPES', 'NOUVELLE-AQUITAINE', 'OCCITANIE',
            'HAUTS-DE-FRANCE', 'GRAND EST', 'PAYS DE LA LOIRE', 'NORMANDIE',
            'BRETAGNE', 'BOURGOGNE-FRANCHE-COMTÉ', 'CENTRE-VAL DE LOIRE',
            'CORSICA', 'CORSE', 'AQUITAINE', 'LANGUEDOC-ROUSSILLON',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "postcode_then_city",
        "cities": [
            'PARIS', 'MARSEILLE', 'LYON', 'TOULOUSE', 'NICE', 'NANTES',
            'STRASBOURG', 'MONTPELLIER', 'BORDEAUX', 'LILLE', 'RENNES',
            'REIMS', 'LE HAVRE', 'SAINT-ÉTIENNE', 'TOULON', 'GRENOBLE',
            'DIJON', 'ANGERS', 'NÎMES', 'VILLEURBANNE', 'CDG'
        ],
    },

    "NETHERLANDS": {
        "country_patterns": [
            r'\bNETHERLANDS\b', r'\bHOLLAND\b', r'\bTHE NETHERLANDS\b', r'\bNL\b',
        ],
        "states": [
            'NORTH HOLLAND', 'SOUTH HOLLAND', 'UTRECHT', 'GELDERLAND',
            'NORTH BRABANT', 'LIMBURG', 'OVERIJSSEL', 'GRONINGEN',
            'FRIESLAND', 'DRENTHE', 'ZEELAND', 'FLEVOLAND',
            'NOORD-HOLLAND', 'ZUID-HOLLAND', 'NOORD-BRABANT',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'\b(\d{4}\s*[A-Z]{2})\b',
        "city_strategy": "postcode_then_city",
        "cities": [
            'AMSTERDAM', 'ROTTERDAM', 'THE HAGUE', 'DEN HAAG', 'UTRECHT',
            'EINDHOVEN', 'GRONINGEN', 'TILBURG', 'ALMERE', 'BREDA',
            'NIJMEGEN', 'ENSCHEDE', 'HAARLEM', 'APELDOORN'
        ],
    },

    "DENMARK": {
        "country_patterns": [r'\bDENMARK\b', r'\bDANMARK\b', r'\bDNK\b'],
        "states": [
            'CAPITAL REGION', 'REGION ZEALAND', 'REGION OF SOUTHERN DENMARK',
            'CENTRAL DENMARK REGION', 'NORTH DENMARK REGION',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "postcode_then_city",
        "cities": [
            'COPENHAGEN', 'AARHUS', 'ODENSE', 'AALBORG', 'FREDERIKSBERG',
            'ESBJERG', 'GENTOFTE', 'GLADSAXE', 'RANDERS', 'KOLDING',
        ],
    },

    "SWEDEN": {
        "country_patterns": [r'\bSWEDEN\b', r'\bSVERIGE\b', r'\bSWE\b'],
        "states": [
            'STOCKHOLM', 'VÄSTRA GÖTALAND', 'SKÅNE', 'ÖSTERGÖTLAND',
            'JÖNKÖPING', 'SÖDERMANLAND', 'ÖREBRO', 'DALARNA', 'NORRBOTTEN',
            'VÄSTERBOTTEN', 'GÄVLEBORG', 'HALLAND', 'VÄSTMANLAND', 'KALMAR',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{3}\s*\d{2})\b(?!\d)',
        "city_strategy": "postcode_then_city",
        "cities": [
            'STOCKHOLM', 'GOTHENBURG', 'GÖTEBORG', 'MALMÖ', 'UPPSALA',
            'LINKÖPING', 'VÄSTERÅS', 'ÖREBRO', 'HELSINGBORG', 'JÖNKÖPING',
        ],
    },

    "NORWAY": {
        "country_patterns": [r'\bNORWAY\b', r'\bNORGE\b', r'\bNOR\b'],
        "states": [
            'VIKEN', 'INNLANDET', 'VESTFOLD OG TELEMARK', 'AGDER',
            'ROGALAND', 'VESTLAND', 'MØRE OG ROMSDAL', 'TRØNDELAG',
            'NORDLAND', 'TROMS OG FINNMARK', 'OSLO',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "postcode_then_city",
        "cities": [
            'OSLO', 'BERGEN', 'TRONDHEIM', 'STAVANGER', 'DRAMMEN',
            'FREDRIKSTAD', 'KRISTIANSAND', 'TROMSØ', 'SARPSBORG', 'SANDNES',
        ],
    },

    "FINLAND": {
        "country_patterns": [r'\bFINLAND\b', r'\bSUOMI\b', r'\bFIN\b'],
        "states": [
            'UUSIMAA', 'PIRKANMAA', 'FINLAND PROPER', 'NORTH SAVO',
            'CENTRAL FINLAND', 'NORTH KARELIA', 'SOUTH KARELIA', 'LAPLAND',
            'SATAKUNTA', 'KANTA-HÄME', 'PÄIJÄT-HÄME', 'KYMENLAAKSO',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "postcode_then_city",
        "cities": [
            'HELSINKI', 'ESPOO', 'TAMPERE', 'VANTAA', 'OULU',
            'TURKU', 'JYVÄSKYLÄ', 'LAHTI', 'KUOPIO', 'PORI',
        ],
    },

    "ITALY": {
        "country_patterns": [r'\bITALY\b', r'\bITALIA\b', r'\bITA\b'],
        "states": [
            'LOMBARDY', 'LAZIO', 'CAMPANIA', 'SICILY', 'PIEDMONT', 'VENETO',
            'EMILIA-ROMAGNA', 'PUGLIA', 'TUSCANY', 'CALABRIA', 'SARDINIA',
            'LIGURIA', 'MARCHE', 'ABRUZZO', 'FRIULI VENEZIA GIULIA', 'UMBRIA',
            'BASILICATA', 'MOLISE', 'TRENTINO-ALTO ADIGE', 'VALLE D\'AOSTA',
            'LOMBARDIA', 'PIEMONTE', 'TOSCANA', 'SICILIA', 'SARDEGNA',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "postcode_then_city",
        "cities": [
            'ROME', 'MILAN', 'MILANO', 'ROMA', 'NAPLES', 'NAPOLI', 'TURIN',
            'TORINO', 'PALERMO', 'GENOA', 'BOLOGNA', 'FLORENCE', 'FIRENZE',
            'BARI', 'CATANIA', 'VENICE', 'VENEZIA', 'VERONA', 'MESSINA',
            'PADUA', 'PADOVA', 'TRIESTE', 'BRESCIA', 'PARMA', 'TARANTO',
        ],
    },

    "SPAIN": {
        "country_patterns": [r'\bSPAIN\b', r'\bESPAÑA\b', r'\bESP\b'],
        "states": [
            'ANDALUSIA', 'CATALONIA', 'COMMUNITY OF MADRID', 'VALENCIAN COMMUNITY',
            'GALICIA', 'CASTILE AND LEON', 'BASQUE COUNTRY', 'CASTILE-LA MANCHA',
            'CANARY ISLANDS', 'EXTREMADURA', 'ASTURIAS', 'MURCIA', 'ARAGON',
            'BALEARIC ISLANDS', 'LA RIOJA', 'NAVARRE', 'CANTABRIA',
            'ANDALUCÍA', 'CATALUÑA', 'MADRID', 'VALENCIA', 'PAÍS VASCO',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "postcode_then_city",
        "cities": [
            'MADRID', 'BARCELONA', 'VALENCIA', 'SEVILLE', 'SEVILLA',
            'ZARAGOZA', 'MÁLAGA', 'MURCIA', 'PALMA', 'BILBAO', 'ALICANTE',
            'CÓRDOBA', 'VALLADOLID', 'VIGO', 'GIJÓN', 'GRANADA',
        ],
    },

    "BELGIUM": {
        "country_patterns": [r'\bBELGIUM\b', r'\bBELGIQUE\b', r'\bBELGIËN\b', r'\bBEL\b'],
        "states": [
            'BRUSSELS', 'FLANDERS', 'WALLONIA', 'ANTWERP', 'GHENT',
            'EAST FLANDERS', 'WEST FLANDERS', 'BRABANT WALLON',
            'LIÈGE', 'NAMUR', 'LUXEMBOURG', 'HAINAUT',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "postcode_then_city",
        "cities": [
            'BRUSSELS', 'BRUXELLES', 'ANTWERP', 'GENT', 'CHARLEROI',
            'LIÈGE', 'BRUGES', 'NAMUR', 'LEUVEN', 'MONS',
        ],
    },

    "SWITZERLAND": {
        "country_patterns": [r'\bSWITZERLAND\b', r'\bSCHWEIZ\b', r'\bCHE\b', r'\bCH\b'],
        "states": [
            'ZURICH', 'BERN', 'VAUD', 'AARGAU', 'ST GALLEN', 'GENEVA',
            'LUCERNE', 'TICINO', 'VALAIS', 'BASEL-STADT', 'SOLOTHURN',
            'GRAUBÜNDEN', 'FRIBOURG', 'THURGAU', 'SCHAFFHAUSEN',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "postcode_then_city",
        "cities": [
            'ZURICH', 'ZÜRICH', 'GENEVA', 'GENÈVE', 'BASEL', 'BERN',
            'LAUSANNE', 'WINTERTHUR', 'LUCERNE', 'LUZERN', 'ST GALLEN',
        ],
    },

    "POLAND": {
        "country_patterns": [r'\bPOLAND\b', r'\bPOLSKA\b', r'\bPOL\b'],
        "states": [
            'LOWER SILESIA', 'KUYAVIAN-POMERANIAN', 'LUBLIN', 'LUBUSZ',
            'ŁÓDŹ', 'LESSER POLAND', 'MASOVIAN', 'OPOLE', 'SUBCARPATHIAN',
            'PODLASKIE', 'POMERANIAN', 'SILESIA', 'HOLY CROSS', 'WARMIAN-MASURIAN',
            'GREATER POLAND', 'WEST POMERANIAN',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'\b(\d{2}-\d{3})\b',
        "city_strategy": "postcode_then_city",
        "cities": [
            'WARSAW', 'KRAKÓW', 'ŁÓDŹ', 'WROCŁAW', 'POZNAŃ', 'GDAŃSK',
            'SZCZECIN', 'BYDGOSZCZ', 'LUBLIN', 'KATOWICE',
        ],
    },

    "RUSSIA": {
        "country_patterns": [
            r'\bRUSSIA\b', r'\bRUSSIAN FEDERATION\b', r'\bRF\b', r'\bROSSIYA\b',
        ],
        "states": [
            'MOSCOW OBLAST', 'LENINGRAD OBLAST', 'KRASNODAR KRAI', 'TATARSTAN',
            'SVERDLOVSK OBLAST', 'NOVOSIBIRSK OBLAST', 'CHELYABINSK OBLAST',
            'NIZHNY NOVGOROD OBLAST', 'SAMARA OBLAST', 'OMSK OBLAST',
            'ROSTOV OBLAST', 'BASHKORTOSTAN', 'PERM KRAI', 'VOLGOGRAD OBLAST',
            'MOSCOW', 'SAINT PETERSBURG', 'KRASNOYARSK KRAI',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{6})\b(?!\d)',
        "city_strategy": "state_then_pin",
        "cities": [
            'MOSCOW', 'SAINT PETERSBURG', 'NOVOSIBIRSK', 'YEKATERINBURG',
            'NIZHNY NOVGOROD', 'KAZAN', 'CHELYABINSK', 'OMSK', 'SAMARA',
            'ROSTOV-ON-DON', 'UFA', 'KRASNOYARSK', 'SOCHI',
        ],
    },

    "IRELAND": {
        "country_patterns": [r'\bIRELAND\b', r'\bIRL\b', r'\bEIRE\b', r'\bÉIRE\b'],
        "states": [
            'CONNACHT', 'LEINSTER', 'MUNSTER', 'ULSTER',
            'DUBLIN', 'CORK', 'GALWAY', 'LIMERICK', 'WATERFORD',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'\b([A-Z]\d{2}\s*[A-Z\d]{4})\b',   # Eircode
        "city_strategy": "before_postcode",
        "cities": [
            'DUBLIN', 'CORK', 'LIMERICK', 'GALWAY', 'WATERFORD',
            'DROGHEDA', 'DUNDALK', 'SWORDS', 'BRAY', 'NAVAN',
        ],
    },

    "PORTUGAL": {
        "country_patterns": [r'\bPORTUGAL\b', r'\bPRT\b'],
        "states": [
            'NORTH', 'CENTRE', 'METROPOLITAN AREA OF LISBON', 'ALENTEJO',
            'ALGARVE', 'AZORES', 'MADEIRA', 'NORTE', 'CENTRO', 'LISBOA',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'\b(\d{4}-\d{3})\b',
        "city_strategy": "postcode_then_city",
        "cities": [
            'LISBON', 'LISBOA', 'PORTO', 'AMADORA', 'BRAGA', 'COIMBRA',
            'FUNCHAL', 'SETUBAL', 'AVEIRO', 'ÉVORA',
        ],
    },

    "AUSTRIA": {
        "country_patterns": [r'\bAUSTRIA\b', r'\bÖSTERREICH\b', r'\bAUT\b'],
        "states": [
            'VIENNA', 'VIENNE', 'Wien', 'LOWER AUSTRIA', 'UPPER AUSTRIA',
            'STYRIA', 'TYROL', 'CARINTHIA', 'SALZBURG', 'VORARLBERG',
            'BURGENLAND', 'NIEDERÖSTERREICH', 'OBERÖSTERREICH', 'STEIERMARK'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "postcode_then_city",
        "cities": [
            'VIENNA', 'WIEN', 'GRAZ', 'LINZ', 'SALZBURG', 'INNSBRUCK',
            'KLAGENFURT', 'VILLACH', 'WELS', 'ST. PÖLTEN'
        ],
    },

    "CZECH REPUBLIC": {
        "country_patterns": [r'\bCZECH REPUBLIC\b', r'\bCZECHIA\b', r'\bČESKÁ REPUBLIKA\b', r'\bCZE\b'],
        "states": [
            'PRAGUE', 'CENTRAL BOHEMIA', 'SOUTH BOHEMIA', 'PLZEŇ', 'KARLOVY VARY',
            'ÚSTÍ NAD LABEM', 'LIBEREC', 'HRADEC KRÁLOVÉ', 'PARDUBICE',
            'VYSOČINA', 'SOUTH MORAVIA', 'OLOMOUC', 'ZLÍN', 'MORAVIA-SILESIA'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'\b(\d{3}\s?\d{2})\b',
        "city_strategy": "postcode_then_city",
        "cities": [
            'PRAGUE', 'PRAHA', 'BRNO', 'OSTRAVA', 'PLZEŇ', 'LIBEREC',
            'OLOMOUC', 'ÚSTÍ NAD LABEM', 'ČESKÉ BUDĚJOVICE', 'HRADEC KRÁLOVÉ'
        ],
    },

    "HUNGARY": {
        "country_patterns": [r'\bHUNGARY\b', r'\bMAGYARORSZÁG\b', r'\bHUN\b'],
        "states": [
            'BUDAPEST', 'PEST', 'GYŐR-MOSON-SOPRON', 'VAS', 'ZALA',
            'BARANYA', 'SOMOGY', 'TOLNA', 'FEJÉR', 'KOMÁROM-ESZTERGOM',
            'NÓGRÁD', 'HEVES', 'BORSOD-ABAÚJ-ZEMPLÉN', 'SZABOLCS-SZATMÁR-BEREG',
            'HAJDÚ-BIHAR', 'BÉKÉS', 'CSONGRÁD'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "postcode_then_city",
        "cities": [
            'BUDAPEST', 'DEBRECEN', 'SZEGED', 'MISKOLC', 'PÉCS',
            'GYŐR', 'NYÍREGYHÁZA', 'KECSKEMÉT', 'SZÉKESFEHÉRVÁR'
        ],
    },

    "GREECE": {
        "country_patterns": [r'\bGREECE\b', r'\bELLADA\b', r'\bELLAS\b', r'\bGRC\b'],
        "states": [
            'ATTICA', 'CENTRAL MACEDONIA', 'THESSALY', 'CRETE', 'EAST MACEDONIA AND THRACE',
            'WESTERN GREECE', 'PELOPONNESE', 'EPIRUS', 'NORTH AEGEAN', 'SOUTH AEGEAN'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{3}\s?\d{2})\b(?!\d)',  # or simply \d{5}
        "city_strategy": "postcode_then_city",
        "cities": [
            'ATHENS', 'ATHINA', 'THESSALONIKI', 'PATRA', 'HERAKLION',
            'LARISSA', 'VOLOS', 'IOANNINA', 'CHANIA', 'RHODES'
        ],
    },

    "ROMANIA": {
        "country_patterns": [r'\bROMANIA\b', r'\bROU\b'],
        "states": [
            'BUCHAREST', 'CLUJ', 'TIMIȘ', 'CONSTANȚA', 'IAȘI', 'DOLJ',
            'BRAȘOV', 'PRAHOVA', 'BIHOR', 'ARAD', 'SIBIU'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{6})\b(?!\d)',  # 6 digits
        "city_strategy": "postcode_then_city",
        "cities": [
            'BUCHAREST', 'BUCUREȘTI', 'CLUJ-NAPOCA', 'TIMIȘOARA', 'IAȘI',
            'CONSTANȚA', 'CRAIOVA', 'BRAȘOV', 'GALAȚI', 'PLOIEȘTI'
        ],
    },

    "BULGARIA": {
        "country_patterns": [r'\bBULGARIA\b', r'\bBGR\b'],
        "states": [
            'SOFIA CITY', 'SOFIA PROVINCE', 'PLOVDIV', 'VARNA', 'BURGAS',
            'RUSE', 'STARA ZAGORA', 'PLEVEN', 'VELIKO TARNOVO'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "postcode_then_city",
        "cities": [
            'SOFIA', 'PLOVDIV', 'VARNA', 'BURGAS', 'RUSE',
            'STARA ZAGORA', 'PLEVEN', 'SLIVEN', 'VELIKO TARNOVO'
        ],
    },

    "CROATIA": {
        "country_patterns": [r'\bCROATIA\b', r'\bHRVATSKA\b', r'\bHRV\b'],
        "states": [
            'ZAGREB', 'SPLIT-DALMATIA', 'ISTRA', 'PRIMORJE-GORSKI KOTAR',
            'OSJEK-BARANJA', 'DUBROVNIK-NERETVA', 'ZADAR'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "postcode_then_city",
        "cities": [
            'ZAGREB', 'SPLIT', 'RIJEKA', 'OSIJEK', 'ZADAR',
            'DUBROVNIK', 'PULA', 'SLAVONSKI BROD'
        ],
    },

    "SLOVAKIA": {
        "country_patterns": [r'\bSLOVAKIA\b', r'\bSLOVENSKO\b', r'\bSVK\b'],
        "states": [
            'BRATISLAVA', 'KOŠICE', 'PREŠOV', 'ŽILINA', 'BANSKÁ BYSTRICA',
            'TRENČÍN', 'NITRA', 'TRNAVA'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'\b(\d{3}\s?\d{2})\b',
        "city_strategy": "postcode_then_city",
        "cities": [
            'BRATISLAVA', 'KOŠICE', 'PREŠOV', 'ŽILINA', 'BANSKÁ BYSTRICA',
            'NITRA', 'TRNAVA', 'TRENČÍN'
        ],
    },

    "UKRAINE": {
        "country_patterns": [r'\bUKRAINE\b', r'\bUKR\b'],
        "states": [
            'KYIV', 'KHARKIV', 'DNIPRO', 'ODESSA', 'LVIV', 'DONETSK',
            'ZAPORIZHZHIA', 'MYKOLAIV', 'SEVASTOPOL'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "state_then_pin",
        "cities": [
            'KYIV', 'KIEV', 'KHARKIV', 'DNIPRO', 'DNIPROPETROVSK', 'ODESSA',
            'LVIV', 'LVOV', 'ZAPORIZHZHIA', 'MYKOLAIV'
        ],
    },

    "TURKEY": {
        "country_patterns": [r'\bTURKEY\b', r'\bTÜRKİYE\b', r'\bTUR\b'],
        "states": [
            'ISTANBUL', 'ANKARA', 'IZMIR', 'BURSA', 'ANTALYA', 'ADANA',
            'KONYA', 'GAZIANTEP', 'MERSIN', 'KAYSERI'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'ISTANBUL', 'ANKARA', 'IZMIR', 'BURSA', 'ANTALYA',
            'ADANA', 'KONYA', 'GAZIANTEP', 'MERSIN', 'ESKISEHIR'
        ],
    },
    "LUXEMBOURG": {
            "country_patterns": [r'\bLUXEMBOURG\b', r'\bLUX\b'],
            "states": ['LUXEMBOURG'],
            "state_codes": [],
            "code_guard": None,
            "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
            "city_strategy": "postcode_then_city",
            "cities": ['LUXEMBOURG', 'ESCH-SUR-ALZETTE', 'DIEKIRCH'],
        },
    }


# ═══════════════════════════════════════════════════════════════════════════════
# NORTH AMERICA
# ═══════════════════════════════════════════════════════════════════════════════

NORTH_AMERICA: Dict[str, Dict] = {

    "USA": {
        "country_patterns": [
            r'\bU\.?S\.?A\.?\b',
            r'\bUNITED STATES OF AMERICA\b',
            r'\bUNITED STATES\b',
            r'\bUS\b',
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
            'PUERTO RICO', 'GUAM',
        ],
        "state_codes": [
            'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
            'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
            'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
            'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
            'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
            'DC', 'PR', 'GU', 'AS', 'MP', 'VI', 'AA', 'AE', 'AP', 'OH',
        ],
        "code_guard": r'(?=\s+\d{5})',
        "postcode_pattern": r'(?<!\d)\b(\d{5})(?:-\d{4})?\b(?!\d)',
        "city_strategy": "city_state_zip",
        "cities": [
            'NEW YORK', 'LOS ANGELES', 'CHICAGO', 'HOUSTON', 'PHOENIX',
            'PHILADELPHIA', 'SAN ANTONIO', 'SAN DIEGO', 'DALLAS', 'SAN JOSE',
            'AUSTIN', 'JACKSONVILLE', 'FORT WORTH', 'COLUMBUS', 'CHARLOTTE',
            'INDIANAPOLIS', 'SAN FRANCISCO', 'SEATTLE', 'DENVER', 'BOSTON',
            'EL PASO', 'NASHVILLE', 'DETROIT', 'PORTLAND', 'MEMPHIS',
            'ATLANTA', 'MIAMI', 'MINNEAPOLIS', 'TAMPA', 'HONOLULU',
            'WASHINGTON DC', 'WASHINGTON', 'BALTIMORE', 'MILWAUKEE',
            'ALBUQUERQUE', 'TUCSON', 'FRESNO', 'SACRAMENTO', 'MESA',
            'KANSAS CITY', 'OMAHA', 'CLEVELAND', 'RALEIGH', 'COLORADO SPRINGS',
            'VIRGINIA BEACH', 'LONG BEACH', 'OAKLAND', 'TULSA', 'ARLINGTON',
            'WICHITA', 'BAKERSFIELD', 'AURORA', 'ANAHEIM', 'SANTA ANA',
            'CORPUS CHRISTI', 'RIVERSIDE', 'ST LOUIS', 'PITTSBURGH',
            'STOCKTON', 'SAINT PAUL', 'ANCHORAGE', 'CINCINNATI', 'PLANO',
            'NEWARK', 'ORLANDO', 'LINCOLN', 'JERSEY CITY', 'BUFFALO',
            'LUBBOCK', 'MADISON', 'DURHAM', 'NORFOLK', 'RENO', 'SCOTTSDALE',
            'BATON ROUGE', 'IRVING', 'FREMONT', 'BIRMINGHAM', 'RICHMOND',
            # Freight & suburb hubs
            'VALLEY STREAM', 'DULLES', 'ONTARIO', 'MORENO VALLEY', 'FONTANA'
        ],
    },

    "CANADA": {
        "country_patterns": [r'\bCANADA\b'],
        "states": [
            'ALBERTA', 'BRITISH COLUMBIA', 'MANITOBA', 'NEW BRUNSWICK',
            'NEWFOUNDLAND AND LABRADOR', 'NORTHWEST TERRITORIES', 'NOVA SCOTIA',
            'NUNAVUT', 'ONTARIO', 'PRINCE EDWARD ISLAND', 'QUEBEC',
            'SASKATCHEWAN', 'YUKON',
            'QUÉBEC', 'TERRE-NEUVE-ET-LABRADOR', 'NOUVEAU-BRUNSWICK',
        ],
        "state_codes": [
            'AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU',
            'ON', 'PE', 'QC', 'SK', 'YT',
        ],
        "code_guard": r'(?=\s+[A-Z]\d[A-Z])',
        "postcode_pattern": r'\b([A-Z]\d[A-Z]\s*\d[A-Z]\d)\b',
        "city_strategy": "city_state_zip",
        "cities": [
            'TORONTO', 'MONTREAL', 'VANCOUVER', 'CALGARY', 'EDMONTON',
            'OTTAWA', 'WINNIPEG', 'QUEBEC CITY', 'HAMILTON', 'KITCHENER',
            'LONDON', 'VICTORIA', 'HALIFAX', 'OSHAWA', 'WINDSOR',
            'MISSISSAUGA', 'BRAMPTON', 'SURREY', 'MARKHAM', 'VAUGHAN',
            'LAVAL', 'GATINEAU', 'LONGUEUIL'
        ],
    },

    "MEXICO": {
        "country_patterns": [r'\bMEXICO\b', r'\bMÉXICO\b', r'\bMEX\b'],
        "states": [
            'AGUASCALIENTES', 'BAJA CALIFORNIA', 'BAJA CALIFORNIA SUR', 'CAMPECHE',
            'CHIAPAS', 'CHIHUAHUA', 'COAHUILA', 'COLIMA', 'DURANGO', 'GUANAJUATO',
            'GUERRERO', 'HIDALGO', 'JALISCO', 'MEXICO STATE', 'MICHOACAN',
            'MORELOS', 'NAYARIT', 'NUEVO LEON', 'OAXACA', 'PUEBLA', 'QUERETARO',
            'QUINTANA ROO', 'SAN LUIS POTOSI', 'SINALOA', 'SONORA', 'TABASCO',
            'TAMAULIPAS', 'TLAXCALA', 'VERACRUZ', 'YUCATAN', 'ZACATECAS',
            'MEXICO CITY', 'CIUDAD DE MEXICO', 'CDMX',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'MEXICO CITY', 'GUADALAJARA', 'MONTERREY', 'PUEBLA', 'TIJUANA',
            'LEON', 'JUAREZ', 'ZAPOPAN', 'NEZAHUALCOYOTL', 'TORREON',
            'QUERETARO', 'SAN LUIS POTOSI', 'MERIDA', 'MEXICALI', 'AGUASCALIENTES',
            'CANCUN', 'CHIHUAHUA', 'SALTILLO', 'CULIACAN', 'HERMOSILLO'
        ],
    },

    # ==================== NEW COUNTRIES (North America + Caribbean / Central America) ====================

    "COSTA RICA": {
        "country_patterns": [r'\bCOSTA RICA\b', r'\bCRI\b'],
        "states": [
            'SAN JOSE', 'ALAJUELA', 'CARTAGO', 'HEREDIA', 'GUANACASTE',
            'PUNTARENAS', 'LIMON'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'SAN JOSE', 'ALAJUELA', 'CARTAGO', 'HEREDIA', 'LIMON',
            'PUNTARENAS', 'LIBERIA', 'QUEPOS'
        ],
    },

    "PANAMA": {
        "country_patterns": [r'\bPANAMA\b', r'\bPAN\b'],
        "states": [
            'PANAMA', 'PANAMA OESTE', 'COLON', 'CHIRIQUI', 'VERAGUAS',
            'BOCAS DEL TORO', 'LOS SANTOS', 'HERRERA'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'PANAMA CITY', 'CIUDAD DE PANAMA', 'COLON', 'DAVID',
            'SANTIAGO', 'CHITRE', 'LA CHORRERA'
        ],
    },

    "GUATEMALA": {
        "country_patterns": [r'\bGUATEMALA\b', r'\bGTM\b'],
        "states": [
            'GUATEMALA', 'QUETZALTENANGO', 'ESCUINTLA', 'HUEHUETENANGO',
            'PETEN', 'CHIMALTENANGO', 'SUCHITEPEQUEZ'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'GUATEMALA CITY', 'QUETZALTENANGO', 'ESCUINTLA', 'VILLA NUEVA',
            'MIXCO', 'COBAN', 'PETEN'
        ],
    },

    "DOMINICAN REPUBLIC": {
        "country_patterns": [r'\bDOMINICAN REPUBLIC\b', r'\bREPÚBLICA DOMINICANA\b', r'\bDOM\b'],
        "states": [
            'SANTO DOMINGO', 'SANTIAGO', 'LA VEGA', 'PUERTO PLATA',
            'LA ALTAGRACIA', 'SAN CRISTOBAL', 'SAN JUAN'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'SANTO DOMINGO', 'SANTIAGO', 'PUERTO PLATA', 'LA ROMANA',
            'SAN PEDRO DE MACORIS', 'HIGUEY', 'BOCA CHICA'
        ],
    },

    "JAMAICA": {
        "country_patterns": [r'\bJAMAICA\b', r'\bJAM\b'],
        "states": [
            'KINGSTON', 'SAINT ANDREW', 'SAINT CATHERINE', 'CLARENDON',
            'MANCHESTER', 'SAINT JAMES', 'WESTMORELAND'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": None,   # Jamaica uses postal zones (e.g. Kingston 10)
        "city_strategy": "generic",
        "cities": [
            'KINGSTON', 'MONTEGO BAY', 'SPANISH TOWN', 'PORTMORE',
            'MANDEVILLE', 'OCHO RIOS', 'NEGRIL'
        ],
    },
    "COLOMBIA": {
        "country_patterns": [r'\bCOLOMBIA\b', r'\bCOL\b'],
        "states": [
            'BOGOTA', 'ANTIOQUIA', 'VALLE DEL CAUCA', 'ATLANTICO', 'CUNDINAMARCA',
            'BOLIVAR', 'SANTANDER', 'RISARALDA', 'CALDAS', 'META'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{6})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'BOGOTA', 'MEDELLIN', 'CALI', 'BARRANQUILLA', 'CARTAGENA',
            'BUCARAMANGA', 'PEREIRA', 'CUCUTA', 'IBAGUE', 'SANTA MARTA'
        ],
    },

    "BRAZIL": {
        "country_patterns": [r'\bBRAZIL\b', r'\bBRASIL\b', r'\bBRA\b'],
        "states": [
            'SAO PAULO', 'RIO DE JANEIRO', 'MINAS GERAIS', 'BAHIA', 'PARANA',
            'RIO GRANDE DO SUL', 'PERNAMBUCO', 'CEARA', 'SANTA CATARINA', 'GOIAS',
            'DISTRITO FEDERAL'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5}-\d{3})\b(?!\d)',   # Brazilian CEP format
        "city_strategy": "before_postcode",
        "cities": [
            'SAO PAULO', 'RIO DE JANEIRO', 'BRASILIA', 'SALVADOR', 'FORTALEZA',
            'BELO HORIZONTE', 'CURITIBA', 'MANAUS', 'RECIFE', 'PORTO ALEGRE',
            'BELEM', 'GOIANIA', 'GUARULHOS', 'CAMPINAS', 'SAO GONCALO'
        ],
    },

    "CHILE": {
        "country_patterns": [r'\bCHILE\b', r'\bCHL\b'],
        "states": [
            'SANTIAGO METROPOLITAN', 'VALPARAISO', 'BIOBIO', 'MAULE',
            'ANTOFAGASTA', 'LOS LAGOS', 'O\'HIGGINS', 'ARAUCANIA'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{7})\b(?!\d)',   # 7-digit format common
        "city_strategy": "before_postcode",
        "cities": [
            'SANTIAGO', 'VALPARAISO', 'CONCEPCION', 'ANTofAGASTA', 'TEMUCO',
            'LA SERENA', 'IQUIQUE', 'PUERTO MONTT', 'ARICA', 'RANCAGUA'
        ],
    },
}


# ═══════════════════════════════════════════════════════════════════════════════
# SOUTH AMERICA
# ═══════════════════════════════════════════════════════════════════════════════

SOUTH_AMERICA: Dict[str, Dict] = {

    "BRAZIL": {
        "country_patterns": [r'\bBRAZIL\b', r'\bBRASIL\b', r'\bBRA\b'],
        "states": [
            'ACRE', 'ALAGOAS', 'AMAPÁ', 'AMAZONAS', 'BAHIA', 'CEARÁ',
            'DISTRITO FEDERAL', 'ESPÍRITO SANTO', 'GOIÁS', 'MARANHÃO',
            'MATO GROSSO', 'MATO GROSSO DO SUL', 'MINAS GERAIS', 'PARÁ',
            'PARAÍBA', 'PARANÁ', 'PERNAMBUCO', 'PIAUÍ', 'RIO DE JANEIRO',
            'RIO GRANDE DO NORTE', 'RIO GRANDE DO SUL', 'RONDÔNIA', 'RORAIMA',
            'SANTA CATARINA', 'SÃO PAULO', 'SERGIPE', 'TOCANTINS',
        ],
        "state_codes": [
            'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
            'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
            'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
        ],
        "code_guard": None,
        "postcode_pattern": r'\b(\d{5}-\d{3})\b',
        "city_strategy": "city_state_zip",
        "cities": [
            'SÃO PAULO', 'SAO PAULO', 'RIO DE JANEIRO', 'BRASÍLIA', 'BRASILIA',
            'SALVADOR', 'FORTALEZA', 'BELO HORIZONTE', 'MANAUS', 'CURITIBA',
            'RECIFE', 'PORTO ALEGRE', 'BELÉM', 'GOIÂNIA', 'GUARULHOS',
            'CAMPINAS', 'SÃO LUIS', 'MACEIÓ', 'NATAL', 'TERESINA', 'JOINVILLE',
            'RIBEIRÃO PRETO', 'LONDRINA'
        ],
    },

    "ARGENTINA": {
        "country_patterns": [r'\bARGENTINA\b', r'\bARG\b'],
        "states": [
            'BUENOS AIRES', 'CATAMARCA', 'CHACO', 'CHUBUT', 'CÓRDOBA',
            'CORRIENTES', 'ENTRE RIOS', 'FORMOSA', 'JUJUY', 'LA PAMPA',
            'LA RIOJA', 'MENDOZA', 'MISIONES', 'NEUQUÉN', 'RIO NEGRO',
            'SALTA', 'SAN JUAN', 'SAN LUIS', 'SANTA CRUZ', 'SANTA FE',
            'SANTIAGO DEL ESTERO', 'TIERRA DEL FUEGO', 'TUCUMAN',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'\b([A-Z]\d{4}[A-Z]{3})\b',
        "city_strategy": "before_postcode",
        "cities": [
            'BUENOS AIRES', 'CÓRDOBA', 'ROSARIO', 'MENDOZA', 'TUCUMÁN',
            'LA PLATA', 'MAR DEL PLATA', 'SALTA', 'SANTA FE', 'SAN JUAN',
            'SAN MIGUEL DE TUCUMÁN', 'BAHÍA BLANCA', 'NEUQUÉN'
        ],
    },

    "COLOMBIA": {
        "country_patterns": [r'\bCOLOMBIA\b', r'\bCOL\b'],
        "states": [
            'AMAZONAS', 'ANTIOQUIA', 'ARAUCA', 'ATLÁNTICO', 'BOLÍVAR',
            'BOYACÁ', 'CALDAS', 'CAQUETÁ', 'CASANARE', 'CAUCA', 'CESAR',
            'CHOCÓ', 'CÓRDOBA', 'CUNDINAMARCA', 'GUAINÍA', 'GUAVIARE',
            'HUILA', 'LA GUAJIRA', 'MAGDALENA', 'META', 'NARIÑO',
            'NORTE DE SANTANDER', 'PUTUMAYO', 'QUINDÍO', 'RISARALDA',
            'SAN ANDRÉS', 'SANTANDER', 'SUCRE', 'TOLIMA', 'VALLE DEL CAUCA',
            'VAUPÉS', 'VICHADA', 'BOGOTÁ',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{6})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'BOGOTÁ', 'BOGOTA', 'MEDELLÍN', 'CALI', 'BARRANQUILLA', 'CARTAGENA',
            'CÚCUTA', 'SOLEDAD', 'IBAGUÉ', 'BUCARAMANGA', 'SOACHA', 'PEREIRA'
        ],
    },

    # ==================== NEW HIGH SHIPMENT VOLUME COUNTRIES ====================

    "CHILE": {
        "country_patterns": [r'\bCHILE\b', r'\bCHL\b'],
        "states": [
            'REGIÓN METROPOLITANA', 'VALPARAÍSO', 'BIOBÍO', 'MAULE',
            'ANTOFAGASTA', 'ARAUCANÍA', 'LOS LAGOS', 'O\'HIGGINS',
            'ATACAMA', 'COQUIMBO', 'LOS RÍOS', 'AYSÉN', 'MAGALLANES'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{7})\b(?!\d)',   # Most common 7-digit
        "city_strategy": "before_postcode",
        "cities": [
            'SANTIAGO', 'VALPARAÍSO', 'CONCEPCIÓN', 'ANTOFAGASTA', 'TEMUCO',
            'LA SERENA', 'IQUIQUE', 'PUERTO MONTT', 'ARICA', 'RANCAGUA',
            'TALCA', 'CHILLÁN', 'OSORNO'
        ],
    },

    "PERU": {
        "country_patterns": [r'\bPERU\b', r'\bPER\b'],
        "states": [
            'LIMA', 'AREQUIPA', 'LA LIBERTAD', 'PIURA', 'LAMBAYEQUE',
            'CALLAO', 'JUNÍN', 'CUSCO', 'ANCASH', 'ICA', 'SAN MARTÍN'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'LIMA', 'AREQUIPA', 'TRUJILLO', 'CHICLAYO', 'PIURA',
            'HUANCAYO', 'CUSCO', 'TACNA', 'ICA', 'CALLAO', 'IQUITOS'
        ],
    },

    "ECUADOR": {
        "country_patterns": [r'\bECUADOR\b', r'\bECU\b'],
        "states": [
            'PICHINCHA', 'GUAYAS', 'AZUAY', 'MANABÍ', 'EL ORO',
            'LOS RÍOS', 'ESMERALDAS', 'TUNGURAHUA', 'IMBABURA'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{6})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'QUITO', 'GUAYAQUIL', 'CUENCA', 'MANTA', 'SANTO DOMINGO',
            'AMBATO', 'DURÁN', 'MACHALA', 'LOJA'
        ],
    },

    "URUGUAY": {
        "country_patterns": [r'\bURUGUAY\b', r'\bURY\b'],
        "states": [
            'MONTEVIDEO', 'CANELONES', 'MALDONADO', 'COLONIA', 'SALTO',
            'PAYSANDÚ', 'TACUAREMBÓ'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'MONTEVIDEO', 'PUNTA DEL ESTE', 'SALTO', 'PAYSANDÚ',
            'COLONIA DEL SACRAMENTO', 'TACUAREMBÓ'
        ],
    },

    "PARAGUAY": {
        "country_patterns": [r'\bPARAGUAY\b', r'\bPRY\b'],
        "states": [
            'ASUNCIÓN', 'CENTRAL', 'ALTO PARANÁ', 'ITAPÚA', 'CAAGUAZÚ'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'ASUNCIÓN', 'CIUDAD DEL ESTE', 'ENCARNACIÓN', 'SAN LORENZO',
            'LUQUE', 'FERNANDO DE LA MORA'
        ],
    },

    "BOLIVIA": {
        "country_patterns": [r'\bBOLIVIA\b', r'\bBOL\b'],
        "states": [
            'LA PAZ', 'SANTA CRUZ', 'COCHABAMBA', 'ORURO', 'POTOSÍ',
            'CHUQUISACA', 'TARIJA', 'BENI', 'PANDO'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'LA PAZ', 'SANTA CRUZ DE LA SIERRA', 'COCHABAMBA', 'SUCRE',
            'ORURO', 'EL ALTO', 'TARIJA'
        ],
    },

    # ── add more South American countries below this line ──
}


# ═══════════════════════════════════════════════════════════════════════════════
# AFRICA
# ═══════════════════════════════════════════════════════════════════════════════

AFRICA: Dict[str, Dict] = {

    "SOUTH AFRICA": {
        "country_patterns": [r'\bSOUTH AFRICA\b', r'\bZAF\b', r'\bRSA\b'],
        "states": [
            'EASTERN CAPE', 'FREE STATE', 'GAUTENG', 'KWAZULU-NATAL',
            'LIMPOPO', 'MPUMALANGA', 'NORTHERN CAPE', 'NORTH WEST',
            'WESTERN CAPE',
        ],
        "state_codes": [
            'EC', 'FS', 'GP', 'KZN', 'LP', 'MP', 'NC', 'NW', 'WC',
        ],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'JOHANNESBURG', 'CAPE TOWN', 'DURBAN', 'PRETORIA', 'PORT ELIZABETH',
            'BLOEMFONTEIN', 'EAST LONDON', 'POLOKWANE', 'NELSPRUIT', 'KIMBERLEY',
            'SOWETO', 'CENTURION', 'MIDRAND', 'ROODEPOORT', 'GEORGE'
        ],
    },

    "NIGERIA": {
        "country_patterns": [r'\bNIGERIA\b', r'\bNGA\b'],
        "states": [
            'ABIA', 'ADAMAWA', 'AKWA IBOM', 'ANAMBRA', 'BAUCHI', 'BAYELSA',
            'BENUE', 'BORNO', 'CROSS RIVER', 'DELTA', 'EBONYI', 'EDO', 'EKITI',
            'ENUGU', 'GOMBE', 'IMO', 'JIGAWA', 'KADUNA', 'KANO', 'KATSINA',
            'KEBBI', 'KOGI', 'KWARA', 'LAGOS', 'NASARAWA', 'NIGER', 'OGUN',
            'ONDO', 'OSUN', 'OYO', 'PLATEAU', 'RIVERS', 'SOKOTO', 'TARABA',
            'YOBE', 'ZAMFARA', 'FCT ABUJA',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{6})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'LAGOS', 'KANO', 'IBADAN', 'ABUJA', 'PORT HARCOURT', 'BENIN CITY',
            'MAIDUGURI', 'ZARIA', 'OWERRI', 'KADUNA', 'CALABAR', 'WARRI',
            'ILORIN', 'ENUGU', 'ABEOKUTA', 'ONITSHA', 'ASABA'
        ],
    },

    "EGYPT": {
        "country_patterns": [r'\bEGYPT\b', r'\bEGY\b', r'\bMISR\b'],
        "states": [
            'CAIRO', 'GIZA', 'ALEXANDRIA', 'ASWAN', 'ASYUT', 'BEHEIRA',
            'BENI SUEF', 'DAKAHLIA', 'DAMIETTA', 'FAIYUM', 'GHARBIA',
            'ISMAILIA', 'KAFR EL SHEIKH', 'LUXOR', 'MATRUH', 'MINYA',
            'MONUFIA', 'NEW VALLEY', 'NORTH SINAI', 'PORT SAID',
            'QALYUBIA', 'QENA', 'RED SEA', 'SHARQIA', 'SOHAG',
            'SOUTH SINAI', 'SUEZ',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'CAIRO', 'ALEXANDRIA', 'GIZA', 'PORT SAID', 'SUEZ',
            'LUXOR', 'ASWAN', 'MANSOURA', 'TANTA', 'ISMAILIA',
            'SHUBRA EL-KHEIMA', 'ZAGAZIG', 'ASUIT'
        ],
    },

    "KENYA": {
        "country_patterns": [r'\bKENYA\b', r'\bKEN\b'],
        "states": [
            'NAIROBI', 'MOMBASA', 'KISUMU', 'NAKURU', 'ELDORET', 'THIKA',
            'KILIFI', 'KAKAMEGA', 'MERU', 'KITALE', 'NYERI', 'ELGEYO-MARAKWET'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'NAIROBI', 'MOMBASA', 'KISUMU', 'NAKURU', 'ELDORET',
            'THIKA', 'MALINDI', 'KITALE', 'MERU', 'NYERI'
        ],
    },

    # ==================== NEW HIGH SHIPMENT VOLUME COUNTRIES ====================

    "MOROCCO": {
        "country_patterns": [r'\bMOROCCO\b', r'\bMAR\b', r'\bMAROC\b'],
        "states": [
            'CASABLANCA-SETTAT', 'RABAT-SALÉ-KÉNITRA', 'TANGIER-TETOUAN-AL HOCEIMA',
            'FÈS-MEKNÈS', 'MARRAKECH-SAFI', 'SOUSS-MASSA', 'ORIENTAL',
            'DRAA-TAFILALET', 'BENI MELLAL-KHÉNIFRA'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'CASABLANCA', 'RABAT', 'MARRAKECH', 'TANGIER', 'FES',
            'AGADIR', 'MEKNES', 'OUJDA', 'KENITRA', 'TETOUAN'
        ],
    },

    "GHANA": {
        "country_patterns": [r'\bGHANA\b', r'\bGHA\b'],
        "states": [
            'GREATER ACCRA', 'ASHANTI', 'WESTERN', 'CENTRAL', 'EASTERN',
            'VOLTA', 'NORTHERN', 'UPPER EAST', 'UPPER WEST', 'BRONG AHAFO'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',   # Postal codes are used but not always strictly
        "city_strategy": "before_postcode",
        "cities": [
            'ACCRA', 'KUMASI', 'TEMA', 'TAMALE', 'SEKONDI-TAKORADI',
            'CAPE COAST', 'HO', 'SUNYANI', 'KOFORIDUA'
        ],
    },

    "ETHIOPIA": {
        "country_patterns": [r'\bETHIOPIA\b', r'\bETH\b'],
        "states": [
            'ADDIS ABABA', 'OROMIA', 'AMHARA', 'TIGRAY', 'SOMALI',
            'SOUTHERN NATIONS', 'SIDAMA', 'HARARI'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'ADDIS ABABA', 'DIRE DAWA', 'MEKELLE', 'ADAMA', 'GONDAR',
            'BAHIR DAR', 'HAWASSA', 'JIMMA'
        ],
    },

    "TANZANIA": {
        "country_patterns": [r'\bTANZANIA\b', r'\bTZA\b'],
        "states": [
            'DAR ES SALAAM', 'ARUSHA', 'MWANZA', 'ZANZIBAR', 'DODOMA',
            'MBEYA', 'TANGA', 'MOROGORO'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'DAR ES SALAAM', 'ARUSHA', 'MWANZA', 'DODOMA', 'ZANZIBAR',
            'MBEYA', 'TANGA', 'MOROGORO'
        ],
    },

    "UGANDA": {
        "country_patterns": [r'\bUGANDA\b', r'\bUGA\b'],
        "states": [
            'KAMPALA', 'CENTRAL', 'WESTERN', 'EASTERN', 'NORTHERN'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'KAMPALA', 'ENTEBBE', 'JINJA', 'MBALE', 'MBARARA',
            'GULU', 'FORT PORTAL'
        ],
    },

    # ── add more African countries below this line ──
}


# ═══════════════════════════════════════════════════════════════════════════════
# OCEANIA
# ═══════════════════════════════════════════════════════════════════════════════

OCEANIA: Dict[str, Dict] = {

    "AUSTRALIA": {
        "country_patterns": [r'\bAUSTRALIA\b', r'\bAUS\b'],
        "states": [
            'NEW SOUTH WALES', 'VICTORIA', 'QUEENSLAND', 'SOUTH AUSTRALIA',
            'WESTERN AUSTRALIA', 'TASMANIA', 'NORTHERN TERRITORY',
            'AUSTRALIAN CAPITAL TERRITORY',
            'NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT',
        ],
        "state_codes": ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
        "code_guard": r'(?=\s+\d{4})',
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "city_state_zip",
        "cities": [
            'SYDNEY', 'MELBOURNE', 'BRISBANE', 'PERTH', 'ADELAIDE',
            'GOLD COAST', 'CANBERRA', 'NEWCASTLE', 'WOLLONGONG', 'LOGAN CITY',
            'GEELONG', 'HOBART', 'TOWNSVILLE', 'CAIRNS', 'DARWIN',
            'SUNSHINE COAST', 'CENTRAL COAST', 'LAUNCESTON', 'BUNBURY'
        ],
    },

    "NEW ZEALAND": {
        "country_patterns": [r'\bNEW ZEALAND\b', r'\bNZL\b', r'\bNZ\b'],
        "states": [
            'NORTHLAND', 'AUCKLAND', 'WAIKATO', 'BAY OF PLENTY', 'GISBORNE',
            'HAWKE\'S BAY', 'TARANAKI', 'MANAWATU-WHANGANUI', 'WELLINGTON',
            'TASMAN', 'NELSON', 'MARLBOROUGH', 'WEST COAST', 'CANTERBURY',
            'OTAGO', 'SOUTHLAND',
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'AUCKLAND', 'WELLINGTON', 'CHRISTCHURCH', 'HAMILTON', 'TAURANGA',
            'NAPIER-HASTINGS', 'DUNEDIN', 'PALMERSTON NORTH', 'NELSON', 'ROTORUA',
            'WHANGAREI', 'NEW PLYMOUTH', 'INVERCARGILL', 'GISBORNE'
        ],
    },

    # ==================== NEW OCEANIAN COUNTRIES ====================

    "PAPUA NEW GUINEA": {
        "country_patterns": [r'\bPAPUA NEW GUINEA\b', r'\bPNG\b', r'\bPAPUA\b'],
        "states": [
            'NATIONAL CAPITAL DISTRICT', 'CENTRAL', 'EASTERN HIGHLANDS',
            'WESTERN HIGHLANDS', 'MOROBE', 'MADANG', 'MILNE BAY', 'WESTERN',
            'EAST NEW BRITAIN', 'BOUGAINVILLE'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{3})\b(?!\d)',   # 3-digit postcodes
        "city_strategy": "before_postcode",
        "cities": [
            'PORT MORESBY', 'LAE', 'MOUNT HAGEN', 'MADANG', 'GOROKA',
            'RABAUL', 'WEWAK', 'ALOTAU', 'KIMBE'
        ],
    },

    "FIJI": {
        "country_patterns": [r'\bFIJI\b', r'\bFJI\b'],
        "states": [
            'CENTRAL DIVISION', 'NORTHERN DIVISION', 'WESTERN DIVISION',
            'EASTERN DIVISION', 'SUVA', 'NADI', 'LAUTOKA'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{4})\b(?!\d)',
        "city_strategy": "before_postcode",
        "cities": [
            'SUVA', 'NADI', 'LAUTOKA', 'LABASA', 'NAUSORI',
            'SIGATOKA', 'BA'
        ],
    },

    "NEW CALEDONIA": {
        "country_patterns": [r'\bNEW CALEDONIA\b', r'\bNOUVELLE-CALÉDONIE\b', r'\bNCL\b'],
        "states": [
            'GRANDE TERRE', 'LOYALTY ISLANDS', 'ÎLE DES PINS', 'NOUMÉA'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{2})\b(?!\d)',   # 2-digit postcodes
        "city_strategy": "before_postcode",
        "cities": [
            'NOUMÉA', 'MONT-DORE', 'DUMBÉA', 'KONÉ', 'POUEMBOUT'
        ],
    },

    "FRENCH POLYNESIA": {
        "country_patterns": [r'\bFRENCH POLYNESIA\b', r'\bPOLYNÉSIE FRANÇAISE\b', r'\bPYF\b'],
        "states": [
            'TAHITI', 'MOOREA', 'BORA BORA', 'RAIATEA', 'HIVA OA'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": r'(?<!\d)\b(\d{5})\b(?!\d)',   # 5-digit postcodes used
        "city_strategy": "before_postcode",
        "cities": [
            'PAPEETE', 'PUNA\'AUIA', 'FA\'A\'Ā', 'MOOREA', 'BORA BORA',
            'TAHITI', 'RAIATEA'
        ],
    },

    "SOLOMON ISLANDS": {
        "country_patterns": [r'\bSOLOMON ISLANDS\b', r'\bSLB\b'],
        "states": [
            'HONIARA', 'GUADALCANAL', 'WESTERN', 'MALAITA', 'MAKIRA'
        ],
        "state_codes": [],
        "code_guard": None,
        "postcode_pattern": None,   # Very limited postcode usage
        "city_strategy": "generic",
        "cities": [
            'HONIARA', 'GIZO', 'AUKI', 'MENDOZA', 'KIRAKIRA'
        ],
    },

    # ── add more Oceanian / Pacific countries below this line ──
}


# ═══════════════════════════════════════════════════════════════════════════════
# FLAT MERGE  ← extractor always reads from GEO_DATA, never continent dicts
# ═══════════════════════════════════════════════════════════════════════════════

GEO_DATA: Dict[str, Dict] = {
    **ASIA,
    **EUROPE,
    **NORTH_AMERICA,
    **SOUTH_AMERICA,
    **AFRICA,
    **OCEANIA,
}


# ═══════════════════════════════════════════════════════════════════════════════
# PRE-COMPILED PATTERNS  (built once at import time)
# ═══════════════════════════════════════════════════════════════════════════════

def _build_country_pattern(geo: Dict) -> re.Pattern:
    alts = '|'.join(geo["country_patterns"])
    return re.compile(alts, re.IGNORECASE)


def _build_state_pattern(geo: Dict) -> Optional[re.Pattern]:
    states = sorted(geo.get("states", []), key=len, reverse=True)
    if not states:
        return None
    alts = '|'.join(re.escape(s) for s in states)
    return re.compile(rf'\b({alts})\b', re.IGNORECASE)


def _build_code_pattern(geo: Dict) -> Optional[re.Pattern]:
    codes = geo.get("state_codes", [])
    if not codes:
        return None
    alts  = '|'.join(re.escape(c) for c in codes)
    guard = geo.get("code_guard") or ""
    return re.compile(rf'\b({alts})\b{guard}')


def _build_postcode_pattern(geo: Dict) -> Optional[re.Pattern]:
    raw = geo.get("postcode_pattern")
    return re.compile(raw) if raw else None


def _build_city_pattern(geo: Dict) -> Optional[re.Pattern]:
    cities = geo.get("cities", [])
    if not cities:
        return None
    alts = '|'.join(re.escape(c) for c in sorted(cities, key=len, reverse=True))
    return re.compile(rf'\b({alts})\b', re.IGNORECASE)


COUNTRY_PATTERNS:  Dict[str, re.Pattern]          = {}
STATE_PATTERNS:    Dict[str, Optional[re.Pattern]] = {}
CODE_PATTERNS:     Dict[str, Optional[re.Pattern]] = {}
POSTCODE_PATTERNS: Dict[str, Optional[re.Pattern]] = {}
CITY_PATTERNS:     Dict[str, Optional[re.Pattern]] = {}

for _key, _geo in GEO_DATA.items():
    COUNTRY_PATTERNS[_key]  = _build_country_pattern(_geo)
    STATE_PATTERNS[_key]    = _build_state_pattern(_geo)
    CODE_PATTERNS[_key]     = _build_code_pattern(_geo)
    POSTCODE_PATTERNS[_key] = _build_postcode_pattern(_geo)
    CITY_PATTERNS[_key]     = _build_city_pattern(_geo)


# ═══════════════════════════════════════════════════════════════════════════════
# SHARED STATIC PATTERNS  (used by extract_city, clean_address)
# ═══════════════════════════════════════════════════════════════════════════════

STREET_NOISE: re.Pattern = re.compile(
    r'\b(?:ROAD|STREET|AVENUE|LANE|DRIVE|CLOSE|COURT|PLACE|BOULEVARD|BLVD|'
    r'CRESCENT|TERRACE|GROVE|WAY|WALK|MEWS|RISE|GARDENS|PARK|SQUARE|'
    r'INDUSTRIAL|ESTATE|COMPLEX|ZONE|SECTOR|PHASE|PLOT|BLOCK|FLOOR|'
    r'GROUND|BASEMENT|BUILDING|TOWER|HOUSE|CENTRE|CENTER|HUB|POINT|'
    r'MARKET|SOCIETY|NAGAR|VIHAR|ENCLAVE|COLONY|LAYOUT|EXTENSION|'
    r'NORTH|SOUTH|EAST|WEST|UPPER|LOWER|OLD|NEW|UNIT|NO\.?)\b',
    re.IGNORECASE,
)

CLEAN_ADDRESS_PATTERNS: List[re.Pattern] = [
    re.compile(r'(?:PHONE|TEL|Phone|Tel|PH|Ph)\s*:?\s*[+\d\s()\-]{7,}', re.IGNORECASE),
    re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b'),
    re.compile(r'(?:FAX|Fax)\s*:?\s*[+\d\s()\-]{7,}',                   re.IGNORECASE),
    re.compile(r'(?:EORI|Eori)\s*:\s*[A-Z0-9]+',                         re.IGNORECASE),
    re.compile(r'E-?MAIL\s*:\s*\S+',                                      re.IGNORECASE),
]