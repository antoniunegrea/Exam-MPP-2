import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

// Register new user
router.post('/register', AuthController.register);

// Login user
router.post('/login', AuthController.login);

// Get user by CNP
router.get('/user/:cnp', AuthController.getUser);

export default router; 