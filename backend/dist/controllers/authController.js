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
exports.AuthController = void 0;
const databaseService_1 = require("../services/databaseService");
class AuthController {
    // Register new user with CNP
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cnp } = req.body;
                // Validate CNP
                if (!cnp || typeof cnp !== 'string') {
                    return res.status(400).json({
                        error: 'CNP is required and must be a string'
                    });
                }
                // CNP must be exactly 13 digits
                if (cnp.length !== 13 || !/^\d{13}$/.test(cnp)) {
                    return res.status(400).json({
                        error: 'CNP must be exactly 13 digits'
                    });
                }
                // Check if user already exists
                const existingUser = yield databaseService_1.DatabaseService.getUserByCnp(cnp);
                if (existingUser) {
                    return res.status(409).json({
                        error: 'User with this CNP already exists'
                    });
                }
                // Register the user
                const user = yield databaseService_1.DatabaseService.registerUser(cnp);
                res.status(201).json({
                    message: 'User registered successfully',
                    user: {
                        id: user.id,
                        cnp: user.cnp,
                        created_at: user.created_at
                    }
                });
            }
            catch (error) {
                console.error('Error in register:', error);
                res.status(500).json({
                    error: 'Failed to register user',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // Login user with CNP
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cnp } = req.body;
                // Validate CNP
                if (!cnp || typeof cnp !== 'string') {
                    return res.status(400).json({
                        error: 'CNP is required and must be a string'
                    });
                }
                // CNP must be exactly 13 digits
                if (cnp.length !== 13 || !/^\d{13}$/.test(cnp)) {
                    return res.status(400).json({
                        error: 'CNP must be exactly 13 digits'
                    });
                }
                // Try to login the user
                const user = yield databaseService_1.DatabaseService.loginUser(cnp);
                if (!user) {
                    return res.status(401).json({
                        error: 'Invalid CNP. User not found.'
                    });
                }
                res.json({
                    message: 'Login successful',
                    user: {
                        id: user.id,
                        cnp: user.cnp,
                        created_at: user.created_at
                    }
                });
            }
            catch (error) {
                console.error('Error in login:', error);
                res.status(500).json({
                    error: 'Failed to login user',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // Get user by CNP (for verification)
    static getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cnp } = req.params;
                if (!cnp || typeof cnp !== 'string') {
                    return res.status(400).json({
                        error: 'CNP is required'
                    });
                }
                const user = yield databaseService_1.DatabaseService.getUserByCnp(cnp);
                if (!user) {
                    return res.status(404).json({
                        error: 'User not found'
                    });
                }
                res.json({
                    user: {
                        id: user.id,
                        cnp: user.cnp,
                        created_at: user.created_at
                    }
                });
            }
            catch (error) {
                console.error('Error in getUser:', error);
                res.status(500).json({
                    error: 'Failed to get user',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map