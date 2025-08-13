import express from 'express';
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';

// Initialize Express application
const app = express();

// Apply middleware
// Parse incoming JSON requests
app.use(express.json());

// Health check endpoint - returns API status
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Blog API' });
});

// API route definitions
// Authentication routes (register, login)
app.use('/api/auth', authRoutes);
// Protected routes that require authentication
app.use('/api/protected', protectedRoutes);

// 404 handler - catch all unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Export the configured Express app
export default app;


