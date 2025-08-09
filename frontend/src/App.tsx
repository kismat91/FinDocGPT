import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          FinDocGPT
        </h1>
        <p className="text-center text-gray-600">
          AI-Powered Financial Document Analysis & Investment Strategy
        </p>
        <div className="mt-8 text-center">
          <p className="text-green-600 font-semibold">
            ✅ Backend API is running on http://localhost:8000
          </p>
          <p className="text-green-600 font-semibold">
            ✅ Frontend is running on http://localhost:3000
          </p>
        </div>
      </div>
    </div>
  );
};

export default App; 