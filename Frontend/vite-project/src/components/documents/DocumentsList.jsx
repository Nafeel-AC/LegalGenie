import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  FileText, 
  Calendar, 
  Trash2, 
  Edit,
  Eye,
  Filter,
  MoreVertical,
  Grid,
  List,
  Upload,
  FolderOpen,
  HardDrive,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Globe,
  Scale,
  Briefcase,
  Shield,
  Loader2
} from 'lucide-react';
import { documentAPI } from '../../lib/api';
import toast from 'react-hot-toast';

const DocumentsList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, recent, favorites
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [deletingDocId, setDeletingDocId] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentAPI.getAll();
      console.log('API Response:', response);
      console.log('Documents data:', response.data);
      setDocuments(response.data?.documents || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
      setDocuments([]); // Ensure documents is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    const document = documents.find(doc => doc.id === documentId);
    const documentName = document?.title || 'this document';
    
    if (!confirm(`Are you sure you want to delete "${documentName}"?\n\nThis action will permanently delete:\n• The document file from storage\n• All document metadata from the database\n• All vector embeddings from Pinecone\n\nThis action cannot be undone.`)) return;

    try {
      setDeletingDocId(documentId);
      await documentAPI.delete(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success(`"${documentName}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error(`Failed to delete "${documentName}"`);
    } finally {
      setDeletingDocId(null);
    }
  };

  const filteredDocuments = (documents || []).filter(doc => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return matchesSearch && new Date(doc.created_at) > oneWeekAgo;
    }
    
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDocumentIcon = (title) => {
    const lowerTitle = title?.toLowerCase() || '';
    if (lowerTitle.includes('agreement') || lowerTitle.includes('contract')) {
      return { icon: FileText, color: 'bg-blue-500' };
    }
    if (lowerTitle.includes('nda') || lowerTitle.includes('non-disclosure')) {
      return { icon: Shield, color: 'bg-purple-500' };
    }
    if (lowerTitle.includes('employment') || lowerTitle.includes('hr')) {
      return { icon: Users, color: 'bg-green-500' };
    }
    if (lowerTitle.includes('privacy') || lowerTitle.includes('policy')) {
      return { icon: Globe, color: 'bg-purple-500' };
    }
    if (lowerTitle.includes('terms') || lowerTitle.includes('service')) {
      return { icon: Scale, color: 'bg-orange-500' };
    }
    if (lowerTitle.includes('vendor') || lowerTitle.includes('supplier')) {
      return { icon: Briefcase, color: 'bg-teal-500' };
    }
    return { icon: FileText, color: 'bg-gray-500' };
  };

  const getDocumentStatus = (document) => {
    // Mock status based on document age and type
    const daysSinceCreation = Math.floor((new Date() - new Date(document.created_at)) / (1000 * 60 * 60 * 24));
    
    if (daysSinceCreation < 3) {
      return { status: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    } else if (daysSinceCreation < 7) {
      return { status: 'Under Review', color: 'bg-orange-100 text-orange-800', icon: Clock };
    } else {
      return { status: 'Needs Update', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    }
  };

  const getDocumentType = (title) => {
    const lowerTitle = title?.toLowerCase() || '';
    if (lowerTitle.includes('agreement') || lowerTitle.includes('contract')) return 'Contract';
    if (lowerTitle.includes('nda')) return 'Legal';
    if (lowerTitle.includes('employment')) return 'HR';
    if (lowerTitle.includes('privacy')) return 'Compliance';
    if (lowerTitle.includes('terms')) return 'Legal';
    if (lowerTitle.includes('vendor')) return 'Procurement';
    return 'Document';
  };

  const getDocumentTypeColor = (type) => {
    switch (type) {
      case 'Contract': return 'bg-blue-100 text-blue-800';
      case 'Legal': return 'bg-purple-100 text-purple-800';
      case 'HR': return 'bg-green-100 text-green-800';
      case 'Compliance': return 'bg-purple-100 text-purple-800';
      case 'Procurement': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock statistics
  const stats = {
    totalDocuments: documents.length,
    activeProjects: Math.floor(documents.length * 0.3),
    storageUsed: '2.4 GB',
    teamMembers: 12
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 font-medium">Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, John</h1>
            <p className="text-blue-100 text-sm">Manage your documents efficiently and securely</p>
          </div>
          
          <Link
            to="/documents/upload"
            className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
          >
            <Upload size={16} />
            <span>Upload Document</span>
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-medium">Total Documents</p>
                <p className="text-2xl font-bold text-white">{stats.totalDocuments}</p>
                <p className="text-green-300 flex items-center mt-1 text-xs">
                  <TrendingUp size={12} className="mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-medium">Active Projects</p>
                <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
                <p className="text-blue-200 flex items-center mt-1 text-xs">
                  <Clock size={12} className="mr-1" />
                  5 updated today
                </p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FolderOpen size={20} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-medium">Storage Used</p>
                <p className="text-2xl font-bold text-white">{stats.storageUsed}</p>
                <div className="flex items-center mt-1">
                  <div className="flex-1 bg-white/20 rounded-full h-1.5 mr-2">
                    <div className="bg-orange-300 h-1.5 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                  <span className="text-blue-200 text-xs">24% of 10 GB</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <HardDrive size={20} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-medium">Team Members</p>
                <p className="text-2xl font-bold text-white">{stats.teamMembers}</p>
                <p className="text-green-300 flex items-center mt-1 text-xs">
                  <User size={12} className="mr-1" />
                  8 online right now
                </p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search documents by name, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 font-medium"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 font-medium pr-8"
            >
              <option value="all">All Types</option>
              <option value="recent">Recent (Last 7 days)</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-md transition-all duration-200 font-medium ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md transition-all duration-200 font-medium ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Documents</h2>
          <Link to="/documents" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
            View All
          </Link>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <FileText size={64} className="mx-auto text-gray-300 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {searchTerm ? 'No documents found' : 'No documents yet'}
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Upload your first legal document to get started'
              }
            </p>
            {!searchTerm && (
              <Link
                to="/documents/upload"
                className="inline-flex items-center space-x-3 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                <span>Upload Document</span>
              </Link>
            )}
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredDocuments.map((document) => {
              const { icon: DocIcon, color: iconColor } = getDocumentIcon(document.title);
              const { status, color: statusColor, icon: StatusIcon } = getDocumentStatus(document);
              const documentType = getDocumentType(document.title);
              const typeColor = getDocumentTypeColor(documentType);
              
              return (
                <div
                  key={document.id}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${iconColor} rounded-lg flex items-center justify-center shadow-md`}>
                          <DocIcon size={20} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base truncate">
                            {document.title || 'Untitled Document'}
                          </h3>
                          <p className="text-xs text-gray-500 font-medium">
                            {document.file_name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <button 
                          onClick={() => handleDelete(document.id)}
                          disabled={deletingDocId === document.id}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group/delete disabled:opacity-50"
                          title="Delete document"
                        >
                          {deletingDocId === document.id ? (
                            <Loader2 className="w-5 h-5 text-red-600 animate-spin" />
                          ) : (
                            <Trash2 size={18} className="text-gray-400 group-hover/delete:text-red-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span className="font-medium">{formatDate(document.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User size={14} />
                          <span className="font-medium">{Math.floor(Math.random() * 5) + 1}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeColor}`}>
                          {documentType}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor} flex items-center`}>
                          <StatusIcon size={12} className="mr-1" />
                          {status}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {document.content?.substring(0, 100) || 'No content preview available...'}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500 font-medium">
                          {Math.floor(Math.random() * 5) + 1}.{Math.floor(Math.random() * 9)} MB
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/documents/${document.id}`}
                            className="flex items-center space-x-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-all duration-200 font-semibold text-xs"
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </Link>
                          
                          <Link
                            to={`/documents/${document.id}`}
                            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold text-xs"
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </Link>
                          
                          <button
                            onClick={() => handleDelete(document.id)}
                            disabled={deletingDocId === document.id}
                            className="flex items-center space-x-1 px-3 py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-semibold disabled:opacity-50 text-xs"
                            title="Delete document"
                          >
                            {deletingDocId === document.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            <span>
                              {deletingDocId === document.id ? 'Deleting...' : 'Delete'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsList; 