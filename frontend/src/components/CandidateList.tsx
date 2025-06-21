import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Candidate, getCandidates, deleteCandidate } from '../types/Candidate';
import CandidateForm from './CandidateForm';
import './CandidateList.css';

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchCandidates = useCallback(async () => {
    // Prevent multiple fetches
    if (hasLoaded) {
      return;
    }

    console.log('Fetching candidates...'); // Debug log
    try {
      setLoading(true);
      const data = await getCandidates();
      console.log('Candidates fetched:', data.length); // Debug log
      setCandidates(data);
      setHasLoaded(true);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  }, [hasLoaded]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleCandidateClick = (candidateId: number) => {
    navigate(`/candidate/${candidateId}`);
  };

  const handleAddCandidate = () => {
    setFormMode('create');
    setEditingCandidate(null);
    setShowForm(true);
  };

  const handleStatisticsClick = () => {
    navigate('/statistics');
  };

  const handleEditCandidate = (e: React.MouseEvent, candidate: Candidate) => {
    e.stopPropagation(); // Prevent navigation to detail page
    setFormMode('edit');
    setEditingCandidate(candidate);
    setShowForm(true);
  };

  const handleDeleteCandidate = async (e: React.MouseEvent, candidateId: number) => {
    e.stopPropagation(); // Prevent navigation to detail page
    
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }

    setDeletingId(candidateId);
    try {
      await deleteCandidate(candidateId);
      setCandidates(prev => prev.filter(c => c.id !== candidateId));
    } catch (err) {
      console.error('Error deleting candidate:', err);
      alert('Failed to delete candidate');
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSave = (candidate: Candidate) => {
    if (formMode === 'create') {
      // Add new candidate to the list
      setCandidates(prev => [...prev, candidate]);
    } else {
      // Update existing candidate in the list
      setCandidates(prev => prev.map(c => c.id === candidate.id ? candidate : c));
    }
    setShowForm(false);
    setEditingCandidate(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCandidate(null);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // Use a more reliable placeholder service
    target.src = 'https://picsum.photos/200/200?random=' + Math.random();
    // Fallback to a data URL if the external service also fails
    target.onerror = () => {
      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
    };
  };

  if (loading) {
    return (
      <div className="candidate-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidate-list-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-list-container">
      <header className="candidate-list-header">
        <div className="header-content">
          <h1>Election Candidates</h1>
          <p>Click on a candidate to view their details</p>
        </div>
        <div className="header-actions">
          <button className="statistics-button" onClick={handleStatisticsClick}>
            Statistics
          </button>
          <button className="add-candidate-button" onClick={handleAddCandidate}>
            Add Candidate
          </button>
        </div>
      </header>
      
      <div className="candidates-grid">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="candidate-card"
            onClick={() => handleCandidateClick(candidate.id)}
          >
            <div className="candidate-image">
              <img
                src={candidate.image}
                alt={candidate.name}
                onError={handleImageError}
              />
            </div>
            <div className="candidate-info">
              <h3 className="candidate-name">{candidate.name}</h3>
              <p className="candidate-party">{candidate.party}</p>
              <p className="candidate-description">
                {candidate.description.length > 100
                  ? `${candidate.description.substring(0, 100)}...`
                  : candidate.description}
              </p>
            </div>
            <div className="candidate-actions">
              <button
                className="edit-button"
                onClick={(e) => handleEditCandidate(e, candidate)}
                title="Edit candidate"
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={(e) => handleDeleteCandidate(e, candidate.id)}
                disabled={deletingId === candidate.id}
                title="Delete candidate"
              >
                {deletingId === candidate.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
            <div className="candidate-arrow">
              <span>View Details</span>
            </div>
          </div>
        ))}
      </div>
      
      {candidates.length === 0 && (
        <div className="no-candidates">
          <h2>No candidates found</h2>
          <p>There are currently no candidates available.</p>
          <button className="add-candidate-button" onClick={handleAddCandidate}>
            Add Your First Candidate
          </button>
        </div>
      )}

      {/* Modal Form Overlay */}
      {showForm && (
        <div className="modal-overlay" onClick={handleFormCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CandidateForm
              candidate={editingCandidate}
              onSave={handleFormSave}
              onCancel={handleFormCancel}
              mode={formMode}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateList; 