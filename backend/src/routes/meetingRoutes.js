const express = require('express');
const router = express.Router();
const { createMeeting, joinMeeting, getUserMeetings, getMeetingDetails } = require('../controllers/meetingController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createMeeting);
router.post('/join/:code', protect, joinMeeting);
router.get('/my-meetings', protect, getUserMeetings);
router.get('/:id', protect, getMeetingDetails);

module.exports = router;
