"""
Table-driven tests for the coordinate path's transforms in extract_awb_new.py.

The 2026-11-10 audit (§7) found this path had no tests and returned confidently wrong values: KOCHI as an airport in
Japan, "176 1234 5678" as AWB 176-5678, the MAY of a date as an airport. Each table below is "what the box says" →
"what must come out", so a new spelling seen on a real waybill is one more row.

Runnable with plain `python3 test_awb_transforms.py`, like test_unstructured.py — pytest is not in requirements.txt.
"""

import ast
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import extract_awb_new as awb
from iata_cities import CITY_IATA


def _check(function, table):
    wrong = [f"{given!r}: got {function(given)!r}, want {want!r}" for given, want in table if function(given) != want]
    assert not wrong, "; ".join(wrong)


# ── Airports ─────────────────────────────────────────────────────────────────────────────────────────────────────────

def test_a_city_resolves_to_its_gateway_airport():
    _check(awb.resolve_iata, [
        ("KOCHI", "COK"), ("COCHIN", "COK"), ("TRIVANDRUM", "TRV"), ("CALICUT", "CCJ"), ("KOLKATA", "CCU"),
        ("LONDON", "LHR"), ("NEW YORK", "JFK"), ("MUMBAI", "BOM"), ("DUBAI", "DXB"), ("TOKYO", "NRT"),
        ("JEDDAH", "JED"), ("DHAKA", "DAC"), ("MANILA", "MNL"), ("ATHENS", "ATH"), ("BERLIN", "BER"),
    ])


def test_form_words_around_the_city_are_ignored():
    _check(awb.resolve_iata, [
        ("Airport of Departure KOCHI", "COK"),
        ("Airport of Destination  LONDON", "LHR"),
        ("COK COCHIN", "COK"),
        ("  kochi  ", "COK"),
    ])


def test_a_code_stays_the_code_it_is():
    # 46 real codes used to be read as an airport NAME and come back as a different airport.
    _check(awb.resolve_iata, [
        ("COK", "COK"), ("DXB", "DXB"), ("LHR", "LHR"), ("KOL", "KOL"), ("BAY", "BAY"), ("AIR", "AIR"),
        ("cok", "COK"),
    ])

    names, codes, _ = awb._iata_index()
    changed = [code for code in sorted(codes) if code.lower() not in CITY_IATA and awb.resolve_iata(code) != code]
    assert not changed, f"codes that resolve to another airport: {changed}"


def test_a_longer_airport_name_beats_the_city_inside_it():
    _check(awb.resolve_iata, [("LONDON HEATHROW", "LHR"), ("LONDON GATWICK", "LGW")])


def test_an_unknown_place_comes_back_as_written():
    _check(awb.resolve_iata, [("XYZVILLE", "XYZVILLE"), ("", "")])


def test_the_lookup_gives_what_the_old_scan_gave_for_every_airport_name():
    """The dictionary lookup replaced 8,383 regex searches; for names the city table does not own it must agree."""
    import re

    def old(text):
        normalized = text.strip().lower()
        for key in sorted(awb.AIRPORT_IATA_MAP, key=len, reverse=True):
            if re.search(rf"\b{re.escape(key.lower().strip())}\b", normalized):
                return awb.AIRPORT_IATA_MAP[key]
        return text.strip().upper()

    sample = [name for i, name in enumerate(awb.AIRPORT_IATA_MAP) if i % 97 == 0]
    wrong = []
    for name in sample:
        if len(name.strip()) == 3 or any(re.search(rf"\b{re.escape(city)}\b", name.lower()) for city in CITY_IATA):
            continue
        for text in (name, f"xx {name} yy"):
            if awb.resolve_iata(text) != old(text):
                wrong.append(text)
    assert not wrong, f"differs from the old scan: {wrong[:5]}"


def test_every_city_code_is_three_capital_letters_and_every_key_lower_case():
    bad = [k for k, v in CITY_IATA.items() if k != k.lower().strip() or len(v) != 3 or not v.isupper()]
    assert not bad, bad


# ── AWB number ───────────────────────────────────────────────────────────────────────────────────────────────────────

def test_awb_number():
    _check(awb.transform_awb_number, [
        ("176-12345678", "176-12345678"),
        ("176 1234 5678", "176-12345678"),      # was 176-5678
        ("176 12345678", "176-12345678"),
        ("17612345678", "176-12345678"),
        ("176-1234 5678", "176-12345678"),
        ("176 COK 12345678", "176-12345678"),
        ("176 COK 1234 5678", "176-12345678"),
        ("AWB 176-12345678", "176-12345678"),
        ("", ""),
    ])


# ── Pieces and weight ────────────────────────────────────────────────────────────────────────────────────────────────

def test_piece_weight():
    row = awb.transform_piece_weight("10 250.5 K Q 300 12.5 3750")
    assert row == {"no_of_pieces": 10, "gross_weight": 250.5, "rate_class": "K Q", "chargeable_weight": 300.0,
                   "rate": 12.5, "total_charge": 3750.0}, row

    assert awb.transform_piece_weight("5 1,250.50 K N 1,250.5 10 12,505")["gross_weight"] == 1250.5


def test_a_stray_nan_or_inf_is_a_word_not_a_weight():
    for text in ("10 NAN K Q 100 5 500", "10 INF K", "NAN NAN NAN", "10 250 K INFINITY 5"):
        row = awb.transform_piece_weight(text)
        # allow_nan=False is what a strict JSON encoder does: NaN in the answer was a 500.
        json.dumps(row, allow_nan=False)


