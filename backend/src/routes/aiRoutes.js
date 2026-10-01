const express = require('express');
const router = express.Router();
const { getWorkspaceByMeeting, processAISummary, askMeetingAI } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.get('/workspace/:meetingId', protect, getWorkspaceByMeeting);
router.post('/summarize', protect, processAISummary);
router.post('/ask', protect, askMeetingAI);

module.exports = router;
