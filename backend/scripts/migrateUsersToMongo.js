const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const User = require('../models/User');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/minormap';

async function migrate() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, family: 4 });
    console.log('Connected to MongoDB for migration');

    const dataPath = path.join(__dirname, '..', 'data', 'users.json');
    const raw = await fs.readFile(dataPath, 'utf8');
    const users = JSON.parse(raw || '[]');

    for (const u of users) {
      const email = String(u.email).toLowerCase();
      const existing = await User.findOne({ email }).lean();
      if (existing) {
        console.log('Skipping existing user:', email);
        continue;
      }

      // Insert directly into collection to preserve already-hashed passwords
      const doc = {
        _id: u.id || u._id || undefined,
        name: u.name,
        email,
        password: u.password,
        role: u.role || 'student',
        createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
      };

      // Remove undefined _id to let Mongo create one if needed
      if (!doc._id) delete doc._id;

      await User.collection.insertOne(doc);
      console.log('Inserted user:', email);
    }

    console.log('Migration completed');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err && err.message ? err.message : err);
    process.exit(2);
  }
}

migrate();
