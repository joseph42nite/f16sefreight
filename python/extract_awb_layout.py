import sys
import re
import json
import pdfplumber

def norm(s): 
    return re.sub(r"\s+", " ", s.strip())

def extract_block_between(page, start_kw, stop_kw):
    words = page.extract_words()
    start_y = None
    stop_y = page.height
    for w in words:
        if start_kw.lower() in w["text"].lower():
            start_y = w["top"]
            break
    for w in words:
        if stop_kw.lower() in w["text"].lower() and start_y and w["top"] > start_y:
            stop_y = w["top"]
            break
    if start_y is None:
        return ""
    region = page.within_bbox((0, start_y, page.width, stop_y))
    text = region.extract_text() or ""
    # drop header lines
    lines = [l for l in text.splitlines() if l and start_kw.lower() not in l.lower()]
    return "\n".join(lines)

def lines(text): 
    return [norm(l) for l in (text or "").splitlines() if norm(l)]

def find_region(page, start_keywords, stop_keywords):
    words = page.extract_words()
    start_y = None
    for w in words:
        if any(sk.lower() in w["text"].lower() for sk in start_keywords):
            start_y = w["top"]
            break
    if start_y is None:
        return ""
    stop_y = page.height
    for w in words:
        if any(sk.lower() in w["text"].lower() for sk in stop_keywords):
            if w["top"] > start_y and w["top"] < stop_y:
                stop_y = w["top"]
    region = page.within_bbox((0, start_y, page.width, stop_y))
    text = region.extract_text() or ""
    # drop header lines
    lns = [l for l in text.splitlines() if l]
    lns = [l for l in lns if not any(sk.lower() in l.lower() for sk in start_keywords)]
    return "\n".join(lns)

def parse_address_block(text):
    result = {"name": None,"address": None,"city": None,"state": None,
              "pincode": None,"country": None,"phone": None,"fax": None,
              "telex": None,"email": None}
    if not text: 
        return result
    lns = [norm(l) for l in text.splitlines() if norm(l)]
    contacts = parse_contacts(text)
    result.update(contacts)
    lns = [l for l in lns if not re.search(r"(Phone|Fax|Email|Telex)", l, re.I)]
    if not lns: 
        return result
    result["name"] = lns[0]
    # country
    for l in reversed(lns):
        if re.fullmatch(r"[A-Za-z][A-Za-z ]+", l) and len(l.split()) <= 3:
            result["country"] = l
            break
    # pincode
    joined = " ".join(lns)
    pin = re.search(r"\b\d{5,6}\b", joined)
    if pin: 
        result["pincode"] = pin.group(0)
    # city/state line
    city_line = None
    if result["pincode"]:
        for l in lns:
            if result["pincode"] in l:
                city_line = l
                break
    if city_line:
        tmp = norm(city_line.replace(result["pincode"], "")).strip(" ,")
        mstate = re.search(r"\b([A-Z]{2})\b", tmp)
        if mstate:
            result["state"] = mstate.group(1)
            tmp = norm(re.sub(rf"\b{result['state']}\b", "", tmp)).strip(" ,")
        result["city"] = tmp if tmp else None
    # address
    body = [l for l in lns[1:] if l not in [result["country"], city_line] and l]
    result["address"] = " ".join(body).strip() if body else None
    return result

def parse_contacts(text):
    out = {"phone": None, "fax": None, "email": None, "telex": None}
    mph = re.search(r"Phone[^:\n]*:\s*([+()0-9\- ]{6,})", text, re.I)
    if mph: out["phone"] = norm(mph.group(1))
    mfx = re.search(r"Fax[^:\n]*:\s*([+()0-9\- ]{6,})", text, re.I)
    if mfx: out["fax"] = norm(mfx.group(1))
    mem = re.search(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}", text)
    if mem: out["email"] = mem.group(0)
    mte = re.search(r"Telex[^:\n]*:\s*(.+)", text, re.I)
    if mte: out["telex"] = norm(mte.group(1))
    return out

def extract_metrics(text):
    result = {"no_of_pieces": None,"gross_weight": None,"chargeable_weight": None,
              "rate": None,"total": None,"hs_code": None,"country_origin_of_goods": None,
              "nature_and_quantity_of_goods": None,"dimensions": None}
    manifest = re.search(r"(CONSOL CARGO.*|GARMENTS.*|LITHIUM ION BATTERIES.*)", text, re.I)
    if manifest: result["nature_and_quantity_of_goods"] = norm(manifest.group(1))
    hs = re.search(r"HS Code:\s*(\d+)", text)
    if hs: result["hs_code"] = hs.group(1)
    origin = re.search(r"Country Of Origin Of Goods:\s*([A-Z]{2,3})", text)
    if origin: result["country_origin_of_goods"] = origin.group(1)
    dims = re.findall(r"\d+\s*[xX]\s*\d+\s*[xX]\s*\d+\s*cm[s]?", text)
    if dims: result["dimensions"] = dims[0]
    npieces = re.search(r"GARMENTS\s+(\d+)\s*/", text, re.I)
    if npieces: result["no_of_pieces"] = npieces.group(1)
    mgross = re.search(r"Gross Weight.*?(\d{2,6})", text, re.I)
    if mgross: result["gross_weight"] = mgross.group(1)
    mcharge = re.search(r"Chargeable Weight.*?(\d{2,6})", text, re.I)
    if mcharge: result["chargeable_weight"] = mcharge.group(1)
    mrate = re.search(r"Rate Charge.*?(\d+\.\d{2})", text, re.I)
    if mrate: result["rate"] = mrate.group(1)
    money = re.findall(r"\b\d{3,}\.\d{2}\b", text)
    if money: result["total"] = sorted(money, key=lambda x: float(x), reverse=True)[0]
    return result

