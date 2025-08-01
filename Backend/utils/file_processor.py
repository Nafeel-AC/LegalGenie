import os
import aiofiles
from typing import Optional, Tuple
from fastapi import UploadFile
import PyPDF2
from docx import Document
import tempfile

async def process_uploaded_file(file: UploadFile, user_id: str) -> Tuple[str, str, str]:
    """Process uploaded file and return file path, extracted text, and original filename"""
    
    # Create temporary directory for processing
    temp_dir = tempfile.mkdtemp()
    temp_file_path = os.path.join(temp_dir, file.filename)
    
    try:
        # Save file temporarily for processing
        async with aiofiles.open(temp_file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Extract text based on file type
        file_extension = os.path.splitext(file.filename)[1]
        text = await extract_text_from_file(temp_file_path, file_extension)
        
        return temp_file_path, text, file.filename
        
    except Exception as e:
        # Clean up temp file on error
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise Exception(f"Error processing file: {str(e)}")

async def extract_text_from_file(file_path: str, file_extension: str) -> str:
    """Extract text from different file types"""
    
    try:
        if file_extension.lower() == '.pdf':
            return await extract_pdf_text(file_path)
        elif file_extension.lower() in ['.docx', '.doc']:
            return await extract_docx_text(file_path)
        elif file_extension.lower() == '.txt':
            return await extract_txt_text(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")
    
    except Exception as e:
        raise Exception(f"Error extracting text from file: {str(e)}")

async def extract_pdf_text(file_path: str) -> str:
    """Extract text from PDF file"""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        raise Exception(f"Error reading PDF: {str(e)}")

async def extract_docx_text(file_path: str) -> str:
    """Extract text from DOCX file"""
    try:
        doc = Document(file_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text.strip()
    except Exception as e:
        raise Exception(f"Error reading DOCX: {str(e)}")

async def extract_txt_text(file_path: str) -> str:
    """Extract text from TXT file"""
    try:
        async with aiofiles.open(file_path, 'r', encoding='utf-8') as file:
            text = await file.read()
        return text.strip()
    except Exception as e:
        raise Exception(f"Error reading TXT: {str(e)}")

async def cleanup_temp_file(file_path: str):
    """Clean up temporary file"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            # Also remove the temp directory if empty
            temp_dir = os.path.dirname(file_path)
            if os.path.exists(temp_dir) and not os.listdir(temp_dir):
                os.rmdir(temp_dir)
    except Exception as e:
        print(f"Error cleaning up temp file {file_path}: {str(e)}")

def get_file_size(file_path: str) -> int:
    """Get file size in bytes"""
    try:
        return os.path.getsize(file_path)
    except:
        return 0

def is_valid_file_type(filename: str) -> bool:
    """Check if file type is supported"""
    allowed_extensions = ['.pdf', '.docx', '.doc', '.txt']
    file_extension = os.path.splitext(filename)[1].lower()
    return file_extension in allowed_extensions 