import { Request, Response } from 'express';
import { DatabaseService } from '../services/databaseService';

export class StatisticsController {
  // Get party statistics
  static async getPartyStatistics(req: Request, res: Response) {
    try {
      const partyStats = await DatabaseService.getPartyStatistics();
      res.json(partyStats);
    } catch (error) {
      console.error('Error in getPartyStatistics:', error);
      res.status(500).json({ 
        error: 'Failed to fetch party statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get comprehensive statistics
  static async getComprehensiveStatistics(req: Request, res: Response) {
    try {
      const stats = await DatabaseService.getComprehensiveStatistics();
      res.json(stats);
    } catch (error) {
      console.error('Error in getComprehensiveStatistics:', error);
      res.status(500).json({ 
        error: 'Failed to fetch comprehensive statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Generate fake candidate
  static async generateFakeCandidate(req: Request, res: Response) {
    try {
      const fakeCandidate = await DatabaseService.generateFakeCandidate();
      res.status(201).json(fakeCandidate);
    } catch (error) {
      console.error('Error in generateFakeCandidate:', error);
      res.status(500).json({ 
        error: 'Failed to generate fake candidate',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 