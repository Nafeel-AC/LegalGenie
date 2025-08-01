#!/usr/bin/env python3
"""
Simple test script to check backend services
Run this to debug 500 errors
"""

import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_services():
    """Test all backend services"""
    print("🔍 Testing LegalGenie Backend Services...")
    
    # Test 1: Environment Variables
    print("\n1. Checking Environment Variables...")
    required_vars = [
        "SUPABASE_URL",
        "SUPABASE_SERVICE_ROLE_KEY", 
        "GEMINI_API_KEY",
        "PINECONE_API_KEY",
        "PINECONE_ENVIRONMENT",
        "PINECONE_INDEX_NAME"
    ]
    
    missing_vars = []
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"   ✅ {var}: {'*' * len(value)}")
        else:
            print(f"   ❌ {var}: MISSING")
            missing_vars.append(var)
    
    if missing_vars:
        print(f"\n   ⚠️  Missing environment variables: {missing_vars}")
        return False
    
    # Test 2: Supabase Connection
    print("\n2. Testing Supabase Connection...")
    try:
        from utils.database import init_supabase, get_supabase
        await init_supabase()
        client = get_supabase()
        print("   ✅ Supabase connection successful")
    except Exception as e:
        print(f"   ❌ Supabase connection failed: {e}")
        return False
    
    # Test 3: Database Tables
    print("\n3. Testing Database Tables...")
    try:
        client = get_supabase()
        result = client.table("profiles").select("count", count="exact").execute()
        print(f"   ✅ Profiles table accessible (count: {result.count})")
        
        result = client.table("documents").select("count", count="exact").execute()
        print(f"   ✅ Documents table accessible (count: {result.count})")
    except Exception as e:
        print(f"   ❌ Database tables test failed: {e}")
        return False
    
    # Test 4: LLM Initialization
    print("\n4. Testing LLM (Gemini) Connection...")
    try:
        from utils.llm import init_llm
        init_llm()
        print("   ✅ LLM initialization successful")
    except Exception as e:
        print(f"   ❌ LLM initialization failed: {e}")
        print("   ⚠️  This will affect document summarization")
    
    # Test 5: Pinecone Connection
    print("\n5. Testing Pinecone Connection...")
    try:
        from utils.vector_store import init_pinecone
        await init_pinecone()
        print("   ✅ Pinecone connection successful")
    except Exception as e:
        print(f"   ❌ Pinecone connection failed: {e}")
        print("   ⚠️  This will affect document search functionality")
    
    # Test 6: File Processing
    print("\n6. Testing File Processing Dependencies...")
    try:
        import aiofiles
        print("   ✅ aiofiles: OK")
    except ImportError:
        print("   ❌ aiofiles: MISSING")
    
    try:
        import PyPDF2
        print("   ✅ PyPDF2: OK")
    except ImportError:
        try:
            import pypdf
            print("   ✅ pypdf: OK (PyPDF2 alternative)")
        except ImportError:
            print("   ❌ PyPDF2/pypdf: MISSING")
    
    try:
        from docx import Document
        print("   ✅ python-docx: OK")
    except ImportError:
        print("   ❌ python-docx: MISSING")
    
    print("\n✅ Backend service tests completed!")
    return True

if __name__ == "__main__":
    asyncio.run(test_services()) 