import { Router } from 'express';
import {
  getStatistics,
  generateCandidate
} from '../controllers/statisticsController';

const router = Router();

// GET /api/statistics - Get party statistics
router.get('/', getStatistics);

// POST /api/statistics/generate - Generate a fake candidate
router.post('/generate', generateCandidate);

export default router; 