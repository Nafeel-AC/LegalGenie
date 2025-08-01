import os
from supabase import create_client, Client
from typing import Optional
import uuid
from datetime import datetime
import mimetypes
import re

# Global Supabase client
supabase: Optional[Client] = None

async def init_supabase():
    """Initialize Supabase client"""
    global supabase
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")
    
    supabase = create_client(url, key)
    print("✅ Supabase client initialized")

def get_supabase() -> Client:
    """Get the Supabase client instance"""
    if supabase is None:
        raise RuntimeError("Supabase client not initialized. Call init_supabase() first.")
    return supabase

async def upload_file_to_bucket(file_path: str, file_name: str, user_id: str, bucket_name: str = "documents") -> str:
    """Upload file to Supabase Storage bucket"""
    client = get_supabase()
    
    try:
        # Read file content
        with open(file_path, 'rb') as f:
            file_content = f.read()
        
        # Generate unique file path in bucket
        unique_filename = f"{user_id}/{uuid.uuid4()}_{file_name}"
        
        # Detect MIME type
        ext = os.path.splitext(file_name)[1].lower()
        mime_map = {
            '.pdf': 'application/pdf',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.txt': 'text/plain',
        }
        content_type = mime_map.get(ext) or mimetypes.guess_type(file_name)[0] or 'application/octet-stream'
        
        # Upload to Supabase Storage
        result = client.storage.from_(bucket_name).upload(
            path=unique_filename,
            file=file_content,
            file_options={"content-type": content_type}
        )
        
        # Get public URL
        file_url = client.storage.from_(bucket_name).get_public_url(unique_filename)
        
        return file_url
        
    except Exception as e:
        raise Exception(f"Failed to upload file to Supabase Storage: {str(e)}")

async def delete_file_from_bucket(file_url: str, bucket_name: str = "documents"):
    """Delete file from Supabase Storage bucket"""
    client = get_supabase()
    
    try:
        # Extract file path from URL
        # URL format: https://xxx.supabase.co/storage/v1/object/public/bucket/path
        match = re.search(r"/object/public/([^/]+)/(.+)$", file_url)
        if not match:
            print(f"[Supabase Delete][ERROR] Could not extract file path from URL: {file_url}")
            raise Exception(f"Could not extract file path from URL: {file_url}")
        bucket_from_url, file_path = match.groups()
        if bucket_from_url != bucket_name:
            print(f"[Supabase Delete][ERROR] Bucket name mismatch: expected '{bucket_name}', got '{bucket_from_url}' in URL: {file_url}")
            raise Exception(f"Bucket name mismatch: expected '{bucket_name}', got '{bucket_from_url}' in URL: {file_url}")
        print(f"[Supabase Delete][DEBUG] Attempting to delete file: bucket={bucket_name}, path={file_path}")
        # Delete file
        result = client.storage.from_(bucket_name).remove([file_path])
        print(f"[Supabase Delete][DEBUG] Remove result: {result}")
        # Check result for errors (if the client returns any)
        if hasattr(result, 'error') and result.error:
            print(f"[Supabase Delete][ERROR] Supabase error deleting file: {result.error}")
            raise Exception(f"Supabase error deleting file: {result.error}")
        print(f"[Supabase Delete][SUCCESS] File deleted: {file_path}")
    except Exception as e:
        print(f"[Supabase Delete][EXCEPTION] Failed to delete file from Supabase Storage: {str(e)}")
        raise

async def create_document(user_id: str, title: str, content: str, file_url: Optional[str] = None, file_name: Optional[str] = None):
    """Create a new document in Supabase"""
    client = get_supabase()
    
    data = {
        "user_id": user_id,
        "title": title,
        "content": content,
        "file_url": file_url,
        "file_name": file_name,
        "created_at": "now()",
        "updated_at": "now()"
    }
    
    result = client.table("documents").insert(data).execute()
    return result.data[0] if result.data else None

async def get_document(doc_id: str):
    """Get a document by ID"""
    client = get_supabase()
    result = client.table("documents").select("*").eq("id", doc_id).execute()
    return result.data[0] if result.data else None

async def get_user_documents(user_id: str):
    """Get all documents for a user"""
    client = get_supabase()
    result = client.table("documents").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return result.data

async def update_document(doc_id: str, content: str, title: Optional[str] = None):
    """Update document content"""
    client = get_supabase()
    
    update_data = {
        "content": content,
        "updated_at": "now()"
    }
    
    if title:
        update_data["title"] = title
    
    result = client.table("documents").update(update_data).eq("id", doc_id).execute()
    return result.data[0] if result.data else None

async def delete_document(doc_id: str):
    """Delete a document"""
    client = get_supabase()
    
    # Get document first to delete file from storage
    doc = await get_document(doc_id)
    if doc and doc.get("file_url"):
        await delete_file_from_bucket(doc["file_url"])
    
    result = client.table("documents").delete().eq("id", doc_id).execute()
    return result.data[0] if result.data else None

async def create_user_profile(user_id: str, email: str, name: str):
    """Create or update user profile"""
    client = get_supabase()
    
    data = {
        "id": user_id,
        "email": email,
        "name": name,
        "created_at": "now()",
        "updated_at": "now()"
    }
    
    # Use upsert to handle both insert and update
    result = client.table("profiles").upsert(data).execute()
    return result.data[0] if result.data else None

async def get_user_profile(user_id: str):
    """Get user profile"""
    client = get_supabase()
    result = client.table("profiles").select("*").eq("id", user_id).execute()
    return result.data[0] if result.data else None

async def get_chat_history(user_id: str, document_id: str = None):
    """Get chat history for a user and optionally a specific document"""
    client = get_supabase()
    
    query = client.table("chat_history").select("*").eq("user_id", user_id)
    
    if document_id:
        query = query.eq("document_id", document_id)
    
    result = query.order("created_at", desc=True).execute()
    return result.data

async def create_chat_history(user_id: str, document_id: str, question: str, answer: str, sources: list = None):
    """Create a new chat history entry"""
    client = get_supabase()
    
    data = {
        "user_id": user_id,
        "document_id": document_id,
        "question": question,
        "answer": answer,
        "sources": sources or [],
        "created_at": "now()"
    }
    
    result = client.table("chat_history").insert(data).execute()
    return result.data[0] if result.data else None 