from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import tempfile
import os
import logging
import json
from typing import Optional, List
from pathlib import Path
import google.generativeai as genai
from schemas import CommercialInvoiceSchema, PackingListSchema, MergedExtractionSchema
from pydantic import BaseModel

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
    document_type: str = Form("commercial_invoice")
):
    """
    Exposes unstructured document parsing using Gemini 1.5 Flash.
    Extracts text in-memory or falls back to multi-modal vision parsing.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY is not configured in the environment.")
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured on the server.")
    
    genai.configure(api_key=api_key)
    file_bytes = await file.read()

    # 1. Try PyMuPDF text extraction in-memory
    text = ""
    is_pdf = file.filename.lower().endswith(".pdf")
    if is_pdf:
        try:
            import fitz
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                text += page.get_text()
        except Exception as e:
            logger.warning(f"PyMuPDF text extraction failed: {e}")

    # 2. Select schema and prompt based on document_type
    if document_type == "commercial_invoice":
        schema = CommercialInvoiceSchema
        prompt = (
            "Analyze the commercial invoice document and extract all fields "
            "according to the schema. For each field, determine the confidence (high, medium, or low) "
            "based on whether the field is explicitly and clearly stated (high), inferred or reconstructed (medium), "
            "or missing/uncertain (low)."
        )
    elif document_type == "packing_list":
        schema = PackingListSchema
        prompt = (
            "Analyze the packing list document and extract all fields "
            "according to the schema. For each field, determine the confidence (high, medium, or low) "
            "based on whether the field is explicitly and clearly stated (high), inferred or reconstructed (medium), "
            "or missing/uncertain (low)."
        )
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported document type: {document_type}")

    # 3. Call Gemini
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Determine whether to send text or direct file bytes (multi-modal vision)
        if text.strip() and len(text.strip()) > 100:
            logger.info("Using extracted PDF text for Gemini prompt.")
            contents = [f"Document text:\n{text}\n\n{prompt}"]
        else:
            logger.info("Empty/short text extracted. Using multi-modal vision parsing.")
            mime = "application/pdf" if is_pdf else (file.content_type or "image/png")
            contents = [
                {"mime_type": mime, "data": file_bytes},
                prompt
            ]

        response = model.generate_content(
            contents,
            generation_config={
                "response_mime_type": "application/json",
                "response_schema": schema
            }
        )

        result_json = json.loads(response.text)
        
        usage = response.usage_metadata
        tokens_in = usage.prompt_token_count if usage else 0
        tokens_out = usage.candidates_token_count if usage else 0

        logger.info(f"Unstructured extraction successful. In: {tokens_in}, Out: {tokens_out}")

        return JSONResponse(content={
            "status": "success",
            "extracted_data": result_json,
            "tokens_in": tokens_in,
            "tokens_out": tokens_out,
            "model": "gemini-1.5-flash"
        })

    except Exception as e:
        logger.error(f"Unstructured extraction internal failure: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"LLM parsing failed: {str(e)}")


@app.post("/extract-multi-unstructured")
async def extract_multi_unstructured(
    files: List[UploadFile] = File(...),
    roles: str = Form(...)
):
    """
    Multi-document extraction using PyMuPDF + Gemini AI.
    Accepts multiple PDFs with extraction role assignments.
    Merges results into a single unified response payload.
    
    roles: JSON string array e.g. [{"index": 0, "role": "shipper_consignee"}, {"index": 1, "role": "pieces_dimensions"}]
    Valid roles: shipper_consignee, pieces_dimensions, full
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY is not configured in the environment.")
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured on the server.")
    
    genai.configure(api_key=api_key)

    # Parse roles
    try:
        role_assignments = json.loads(roles)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid roles JSON: {e}")

    if len(files) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 files allowed per request.")

    # Build role-specific prompts
    ROLE_PROMPTS = {
        "shipper_consignee": (
            "Focus ONLY on extracting the shipper/exporter and consignee/importer party information from this document. "
            "Extract: shipper_name, shipper_address, shipper_city, shipper_post_code, shipper_state, shipper_country, shipper_phone, "
            "consignee_name, consignee_address, consignee_city, consignee_post_code, consignee_state, consignee_country, consignee_phone. "
            "For all other fields (cargo, financial, etc.), set their value to null with confidence 'low'."
        ),
        "pieces_dimensions": (
            "Focus ONLY on extracting the cargo/package/dimension/weight information from this document. "
            "Extract: total_packages, total_gross_weight, total_net_weight, total_volume, dimensions, chargeable_weight. "
            "Also extract any individual packing line items if available. "
            "For all other fields (shipper, consignee, financial, etc.), set their value to null with confidence 'low'."
        ),
        "full": (
            "Extract ALL available fields from this document including shipper, consignee, cargo dimensions, "
            "financial totals, and line items. For each field, determine the confidence (high, medium, or low) "
            "based on whether the field is explicitly and clearly stated (high), inferred or reconstructed (medium), "
            "or missing/uncertain (low)."
        ),
    }

    total_tokens_in = 0
    total_tokens_out = 0
    merged_result = {}

    model = genai.GenerativeModel('gemini-1.5-flash')

    for assignment in role_assignments:
        idx = assignment.get("index", 0)
        role = assignment.get("role", "full")
        
        if idx >= len(files):
            logger.warning(f"Role assignment index {idx} exceeds file count {len(files)}, skipping.")
            continue

        file = files[idx]
        file_bytes = await file.read()
        # Reset file position for potential re-reads
        await file.seek(0)

        # Extract text using PyMuPDF
        text = ""
        is_pdf = file.filename.lower().endswith(".pdf") if file.filename else False
        if is_pdf:
            try:
                import fitz
                doc = fitz.open(stream=file_bytes, filetype="pdf")
                for page in doc:
                    text += page.get_text()
                doc.close()
            except Exception as e:
                logger.warning(f"PyMuPDF text extraction failed for file {idx}: {e}")

        # Build the prompt with role-specific instructions
        role_instruction = ROLE_PROMPTS.get(role, ROLE_PROMPTS["full"])
        prompt = (
            f"Analyze the following document and extract fields according to the schema.\n"
            f"{role_instruction}\n"
            f"For each field, provide a 'value' and 'confidence' (high/medium/low)."
        )

        try:
            # Use text if substantial, otherwise fall back to vision
            if text.strip() and len(text.strip()) > 100:
                logger.info(f"File {idx} ({file.filename}): Using extracted PDF text for Gemini prompt. Role: {role}")
                contents = [f"Document text:\n{text}\n\n{prompt}"]
            else:
                logger.info(f"File {idx} ({file.filename}): Using multi-modal vision parsing. Role: {role}")
                mime = "application/pdf" if is_pdf else (file.content_type or "image/png")
                contents = [
                    {"mime_type": mime, "data": file_bytes},
                    prompt
                ]

            response = model.generate_content(
                contents,
                generation_config={
                    "response_mime_type": "application/json",
                    "response_schema": MergedExtractionSchema
                }
            )

            file_result = json.loads(response.text)

            usage = response.usage_metadata
            total_tokens_in += usage.prompt_token_count if usage else 0
            total_tokens_out += usage.candidates_token_count if usage else 0

            # Merge results: only override fields relevant to this role
            _merge_by_role(merged_result, file_result, role)

            logger.info(f"File {idx} ({file.filename}) extraction successful with role '{role}'.")

        except Exception as e:
            logger.error(f"Extraction failed for file {idx} ({file.filename}): {str(e)}", exc_info=True)
            # Continue processing remaining files instead of aborting entirely
            continue

    if not merged_result:
        raise HTTPException(status_code=500, detail="All file extractions failed. No data could be parsed.")

    logger.info(f"Multi-document extraction complete. Total In: {total_tokens_in}, Out: {total_tokens_out}")

    return JSONResponse(content={
        "status": "success",
        "extracted_data": merged_result,
        "tokens_in": total_tokens_in,
        "tokens_out": total_tokens_out,
        "model": "gemini-1.5-flash",
        "files_processed": len(role_assignments)
    })


