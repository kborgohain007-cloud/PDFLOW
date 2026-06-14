FROM python:3.10-slim-bookworm

WORKDIR /app

# Install Tesseract OCR system binary + minimal image libs
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir \
    fastapi uvicorn[standard] python-multipart \
    pdf2docx pytesseract Pillow python-docx

COPY . /app

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]