import express from 'express';
import { register, login } from '../controllers/authController.js';

// Create Express router for authentication endpoints
const router = express.Router();

// POST /api/auth/register - User registration endpoint
// Creates new user account with name, email, and password
router.post('/register', register);

// POST /api/auth/login - User login endpoint
// Authenticates user credentials and returns JWT token
router.post('/login', login);

// Export the configured router
export default router;


