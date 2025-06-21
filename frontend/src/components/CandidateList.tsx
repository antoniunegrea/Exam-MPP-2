import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CandidateForm from './CandidateForm';
import './CandidateList.css';

interface Candidate {
  id: number;
  name: string;
  description: string;
  image_url: string;
  party: string;
  created_at: string;
}

interface VoteStatus {
  [key: number]: boolean;
}

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [voteStatuses, setVoteStatuses] = useState<VoteStatus>({});
  const [voting, setVoting] = useState<number | null>(null);
  const { user, logout } = useAuth();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user?.cnp}`
  });

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/candidates`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error('Failed to fetch candidates');
      }

      const data = await response.json();
      setCandidates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  const fetchVoteStatuses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/votes/user-vote`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        if (data.hasVoted && data.vote) {
          // User has voted, mark that specific candidate as voted
          setVoteStatuses(prev => ({
            ...prev,
            [data.vote.candidate_id]: true
          }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch vote status:', err);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchVoteStatuses();
  }, []);

  const handleVote = async (candidateId: number) => {
    if (voting === candidateId) return;

    setVoting(candidateId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/votes/vote`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ candidate_id: candidateId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to vote');
      }

      // Update vote status - user can only vote once, so disable all vote buttons
      const allCandidates = candidates.map(c => c.id);
      const newVoteStatuses: VoteStatus = {};
      allCandidates.forEach(id => {
        newVoteStatuses[id] = id === candidateId; // Only the voted candidate is true
      });
      setVoteStatuses(newVoteStatuses);

      // Show success message
      alert('Vote recorded successfully! You can only vote once.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to vote');
    } finally {
      setVoting(null);
    }
  };

  const handleAddCandidate = async (candidateData: Omit<Candidate, 'id' | 'created_at'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/candidates`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(candidateData)
      });

      if (!response.ok) {
        throw new Error('Failed to add candidate');
      }

      const newCandidate = await response.json();
      setCandidates(prev => [newCandidate, ...prev]);
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add candidate');
    }
  };

  const handleUpdateCandidate = async (id: number, candidateData: Partial<Candidate>) => {
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
      setCandidates(prev => prev.map(c => c.id === id ? updatedCandidate : c));
      setEditingCandidate(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update candidate');
    }
  };

  const handleDeleteCandidate = async (id: number) => {
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

      setCandidates(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete candidate');
    }
  };

  if (loading) {
    return <div className="loading">Loading candidates...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="candidate-list-container">
      <div className="header">
        <h1>Election Candidates</h1>
        <div className="header-actions">
          <button 
            className="add-button"
            onClick={() => setShowAddForm(true)}
          >
            Add Candidate
          </button>
          <Link to="/statistics" className="stats-link">
            View Statistics
          </Link>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="candidates-grid">
        {candidates.map(candidate => (
          <div key={candidate.id} className="candidate-card">
            <img 
              src={candidate.image_url} 
              alt={candidate.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `data:image/svg+xml;base64,${btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
                    <rect width="200" height="200" fill="#f0f0f0"/>
                    <text x="100" y="100" text-anchor="middle" dy=".3em" fill="#666" font-size="14">No Image</text>
                  </svg>
                `)}`;
              }}
            />
            <div className="candidate-info">
              <h3>{candidate.name}</h3>
              <p className="party">{candidate.party}</p>
              <p className="description">{candidate.description}</p>
            </div>
            <div className="candidate-actions">
              <Link to={`/candidate/${candidate.id}`} className="view-button">
                View Details
              </Link>
              <button
                className={`vote-button ${voteStatuses[candidate.id] ? 'voted' : ''}`}
                onClick={() => handleVote(candidate.id)}
                disabled={Object.values(voteStatuses).some(voted => voted) || voting === candidate.id}
              >
                {voting === candidate.id ? 'Voting...' : 
                 voteStatuses[candidate.id] ? 'Voted' : 
                 Object.values(voteStatuses).some(voted => voted) ? 'Already Voted' : 'Vote'}
              </button>
              <button
                className="edit-button"
                onClick={() => setEditingCandidate(candidate)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteCandidate(candidate.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <CandidateForm
              onSubmit={handleAddCandidate}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {editingCandidate && (
        <div className="modal-overlay">
          <div className="modal">
            <CandidateForm
              candidate={editingCandidate}
              onSubmit={(data) => handleUpdateCandidate(editingCandidate.id, data)}
              onCancel={() => setEditingCandidate(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateList; 