const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/minormap';

async function createAdmin() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, family: 4 });
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin123!';

    const existing = await User.findOne({ email: String(email).toLowerCase() }).lean();
    if (existing) {
      console.log('Admin already exists:', email);
      await mongoose.disconnect();
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const doc = {
      name: 'Administrator',
      email: String(email).toLowerCase(),
      password: hashed,
      role: 'admin',
    };

    const created = await User.create(doc);
    console.log('Created admin user:', created.email);
    console.log('Admin credentials -> email:', email, 'password:', password);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err && err.message ? err.message : err);
    process.exit(2);
  }
}

createAdmin();
