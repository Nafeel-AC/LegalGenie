import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DocumentUpload from './DocumentUpload';

const DocumentUploadPage = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = (document) => {
    // Navigate to the document editor after successful upload
    navigate(`/documents/${document.id}`);
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/documents')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Documents</h1>
            <p className="text-gray-600">Upload your legal documents for AI-powered analysis</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="max-w-4xl mx-auto p-6">
        <DocumentUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      </div>
    </div>
  );
};

export default DocumentUploadPage; 