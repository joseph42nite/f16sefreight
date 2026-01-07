import pdfplumber
import re
import json
import sys

def read_multiple_boxes(pdf_path, page_number, boxes_list):
    """Read text from multiple boxes efficiently in one PDF open"""
    results = []
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[page_number]
        for bbox in boxes_list:
            cropped_page = page.within_bbox(bbox)
            text = cropped_page.extract_text()
            results.append(text if text else "")
    return results

def parse_address(text):
    """Parse address text into structured components"""
    if not text or not text.strip():
        return {
            'company_name': '',
            'address': '',
            'city': '',
            'state': '',
            'pincode': '',
            'country': ''
        }
    
    lines = [line.strip() for line in text.strip().split('\n') if line.strip()]
    
    if len(lines) < 2:
        return {
            'company_name': lines[0] if lines else '',
            'address': '',
            'city': '',
            'state': '',
            'pincode': '',
            'country': ''
        }
    
    company_name = lines[0]
    country = lines[-1]
    
    second_last = lines[-2].split()
    city = second_last[0] if len(second_last) > 0 else ""
    state = second_last[1] if len(second_last) > 1 else ""
    pincode = second_last[2] if len(second_last) > 2 else ""
    
    address_lines = lines[1:-2] if len(lines) > 3 else []
    address = '\n'.join(address_lines)
    
    return {
        'company_name': company_name,
        'address': address,
        'city': city,
        'state': state,
        'pincode': pincode,
        'country': country
    }

def parse_contact_info(text):
    """Extract phone number and email from contact text"""
    if not text or not text.strip():
        return {"phone": "", "email": ""}
    
    text = ' '.join(text.split())
    
    phone_pattern = r'Phone:\s*([\d\-\+\(\)\s]+?)(?=\s*Email:|$)'
    phone_match = re.search(phone_pattern, text, re.IGNORECASE)
    phone = phone_match.group(1).strip() if phone_match else ""
    
    email_pattern = r'Email:\s*([\S]+@[\S]+)'
    email_match = re.search(email_pattern, text, re.IGNORECASE)
    email = email_match.group(1).strip() if email_match else ""
    email = email.rstrip('.,')
    
    return {"phone": phone, "email": email}

def parse_departure_destination(text1, text2):
    """Parse departure and destination airport codes"""
    departure = ""
    destination = ""
    
    if text1:
        match = re.search(r'\b([A-Z]{3})\s*-', text1)
        if match:
            departure = match.group(1)
    
    if text2:
        match = re.search(r'\b([A-Z]{3})\s*-', text2)
        if match:
            destination = match.group(1)
    
    return {"departure": departure, "destination": destination}

def extract_three_letter_caps_unique(text):
    """Extract unique three-letter uppercase words (excluding last item)"""
    if not text or not text.strip():
        return []

    pattern = r'\b[A-Z]{3}\b'
    matches = re.findall(pattern, text)

    unique_items = list(dict.fromkeys(matches))

    # Remove last item safely
    return unique_items[:-1] if len(unique_items) > 1 else []


def parse_flight_codes(text):
    """Extract flight codes and their associated numbers"""
    if not text or not text.strip():
        return []
    
    pattern = r'([A-Z]+\d+)\s*/(\d+)'
    matches = re.findall(pattern, text)
    
    result = []
    for flight_code, number in matches:
        result.append({
            "flight_code": flight_code,
            "date": number
        })
    return result

def parse_cargo_info(text):
    """Parse cargo information into structured format"""
    if not text or not text.strip():
        return {"type": "", "sizes": [], "hs_codes": []}
    
    lines = text.strip().split('\n')
    type_lines = []
    
    for line in lines:
        if re.search(r'\d+/\d+x\d+x\d+', line):
            break
        if not re.search(r'(HS Code:|Country Of Origin|Total Volume)', line, re.IGNORECASE):
            type_lines.append(line.strip())
    
    cargo_type = '\n'.join(type_lines)
    
    size_pattern = r'(\d+)/(\d+x\d+x\d+)\s*cms?'
    sizes = []
    for line in lines:
        matches = re.findall(size_pattern, line)
        for count, dimensions in matches:
            sizes.append({
                "dimensions": dimensions,
                "count": int(count)
            })
    
    hs_code_pattern = r'HS Code:\s*(\d+)'
    hs_codes = re.findall(hs_code_pattern, text)
    hs_codes = list(dict.fromkeys(hs_codes))
    
    return {
        "description": cargo_type,
        "sizes": sizes,
        "hs_codes": hs_codes
    }

def parse_weight_charges(text1, text2, text3):
    """Parse weight and charge information"""
    result = {
        "pieces": 0,
        "gross_weight": 0.0,
        "chargeable_weight": 0.0,
        "rate": 0.0,
        "total": 0.0
    }
    
    if text1 and text1.strip():
        count_match = re.search(r'(\d+)', text1.strip())
        if count_match:
            result["pieces"] = int(count_match.group(1))
    
    if text2 and text2.strip():
        weight_match = re.search(r'(\d+(?:\.\d+)?)', text2.strip())
        if weight_match:
            result["gross_weight"] = float(weight_match.group(1))
    
    if text3 and text3.strip():
        numbers = re.findall(r'(\d+(?:\.\d+)?)', text3.strip())
        if len(numbers) >= 3:
            result["chargeable_weight"] = float(numbers[0])
            result["rate"] = float(numbers[1])
            result["total"] = float(numbers[2])
        elif len(numbers) == 2:
            result["rate"] = float(numbers[0])
            result["total"] = float(numbers[1])
        elif len(numbers) == 1:
            result["total"] = float(numbers[0])
    
    return result
    
