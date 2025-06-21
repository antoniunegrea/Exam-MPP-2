import { Router } from 'express';
import { StatisticsController } from '../controllers/statisticsController';

const router = Router();

// Get party statistics
router.get('/party', StatisticsController.getPartyStatistics);

// Get comprehensive statistics
router.get('/comprehensive', StatisticsController.getComprehensiveStatistics);

// Generate fake candidate
router.post('/generate', StatisticsController.generateFakeCandidate);

export default router; 