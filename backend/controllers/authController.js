const jwt = require('jsonwebtoken');
const fileUserStore = require('../utils/fileUserStore');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user exists
    const userExists = await fileUserStore.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user (stored in file)
    const created = await fileUserStore.create({
      name,
      email,
      password,
      role: 'student',
    });

    // Generate token (use created.id)
    const token = generateToken(created.id || created._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: created.id || created._id,
          name: created.name,
          email: created.email,
          role: created.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user and include password for comparison (file store)
    const userWithPassword = await fileUserStore.findOne({ email });

    if (!userWithPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
    // Check if password matches
    const isMatch = await fileUserStore.comparePassword(password, userWithPassword.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(userWithPassword.id || userWithPassword._id);

    // Return user without password
    const { password: pw, ...safeUser } = userWithPassword;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: safeUser.id || safeUser._id,
          name: safeUser.name,
          email: safeUser.email,
          role: safeUser.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await fileUserStore.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

