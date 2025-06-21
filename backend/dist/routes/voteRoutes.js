"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voteController_1 = require("../controllers/voteController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All voting routes require authentication
router.use(auth_1.authenticateUser);
// Vote for a candidate
router.post('/vote', voteController_1.VoteController.voteForCandidate);
// Get user's vote (only one vote allowed per user)
router.get('/user-vote', voteController_1.VoteController.getUserVote);
// Check if user has voted (for any candidate)
router.get('/check-status', voteController_1.VoteController.checkUserVoteStatus);
// Get vote statistics (public, but requires auth for consistency)
router.get('/statistics', voteController_1.VoteController.getVoteStatistics);
exports.default = router;
//# sourceMappingURL=voteRoutes.js.map