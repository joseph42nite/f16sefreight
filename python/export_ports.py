#!/usr/bin/env python3
"""
export_ports.py
===============
Emit the UN/LOCODE transport nodes as JSON, for loading into the `ports` table.

    python3 python/export_ports.py > storage/app/ports.json
    php artisan db:seed --class=PortSeeder

WHY THIS EXISTS
───────────────
`locations` names AIRPORTS by IATA code and nothing else. Sea routing quotes
POR/POL/POD/DEL as five-character LOCODEs (PRD.md §5.2.7), and a three-letter
code cannot address DEHAM — so a sea lane read as "INMAA → SGSIN" had no names
behind it and the profitability report printed bare codes (GAPS.md #375).

WHAT IS LOADED, AND WHAT IS NOT
───────────────────────────────
UN/LOCODE carries ~116,000 entries and most of them are villages: 90,473 are
road points with no other function. Loading those would drown every picker in
places no forwarder has ever quoted. Only actual freight nodes are kept, read
off the 8-character Function mask:

    position 1  '1'  seaport          -> sea   (17,520)
    position 4  '4'  airport          -> air   ( 7,246)
    position 8  'B'  border crossing  -> land  (   392)

A location that is both a seaport and an airport is ONE row — the table is keyed
on the LOCODE — and it is filed as `sea`, because the air side already resolves
through `locations`.

⚠️ Status `XX` means "entry will be removed" and is skipped. Every other status
loads as ACTIVE, `QQ` included: `QQ` means the NAME is under query, not that the
port is shut, and Jebel Ali — one of the busiest ports in the world, and already
on live enquiries — carries it. `is_active` exists for a port that has closed, so
inferring it from a naming query would drop working ports out of the pickers.

⚠️ NameWoDiacritics, not Name: this is the diacritic-free form UN/LOCODE itself
uses in EDI, and these names go onto customs paperwork.
"""

import csv
import io
import json
import sys
import urllib.request

# The Frictionless mirror of the UNECE list, which publishes it as one CSV rather
# than as three zipped files per revision.
SOURCE = "https://raw.githubusercontent.com/datasets/un-locode/main/data/code-list.csv"


def kind(function):
    """Which of the three node types this is, or None when it is not a freight node.

    ⚠️ No `str | None` annotation: this box runs Python 3.9, where that syntax is a
    TypeError at import rather than a warning.
    """
    if function[:1] == "1":
        return "sea"
    if function[3:4] == "4":
        return "air"
    if function[7:8] == "B":
        return "land"

    return None


def main():
    with urllib.request.urlopen(SOURCE, timeout=120) as response:
        body = response.read().decode("utf-8")

    nodes, seen = [], set()

    for row in csv.DictReader(io.StringIO(body)):
        location = (row.get("Location") or "").strip()
        country = (row.get("Country") or "").strip()

        # Country header rows carry no Location; `XX` is on its way out of the list.
        if len(location) != 3 or len(country) != 2 or row.get("Status") == "XX":
            continue

        node_type = kind(row.get("Function") or "")
        locode = country + location

        if node_type is None or locode in seen:
            continue

        seen.add(locode)
        nodes.append({
            "locode": locode,
            "port_name": (row.get("NameWoDiacritics") or row.get("Name") or location).strip()[:100],
            "country_code": country,
            "port_type": node_type,
        })

    json.dump(nodes, sys.stdout, ensure_ascii=False)
    print(f"{len(nodes)} nodes written.", file=sys.stderr)


if __name__ == "__main__":
    main()
