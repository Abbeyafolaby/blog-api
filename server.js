import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function start() {
  try {
    await connectDatabase(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();


