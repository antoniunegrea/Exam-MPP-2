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
exports.optionalAuth = exports.authenticateUser = void 0;
const databaseService_1 = require("../services/databaseService");
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const cnp = authHeader.substring(7); // Remove 'Bearer ' prefix
        if (!cnp || cnp.length !== 13) {
            return res.status(401).json({ error: 'Invalid token format' });
        }
        // Verify user exists in database
        const user = yield databaseService_1.DatabaseService.getUserByCnp(cnp);
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        // Add user to request object
        req.user = {
            id: user.id,
            cnp: user.cnp,
            created_at: user.created_at
        };
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});
exports.authenticateUser = authenticateUser;
const optionalAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const cnp = authHeader.substring(7);
            if (cnp && cnp.length === 13) {
                const user = yield databaseService_1.DatabaseService.getUserByCnp(cnp);
                if (user) {
                    req.user = {
                        id: user.id,
                        cnp: user.cnp,
                        created_at: user.created_at
                    };
                }
            }
        }
        next();
    }
    catch (error) {
        // Continue without authentication for optional routes
        next();
    }
});
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map