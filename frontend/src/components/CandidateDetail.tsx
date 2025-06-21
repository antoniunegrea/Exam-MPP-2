import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Candidate, getCandidateById } from '../types/Candidate';
import CandidateForm from './CandidateForm';
import './CandidateDetail.css';

const CandidateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedId, setLastFetchedId] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchCandidate = useCallback(async () => {
    // Prevent fetching if we already have the data for this ID
    if (lastFetchedId === id) {
      return;
    }

    if (!id) {
      setError('Invalid candidate ID');
      setLoading(false);
      return;
    }

    console.log('Fetching candidate with ID:', id); // Debug log
    try {
      setLoading(true);
      const candidateId = parseInt(id, 10);
      const data = await getCandidateById(candidateId);
      
      if (!data) {
        setError('Candidate not found');
      } else {
        console.log('Candidate fetched:', data.name); // Debug log
        setCandidate(data);
        setLastFetchedId(id);
      }
    } catch (err) {
      console.error('Error fetching candidate:', err);
      setError('Failed to load candidate details');
    } finally {
      setLoading(false);
    }
  }, [id, lastFetchedId]);

  useEffect(() => {
    fetchCandidate();
  }, [fetchCandidate]);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleFormSave = (updatedCandidate: Candidate) => {
    setCandidate(updatedCandidate);
    setShowEditForm(false);
  };

  const handleFormCancel = () => {
    setShowEditForm(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // Use a more reliable placeholder service
    target.src = 'https://picsum.photos/300/300?random=' + Math.random();
    // Fallback to a data URL if the external service also fails
    target.onerror = () => {
      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
    };
  };

  if (loading) {
    return (
      <div className="candidate-detail-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="candidate-detail-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error || 'Candidate not found'}</p>
          <button onClick={handleBackClick}>Back to Candidates</button>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-detail-container">
      <div className="candidate-detail-card">
        <div className="detail-header-actions">
          <button className="back-button" onClick={handleBackClick}>
            ← Back to Candidates
          </button>
          <button className="edit-button" onClick={handleEditClick}>
            ✏️ Edit Candidate
          </button>
        </div>
        
        <div className="candidate-detail-header">
          <div className="candidate-detail-image">
            <img
              src={candidate.image}
              alt={candidate.name}
              onError={handleImageError}
            />
          </div>
          
          <div className="candidate-detail-info">
            <h1 className="candidate-detail-name">{candidate.name}</h1>
            <div className="candidate-detail-party">
              <span className="party-badge">{candidate.party}</span>
            </div>
            <div className="candidate-detail-id">
              <span>Candidate ID: {candidate.id}</span>
            </div>
          </div>
        </div>
        
        <div className="candidate-detail-content">
          <div className="detail-section">
            <h2>About {candidate.name}</h2>
            <p className="candidate-detail-description">{candidate.description}</p>
          </div>
          
          <div className="detail-section">
            <h2>Campaign Focus</h2>
            <div className="campaign-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">🎯</span>
                <span>Leadership & Experience</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">💡</span>
                <span>Innovation & Progress</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🤝</span>
                <span>Community Engagement</span>
              </div>
            </div>
          </div>
          
          <div className="detail-section">
            <h2>Contact Information</h2>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <span className="contact-value">contact@{candidate.name.toLowerCase().replace(' ', '')}.ro</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Phone:</span>
                <span className="contact-value">+40 XXX XXX XXX</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Website:</span>
                <span className="contact-value">www.{candidate.name.toLowerCase().replace(' ', '')}.ro</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="candidate-detail-actions">
          <button className="action-button primary">Support Campaign</button>
          <button className="action-button secondary">Share Profile</button>
        </div>
      </div>

      {showEditForm && (
        <CandidateForm
          candidate={candidate}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
          mode="edit"
        />
      )}
    </div>
  );
};

export default CandidateDetail; 