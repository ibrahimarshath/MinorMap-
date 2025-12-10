const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/minormap';

async function check() {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // fail fast
    });
    const admin = mongoose.connection.db.admin();
    const res = await admin.ping();
    console.log('MongoDB ping response:', res);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    process.exit(2);
  }
}

check();
