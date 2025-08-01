from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os

from routes import documents, qa, editing, auth
from utils.database import init_supabase
from utils.vector_store import init_pinecone, init_embeddings
from utils.llm import init_llm
from utils.auth import security

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup and cleanup on shutdown"""
    # Startup
    await init_supabase()
    await init_pinecone()
    await init_embeddings()
    init_llm()
    print("🚀 LegalGenie API started successfully!")
    
    yield
    
    # Shutdown
    print("🛑 LegalGenie API shutting down...")

app = FastAPI(
    title="LegalGenie API",
    description="AI-Powered Legal Assistant with LangChain and Gemini",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(qa.router, prefix="/api/qa", tags=["Q&A"])
app.include_router(editing.router, prefix="/api/editing", tags=["Editing"])



@app.get("/")
async def root():
    return {"message": "LegalGenie API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "LegalGenie API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 