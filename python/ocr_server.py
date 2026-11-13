from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import JSONResponse
import tempfile
import os
import logging
import json
from typing import Optional
from pathlib import Path

# Load absolute paths to guarantee loading regardless of execution directory
CURRENT_DIR = Path(__file__).parent.absolute()
CONFIG_FILE_PATH = str(CURRENT_DIR / "boxes_config.json")

# Import your pre-existing logic -- this loads ONCE at startup
# and stays resident in memory forever.
from extract_awb_new import _iata_patterns, extract_all_boxes
from unstructured import extract_from_images, extract_from_text
from bill import extract_bill_from_images, extract_bill_from_text

# ⚠️ Built at startup, not on the first document: compiling the 8,383 airport-name patterns takes
# ~0.6 s, which the first invoice after a restart would otherwise pay.
_iata_patterns()

# Setup structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ocr_server")

# 🔴 The largest upload read into memory. Laravel refuses a PDF over 25 MB before it gets here; this is the same rule
# for anything that reaches the service another way (2026-11-10 audit §7 — there was no limit at all, and the whole
# file is held in memory while it is written to disk).
MAX_UPLOAD_BYTES = int(os.environ.get("OCR_MAX_UPLOAD_MB", "30")) * 1024 * 1024


async def _save_upload(file: UploadFile) -> tuple[str, int]:
    """Write the upload to a temp file a megabyte at a time. Returns (path, size); 413 once it passes the limit."""
    size = 0
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        path = tmp.name
        try:
            while chunk := await file.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_UPLOAD_BYTES:
                    raise HTTPException(status_code=413, detail=f"The file is larger than {MAX_UPLOAD_BYTES // (1024 * 1024)} MB.")
                tmp.write(chunk)
        except BaseException:
            tmp.close()
            os.unlink(path)
            raise

    return path, size

app = FastAPI(
    title="F16s OCR Microservice", 
    description="Lightning fast, zero-cold-start PDF extraction service"
)

@app.get("/health")
def health():
    """Laravel workers ping this on worker startup to verify accessibility."""
    return {"status": "ok", "message": "OCR service online"}

@app.post("/extract")
async def extract(
    file: UploadFile = File(...), 
    document_type: str = Form("ksr"),
    coordinates: Optional[str] = Form(None)
):
    """
    Receives PDF via FastAPI endpoint and invokes pre-loaded pdfplumber instantly.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    tmp_path = None
    try:
        # 1. Dump incoming data stream to disk temp for pdfplumber access
        tmp_path, size = await _save_upload(file)

        logger.info(f"Received '{file.filename}' | Template: '{document_type}' | Size: {size} bytes")

        # 2. Determine coordinates configuration source
        config_source = CONFIG_FILE_PATH
        if coordinates:
            try:
                parsed_coords = json.loads(coordinates)
                if isinstance(parsed_coords, dict):
                    config_source = parsed_coords
                    logger.info(f"Using database-provided coordinates for template: '{document_type}'")
                else:
                    logger.warning("Coordinates parameter is not a dictionary/object. Falling back to boxes_config.json")
            except Exception as e:
                logger.error(f"Failed to parse custom coordinates JSON: {e}. Falling back to boxes_config.json")

        # 3. Execute the pre-loaded extraction.
        # 🔴 In a worker thread, not on the event loop (2026-11-10 audit §7): pdfplumber is synchronous, and run
        # inline it stopped every other request — /health included — until this waybill was read.
        result = await run_in_threadpool(
            extract_all_boxes,
            pdf_path=tmp_path,
            template_name=document_type,
            config_path=config_source,
            page_num=0,
        )
        
        logger.info(f"Successfully extracted data from '{file.filename}'")
        return JSONResponse(content=result)

    except HTTPException:
        raise

    except Exception as e:
        # Detailed logging aids debugging production server logs
        logger.error(f"CRITICAL EXTRACTION FAILURE: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Extraction internal failure: {str(e)}")

    finally:
        # 3. Hygiene: Clean up disk immediately to prevent disk filling
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except Exception:
                pass


@app.post("/extract-unstructured")
async def extract_unstructured(
    file: UploadFile = File(...),
    allow_vision: str = Form("false"),
    use_model: str = Form("true"),
    skip_reason: str = Form("the daily AI limit has been reached"),
    free_first: str = Form("false"),
    document_type: str = Form(""),
):
    """
    Read a document that has no fixed layout — a commercial invoice, a packing list.

    🔴 THE RESPONSE'S JOB IS TO SAY WHICH PATH WAS TAKEN. `ProcessPdfOcrJob` reads
    `extraction_path` and never guesses it: only the parser knows whether the PDF had a
    usable text layer, and a job parks on `'none'` to ask the operator whether to pay for
    a vision run. Until this endpoint existed nothing could return that value, so the
    consent flow was unreachable and every unstructured upload hit a 404.

    🔴 `allow_vision` is TRUE only after a human authorised the paid run. The scan's pages then go
    to the same Gemma 4 model as images (`extract_from_images`).

    ⚠️ `use_model` is FALSE when the user's daily AI limit is reached: the label reading stands.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    wants_vision = str(allow_vision).lower() in ("1", "true", "yes")
    model_allowed = str(use_model).lower() in ("1", "true", "yes")

    tmp_path = None
    try:
        tmp_path, size = await _save_upload(file)

        logger.info(
            f"Unstructured '{file.filename}' | {size} bytes | allow_vision={wants_vision}"
        )

        # 🔴 In a worker thread, not on the event loop. A model call takes seconds, and run inline it
        # would block every other request, /health included, for the whole reading.
        # 🌙 Laravel says when the free model may be tried first (at night, when superadmin allows it).
        free = str(free_first).lower() in ("1", "true", "yes")
        # 🚢 A bill of lading or booking has its own schema and prompt (guide Step 12.4) — bill.py.
        if document_type == "bill_of_lading":
            result = await run_in_threadpool(extract_bill_from_text, tmp_path, model_allowed, skip_reason[:120])
            if result["extraction_path"] == "none" and wants_vision:
                result = await run_in_threadpool(extract_bill_from_images, tmp_path)
        else:
            result = await run_in_threadpool(extract_from_text, tmp_path, model_allowed, skip_reason[:120], free)

            if result["extraction_path"] == "none" and wants_vision:
                # Consent was given: read the scan's pages as images.
                result = await run_in_threadpool(extract_from_images, tmp_path)

        logger.info(
            f"Unstructured '{file.filename}' -> {result['extraction_path']} "
            f"({result['page_count']} page(s), {len(result.get('text', ''))} chars)"
        )

        return JSONResponse(content=result)

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"UNSTRUCTURED EXTRACTION FAILURE: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Extraction internal failure: {str(e)}")

    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except Exception:
                pass
