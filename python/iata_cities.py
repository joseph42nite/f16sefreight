"""
City names an air waybill is written with, and the airport each one means.

AIRPORT_IATA_MAP in extract_awb_new.py is a table of airport NAMES ("chhatrapati shivaji", "heathrow"). A waybill's
departure and destination boxes usually carry a CITY, and for cities the big table was wrong or silent for almost half
of the gateways checked (2026-11-10 audit §7): KOCHI gave KCZ (Kochi, Japan), LONDON gave YXU (London, Ontario),
MANILA gave MXA, and COCHIN, KOLKATA, TOKYO, JEDDAH and DHAKA were not found at all.

🔴 This table wins over the big one for the same name. Where a city has several airports the code is the one cargo
is booked to by default — the main international gateway — so LONDON is LHR and NEW YORK is JFK. A waybill that
means another one says so ("GATWICK", "NEWARK"), and those longer names still resolve through the big table.

🔴 GOA and LEH are read as the Indian cities (GOI, IXL), although GOA and LEH are also the codes of Genoa and
Le Havre: this service reads waybills issued in India.

Keys are lower case. Add a spelling here when a waybill is seen with one that is missing.
"""

from typing import Dict

CITY_IATA: Dict[str, str] = {
    # ── India ────────────────────────────────────────────────────────────────
    "kochi": "COK", "cochin": "COK", "nedumbassery": "COK",
    "trivandrum": "TRV", "thiruvananthapuram": "TRV",
    "calicut": "CCJ", "kozhikode": "CCJ", "karipur": "CCJ",
    "kannur": "CNN",
    "mumbai": "BOM", "bombay": "BOM",
    "delhi": "DEL", "new delhi": "DEL",
    "chennai": "MAA", "madras": "MAA",
    "kolkata": "CCU", "calcutta": "CCU",
    "bangalore": "BLR", "bengaluru": "BLR",
    "hyderabad": "HYD", "ahmedabad": "AMD", "pune": "PNQ", "goa": "GOI",
    "jaipur": "JAI", "lucknow": "LKO", "coimbatore": "CJB", "mangalore": "IXE", "mangaluru": "IXE",
    "tiruchirappalli": "TRZ", "trichy": "TRZ", "madurai": "IXM", "amritsar": "ATQ", "nagpur": "NAG",
    "guwahati": "GAU", "visakhapatnam": "VTZ", "vizag": "VTZ", "indore": "IDR", "varanasi": "VNS",
    "bhubaneswar": "BBI", "patna": "PAT", "chandigarh": "IXC", "srinagar": "SXR", "surat": "STV",
    "vadodara": "BDQ", "baroda": "BDQ", "rajkot": "RAJ", "bhopal": "BHO", "raipur": "RPR", "ranchi": "IXR",
    "tirupati": "TIR", "vijayawada": "VGA", "salem": "SXV", "tuticorin": "TCR", "thoothukudi": "TCR",
    "hubli": "HBX", "belgaum": "IXG", "belagavi": "IXG", "mysore": "MYQ", "mysuru": "MYQ",
    "aurangabad": "IXU", "nashik": "ISK", "port blair": "IXZ", "agartala": "IXA", "imphal": "IMF",
    "dibrugarh": "DIB", "bagdogra": "IXB", "siliguri": "IXB", "dehradun": "DED", "jammu": "IXJ", "leh": "IXL",
    "udaipur": "UDR", "jodhpur": "JDH", "kanpur": "KNU", "gorakhpur": "GOP", "agra": "AGR", "gwalior": "GWL",
    "jabalpur": "JLR",

    # ── Gulf and Middle East ─────────────────────────────────────────────────
    "dubai": "DXB", "abu dhabi": "AUH", "sharjah": "SHJ", "ras al khaimah": "RKT",
    "doha": "DOH", "muscat": "MCT", "salalah": "SLL", "kuwait": "KWI", "bahrain": "BAH",
    "riyadh": "RUH", "jeddah": "JED", "dammam": "DMM", "medina": "MED", "madinah": "MED",
    "tel aviv": "TLV", "amman": "AMM", "beirut": "BEY", "baghdad": "BGW", "tehran": "IKA", "istanbul": "IST",

    # ── Asia and Oceania ─────────────────────────────────────────────────────
    "singapore": "SIN", "kuala lumpur": "KUL", "penang": "PEN", "bangkok": "BKK", "phuket": "HKT",
    "chiang mai": "CNX", "hong kong": "HKG", "macau": "MFM", "taipei": "TPE",
    "shanghai": "PVG", "beijing": "PEK", "guangzhou": "CAN", "shenzhen": "SZX", "chengdu": "CTU",
    "xiamen": "XMN", "qingdao": "TAO", "zhengzhou": "CGO", "chongqing": "CKG", "hangzhou": "HGH",
    "nanjing": "NKG", "tianjin": "TSN", "wuhan": "WUH",
    "tokyo": "NRT", "osaka": "KIX", "nagoya": "NGO", "fukuoka": "FUK", "seoul": "ICN", "busan": "PUS",
    "manila": "MNL", "cebu": "CEB", "jakarta": "CGK", "surabaya": "SUB", "denpasar": "DPS",
    "ho chi minh city": "SGN", "ho chi minh": "SGN", "saigon": "SGN", "hanoi": "HAN",
    "phnom penh": "PNH", "yangon": "RGN",
    "colombo": "CMB", "dhaka": "DAC", "chittagong": "CGP", "kathmandu": "KTM", "male": "MLE",
    "karachi": "KHI", "lahore": "LHE", "islamabad": "ISB", "sialkot": "SKT",
    "tashkent": "TAS", "almaty": "ALA",
    "sydney": "SYD", "melbourne": "MEL", "brisbane": "BNE", "perth": "PER", "auckland": "AKL",

    # ── Europe ───────────────────────────────────────────────────────────────
    "london": "LHR", "manchester": "MAN", "birmingham": "BHX", "dublin": "DUB",
    "paris": "CDG", "frankfurt": "FRA", "munich": "MUC", "berlin": "BER", "hamburg": "HAM",
    "dusseldorf": "DUS", "stuttgart": "STR", "leipzig": "LEJ", "cologne": "CGN",
    "amsterdam": "AMS", "brussels": "BRU", "liege": "LGG", "luxembourg": "LUX",
    "madrid": "MAD", "barcelona": "BCN", "lisbon": "LIS", "rome": "FCO", "milan": "MXP",
    "zurich": "ZRH", "geneva": "GVA", "vienna": "VIE", "athens": "ATH", "moscow": "SVO",
    "copenhagen": "CPH", "stockholm": "ARN", "oslo": "OSL", "helsinki": "HEL",
    "prague": "PRG", "warsaw": "WAW", "budapest": "BUD", "bucharest": "OTP",

    # ── Americas ─────────────────────────────────────────────────────────────
    "new york": "JFK", "newark": "EWR", "los angeles": "LAX", "chicago": "ORD", "san francisco": "SFO",
    "miami": "MIA", "atlanta": "ATL", "dallas": "DFW", "houston": "IAH", "boston": "BOS",
    "washington": "IAD", "seattle": "SEA", "memphis": "MEM", "louisville": "SDF", "anchorage": "ANC",
    "cincinnati": "CVG", "toronto": "YYZ", "vancouver": "YVR", "montreal": "YUL",
    "mexico city": "MEX", "sao paulo": "GRU", "buenos aires": "EZE", "bogota": "BOG", "lima": "LIM",
    "santiago": "SCL",

    # ── Africa ───────────────────────────────────────────────────────────────
    "johannesburg": "JNB", "cape town": "CPT", "nairobi": "NBO", "lagos": "LOS", "cairo": "CAI",
    "addis ababa": "ADD", "casablanca": "CMN", "entebbe": "EBB", "dar es salaam": "DAR", "accra": "ACC",
    "mauritius": "MRU",
}
