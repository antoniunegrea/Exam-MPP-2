import { Candidate, CreateCandidateRequest, UpdateCandidateRequest, PartyStatistics } from '../config/supabase';
import { User } from '../config/user';
import { Vote, VoteStatistics } from '../config/vote';
export declare class DatabaseService {
    static getAllCandidates(): Promise<Candidate[]>;
    static getCandidateById(id: number): Promise<Candidate | null>;
    static createCandidate(candidateData: CreateCandidateRequest): Promise<Candidate>;
    static updateCandidate(id: number, updateData: UpdateCandidateRequest): Promise<Candidate | null>;
    static deleteCandidate(id: number): Promise<boolean>;
    static getPartyStatistics(): Promise<PartyStatistics[]>;
    static generateFakeCandidate(): Promise<Candidate>;
    private static generateFakeCandidateManually;
    static getComprehensiveStatistics(): Promise<{
        totalCandidates: number;
        partyStats: PartyStatistics[];
        mostPopularParty: "PSD" | "PNL" | "POT" | "AUR" | "Independent" | null;
    }>;
    static isValidParty(party: string): party is Candidate['party'];
    static registerUser(cnp: string): Promise<User>;
    static loginUser(cnp: string): Promise<User | null>;
    static getUserByCnp(cnp: string): Promise<User | null>;
    static voteForCandidate(userId: number, candidateId: number): Promise<Vote>;
    static getUserVoteForCandidate(userId: number, candidateId: number): Promise<Vote | null>;
    static getUserVotes(userId: number): Promise<Vote[]>;
    static hasUserVoted(userId: number): Promise<boolean>;
    static getUserVote(userId: number): Promise<Vote | null>;
    static getVoteStatistics(): Promise<VoteStatistics[]>;
    static getTotalVotes(): Promise<number>;
}
