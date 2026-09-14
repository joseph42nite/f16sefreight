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

import json
import os
import sys
import tempfile
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from unstructured import MIN_TEXT_CHARS, extract_from_text, has_text_layer
import model_extract

# Captured before any test swaps it out, for the tests that exercise the real client.
_REAL_EXTRACT = model_extract.extract
_REAL_AVAILABLE = model_extract.available

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


# ─── Pieces: packages, as written ────────────────────────────────────────────

# The real invoice's lines, in the jumbled order the PDF gives them.
JUMBLED = "TOTAL CTN\nVessel/Flight No.\n50\nPcs\n17\n20\nPcs\n10\nTOTAL QTY                               500 Pcs\nTOTAL CTNS\n26\nTOTAL NET WEIGHT"


def test_a_carton_count_is_the_piece_count():
    """🔴 The user: "use carton as 1 piece". The invoice says TOTAL CTNS 26 and TOTAL QTY 500 Pcs."""
    import unstructured

    note = unstructured._written_pieces(JUMBLED)

    assert note["count"] == 26
    assert note["unit"] == "cartons"
    assert note["written"] == "TOTAL CTNS 26"
    assert note["also"] == "TOTAL QTY 500 Pcs"


def test_without_cartons_a_written_pcs_total_is_used():
    import unstructured

    note = unstructured._written_pieces("50\nPcs\n20\nPcs\nTOTAL QTY 500 Pcs")

    assert (note["count"], note["unit"]) == (500, "pcs")


def test_table_rows_alone_are_not_a_piece_count():
    """⚠️ The user: "if it's clearly not written as pieces or pcs as number then don't determine"."""
    import unstructured

    assert unstructured._written_pieces("50\nPcs\n20\nPcs\n15\nPcs") == {}
    assert unstructured._written_pieces("Commodity: backpacks") == {}


def test_one_clearly_written_count_is_used():
    import unstructured

    assert unstructured._written_pieces("Pieces: 14")["count"] == 14
    assert unstructured._written_pieces("Packed in 3 pallets")["unit"] == "pallets"


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
        return (None, error, None) if error else (payload, None, {"model": "stub", "cost_usd": 0.0003})

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
              "piece_weight": {"no_of_pieces": 26, "gross_weight": 0.0}}
    unstructured._apply_model(result, "some document text")

    assert result["read_by"] == "model"
    assert "TRAILSPEC GEARS PRIVATE LIMITED" in result["shipper"]["full_details"]
    assert "TSGEXP" not in result["shipper"]["full_details"]
    # 🔴 Pieces are the WRITTEN package count, never the model's: it answered 500, the items.
    assert result["piece_weight"]["no_of_pieces"] == 26
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


def test_an_empty_model_answer_keeps_the_label_reading():
    """
    🔴 Measured: a real run returned nothing usable, and because the model's answer replaces
    the label reading, every field went blank and the draft saved only its AWB number.
    """
    import unstructured

    for empty in ({}, {"description": "", "pieces": 0, "gross_weight": 0.0}):
        _with_model(empty)
        result = {"read_by": "labels", "shipper": {"name": "Kept"}, "piece_weight": {"no_of_pieces": 50}}
        unstructured._apply_model(result, "text")

        assert result["read_by"] == "labels"
        assert result["shipper"]["name"] == "Kept"
        assert result["piece_weight"]["no_of_pieces"] == 50
        assert result["model_error"] == "the model returned nothing usable"


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


def test_the_model_is_asked_only_for_what_the_panel_takes():
    """
    🔴 The Extraction panel takes the parties, the cargo, the weights and the route from a
    document. The AWB number does not come from a client's document, and when the model was
    asked for it it returned the bank's SWIFT code.

    🔴 NO pieces and NO notify party (user, 2026-09-14): every key is answer tokens, and answer
    tokens are most of the time. Pieces are read as written; a notify party is pasted or typed.
    """
    from schemas import ExtractedDocument

    parts = {f"{role}_{part}"
             for role in ("shipper", "consignee")
             for part in ("name", "address", "city", "state", "post_code", "country")}

    assert set(ExtractedDocument.model_fields) == parts | {
        "description", "gross_weight", "chargeable_weight", "dimensions",
        "origin", "destination",
    }


