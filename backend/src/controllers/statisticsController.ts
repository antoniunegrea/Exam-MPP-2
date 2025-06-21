import { Request, Response } from 'express';
import { getPartyStatistics, generateAndAddCandidate } from '../services/candidateGenerator';

// Get party statistics
export const getStatistics = (req: Request, res: Response) => {
  try {
    const statistics = getPartyStatistics();
    res.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// Generate a fake candidate
export const generateCandidate = (req: Request, res: Response) => {
  try {
    const newCandidate = generateAndAddCandidate();
    const statistics = getPartyStatistics();
    
    res.status(201).json({
      candidate: newCandidate,
      statistics: statistics
    });
  } catch (error) {
    console.error('Error generating candidate:', error);
    res.status(500).json({ error: 'Failed to generate candidate' });
  }
}; 