import { Request, Response } from 'express';
import { DatabaseService } from '../services/databaseService';

export class VoteController {
  // Vote for a candidate
  static async voteForCandidate(req: Request, res: Response) {
    try {
      const { candidate_id } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      if (!candidate_id || typeof candidate_id !== 'number') {
        return res.status(400).json({ error: 'Candidate ID is required and must be a number' });
      }

      const vote = await DatabaseService.voteForCandidate(userId, candidate_id);
      
      res.status(201).json({
        message: 'Vote recorded successfully',
        vote: {
          id: vote.id,
          user_id: vote.user_id,
          candidate_id: vote.candidate_id,
          created_at: vote.created_at
        }
      });
    } catch (error) {
      console.error('Error in voteForCandidate:', error);
      res.status(400).json({ 
        error: 'Failed to record vote',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get user's vote (only one vote allowed per user)
  static async getUserVote(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const vote = await DatabaseService.getUserVote(userId);
      
      res.json({
        hasVoted: !!vote,
        vote: vote ? {
          id: vote.id,
          candidate_id: vote.candidate_id,
          created_at: vote.created_at
        } : null
      });
    } catch (error) {
      console.error('Error in getUserVote:', error);
      res.status(500).json({ 
        error: 'Failed to fetch user vote',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Check if user has voted (for any candidate)
  static async checkUserVoteStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const hasVoted = await DatabaseService.hasUserVoted(userId);
      const vote = await DatabaseService.getUserVote(userId);
      
      res.json({
        hasVoted: hasVoted,
        vote: vote ? {
          id: vote.id,
          candidate_id: vote.candidate_id,
          created_at: vote.created_at
        } : null
      });
    } catch (error) {
      console.error('Error in checkUserVoteStatus:', error);
      res.status(500).json({ 
        error: 'Failed to check user vote status',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get vote statistics
  static async getVoteStatistics(req: Request, res: Response) {
    try {
      const [voteStats, totalVotes] = await Promise.all([
        DatabaseService.getVoteStatistics(),
        DatabaseService.getTotalVotes()
      ]);
      
      res.json({
        voteStatistics: voteStats,
        totalVotes: totalVotes
      });
    } catch (error) {
      console.error('Error in getVoteStatistics:', error);
      res.status(500).json({ 
        error: 'Failed to fetch vote statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 