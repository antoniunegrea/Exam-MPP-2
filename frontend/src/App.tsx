import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CandidateList from './components/CandidateList';
import CandidateDetail from './components/CandidateDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CandidateList />} />
          <Route path="/candidate/:id" element={<CandidateDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
