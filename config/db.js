/**
 * Database connection configuration
 * Handles MongoDB connection setup and error handling
 */

import mongoose from 'mongoose';

/**
 * Establishes connection to MongoDB database
 * @param {string} mongoUri - MongoDB connection string
 * @throws {Error} If MONGO_URI is missing or connection fails
 */
async function connectDatabase(mongoUri) {
  // Validate that MongoDB URI is provided
  if (!mongoUri) {
    throw new Error('Missing MONGO_URI environment variable');
  }

  // Configure Mongoose options for better performance
  mongoose.set('strictQuery', true);

  // Attempt to connect to MongoDB
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000, // 10 second timeout
  });
}

// Export the database connection function
export { connectDatabase };


