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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid URL';
    }

    if (!ALLOWED_PARTIES.includes(formData.party)) {
      newErrors.party = 'Please select a valid party';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let savedCandidate: Candidate;

      if (mode === 'create') {
        savedCandidate = await createCandidate(formData);
      } else {
        if (!candidate) {
          throw new Error('No candidate to update');
        }
        savedCandidate = await updateCandidate(candidate.id, formData);
      }

      onSave(savedCandidate);
    } catch (err) {
      console.error('Error saving candidate:', err);
      alert('Failed to save candidate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (Object.keys(formData).some(key => formData[key as keyof typeof formData] !== '')) {
      if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{mode === 'create' ? 'Add New Candidate' : 'Edit Candidate'}</h2>
          <button className="close-button" onClick={handleCancel}>
            Close
          </button>
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
              className={errors.name ? 'error' : ''}
              placeholder="Enter candidate's full name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="party">Party *</label>
            <select
              id="party"
              name="party"
              value={formData.party}
              onChange={handleInputChange}
              className={errors.party ? 'error' : ''}
            >
              {ALLOWED_PARTIES.map(party => (
                <option key={party} value={party}>
                  {party}
                </option>
              ))}
            </select>
            {errors.party && <span className="error-message">{errors.party}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL *</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className={errors.image ? 'error' : ''}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && <span className="error-message">{errors.image}</span>}
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
              className={errors.description ? 'error' : ''}
              placeholder="Enter candidate's description and campaign details"
              rows={4}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
            <div className="character-count">
              {formData.description.length}/500 characters
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (mode === 'create' ? 'Add Candidate' : 'Update Candidate')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm; 