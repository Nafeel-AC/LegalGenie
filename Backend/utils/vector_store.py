import os
from pinecone import Pinecone, ServerlessSpec
from typing import List, Dict, Any
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
import tiktoken

# Global Pinecone client, index, and embeddings model
pinecone_client = None
pinecone_index = None
embeddings_model = None

async def init_pinecone():
    """Initialize Pinecone client and index"""
    global pinecone_client, pinecone_index
    
    api_key = os.getenv("PINECONE_API_KEY")
    environment = os.getenv("PINECONE_ENVIRONMENT")
    index_name = os.getenv("PINECONE_INDEX_NAME")
    
    if not all([api_key, index_name]):
        raise ValueError("PINECONE_API_KEY and PINECONE_INDEX_NAME must be set")
    
    # Initialize Pinecone client
    pinecone_client = Pinecone(api_key=api_key)
    
    # Check if index exists
    existing_indexes = pinecone_client.list_indexes().names()
    print(f"🔍 Available Pinecone indexes: {existing_indexes}")
    
    if index_name in existing_indexes:
        print(f"✅ Using existing index: {index_name}")
        # Get index description to verify dimensions
        try:
            index_description = pinecone_client.describe_index(index_name)
            print(f"   Index details: {index_description}")
        except Exception as e:
            print(f"   Warning: Could not get index details: {e}")
    else:
        print(f"🆕 Creating new index: {index_name}")
        try:
            pinecone_client.create_index(
                name=index_name,
                dimension=768,  # Your existing index dimension
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region="us-east-1"
                )
            )
            print(f"✅ Successfully created index: {index_name}")
        except Exception as e:
            print(f"❌ Failed to create index: {e}")
            raise
    
    # Connect to index
    try:
        pinecone_index = pinecone_client.Index(index_name)
        print(f"✅ Successfully connected to Pinecone index '{index_name}'")
        print(f"   Environment: {environment}")
        print(f"   Dimensions: 768")
        print(f"   Embeddings: Hugging Face (all-mpnet-base-v2)")
    except Exception as e:
        print(f"❌ Failed to connect to index: {e}")
        raise

async def init_embeddings():
    """Initialize Hugging Face Embeddings model once at startup"""
    global embeddings_model
    try:
        embeddings_model = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-mpnet-base-v2",
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )
        print(f"✅ Hugging Face embeddings model loaded (global)")
    except Exception as e:
        print(f"❌ Failed to load embeddings model: {e}")
        raise

def get_pinecone_index():
    """Get the Pinecone index instance"""
    if pinecone_index is None:
        raise RuntimeError("Pinecone index not initialized. Call init_pinecone() first.")
    return pinecone_index

def get_pinecone_client():
    """Get the Pinecone client instance"""
    if pinecone_client is None:
        raise RuntimeError("Pinecone client not initialized. Call init_pinecone() first.")
    return pinecone_client

def get_embeddings_model():
    """Get the global Hugging Face Embeddings model instance"""
    if embeddings_model is None:
        raise RuntimeError("Embeddings model not initialized. Call init_embeddings() first.")
    return embeddings_model

def chunk_text(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
    """Split text into chunks for vector storage"""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )
    return text_splitter.split_text(text)

