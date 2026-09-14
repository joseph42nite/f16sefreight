"""
unstructured.py
===============
The text-layer half of /extract-unstructured.

WHAT THIS IS FOR
────────────────
`/extract` reads an AWB by COORDINATES, which is exact and free — the airline's form
never moves. A client's commercial invoice or packing list has no fixed layout, so there
is no box to crop. This module reads the page's text layer instead and answers the one
question the rest of the pipeline is waiting on:

    is there readable text here, or is this a scan?

🔴 THAT ANSWER IS THE POINT, not the extraction. `ProcessPdfOcrJob` parks a job on
`extraction_path = 'none'` and asks the operator to authorise a paid vision run. Until
this module existed nothing could return 'none', so the consent flow was unreachable and
an unstructured upload called an endpoint that 404'd.

⚠️ SAME KEY VOCABULARY AS /extract (guide §4.1). The regions are the ones in
`boxes_config.json`, and every value goes through the SAME `process_box()` the coordinate
path uses — so an address is shaped like an address either way. Two endpoints with
different keys means `OcrUploadModal.vue` needs two mappers, and they drift the first time
either side changes.

🔴 THE MODEL READS THE DOCUMENT; LABELS ARE ONLY THE FALLBACK. Label anchoring finds
"Shipper:" and takes what follows, which fails on a table-layout invoice: its text comes out
in draw order, and on the first real one the exporter's name sat eight lines above its own
label. So the model's reading replaces the label reading for every field it covers, and the
label reading is used only when the model cannot answer, with the reason recorded.
"""

import bisect
import re
from typing import Any, Dict, List, Optional

import pdfplumber

import model_extract
from extract_awb_new import AIRPORT_IATA_MAP, extract_dimensions, process_box, resolve_iata

# 🔴 PyMuPDF for the TEXT LAYER, pdfplumber for everything else. Measured on this machine,
# same documents, median of five: 27.2ms vs 2.6ms on a one-page invoice — 10x, with the
# extracted text identical. `extract_awb_new.py` still uses pdfplumber to CROP coordinate
# boxes, which is a different job it does well; this only replaces the full-page read.
#
# ⚠️ IMPORTED SOFTLY. The Docker image does not carry PyMuPDF until it is rebuilt, and a
# hard import would take the whole OCR service down on deploy — including `/extract`, which
# does not use this module at all. Falling back keeps a slower service running instead of
# turning a missing dependency into an outage.
try:
    import fitz  # PyMuPDF

    _HAS_MUPDF = True
except ImportError:  # pragma: no cover - exercised by the image that lacks it
    _HAS_MUPDF = False

# The regions the coordinate path emits. Kept in this order so a response reads the way
# the document does.
REGIONS = [
    "shipper",
    "consignee",
    "departure",
    "destination",
    "transit",
    "cargo",
    "weight_charge",
    "piece_weight",
    "awb_number",
    "chrg_code",
]

# 🔴 A SCAN IS NOT AN EMPTY PAGE. A scanned PDF often carries a few stray characters —
# a header stamp, a page number, an OCR artefact from the sender's own scanner — so
# "any text at all" would classify most scans as text-layer documents and skip the vision
# path the operator is paying for. This is the floor a real page of prose clears easily
# and a scan does not.
MIN_TEXT_CHARS = 120

# Labels as documents actually write them. Each region lists the alternates seen in the
# wild; the first one that matches wins.
#
# ⚠️ `\b` on both ends and re.IGNORECASE only — no fuzzy matching. A near-miss that
# silently grabs the wrong block is worse than a miss, because the operator has no way to
# tell a wrong shipper from a right one without opening the PDF themselves.
LABELS: Dict[str, List[str]] = {
    "shipper": ["shipper", "exporter", "consignor", "sender", "from"],
    "consignee": ["consignee", "importer", "deliver to", "ship to", "buyer"],
    "departure": ["airport of departure", "port of loading", "origin", "from airport"],
    "destination": ["airport of destination", "port of discharge", "destination", "to airport"],
    "cargo": ["description of goods", "description", "commodity", "nature of goods", "particulars"],
    "weight_charge": ["chargeable weight", "weight charge", "freight charge"],
    "awb_number": ["air waybill", "awb no", "awb number", "mawb", "hawb"],
}