def clean_text_recursive(data):
    """
    Recursively remove newline characters and extra spaces
    from all strings inside dicts/lists
    """
    if isinstance(data, dict):
        return {k: clean_text_recursive(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [clean_text_recursive(item) for item in data]
    elif isinstance(data, str):
        return re.sub(r'\s+', ' ', data).strip()
    else:
        return data
        
def format_awb(text):
    if not text:
        return ""

    # Normalize spaces
    text = re.sub(r'\s+', ' ', text).strip()

    # Match 3-digit prefix and trailing AWB number
    match = re.search(r'(\d{3})\s*[A-Z]{3}\s*(\d+)', text)
    if match:
        return f"{match.group(1)}-{match.group(2)}"

    return ""


def process_airwaybill(pdf_path, output_json_path="airwaybill_output.json"):
    """
    Process complete airwaybill PDF and generate consolidated JSON
    
    Args:
        pdf_path: Path to PDF file
        output_json_path: Path to save output JSON file
    
    Returns:
        Complete parsed airwaybill data as dictionary
    """
    page_num = 0
    
    # Define box coordinates
    boxes = [
        (55, 36, 175, 100),      # 0: Shipper address
        (175, 30, 300, 100),     # 1: Shipper contact
        (40, 100, 180, 170),     # 2: Consignee address
        (175, 100, 300, 170),    # 3: Consignee contact
        (40, 220, 180, 260),     # 4: Departure info
        (40, 280, 180, 310),     # 5: Destination info
        (40, 265, 300, 310),     # 6: Flight routing
        (400, 360, 550, 540),    # 7: Cargo description
        (150, 375, 410, 390),    # 8: Weight/charge detail
        (30, 520, 90, 540),      # 9: Pieces count
        (100, 520, 150, 540),    # 10: Gross weight
        (30, 10, 130, 25)        # 11: AWB Number
    ]
    
    try:
        # Extract all boxes in one pass
        results = read_multiple_boxes(pdf_path, page_num, boxes)
        
        # Parse all sections
        shipper_address = parse_address(results[0])
        shipper_contact = parse_contact_info(results[1])
        consignee_address = parse_address(results[2])
        consignee_contact = parse_contact_info(results[3])
        locations = parse_departure_destination(results[4], results[5])
        airports = extract_three_letter_caps_unique(results[6])
        flights = parse_flight_codes(results[6])
        cargo = parse_cargo_info(results[7])
        weight_charges = parse_weight_charges(results[9], results[10], results[8])
        awb = format_awb(results[11])
        
        # Build final JSON structure
        airwaybill_data = {
            "awb_number": awb,
            "shipper": {
                "company_name": shipper_address['company_name'],
                "address": shipper_address['address'],
                "city": shipper_address['city'],
                "state": shipper_address['state'],
                "pincode": shipper_address['pincode'],
                "country": shipper_address['country'],
                "phone": shipper_contact['phone'],
                "email": shipper_contact['email']
            },
            "consignee": {
                "company_name": consignee_address['company_name'],
                "address": consignee_address['address'],
                "city": consignee_address['city'],
                "state": consignee_address['state'],
                "pincode": consignee_address['pincode'],
                "country": consignee_address['country'],
                "phone": consignee_contact['phone'],
                "email": consignee_contact['email']
            },
            "routing": {
                "departure_airport": locations['departure'],
                "destination_airport": locations['destination'],
                "transit_airports": airports,
                "flights": flights
            },
            "cargo": {
                "description": cargo['description'],
                "pieces": weight_charges['pieces'],
                "gross_weight_kg": weight_charges['gross_weight'],
                "chargeable_weight_kg": weight_charges['chargeable_weight'],
                "rate": weight_charges['rate'],
                "total_amount": weight_charges['total'],
                "dimensions": cargo['sizes'],
                "hs_codes": cargo['hs_codes']
            }
        }
        
        # Save to JSON file
        airwaybill_data = clean_text_recursive(airwaybill_data)

        # with open(output_json_path, 'w', encoding='utf-8') as f:
        #     json.dump(airwaybill_data, f, indent=2, ensure_ascii=False)
        
        # print(f"✓ Success: Airwaybill data saved to {output_json_path}")
        print(json.dumps(airwaybill_data, indent=2))
        
        return airwaybill_data
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        return None

# Main execution
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python newcla.py <pdf_path> [output_json]")
        sys.exit(1)

    pdf_path = sys.argv[1]
    output_json = sys.argv[2] if len(sys.argv) > 2 else "airwaybill_output.json"

    # Process and save to JSON
    process_airwaybill(pdf_path, output_json)

    # Optionally display the JSON
    # if data:
    #     print("\n" + json.dumps(data, indent=2))
