#!/usr/bin/env python3
"""
Test script to verify Pinecone setup and dimensions
"""

import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_pinecone_setup():
    """Test Pinecone connection and dimensions"""
    print("🔍 Testing Pinecone Setup...")
    
    try:
        from utils.vector_store import init_pinecone, get_pinecone_index
        from langchain_community.embeddings import HuggingFaceEmbeddings
        
        # Test 1: Initialize Pinecone
        print("\n1. Initializing Pinecone...")
        await init_pinecone()
        index = get_pinecone_index()
        print("   ✅ Pinecone initialized successfully")
        
        # Test 2: Check index stats
        print("\n2. Checking index statistics...")
        try:
            stats = index.describe_index_stats()
            print(f"   📊 Index stats: {stats}")
        except Exception as e:
            print(f"   ⚠️  Could not get index stats: {e}")
        
        # Test 3: Test embedding model
        print("\n3. Testing embedding model...")
        try:
            embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-mpnet-base-v2",
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True}
            )
            
            # Test with a simple text
            test_text = "This is a test document for legal analysis."
            embedding = embeddings.embed_query(test_text)
            
            print(f"   ✅ Embedding model loaded successfully")
            print(f"   📏 Embedding dimension: {len(embedding)}")
            
            if len(embedding) == 768:
                print("   ✅ Dimension matches Pinecone index (768)")
            else:
                print(f"   ❌ Dimension mismatch! Expected 768, got {len(embedding)}")
                return False
                
        except Exception as e:
            print(f"   ❌ Failed to test embedding model: {e}")
            return False
        
        # Test 4: Test vector storage
        print("\n4. Testing vector storage...")
        try:
            test_vector = {
                "id": "test_vector_001",
                "values": embedding,
                "metadata": {
                    "doc_id": "test_doc",
                    "text": test_text,
                    "test": True
                }
            }
            
            # Upsert test vector
            index.upsert(vectors=[test_vector])
            print("   ✅ Successfully stored test vector")
            
            # Query test vector
            results = index.query(
                vector=embedding,
                top_k=1,
                filter={"test": True},
                include_metadata=True
            )
            
            if results.matches:
                print("   ✅ Successfully retrieved test vector")
                print(f"   📄 Retrieved text: {results.matches[0].metadata.get('text', 'N/A')}")
            else:
                print("   ⚠️  No test vector found in query")
            
            # Clean up test vector
            index.delete(ids=["test_vector_001"])
            print("   ✅ Cleaned up test vector")
            
        except Exception as e:
            print(f"   ❌ Failed to test vector storage: {e}")
            return False
        
        print("\n✅ All Pinecone tests passed!")
        return True
        
    except Exception as e:
        print(f"\n❌ Pinecone test failed: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_pinecone_setup())
    if success:
        print("\n🎉 Pinecone is ready for use!")
    else:
        print("\n💥 Pinecone setup needs attention!") 