def _page_text(pdf_path: str) -> tuple[str, int]:
    """All the readable text in the document, and how many pages it came from."""
    if _HAS_MUPDF:
        return _page_text_mupdf(pdf_path)

    return _page_text_plumber(pdf_path)


def _page_text_mupdf(pdf_path: str) -> tuple[str, int]:
    """The fast path. Identical output to pdfplumber, an order of magnitude quicker."""
    parts: List[str] = []

    with fitz.open(pdf_path) as doc:
        page_count = doc.page_count
        for page in doc:
            try:
                parts.append(page.get_text())
            except Exception:
                # One unreadable page must not lose the rest of the document.
                parts.append("")

    return "\n".join(parts).strip(), page_count


def _page_text_plumber(pdf_path: str) -> tuple[str, int]:
    """The fallback, for an image that has not been rebuilt with PyMuPDF yet."""
    parts: List[str] = []

    with pdfplumber.open(pdf_path) as pdf:
        page_count = len(pdf.pages)
        for page in pdf.pages:
            try:
                parts.append(page.extract_text() or "")
            except Exception:
                parts.append("")

    return "\n".join(parts).strip(), page_count


def has_text_layer(text: str) -> bool:
    """Whether this document can be read without paying for vision."""
    return len(re.sub(r"\s+", "", text)) >= MIN_TEXT_CHARS


def _blocks_after(text: str, labels: List[str]) -> Optional[str]:
    """
    The text following a label, up to the next label-looking line or a blank line.

    ⚠️ Stops at the NEXT label rather than at a fixed line count. An address is two lines
    on one invoice and six on another, and a fixed window either truncates the long one or
    swallows the field below the short one.

    """
    for label in labels:
        pattern = re.compile(
            r"\b" + re.escape(label) + r"\b\s*[:\-]?\s*(.*?)"
            # Stop at a blank line, at a label starting the next line, or — the case a
            # line-anchored rule misses entirely — at a SECOND label on the SAME line.
            # "Origin: BLR    Destination: FRA" is one line, and without the third
            # alternative departure reads as "BLR DESTINATION: FRA".
            r"(?=\n\s*\n|\n[A-Z][A-Za-z ./]{2,30}\s*[:\-]|[ \t]+[A-Z][A-Za-z ./]{2,30}[ \t]*:|\Z)",
            re.IGNORECASE | re.DOTALL,
        )
        match = pattern.search(text)

        if not match:
            continue

        block = match.group(1).strip()

        if not block:
            continue

        return block

    return None


# The piece/weight values, read by meaning rather than by position.
PIECES_PATTERN = re.compile(
    r"(\d+)\s*(?:pcs?|pieces?|packages?|cartons?|pkgs?|boxes|pallets?|skids?)\b",
    re.IGNORECASE,
)
GROSS_PATTERN = re.compile(
    r"(?:gross\s*(?:weight|wt)|g\.?\s*w\.?|total\s*weight)\s*[:\-]?\s*([\d.]+)\s*(?:kgs?|kilograms?)?",
    re.IGNORECASE,
)
CHARGEABLE_PATTERN = re.compile(
    r"(?:chargeable|charge(?:able)?)\s*(?:weight|wt)\s*[:\-]?\s*([\d.]+)",
    re.IGNORECASE,
)


# 🔴 PIECES ARE PACKAGES, TAKEN AS WRITTEN. The user: "use carton as 1 piece", and "if it's
# clearly not written as pieces or pcs as number then don't determine". The model answered 500 —
# the item quantity — twice, even when told to count packages, so the count is read off the
# document by its LABEL instead: a written carton/package count first, a written pieces/pcs
# count second, and nothing at all when the document is not clear.
PACKAGE_WORDS = r"(?:CTNS?|CARTONS?|PACKAGES?|PKGS?|BOXES|PALLETS?|SKIDS?)"
PIECE_WORDS = r"(?:PCS?|PIECES?)"

UNIT_NAMES = (("CTN", "cartons"), ("CARTON", "cartons"), ("PKG", "packages"), ("PACKAGE", "packages"),
              ("BOX", "boxes"), ("PALLET", "pallets"), ("SKID", "skids"))


def _counts(patterns: List[str], text: str) -> List[tuple]:
    """Every (number, as written) the patterns find."""
    found = []
    for pattern in patterns:
        for m in re.finditer(pattern, text, re.IGNORECASE):
            found.append((int(m.group("n")), " ".join(m.group(0).split())))
    return found


