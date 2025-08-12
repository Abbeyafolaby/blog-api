import mongoose from 'mongoose';

async function connectDatabase(mongoUri) {
  if (!mongoUri) {
    throw new Error('Missing MONGO_URI environment variable');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
}

export { connectDatabase };


