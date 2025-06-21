"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteController = void 0;
const databaseService_1 = require("../services/databaseService");
class VoteController {
    // Vote for a candidate
    static voteForCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { candidate_id } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({ error: 'User not authenticated' });
                }
                if (!candidate_id || typeof candidate_id !== 'number') {
                    return res.status(400).json({ error: 'Candidate ID is required and must be a number' });
                }
                const vote = yield databaseService_1.DatabaseService.voteForCandidate(userId, candidate_id);
                res.status(201).json({
                    message: 'Vote recorded successfully',
                    vote: {
                        id: vote.id,
                        user_id: vote.user_id,
                        candidate_id: vote.candidate_id,
                        created_at: vote.created_at
                    }
                });
            }
            catch (error) {
                console.error('Error in voteForCandidate:', error);
                res.status(400).json({
                    error: 'Failed to record vote',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // Get user's vote (only one vote allowed per user)
    static getUserVote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({ error: 'User not authenticated' });
                }
                const vote = yield databaseService_1.DatabaseService.getUserVote(userId);
                res.json({
                    hasVoted: !!vote,
                    vote: vote ? {
                        id: vote.id,
                        candidate_id: vote.candidate_id,
                        created_at: vote.created_at
                    } : null
                });
            }
            catch (error) {
                console.error('Error in getUserVote:', error);
                res.status(500).json({
                    error: 'Failed to fetch user vote',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // Check if user has voted (for any candidate)
    static checkUserVoteStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({ error: 'User not authenticated' });
                }
                const hasVoted = yield databaseService_1.DatabaseService.hasUserVoted(userId);
                const vote = yield databaseService_1.DatabaseService.getUserVote(userId);
                res.json({
                    hasVoted: hasVoted,
                    vote: vote ? {
                        id: vote.id,
                        candidate_id: vote.candidate_id,
                        created_at: vote.created_at
                    } : null
                });
            }
            catch (error) {
                console.error('Error in checkUserVoteStatus:', error);
                res.status(500).json({
                    error: 'Failed to check user vote status',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // Get vote statistics
    static getVoteStatistics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [voteStats, totalVotes] = yield Promise.all([
                    databaseService_1.DatabaseService.getVoteStatistics(),
                    databaseService_1.DatabaseService.getTotalVotes()
                ]);
                res.json({
                    voteStatistics: voteStats,
                    totalVotes: totalVotes
                });
            }
            catch (error) {
                console.error('Error in getVoteStatistics:', error);
                res.status(500).json({
                    error: 'Failed to fetch vote statistics',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
}
exports.VoteController = VoteController;
//# sourceMappingURL=voteController.js.map