def _pick(totals: List[tuple], bare: List[tuple]) -> Optional[tuple]:
    """
    A labelled TOTAL wins. Otherwise one number, only if the document agrees with itself.

    ⚠️ Several different counts ("50 Pcs", "20 Pcs", "15 Pcs"…) are the rows of a table, not the
    shipment — that is not "clearly written", so nothing is taken.
    """
    if totals:
        return totals[0]

    return bare[0] if len({n for n, _ in bare}) == 1 else None


def _written_pieces(text: str) -> Dict[str, Any]:
    """
    The piece count the document writes, and what it was written as — or {} if it is not clear.

    {"count": 26, "unit": "cartons", "written": "TOTAL CTNS 26", "also": "TOTAL QTY 500 Pcs"}
    """
    packages = _pick(
        _counts([rf"\bTOTAL\s+{PACKAGE_WORDS}\s*[:\-]?\s*(?P<n>\d+)\b"], text),
        _counts([rf"\b(?P<n>\d+)\s*{PACKAGE_WORDS}\b",
                 rf"\b{PACKAGE_WORDS}\s*[:\-]\s*(?P<n>\d+)\b"], text),
    )
    pieces = _pick(
        _counts([rf"\bTOTAL\s+(?:QTY|QUANTITY)?\s*[:\-]?\s*(?P<n>\d+)\s*{PIECE_WORDS}\b",
                 rf"\bTOTAL\s+{PIECE_WORDS}\s*[:\-]?\s*(?P<n>\d+)\b"], text),
        _counts([rf"\b(?P<n>\d+)\s*{PIECE_WORDS}\b",
                 rf"\b{PIECE_WORDS}\s*[:\-]\s*(?P<n>\d+)\b"], text),
    )

    if packages:
        upper = packages[1].upper()
        unit = next((name for word, name in UNIT_NAMES if word in upper), "packages")
        note = {"count": packages[0], "unit": unit, "written": packages[1]}
        if pieces and pieces[0] != packages[0]:
            note["also"] = pieces[1]
        return note

    if pieces:
        return {"count": pieces[0], "unit": "pcs", "written": pieces[1]}

    return {}


def _read_piece_weight(text: str) -> Dict[str, Any]:
    """
    Pieces and weights, in the shape `/extract` emits.

    🔴 NOT `transform_piece_weight()`. That function is POSITIONAL — it splits the AWB's
    piece/weight box on whitespace and assigns the numbers by their order in a fixed
    layout. Handed labelled prose it read "480.5 kg / 12 cartons" as a chargeable weight
    of 480.5 and a rate of 12: numbers that are individually plausible and entirely wrong,
    which is the worst kind of extraction error because nothing about the card looks
    broken.
    the keys are identical so `OcrUploadModal.vue` still needs one mapper; only the way
    they are filled differs, because the input is prose and not a cropped box.
    """
    def _number(pattern) -> float:
        match = pattern.search(text)
        try:
            return float(match.group(1)) if match else 0.0
        except (TypeError, ValueError):
            return 0.0

    return {
        # Packages as written — see `_written_pieces`. 0 when the document is not clear.
        "no_of_pieces": _written_pieces(text).get("count", 0),
        "gross_weight": _number(GROSS_PATTERN),
        # ⚠️ Blank rather than guessed. Rate class is a single IATA letter off the waybill
        # and an invoice does not carry one; inventing a default would put a value in a
        # legal field that nobody wrote.
        "rate_class": "",
        "chargeable_weight": _number(CHARGEABLE_PATTERN),
        "rate": 0.0,
        "total_charge": 0.0,
    }