def _merge_by_role(target: dict, source: dict, role: str):
    """
    Merges extraction results from a source document into the target dict,
    only overriding fields that belong to the given role category.
    """
    SHIPPER_CONSIGNEE_FIELDS = {
        "shipper_name", "shipper_address", "shipper_city", "shipper_post_code",
        "shipper_state", "shipper_country", "shipper_phone",
        "consignee_name", "consignee_address", "consignee_city", "consignee_post_code",
        "consignee_state", "consignee_country", "consignee_phone",
    }
    PIECES_DIMENSIONS_FIELDS = {
        "total_packages", "total_gross_weight", "total_net_weight", "total_volume",
        "dimensions", "chargeable_weight", "packing_items",
    }
    FINANCIAL_FIELDS = {
        "invoice_no", "document_date", "grand_total", "currency",
        "payment_terms", "tax_registration_no", "items",
    }

    if role == "shipper_consignee":
        allowed = SHIPPER_CONSIGNEE_FIELDS
    elif role == "pieces_dimensions":
        allowed = PIECES_DIMENSIONS_FIELDS
    elif role == "full":
        allowed = SHIPPER_CONSIGNEE_FIELDS | PIECES_DIMENSIONS_FIELDS | FINANCIAL_FIELDS
    else:
        allowed = SHIPPER_CONSIGNEE_FIELDS | PIECES_DIMENSIONS_FIELDS | FINANCIAL_FIELDS

    for key, value in source.items():
        if key not in allowed:
            continue
        # Only override if the source field has actual data
        if isinstance(value, dict):
            val = value.get("value")
            conf = value.get("confidence", "low")
            if val is not None and val != "" and conf != "low":
                target[key] = value
            elif key not in target:
                target[key] = value
        elif isinstance(value, list) and len(value) > 0:
            target[key] = value
        elif value is not None:
            target[key] = value


