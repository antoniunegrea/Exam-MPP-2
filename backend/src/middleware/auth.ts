import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/databaseService';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        cnp: string;
        created_at: string;
      };
    }
  }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const cnp = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!cnp || cnp.length !== 13) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Verify user exists in database
    const user = await DatabaseService.getUserByCnp(cnp);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Add user to request object
    req.user = {
      id: user.id,
      cnp: user.cnp,
      created_at: user.created_at
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const cnp = authHeader.substring(7);
      
      if (cnp && cnp.length === 13) {
        const user = await DatabaseService.getUserByCnp(cnp);
        if (user) {
          req.user = {
            id: user.id,
            cnp: user.cnp,
            created_at: user.created_at
          };
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional routes
    next();
  }
}; 