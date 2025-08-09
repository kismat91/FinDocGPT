import React, { useState } from 'react';
import { 
  DocumentTextIcon, 
  CloudArrowUpIcon, 
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Document {
  id: number;
  filename: string;
  file_type: string;
  upload_date: string;
}

interface QAResponse {
  question: string;
  answer: string;
  confidence: number;
  sources: string[];
  reasoning?: string;
}

const DocumentAnalysis: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [question, setQuestion] = useState('');
  const [qaResponse, setQaResponse] = useState<QAResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newDocument: Document = {
        id: Date.now(),
        filename: file.name,
        file_type: file.name.split('.').pop() || '',
        upload_date: new Date().toISOString()
      };

      setDocuments(prev => [...prev, newDocument]);
      setSelectedDocument(newDocument);
      setUploadProgress(100);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleAskQuestion = async () => {
    if (!selectedDocument || !question.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const response: QAResponse = {
        question: question,
        answer: `Based on the analysis of ${selectedDocument.filename}, here is the answer to your question: "${question}". The document contains relevant financial information that indicates...`,
        confidence: 0.85,
        sources: [selectedDocument.filename],
        reasoning: "Analysis based on document content and financial metrics extraction."
      };

      setQaResponse(response);
    } catch (error) {
      console.error('Question failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Document Analysis</h1>
        <p className="mt-2 text-gray-600">
          Upload financial documents and ask questions to get AI-powered insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Documents</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors duration-200">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="btn-primary">Choose a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.docx,.txt,.xlsx"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                  />
                </label>
                <p className="mt-2 text-sm text-gray-600">
                  PDF, DOCX, TXT, or XLSX files up to 10MB
                </p>
              </div>
            </div>

            {isLoading && uploadProgress > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Document List */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
            {documents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No documents uploaded yet</p>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${
                      selectedDocument?.id === doc.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <div className="flex items-center space-x-3">
                      <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.filename}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(doc.upload_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <CheckCircleIcon className="w-5 h-5 text-success-500" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Q&A Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ask Questions</h2>
            
            {selectedDocument ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Document: {selectedDocument.filename}
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about the document (e.g., What is the revenue for Q4? What are the key risks?)"
                    className="input-field h-24 resize-none"
                    disabled={isLoading}
                  />
                </div>
                
                <button
                  onClick={handleAskQuestion}
                  disabled={!question.trim() || isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Analyzing...' : 'Ask Question'}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <QuestionMarkCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">Select a document to ask questions</p>
              </div>
            )}
          </div>

          {/* Answer Display */}
          {qaResponse && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Answer</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Question:</p>
                  <p className="text-gray-900">{qaResponse.question}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Answer:</p>
                  <p className="text-gray-900">{qaResponse.answer}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <span className={`text-sm font-medium ${
                      qaResponse.confidence > 0.8 ? 'text-success-600' :
                      qaResponse.confidence > 0.6 ? 'text-warning-600' : 'text-danger-600'
                    }`}>
                      {(qaResponse.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  
                  {qaResponse.reasoning && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <ExclamationTriangleIcon className="w-4 h-4" />
                      <span>AI reasoning available</span>
                    </div>
                  )}
                </div>
                
                {qaResponse.sources.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Sources:</p>
                    <div className="flex flex-wrap gap-2">
                      {qaResponse.sources.map((source, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
                        >
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalysis; 