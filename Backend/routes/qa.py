from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional

from utils.database import get_document, get_chat_history, create_chat_history
from utils.vector_store import search_similar_chunks
from utils.llm import answer_question_with_context, detect_red_flags
from utils.auth import get_current_user_id, verify_user_owns_document

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str
    doc_id: Optional[str] = None

class RedFlagRequest(BaseModel):
    doc_id: str
    text: Optional[str] = None

@router.post("/ask")
async def ask_question(
    request: QuestionRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Ask a question about a document using RAG"""
    try:
        # If doc_id is provided, search within that document
        if request.doc_id:
            # Verify document ownership
            document = await get_document(request.doc_id)
            if not document:
                raise HTTPException(status_code=404, detail="Document not found")
            
            verify_user_owns_document(user_id, document["user_id"])
            
            # Search for relevant chunks in the specific document
            try:
                chunks = await search_similar_chunks(
                    query=request.question,
                    doc_id=request.doc_id,
                    top_k=5
                )
            except Exception as e:
                print(f"Warning: Vector search failed, using document content: {e}")
                # Fallback: use the entire document content
                chunks = [{"metadata": {"text": document["content"]}, "score": 1.0}]
        else:
            # Search across all user documents
            try:
                chunks = await search_similar_chunks(
                    query=request.question,
                    top_k=5
                )
            except Exception as e:
                print(f"Warning: Vector search failed: {e}")
                chunks = []
        
        # Extract text from chunks
        context_chunks = [chunk.get("metadata", {}).get("text", "") for chunk in chunks if chunk.get("metadata")]
        
        # Generate answer using LLM
        answer = await answer_question_with_context(
            question=request.question,
            context_chunks=context_chunks
        )
        
        return {
            "question": request.question,
            "answer": answer,
            "sources": [
                {
                    "text": chunk.get("metadata", {}).get("text", "")[:200] + "...",
                    "score": chunk.get("score", 0),
                    "doc_id": chunk.get("metadata", {}).get("doc_id"),
                    "title": chunk.get("metadata", {}).get("title", "Unknown")
                }
                for chunk in chunks
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/red-flags")
async def detect_red_flags_in_document(
    request: RedFlagRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Detect red flags in a document"""
    try:
        # Get document
        document = await get_document(request.doc_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        verify_user_owns_document(user_id, document["user_id"])
        
        # Use provided text or document content
        text_to_analyze = request.text if request.text else document["content"]
        
        # Detect red flags
        red_flags = await detect_red_flags(text_to_analyze)
        
        return {
            "doc_id": request.doc_id,
            "red_flags": red_flags
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-clause")
async def analyze_clause(
    clause: str,
    user_id: str = Depends(get_current_user_id)
):
    """Analyze a specific clause for risks and issues"""
    try:
        # Detect red flags in the clause
        analysis = await detect_red_flags(clause)
        
        return {
            "clause": clause,
            "analysis": analysis
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/suggestions/{doc_id}")
async def get_document_suggestions(
    doc_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Get AI-generated suggestions for improving a document"""
    try:
        # Get document
        document = await get_document(doc_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        verify_user_owns_document(user_id, document["user_id"])
        
        # Generate suggestions using LLM
        suggestions_prompt = f"""
        Analyze this legal document and provide specific suggestions for improvement:
        
        {document['content']}
        
        Please provide suggestions in the following areas:
        1. Clarity and readability
        2. Legal completeness
        3. Risk mitigation
        4. Missing clauses
        5. Ambiguous language
        """
        
        from utils.llm import get_llm
        from langchain.prompts import PromptTemplate
        from langchain.chains import LLMChain
        
        template = PromptTemplate(
            input_variables=["content"],
            template=suggestions_prompt
        )
        
        chain = LLMChain(llm=get_llm(), prompt=template)
        suggestions = await chain.ainvoke({"content": document['content']})
        
        return {
            "doc_id": doc_id,
            "suggestions": suggestions["text"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chat-history/{doc_id}")
async def get_chat_history_for_document(
    doc_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Get chat history for a specific document"""
    try:
        # Verify document ownership
        document = await get_document(doc_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        verify_user_owns_document(user_id, document["user_id"])
        
        # Get chat history
        chat_history = await get_chat_history(user_id, doc_id)
        
        return {
            "chat_history": chat_history
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat-history/{doc_id}")
async def add_chat_message(
    doc_id: str,
    request: QuestionRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Add a new chat message and get response"""
    try:
        # Verify document ownership
        document = await get_document(doc_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        verify_user_owns_document(user_id, document["user_id"])
        
        # Search for relevant chunks
        try:
            chunks = await search_similar_chunks(
                query=request.question,
                doc_id=doc_id,
                top_k=5
            )
        except Exception as e:
            print(f"Warning: Vector search failed, using document content: {e}")
            # Fallback: use the entire document content
            chunks = [{"metadata": {"text": document["content"]}, "score": 1.0}]
        
        # Extract text from chunks
        context_chunks = [chunk.get("metadata", {}).get("text", "") for chunk in chunks if chunk.get("metadata")]
        
        # Generate answer using LLM
        answer = await answer_question_with_context(
            question=request.question,
            context_chunks=context_chunks
        )
        
        # Save to chat history
        chat_entry = await create_chat_history(
            user_id=user_id,
            document_id=doc_id,
            question=request.question,
            answer=answer,
            sources=[chunk.get("metadata", {}) for chunk in chunks]
        )
        
        return {
            "question": request.question,
            "answer": answer,
            "chat_id": chat_entry["id"],
            "sources": [
                {
                    "text": chunk.get("metadata", {}).get("text", "")[:200] + "...",
                    "score": chunk.get("score", 0),
                    "doc_id": chunk.get("metadata", {}).get("doc_id"),
                    "title": chunk.get("metadata", {}).get("title", "Unknown")
                }
                for chunk in chunks
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 