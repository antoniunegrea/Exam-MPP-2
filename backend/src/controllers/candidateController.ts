import { Request, Response } from 'express';
import { 
  getAllCandidates, 
  getCandidateById, 
  addCandidate, 
  updateCandidate, 
  deleteCandidate 
} from '../data/candidates';
import { CreateCandidateRequest, UpdateCandidateRequest, ALLOWED_PARTIES } from '../types/Candidate';

// Get all candidates
export const getCandidates = (req: Request, res: Response) => {
  try {
    const candidates = getAllCandidates();
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
};

// Get candidate by ID
export const getCandidate = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid candidate ID' });
    }

    const candidate = getCandidateById(id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ error: 'Failed to fetch candidate' });
  }
};

// Create new candidate
export const createCandidate = (req: Request, res: Response) => {
  try {
    const candidateData: CreateCandidateRequest = req.body;

    // Validation
    if (!candidateData.name || !candidateData.description || !candidateData.image || !candidateData.party) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, description, image, and party are required' 
      });
    }

    if (!ALLOWED_PARTIES.includes(candidateData.party)) {
      return res.status(400).json({ 
        error: `Invalid party. Allowed parties: ${ALLOWED_PARTIES.join(', ')}` 
      });
    }

    if (candidateData.name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }

    if (candidateData.description.trim().length < 10) {
      return res.status(400).json({ error: 'Description must be at least 10 characters long' });
    }

    // Validate URL format
    try {
      new URL(candidateData.image);
    } catch {
      return res.status(400).json({ error: 'Invalid image URL format' });
    }

    const newCandidate = addCandidate(candidateData);
    res.status(201).json(newCandidate);
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ error: 'Failed to create candidate' });
  }
};

// Update candidate
export const updateCandidateById = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid candidate ID' });
    }

    const updateData: UpdateCandidateRequest = req.body;

    // Check if candidate exists
    const existingCandidate = getCandidateById(id);
    if (!existingCandidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Validation for provided fields
    if (updateData.name !== undefined && updateData.name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }

    if (updateData.description !== undefined && updateData.description.trim().length < 10) {
      return res.status(400).json({ error: 'Description must be at least 10 characters long' });
    }

    if (updateData.party !== undefined && !ALLOWED_PARTIES.includes(updateData.party)) {
      return res.status(400).json({ 
        error: `Invalid party. Allowed parties: ${ALLOWED_PARTIES.join(', ')}` 
      });
    }

    if (updateData.image !== undefined) {
      try {
        new URL(updateData.image);
      } catch {
        return res.status(400).json({ error: 'Invalid image URL format' });
      }
    }

    const updatedCandidate = updateCandidate(id, updateData);
    if (!updatedCandidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json(updatedCandidate);
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
};

// Delete candidate
export const deleteCandidateById = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid candidate ID' });
    }

    const success = deleteCandidate(id);
    if (!success) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
}; 