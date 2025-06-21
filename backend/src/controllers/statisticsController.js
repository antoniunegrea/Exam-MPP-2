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
exports.StatisticsController = void 0;
const databaseService_1 = require("../services/databaseService");
class StatisticsController {
    // Get party statistics
    static getPartyStatistics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const partyStats = yield databaseService_1.DatabaseService.getPartyStatistics();
                res.json(partyStats);
            }
            catch (error) {
                console.error('Error in getPartyStatistics:', error);
                res.status(500).json({
                    error: 'Failed to fetch party statistics',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // Get comprehensive statistics
    static getComprehensiveStatistics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield databaseService_1.DatabaseService.getComprehensiveStatistics();
                res.json(stats);
            }
            catch (error) {
                console.error('Error in getComprehensiveStatistics:', error);
                res.status(500).json({
                    error: 'Failed to fetch comprehensive statistics',
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
exports.StatisticsController = StatisticsController;
