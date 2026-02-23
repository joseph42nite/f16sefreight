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
            states = ['HARYANA', 'MAHARASHTRA', 'DELHI', 'KARNATAKA', 'TAMIL NADU', 
                     'GUJARAT', 'WEST BENGAL', 'RAJASTHAN', 'UTTAR PRADESH', 
                     'MADHYA PRADESH', 'BIHAR', 'KERALA', 'PUNJAB', 'TELANGANA', 
                     'ANDHRA PRADESH', 'ODISHA', 'ASSAM', 'JHARKHAND', 'CHHATTISGARH']
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