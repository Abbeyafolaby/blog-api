import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', authenticate, (req, res) => {
  return res.json({ message: 'Protected route', user: req.user });
});

export default router;


