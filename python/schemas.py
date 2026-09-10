"""
schemas.py
==========
The shape a model is allowed to return.

🔴 CONSTRAIN FIRST, VALIDATE SECOND, and the order matters (PRD §5.1). The model is
constrained to emit this schema — Ollama's `format`, Gemini's `response_schema` — and the
result is then validated here before anything reaches Laravel. Validation alone is not
enough: it DETECTS a malformed payload, it does not PREVENT one, and a model that has
already invented a consignee has done the damage whether or not we catch the JSON.

⚠️ Every field is OPTIONAL. A model that cannot find the consignee must be able to say so
by omitting it — forcing the field guarantees it is filled with something, and an invented
consignee on a waybill is worse than a blank one an operator notices.
"""

from typing import List, Optional

from pydantic import BaseModel, Field


class Party(BaseModel):
    """A shipper or consignee, as printed."""

    name: Optional[str] = None
    address: Optional[str] = None
    # ⚠️ NOT parsed into city/state/postcode here. `transform_address_box()` already owns
    # that, and two address parsers in one pipeline drift.
    account_number: Optional[str] = None


class Cargo(BaseModel):
    description: Optional[str] = None
    pieces: Optional[int] = Field(default=None, ge=0)
    gross_weight: Optional[float] = Field(default=None, ge=0)
    chargeable_weight: Optional[float] = Field(default=None, ge=0)


class Lane(BaseModel):
    """Origin and destination as WRITTEN — codes are resolved downstream, not guessed."""

    origin: Optional[str] = None
    destination: Optional[str] = None


class ExtractedDocument(BaseModel):
    """
    What a model may return for one unstructured document.

    ⚠️ Deliberately NOT the `/extract` region vocabulary. This is the model's output, and
    mapping it onto `shipper` / `consignee` / `piece_weight` happens in `unstructured.py`
    where the coordinate path's own transforms are applied — so both endpoints still emit
    the same shapes and `OcrUploadModal.vue` still needs one mapper.
    """

    shipper: Optional[Party] = None
    consignee: Optional[Party] = None
    lane: Optional[Lane] = None
    cargo: Optional[Cargo] = None
    awb_number: Optional[str] = None

    # 🔴 The model's own report of what it could not read. An empty list from a document
    # it mangled is a lie, but the alternative — no channel to say "I was unsure" — makes
    # every field look equally trustworthy.
    unreadable: List[str] = Field(default_factory=list)
