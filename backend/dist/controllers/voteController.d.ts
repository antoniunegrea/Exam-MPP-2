import { Request, Response } from 'express';
export declare class VoteController {
    static voteForCandidate(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getUserVote(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static checkUserVoteStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getVoteStatistics(req: Request, res: Response): Promise<void>;
}
