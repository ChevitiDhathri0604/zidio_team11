const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const serverless = require('serverless-http');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const aiRoutes = require('./routes/aiRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Normalize base path for serverless handler
app.use((req, res, next) => {
  if (req.url.startsWith('/.netlify/functions/netlify-api')) {
    req.url = req.url.replace('/.netlify/functions/netlify-api', '');
  }
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  next();
});

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'active', platform: 'IntellMeet Netlify Serverless API', time: new Date() });
});

mongoose.set('bufferCommands', false);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/intellmeet';

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => console.log('✅ Connected to MongoDB Database'))
  .catch(() => console.warn('⚠️ MongoDB disconnected. Running IntellMeet in Standalone Mode.'));

module.exports = app;
module.exports.handler = serverless(app);