def test_the_cargo_is_asked_for_before_the_parties():
    """
    🔴 Measured: asked for 23 fields with the parties first, gemma3:4b returned no description,
    pieces, weight or dimensions in three runs out of three. It writes the answer in schema
    order, so the goods come first.
    """
    from schemas import ExtractedDocument

    order = list(ExtractedDocument.model_json_schema()["properties"])
    cargo = ["description", "gross_weight", "chargeable_weight", "dimensions"]

    assert order[:len(cargo)] == cargo, order[:8]


def test_the_cargo_keys_must_be_written_but_may_be_null():
    """
    🔴 Measured: with every field optional, the raw answer began at `shipper_name` — the model
    skipped the optional cargo keys outright, in four runs out of four. A required key has to be
    written; null is still an answer, so nothing has to be invented.
    """
    from schemas import ExtractedDocument

    schema = ExtractedDocument.model_json_schema()
    cargo = {"description", "gross_weight", "chargeable_weight", "dimensions"}

    assert cargo <= set(schema.get("required", [])), schema.get("required")

    for key in cargo:
        types = [a.get("type") for a in schema["properties"][key].get("anyOf", [])]
        assert "null" in types, f"{key} must allow null"

    # The parties stay optional: an invented consignee is worse than a missing one.
    assert "shipper_name" not in schema.get("required", [])


def test_the_model_splits_a_party_and_marks_what_it_worked_out():
    """
    🔴 The parser's own split read "KERALA" as the shipper's CITY on the real invoice, and
    found no state or country at all. The model is asked for the parts directly now.
    """
    import unstructured

    _with_model({
        "shipper_name": "TRAILSPEC GEARS PRIVATE LIMITED",
        "shipper_address": "22/702/01 - CEE PEE BUILDING, MASJID ROAD",
        "shipper_city": "KALAMASEERY", "shipper_post_code": "683503",
        "shipper_state": "Kerala", "shipper_country": "India",
    })
    result = {"piece_weight": {}}
    unstructured._apply_model(result, "text")

    assert result["shipper"]["city"] == "KALAMASEERY"
    assert result["shipper"]["pin"] == "683503"
    # ⚠️ A state or country the document never printed is the model's reading, not a copy.
    # 🔴 LOW: the model answered "Iraq" for this shipper's country on a real run — the
    # shipment's destination, printed elsewhere on the page.
    assert result["shipper"]["state"] == {"value": "Kerala", "confidence": "low"}
    assert result["shipper"]["country"] == {"value": "India", "confidence": "low"}


# The parties' lines as the real invoice's text layer gives them (job #16), with a table cell
# on either side.
PARTIES_TEXT = """Iraq
UTIB0001647
TRAILSPEC GEARS PRIVATE LIMITED
22/702/01 - CEE PEE BUILDING
MASJID ROAD, HMT P.O,
KALAMASEERY , ERNAKULAM - 683503
GST NO : 32AATCA6213H1ZR
Date : 12/03/2026
Country of Origin of goods
India
LB05-CARRIZ-BLACK
Consignee
SILVER MOON COMMERCIAL
BROKERAG CO
Address : GARDENS WASFI
AL TAL ST.
P.O Box 9192 Amman 11191
Jordan
Delivery address/Buyer
Dr. Ahmed Neamah
"""

REAL_PARTIES = {
    "shipper_name": "TRAILSPEC GEARS PRIVATE LIMITED",
    "shipper_address": "22/702/01 - CEE PEE BUILDING",
    "shipper_city": "KALAMASEERY", "shipper_state": "ERNAKULAM",
    "shipper_post_code": "683503", "shipper_country": "INDIA",
    "consignee_name": "SILVER MOON COMMERCIAL BROKERAG CO",
    "consignee_address": "GARDENS WASFI", "consignee_city": "AMMAN", "consignee_country": "Jordan",
}


def test_the_models_address_is_kept_as_written():
    """
    🔴 GAPS #204: the coordinate-era parser read `702` in `22/702/01` as a PIN and stored the
    address as `22 01 CEE PEE BUILDING`.
    """
    import unstructured

    _with_model(dict(REAL_PARTIES))
    result = {"piece_weight": {}}
    unstructured._apply_model(result, PARTIES_TEXT)

    assert result["shipper"]["address"] == "22/702/01 - CEE PEE BUILDING"
    assert result["shipper"]["pin"] == "683503"
    assert result["shipper"]["city"] == "KALAMASEERY"


