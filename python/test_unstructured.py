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
import model_extract

# Captured before any test swaps it out, for the tests that exercise the real client.
_REAL_EXTRACT = model_extract.extract

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


def test_two_labels_on_one_line_do_not_run_together():
    """
    A compact invoice puts the lane on a single line. The terminator used to require a
    label to START a line, so departure read as "BLR DESTINATION: FRA" — the code that
    was then asked to resolve an IATA code.
    """
    compact = INVOICE.replace(
        "Airport of departure: Mumbai\nAirport of destination: Frankfurt",
        "Origin: BLR    Destination: FRA",
    )
    result = extract_from_text(_pdf(compact))
    assert result["departure"] == "BLR"
    assert result["destination"] == "FRA"


def test_a_multi_line_address_is_still_read_whole():
    """The same-line terminator must not cut an address that merely wraps."""
    result = extract_from_text(_pdf(INVOICE))
    assert "Marine Drive" in result["shipper"]["full_details"]
    assert "Mumbai" in result["shipper"]["full_details"]


def test_the_raw_text_is_returned_for_the_model_step():
    """Gemma consumes this. Returning it now means adding the model changes one module."""
    result = extract_from_text(_pdf(INVOICE))
    assert "Northwind" in result["text"]


# ─── The model step ──────────────────────────────────────────────────────────
#
# ⚠️ Stubbed, deliberately. These assert the WIRING — who wins, what happens when the
# model is down — which is exactly what must hold regardless of which model is loaded.
# Extraction quality is judged against a real model on a machine that can run one.


def _with_model(payload, available=True, error=None):
    """Swap the model out for a known answer, or a known failure."""
    calls = {"n": 0}

    def _stub(text):
        calls["n"] += 1
        return (None, error) if error else (payload, None)

    model_extract.available = lambda: available
    model_extract.extract = _stub

    return calls


def _no_model():
    """
    ⚠️ Every test starts with NO model. The label tests used to reach whatever Ollama was
    running on the machine, so they were slow and their answer depended on which model was
    loaded. Now that the model's reading replaces the labels, a label test that reached a
    real model would be testing the model.
    """
    model_extract.available = lambda: False
    model_extract.extract = _REAL_EXTRACT


def test_the_model_reading_replaces_the_label_reading():
    """
    🔴 On the first real invoice the label reading put the INVOICE NUMBER in the shipper
    field. Filling only the blanks meant the model was never asked, because that field was
    not blank.
    """
    import unstructured

    _with_model({
        "shipper_name": "TRAILSPEC GEARS PRIVATE LIMITED",
        "shipper_address": "MASJID ROAD, HMT P.O\nKALAMASEERY , ERNAKULAM - 683503",
        "description": "PU coated polyester travel backpack",
        "pieces": 500,
        "gross_weight": 364.09,
    })

    result = {"read_by": "labels", "shipper": {"full_details": "TSGEXP/001 & 25-08-2026"},
              "piece_weight": {"no_of_pieces": 50, "gross_weight": 0.0}}
    unstructured._apply_model(result, "some document text")

    assert result["read_by"] == "model"
    assert "TRAILSPEC GEARS PRIVATE LIMITED" in result["shipper"]["full_details"]
    assert "TSGEXP" not in result["shipper"]["full_details"]
    # 50 was the regex's first "N Pcs": a single table row, not the shipment.
    assert result["piece_weight"]["no_of_pieces"] == 500
    assert result["piece_weight"]["gross_weight"] == 364.09


def test_a_field_the_model_left_out_is_blank_not_the_label_guess():
    """A blank gets noticed; a wrong value on the card looks like a right one."""
    import unstructured

    _with_model({"shipper_name": "TRAILSPEC GEARS PRIVATE LIMITED"})

    result = {"read_by": "labels", "consignee": {"full_details": "BANK DETAILS"}, "piece_weight": {}}
    unstructured._apply_model(result, "text")

    assert "BANK DETAILS" not in str(result["consignee"])


