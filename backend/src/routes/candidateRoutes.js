"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidateController_1 = require("../controllers/candidateController");
const router = (0, express_1.Router)();
// Get all candidates
router.get('/', candidateController_1.CandidateController.getAllCandidates);
// Get candidate by ID
router.get('/:id', candidateController_1.CandidateController.getCandidateById);
// Create new candidate
router.post('/', candidateController_1.CandidateController.createCandidate);
// Update candidate
router.put('/:id', candidateController_1.CandidateController.updateCandidate);
// Delete candidate
router.delete('/:id', candidateController_1.CandidateController.deleteCandidate);
// Generate fake candidate
router.post('/generate', candidateController_1.CandidateController.generateFakeCandidate);
exports.default = router;
