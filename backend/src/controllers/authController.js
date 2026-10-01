const User = require('../models/User');
const jwt = require('jsonwebtoken');

// In-Memory store fallback when MongoDB service is offline
const inMemoryUsers = [];

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    try {
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: 'User already exists' });

      const user = await User.create({ name, email, password });
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } catch (dbErr) {
      // In-Memory DB Fallback
      let existing = inMemoryUsers.find(u => u.email === email);
      if (existing) return res.status(400).json({ message: 'User already exists' });

      const newUser = { _id: 'mem_' + Date.now(), name, email, password };
      inMemoryUsers.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: generateToken(newUser._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id)
        });
      }
    } catch (dbErr) {
      // In-Memory DB Fallback
      const memUser = inMemoryUsers.find(u => u.email === email && u.password === password);
      if (memUser) {
        return res.json({
          _id: memUser._id,
          name: memUser.name,
          email: memUser.email,
          token: generateToken(memUser._id)
        });
      }

      // Auto-register demo account for instant access in demo mode
      if (email && password) {
        const demoUser = { _id: 'mem_' + Date.now(), name: email.split('@')[0], email, password };
        inMemoryUsers.push(demoUser);
        return res.json({
          _id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email,
          token: generateToken(demoUser._id)
        });
      }
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (user) return res.json(user);
    } catch (dbErr) {
      const memUser = inMemoryUsers.find(u => u._id === req.user.id);
      if (memUser) return res.json({ _id: memUser._id, name: memUser.name, email: memUser.email, role: 'User' });
    }
    res.json({ _id: req.user.id, name: 'IntellMeet User', email: 'user@intellmeet.io', role: 'User' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
