# LegalGenie Backend

AI-Powered Legal Assistant Backend with FastAPI, LangChain, and Gemini

## 🚀 Quick Start

### 1. Set Up Supabase Database

First, run the complete database schema in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of supabase_schema.sql
-- This will create all tables, policies, and storage buckets
```

**What the schema creates:**
- ✅ User profiles table with automatic creation
- ✅ Documents table with file storage
- ✅ Document versioning system
- ✅ AI analysis storage
- ✅ Chat history tracking
- ✅ Row Level Security (RLS) policies
- ✅ Storage bucket for file uploads
- ✅ Automatic triggers and functions
- ✅ JWT-based authentication system

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Set Environment Variables

Make sure your `.env` file contains:

```env
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_pinecone_env
PINECONE_INDEX_NAME=your_index_name
```

### 4. Run the Server

```bash
python start.py
```

Or:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Documents
- `POST /api/documents/upload` - Upload document file
- `POST /api/documents/create` - Create document from text
- `GET /api/documents/` - Get all user documents
- `GET /api/documents/{doc_id}` - Get specific document
- `PUT /api/documents/{doc_id}` - Update document
- `DELETE /api/documents/{doc_id}` - Delete document
- `GET /api/documents/{doc_id}/summary` - Get document summary

### Q&A
- `POST /api/qa/ask` - Ask question about documents
- `POST /api/qa/red-flags` - Detect red flags in document
- `POST /api/qa/analyze-clause` - Analyze specific clause
- `GET /api/qa/suggestions/{doc_id}` - Get document suggestions

### Editing
- `POST /api/editing/rewrite-clause` - Rewrite legal clause
- `POST /api/editing/generate-document` - Generate new document
- `POST /api/editing/auto-complete` - Auto-complete text
- `POST /api/editing/improve-language` - Improve text clarity
- `POST /api/editing/save-changes` - Save document changes
- `POST /api/editing/suggest-alternatives` - Suggest alternatives

## 🏗️ Architecture

### Core Components

1. **FastAPI** - Web framework
2. **LangChain** - LLM orchestration
3. **Gemini Pro** - Primary LLM
4. **Pinecone** - Vector database for RAG
5. **Supabase** - Document storage and auth

### File Structure

```
Backend/
├── main.py              # FastAPI app entry point
├── start.py             # Startup script
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables
├── routes/              # API route handlers
│   ├── auth.py         # Authentication routes
│   ├── documents.py    # Document management
│   ├── qa.py          # Q&A and analysis
│   └── editing.py     # Document editing
├── utils/              # Utility modules
│   ├── database.py    # Supabase operations
│   ├── vector_store.py # Pinecone operations
│   ├── llm.py         # Gemini LLM integration
│   └── file_processor.py # File handling
└── uploads/           # Uploaded files (created automatically)
```

## 🔄 Workflow

1. **Document Upload**: Files are uploaded to Supabase Storage and text is extracted
2. **Vector Storage**: Text is chunked and stored in Pinecone for semantic search
3. **Database Storage**: Full document stored in Supabase with metadata
4. **RAG Q&A**: Questions answered using vector similarity search
5. **AI Editing**: LLM assists with document rewriting and generation
6. **Version Control**: Automatic versioning of document changes

## 🧠 Features

- ✅ Document upload (PDF, DOCX, TXT) to Supabase Storage
- ✅ RAG-based question answering with Pinecone
- ✅ Red flag detection and risk assessment
- ✅ AI-assisted clause rewriting
- ✅ Document generation from templates
- ✅ Real-time editing support
- ✅ Vector similarity search
- ✅ User authentication with Supabase Auth
- ✅ Document versioning and history
- ✅ Chat history tracking
- ✅ File storage with automatic cleanup

## 🔐 Security

- **JWT-based authentication** with Supabase Auth
- **Row Level Security (RLS)** on all tables
- **User document isolation** - users can only access their own data
- **File type validation** and size limits
- **Input sanitization** and validation
- **Automatic token refresh** handling
- **Secure file storage** with user-based access control

## 🚀 Deployment

### Local Development
```bash
python start.py
```

### Production
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📝 Notes

- **Production-ready authentication** with Supabase Auth
- **Automatic user profile creation** on registration
- **Token-based API access** - all endpoints require authentication
- **Automatic document versioning** on content changes
- **File cleanup** - temporary files are automatically removed
- Consider adding rate limiting for production use
- Consider adding caching for better performance 