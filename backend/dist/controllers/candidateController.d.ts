import { Request, Response } from 'express';
export declare class CandidateController {
    static getAllCandidates(req: Request, res: Response): Promise<void>;
    static getCandidateById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static createCandidate(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateCandidate(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteCandidate(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static generateFakeCandidate(req: Request, res: Response): Promise<void>;
}
