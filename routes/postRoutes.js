import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validatePost } from '../middleware/validation.js';
import { postLimiter } from '../middleware/rateLimit.js';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost
} from '../controllers/postController.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes (require authentication)
router.post('/', authenticate, postLimiter, validatePost, createPost);
router.put('/:id', authenticate, validatePost, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;