def test_an_unreachable_model_leaves_the_label_result_standing():
    """🔴 A document read imperfectly is worth more than a 500, and the operator is told why."""
    import unstructured

    _with_model({"shipper_name": "unused"}, available=False)

    result = {"read_by": "labels", "shipper": {"name": "Kept"}, "consignee": {}, "cargo": {}}
    unstructured._apply_model(result, "text")

    assert result["shipper"]["name"] == "Kept"
    assert result["read_by"] == "labels"
    assert result["model_error"] == "the model is not reachable"


def test_a_model_that_times_out_is_reported_not_hidden():
    """
    🔴 The old 60s cap timed out every real document, and the job came back looking like a
    model that had read the page badly. The reason has to reach the operator.
    """
    import unstructured

    _with_model(None, error="the model timed out after 600s")

    result = {"read_by": "labels", "shipper": {"name": "Kept"}}
    unstructured._apply_model(result, "text")

    assert result["read_by"] == "labels"
    assert result["shipper"]["name"] == "Kept"
    assert result["model_error"] == "the model timed out after 600s"


def test_a_sea_lane_keeps_the_port_and_gets_no_airport_code():
    """
    ⚠️ The IATA lookup matches city names, so "Chennai" became MAA, an airport. A port has
    no IATA code (air = IATA, sea = UN/LOCODE).
    """
    import unstructured

    _with_model({"origin": "Chennai", "destination": "Umm Qasr", "transport_mode": "BY SEA"})
    result = {"piece_weight": {}}
    unstructured._apply_model(result, "text")

    assert result["departure"] == "CHENNAI"
    assert result["destination"] == "UMM QASR"


def test_an_air_lane_still_resolves_to_iata():
    import unstructured

    _with_model({"origin": "Chennai", "destination": "Frankfurt", "transport_mode": "AIR"})
    result = {"piece_weight": {}}
    unstructured._apply_model(result, "text")

    assert result["departure"] == "MAA"
    assert result["destination"] == "FRA"


def test_the_schema_permits_a_model_that_found_nothing():
    """⚠️ Every field is optional so a model can say "I could not read this" by omitting
    it. Forcing a field guarantees it is filled with something, and an invented consignee
    is worse than a blank one."""
    from schemas import ExtractedDocument

    empty = ExtractedDocument.model_validate({})
    assert empty.shipper_name is None
    assert empty.transport_mode is None


# ─── Grounding ───────────────────────────────────────────────────────────────
#
# 🔴 These were written AFTER running a real model, not before. Every case here is
# something gemma3:1b actually produced.


def test_an_invented_value_is_dropped():
    """Told "never invent a value", the model answered awb_number: "Not specified" — a
    literal string standing for absence, in a field that would have gone onto a waybill."""
    import model_extract

    source = "NORTHWIND EXPORTS PVT LTD\n41 Marine Drive\nMumbai 400020, India"
    kept = model_extract._grounded({"awb_number": "Not specified"}, source)

    assert "awb_number" not in kept


def test_a_hallucinated_company_is_dropped():
    import model_extract

    source = "NORTHWIND EXPORTS PVT LTD\n41 Marine Drive, Mumbai"
    kept = model_extract._grounded({"shipper_name": "Globex Trading Ltd"}, source)

    assert "shipper_name" not in kept


def test_an_address_rejoined_across_lines_survives():
    """
    ⚠️ The safeguard fired on the values it was meant to protect. A PDF gives an address on
    three lines; the model returns it on one, joined with a comma the document does not
    contain. Comparing on whitespace alone rejected every correctly-read address.
    """
    import model_extract

    source = "NORTHWIND EXPORTS PVT LTD\n41 Marine Drive, Unit 7\nMumbai 400020, India"
    kept = model_extract._grounded(
        {"shipper_address": "41 Marine Drive, Unit 7, Mumbai 400020, India"}, source
    )

    assert "shipper_address" in kept


def test_non_string_values_pass_through():
    """Numbers are not grounded — a weight is checked by the operator, not by substring."""
    import model_extract

    kept = model_extract._grounded({"pieces": 12}, "anything")

    assert kept["pieces"] == 12


def test_keep_alive_is_a_number_not_a_numeric_string():
    """
    🔴 Ollama parses `keep_alive` as a duration. Sending "-1" returns
    `400 time: missing unit in duration "-1"` and EVERY call fails with the model sitting
    loaded and idle. Only a real Ollama could have found this — a stub accepts anything.
    """
    import model_extract

    assert model_extract._keep_alive("-1") == -1
    assert model_extract._keep_alive("10m") == "10m"