def extract_airports(text):
    res = {"departure_airport": None,"destination_airport": None}
    dep = re.search(r"Airport of Departure.*?\n?([A-Z]{3}\s*-\s*.+)", text, re.I)
    dest = re.search(r"Airport of Destination.*?\n?([A-Z]{3}\s*-\s*.+)", text, re.I)
    if dep: res["departure_airport"] = norm(dep.group(1))
    if dest: res["destination_airport"] = norm(dest.group(1))
    return res

def extract_awb_number(text):
    m = re.search(r"\b(\d{3})\s*-\s*(\d{6,})\b", text)
    return f"{m.group(1)}-{m.group(2)}" if m else None

# ---------- NEW: layout-aware column slice for consignee ----------
def extract_column_block(page, start_texts, stop_texts, x_tolerance=40):
    """
    Find the start word, then slice only within the same column (by x) down to the stop word.
    Returns text from that column region; avoids cross-column/contract leakage.
    """
    words = page.extract_words()
    # Find start
    start_word = None
    for w in words:
        wt = w["text"].lower()
        if any(st.lower() in wt for st in start_texts):
            start_word = w
            break
    if not start_word:
        return ""

    start_x = (start_word["x0"] + start_word["x1"]) / 2.0
    start_y = start_word["top"]

    # Find stop within same column (x within tolerance and below start)
    stop_y = None
    for w in words:
        wt = w["text"].lower()
        cx = (w["x0"] + w["x1"]) / 2.0
        if w["top"] > start_y and abs(cx - start_x) <= x_tolerance and any(sp.lower() in wt for sp in stop_texts):
            stop_y = w["top"]
            break
    if not stop_y:
        # Fallback: next strong header in same column to prevent overflow
        fallbacks = [
            "accounting information", "airport of departure", "airport of destination",
            "handling information", "charges at destination", "subject to the conditions",
            "created by descARTes", "for carrier's use only"
        ]
        for w in words:
            wt = w["text"].lower()
            cx = (w["x0"] + w["x1"]) / 2.0
            if w["top"] > start_y and abs(cx - start_x) <= x_tolerance and any(fb in wt for fb in fallbacks):
                stop_y = w["top"]
                break
    if not stop_y:
        # Soft fallback height to capture typical block without hitting contract
        stop_y = start_y + 220

    # Determine column width bounds from words near start_y
    col_x0 = min(w["x0"] for w in words if abs(((w["x0"]+w["x1"])/2.0) - start_x) <= x_tolerance)
    col_x1 = max(w["x1"] for w in words if abs(((w["x0"]+w["x1"])/2.0) - start_x) <= x_tolerance)

    region = page.within_bbox((col_x0, start_y, col_x1, stop_y))
    text = region.extract_text() or ""
    # Remove header line variants
    header_patterns = [r"Consignee'?s? Name and Address", r"Consignee"]
    out_lines = []
    for l in (text.splitlines() or []):
        if any(re.search(pat, l, re.I) for pat in header_patterns):
            continue
        out_lines.append(l)
    return "\n".join(out_lines)

def extract_awb_details(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[0]
        full_text = "\n".join(p.extract_text() or "" for p in pdf.pages)

        shipper_text = extract_column_block(
            page,
            start_texts=["Shipper's Name and Address", "Shipper"],
            stop_texts=["Shipper's Account Number", "Phone", "Fax", "Email"],
            x_tolerance=40
        )
        shipper_lines = [
            l for l in shipper_text.splitlines()
            if not re.search(r"Shipper'?s? Name and Address", l, re.I)
        ]
        shipper_text = "\n".join(shipper_lines)

        # Noise cleanup
        shipper_noise = [
            "Consignee", "Consignee's Name and Address", "Issued by",
            "Created by Descartes", "SUBJECT TO THE CONDITIONS",
            "Airport of Departure", "Issuing Carrier's Agent Name"
        ]
        clean_shipper = []
        for l in shipper_text.splitlines():
            if any(nm.lower() in l.lower() for nm in shipper_noise):
                break
            clean_shipper.append(l)
        shipper_text = "\n".join(clean_shipper)


        # CONSIGNEE: layout-aware column slice using exact header and structural stops
        consignee_text = extract_column_block(
            page,
            start_texts=["Consignee's Name and Address", "Consignee"],
            stop_texts=["Consignee's Account Number", "Phone", "Fax", "Email"]
        )

        # Clean up consignee_text to avoid contract/agent lines
        noise_markers = [
            "Issuing Carrier's Agent Name",
            "Agent's IATA Code",
            "Airport of Departure",
            "Airport of Destination",
            "Accounting Information",
            "Created by Descartes",
            "SUBJECT TO THE CONDITIONS"
        ]

        clean_lines = []
        for l in consignee_text.splitlines():
            if any(nm.lower() in l.lower() for nm in noise_markers):
                break
            clean_lines.append(l)
        consignee_text = "\n".join(clean_lines)


        shipper = parse_address_block(shipper_text)
        consignee = parse_address_block(consignee_text)

        metrics = extract_metrics(full_text)
        airports = extract_airports(full_text)
        awb = extract_awb_number(full_text)
        data = {
            "awb_number": awb,
            **{f"shipper_{k}": v for k,v in shipper.items()},
            **{f"consignee_{k}": v for k,v in consignee.items()},
            **metrics,
            **airports,
            "weight": metrics["gross_weight"] or metrics["total"],
        }
        print(json.dumps(data, indent=2))
        return data

if __name__=="__main__":
    extract_awb_details(sys.argv[1])
