from fastapi import FastAPI, UploadFile, File, Form, HTTPException
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
from extract_awb_new import extract_all_boxes
from unstructured import extract_from_text

# Setup structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ocr_server")

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
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name

        logger.info(f"Received '{file.filename}' | Template: '{document_type}' | Size: {len(contents)} bytes")

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

        # 3. Execute instantaneous pre-loaded extraction
        # No subprocess creation overhead here!
        result = extract_all_boxes(
            pdf_path=tmp_path, 
            template_name=document_type, 
            config_path=config_source,
            page_num=0
        )
        
        logger.info(f"Successfully extracted data from '{file.filename}'")
        return JSONResponse(content=result)

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
):
    """
    Read a document that has no fixed layout — a commercial invoice, a packing list.

    🔴 THE RESPONSE'S JOB IS TO SAY WHICH PATH WAS TAKEN. `ProcessPdfOcrJob` reads
    `extraction_path` and never guesses it: only the parser knows whether the PDF had a
    usable text layer, and a job parks on `'none'` to ask the operator whether to pay for
    a vision run. Until this endpoint existed nothing could return that value, so the
    consent flow was unreachable and every unstructured upload hit a 404.

    ⚠️ `allow_vision` is accepted and, for now, only ever REFUSED. Laravel sends it, and
    answering "vision was requested and this build cannot do it" is honest; silently
    returning a text-path result for a scan would report an empty extraction as a
    successful one.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    wants_vision = str(allow_vision).lower() in ("1", "true", "yes")

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name

        logger.info(
            f"Unstructured '{file.filename}' | {len(contents)} bytes | allow_vision={wants_vision}"
        )

        result = extract_from_text(tmp_path)

        if result["extraction_path"] == "none" and wants_vision:
            # 🔴 Consent was GIVEN and the vision path is not built. Saying so is the
            # only honest answer: returning the empty text result would spend the
            # operator's credit and hand back nothing, and they authorised a paid run.
            logger.warning("Vision authorised but no vision provider is installed in this build.")
            raise HTTPException(
                status_code=501,
                detail="Vision extraction is not available in this build.",
            )

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
