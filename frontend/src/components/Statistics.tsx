import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Candidate, getStatistics, generateFakeCandidate } from '../types/Candidate';
import { useWebSocket } from '../context/WebSocketContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './Statistics.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface PartyStats {
  party: string;
  count: number;
}

interface StatisticsData {
  totalCandidates: number;
  partyStats: PartyStats[];
  mostPopularParty: string;
}

const Statistics: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationInterval, setGenerationInterval] = useState<NodeJS.Timeout | null>(null);
  const [generatedCount, setGeneratedCount] = useState(0);
  const navigate = useNavigate();
  const { isConnected, sendMessage } = useWebSocket();

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getStatistics();
      setStatistics(data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Chart data for pie chart
  const pieChartData = {
    labels: statistics?.partyStats.map(stat => stat.party) || [],
    datasets: [
      {
        data: statistics?.partyStats.map(stat => stat.count) || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  // Chart data for bar chart
  const barChartData = {
    labels: statistics?.partyStats.map(stat => stat.party) || [],
    datasets: [
      {
        label: 'Number of Candidates',
        data: statistics?.partyStats.map(stat => stat.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Candidate Distribution by Party'
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Candidates per Party'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Start/Stop candidate generation
  const toggleGeneration = () => {
    if (isGenerating) {
      // Stop generation
      if (generationInterval) {
        clearInterval(generationInterval);
        setGenerationInterval(null);
      }
      setIsGenerating(false);
      setGeneratedCount(0);
      
      // Send WebSocket message to stop generation
      sendMessage({ type: 'stop_generation' });
    } else {
      // Start generation
      const interval = setInterval(async () => {
        try {
          const result = await generateFakeCandidate();
          setGeneratedCount(prev => prev + 1);
          
          // Update statistics with the new data
          setStatistics(result.statistics);
          
          // Send WebSocket message about new candidate
          sendMessage({ 
            type: 'candidate_generated', 
            data: { 
              candidate: result.candidate, 
              totalCount: result.statistics.totalCandidates 
            }
          });
        } catch (err) {
          console.error('Error generating candidate:', err);
        }
      }, 2000); // Generate every 2 seconds

      setGenerationInterval(interval);
      setIsGenerating(true);
      
      // Send WebSocket message to start generation
      sendMessage({ type: 'start_generation' });
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="statistics-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="statistics-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error || 'Failed to load statistics'}</p>
          <button onClick={handleBackClick}>Back to Candidates</button>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-container">
      <div className="statistics-header">
        <button className="back-button" onClick={handleBackClick}>
          Back to Candidates
        </button>
        <h1>Election Statistics</h1>
        <button 
          className={`generation-button ${isGenerating ? 'generating' : ''}`}
          onClick={toggleGeneration}
          disabled={!isConnected}
        >
          {isGenerating ? 'Stop Generation' : 'Start Generation'}
        </button>
      </div>

      <div className="statistics-summary">
        <div className="summary-card">
          <h3>Total Candidates</h3>
          <p className="summary-number">{statistics.totalCandidates}</p>
        </div>
        <div className="summary-card">
          <h3>Active Parties</h3>
          <p className="summary-number">{statistics.partyStats.filter(stat => stat.count > 0).length}</p>
        </div>
        <div className="summary-card">
          <h3>Most Popular Party</h3>
          <p className="summary-text">{statistics.mostPopularParty}</p>
        </div>
        {isGenerating && (
          <div className="summary-card">
            <h3>Generated This Session</h3>
            <p className="summary-number">{generatedCount}</p>
          </div>
        )}
      </div>

      <div className="charts-container">
        <div className="chart-section">
          <h2>Party Distribution (Pie Chart)</h2>
          <div className="chart-wrapper">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-section">
          <h2>Party Distribution (Bar Chart)</h2>
          <div className="chart-wrapper">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      <div className="party-details">
        <h2>Detailed Party Statistics</h2>
        <div className="party-grid">
          {statistics.partyStats.map((stat) => (
            <div key={stat.party} className="party-card">
              <h3>{stat.party}</h3>
              <p className="party-count">{stat.count} candidates</p>
              <div className="party-percentage">
                {statistics.totalCandidates > 0 ? ((stat.count / statistics.totalCandidates) * 100).toFixed(1) : 0}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {isGenerating && (
        <div className="generation-status">
          <div className="status-indicator">
            <div className="pulse"></div>
            <span>Generating candidates every 2 seconds... ({generatedCount} generated)</span>
          </div>
        </div>
      )}

      {!isConnected && (
        <div className="websocket-status">
          <div className="status-indicator">
            <div className="pulse offline"></div>
            <span>WebSocket disconnected - Real-time updates unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics; 