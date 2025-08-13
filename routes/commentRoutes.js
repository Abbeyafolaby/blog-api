import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateComment } from '../middleware/validation.js';
import { commentLimiter } from '../middleware/rateLimit.js';
import {
  addComment,
  getComments,
  deleteComment
} from '../controllers/commentController.js';

const router = express.Router();

// Public routes
router.get('/posts/:postId/comments', getComments);

// Protected routes (require authentication)
router.post('/posts/:postId/comments', authenticate, commentLimiter, validateComment, addComment);
router.delete('/:id', authenticate, deleteComment);

export default router;
