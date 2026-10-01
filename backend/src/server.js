const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const aiRoutes = require('./routes/aiRoutes');
const taskRoutes = require('./routes/taskRoutes');
const setupSocketIO = require('./realtime/socketHandler');

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tasks', taskRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'active', platform: 'IntellMeet AI Backend', time: new Date() });
});

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
setupSocketIO(io);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/intellmeet';

// Disable Mongoose buffering so operations fail immediately if Mongo is not connected
mongoose.set('bufferCommands', false);

// Asynchronously attempt MongoDB connection without blocking server listening
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => console.log('✅ Connected to MongoDB Database'))
  .catch(() => console.warn('⚠️ MongoDB not running. Running IntellMeet in Resilient Standalone Mode.'));

// Immediately start HTTP server
server.listen(PORT, () => {
  console.log(`🚀 IntellMeet Server running on port ${PORT}`);
});
