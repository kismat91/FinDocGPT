import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DocumentAnalysis from './pages/DocumentAnalysis';
import Forecasting from './pages/Forecasting';
import InvestmentStrategy from './pages/InvestmentStrategy';
import SentimentAnalysis from './pages/SentimentAnalysis';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/documents" element={<DocumentAnalysis />} />
            <Route path="/forecasting" element={<Forecasting />} />
            <Route path="/strategy" element={<InvestmentStrategy />} />
            <Route path="/sentiment" element={<SentimentAnalysis />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 