import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CandidateForm from './CandidateForm';
import './CandidateDetail.css';

interface Candidate {
  id: number;
  name: string;
  description: string;
  image_url: string;
  party: string;
  created_at: string;
}

const CandidateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user?.cnp}`
  });

  const fetchCandidate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/candidates/${id}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        if (response.status === 404) {
          setError('Candidate not found');
          return;
        }
        throw new Error('Failed to fetch candidate');
      }

      const data = await response.json();
      setCandidate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch candidate');
    } finally {
      setLoading(false);
    }
  };

  const checkVoteStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/votes/user-vote`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setHasVoted(data.hasVoted);
      }
    } catch (err) {
      console.error('Failed to check vote status:', err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCandidate();
      checkVoteStatus();
    }
  }, [id]);

  const handleVote = async () => {
    if (voting || hasVoted || !candidate) return;

    setVoting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/votes/vote`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ candidate_id: candidate.id })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to vote');
      }

      setHasVoted(true);
      alert('Vote recorded successfully! You can only vote once.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to vote');
    } finally {
      setVoting(false);
    }
  };

  const handleUpdateCandidate = async (candidateData: Partial<Candidate>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/candidates/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(candidateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update candidate');
      }

      const updatedCandidate = await response.json();
      setCandidate(updatedCandidate);
      setShowEditForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update candidate');
    }
  };

  const handleDeleteCandidate = async () => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/candidates/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete candidate');
      }

      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete candidate');
    }
  };

  if (loading) {
    return <div className="loading">Loading candidate details...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">Error: {error}</div>
        <Link to="/" className="back-link">Back to Candidates</Link>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="error-container">
        <div className="error">Candidate not found</div>
        <Link to="/" className="back-link">Back to Candidates</Link>
      </div>
    );
  }

  return (
    <div className="candidate-detail-container">
      <div className="detail-header">
        <Link to="/" className="back-button">
          Back to Candidates
        </Link>
        <div className="header-actions">
          <button
            className={`vote-button ${hasVoted ? 'voted' : ''}`}
            onClick={handleVote}
            disabled={hasVoted || voting}
          >
            {voting ? 'Voting...' : hasVoted ? 'Already Voted' : 'Vote for this Candidate'}
          </button>
          <button
            className="edit-button"
            onClick={() => setShowEditForm(true)}
          >
            Edit
          </button>
          <button
            className="delete-button"
            onClick={handleDeleteCandidate}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="candidate-detail">
        <div className="candidate-image">
          <img 
            src={candidate.image_url} 
            alt={candidate.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `data:image/svg+xml;base64,${btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
                  <rect width="400" height="400" fill="#f0f0f0"/>
                  <text x="200" y="200" text-anchor="middle" dy=".3em" fill="#666" font-size="18">No Image</text>
                </svg>
              `)}`;
            }}
          />
        </div>
        
        <div className="candidate-info">
          <h1>{candidate.name}</h1>
          <p className="party">{candidate.party}</p>
          <p className="description">{candidate.description}</p>
          <p className="created-at">
            Candidate since: {new Date(candidate.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {showEditForm && (
        <div className="modal-overlay">
          <div className="modal">
            <CandidateForm
              candidate={candidate}
              onSubmit={handleUpdateCandidate}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetail; 