def extract_from_text(pdf_path: str) -> Dict[str, Any]:
    """
    Read the document's text layer and map what can be found onto the AWB regions.

    Returns the `/extract` vocabulary plus `extraction_path`, `page_count` and the raw
    `text`. The text is returned deliberately: it is the input the model step consumes,
    and returning it now means adding Gemma changes this module and nothing downstream.
    """
    text, page_count = _page_text(pdf_path)

    if not has_text_layer(text):
        # 🔴 The signal the consent flow waits for. Nothing is guessed and nothing is
        # spent — Laravel parks the job and asks a human whether to pay for vision.
        return {
            "extraction_path": "none",
            "page_count": page_count,
            "text": text,
        }

    result: Dict[str, Any] = {"extraction_path": "text", "page_count": page_count, "text": text}
    # 🔴 Records WHICH reader produced the fields, because "the regex found the shipper"
    # and "the model did" are different levels of trust and the operator is entitled to
    # know which one they are checking.
    result["read_by"] = "labels"

    # Read from the WHOLE document, not from a labelled block: the count and the mass are
    # rarely under one label, and often not under a label at all.
    result["piece_weight"] = _read_piece_weight(text)

    # What the piece count was taken from, so the panel can say so — and say when it was not there.
    result["pieces_note"] = _written_pieces(text) or None

    for region in REGIONS:
        if region == "piece_weight":
            continue

        block = _blocks_after(text, LABELS[region]) if region in LABELS else None

        # ⚠️ Every value goes through the coordinate path's own `process_box`, so an
        # address is shaped like an address and a routing like a routing regardless of
        # which endpoint produced it. An empty string is what `/extract` passes when a
        # box is blank, so a missing region looks the same from both.
        result[region] = process_box(region, block or "")

    # 🔴 THE MODEL'S READING REPLACES THE LABEL READING. Labels are read first only so there
    # is something to fall back to: if the model is down, slow or returns junk, the label
    # result stands and `model_error` says why. A fallback the operator cannot see looks
    # exactly like a model that read the page badly.
    _apply_model(result, text)

    return result


# 🔴 ONLY WHAT THE EXTRACTION PANEL TAKES FROM A DOCUMENT: the parties, the cargo, the weights
# and the route. For these the model's answer replaces the label reading entirely, and a field
# the model left out comes back BLANK, not as the label guess. On the first real invoice the
# label guess for the shipper was the invoice number, and for the departure an IEC number.
# A wrong value on the card looks like a right one; a blank gets noticed.


def _party(parsed: Dict[str, Any], role: str, text: str) -> Dict[str, Any]:
    """
    A party as the model split it, in the region shape the coordinate path emits.

    🔴 NOT through `transform_address_box`. That parser was written for a cropped AWB box and
    re-split the model's answer by rule: it read `702` in `22/702/01 - CEE PEE BUILDING` as a
    PIN, dropped it, and stored the address as `22 01 CEE PEE BUILDING`. The model has already
    split the party, so its parts are kept as they are.
    """
    part = lambda key: parsed.get(f"{role}_{key}") or None
    block = _party_block(text, parsed, role)

    return {
        "full_details": " ".join(v for v in (part("name"), part("address")) if v) or None,
        "name": part("name"),
        "address": part("address"),
        "city": part("city"),
        # 🔴 A state is always LOW: on the real invoice the model gave the DISTRICT, ERNAKULAM.
        # Shown and reviewed, never saved on its own, until a PIN lookup exists (GAPS #199).
        "state": {"value": part("state"), "confidence": "low"} if part("state") else None,
        # ⚠️ The model often misses a post code printed in the party's own lines ("Amman 11191"),
        # so one written there is taken when the model gave none.
        "pin": part("post_code") or _written_post_code(block[1:]),
        "country": _country(part("country"), block),
        "phone": None, "email": None, "fax": None, "eori": None,
    }


def _party_block(text: str, parsed: Dict[str, Any], role: str) -> List[str]:
    """
    The party's own lines on the page: from its name to one line past the last line holding
    its address, city or post code.

    ⚠️ Found from what the MODEL read, not from a label, so it survives jumbled table text. A
    part printed more than three lines past the block is not the party's, and does not stretch it.
    """
    name = _comparable(parsed.get(f"{role}_name") or "")
    lines = [line.strip() for line in text.splitlines()]
    flat = [_comparable(line) for line in lines]

    starts, pos = [], 0
    for line in flat:
        starts.append(pos)
        pos += len(line)

    joined = "".join(flat)
    at = joined.find(name) if name else -1

    if at < 0:
        return []

    line_of = lambda offset: bisect.bisect_right(starts, offset) - 1
    first, last = line_of(at), line_of(at + len(name) - 1)

    for key in ("address", "city", "post_code"):
        value = _comparable(parsed.get(f"{role}_{key}") or "")
        found = joined.find(value, at) if value else -1

        if found >= 0 and line_of(found) <= last + 3:
            last = max(last, line_of(found + len(value) - 1))

    return [line for line in lines[first:last + 2] if line]


# A standalone run of 4-10 digits: not part of "22/702/01", a date, or a GST number.
POST_CODE = re.compile(r"(?<![\w/.-])(\d{4,10})(?![\w/-])")


