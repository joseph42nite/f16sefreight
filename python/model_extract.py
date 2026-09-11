"""
model_extract.py
================
The model step: messy document text in, structured fields out.

🔴 THE MODEL READS AN UNSTRUCTURED DOCUMENT; LABELS ARE ONLY THE FALLBACK. Coordinates still
read the AWB and regex still reads a lane out of a mail. But an invoice's text comes out of
the PDF in draw order, not reading order: on the first real one, the exporter's name sat
eight lines ABOVE the word "Exporter", and the line straight after that label was the invoice
number. No label rule survives that, and coordinates change with every layout. Matching a
value to its label by meaning is the job only a model can do.

🔴 CONSTRAIN, THEN VALIDATE (PRD §5.1). `format` is the JSON schema Ollama must emit
against; `ExtractedDocument` then validates what came back. Validation alone detects a
malformed payload, it does not prevent one.

⚠️ FAILURE IS NOT AN EXCEPTION, AND IT IS NOT SILENT EITHER. If the model is down, slow, or
returns something unusable, `extract()` says which. The caller keeps the label reading and
passes the reason on, because a fallback nobody can see looks exactly like a model that read
the page badly.
"""

import json
import logging
import os
import socket
from typing import Any, Dict, Optional, Tuple

import urllib.error
import urllib.request

from schemas import ExtractedDocument

logger = logging.getLogger("model_extract")

# PRD §9.5 puts Ollama on the same host as FastAPI, so the default is loopback.
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434")

# 🔴 4B, NOT 1B, and that was measured on a real invoice. gemma3:1b failed three prompts three
# different ways: it returned the LABELS as company names ("Exporter", "Consignee") and a
# colour as a port. gemma3:4b read the shipper, the consignee, the weights and the total
# pieces correctly. A 1B model cannot bind values to labels once reading order is gone.
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "gemma3:4b")

# 🔴 THE SINGLE BIGGEST LEVER ON LATENCY. Cold-loading gemma3:4b took 63-153s on the laptop; a
# resident model answers immediately. So it stays loaded for ten minutes after each use.
#
# ⚠️ NOT '-1' (forever) by default. On a 9 GB laptop '-1' pinned whichever model ran last and
# starved the next: gemma3:1b sat resident while 4b could not load at all. A dedicated
# Ollama host (PRD §9.5) should set OLLAMA_KEEP_ALIVE=-1 explicitly.
_KEEP_ALIVE_RAW = os.environ.get("OLLAMA_KEEP_ALIVE", "10m")


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

# ⚠️ The document must fit INSIDE the context along with the instructions and the answer.
# Table text tokenises badly (the two-page invoice ran about 2.4 characters per token), so
# 6,000 characters plus the prompt and a 512-token answer stays under 4,096. A prompt that
# overflows gets cut, and what gets cut can be the instructions.
MAX_DOCUMENT_CHARS = 6000
MAX_ANSWER_TOKENS = 512

# 🔴 Ten minutes. gemma3:4b took 378s on a two-page invoice on the laptop, so the old 60s cap
# timed out every real document and it quietly fell back to labels.
TIMEOUT_SECONDS = int(os.environ.get("OLLAMA_TIMEOUT", "600"))

