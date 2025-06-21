import { Request, Response } from 'express';
export declare class StatisticsController {
    static getPartyStatistics(req: Request, res: Response): Promise<void>;
    static getComprehensiveStatistics(req: Request, res: Response): Promise<void>;
    static generateFakeCandidate(req: Request, res: Response): Promise<void>;
}
