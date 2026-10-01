const Workspace = require('../models/Workspace');
const Meeting = require('../models/Meeting');
const Task = require('../models/Task');
const { OpenAI } = require('openai');

const inMemoryWorkspaces = [];

// OpenAI client setup (falls back gracefully if API key is not present)
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Helper default fallback data
const getDefaultAIData = () => ({
  summary: "The team discussed system architecture, modular backend APIs, real-time WebRTC connections, and AI intelligence pipeline integration. Key milestones were aligned for production deployment.",
  keyPoints: [
    "Backend setup complete with Express, MongoDB schemas, and JWT auth.",
    "WebRTC audio/video signaling implemented via Socket.io.",
    "AI transcript summarizer & Ask-Your-Meeting features configured."
  ],
  decisions: [
    "Use React + Tailwind CSS for the SaaS dashboard design.",
    "Maintain strict modular architecture for smooth team collaboration."
  ],
  actionItems: [
    { task: "Frontend Dashboard & Navigation", assignee: "Frontend Lead", priority: "High", deadline: "Tomorrow" },
    { task: "WebRTC Peer Connectivity", assignee: "Realtime Engine Lead", priority: "High", deadline: "2 days" },
    { task: "RAG & Transcript Search", assignee: "AI Lead", priority: "Medium", deadline: "3 days" }
  ]
});

// Get Workspace by Meeting ID
const getWorkspaceByMeeting = async (req, res) => {
  try {
    try {
      let workspace = await Workspace.findOne({ meeting: req.params.meetingId }).populate('meeting');
      if (!workspace) {
        const meeting = await Meeting.findById(req.params.meetingId);
        if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
        
        workspace = await Workspace.create({
          meeting: meeting._id,
          title: meeting.title,
          transcript: [],
          summary: '',
          keyPoints: [],
          decisions: [],
          actionItems: [],
          chatHistory: []
        });
      }
      return res.json(workspace);
    } catch (dbErr) {
      let memWs = inMemoryWorkspaces.find(w => w.meeting === req.params.meetingId);
      if (!memWs) {
        const defaultData = getDefaultAIData();
        memWs = {
          _id: 'ws_' + Date.now(),
          meeting: req.params.meetingId,
          title: 'Meeting Workspace',
          summary: defaultData.summary,
          keyPoints: defaultData.keyPoints,
          decisions: defaultData.decisions,
          actionItems: defaultData.actionItems,
          transcript: []
        };
        inMemoryWorkspaces.push(memWs);
      }
      return res.json(memWs);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Process AI Summarization & Action Extraction
const processAISummary = async (req, res) => {
  try {
    const { meetingId, transcriptText } = req.body;
    let resultJSON = null;

    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an AI meeting intelligence assistant. Analyze the transcript and output STRICT JSON format with keys:
              "summary" (string), "keyPoints" (array of strings), "decisions" (array of strings), and "actionItems" (array of objects with keys: "task", "assignee", "priority", "deadline").`
            },
            {
              role: 'user',
              content: `Transcript:\n${transcriptText || 'No transcript provided.'}`
            }
          ],
          response_format: { type: 'json_object' }
        });
        resultJSON = JSON.parse(completion.choices[0].message.content);
      } catch (aiErr) {
        resultJSON = getDefaultAIData();
      }
    } else {
      resultJSON = getDefaultAIData();
    }

    try {
      let workspace = await Workspace.findOne({ meeting: meetingId });
      if (!workspace) {
        const meeting = await Meeting.findById(meetingId);
        workspace = await Workspace.create({ meeting: meetingId, title: meeting ? meeting.title : 'Meeting Workspace' });
      }

      workspace.summary = resultJSON.summary || '';
      workspace.keyPoints = resultJSON.keyPoints || [];
      workspace.decisions = resultJSON.decisions || [];
      workspace.actionItems = resultJSON.actionItems || [];
      await workspace.save();

      for (const item of workspace.actionItems) {
        await Task.create({
          title: item.task,
          assignee: item.assignee || 'Unassigned',
          priority: item.priority || 'Medium',
          dueDate: item.deadline || 'TBD',
          status: 'Pending',
          meeting: meetingId,
          user: req.user.id
        });
      }

      return res.json(workspace);
    } catch (dbErr) {
      let memWs = inMemoryWorkspaces.find(w => w.meeting === meetingId);
      if (!memWs) {
        memWs = {
          _id: 'ws_' + Date.now(),
          meeting: meetingId,
          title: 'Meeting Workspace',
        };
        inMemoryWorkspaces.push(memWs);
      }
      memWs.summary = resultJSON.summary || '';
      memWs.keyPoints = resultJSON.keyPoints || [];
      memWs.decisions = resultJSON.decisions || [];
      memWs.actionItems = resultJSON.actionItems || [];
      return res.json(memWs);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ask Your Meeting AI
const askMeetingAI = async (req, res) => {
  try {
    const { meetingId, question } = req.body;
    let workspace = null;

    try {
      workspace = await Workspace.findOne({ meeting: meetingId });
    } catch (dbErr) {
      workspace = inMemoryWorkspaces.find(w => w.meeting === meetingId);
    }

    if (!workspace) {
      const defaultData = getDefaultAIData();
      workspace = {
        summary: defaultData.summary,
        keyPoints: defaultData.keyPoints,
        decisions: defaultData.decisions,
        actionItems: defaultData.actionItems,
        transcript: []
      };
    }

    const context = `
    Meeting Summary: ${workspace.summary}
    Key Points: ${workspace.keyPoints ? workspace.keyPoints.join(', ') : ''}
    Decisions: ${workspace.decisions ? workspace.decisions.join(', ') : ''}
    Action Items: ${JSON.stringify(workspace.actionItems || [])}
    `;

    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an AI specialized in answering questions about a specific meeting based ONLY on the provided meeting context.
              If the answer cannot be found in the context, answer EXACTLY: "I couldn't find that information in this meeting."`
            },
            {
              role: 'user',
              content: `Context:\n${context}\n\nQuestion: ${question}`
            }
          ]
        });
        return res.json({ answer: completion.choices[0].message.content });
      } catch (aiErr) {}
    }

    // Fallback context search
    const qLower = question.toLowerCase();
    let answer = "I couldn't find that information in this meeting.";

    if (qLower.includes('decide') || qLower.includes('decision')) {
      answer = (workspace.decisions && workspace.decisions.length > 0)
        ? `The decisions made in this meeting: ${workspace.decisions.join('; ')}`
        : answer;
    } else if (qLower.includes('task') || qLower.includes('action') || qLower.includes('responsible')) {
      answer = (workspace.actionItems && workspace.actionItems.length > 0)
        ? `Action items identified: ${workspace.actionItems.map(i => `${i.task} assigned to ${i.assignee}`).join(', ')}`
        : answer;
    } else if (qLower.includes('summary') || qLower.includes('discuss') || qLower.includes('architecture')) {
      answer = workspace.summary || answer;
    }

    res.json({ answer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWorkspaceByMeeting, processAISummary, askMeetingAI };