async def store_document_chunks(doc_id: str, text: str, metadata: Dict[str, Any] = None):
    """Store document chunks in Pinecone with document-specific namespace"""
    index = get_pinecone_index()
    
    # Use document ID as namespace
    namespace = f"doc_{doc_id}"
    
    # Split text into chunks
    chunks = chunk_text(text)
    print(f"📄 Split document into {len(chunks)} chunks")
    print(f"🏷️  Using namespace: {namespace}")
    
    # Use global embeddings model
    try:
        embeddings = get_embeddings_model()
    except Exception as e:
        print(f"❌ Failed to get embeddings model: {e}")
        raise
    
    # Prepare vectors for Pinecone
    vectors = []
    for i, chunk in enumerate(chunks):
        try:
            embedding = embeddings.embed_query(chunk)
            
            # Verify embedding dimension
            if len(embedding) != 768:
                print(f"⚠️  Warning: Embedding dimension is {len(embedding)}, expected 768")
            
            vector_data = {
                "id": f"chunk_{i}",
                "values": embedding,
                "metadata": {
                    "doc_id": doc_id,
                    "chunk_index": i,
                    "text": chunk,
                    **(metadata or {})
                }
            }
            vectors.append(vector_data)
            
        except Exception as e:
            print(f"❌ Failed to create embedding for chunk {i}: {e}")
            raise
    
    # Upsert to Pinecone with namespace
    try:
        index.upsert(vectors=vectors, namespace=namespace)
        print(f"✅ Successfully stored {len(chunks)} chunks for document {doc_id} in namespace {namespace}")
        return len(chunks)
    except Exception as e:
        print(f"❌ Failed to upsert vectors to Pinecone: {e}")
        raise

async def search_similar_chunks(query: str, doc_id: str = None, top_k: int = 5) -> List[Dict]:
    """Search for similar chunks in Pinecone with namespace support"""
    index = get_pinecone_index()
    
    try:
        # Use global embeddings model
        embeddings = get_embeddings_model()
        query_embedding = embeddings.embed_query(query)
        
        # Verify embedding dimension
        if len(query_embedding) != 768:
            print(f"⚠️  Warning: Query embedding dimension is {len(query_embedding)}, expected 768")
        
        # If doc_id is provided, search in that document's namespace
        if doc_id:
            namespace = f"doc_{doc_id}"
            print(f"🔍 Searching in namespace: {namespace}")
            
            results = index.query(
                vector=query_embedding,
                top_k=top_k,
                namespace=namespace,
                include_metadata=True
            )
        else:
            # Search across all namespaces (all documents)
            print(f"🔍 Searching across all namespaces")
            
            results = index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True
            )
        
        print(f"🔍 Found {len(results.matches)} similar chunks")
        return results.matches
        
    except Exception as e:
        print(f"❌ Failed to search Pinecone: {e}")
        raise

async def delete_document_chunks(doc_id: str):
    """Delete all chunks for a document using namespace"""
    index = get_pinecone_index()
    
    # Use document ID as namespace
    namespace = f"doc_{doc_id}"
    
    try:
        # Delete all vectors in the namespace
        index.delete(namespace=namespace, delete_all=True)
        print(f"✅ Deleted all chunks for document {doc_id} in namespace {namespace}")
        return True
    except Exception as e:
        # Check if it's a "namespace not found" error
        if "Namespace not found" in str(e) or "404" in str(e):
            print(f"⚠️  Namespace {namespace} not found for document {doc_id} (may not have been indexed)")
            return True  # Consider this a success since the goal is achieved
        else:
            print(f"❌ Failed to delete chunks for document {doc_id}: {e}")
            raise

async def check_document_indexed(doc_id: str) -> bool:
    """Check if a document has been indexed in Pinecone"""
    index = get_pinecone_index()
    namespace = f"doc_{doc_id}"
    
    try:
        # Try to query the namespace to see if it exists
        results = index.query(
            vector=[0] * 768,  # Dummy vector
            top_k=1,
            namespace=namespace,
            include_metadata=False
        )
        return len(results.matches) > 0
    except Exception as e:
        if "Namespace not found" in str(e) or "404" in str(e):
            return False
        else:
            print(f"⚠️  Error checking if document {doc_id} is indexed: {e}")
            return False

async def migrate_old_document_to_namespace(doc_id: str, content: str, metadata: dict = None):
    """Migrate an old document (without namespace) to new namespace format"""
    print(f"🔄 Migrating document {doc_id} to namespace format...")
    
    try:
        # Store in new namespace format
        await store_document_chunks(
            doc_id=doc_id,
            text=content,
            metadata=metadata or {}
        )
        
        print(f"✅ Successfully migrated document {doc_id} to namespace format")
        return True
        
    except Exception as e:
        print(f"❌ Failed to migrate document {doc_id}: {e}")
        return False 