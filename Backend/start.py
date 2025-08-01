#!/usr/bin/env python3
"""
LegalGenie Backend Startup Script
"""

import uvicorn
from main import app

if __name__ == "__main__":
    print("🚀 Starting LegalGenie Backend...")
    print("📚 AI-Powered Legal Assistant with LangChain and Gemini")
    print("🌐 Server will be available at: http://localhost:8000")
    print("📖 API Documentation at: http://localhost:8000/docs")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 