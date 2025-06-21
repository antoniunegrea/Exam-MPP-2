import React, { useState, useEffect } from 'react';
import { ALLOWED_PARTIES, Party } from '../types/Candidate';
import './CandidateForm.css';

interface Candidate {
  id: number;
  name: string;
  description: string;
  image_url: string;
  party: string;
  created_at: string;
}

interface CandidateFormProps {
  candidate?: Candidate | null;
  onSubmit: (candidateData: Omit<Candidate, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ 
  candidate, 
  onSubmit, 
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    party: 'Independent' as string
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name,
        description: candidate.description,
        image_url: candidate.image_url,
        party: candidate.party
      });
    }
  }, [candidate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.description || !formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!formData.image_url || !formData.image_url.trim()) {
      newErrors.image_url = 'Image URL is required';
    } else if (!isValidUrl(formData.image_url)) {
      newErrors.image_url = 'Please enter a valid URL';
    }

    if (!ALLOWED_PARTIES.includes(formData.party as any)) {
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
      onSubmit(formData);
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
          <h2>{candidate ? 'Edit Candidate' : 'Add New Candidate'}</h2>
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
            <label htmlFor="image_url">Image URL *</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              className={errors.image_url ? 'error' : ''}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image_url && <span className="error-message">{errors.image_url}</span>}
            {formData.image_url && (
              <div className="image-preview">
                <img
                  src={formData.image_url}
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
              placeholder="Enter candidate's campaign description"
              rows={4}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (candidate ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm; 