def _written_post_code(lines: List[str]) -> Optional[str]:
    """
    The one post code written in the party's lines, or None.

    ⚠️ A number after "Box" is a box number. More than one candidate is not guessed between —
    a phone number and a post code look alike, and a value must be as written, not inferred.
    """
    found = {
        m.group(1)
        for line in lines
        for m in POST_CODE.finditer(line)
        if not re.search(r"box\D{0,4}$", line[:m.start()], re.IGNORECASE)
    }

    return found.pop() if len(found) == 1 else None


def _country(value: Optional[str], block: List[str]) -> Optional[Dict[str, str]]:
    """
    🔴 HIGH only when printed in the party's OWN lines; otherwise LOW, shown and not saved.

    On the real invoice the consignee block ends `Amman 11191 / Jordan`, and Jordan was still
    left out of the draft because every model country was treated as worked out. The shipper's
    INDIA is printed only as the goods' origin, and the model once answered "Iraq" — the
    destination — for it: neither is in the shipper's lines, so both stay low.
    """
    if not value:
        return None

    printed = re.search(r"\b" + re.escape(value) + r"\b", "\n".join(block), re.IGNORECASE)

    return {"value": value, "confidence": "high" if printed else "low"}


def _comparable(text: str) -> str:
    """Letters and digits only, lower case — the same comparison the grounding check uses."""
    return "".join(c for c in text.lower() if c.isalnum())


AIRPORT_CODES = set(AIRPORT_IATA_MAP.values())


def _airport_code(place: Optional[str]) -> Optional[str]:
    """The IATA code for a place, or None when it is not an airport (a sea port, a country)."""
    code = resolve_iata(place) if place else None

    return code if code in AIRPORT_CODES else None


def _apply_model(result: Dict[str, Any], text: str) -> None:
    """Read the document with the model, if one answers. Otherwise record why not."""
    if not model_extract.available():
        result["model_error"] = "the model is not reachable"
        return

    parsed, error = model_extract.extract(text)

    if error:
        result["model_error"] = error
        return

    # 🔴 AN EMPTY ANSWER IS A FAILURE, NOT A READING. On the real invoice the model once came
    # back with nothing usable — no shipper, no consignee, no cargo — and because an answer
    # replaces the label reading, every field went blank and the draft saved only its AWB
    # number, with no error anywhere to say why.
    if not any(v not in (None, "", 0, 0.0) for v in parsed.values()):
        result["model_error"] = "the model returned nothing usable"
        return

    for role in ("shipper", "consignee"):
        result[role] = _party(parsed, role, text)

    result["cargo"] = process_box("cargo", parsed.get("description") or "")

    # The route as written, and its airport code when it is an airport. A sea port such as
    # NHAVA SHEVA has none, and the panel says so rather than saving it.
    origin, destination = parsed.get("origin"), parsed.get("destination")
    result["departure"] = origin or ""
    result["destination"] = destination or ""
    result["route"] = {
        "origin": origin, "origin_code": _airport_code(origin),
        "destination": destination, "destination_code": _airport_code(destination),
    }

    # 🔴 Written straight into the dict, not through `process_box`: `transform_piece_weight`
    # is POSITIONAL and misreads a number handed to it on its own.
    result["piece_weight"]["gross_weight"] = parsed.get("gross_weight", 0.0)
    # ⚠️ NOT the model's `pieces`: it gave the item quantity (500) twice when the invoice's cartons
    # were 26. The written count from `_read_piece_weight` stands.
    result["piece_weight"]["chargeable_weight"] = parsed.get("chargeable_weight", 0.0)

    # Same shape the label path gives: [{"dimension": "64X32X64", "count": 1}].
    if parsed.get("dimensions"):
        result["cargo"]["dimensions"] = extract_dimensions(parsed["dimensions"])

    # 🔴 ONLY IF THE DOCUMENT SAYS SO. On an invoice that never writes "notify", the model
    # filed the CONSIGNEE's address under a notify party twice: first with no company name at
    # all, then with `notify_name: "GARDENS WASFI"` — a fragment of the consignee's street —
    # which walked straight through a name-only guard. A document that does not name a notify
    # party does not have one.
    if parsed.get("notify_name") and "notify" in text.lower():
        result["notify"] = _party(parsed, "notify", text)

    result["read_by"] = "model"
