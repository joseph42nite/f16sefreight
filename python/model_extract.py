"""
model_extract.py
================
The model step: document text (or page images) in, structured fields out.

🔴 GEMMA 4 31B THROUGH OPENROUTER, not a model we host (user, 2026-09-14). Self-hosted
gemma3:4b took 3-10 minutes per invoice on the laptop, and the planned `t4g.large` has no GPU,
so it would have been slower still. A GPU host is too expensive to keep idle; OpenRouter charges
per call — about ₹0.03 an invoice — and the same model reads scans, because it takes images.

🔴 CONSTRAIN, THEN VALIDATE (PRD §5.1). `response_format` is a strict JSON schema the provider
must emit against; `ExtractedDocument` then validates what came back. Validation alone detects a
malformed payload, it does not prevent one.

⚠️ "STUCK" IS OUR TIMEOUT, NOT OPENROUTER'S. OpenRouter moves to another provider on an error,
a rate limit or downtime — not on a provider that is merely slow. So each attempt has its own
short timeout, and the next attempt asks OpenRouter to route differently (latency, then
throughput, then price), which lands on a different provider.

⚠️ FAILURE IS NOT AN EXCEPTION, AND IT IS NOT SILENT EITHER. If every attempt fails, `extract()`
says why. The caller keeps the label reading and passes the reason on.
"""

import base64
import json
import logging
import os
import re
import socket
import time
from typing import Any, Dict, List, Optional, Tuple

import urllib.error
import urllib.request

from schemas import ExtractedDocument

logger = logging.getLogger("model_extract")

OPENROUTER_URL = os.environ.get("OPENROUTER_URL", "https://openrouter.ai/api/v1/chat/completions")

# 🔐 From the environment only — never logged, never returned.
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")

# One model for text and for scans (user, 2026-09-14): Gemma 4 31B reads images too.
MODEL = os.environ.get("OPENROUTER_MODEL", "google/gemma-4-31b-it")

# Each attempt's limit. Three attempts, each routed differently, so a stuck provider costs one
# attempt rather than the whole extraction.
ATTEMPT_TIMEOUT_SECONDS = int(os.environ.get("OPENROUTER_ATTEMPT_TIMEOUT", "12"))
ROUTES = ("latency", "throughput", "price")

# 🔴 Enough for the whole invoice, and a hard stop on a model that starts repeating itself.
MAX_DOCUMENT_CHARS = 12000
MAX_ANSWER_TOKENS = 768

# At 150 dpi a page is legible and a few hundred KB; three pages cover an invoice and its
# packing list. More pages is more image tokens for text the operator can paste.
MAX_VISION_PAGES = 3

# 🔴 NO ORDINAL RULE. The previous prompt said "the FIRST company is the SHIPPER, the SECOND
# is the CONSIGNEE". On the first real invoice the second company was AXIS BANK LIMITED, from
# the bank-details block: positional reasoning moved into the prompt, and just as wrong.
#
# ⚠️ The jumbled-order warning and "a label is never a value" are what this prompt adds, and
# it is the prompt gemma3:4b was measured with, less the route and AWB fields. Without
# them 1B returned "Exporter" as the shipper's name.
PROMPT = """You are reading a freight document (commercial invoice, packing list or airway bill).

The text was extracted from a TABLE, so it is JUMBLED: a value may appear BEFORE or AFTER
its own label, and unrelated cells are interleaved. Match each value to its label by
MEANING, not by position.

Never return a label as a value. "Exporter", "Consignee", "Address :" and "Description of
Goods" are LABELS.

Start with the GOODS:

  description       what the goods are, in words
  gross_weight      total gross weight
  chargeable_weight the chargeable weight, only if the document states one
  dimensions        package dimensions as written, length x width x height with the unit

Then the ROUTE, as written:

  origin            the port or airport of LOADING (departure)
  destination       the port or airport of DISCHARGE (destination) — not a country

Then give each party in SIX parts. The address is the street part only: keep the city, state,
post code and country out of it.

  shipper_name      company SENDING the goods (labelled Exporter or Shipper). A company
                    name, usually containing LIMITED, LTD, PVT, CO, GMBH or INC.
  shipper_address   its street address
  shipper_city      its city or town
  shipper_state     its state, province or emirate
  shipper_post_code its post code, PIN or ZIP. A P.O Box number is NOT a post code
  shipper_country   the country of ITS OWN address — never the shipment's destination,
                    and never another party's country
  consignee_*       the same six for the company RECEIVING the goods (labelled Consignee)

IMPORTANT: the STATE and the COUNTRY may be worked out. If the document does not print them,
give the state and country that the city and post code belong to.

If a part is not there and cannot be worked out, LEAVE IT OUT. Never answer with a word that
stands for absence, such as NONE, N/A, NIL or "not specified".

Everything else must be copied from the document exactly. Never invent a company name, a
street address, a city or a post code. Omit any field you cannot find.

Ignore the price table, SKU codes and colour names. A colour or a product code is never a
company or a description. A bank's address is not a party's address.

DOCUMENT:
{text}
"""


