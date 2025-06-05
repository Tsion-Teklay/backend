// backend/index.js
const express = require('express');
const app = express();

app.use(express.json());

let tasks = [
  { id: 1, title: 'Buy groceries', completed: false },
  { id: 2, title: 'Read a book', completed: true }
];

// GET /api/tasks — Return all tasks or filtered by status
app.get('/api/tasks', (req, res) => {
  const { status } = req.query;
  let filteredTasks = tasks;

  if (status === 'completed') {
    filteredTasks = tasks.filter(t => t.completed === true);
  } else if (status === 'pending') {
    filteredTasks = tasks.filter(t => t.completed === false);
  }

  res.json(filteredTasks);
});

// POST /api/tasks — Add a new task (with validation)
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and cannot be empty' });
  }
  const newTask = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
    title: title.trim(),
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id — Mark as completed
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  task.completed = true;
  res.json(task);
});

// DELETE /api/tasks/:id — Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const deletedTask = tasks.splice(index, 1);
  res.json(deletedTask[0]);
});

// Simple homepage to show API status
app.get('/', (req, res) => {
  res.send('<h1>Task Manager API is running</h1>');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
