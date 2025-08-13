/* eslint-disable no-undef */
import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';

// Server configuration
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

/**
 * Main server startup function
 * Connects to MongoDB and starts the Express server
 */
async function start() {
  try {
    // Connect to MongoDB database
    await connectDatabase(MONGO_URI);
    
    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // Log error and exit if server fails to start
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
start();


