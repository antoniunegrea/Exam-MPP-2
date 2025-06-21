"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statisticsController_1 = require("../controllers/statisticsController");
const router = (0, express_1.Router)();
// Get party statistics
router.get('/party', statisticsController_1.StatisticsController.getPartyStatistics);
// Get comprehensive statistics
router.get('/comprehensive', statisticsController_1.StatisticsController.getComprehensiveStatistics);
// Generate fake candidate
router.post('/generate', statisticsController_1.StatisticsController.generateFakeCandidate);
exports.default = router;
