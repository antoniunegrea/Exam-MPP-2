import React, { useState, useEffect } from 'react';
import { Candidate, ALLOWED_PARTIES, Party, createCandidate, updateCandidate } from '../types/Candidate';
import './CandidateForm.css';

interface CandidateFormProps {
  candidate?: Candidate | null;
  onSave: (candidate: Candidate) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

const CandidateForm: React.FC<CandidateFormProps> = ({ 
  candidate, 
  onSave, 
  onCancel, 
  mode 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    party: 'Independent' as Party
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (candidate && mode === 'edit') {
      setFormData({
        name: candidate.name,
        description: candidate.description,
        image: candidate.image,
        party: candidate.party
      });
    }
  }, [candidate, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'create') {
        const newCandidate = await createCandidate(formData);
        onSave(newCandidate);
      } else if (candidate) {
        const updatedCandidate = await updateCandidate(candidate.id, formData);
        onSave(updatedCandidate);
      }
    } catch (err) {
      setError('Failed to save candidate');
      console.error('Error saving candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name.trim() && 
                     formData.description.trim() && 
                     formData.image.trim() && 
                     formData.party;

  return (
    <div className="candidate-form-overlay">
      <div className="candidate-form-container">
        <div className="candidate-form-header">
          <h2>{mode === 'create' ? 'Add New Candidate' : 'Edit Candidate'}</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="candidate-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter candidate name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="party">Party *</label>
            <select
              id="party"
              name="party"
              value={formData.party}
              onChange={handleInputChange}
              required
            >
              {ALLOWED_PARTIES.map(party => (
                <option key={party} value={party}>
                  {party}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL *</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              required
            />
            {formData.image && (
              <div className="image-preview">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter candidate description"
              rows={4}
              required
            />
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button" 
              disabled={loading || !isFormValid}
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Add Candidate' : 'Update Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm; 