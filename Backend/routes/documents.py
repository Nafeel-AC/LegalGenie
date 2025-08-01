from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

from utils.database import create_document, get_document, get_user_documents, update_document, delete_document, upload_file_to_bucket
from utils.vector_store import store_document_chunks, delete_document_chunks
from utils.file_processor import process_uploaded_file, is_valid_file_type, cleanup_temp_file
from utils.llm import summarize_document
from utils.auth import get_current_user_id, verify_user_owns_document

router = APIRouter()

class DocumentCreate(BaseModel):
    title: str
    content: str

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class DocumentResponse(BaseModel):
    id: str
    title: str
    content: str
    file_url: Optional[str]
    file_name: Optional[str]
    created_at: str
    updated_at: Optional[str]

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id)
):
    """Upload and process a legal document"""
    temp_file_path = None
    try:
        # Validate file type
        if not is_valid_file_type(file.filename):
            raise HTTPException(
                status_code=400, 
                detail="Unsupported file type. Please upload PDF, DOCX, or TXT files."
            )
        
        # Process file and extract text
        temp_file_path, extracted_text, original_filename = await process_uploaded_file(file, user_id)
        
        # Generate document title from filename
        title = original_filename.rsplit('.', 1)[0]
        
        # Upload file to Supabase Storage
        file_url = await upload_file_to_bucket(
            file_path=temp_file_path,
            file_name=original_filename,
            user_id=user_id
        )
        
        # Create document in database
        doc_data = await create_document(
            user_id=user_id,
            title=title,
            content=extracted_text,
            file_url=file_url,
            file_name=original_filename
        )
        
        if not doc_data:
            raise HTTPException(status_code=500, detail="Failed to create document")
        
        # Store chunks in vector database (skip for now to debug)
        try:
            await store_document_chunks(
                doc_id=doc_data["id"],
                text=extracted_text,
                metadata={"title": title, "user_id": user_id}
            )
        except Exception as e:
            print(f"Warning: Failed to store document chunks: {e}")
        
        # Generate summary (skip for now to debug)
        summary = "Document uploaded successfully"
        try:
            summary = await summarize_document(extracted_text)
        except Exception as e:
            print(f"Warning: Failed to generate summary: {e}")
        
        return {
            "message": "Document uploaded successfully",
            "document": {
                "id": doc_data["id"],
                "title": title,
                "content": extracted_text,
                "file_url": file_url,
                "file_name": original_filename,
                "summary": summary,
                "created_at": doc_data["created_at"]
            }
        }
        
    except Exception as e:
        print(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temporary file
        if temp_file_path:
            await cleanup_temp_file(temp_file_path)

@router.post("/upload-simple")
async def upload_document_simple(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id)
):
    """Simple upload endpoint for testing - bypasses complex processing"""
    try:
        # Validate file type
        if not is_valid_file_type(file.filename):
            raise HTTPException(
                status_code=400, 
                detail="Unsupported file type. Please upload PDF, DOCX, or TXT files."
            )
        
        # Process file content based on type
        if file.filename.lower().endswith('.txt'):
            # For text files, read directly
            content = await file.read()
            extracted_text = content.decode('utf-8')
        else:
            # For PDF and DOCX, use the file processor
            temp_file_path, extracted_text, original_filename = await process_uploaded_file(file, user_id)
            # Clean up temp file immediately
            if temp_file_path:
                await cleanup_temp_file(temp_file_path)
        
        # Generate document title from filename
        title = file.filename.rsplit('.', 1)[0]
        
        # Upload file to Supabase Storage
        file_url = None
        try:
            # Create temporary file for upload
            import tempfile
            import os
            
            # Create temp file
            with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
                # Reset file position
                await file.seek(0)
                content = await file.read()
                temp_file.write(content)
                temp_file_path = temp_file.name
            
            # Upload to Supabase Storage
            file_url = await upload_file_to_bucket(
                file_path=temp_file_path,
                file_name=file.filename,
                user_id=user_id
            )
            
            # Clean up temp file
            os.unlink(temp_file_path)
            
            print(f"✅ File uploaded to Supabase Storage: {file_url}")
            
        except Exception as e:
            print(f"⚠️  Warning: Failed to upload file to Supabase Storage: {e}")
            print("   Document will be saved without file URL")
        
        # Create document in database
        doc_data = await create_document(
            user_id=user_id,
            title=title,
            content=extracted_text,
            file_url=file_url,
            file_name=file.filename
        )
        
        if not doc_data:
            raise HTTPException(status_code=500, detail="Failed to create document")
        
        # Store chunks in vector database (with error handling)
        try:
            await store_document_chunks(
                doc_id=doc_data["id"],
                text=extracted_text,
                metadata={"title": title, "user_id": user_id}
            )
            print(f"✅ Document chunks stored in Pinecone for document {doc_data['id']}")
        except Exception as e:
            print(f"⚠️  Warning: Failed to store document chunks in Pinecone: {e}")
            print("   Document uploaded but Q&A functionality may be limited")
        
        return {
            "message": "Document uploaded successfully (simple mode)",
            "document": {
                "id": doc_data["id"],
                "title": title,
                "content": extracted_text[:500] + "..." if len(extracted_text) > 500 else extracted_text,
                "file_url": file_url,
                "file_name": file.filename,
                "summary": "Document uploaded in simple mode",
                "created_at": doc_data["created_at"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Simple upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{doc_id}/reindex")
async def reindex_document(
    doc_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Reindex a document in the vector database"""
    try:
        # Get document
        document = await get_document(doc_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Verify user owns the document
        verify_user_owns_document(user_id, document["user_id"])
        
        # Delete existing chunks
        try:
            await delete_document_chunks(doc_id)
            print(f"✅ Deleted existing chunks for document {doc_id}")
        except Exception as e:
            print(f"⚠️  Warning: Failed to delete existing chunks: {e}")
        
        # Store new chunks
        try:
            await store_document_chunks(
                doc_id=doc_id,
                text=document["content"],
                metadata={"title": document["title"], "user_id": user_id}
            )
            print(f"✅ Successfully reindexed document {doc_id} in Pinecone")
            
            return {
                "message": "Document reindexed successfully",
                "document_id": doc_id
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to reindex document: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create")
async def create_new_document(
    doc_data: DocumentCreate,
    user_id: str = Depends(get_current_user_id)
):
    """Create a new document from text"""
    try:
        # Create document in database
        doc = await create_document(
            user_id=user_id,
            title=doc_data.title,
            content=doc_data.content
        )
        
        if not doc:
            raise HTTPException(status_code=500, detail="Failed to create document")
        
        # Store chunks in vector database
        await store_document_chunks(
            doc_id=doc["id"],
            text=doc_data.content,
            metadata={"title": doc_data.title, "user_id": user_id}
        )
        
        return {
            "message": "Document created successfully",
            "document": doc
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_documents(user_id: str = Depends(get_current_user_id)):
    """Get all documents for the current user"""
    try:
        documents = await get_user_documents(user_id)
        return {
            "documents": documents
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{doc_id}")
async def get_document_by_id(
    doc_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Get a specific document by ID"""
    try:
        document = await get_document(doc_id)
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Verify user owns the document
        verify_user_owns_document(user_id, document["user_id"])
        
        return {
            "document": document
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{doc_id}")
async def update_document_by_id(
    doc_id: str,
    doc_update: DocumentUpdate,
    user_id: str = Depends(get_current_user_id)
):
    """Update a document"""
    try:
        # Get current document
        current_doc = await get_document(doc_id)
        
        if not current_doc:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Verify user owns the document
        verify_user_owns_document(user_id, current_doc["user_id"])
        
        # Update document
        updated_doc = await update_document(
            doc_id=doc_id, 
            content=doc_update.content or current_doc["content"],
            title=doc_update.title
        )
        
        if not updated_doc:
            raise HTTPException(status_code=500, detail="Failed to update document")
        
        # Update chunks in vector database if content changed
        if doc_update.content is not None:
            # Delete old chunks
            await delete_document_chunks(doc_id)
            
            # Store new chunks
            await store_document_chunks(
                doc_id=doc_id,
                text=doc_update.content,
                metadata={"title": doc_update.title or current_doc["title"], "user_id": user_id}
            )
        
        return {
            "message": "Document updated successfully",
            "document": updated_doc
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{doc_id}")
async def delete_document_by_id(
    doc_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Delete a document"""
    try:
        # Get current document
        current_doc = await get_document(doc_id)
        
        if not current_doc:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Verify user owns the document
        verify_user_owns_document(user_id, current_doc["user_id"])
        
        # Delete chunks from vector database
        await delete_document_chunks(doc_id)
        
        # Delete document from database (this will also delete file from storage)
        deleted_doc = await delete_document(doc_id)
        
        if not deleted_doc:
            raise HTTPException(status_code=500, detail="Failed to delete document")
        
        return {
            "message": "Document deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{doc_id}/summary")
async def get_document_summary(
    doc_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Get a summary of the document"""
    try:
        document = await get_document(doc_id)
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Verify user owns the document
        verify_user_owns_document(user_id, document["user_id"])
        
        # Generate summary
        summary = await summarize_document(document["content"])
        
        return {
            "summary": summary
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 