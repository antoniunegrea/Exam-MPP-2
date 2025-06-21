import { Router } from 'express';
import { VoteController } from '../controllers/voteController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// All voting routes require authentication
router.use(authenticateUser);

// Vote for a candidate
router.post('/vote', VoteController.voteForCandidate);

// Get user's vote (only one vote allowed per user)
router.get('/user-vote', VoteController.getUserVote);

// Check if user has voted (for any candidate)
router.get('/check-status', VoteController.checkUserVoteStatus);

// Get vote statistics (public, but requires auth for consistency)
router.get('/statistics', VoteController.getVoteStatistics);

export default router; 