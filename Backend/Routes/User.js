const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const authenticateToken = require('../Middleware/authmiddleware');
const adminMiddleware = require('../Middleware/adminmiddleware');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Modified signup route to prevent admin from creating new login accounts
router.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Prevent admin role creation via signup
    if (role === 'admin') {
      return res.status(403).json({ error: 'Admin account creation is not allowed via signup' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'student',
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Admin/Instructor route to add users
router.post('/api/admin/users', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    // Restrict instructors from creating other instructors or admins
    if (req.user.role === 'instructor' && role !== 'student') {
      return res.status(403).json({ error: 'Instructors can only create student accounts' });
    }

    if (!['student', 'instructor'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either student or instructor' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();

    res.status(201).json({
      message: `User created successfully by ${req.user.role}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Admin user creation error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// POST /api/auth/login - Authenticate user
router.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

// GET /api/auth/me - Get current user profile
router.get('/api/auth/me', authenticateToken, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// GET /api/auth/verify - Verify token and return user data
router.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Token verification failed' });
  }
});

module.exports = router;