def test_a_country_printed_in_the_partys_own_lines_is_high():
    """
    🔴 GAPS #201: `Jordan` ends the consignee's own block and was still left out of the draft.
    The shipper's INDIA is printed only as the goods' origin, so it stays low.
    """
    import unstructured

    _with_model(dict(REAL_PARTIES))
    result = {"piece_weight": {}}
    unstructured._apply_model(result, PARTIES_TEXT)

    assert result["consignee"]["country"] == {"value": "Jordan", "confidence": "high"}
    assert result["shipper"]["country"] == {"value": "INDIA", "confidence": "low"}
    # A state stays low even when printed: ERNAKULAM is a district.
    assert result["shipper"]["state"] == {"value": "ERNAKULAM", "confidence": "low"}


def test_a_country_from_elsewhere_on_the_page_stays_low():
    """The model once answered the destination, Iraq, for the shipper's country."""
    import unstructured

    _with_model({**REAL_PARTIES, "shipper_country": "Iraq"})
    result = {"piece_weight": {}}
    unstructured._apply_model(result, PARTIES_TEXT)

    assert result["shipper"]["country"] == {"value": "Iraq", "confidence": "low"}


def test_a_post_code_written_in_the_partys_lines_is_taken():
    """🔴 GAPS #202: the model missed `11191`; the box number beside it is not a post code."""
    import unstructured

    _with_model(dict(REAL_PARTIES))
    result = {"piece_weight": {}}
    unstructured._apply_model(result, PARTIES_TEXT)

    assert result["consignee"]["pin"] == "11191"


def test_two_candidate_post_codes_are_not_guessed_between():
    import unstructured

    assert unstructured._written_post_code(["Amman 11191", "Tel 4567890"]) is None
    assert unstructured._written_post_code(["P.O Box 9192 Amman 11191"]) == "11191"
    assert unstructured._written_post_code(["22/702/01 - CEE PEE BUILDING", "Date : 12/03/2026"]) is None


def test_the_route_is_kept_as_written_with_its_airport_code():
    """A sea port has no airport code, so the panel shows it and does not save it."""
    import unstructured

    _with_model({"origin": "NHAVA SHEVA", "destination": "Frankfurt", "shipper_name": "X"})
    result = {"piece_weight": {}}
    unstructured._apply_model(result, "text")

    assert result["route"] == {
        "origin": "NHAVA SHEVA", "origin_code": None,
        "destination": "Frankfurt", "destination_code": "FRA",
    }
    assert result["departure"] == "NHAVA SHEVA"


def test_a_word_standing_for_absence_is_not_a_value():
    """
    🔴 Measured: gemma3:4b answered `consignee_state: "NONE"` on the real invoice. State and
    country skip the grounding check, so nothing else would have stopped it.
    """
    kept = model_extract._grounded(
        {"consignee_state": "NONE", "notify_country": "N/A", "shipper_state": "Kerala"},
        "any document text",
    )

    assert "consignee_state" not in kept
    assert "notify_country" not in kept
    assert kept["shipper_state"] == "Kerala"


def test_a_po_box_is_not_a_post_code():
    """⚠️ Measured: the model answered "P.O Box 9192" while the real post code sat beside it."""
    kept = model_extract._grounded(
        {"consignee_post_code": "P.O Box 9192", "shipper_post_code": "683503"},
        "P.O Box 9192 Amman 11191 / KALAMASEERY , ERNAKULAM - 683503",
    )

    assert "consignee_post_code" not in kept
    assert kept["shipper_post_code"] == "683503"


def test_the_digits_of_a_box_number_are_not_a_post_code_either():
    """
    ⚠️ Measured twice. Dropping "P.O Box 9192" moved the error: the next run answered "9192",
    with the real post code, 11191, on the same line.
    """
    source = "P.O Box 9192 Amman 11191"

    assert "consignee_post_code" not in model_extract._grounded({"consignee_post_code": "9192"}, source)
    assert model_extract._grounded({"consignee_post_code": "11191"}, source)["consignee_post_code"] == "11191"


def test_a_worked_out_state_survives_grounding_but_an_invented_company_does_not():
    """The exemption is exactly two fields wide."""
    source = "TRAILSPEC GEARS PRIVATE LIMITED\nKALAMASEERY , ERNAKULAM - 683503"

    kept = model_extract._grounded({
        "shipper_state": "Kerala", "shipper_country": "India",
        "shipper_name": "Globex Trading Ltd", "shipper_city": "Bengaluru",
    }, source)

    assert kept["shipper_state"] == "Kerala"
    assert kept["shipper_country"] == "India"
    assert "shipper_name" not in kept
    assert "shipper_city" not in kept


