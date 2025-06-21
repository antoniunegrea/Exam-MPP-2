"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Register new user
router.post('/register', authController_1.AuthController.register);
// Login user
router.post('/login', authController_1.AuthController.login);
// Get user by CNP
router.get('/user/:cnp', authController_1.AuthController.getUser);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map