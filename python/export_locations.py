#!/usr/bin/env python3
"""
export_locations.py
===================
Emit AIRPORT_IATA_MAP from extract_awb_new.py as JSON, for loading into the
`locations` table.

WHY THIS EXISTS
───────────────
The map is ~8,400 name→IATA pairs and it lives in the PDF extractor because that
is where it was needed first. PHP needs the same lookup to read a lane out of an
enquiry mail, and it must NOT get there by calling this service per message —
that is an HTTP round trip on every inbound mail, which is both slow and a
dependency the mail pipeline should not have.

So the data is exported ONCE into `locations`, and PHP resolves with a SQL
lookup. This script is run when the map changes, not when mail arrives.

    python3 python/export_locations.py > storage/app/locations.json

READ, NEVER IMPORT
──────────────────
The map is parsed out of the source with `ast`, not imported. Importing
extract_awb_new.py pulls in its whole dependency tree — OCR libraries included —
to read one dictionary, and would fail on any machine that has the map but not
the extractor's environment.
"""

import ast
import json
import sys
from pathlib import Path

SOURCE = Path(__file__).with_name("extract_awb_new.py")
MAP_NAME = "AIRPORT_IATA_MAP"


def load_map(path: Path) -> dict:
    """Pull one dict literal out of the module without executing it."""
    tree = ast.parse(path.read_text(encoding="utf-8"))

    for node in tree.body:
        if not isinstance(node, ast.Assign):
            continue
        for target in node.targets:
            if isinstance(target, ast.Name) and target.id == MAP_NAME:
                return ast.literal_eval(node.value)

    raise SystemExit(f"{MAP_NAME} not found in {path}")


def main() -> None:
    raw = load_map(SOURCE)

    # One row per name. The same IATA code appears under several names — "bombay"
    # and "mumbai" are both BOM — and every one of them is a spelling a client
    # might use, so none are collapsed away.
    rows = [
        {"destination": name.strip(), "iata_code": code.strip().upper()}
        for name, code in raw.items()
        if name and code and len(code.strip()) == 3
    ]

    json.dump(rows, sys.stdout, ensure_ascii=False)
    print(file=sys.stderr)
    print(f"{len(rows)} locations exported", file=sys.stderr)


if __name__ == "__main__":
    main()