# ── Flight routing ───────────────────────────────────────────────────────────────────────────────────────────────────

def _routing(text):
    block = awb.transform_flight_routing(text)[0]
    return block["transit_airports"], [f["flight_number"] for f in block["flights"]]


def test_the_month_of_a_date_is_not_an_airport():
    assert _routing("DXB EK 501 12-MAY-2026") == (["DXB"], ["EK501"])
    assert _routing("COK DXB EK 531 03-Jun") == (["COK", "DXB"], ["EK531"])


def test_carriers_with_a_digit_are_flights():
    assert _routing("COK DXB\n6E 1403 12-May\nG9 427 13-May") == (["COK", "DXB"], ["6E1403", "G9427"])
    assert _routing("COK DXB 6E 1403 12-May") == (["COK", "DXB"], ["6E1403"])
    assert _routing("BOM SHJ G9-406 01-JAN-2026") == (["BOM", "SHJ"], ["G9406"])


def test_ordinary_flights_still_read():
    assert _routing("BOM EK501 12-MAY-2026 DXB EK001 13-MAY-2026 LHR") == (["BOM", "DXB", "LHR"], ["EK501", "EK001"])
    assert _routing("TO BY FIRST CARRIER\nDXB EK 501 12-MAY") == (["DXB"], ["EK501"])


# ── Dimensions and HS codes ──────────────────────────────────────────────────────────────────────────────────────────

def _dims(text):
    return [(d["dimension"], d["count"]) for d in awb.extract_dimensions(text)]


def test_dimensions():
    _check(_dims, [
        ("DIMS 36X32X25=125 50X30X47=18", [("36X32X25", 125), ("50X30X47", 18)]),
        ("DIM(CMS): 59X38X15 (17), 59X38X10 (3)", [("59X38X15", 17), ("59X38X10", 3)]),
        ("59X38X15 (17) 59X38X10 (3)", [("59X38X15", 17), ("59X38X10", 3)]),      # was a phantom third entry
        ("2/100X50X40", [("100X50X40", 2)]),
        ("100X50X40/2 60X40X30/3", [("100X50X40", 2), ("60X40X30", 3)]),
        ("(3) 40x30x20 (2) 50x40x30", [("40X30X20", 3), ("50X40X30", 2)]),
        ("DIMS: 60*40*30*5", [("60X40X30", 5)]),
        ("10 X 20 X 30", [("10X20X30", 1)]),
        ("120.5X80X60.5 (2)", [("120.5X80X60.5", 2)]),                            # was 5X80X60
        ("64X32X64", [("64X32X64", 1)]),
        ("no dimensions here", []),
    ])


def test_hs_codes():
    _check(awb.extract_hs_codes, [
        ("HS CODE 84713000 TEL 04842345678 INV 123456 PIN 682001", ["84713000"]),
        ("HS CODE: 8471.30.00, 84733099", ["84713000", "84733099"]),
        ("HSN: 620520", ["620520"]),
        ("GARMENTS 620520 COTTON", ["620520"]),      # unlabelled: as before
        ("GARMENTS", []),
    ])


# ── Addresses ────────────────────────────────────────────────────────────────────────────────────────────────────────

def test_the_country_is_the_one_written_last():
    _check(awb.extract_country, [
        ("INDIA GATE FOODS LLC, AL QUOZ, DUBAI, UAE", "UAE"),
        ("ABC TRADING PH: 0484 2345678 KOCHI KERALA INDIA", "INDIA"),
        ("ABC TRADING, KOCHI, KERALA PH: 0484 2345678", None),          # PH is a phone label here
        ("XYZ CORP, MAKATI, MANILA, PH", "PHILIPPINES"),
        ("XYZ LTD, 12 HIGH ST, LONDON, UK", "UNITED KINGDOM"),
    ])


def test_a_phone_number_is_not_a_pin_and_a_word_is_not_a_phone_label():
    assert awb.extract_pin("ABC TRADING PH: 0484 2345678 KOCHI 682001 KERALA INDIA", "INDIA") == "682001"
    assert awb.extract_pin("ABC TRADING PH: 0484 2345678 KOCHI KERALA", None) is None
    assert awb.extract_phone("ABC TRADING PH: 0484 2345678 KOCHI") == "0484 2345678"
    assert awb.extract_phone("GRAND HOTEL 12345 MG ROAD") is None


# ── The tables themselves ────────────────────────────────────────────────────────────────────────────────────────────

def test_no_country_is_defined_twice():
    """A second "BRAZIL": {...} in the same dict silently replaces the first; Python does not complain."""
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "geo_constants.py")
    seen, twice = set(), []
    for node in ast.walk(ast.parse(open(path, encoding="utf-8").read())):
        if isinstance(node, ast.Dict):
            keys = [k.value for k in node.keys if isinstance(k, ast.Constant) and isinstance(k.value, str)]
            if "country_patterns" in keys:
                continue
            for key in keys:
                if key.isupper() and key in seen:
                    twice.append(key)
                seen.add(key) if key.isupper() else None
    assert not twice, f"defined twice: {twice}"


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
        except Exception as e:  # a crash is a failure too, and the rest should still run
            failed += 1
            print(f"  FAIL {test.__name__}: {type(e).__name__}: {e}")

    print(f"\n{len(tests) - failed} passed, {failed} failed")
    sys.exit(1 if failed else 0)
