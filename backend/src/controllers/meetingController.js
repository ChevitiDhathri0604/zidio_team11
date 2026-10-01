const Meeting = require('../models/Meeting');
const Workspace = require('../models/Workspace');

const inMemoryMeetings = [];

// Generate short random code
const generateMeetingCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create or Schedule Meeting
const createMeeting = async (req, res) => {
  try {
    const { title, scheduledAt } = req.body;
    const code = generateMeetingCode();
    const scheduleDate = scheduledAt ? new Date(scheduledAt) : new Date();

    try {
      const meeting = await Meeting.create({
        title: title || 'IntellMeet Discussion',
        code,
        host: req.user.id,
        scheduledAt: scheduleDate,
        participants: [req.user.id]
      });
      return res.status(201).json(meeting);
    } catch (dbErr) {
      const memMeeting = {
        _id: 'm_' + Date.now(),
        title: title || 'IntellMeet Discussion',
        code,
        host: req.user.id,
        scheduledAt: scheduleDate,
        participants: [req.user.id],
        createdAt: new Date()
      };
      inMemoryMeetings.unshift(memMeeting);
      return res.status(201).json(memMeeting);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join Meeting by Code
const joinMeeting = async (req, res) => {
  try {
    const { code } = req.params;
    const uppercaseCode = code.toUpperCase();

    try {
      const meeting = await Meeting.findOne({ code: uppercaseCode });
      if (meeting) {
        if (!meeting.participants.includes(req.user.id)) {
          meeting.participants.push(req.user.id);
          await meeting.save();
        }
        return res.json(meeting);
      }
    } catch (dbErr) {
      let memMeeting = inMemoryMeetings.find(m => m.code === uppercaseCode);
      if (!memMeeting) {
        memMeeting = {
          _id: 'm_' + Date.now(),
          title: 'Joined IntellMeet Session',
          code: uppercaseCode,
          host: req.user.id,
          participants: [req.user.id],
          scheduledAt: new Date(),
          createdAt: new Date()
        };
        inMemoryMeetings.unshift(memMeeting);
      }
      return res.json(memMeeting);
    }

    res.status(404).json({ message: 'Meeting not found with given code' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Meetings
const getUserMeetings = async (req, res) => {
  try {
    try {
      const meetings = await Meeting.find({ participants: req.user.id })
        .populate('host', 'name email')
        .sort({ createdAt: -1 });
      return res.json(meetings);
    } catch (dbErr) {
      return res.json(inMemoryMeetings);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Meeting Details
const getMeetingDetails = async (req, res) => {
  try {
    try {
      const meeting = await Meeting.findById(req.params.id)
        .populate('host', 'name email')
        .populate('participants', 'name email');
      if (meeting) return res.json(meeting);
    } catch (dbErr) {
      const mem = inMemoryMeetings.find(m => m._id === req.params.id);
      if (mem) return res.json(mem);
    }
    res.status(404).json({ message: 'Meeting not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createMeeting, joinMeeting, getUserMeetings, getMeetingDetails };