def test_dimensions_and_chargeable_weight_are_mapped():
    """The rest of the panel's groups: set only when the model found them."""
    import unstructured

    _with_model({"dimensions": "64 X 32 X 64 CM", "chargeable_weight": 420.0})
    result = {"piece_weight": {}}
    unstructured._apply_model(result, "text")

    assert result["cargo"]["dimensions"] == [{"dimension": "64X32X64", "count": 1}]
    assert result["piece_weight"]["chargeable_weight"] == 420.0


def test_a_document_gives_no_notify_party():
    """
    🔴 Not asked for (user, 2026-09-14). When it was, the model twice filed the CONSIGNEE's
    address under a notify party on an invoice that names none. A stray key is ignored.
    """
    import unstructured

    _with_model({"shipper_name": "TRAILSPEC GEARS PRIVATE LIMITED", "notify_name": "ACME CLEARING LTD"})
    result = {"piece_weight": {}}
    unstructured._apply_model(result, "Notify Party: ACME CLEARING LTD")

    assert "notify" not in result


def test_the_schema_permits_a_model_that_found_nothing():
    """⚠️ Every field is optional so a model can say "I could not read this" by omitting
    it. Forcing a field guarantees it is filled with something, and an invented consignee
    is worse than a blank one."""
    from schemas import ExtractedDocument

    # ⚠️ The cargo keys are required, so a model that found nothing says so with nulls.
    empty = ExtractedDocument.model_validate({
        "description": None, "gross_weight": None,
        "chargeable_weight": None, "dimensions": None, "origin": None, "destination": None,
    })
    assert empty.shipper_name is None


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


# ─── The real client: OpenRouter (user, 2026-09-14) ──────────────────────────


def _openrouter(handler_answers):
    """
    A local stand-in for OpenRouter. `handler_answers` is a list, one entry per request:
    a dict to answer with, or "hang" to accept the call and never answer.
    """
    import http.server
    import threading

    seen = []

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_POST(self):
            seen.append(json.loads(self.rfile.read(int(self.headers["Content-Length"]))))
            answer = handler_answers[len(seen) - 1]
            if answer == "hang":
                time.sleep(3)
                return
            if answer == "trickle":
                # What OpenRouter does while a slow model works: headers at once, then whitespace.
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                for _ in range(10):
                    self.wfile.write(b" ")
                    self.wfile.flush()
                    time.sleep(0.3)
                self.wfile.write(b"{}")
                return
            body = json.dumps(answer).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *args):
            pass

    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()

    return server, seen


def _answer(fields, cost=0.00028, provider="DeepInfra"):
    return {
        "model": "google/gemma-4-31b-it", "provider": provider,
        "choices": [{"message": {"content": json.dumps(fields)}}],
        "usage": {"prompt_tokens": 2100, "completion_tokens": 260, "cost": cost},
    }


_EMPTY_ANSWER = {k: None for k in ("description", "gross_weight", "chargeable_weight", "dimensions", "origin", "destination")}


def _with_openrouter(answers, timeout=1):
    server, seen = _openrouter(answers)
    saved = (model_extract.OPENROUTER_URL, model_extract.OPENROUTER_API_KEY, model_extract.TEXT_TIMEOUTS, model_extract.VISION_TIMEOUTS)
    model_extract.OPENROUTER_URL = f"http://127.0.0.1:{server.server_address[1]}/api/v1/chat/completions"
    model_extract.OPENROUTER_API_KEY = "test-key"
    model_extract.TEXT_TIMEOUTS = model_extract.VISION_TIMEOUTS = (timeout, timeout, timeout)
    # ⚠️ The runner stubs `available` to "no model" before every test; these test the real client.
    model_extract.available = _REAL_AVAILABLE

    def restore():
        (model_extract.OPENROUTER_URL, model_extract.OPENROUTER_API_KEY,
         model_extract.TEXT_TIMEOUTS, model_extract.VISION_TIMEOUTS) = saved
        server.shutdown()

    return seen, restore


