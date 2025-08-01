import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  MessageSquare, 
  AlertTriangle, 
  FileText, 
  ArrowLeft,
  Loader2,
  Send,
  Sparkles,
  Bot,
  X,
  Minimize2,
  Maximize2,
  Edit3,
  Wand2
} from 'lucide-react';
import TipTapEditor from './TipTapEditor';
import { documentAPI, qaAPI, editingAPI } from '../../lib/api';
import toast from 'react-hot-toast';

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [documentData, setDocumentData] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [aiAgentPosition, setAIAgentPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [inlineEditMode, setInlineEditMode] = useState(false);
  const [inlineEditText, setInlineEditText] = useState('');
  const [inlineEditPosition, setInlineEditPosition] = useState({ x: 0, y: 0 });
  const aiAgentRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const response = await documentAPI.getById(id);
      setDocumentData(response.data.document);
      setContent(response.data.document?.content || '');
      await loadChatHistory();
    } catch (error) {
      console.error('Error loading document:', error);
      toast.error('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await qaAPI.getChatHistory(id);
      setChatHistory(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setChatHistory([]);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await documentAPI.update(id, { content });
      toast.success('Document saved successfully!');
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    try {
      setAiLoading(true);
      const response = await qaAPI.askQuestion(id, question);
      
      const newChat = {
        id: Date.now(),
        question: question,
        answer: response.data.answer,
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => Array.isArray(prev) ? [...prev, newChat] : [newChat]);
      setQuestion('');
      toast.success('Question answered!');
    } catch (error) {
      console.error('Error asking question:', error);
      toast.error('Failed to get answer');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDetectRedFlags = async () => {
    try {
      setAiLoading(true);
      const response = await editingAPI.detectRedFlags(id);
      
      // Format the red flags response for display
      let formattedAnswer = 'Analysis complete. No red flags detected.';
      
      if (response.data.red_flags && Array.isArray(response.data.red_flags) && response.data.red_flags.length > 0) {
        const redFlagsList = response.data.red_flags.map((flag, index) => 
          `${index + 1}. **${flag.type}** (${flag.severity}): ${flag.description}\n   Suggestion: ${flag.suggestion}`
        ).join('\n\n');
        
        formattedAnswer = `**Red Flags Analysis**\n\n**Overall Risk Level:** ${response.data.overall_risk_level || 'Unknown'}\n\n**Summary:** ${response.data.summary || 'Analysis complete.'}\n\n**Detected Issues:**\n\n${redFlagsList}`;
      } else if (response.data.summary) {
        formattedAnswer = `**Red Flags Analysis**\n\n**Summary:** ${response.data.summary}`;
      }
      
      // Add to chat history
      const newChat = {
        id: Date.now(),
        question: 'Detect red flags in this document',
        answer: formattedAnswer,
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => Array.isArray(prev) ? [...prev, newChat] : [newChat]);
      toast.success('Red flags analysis complete!');
    } catch (error) {
      console.error('Error detecting red flags:', error);
      toast.error('Failed to detect red flags');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSummarize = async () => {
    try {
      setAiLoading(true);
      const response = await editingAPI.summarizeDocument(id);
      
      // Add to chat history
      const newChat = {
        id: Date.now(),
        question: 'Summarize this document',
        answer: response.data.summary || 'Summary generated successfully.',
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => Array.isArray(prev) ? [...prev, newChat] : [newChat]);
      toast.success('Document summarized!');
    } catch (error) {
      console.error('Error summarizing document:', error);
      toast.error('Failed to summarize document');
    } finally {
      setAiLoading(false);
    }
  };

  const handleInlineEdit = async () => {
    if (!selectedText.trim() || !inlineEditText.trim()) return;

    try {
      setAiLoading(true);
      const response = await editingAPI.rewriteClause(id, selectedText, inlineEditText);
      
      // Replace selected text in the editor using TipTap API
      if (editorRef.current) {
        // Delete the selected text first
        editorRef.current.chain().focus().deleteSelection().run();
        // Insert the rewritten clause
        editorRef.current.chain().focus().insertContent(response.data.rewritten_clause).run();
        // Update content state to match editor
        setContent(editorRef.current.getHTML());
      }
      
      setSelectedText('');
      setInlineEditText('');
      setInlineEditMode(false);
      toast.success('Text edited successfully!');
      
      // Auto-save after inline edit
      await documentAPI.update(id, { content: editorRef.current ? editorRef.current.getHTML() : content });
      toast.success('Document saved successfully!');
    } catch (error) {
      console.error('Error editing text:', error);
      toast.error('Failed to edit text');
    } finally {
      setAiLoading(false);
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.ai-agent-content')) return;
    
    setIsDragging(true);
    const rect = aiAgentRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Keep within viewport bounds
    const maxX = window.innerWidth - 400;
    const maxY = window.innerHeight - 300;

    setAIAgentPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging && typeof document !== 'undefined') {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleTextSelection = (selectedText, position) => {
    setSelectedText(selectedText);
    setInlineEditPosition(position);
    setInlineEditMode(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 relative">
      {/* Minimal Header */}
      <header className="sticky top-0 z-20 w-full backdrop-blur-md bg-white/70 border-b border-blue-100 shadow-sm flex items-center justify-between px-4 py-2">
        <button
          onClick={() => navigate('/documents')}
          className="p-2 rounded-full hover:bg-blue-100 transition-colors"
          title="Back to Documents"
        >
          <ArrowLeft size={18} className="text-blue-600" />
        </button>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAIAgent(!showAIAgent)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-lg"
          >
            <Bot size={16} />
            <span className="font-medium">AI Assistant</span>
          </button>
          
          <button
            onClick={handleDetectRedFlags}
            disabled={aiLoading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            <AlertTriangle size={16} />
            <span className="font-medium">Analyze</span>
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span className="font-medium">{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </header>

      {/* Centered Width, Full Height Editor */}
      <main className="flex-1 flex justify-center p-6">
        <div className="w-full max-w-4xl h-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <TipTapEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing your legal document..."
            onTextSelection={handleTextSelection}
            onEditorReady={editor => { editorRef.current = editor; }}
          />
        </div>
      </main>

      {/* Draggable AI Agent */}
      {showAIAgent && (
        <div
          ref={aiAgentRef}
          className={`fixed z-30 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${
            isMinimized ? 'w-80 h-12' : 'w-96 h-[500px]'
          }`}
          style={{
            left: aiAgentPosition.x,
            top: aiAgentPosition.y,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
        >
          {/* AI Agent Header */}
          <div className="bg-purple-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <span className="font-medium">AI Legal Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-purple-500 rounded transition-colors"
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <button
                onClick={() => setShowAIAgent(false)}
                className="p-1 hover:bg-purple-500 rounded transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* AI Agent Content */}
          {!isMinimized && (
            <div className="ai-agent-content h-full flex flex-col">
              {/* Chat Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4" style={{ maxHeight: '300px' }}>
                {/* Welcome Message */}
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-2xl rounded-bl-md max-w-[85%] shadow-sm">
                    <p className="text-sm leading-relaxed">
                      👋 Hi! I'm your AI legal assistant. Ask me anything about your document, 
                      request analysis, or get help with editing.
                    </p>
                  </div>
                </div>
                
                {/* Chat History */}
                {chatHistory && chatHistory.map((chat) => (
                  <div key={chat.id} className="space-y-3">
                    {/* User Question - Aligned to the right */}
                    <div className="flex justify-end">
                      <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-br-md max-w-[80%] shadow-sm">
                        <p className="text-sm font-medium">{chat.question}</p>
                      </div>
                    </div>
                    
                    {/* AI Answer - Aligned to the left */}
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-md max-w-[80%] shadow-sm">
                        <p className="text-sm leading-relaxed">{chat.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Loading State */}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-600 p-3 rounded-2xl rounded-bl-md max-w-[80%] shadow-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin text-gray-500" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions & Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={handleDetectRedFlags}
                    disabled={aiLoading}
                    className="flex items-center gap-2 p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 text-xs"
                  >
                    <AlertTriangle size={14} />
                    Red Flags
                  </button>
                  <button
                    onClick={handleSummarize}
                    disabled={aiLoading}
                    className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 text-xs"
                  >
                    <Sparkles size={14} />
                    Summarize
                  </button>
                </div>

                {/* Question Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                  />
                  <button
                    onClick={handleAskQuestion}
                    disabled={aiLoading || !question.trim()}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inline Edit Popup */}
      {inlineEditMode && (
        <div
          className="fixed z-40 bg-white rounded-lg shadow-xl border border-blue-200 p-4"
          style={{
            left: inlineEditPosition.x,
            top: inlineEditPosition.y,
            minWidth: '300px'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Wand2 size={16} className="text-blue-600" />
              AI Edit
            </h4>
            <button
              onClick={() => setInlineEditMode(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">Selected text:</p>
            <p className="text-sm bg-gray-50 p-2 rounded border">{selectedText}</p>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How would you like to edit this?
            </label>
            <textarea
              value={inlineEditText}
              onChange={(e) => setInlineEditText(e.target.value)}
              placeholder="Describe how you want to edit this text..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleInlineEdit}
              disabled={aiLoading || !inlineEditText.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
            >
              {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Edit3 size={14} />}
              {aiLoading ? 'Editing...' : 'Apply Edit'}
            </button>
            <button
              onClick={() => setInlineEditMode(false)}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentEditor; 