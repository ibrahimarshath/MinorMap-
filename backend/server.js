const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/testRoutes'));
app.use('/api', require('./routes/adminRoutes'));
// Simple in-memory quiz bank for frontend integration
app.use('/api', require('./routes/quizBankRoutes'));
// Unified quiz API that prefers DB-backed quizzes and falls back to quizBank
app.use('/api/quiz', require('./routes/quizRoutes'));

// Serve static files from frontend
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MinorMap+ API is running',
    timestamp: new Date().toISOString(),
  });
});

// Redirect root to login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 MinorMap+ Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏠 Application: http://localhost:${PORT}/`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health\n`);
});


// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

