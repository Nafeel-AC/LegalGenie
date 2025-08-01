#!/usr/bin/env python3
"""
Test script to verify Pinecone namespace functionality
"""

import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_namespace_functionality():
    """Test namespace functionality in Pinecone"""
    print("🔍 Testing Pinecone Namespace Functionality...")
    
    try:
        from utils.vector_store import init_pinecone, get_pinecone_index, store_document_chunks, search_similar_chunks, delete_document_chunks
        from langchain_community.embeddings import HuggingFaceEmbeddings
        
        # Initialize Pinecone
        await init_pinecone()
        index = get_pinecone_index()
        
        # Test document IDs
        test_doc_1 = "test-doc-001"
        test_doc_2 = "test-doc-002"
        
        print(f"\n1. Testing namespace creation for document: {test_doc_1}")
        
        # Store chunks for first document
        test_text_1 = "This is a test document about legal contracts. It contains information about employment agreements and non-disclosure clauses."
        await store_document_chunks(
            doc_id=test_doc_1,
            text=test_text_1,
            metadata={"title": "Test Document 1", "user_id": "test-user"}
        )
        
        print(f"\n2. Testing namespace creation for document: {test_doc_2}")
        
        # Store chunks for second document
        test_text_2 = "This is another test document about real estate. It contains information about lease agreements and property management."
        await store_document_chunks(
            doc_id=test_doc_2,
            text=test_text_2,
            metadata={"title": "Test Document 2", "user_id": "test-user"}
        )
        
        print(f"\n3. Testing search within specific namespace")
        
        # Search in first document's namespace
        results_1 = await search_similar_chunks(
            query="employment contracts",
            doc_id=test_doc_1,
            top_k=3
        )
        
        print(f"   Found {len(results_1)} results in document 1 namespace")
        for i, result in enumerate(results_1):
            print(f"   Result {i+1}: {result.get('metadata', {}).get('text', '')[:100]}...")
        
        # Search in second document's namespace
        results_2 = await search_similar_chunks(
            query="real estate",
            doc_id=test_doc_2,
            top_k=3
        )
        
        print(f"   Found {len(results_2)} results in document 2 namespace")
        for i, result in enumerate(results_2):
            print(f"   Result {i+1}: {result.get('metadata', {}).get('text', '')[:100]}...")
        
        print(f"\n4. Testing search across all namespaces")
        
        # Search across all documents
        results_all = await search_similar_chunks(
            query="agreements",
            top_k=5
        )
        
        print(f"   Found {len(results_all)} results across all namespaces")
        for i, result in enumerate(results_all):
            doc_id = result.get('metadata', {}).get('doc_id', 'unknown')
            print(f"   Result {i+1} (doc: {doc_id}): {result.get('metadata', {}).get('text', '')[:100]}...")
        
        print(f"\n5. Testing namespace deletion")
        
        # Delete chunks for first document
        await delete_document_chunks(test_doc_1)
        print(f"   ✅ Deleted namespace for document {test_doc_1}")
        
        # Verify deletion
        results_after_delete = await search_similar_chunks(
            query="employment",
            doc_id=test_doc_1,
            top_k=3
        )
        print(f"   Found {len(results_after_delete)} results after deletion (should be 0)")
        
        # Clean up second document
        await delete_document_chunks(test_doc_2)
        print(f"   ✅ Deleted namespace for document {test_doc_2}")
        
        print(f"\n✅ All namespace tests passed!")
        return True
        
    except Exception as e:
        print(f"\n❌ Namespace test failed: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_namespace_functionality())
    if success:
        print("\n🎉 Namespace functionality is working correctly!")
    else:
        print("\n💥 Namespace functionality needs attention!") 