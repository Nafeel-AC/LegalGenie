from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any

from utils.database import get_document, update_document
from utils.vector_store import delete_document_chunks, store_document_chunks
from utils.llm import rewrite_clause, generate_document, summarize_document
from utils.auth import get_current_user_id, verify_user_owns_document

router = APIRouter()

class RewriteRequest(BaseModel):
    doc_id: str
    clause: str
    instruction: str

class GenerateDocumentRequest(BaseModel):
    doc_type: str
    details: Dict[str, Any]

class SummarizeRequest(BaseModel):
    doc_id: str

@router.post("/rewrite-clause")
async def rewrite_legal_clause(
    request: RewriteRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Rewrite a legal clause based on instruction"""
    try:
        # Verify document ownership
        document = await get_document(request.doc_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        verify_user_owns_document(user_id, document["user_id"])
        
        # Rewrite the clause using LLM
        rewritten_clause = await rewrite_clause(
            clause=request.clause,
            instruction=request.instruction
        )
        
        return {
            "original_clause": request.clause,
            "rewritten_clause": rewritten_clause,
            "instruction": request.instruction
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-document")
async def generate_new_document(
    request: GenerateDocumentRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Generate a new legal document"""
    try:
        # Generate document using LLM
        generated_content = await generate_document(
            doc_type=request.doc_type,
            details=request.details
        )
        
        return {
            "doc_type": request.doc_type,
            "content": generated_content,
            "details": request.details
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summarize")
async def summarize_document_endpoint(
    request: SummarizeRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Summarize a legal document"""
    try:
        # Verify document ownership
        document = await get_document(request.doc_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        verify_user_owns_document(user_id, document["user_id"])
        
        # Summarize the document using LLM
        summary = await summarize_document(document["content"])
        
        return {
            "doc_id": request.doc_id,
            "summary": summary
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auto-complete")
async def auto_complete_text(
    text: str,
    context: Optional[str] = None,
    user_id: str = Depends(get_current_user_id)
):
    """Auto-complete legal text"""
    try:
        from utils.llm import get_llm
        from langchain.prompts import PromptTemplate
        from langchain.chains import LLMChain
        
        template = """
        You are a legal expert. Complete the following legal text in a natural and legally sound way:
        
        {text}
        
        Context (if any): {context}
        
        Please continue the text in a way that makes legal sense and follows proper legal writing conventions.
        """
        
        prompt = PromptTemplate(
            input_variables=["text", "context"],
            template=template
        )
        
        chain = LLMChain(llm=get_llm(), prompt=prompt)
        completion = await chain.ainvoke({"text": text, "context": context or ""})
        
        return {
            "original_text": text,
            "completion": completion["text"],
            "full_text": text + completion["text"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/improve-language")
async def improve_language(
    text: str,
    user_id: str = Depends(get_current_user_id)
):
    """Improve the language and clarity of legal text"""
    try:
        from utils.llm import get_llm
        from langchain.prompts import PromptTemplate
        from langchain.chains import LLMChain
        
        template = """
        You are a legal writing expert. Improve the following legal text for clarity, precision, and readability while maintaining its legal meaning:
        
        Original text:
        {text}
        
        Please provide an improved version that:
        1. Is clearer and more readable
        2. Uses precise legal language
        3. Eliminates ambiguity
        4. Maintains the original legal intent
        5. Follows proper legal writing conventions
        """
        
        prompt = PromptTemplate(
            input_variables=["text"],
            template=template
        )
        
        chain = LLMChain(llm=get_llm(), prompt=prompt)
        improved_text = await chain.ainvoke({"text": text})
        
        return {
            "original_text": text,
            "improved_text": improved_text["text"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save-changes")
async def save_document_changes(
    doc_id: str,
    new_content: str,
    user_id: str = Depends(get_current_user_id)
):
    """Save changes to a document and update vector store"""
    try:
        # Verify document ownership
        document = await get_document(doc_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        verify_user_owns_document(user_id, document["user_id"])
        
        # Update document in database
        updated_doc = await update_document(doc_id, new_content)
        
        if not updated_doc:
            raise HTTPException(status_code=500, detail="Failed to update document")
        
        # Update chunks in vector database
        await delete_document_chunks(doc_id)
        await store_document_chunks(
            doc_id=doc_id,
            text=new_content,
            metadata={"title": document["title"], "user_id": user_id}
        )
        
        return {
            "message": "Document updated successfully",
            "document": updated_doc
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/suggest-alternatives")
async def suggest_alternative_phrasing(
    text: str,
    user_id: str = Depends(get_current_user_id)
):
    """Suggest alternative phrasings for legal text"""
    try:
        from utils.llm import get_llm
        from langchain.prompts import PromptTemplate
        from langchain.chains import LLMChain
        
        template = """
        You are a legal expert. Provide 3 alternative phrasings for the following legal text, each with different levels of formality and emphasis:
        
        Original text:
        {text}
        
        Please provide:
        1. A more formal/technical version
        2. A clearer/simpler version
        3. A more comprehensive/detailed version
        
        For each alternative, explain the key differences and when it might be preferred.
        """
        
        prompt = PromptTemplate(
            input_variables=["text"],
            template=template
        )
        
        chain = LLMChain(llm=get_llm(), prompt=prompt)
        alternatives = await chain.ainvoke({"text": text})
        
        return {
            "original_text": text,
            "alternatives": alternatives["text"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 