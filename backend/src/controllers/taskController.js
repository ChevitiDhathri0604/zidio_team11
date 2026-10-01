const Task = require('../models/Task');

const inMemoryTasks = [
  { _id: 't1', title: 'System Architecture Alignment', assignee: 'Frontend Lead', priority: 'High', status: 'Pending', dueDate: 'Tomorrow' },
  { _id: 't2', title: 'WebRTC Signaling Socket Test', assignee: 'Realtime Lead', priority: 'High', status: 'In Progress', dueDate: '2 days' },
  { _id: 't3', title: 'AI Transcript Summarization', assignee: 'AI Lead', priority: 'Medium', status: 'Completed', dueDate: 'Yesterday' }
];

// Get User Tasks
const getTasks = async (req, res) => {
  try {
    try {
      const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
      return res.json(tasks);
    } catch (dbErr) {
      return res.json(inMemoryTasks);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Task Status
const updateTask = async (req, res) => {
  try {
    const { status, title, assignee, priority, dueDate } = req.body;
    try {
      const task = await Task.findById(req.params.id);
      if (task) {
        if (status) task.status = status;
        if (title) task.title = title;
        if (assignee) task.assignee = assignee;
        if (priority) task.priority = priority;
        if (dueDate) task.dueDate = dueDate;
        await task.save();
        return res.json(task);
      }
    } catch (dbErr) {
      const memTask = inMemoryTasks.find(t => t._id === req.params.id);
      if (memTask) {
        if (status) memTask.status = status;
        if (title) memTask.title = title;
        if (assignee) memTask.assignee = assignee;
        if (priority) memTask.priority = priority;
        if (dueDate) memTask.dueDate = dueDate;
        return res.json(memTask);
      }
    }
    res.status(404).json({ message: 'Task not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    try {
      const task = await Task.findById(req.params.id);
      if (task) {
        await task.deleteOne();
        return res.json({ message: 'Task removed' });
      }
    } catch (dbErr) {
      const index = inMemoryTasks.findIndex(t => t._id === req.params.id);
      if (index !== -1) {
        inMemoryTasks.splice(index, 1);
        return res.json({ message: 'Task removed' });
      }
    }
    res.status(404).json({ message: 'Task not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, updateTask, deleteTask };
