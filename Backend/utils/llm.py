import os
from typing import List, Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.chains.question_answering import load_qa_chain

# Global LLM instance
llm = None

def init_llm():
    """Initialize Gemini LLM"""
    global llm
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY must be set")
    
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-exp",
        google_api_key=api_key,
        temperature=0.3,
        max_output_tokens=2048
    )
    print("✅ Gemini LLM initialized")

def get_llm():
    """Get the LLM instance"""
    if llm is None:
        raise RuntimeError("LLM not initialized. Call init_llm() first.")
    return llm

async def answer_question_with_context(question: str, context_chunks: List[str]) -> str:
    """Answer a question using RAG with context chunks"""
    if not context_chunks:
        return "I don't have enough context to answer this question. Please upload a document first."
    
    # Combine context chunks
    context = "\n\n".join(context_chunks)
    
    # Create prompt template
    template = """
    You are a legal assistant expert. Answer the following question based on the provided legal document context.
    
    Context:
    {context}
    
    Question: {question}
    
    Answer the question accurately and concisely. If the answer cannot be found in the context, say so.
    """
    
    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template=template
    )
    
    # Create chain
    chain = LLMChain(llm=get_llm(), prompt=prompt)
    
    # Generate response
    response = await chain.ainvoke({"context": context, "question": question})
    return response["text"].strip()

async def rewrite_clause(clause: str, instruction: str, system_instruction: str = None) -> str:
    """Rewrite a legal clause based on instruction"""
    template = """
    You are a legal expert. Rewrite the following legal clause according to the instruction provided.
    
    Original clause:
    {clause}
    
    Instruction: {instruction}
    
    IMPORTANT: Return ONLY the rewritten clause. Do not include explanations, multiple options, or any additional text. Just provide the single rewritten version of the clause.
    """
    
    prompt = PromptTemplate(
        input_variables=["clause", "instruction"],
        template=template
    )
    
    chain = LLMChain(llm=get_llm(), prompt=prompt)
    response = await chain.ainvoke({"clause": clause, "instruction": instruction})
    return response["text"].strip()

async def detect_red_flags(text: str) -> Dict[str, Any]:
    """Detect potential red flags in legal text"""
    template = """
    You are a legal risk assessment expert. Analyze the following legal text and identify potential red flags, risks, or problematic clauses.
    
    Text to analyze:
    {text}
    
    Please provide a JSON response with the following structure:
    {{
        "red_flags": [
            {{
                "type": "risk_category",
                "description": "description of the risk",
                "severity": "high/medium/low",
                "suggestion": "suggestion for improvement"
            }}
        ],
        "overall_risk_level": "high/medium/low",
        "summary": "brief summary of findings"
    }}
    
    Focus on:
    - Unclear or ambiguous language
    - Unfair terms
    - Missing important clauses
    - Excessive liability
    - Unreasonable obligations
    """
    
    prompt = PromptTemplate(
        input_variables=["text"],
        template=template
    )
    
    chain = LLMChain(llm=get_llm(), prompt=prompt)
    response = await chain.ainvoke({"text": text})
    
    # Try to parse JSON response
    try:
        import json
        return json.loads(response["text"])
    except:
        # Fallback to text response
        return {
            "red_flags": [],
            "overall_risk_level": "unknown",
            "summary": response["text"],
            "raw_response": response["text"]
        }

async def generate_document(doc_type: str, details: Dict[str, Any]) -> str:
    """Generate a new legal document"""
    template = """
    You are a legal document generator. Create a {doc_type} based on the following details:
    
    Details:
    {details}
    
    Please generate a complete, legally sound {doc_type} document. Include all necessary sections, proper formatting, and standard legal language.
    """
    
    prompt = PromptTemplate(
        input_variables=["doc_type", "details"],
        template=template
    )
    
    chain = LLMChain(llm=get_llm(), prompt=prompt)
    response = await chain.ainvoke({"doc_type": doc_type, "details": str(details)})
    return response["text"].strip()

async def summarize_document(text: str) -> str:
    """Generate a summary of a legal document"""
    template = """
    You are a legal expert. Provide a comprehensive summary of the following legal document:
    
    Document:
    {text}
    
    Please provide a structured summary including:
    1. Document type and purpose
    2. Key parties involved
    3. Main terms and conditions
    4. Important dates and deadlines
    5. Key obligations and rights
    6. Any notable clauses or provisions
    """
    
    prompt = PromptTemplate(
        input_variables=["text"],
        template=template
    )
    
    chain = LLMChain(llm=get_llm(), prompt=prompt)
    response = await chain.ainvoke({"text": text})
    return response["text"].strip() 