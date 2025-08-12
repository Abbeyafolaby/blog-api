require('dotenv').config();
const app = require('./app');
const { connectDatabase } = require('./config/db');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function start() {
  try {
    await connectDatabase(MONGO_URI);
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();


