const express = require('express');
const router = express.Router();
const { getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getTasks);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
