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

⚠️ Label anchoring is a FLOOR, not the answer. It finds "Shipper:" and takes what follows,
which works on documents that label their fields and fails on the many that do not. The
model step (Gemma over `text`) replaces this function and nothing else — which is why the
raw text is returned alongside.
"""

import re
from typing import Any, Dict, List, Optional

import pdfplumber

from extract_awb_new import process_box

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
    parts: List[str] = []

    with pdfplumber.open(pdf_path) as pdf:
        page_count = len(pdf.pages)
        for page in pdf.pages:
            try:
                parts.append(page.extract_text() or "")
            except Exception:
                # One unreadable page must not lose the rest of the document.
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
            r"\b" + re.escape(label) + r"\b\s*[:\-]?\s*(.*?)(?=\n\s*\n|\n[A-Z][A-Za-z ./]{2,30}\s*[:\-]|\Z)",
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

    pieces_match = PIECES_PATTERN.search(text)

    return {
        "no_of_pieces": int(pieces_match.group(1)) if pieces_match else 0,
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

    # Read from the WHOLE document, not from a labelled block: the count and the mass are
    # rarely under one label, and often not under a label at all.
    result["piece_weight"] = _read_piece_weight(text)

    for region in REGIONS:
        if region == "piece_weight":
            continue

        block = _blocks_after(text, LABELS[region]) if region in LABELS else None

        # ⚠️ Every value goes through the coordinate path's own `process_box`, so an
        # address is shaped like an address and a routing like a routing regardless of
        # which endpoint produced it. An empty string is what `/extract` passes when a
        # box is blank, so a missing region looks the same from both.
        result[region] = process_box(region, block or "")

    return result
