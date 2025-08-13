import express from 'express';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import { generalLimiter, authLimiter } from './middleware/rateLimit.js';
import { sanitizeInput } from './middleware/validation.js';

// Initialize Express application
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
app.use(generalLimiter);

// Apply middleware
// Parse incoming JSON requests
app.use(express.json({ limit: '10mb' }));

// Input sanitization to prevent XSS
app.use(sanitizeInput);

// Health check endpoint - returns API status
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Blog API' });
});

// API route definitions
// Authentication routes (register, login) - with stricter rate limiting
app.use('/api/auth', authLimiter, authRoutes);

// Post routes
app.use('/api/posts', postRoutes);

// Comment routes
app.use('/api/comments', commentRoutes);

// Protected routes that require authentication
app.use('/api/protected', protectedRoutes);

// 404 handler - catch all unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// Export the configured Express app
export default app;