# 🔴 NO ORDINAL RULE. The previous prompt said "the FIRST company is the SHIPPER, the SECOND
# is the CONSIGNEE". On the first real invoice the second company was AXIS BANK LIMITED, from
# the bank-details block: positional reasoning moved into the prompt, and just as wrong.
#
# ⚠️ The jumbled-order warning and "a label is never a value" are what this prompt adds, and
# it is the prompt gemma3:4b was measured with. Without them 1B returned "Exporter" as the
# shipper's name.
PROMPT = """You are reading a freight document (commercial invoice, packing list or airway bill).

The text was extracted from a TABLE, so it is JUMBLED: a value may appear BEFORE or AFTER
its own label, and unrelated cells are interleaved. Match each value to its label by
MEANING, not by position.

Never return a label as a value. "Exporter", "Consignee", "Address :", "Port of Loading"
and "Description of Goods" are LABELS.

Fields:
  shipper_name      company SENDING the goods (labelled Exporter or Shipper). A company
                    name, usually containing LIMITED, LTD, PVT, CO, GMBH or INC.
  shipper_address   that company's street address
  consignee_name    company RECEIVING the goods (labelled Consignee)
  consignee_address that company's street address
  origin            port or airport of loading
  destination       port or airport of discharge
  transport_mode    SEA or AIR, as the document states it
  description       what the goods are, in words
  pieces            TOTAL quantity for the whole shipment, not a single table row
  gross_weight      total gross weight
  awb_number        the air waybill number, if there is one

Ignore the price table, SKU codes and colour names. A colour or a product code is never a
port, a company or a description.

Copy text exactly as written. Omit any field you cannot find. Do not invent a value.

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


def extract(text: str) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    """
    Ask the model for structured fields.

    Returns `(fields, None)` on success, or `(None, reason)` when the model is unreachable,
    too slow, or returns something that does not survive validation. The reason is written
    for the operator, because the caller shows it.
    """
    if not text.strip():
        return None, "the document has no text for the model to read"

    if len(text) > MAX_DOCUMENT_CHARS:
        logger.warning(f"document is {len(text)} chars; the model reads the first {MAX_DOCUMENT_CHARS}")

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": PROMPT.format(text=text[:MAX_DOCUMENT_CHARS]),
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
            # A ceiling on the answer. A model that starts repeating itself otherwise runs
            # until the timeout.
            "num_predict": MAX_ANSWER_TOKENS,
        },
    }

    request = urllib.request.Request(
        f"{OLLAMA_URL}/api/generate",
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
    )

    timed_out = f"the model timed out after {TIMEOUT_SECONDS}s"

    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            body = json.loads(response.read())
    # ⚠️ Both names. `socket.timeout` only became an alias of TimeoutError in Python 3.10, and
    # the host test runner is 3.9: catching one would report a timeout as "not reachable".
    except (TimeoutError, socket.timeout):
        logger.warning(timed_out)
        return None, timed_out
    except urllib.error.HTTPError as e:
        logger.warning(f"model failed: HTTP {e.code}")
        return None, f"the model failed (HTTP {e.code})"
    except urllib.error.URLError as e:
        if isinstance(e.reason, (TimeoutError, socket.timeout)):
            logger.warning(timed_out)
            return None, timed_out

        logger.warning(f"model not reachable: {e}")
        return None, "the model is not reachable"
    except json.JSONDecodeError as e:
        logger.warning(f"model response was not JSON: {e}")
        return None, "the model returned something unreadable"
    except Exception as e:
        logger.warning(f"model not reachable: {e}")
        return None, "the model is not reachable"

    raw = body.get("response", "")

    try:
        parsed = ExtractedDocument.model_validate_json(raw).model_dump(exclude_none=True)
    except Exception as e:
        # ⚠️ Logged with the payload, because "the model returned something invalid" is
        # not actionable and "it returned this" is.
        logger.warning(f"model output failed validation: {e} | raw={raw[:300]}")
        return None, "the model returned something unreadable"

    return _grounded(parsed, text), None


def _grounded(parsed: Dict[str, Any], source: str) -> Dict[str, Any]:
    """
    Drop any text the model returned that is not actually in the document.

    🔴 MEASURED, NOT PRECAUTIONARY. Told "never invent a value", a 1B model answered
    `awb_number: "Not specified"` — a literal string standing for absence, in a field that
    would have gone onto a waybill. Told nothing, it put the cargo line in `destination`.
    The instruction is not the safeguard; this is.

    ⚠️ It catches INVENTION, not MISPLACEMENT. "12 cartons / 480.5 kg" really is in the
    document, so a value stuffed into the wrong field survives this check — which is why
    every extracted field reaches the operator for checking rather than as fact. On the
    first real invoice the misplaced values were the lane: the discharge port came back
    as the origin, and every one of them really was in the document.
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
