import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CandidateList from './components/CandidateList';
import CandidateDetail from './components/CandidateDetail';
import Statistics from './components/Statistics';
import { WebSocketProvider } from './context/WebSocketContext';
import './App.css';

function App() {
  return (
    <WebSocketProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<CandidateList />} />
            <Route path="/candidate/:id" element={<CandidateDetail />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </div>
      </Router>
    </WebSocketProvider>
  );
}

export default App;