@app.post("/classify-email")
async def classify_email(
    subject: str = Form(""),
    body: str = Form(""),
    from_email: Optional[str] = Form(None)
):
    """
    Classifies email as 'customer' or 'system' using Gemini 1.5 Flash.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY is not configured in the environment.")
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured on the server.")
    
    genai.configure(api_key=api_key)

    prompt = (
        "You are an expert AI logistics assistant classification system.\n"
        "Analyze the following email from a freight forwarding inbox:\n"
        f"Sender: {from_email}\n"
        f"Subject: {subject}\n"
        f"Body:\n{body[:2000]}\n\n"
        "Determine if this email is a freight rate query, request for quote, booking request, "
        "or a manual inquiry from a customer (which should be triaged/replied to by a human operator), "
        "OR if it is an automated system/notice notification, flight status update, track and trace log, "
        "advertisement, spam, or booking confirmation from an airline/carrier (which should be classified as system).\n"
        "Reply with exactly one word: either 'customer' or 'system'."
    )

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        classification = response.text.strip().lower()

        if "customer" in classification:
            classification = "customer"
        elif "system" in classification:
            classification = "system"
        else:
            classification = "system"  # Default fallback if LLM is ambiguous

        usage = response.usage_metadata
        tokens_in = usage.prompt_token_count if usage else 0
        tokens_out = usage.candidates_token_count if usage else 0

        logger.info(f"Email classification successful: '{classification}' | In: {tokens_in}, Out: {tokens_out}")

        return JSONResponse(content={
            "status": "success",
            "classification": classification,
            "tokens_in": tokens_in,
            "tokens_out": tokens_out,
            "model": "gemini-1.5-flash"
        })
    except Exception as e:
        logger.error(f"Email classification internal failure: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"LLM classification failed: {str(e)}")


class ClientSummaryRequest(BaseModel):
    client_name: str
    data: dict


class ExecutiveBriefRequest(BaseModel):
    stats: dict


@app.post("/summarize-client")
async def summarize_client(req: ClientSummaryRequest):
    """
    Summarizes quarterly client activity based on aggregated operational data.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY is not configured in the environment.")
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured on the server.")
    
    genai.configure(api_key=api_key)
    
    prompt = (
        "You are an expert AI logistics analyst.\n"
        f"Summarize the quarterly activity of client '{req.client_name}' based on the following operational metrics:\n"
        f"{json.dumps(req.data, indent=2)}\n\n"
        "Provide a concise, professional executive summary in markdown. Mention key lanes, shipment volumes, conversion rates, and gross margins."
    )
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        summary = response.text.strip()
        
        usage = response.usage_metadata
        tokens_in = usage.prompt_token_count if usage else 0
        tokens_out = usage.candidates_token_count if usage else 0
        
        logger.info(f"Client summary successful for '{req.client_name}' | In: {tokens_in}, Out: {tokens_out}")
        
        return JSONResponse(content={
            "status": "success",
            "summary": summary,
            "tokens_in": tokens_in,
            "tokens_out": tokens_out,
            "model": "gemini-1.5-flash"
        })
    except Exception as e:
        logger.error(f"Client summary internal failure: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"LLM summary failed: {str(e)}")


@app.post("/executive-brief")
async def executive_brief(req: ExecutiveBriefRequest):
    """
    Compiles a weekly executive brief highlighting operational throughput, bottlenecks, and response times.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY is not configured in the environment.")
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured on the server.")
    
    genai.configure(api_key=api_key)
    
    prompt = (
        "You are an expert AI operations director for a freight forwarding agency.\n"
        "Compile a weekly executive brief highlighting operational throughput, bottlenecks, and response times.\n"
        "Here are the comparative operations metrics for this week vs the prior week:\n"
        f"{json.dumps(req.stats, indent=2)}\n\n"
        "Write a beautifully structured weekly executive brief in markdown. Identify system bottlenecks (e.g. Frankfurt lane growth, response latencies, SLA breaches, unbilled jobs, and OLI overload counts) in a professional summary format."
    )
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        brief = response.text.strip()
        
        usage = response.usage_metadata
        tokens_in = usage.prompt_token_count if usage else 0
        tokens_out = usage.candidates_token_count if usage else 0
        
        logger.info(f"Executive brief compile successful | In: {tokens_in}, Out: {tokens_out}")
        
        return JSONResponse(content={
            "status": "success",
            "brief": brief,
            "tokens_in": tokens_in,
            "tokens_out": tokens_out,
            "model": "gemini-1.5-flash"
        })
    except Exception as e:
        logger.error(f"Executive brief internal failure: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"LLM brief failed: {str(e)}")


class ClientRiskRequest(BaseModel):
    data: dict


@app.post("/analyze-risk")
async def analyze_risk(req: ClientRiskRequest):
    """
    Analyzes the payment risk profile for anonymized customer accounts using Gemini.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY is not configured in the environment.")
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured on the server.")
    
    genai.configure(api_key=api_key)
    
    prompt = (
        "You are an expert financial risk analyst for a logistics and freight forwarding agency.\n"
        "Analyze the payment risk profiles of the following anonymized customer accounts:\n"
        f"{json.dumps(req.data, indent=2)}\n\n"
        "Assess their credit health, payment delay trends, and volume fluctuations. Provide a structured risk summary, "
        "recommending credit holds or collections follow-ups for each client."
    )
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        analysis = response.text.strip()
        
        usage = response.usage_metadata
        tokens_in = usage.prompt_token_count if usage else 0
        tokens_out = usage.candidates_token_count if usage else 0
        
        logger.info(f"Anonymized risk analysis successful | In: {tokens_in}, Out: {tokens_out}")
        
        return JSONResponse(content={
            "status": "success",
            "analysis": analysis,
            "tokens_in": tokens_in,
            "tokens_out": tokens_out,
            "model": "gemini-1.5-flash"
        })
    except Exception as e:
        logger.error(f"Anonymized risk analysis internal failure: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"LLM risk analysis failed: {str(e)}")



