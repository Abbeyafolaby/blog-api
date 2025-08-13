import express from 'express';
import { authenticate } from '../middleware/auth.js';

// Create Express router for protected endpoints
const router = express.Router();

// GET /api/protected/me - Example protected route
// Returns current user information from JWT token
// Requires valid Authorization header with Bearer token
router.get('/me', authenticate, (req, res) => {
  return res.json({ 
    message: 'Protected route', 
    user: req.user 
  });
});

// Export the configured router
export default router;


