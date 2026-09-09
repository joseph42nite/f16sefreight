"""
Tests for the text-layer path of /extract-unstructured.

⚠️ Written in pytest style (guide §8.2) but runnable with plain `python3
test_unstructured.py`, because pytest is not yet in requirements.txt and a test nobody can
run is a test nobody runs.

🔴 The assertion that matters most is `extraction_path`. Everything else here is
extraction quality, which degrades visibly; that field is a CONTROL SIGNAL — Laravel parks
a job on 'none' and asks a human to authorise a paid vision run. Report 'text' for a scan
and the operator is handed an empty extraction as a success.
"""

import os
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from unstructured import MIN_TEXT_CHARS, extract_from_text, has_text_layer

INVOICE = """Commercial Invoice

Shipper: Northwind Exports Pvt Ltd
41 Marine Drive, Unit 7
Mumbai 400020, India

Consignee: Hansa Logistik GmbH
Grosse Elbstrasse 145
20457 Hamburg, Germany

Airport of departure: Mumbai
Airport of destination: Frankfurt

Description of goods: Pharmaceutical grade excipients, palletised

Gross weight: 480.5 kg
Number of packages: 12 cartons

Air waybill: 176-10000008
"""


def _pdf(body: str = "", boxes_only: bool = False) -> str:
    """Write a one-page PDF to a temp file and return its path."""
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas

    path = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False).name
    c = canvas.Canvas(path, pagesize=A4)

    if boxes_only:
        # A scan: ink, plus the stray page number a scanner leaves behind.
        c.rect(40, 400, 500, 300, fill=0)
        c.drawString(50, 780, "3")
    else:
        y = 800
        for line in body.splitlines():
            c.drawString(50, y, line)
            y -= 16

    c.save()
    return path


def test_a_text_layer_document_reports_the_text_path():
    result = extract_from_text(_pdf(INVOICE))
    assert result["extraction_path"] == "text"
    assert result["page_count"] == 1


def test_a_scan_reports_none_so_the_job_can_park_for_consent():
    result = extract_from_text(_pdf(boxes_only=True))
    # 🔴 Nothing else in the pipeline can produce this value, and the consent flow is
    # unreachable without it.
    assert result["extraction_path"] == "none"


def test_a_scan_returns_no_invented_regions():
    result = extract_from_text(_pdf(boxes_only=True))
    regions = [k for k in result if k not in ("extraction_path", "page_count", "text")]
    assert regions == [], f"a scan produced regions it could not have read: {regions}"


def test_a_stray_character_is_not_a_text_layer():
    """A scanner's page number must not pass for a readable document."""
    assert has_text_layer("3") is False
    assert has_text_layer("x" * (MIN_TEXT_CHARS - 1)) is False
    assert has_text_layer("x" * MIN_TEXT_CHARS) is True


def test_the_key_vocabulary_matches_the_coordinate_endpoint():
    """
    🔑 Guide §4.1: the same keys as /extract, or OcrUploadModal.vue needs two mappers and
    they drift the first time either side changes.
    """
    result = extract_from_text(_pdf(INVOICE))

    for key in ("shipper", "consignee", "departure", "destination", "transit",
                "cargo", "weight_charge", "piece_weight", "awb_number", "chrg_code"):
        assert key in result, f"{key} is missing from the unstructured response"


def test_pieces_and_weight_are_read_by_meaning_not_position():
    """
    🔴 `transform_piece_weight` is positional — handed labelled prose it read
    "480.5 kg / 12 cartons" as a chargeable weight of 480.5 and a rate of 12. Individually
    plausible, entirely wrong, and nothing about the card looks broken.
    """
    pw = extract_from_text(_pdf(INVOICE))["piece_weight"]

    assert pw["no_of_pieces"] == 12
    assert pw["gross_weight"] == 480.5
    # ⚠️ Blank rather than guessed: an invoice carries no IATA rate class, and inventing
    # one puts a value in a legal field nobody wrote.
    assert pw["rate_class"] == ""


def test_the_lane_resolves_to_iata():
    result = extract_from_text(_pdf(INVOICE))
    assert result["departure"] == "BOM"
    assert result["destination"] == "FRA"


def test_the_raw_text_is_returned_for_the_model_step():
    """Gemma consumes this. Returning it now means adding the model changes one module."""
    result = extract_from_text(_pdf(INVOICE))
    assert "Northwind" in result["text"]


if __name__ == "__main__":
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    failed = 0

    for test in tests:
        try:
            test()
            print(f"  ok   {test.__name__}")
        except AssertionError as e:
            failed += 1
            print(f"  FAIL {test.__name__}: {e}")

    print(f"\n{len(tests) - failed} passed, {failed} failed")
    sys.exit(1 if failed else 0)
