import { Router } from 'express';
import {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidateById,
  deleteCandidateById
} from '../controllers/candidateController';

const router = Router();

// GET /api/candidates - Get all candidates
router.get('/', getCandidates);

// GET /api/candidates/:id - Get candidate by ID
router.get('/:id', getCandidate);

// POST /api/candidates - Create new candidate
router.post('/', createCandidate);

// PUT /api/candidates/:id - Update candidate
router.put('/:id', updateCandidateById);

// DELETE /api/candidates/:id - Delete candidate
router.delete('/:id', deleteCandidateById);

export default router; 