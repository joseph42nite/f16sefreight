from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import tempfile
import os
import logging
from pathlib import Path

# Load absolute paths to guarantee loading regardless of execution directory
CURRENT_DIR = Path(__file__).parent.absolute()
CONFIG_FILE_PATH = str(CURRENT_DIR / "boxes_config.json")

# Import your pre-existing logic -- this loads ONCE at startup
# and stays resident in memory forever.
from extract_awb_new import extract_all_boxes

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
    document_type: str = Form("ksr") # Defaults to standard 'ksr' template
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
        
        # 2. Execute instantaneous pre-loaded extraction
        # No subprocess creation overhead here!
        result = extract_all_boxes(
            pdf_path=tmp_path, 
            template_name=document_type, 
            config_path=CONFIG_FILE_PATH,
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
