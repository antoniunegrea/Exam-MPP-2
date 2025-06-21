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
exports.CandidateController = void 0;
const databaseService_1 = require("../services/databaseService");
class CandidateController {
    // Get all candidates
    static getAllCandidates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidates = yield databaseService_1.DatabaseService.getAllCandidates();
                res.json(candidates);
            }
            catch (error) {
                console.error('Error in getAllCandidates:', error);
                res.status(500).json({
                    error: 'Failed to fetch candidates',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // Get candidate by ID
    static getCandidateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: 'Invalid candidate ID' });
                }
                const candidate = yield databaseService_1.DatabaseService.getCandidateById(id);
                if (!candidate) {
                    return res.status(404).json({ error: 'Candidate not found' });
                }
                res.json(candidate);
            }
            catch (error) {
                console.error('Error in getCandidateById:', error);
                res.status(500).json({
                    error: 'Failed to fetch candidate',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // Create new candidate
    static createCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidateData = req.body;
                // Validate required fields
                if (!candidateData.name || !candidateData.description || !candidateData.party) {
                    return res.status(400).json({
                        error: 'Missing required fields: name, description, and party are required'
                    });
                }
                // Validate party
                if (!databaseService_1.DatabaseService.isValidParty(candidateData.party)) {
                    return res.status(400).json({
                        error: 'Invalid party. Must be one of: PSD, PNL, POT, AUR, Independent'
                    });
                }
                // Set default image if not provided
                if (!candidateData.image_url) {
                    const randomId = Math.floor(Math.random() * 1000);
                    candidateData.image_url = `https://picsum.photos/200/200?random=${randomId}`;
                }
                const newCandidate = yield databaseService_1.DatabaseService.createCandidate(candidateData);
                res.status(201).json(newCandidate);
            }
            catch (error) {
                console.error('Error in createCandidate:', error);
                res.status(500).json({
                    error: 'Failed to create candidate',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // Update candidate
    static updateCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: 'Invalid candidate ID' });
                }
                const updateData = req.body;
                // Validate party if provided
                if (updateData.party && !databaseService_1.DatabaseService.isValidParty(updateData.party)) {
                    return res.status(400).json({
                        error: 'Invalid party. Must be one of: PSD, PNL, POT, AUR, Independent'
                    });
                }
                const updatedCandidate = yield databaseService_1.DatabaseService.updateCandidate(id, updateData);
                if (!updatedCandidate) {
                    return res.status(404).json({ error: 'Candidate not found' });
                }
                res.json(updatedCandidate);
            }
            catch (error) {
                console.error('Error in updateCandidate:', error);
                res.status(500).json({
                    error: 'Failed to update candidate',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // Delete candidate
    static deleteCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: 'Invalid candidate ID' });
                }
                const success = yield databaseService_1.DatabaseService.deleteCandidate(id);
                if (!success) {
                    return res.status(404).json({ error: 'Candidate not found' });
                }
                res.status(204).send();
            }
            catch (error) {
                console.error('Error in deleteCandidate:', error);
                res.status(500).json({
                    error: 'Failed to delete candidate',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // Generate fake candidate
    static generateFakeCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fakeCandidate = yield databaseService_1.DatabaseService.generateFakeCandidate();
                res.status(201).json(fakeCandidate);
            }
            catch (error) {
                console.error('Error in generateFakeCandidate:', error);
                res.status(500).json({
                    error: 'Failed to generate fake candidate',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
}
exports.CandidateController = CandidateController;
//# sourceMappingURL=candidateController.js.map