def test_without_a_key_the_model_is_not_configured():
    saved = model_extract.OPENROUTER_API_KEY
    model_extract.OPENROUTER_API_KEY = ""
    model_extract.available = _REAL_AVAILABLE
    try:
        fields, error, usage = _REAL_EXTRACT("some document text")
    finally:
        model_extract.OPENROUTER_API_KEY = saved

    assert fields is None and usage is None
    assert error == "the model is not configured (no OPENROUTER_API_KEY)"


def test_the_request_asks_for_the_schema_and_no_data_keeping_provider():
    """🔴 An invoice carries a client's parties: no provider that keeps or trains on prompts."""
    seen, restore = _with_openrouter([_answer({**_EMPTY_ANSWER, "shipper_name": "TRAILSPEC"})])
    try:
        fields, error, usage = _REAL_EXTRACT("TRAILSPEC GEARS")
    finally:
        restore()

    request = seen[0]
    assert request["model"] == "google/gemma-4-31b-it"
    assert request["provider"]["data_collection"] == "deny"
    assert request["provider"]["require_parameters"] is True
    assert request["response_format"]["type"] == "json_schema"
    schema = request["response_format"]["json_schema"]["schema"]
    assert schema["additionalProperties"] is False
    assert set(schema["required"]) == set(schema["properties"])
    assert error is None and fields["shipper_name"] == "TRAILSPEC"
    assert usage == {"model": "google/gemma-4-31b-it", "provider": "DeepInfra", "tokens_in": 2100,
                     "tokens_out": 260, "cost_usd": 0.00028, "execution_ms": usage["execution_ms"], "attempts": 1,
                     "tier": "economy", "prompt_version": model_extract.PROMPT_VERSION}


def test_economy_first_then_the_fast_fallback_when_it_is_stuck():
    """
    🔴 The user: cheaper providers first, "but we keep fallback always". The first try carries the
    price ceiling; when it is stuck (OpenRouter does not move on SLOWNESS), the fallback has none.
    """
    seen, restore = _with_openrouter(["hang", _answer({**_EMPTY_ANSWER, "shipper_name": "TRAILSPEC"})])
    try:
        fields, error, usage = _REAL_EXTRACT("TRAILSPEC GEARS")
    finally:
        restore()

    assert seen[0]["provider"]["max_price"] == {"prompt": 0.20, "completion": 0.50}
    # Named providers, cheapest-fast first, and economy never leaves them.
    assert seen[0]["provider"]["order"] == ["CoreWeave", "Chutes", "DeepInfra", "Venice"]
    assert seen[0]["provider"]["allow_fallbacks"] is False
    assert "max_price" not in seen[1]["provider"]
    assert seen[1]["provider"]["order"] == ["ModelRun"] and seen[1]["provider"]["allow_fallbacks"] is True
    assert error is None and fields["shipper_name"] == "TRAILSPEC"
    assert usage["attempts"] == 2 and usage["tier"] == "fast"
    # Timed from the first try, because that is what the operator waited.
    assert usage["execution_ms"] >= 1000


def test_repeated_filler_lines_are_sent_once_but_every_number_stays():
    """User: "compress the input token". Colours and "Pcs" repeat; a repeated number is a different fact."""
    text = "BLACK\n26\nPcs\n  BLACK  \nTOTAL CTNS\n26\nPcs\n\n364.09\nGROSS WEIGHT\n364.09"

    assert model_extract.compact(text) == "BLACK\n26\nPcs\nTOTAL CTNS\n26\n364.09\nGROSS WEIGHT\n364.09"


def test_the_prompt_comes_from_its_file_with_a_version():
    assert "P.O Box number is NOT a post code" in model_extract.PROMPT
    assert model_extract.PROMPT.rstrip().endswith("DOCUMENT:\n{text}")
    assert "IMAGES" in model_extract.VISION_PROMPT and "{" not in model_extract.VISION_PROMPT
    assert len(model_extract.PROMPT_VERSION) == 8


def test_a_provider_kept_alive_with_whitespace_still_times_out():
    """
    🔴 Measured: economy calls ran 10-18 s past a 9 s limit, because OpenRouter sends whitespace while
    the model works and a per-read timeout never fires. The limit is on the whole try.
    """
    seen, restore = _with_openrouter(["trickle", _answer({**_EMPTY_ANSWER, "shipper_name": "TRAILSPEC"})])
    try:
        started = time.monotonic()
        fields, error, usage = _REAL_EXTRACT("TRAILSPEC GEARS")
        waited = time.monotonic() - started
    finally:
        restore()

    assert usage["tier"] == "fast" and usage["attempts"] == 2
    assert waited < 2.5, f"the first try ran {waited:.1f}s past its 1s limit"