# The same instructions for a scan, where there is no extracted text to be jumbled.
VISION_PROMPT = PROMPT.replace(
    "The text was extracted from a TABLE, so it is JUMBLED: a value may appear BEFORE or AFTER\n"
    "its own label, and unrelated cells are interleaved. Match each value to its label by\n"
    "MEANING, not by position.",
    "The document is given as page IMAGES. Read every page before answering.",
).replace("DOCUMENT:\n{text}\n", "")


def available() -> bool:
    """Whether a model can be called at all: a key is configured."""
    return bool(OPENROUTER_API_KEY)


def extract(text: str) -> Tuple[Optional[Dict[str, Any]], Optional[str], Optional[Dict[str, Any]]]:
    """
    Read a document's text.

    Returns `(fields, None, usage)` on success, or `(None, reason, usage)` — `usage` is what the
    call that answered cost, for Laravel's `llm_usage_logs`, and None when nothing answered.
    """
    if not text.strip():
        return None, "the document has no text for the model to read", None

    if len(text) > MAX_DOCUMENT_CHARS:
        logger.warning(f"document is {len(text)} chars; the model reads the first {MAX_DOCUMENT_CHARS}")

    content = PROMPT.format(text=text[:MAX_DOCUMENT_CHARS])
    fields, error, usage = _ask(content)

    return (_grounded(fields, text) if fields is not None else None), error, usage


def extract_images(pages: List[bytes]) -> Tuple[Optional[Dict[str, Any]], Optional[str], Optional[Dict[str, Any]]]:
    """
    Read a scan from its page images (PNG bytes), with the same schema.

    ⚠️ Nothing to ground against: there is no text layer to check a value is on the page. The
    words-for-absence and box-number guards still apply, and every value reaches the operator
    for checking, as a scan's always did.
    """
    if not pages:
        return None, "the document has no pages to read", None

    content = [{"type": "text", "text": VISION_PROMPT}] + [
        {"type": "image_url", "image_url": {"url": "data:image/png;base64," + base64.b64encode(p).decode()}}
        for p in pages[:MAX_VISION_PAGES]
    ]
    fields, error, usage = _ask(content)

    return (_grounded(fields, "", check_presence=False) if fields is not None else None), error, usage


def _ask(content) -> Tuple[Optional[Dict[str, Any]], Optional[str], Optional[Dict[str, Any]]]:
    """One question, up to three attempts, each routed to a different kind of provider."""
    if not available():
        return None, "the model is not configured (no OPENROUTER_API_KEY)", None

    reason = "the model is not reachable"

    for attempt, sort in enumerate(ROUTES, start=1):
        started = time.monotonic()
        body, reason = _post(content, sort)

        if body is None:
            logger.warning(f"attempt {attempt} ({sort}) failed: {reason}")
            continue

        usage = _usage(body, attempt, started)
        raw = ((body.get("choices") or [{}])[0].get("message") or {}).get("content") or ""

        try:
            parsed = ExtractedDocument.model_validate_json(raw).model_dump(exclude_none=True)
        except Exception as e:
            # ⚠️ Logged with the payload: "it returned this" is actionable, "invalid" is not.
            logger.warning(f"model output failed validation: {e} | raw={raw[:300]}")
            return None, "the model returned something unreadable", usage

        return parsed, None, usage

    return None, reason, None


