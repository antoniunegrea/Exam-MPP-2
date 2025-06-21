import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const [cnp, setCnp] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!cnp.trim() || cnp.length !== 13) {
      setError('CNP must be exactly 13 digits');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cnp: cnp.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (isLogin) {
        // For login, we get user data back
        login(data.user);
      } else {
        // For register, we also get user data back
        login(data.user);
      }

      // Redirect to candidates list page after successful authentication
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Enter your CNP to access the voting system' : 'Create a new account with your CNP'}
        </p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="cnp">CNP (Personal Numeric Code)</label>
            <input
              type="text"
              id="cnp"
              value={cnp}
              onChange={(e) => setCnp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 13-digit CNP"
              maxLength={13}
              required
              disabled={loading}
            />
            <small>Enter exactly 13 digits</small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading || cnp.length !== 13} className="auth-button">
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setCnp('');
              }}
              className="switch-button"
              disabled={loading}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 