def test_the_last_try_is_economy_by_throughput():
    seen, restore = _with_openrouter(["hang", "hang", _answer({**_EMPTY_ANSWER, "shipper_name": "TRAILSPEC"})])
    try:
        fields, error, usage = _REAL_EXTRACT("TRAILSPEC GEARS")
    finally:
        restore()

    assert seen[2]["provider"]["sort"] == "throughput" and "order" not in seen[2]["provider"]
    assert "max_price" in seen[2]["provider"]
    assert usage["tier"] == "economy" and usage["attempts"] == 3


def test_try_limits_are_read_as_three_numbers():
    import os
    os.environ["OPENROUTER_TEST_T"] = "9,12"
    try:
        assert model_extract._seconds("OPENROUTER_TEST_T", "1") == (9, 12, 12)
        assert model_extract._seconds("OPENROUTER_TEST_MISSING", "15,20,15") == (15, 20, 15)
    finally:
        del os.environ["OPENROUTER_TEST_T"]


def test_when_every_attempt_is_stuck_the_reason_says_so():
    seen, restore = _with_openrouter(["hang", "hang", "hang"])
    try:
        fields, error, usage = _REAL_EXTRACT("some document text")
    finally:
        restore()

    assert len(seen) == 3
    assert fields is None and usage is None
    assert error == "the model timed out after 1s"


def test_an_unreachable_model_says_so():
    saved = (model_extract.OPENROUTER_URL, model_extract.OPENROUTER_API_KEY)
    model_extract.OPENROUTER_URL, model_extract.OPENROUTER_API_KEY = "http://127.0.0.1:9/x", "test-key"
    model_extract.available = _REAL_AVAILABLE
    try:
        fields, error, usage = _REAL_EXTRACT("some document text")
    finally:
        model_extract.OPENROUTER_URL, model_extract.OPENROUTER_API_KEY = saved

    assert fields is None
    assert error == "the model is not reachable"


def test_a_scan_is_sent_as_page_images_with_the_same_schema():
    """Gemma 4 reads images: one model for text and scans (user, 2026-09-14)."""
    seen, restore = _with_openrouter([_answer({**_EMPTY_ANSWER, "consignee_name": "SILVER MOON"})])
    try:
        fields, error, usage = model_extract.extract_images([b"\x89PNG page1", b"\x89PNG page2"])
    finally:
        restore()

    parts = seen[0]["messages"][0]["content"]
    assert parts[0]["type"] == "text" and "IMAGES" in parts[0]["text"] and "{text}" not in parts[0]["text"]
    assert [p["type"] for p in parts[1:]] == ["image_url", "image_url"]
    assert parts[1]["image_url"]["url"].startswith("data:image/png;base64,")
    # ⚠️ Nothing to ground against on a scan, so the value is kept.
    assert fields["consignee_name"] == "SILVER MOON"


def test_a_scan_pdf_is_read_through_the_vision_path():
    import unstructured

    sent = {}

    def _images(pages):
        sent["pages"] = len(pages)
        return {"consignee_name": "SILVER MOON COMMERCIAL BROKERAG CO", "gross_weight": 364.09}, None, {"cost_usd": 0.0004}

    saved = model_extract.extract_images
    model_extract.extract_images = _images
    try:
        result = unstructured.extract_from_images(_pdf(boxes_only=True))
    finally:
        model_extract.extract_images = saved

    assert result["extraction_path"] == "vision"
    assert sent["pages"] == 1
    assert result["read_by"] == "model"
    assert result["consignee"]["name"] == "SILVER MOON COMMERCIAL BROKERAG CO"
    assert result["piece_weight"]["gross_weight"] == 364.09
    assert result["model_usage"] == {"cost_usd": 0.0004}


def test_over_the_daily_limit_the_labels_stand_and_no_model_is_called():
    calls = _with_model({"shipper_name": "unused"})

    result = extract_from_text(_pdf(INVOICE), use_model=False)

    assert calls["n"] == 0
    assert result["read_by"] == "labels"
    assert result["model_error"] == "the daily AI limit has been reached"


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
