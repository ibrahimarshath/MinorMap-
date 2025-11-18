const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Minor = require('../models/Minor');
const Question = require('../models/Question');
const User = require('../models/User');
const { quizBank } = require('../controllers/quizBankController');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/MinorMap_DB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    // Clear existing data
    await Minor.deleteMany();
    await Question.deleteMany();

    // Build minors from quizBank keys
    const minorIds = Object.keys(quizBank);
    const minors = minorIds.map(id => ({
      id,
      name: id.split(/-|_/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      description: `Eligibility quiz for ${id}`,
    }));

    if (minors.length) {
      await Minor.insertMany(minors);
      console.log(`✅ Inserted ${minors.length} minors`);
    } else {
      console.log('⚠️  No minors found in quizBank');
    }

    // Build question documents
    const questionDocs = [];
    minorIds.forEach(minorId => {
      const questions = quizBank[minorId] || [];
      questions.forEach(q => {
        const options = (q.options || []).map(opt => ({ text: opt, value: opt === q.correct }));
        const weights = { [minorId]: 3 }; // emphasize the corresponding minor
        questionDocs.push({ text: q.question, options, weights });
      });
    });

    if (questionDocs.length) {
      await Question.insertMany(questionDocs);
      console.log(`✅ Inserted ${questionDocs.length} questions`);
    } else {
      console.log('⚠️  No questions to insert');
    }

    // Create default admin user
    const adminExists = await User.findOne({ email: 'admin@minormap.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@minormap.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Admin user created (email: admin@minormap.com, password: admin123)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('\n🎉 Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

