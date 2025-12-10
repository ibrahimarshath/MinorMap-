const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Minor = require('../models/Minor');
const Question = require('../models/Question');

// Import data
// Note: quizBankController might be exporting using 'exports.quizBank = ...'
// We need to handle how it's required.
// If it's CommonJS, require should work.
const { quizBank } = require('../controllers/quizBankController');
const usersData = require('../data/users.json');

const connectDB = require('../config/db');

const seed = async () => {
  try {
    console.log("Connecting to DB...");
    // Define simple connection if config/db fails or is complex
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/minormap';
    await mongoose.connect(uri, { family: 4 });
    console.log("Connected.");

    // 1. Users
    console.log("Seeding Users...");
    await User.deleteMany({});

    // Clean users data (remove IDs, ensure valid)
    // We use insertMany to avoid the pre-save hook from re-hashing the already hashed passwords
    const cleanUsers = usersData.map(u => ({
      name: u.name,
      email: u.email,
      password: u.password,
      role: u.role || 'student'
    }));

    if (cleanUsers.length > 0) {
      await User.insertMany(cleanUsers);
    }
    console.log(`Imported ${cleanUsers.length} Users.`);

    // 2. Minors & Questions
    console.log("Seeding Minors and Questions...");
    await Minor.deleteMany({});
    await Question.deleteMany({});

    const minorsList = [];
    const questionsList = [];

    // quizBank structure: { "ai-ml": { minor: "Name", sets: { set1: [...] } } }
    for (const [key, data] of Object.entries(quizBank)) {
      // Create Minor
      minorsList.push({
        id: key,
        name: data.minor,
        description: `${data.minor} Studies`, // Simple fallback
      });

      // Extract Questions
      if (data.sets) {
        for (const [setKey, setQuestions] of Object.entries(data.sets)) {
          // setKey = 'set1'
          if (Array.isArray(setQuestions)) {
            setQuestions.forEach(q => {
              questionsList.push({
                minorId: key,
                set: setKey,
                originalId: q.id,
                type: q.type,
                question: q.question,
                options: q.options
              });
            });
          }
        }
      }
    }

    await Minor.insertMany(minorsList);
    console.log(`Imported ${minorsList.length} Minors.`);

    await Question.insertMany(questionsList);
    console.log(`Imported ${questionsList.length} Questions.`);

    console.log("Seeding Complete!");
    process.exit(0);

  } catch (e) {
    console.error("Seeding Failed:", e);
    process.exit(1);
  }
};

seed();
