import axios from 'axios';
import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error('Error getting session for API request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Handle unauthorized/forbidden access
      console.error('Authentication error:', error.response?.status, error.response?.data);
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Document API
export const documentAPI = {
  // Upload document
  upload: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use simple upload endpoint for testing
    return api.post('/api/documents/upload-simple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },

  // Get all documents
  getAll: async () => {
    return api.get('/api/documents/');
  },

  // Get single document
  getById: async (id) => {
    return api.get(`/api/documents/${id}`);
  },

  // Update document
  update: async (id, data) => {
    return api.put(`/api/documents/${id}`, data);
  },

  // Delete document
  delete: async (id) => {
    return api.delete(`/api/documents/${id}`);
  },
};

// Q&A API
export const qaAPI = {
  // Ask question about document
  askQuestion: async (documentId, question) => {
    return api.post('/api/qa/ask', {
      doc_id: documentId,
      question: question,
    });
  },

  // Get chat history
  getChatHistory: async (documentId) => {
    return api.get(`/api/qa/chat-history/${documentId}`);
  },

  // Analyze document
  analyzeDocument: async (documentId) => {
    return api.post(`/api/qa/analyze/${documentId}`);
  },
};

// Editing API
export const editingAPI = {
  // Rewrite clause
  rewriteClause: async (documentId, clause, instruction) => {
    return api.post('/api/editing/rewrite-clause', {
      doc_id: documentId,
      clause: clause,
      instruction: instruction,
    });
  },

  // Detect red flags
  detectRedFlags: async (documentId) => {
    return api.post('/api/qa/red-flags', {
      doc_id: documentId,
    });
  },

  // Generate document
  generateDocument: async (docType, details) => {
    return api.post('/api/editing/generate-document', {
      doc_type: docType,
      details: details,
    });
  },

  // Summarize document
  summarizeDocument: async (documentId) => {
    return api.post('/api/editing/summarize', {
      doc_id: documentId,
    });
  },
};

// Auth API
export const authAPI = {
  // Get current user
  getCurrentUser: async () => {
    return api.get('/api/auth/me');
  },

  // Refresh token
  refreshToken: async () => {
    return api.post('/api/auth/refresh');
  },
};

export default api; 