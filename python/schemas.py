"""
schemas.py
==========
The shape a model is allowed to return.

🔴 CONSTRAIN FIRST, VALIDATE SECOND, and the order matters (PRD §5.1). The model is
constrained to emit this schema — Ollama's `format`, Gemini's `response_schema` — and the
result is then validated here. Validation alone DETECTS a malformed payload, it does not
PREVENT one, and a model that has already invented a consignee has done the damage whether
or not the JSON parses.

🔴 FLAT ON PURPOSE, and this was measured rather than assumed. An earlier version nested
`Party`, `Cargo` and `Lane` as sub-models, which is the natural Python shape — but Pydantic
emits those as `$ref` pointers into `$defs`, and against a 1B model that returned a VALID,
SCHEMA-CONFORMANT, COMPLETELY EMPTY document every time. The same model, same document,
same prompt, with the fields flattened: every field filled correctly. A small model can
follow a shape it can see and not one it has to dereference.

⚠️ Every field is OPTIONAL. A model that cannot find the consignee must be able to say so
by omitting it — forcing the field guarantees it is filled with something, and an invented
consignee on a waybill is worse than a blank one an operator notices.

🔴 NO FREE-FORM LIST FIELDS. This used to carry `unreadable: List[str]`, the model's own report
of what it could not read. On a real two-page invoice gemma3:1b spent 242 seconds filling it
with price-table numbers and repeated SKU codes, ran out of answer budget mid-string, and the
whole reply failed validation. Without it the same document took 42 seconds and came back as
valid JSON. An unbounded list is a loop a small model can fall into and never leave.
"""

from typing import Optional

from pydantic import BaseModel, Field


class ExtractedDocument(BaseModel):
    """
    What a model may return for one unstructured document.

    ⚠️ Deliberately NOT the `/extract` region vocabulary. This is the model's output;
    mapping it onto `shipper` / `consignee` / `cargo` happens in `unstructured.py`, where
    the coordinate path's own transforms are applied — so both endpoints still emit the
    same shapes and `OcrUploadModal.vue` still needs one mapper.
    """

    shipper_name: Optional[str] = None
    shipper_address: Optional[str] = None

    consignee_name: Optional[str] = None
    consignee_address: Optional[str] = None

    description: Optional[str] = None
    pieces: Optional[int] = Field(default=None, ge=0)
    gross_weight: Optional[float] = Field(default=None, ge=0)

    # As WRITTEN. Resolving a name to an IATA code is `locations`' job, not the model's —
    # a model asked for a code will produce a plausible one for a city it has never seen.
    origin: Optional[str] = None
    destination: Optional[str] = None

    # As written: "SEA", "BY SEA", "AIR". It decides how the lane is read, because an
    # airport has an IATA code and a seaport does not (air = IATA, sea = UN/LOCODE).
    transport_mode: Optional[str] = None

    awb_number: Optional[str] = None
