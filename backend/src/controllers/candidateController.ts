import { Request, Response } from 'express';
import { DatabaseService } from '../services/databaseService';
import { CreateCandidateRequest, UpdateCandidateRequest } from '../config/supabase';

export class CandidateController {
  // Get all candidates
  static async getAllCandidates(req: Request, res: Response) {
    try {
      const candidates = await DatabaseService.getAllCandidates();
      res.json(candidates);
    } catch (error) {
      console.error('Error in getAllCandidates:', error);
      res.status(500).json({ 
        error: 'Failed to fetch candidates',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get candidate by ID
  static async getCandidateById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid candidate ID' });
      }

      const candidate = await DatabaseService.getCandidateById(id);
      
      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }

      res.json(candidate);
    } catch (error) {
      console.error('Error in getCandidateById:', error);
      res.status(500).json({ 
        error: 'Failed to fetch candidate',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create new candidate
  static async createCandidate(req: Request, res: Response) {
    try {
      const candidateData: CreateCandidateRequest = req.body;

      // Validate required fields
      if (!candidateData.name || !candidateData.description || !candidateData.party) {
        return res.status(400).json({ 
          error: 'Missing required fields: name, description, and party are required' 
        });
      }

      // Validate party
      if (!DatabaseService.isValidParty(candidateData.party)) {
        return res.status(400).json({ 
          error: 'Invalid party. Must be one of: PSD, PNL, POT, AUR, Independent' 
        });
      }

      // Set default image if not provided
      if (!candidateData.image_url) {
        const randomId = Math.floor(Math.random() * 1000);
        candidateData.image_url = `https://picsum.photos/200/200?random=${randomId}`;
      }

      const newCandidate = await DatabaseService.createCandidate(candidateData);
      res.status(201).json(newCandidate);
    } catch (error) {
      console.error('Error in createCandidate:', error);
      res.status(500).json({ 
        error: 'Failed to create candidate',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update candidate
  static async updateCandidate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid candidate ID' });
      }

      const updateData: UpdateCandidateRequest = req.body;

      // Validate party if provided
      if (updateData.party && !DatabaseService.isValidParty(updateData.party)) {
        return res.status(400).json({ 
          error: 'Invalid party. Must be one of: PSD, PNL, POT, AUR, Independent' 
        });
      }

      const updatedCandidate = await DatabaseService.updateCandidate(id, updateData);
      
      if (!updatedCandidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }

      res.json(updatedCandidate);
    } catch (error) {
      console.error('Error in updateCandidate:', error);
      res.status(500).json({ 
        error: 'Failed to update candidate',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete candidate
  static async deleteCandidate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid candidate ID' });
      }

      const success = await DatabaseService.deleteCandidate(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Candidate not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error in deleteCandidate:', error);
      res.status(500).json({ 
        error: 'Failed to delete candidate',
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