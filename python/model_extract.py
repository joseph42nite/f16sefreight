"""
model_extract.py
================
The model step: messy document text in, structured fields out.

🔴 THIS IS THE ONLY PART OF THE PIPELINE A MODEL DOES. Everything else is deterministic and
should stay that way — coordinates read the AWB, regex reads a lane out of a mail, label
anchoring reads a labelled invoice. The model earns its place on exactly one question that
none of those can answer: *which of the three addresses on this page is the consignee?*
Regex needs an enumerable set of patterns, and document variety across thousands of
shippers is not enumerable.

🔴 CONSTRAIN, THEN VALIDATE (PRD §5.1). `format` is the JSON schema Ollama must emit
against; `ExtractedDocument` then validates what came back. Validation alone detects a
malformed payload, it does not prevent one.

⚠️ FAILURE IS NOT AN EXCEPTION HERE. If the model is down, slow, or returns something
unusable, the caller keeps the label-anchored result it already has. A document read
imperfectly is worth more than a 500, and the operator can see and fix the fields either
way.
"""

import json
import logging
import os
from typing import Any, Dict, Optional

import urllib.error
import urllib.request

from schemas import ExtractedDocument

logger = logging.getLogger("model_extract")

# ⚠️ Configurable because the model WILL change — a 1B on a laptop, E4B on the server.
# PRD §9.5 puts Ollama on the same host as FastAPI, so the default is loopback.
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "gemma3:1b")

# 🔴 THE SINGLE BIGGEST LEVER ON LATENCY. Cold-loading weights from disk costs 10-60s for
# a multi-GB model; a resident one answers immediately. '-1' keeps it loaded indefinitely,
# which is right for a server that will be asked again within minutes.
#
# ⚠️ It is also the reason the model must NOT be the largest that technically fits: a model
# that gets evicted under memory pressure pays the cold load on every single request.
_KEEP_ALIVE_RAW = os.environ.get("OLLAMA_KEEP_ALIVE", "-1")


def _keep_alive(value: str):
    """
    Ollama accepts a NUMBER of seconds or a duration STRING with a unit ("10m").

    🔴 It does not accept a numeric string. Sending `"-1"` returns
    `400 time: missing unit in duration "-1"` — the value is parsed as a duration, the unit
    is missing, and the whole request is rejected. Every call failed with the model sitting
    right there, loaded and idle.

    ⚠️ Caught only by calling a real Ollama. A stub accepts whatever it is handed, which is
    exactly the class of bug a stub cannot find.
    """
    try:
        return int(value)
    except (TypeError, ValueError):
        # A unit-bearing string like "10m" — hand it through untouched.
        return value


OLLAMA_KEEP_ALIVE = _keep_alive(_KEEP_ALIVE_RAW)

# A freight document is short. The default context is far larger than needed and every
# unused token is memory the model holds for nothing.
NUM_CTX = int(os.environ.get("OLLAMA_NUM_CTX", "4096"))

TIMEOUT_SECONDS = int(os.environ.get("OLLAMA_TIMEOUT", "60"))

# 🔴 THE ROLE HINT IS LOAD-BEARING, and that was measured. With a generic "extract what is
# written" instruction a 1B model returned the cargo and left BOTH PARTIES EMPTY — the same
# model, asked in prose who the shipper was, answered correctly. It can read the document;
# it could not tell which block was which without being told the convention.
#
# ⚠️ First-is-shipper is the layout of a freight document, not a guess about this one. Where
# a document labels its parties, label anchoring has already read them and the model is
# never asked.
PROMPT = """This is a freight document — a commercial invoice, packing list or airway bill.

The FIRST company and address is the SHIPPER (sender).
The SECOND company and address is the CONSIGNEE (receiver).

Fill every field you can find. Copy the text exactly as written.
If a field is genuinely not in the document, omit it.

An invented shipper is worse than a missing one.

DOCUMENT:
{text}
"""


def available() -> bool:
    """Whether a model is reachable. Cheap, and never raises."""
    try:
        with urllib.request.urlopen(f"{OLLAMA_URL}/api/tags", timeout=3) as response:
            return response.status == 200
    except Exception:
        return False


def extract(text: str) -> Optional[Dict[str, Any]]:
    """
    Ask the model for structured fields.

    Returns the validated payload, or None when the model is unreachable, too slow, or
    returns something that does not survive validation — in every one of those cases the
    caller keeps what it already had.
    """
    if not text.strip():
        return None

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": PROMPT.format(text=text[:12000]),
        "stream": False,
        # 🔴 The schema is ENFORCED by the runtime, not requested in the prompt. A prompt
        # asking for JSON gets JSON most of the time; `format` gets it every time.
        "format": ExtractedDocument.model_json_schema(),
        "keep_alive": OLLAMA_KEEP_ALIVE,
        "options": {
            "num_ctx": NUM_CTX,
            # Deterministic: the same document must extract the same way twice, or an
            # operator who re-runs an extraction cannot tell a fix from a coin flip.
            "temperature": 0,
        },
    }

    request = urllib.request.Request(
        f"{OLLAMA_URL}/api/generate",
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
    )

    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            body = json.loads(response.read())
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
        logger.warning(f"model unreachable or unreadable: {e}")
        return None

    raw = body.get("response", "")

    try:
        parsed = ExtractedDocument.model_validate_json(raw).model_dump(exclude_none=True)
    except Exception as e:
        # ⚠️ Logged with the payload, because "the model returned something invalid" is
        # not actionable and "it returned this" is.
        logger.warning(f"model output failed validation: {e} | raw={raw[:300]}")
        return None

    return _grounded(parsed, text)


def _grounded(parsed: Dict[str, Any], source: str) -> Dict[str, Any]:
    """
    Drop any text the model returned that is not actually in the document.

    🔴 MEASURED, NOT PRECAUTIONARY. Told "never invent a value", a 1B model answered
    `awb_number: "Not specified"` — a literal string standing for absence, in a field that
    would have gone onto a waybill. Told nothing, it put the cargo line in `destination`.
    The instruction is not the safeguard; this is.

    ⚠️ It catches INVENTION, not MISPLACEMENT. "12 cartons / 480.5 kg" really is in the
    document, so a value stuffed into the wrong field survives this check — which is why
    the caller consumes only the fields the model is reliable on, and why every extracted
    field reaches the operator marked for checking rather than as fact.
    """
    haystack = _comparable(source)

    clean = {}

    for key, value in parsed.items():
        if not isinstance(value, str) or not value.strip():
            clean[key] = value
            continue

        if _comparable(value) in haystack:
            clean[key] = value
        else:
            logger.info(f"dropped ungrounded {key}={value!r} — not present in the document")

    return clean


def _comparable(text: str) -> str:
    """
    Letters and digits only, lower case.

    🔴 PUNCTUATION AND WHITESPACE ARE STRIPPED, and that is not laziness. A PDF gives the
    address on three lines; the model returns it on one, joined with a comma the document
    does not contain. Comparing on whitespace alone rejected every correctly-read address
    for a single added comma — the safeguard firing on the values it was meant to protect.

    ⚠️ It still catches what it is for. An invented company name shares no run of letters
    with the page, and "Not specified" does not appear on an invoice.
    """
    return "".join(c for c in text.lower() if c.isalnum())
