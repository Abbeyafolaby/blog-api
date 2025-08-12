import express from 'express';
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Blog API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;


