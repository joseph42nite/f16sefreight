"""
bill.py
=======
Reading a BILL OF LADING or a carrier's BOOKING CONFIRMATION into the FocusSea form (guide Step 12.4).

The same road as an invoice — the text layer first, free; a scan parks for a person's consent — but its own
schema and prompt (`ExtractedBill`, prompts/extract_bill.txt), and its own answer: `bill`, keyed as the model
read it. Laravel maps those keys onto the sea form and checks each value against §4.1.2 (SeaBillReading),
so the rules live once, next to the form that enforces them.

🔴 `extraction_path` is the control signal, exactly as in unstructured.py: 'none' parks the job for consent.
"""

from typing import Any, Dict, List

import fitz  # PyMuPDF

import model_extract
from unstructured import _page_text, has_text_layer


def extract_bill_from_text(pdf_path: str, use_model: bool = True, skip_reason: str = "the daily AI limit has been reached") -> Dict[str, Any]:
    text, page_count = _page_text(pdf_path)

    if not has_text_layer(text):
        return {"extraction_path": "none", "page_count": page_count, "text": text, "document": "bill"}

    result: Dict[str, Any] = {"extraction_path": "text", "page_count": page_count, "text": text,
                              "document": "bill", "read_by": "none", "bill": {}}

    # ⚠️ No label reading to fall back to: a bill's layout differs by carrier, and a guessed vessel is worse
    # than an empty field. Without the model the operator is told why and types the bill in.
    if not use_model:
        result["model_error"] = skip_reason
        return result

    parsed, error, usage = model_extract.extract_bill(text)
    result["model_usage"] = usage

    if error:
        result["model_error"] = error
        return result

    result["bill"] = parsed
    result["read_by"] = "model"

    return result


def extract_bill_from_images(pdf_path: str) -> Dict[str, Any]:
    """A scanned bill — only ever after a person authorised the paid run (ProcessPdfOcrJob)."""
    result: Dict[str, Any] = {"extraction_path": "vision", "text": "", "document": "bill", "read_by": "none", "bill": {}}
    pages: List[bytes] = []

    with fitz.open(pdf_path) as doc:
        result["page_count"] = doc.page_count
        for page in list(doc)[:model_extract.MAX_VISION_PAGES]:
            pages.append(page.get_pixmap(dpi=150).tobytes("png"))

    parsed, error, usage = model_extract.extract_bill_images(pages)
    result["model_usage"] = usage

    if error:
        result["model_error"] = error
        return result

    result["bill"] = parsed
    result["read_by"] = "model"

    return result
