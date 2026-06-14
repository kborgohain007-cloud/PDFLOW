import os
import io
import tempfile
import shutil
import logging
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pdf2docx import Converter
from docx import Document
from PIL import Image
import pytesseract
import fitz  # PyMuPDF (comes with pdf2docx)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="PDFLOW Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def has_extractable_text(pdf_path: str, min_chars: int = 50) -> bool:
    """Check if the PDF has real text or is just images."""
    try:
        doc = fitz.open(pdf_path)
        total = "".join(page.get_text() for page in doc)
        doc.close()
        return len(total.strip()) >= min_chars
    except Exception as e:
        logger.warning(f"Text check failed: {e}")
        return False

def ocr_pdf_to_docx(pdf_path: str, output_path: str):
    """Render each page to an image, OCR it, and build a DOCX."""
    doc = fitz.open(pdf_path)
    word_doc = Document()
    page_count = len(doc)

    logger.info(f"OCR: processing {page_count} page(s)")

    for i in range(page_count):
        page = doc.load_page(i)
        # Render at 200 DPI for clean OCR
        mat = fitz.Matrix(200 / 72, 200 / 72)
        pix = page.get_pixmap(matrix=mat)
        img = Image.open(io.BytesIO(pix.tobytes("png")))

        text = pytesseract.image_to_string(img).strip()
        if text:
            word_doc.add_paragraph(text)

        if i < page_count - 1:
            word_doc.add_page_break()

    word_doc.save(output_path)
    doc.close()
    logger.info("OCR conversion complete")

@app.get("/health")
async def health():
    return {"status": "ok", "engine": "pdf2docx+ocr"}

@app.post("/api/convert/pdf-to-word")
async def convert_pdf_to_word(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files allowed")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(400, "File too large. Max 10MB on free tier.")

    tmp_dir = tempfile.mkdtemp(prefix="pdflow_")
    input_path = os.path.join(tmp_dir, "input.pdf")
    output_path = os.path.join(tmp_dir, "output.docx")

    try:
        with open(input_path, "wb") as f:
            f.write(contents)

        logger.info(f"Converting: {file.filename}")

        # Route based on content type
        if has_extractable_text(input_path):
            logger.info("Text-based PDF → pdf2docx")
            cv = Converter(input_path)
            cv.convert(output_path, start=0, end=None)
            cv.close()
        else:
            logger.info("Scanned/image PDF → OCR")
            ocr_pdf_to_docx(input_path, output_path)

        if not os.path.exists(output_path):
            raise HTTPException(500, "DOCX generation failed")

        background_tasks.add_task(shutil.rmtree, tmp_dir, ignore_errors=True)

        return FileResponse(
            output_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=file.filename.replace(".pdf", ".docx").replace(".PDF", ".docx"),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Conversion failed")
        shutil.rmtree(tmp_dir, ignore_errors=True)
        raise HTTPException(500, f"Conversion failed: {str(e)}")