def test_the_schema_is_flat_because_refs_defeat_small_models():
    """
    🔴 Measured. With `Party`/`Cargo` as sub-models Pydantic emits `$ref` into `$defs`, and
    gemma3:1b returned a valid, schema-conformant, COMPLETELY EMPTY document every time.
    Same model, same document, flattened: every field filled.
    """
    from schemas import ExtractedDocument

    schema = ExtractedDocument.model_json_schema()
    assert "$defs" not in schema, "a $ref schema returns empty documents on a small model"


def test_the_schema_has_no_free_form_list():
    """
    🔴 Measured. An `unreadable: List[str]` field let gemma3:1b loop for 242 seconds filling
    it with price-table numbers, until the answer ran out mid-string and failed validation.
    """
    from schemas import ExtractedDocument

    for name, field in ExtractedDocument.model_json_schema()["properties"].items():
        types = [field.get("type")] + [a.get("type") for a in field.get("anyOf", [])]
        assert "array" not in types, f"{name} is a list, and a list is a loop a small model can fall into"


# ─── The real client's failure reasons ───────────────────────────────────────


def test_an_unreachable_model_says_so():
    """A closed port, not a stub: the reason comes from the real client."""
    original = model_extract.OLLAMA_URL
    model_extract.OLLAMA_URL = "http://127.0.0.1:9"
    try:
        fields, error = _REAL_EXTRACT("some document text")
    finally:
        model_extract.OLLAMA_URL = original

    assert fields is None
    assert error == "the model is not reachable"


def test_a_slow_model_is_reported_as_a_timeout():
    """
    ⚠️ Against a socket that accepts and never answers. `socket.timeout` only became an alias
    of TimeoutError in Python 3.10, and this runner is 3.9, so catching TimeoutError alone
    would report a timeout here as "not reachable".
    """
    import socket

    server = socket.socket()
    server.bind(("127.0.0.1", 0))
    server.listen(1)
    port = server.getsockname()[1]

    original_url, original_timeout = model_extract.OLLAMA_URL, model_extract.TIMEOUT_SECONDS
    model_extract.OLLAMA_URL = f"http://127.0.0.1:{port}"
    model_extract.TIMEOUT_SECONDS = 1
    try:
        fields, error = _REAL_EXTRACT("some document text")
    finally:
        model_extract.OLLAMA_URL, model_extract.TIMEOUT_SECONDS = original_url, original_timeout
        server.close()

    assert fields is None
    assert error == "the model timed out after 1s"


# ─── PyMuPDF ─────────────────────────────────────────────────────────────────


def test_both_pdf_readers_return_the_same_text():
    """
    🔴 The fallback has to be EQUIVALENT, not merely present. PyMuPDF reads the text layer
    ~10x faster than pdfplumber (27.2ms vs 2.6ms on a one-page invoice, median of five),
    but an image that has not been rebuilt yet still runs the slow path — and a fallback
    that extracts different text would make the same document parse differently depending
    on which container answered.
    """
    import unstructured

    path = _pdf(INVOICE)

    fast, fast_pages = unstructured._page_text_mupdf(path)
    slow, slow_pages = unstructured._page_text_plumber(path)

    assert fast_pages == slow_pages
    assert "".join(fast.split()) == "".join(slow.split())


def test_the_fast_reader_is_the_one_in_use():
    """⚠️ Soft import: a missing PyMuPDF must degrade to pdfplumber, never take the OCR
    service down — /extract does not use this module and should not fail with it."""
    import unstructured

    assert unstructured._HAS_MUPDF, "PyMuPDF is not installed; the slow path is running"


if __name__ == "__main__":
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    failed = 0

    for test in tests:
        _no_model()
        try:
            test()
            print(f"  ok   {test.__name__}")
        except AssertionError as e:
            failed += 1
            print(f"  FAIL {test.__name__}: {e}")

    print(f"\n{len(tests) - failed} passed, {failed} failed")
    sys.exit(1 if failed else 0)
