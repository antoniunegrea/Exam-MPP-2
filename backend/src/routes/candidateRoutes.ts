import { Router } from 'express';
import { CandidateController } from '../controllers/candidateController';

const router = Router();

// Get all candidates
router.get('/', CandidateController.getAllCandidates);

// Get candidate by ID
router.get('/:id', CandidateController.getCandidateById);

// Create new candidate
router.post('/', CandidateController.createCandidate);

// Update candidate
router.put('/:id', CandidateController.updateCandidate);

// Delete candidate
router.delete('/:id', CandidateController.deleteCandidate);

// Generate fake candidate
router.post('/generate', CandidateController.generateFakeCandidate);

export default router; 