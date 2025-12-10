const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI not set — skipping DB connection (quiz bank routes still work)');
    return;
  }
  try {
    const conn = await mongoose.connect(uri, {
      // Modern MongoDB driver no longer needs these legacy flags.
      // Add serverSelectionTimeoutMS to fail fast if server isn't reachable
      serverSelectionTimeoutMS: 10000,
      // Prefer IPv4 to avoid issues on some Windows IPv6 setups
      family: 4,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.warn('Continuing without database — some endpoints may be disabled.');
  }
};

module.exports = connectDB;