def _post(content, sort: str) -> Tuple[Optional[Dict[str, Any]], str]:
    """One HTTP call. Returns the body, or None and the reason."""
    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": content}],
        "temperature": 0,
        "max_tokens": MAX_ANSWER_TOKENS,
        "response_format": {
            "type": "json_schema",
            "json_schema": {"name": "extracted_document", "strict": True, "schema": _strict_schema()},
        },
        "provider": {
            "sort": sort,
            # 🔴 Only providers that support the schema, and none that keep or train on prompts —
            # an invoice carries a client's parties and addresses.
            "require_parameters": True,
            "data_collection": "deny",
        },
        # The cost of THIS call, in the response, for llm_usage_logs.
        "usage": {"include": True},
    }

    request = urllib.request.Request(
        OPENROUTER_URL,
        data=json.dumps(payload).encode(),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "X-Title": "F16s Freight OS",
        },
    )

    timed_out = f"the model timed out after {ATTEMPT_TIMEOUT_SECONDS}s"

    try:
        with urllib.request.urlopen(request, timeout=ATTEMPT_TIMEOUT_SECONDS) as response:
            body = json.loads(response.read())
    # ⚠️ Both names: `socket.timeout` only became an alias of TimeoutError in Python 3.10.
    except (TimeoutError, socket.timeout):
        return None, timed_out
    except urllib.error.HTTPError as e:
        return None, f"the model failed (HTTP {e.code})"
    except urllib.error.URLError as e:
        if isinstance(e.reason, (TimeoutError, socket.timeout)):
            return None, timed_out
        return None, "the model is not reachable"
    except json.JSONDecodeError:
        return None, "the model returned something unreadable"
    except Exception:
        return None, "the model is not reachable"

    # OpenRouter can answer 200 with an error body when every provider refused.
    if body.get("error"):
        return None, "the model failed (" + str((body["error"] or {}).get("message", "provider error"))[:120] + ")"

    return body, ""


def _strict_schema() -> Dict[str, Any]:
    """
    The schema as strict structured output needs it: every key REQUIRED, nothing extra.

    ⚠️ Null is still a valid answer for every field, so "required" asks the model to face each
    question, not to fill it — the same reason the cargo keys were already required-nullable.
    """
    schema = ExtractedDocument.model_json_schema()
    schema.pop("title", None)

    for field in schema["properties"].values():
        field.pop("default", None)
        field.pop("title", None)

    schema["required"] = list(schema["properties"])
    schema["additionalProperties"] = False

    return schema


def _usage(body: Dict[str, Any], attempt: int, started: float) -> Dict[str, Any]:
    """What the answering call used and cost, as Laravel logs it."""
    usage = body.get("usage") or {}

    return {
        "model": body.get("model") or MODEL,
        "provider": body.get("provider"),
        "tokens_in": int(usage.get("prompt_tokens") or 0),
        "tokens_out": int(usage.get("completion_tokens") or 0),
        "cost_usd": float(usage.get("cost") or 0),
        "execution_ms": int((time.monotonic() - started) * 1000),
        "attempts": attempt,
    }


# 🔴 A LITERAL STANDING FOR ABSENCE IS NOT A VALUE. gemma3:4b answered
# `consignee_state: "NONE"` on the real invoice — and state and country skip the grounding
# check below, because they may be worked out, so nothing else would have stopped it reaching
# a waybill. The 1B model did the same with `awb_number: "Not specified"`.
ABSENT_WORDS = {"", "-", "na", "nil", "none", "null", "unknown", "notspecified",
                "notavailable", "notgiven", "notmentioned", "notapplicable"}

# ⚠️ A P.O Box number is not a post code. The model answered
# `consignee_post_code: "P.O Box 9192"` while the real one, 11191, sat on the same line.
BOX_NUMBER = re.compile(r"\b(p\.?\s*o\.?\s*)?box\b", re.IGNORECASE)


def _is_box_number(value: str, source: str) -> bool:
    """
    A box number, however it is written.

    ⚠️ Dropping the string "P.O Box 9192" only moved the error: the next run answered the bare
    digits, "9192", while the real post code (11191) sat further along the same line. So the
    document is asked too — a number it prints right after "Box" is a box number.
    """
    if BOX_NUMBER.search(value):
        return True

    return bool(re.search(r"box\D{0,4}" + re.escape(value.strip()), source, re.IGNORECASE))


def _grounded(parsed: Dict[str, Any], source: str, check_presence: bool = True) -> Dict[str, Any]:
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

        if _comparable(value) in ABSENT_WORDS:
            logger.info(f"dropped {key}={value!r} — a word standing for absence")
            continue

        if key.endswith("_post_code") and _is_box_number(value, source):
            logger.info(f"dropped {key}={value!r} — a box number is not a post code")
            continue

        # 🔴 A STATE and a COUNTRY may be WORKED OUT from the city and post code — the prompt
        # asks for that, because an invoice often prints neither and the form needs both. So
        # those two fields alone are not required to appear in the document. Everything else
        # still is: this is what dropped `awb_number: "Not specified"` and an invented company.
        if key.endswith(("_state", "_country")) or not check_presence:
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
