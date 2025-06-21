import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Statistics.css';

interface PartyStatistics {
  party: string;
  candidate_count: number;
  percentage: number;
}

interface VoteStatistics {
  candidate_id: number;
  candidate_name: string;
  vote_count: number;
  percentage: number;
}

const Statistics: React.FC = () => {
  const [partyStats, setPartyStats] = useState<PartyStatistics[]>([]);
  const [voteStats, setVoteStats] = useState<VoteStatistics[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, logout } = useAuth();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user?.cnp}`
  });

  const fetchStatistics = async () => {
    try {
      const [partyResponse, voteResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/statistics`, {
          headers: getAuthHeaders()
        }),
        fetch(`${API_BASE_URL}/api/votes/statistics`, {
          headers: getAuthHeaders()
        })
      ]);

      if (!partyResponse.ok) {
        if (partyResponse.status === 401) {
          logout();
          return;
        }
        throw new Error('Failed to fetch party statistics');
      }

      if (!voteResponse.ok) {
        throw new Error('Failed to fetch vote statistics');
      }

      const partyData = await partyResponse.json();
      const voteData = await voteResponse.json();

      setPartyStats(partyData.partyStats || []);
      setVoteStats(voteData.voteStatistics || []);
      setTotalVotes(voteData.totalVotes || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const generateFakeCandidate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/statistics/generate`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to generate fake candidate');
      }

      // Refresh statistics after generation
      await fetchStatistics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate candidate');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) {
    return <div className="loading">Loading statistics...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="statistics-container">
      <div className="statistics-header">
        <h1>Election Statistics</h1>
        <button
          className="generate-button"
          onClick={generateFakeCandidate}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Fake Candidate'}
        </button>
      </div>

      <div className="statistics-grid">
        <div className="stat-card">
          <h2>Party Distribution</h2>
          <div className="pie-chart">
            {partyStats.map((stat, index) => (
              <div key={stat.party} className="pie-segment">
                <div 
                  className="segment"
                  style={{
                    backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                    transform: `rotate(${index * 45}deg)`
                  }}
                />
                <span className="segment-label">{stat.party}</span>
              </div>
            ))}
          </div>
          <div className="party-list">
            {partyStats.map((stat, index) => (
              <div key={stat.party} className="party-item">
                <span 
                  className="party-color"
                  style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                />
                <span className="party-name">{stat.party}</span>
                <span className="party-count">{stat.candidate_count} candidates</span>
                <span className="party-percentage">{stat.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <h2>Vote Results</h2>
          <div className="total-votes">
            <h3>Total Votes: {totalVotes}</h3>
          </div>
          <div className="vote-chart">
            {voteStats.map((stat, index) => (
              <div key={stat.candidate_id} className="vote-bar">
                <div className="vote-info">
                  <span className="candidate-name">{stat.candidate_name}</span>
                  <span className="vote-count">{stat.vote_count} votes</span>
                </div>
                <div className="bar-container">
                  <div 
                    className="bar"
                    style={{
                      width: `${stat.percentage}%`,
                      backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                    }}
                  />
                  <span className="percentage">{stat.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 