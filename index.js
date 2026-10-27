import express from 'express'
import db from './database.js'
const app=express()
const PORT=3000
app.use(express.json())

app.get('/tasks', (req, res) => {
  const {
    status,
    priority,
    search,
    sortBy,
    order,
    page,
    limit
  } = req.query;

  // 1. Set pagination defaults
  const currentPage = page === undefined ? 1 : Number(page);
  const pageSize = limit === undefined ? 10 : Number(limit);

  if (
    !Number.isInteger(currentPage) ||
    currentPage < 1 ||
    !Number.isInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > 100
  ) {
    return res.status(400).json({
      error: 'Page must be a positive integer, and limit must be between 1 and 100'
    });
  }

  // 2. Calculate the number of tasks to skip
  const offset = (currentPage - 1) * pageSize;

  // 3. Prepare filtering conditions
  const conditions = [];
  const values = [];

  // Filter by status
  if (status) {
    if (!['pending', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({
        error: 'Status must be pending, in_progress, or completed'
      });
    }

    conditions.push('status = ?');
    values.push(status);
  }

  // Filter by priority
  if (priority) {
    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({
        error: 'Priority must be low, medium, or high'
      });
    }

    conditions.push('priority = ?');
    values.push(priority);
  }

  // Search task titles
  if (search) {
    conditions.push('title LIKE ?');
    values.push(`%${search}%`);
  }

  // 4. Build the SQL query
  let sql = 'SELECT * FROM tasks';

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  // 5. Select an allowed sorting column
  const allowedSortFields = [
    'id',
    'title',
    'status',
    'priority',
    'due_date',
    'created_at'
  ];

  let sortField;

  if (allowedSortFields.includes(sortBy)) {
    sortField = sortBy;
  } else {
    sortField = 'created_at';
  }

  // 6. Select the sorting direction
  let sortOrder;

  if (order === 'asc') {
    sortOrder = 'ASC';
  } else {
    sortOrder = 'DESC';
  }

  sql += ` ORDER BY ${sortField} ${sortOrder}`;

  // 7. Add pagination
  sql += ' LIMIT ? OFFSET ?';

  // 8. Retrieve the requested page
  const tasks = db.prepare(sql).all(
    ...values,
    pageSize,
    offset
  );

  // 9. Return the results
  res.json({
    page: currentPage,
    limit: pageSize,
    tasks
  });
});

app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      error: 'Task ID must be a positive integer'
    });
  }

  const task = db.prepare(
    'SELECT * FROM tasks WHERE id = ?'
  ).get(id);

  if (!task) {
    return res.status(404).json({
      error: 'Task not found'
    });
  }

  res.json(task);
});

app.post('/tasks', (req, res) => {
  const {
    title,
    description = null,
    priority = 'medium',
    due_date = null
  } = req.body;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: 'Title is required and must be a non-empty string'
    });
  }

  if (
    typeof priority !== 'string' ||
    !['low', 'medium', 'high'].includes(priority)
  ) {
    return res.status(400).json({
      error: 'Priority must be low, medium, or high'
    });
  }

  if (description !== null && typeof description !== 'string') {
    return res.status(400).json({
      error: 'Description must be a string'
    });
  }

  if (due_date !== null && typeof due_date !== 'string') {
    return res.status(400).json({
      error: 'Due date must be a string'
    });
  }

  const result = db.prepare(`
    INSERT INTO tasks (title, description, priority, due_date)
    VALUES (?, ?, ?, ?)
  `).run(title.trim(), description, priority, due_date);

  res.status(201).json({
    message: 'Task created successfully',
    taskId: Number(result.lastInsertRowid)
  });
});

app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      error: 'Task ID must be a positive integer'
    });
  }

  const existingTask = db.prepare(
    'SELECT * FROM tasks WHERE id = ?'
  ).get(id);

  if (!existingTask) {
    return res.status(404).json({
      error: 'Task not found'
    });
  }

  const {
    title,
    description = null,
    status = 'pending',
    priority = 'medium',
    due_date = null
  } = req.body;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: 'Title is required and must be a non-empty string'
    });
  }

  if (
    typeof status !== 'string' ||
    !['pending', 'in_progress', 'completed'].includes(status)
  ) {
    return res.status(400).json({
      error: 'Status must be pending, in_progress, or completed'
    });
  }

  if (
    typeof priority !== 'string' ||
    !['low', 'medium', 'high'].includes(priority)
  ) {
    return res.status(400).json({
      error: 'Priority must be low, medium, or high'
    });
  }

  if (description !== null && typeof description !== 'string') {
    return res.status(400).json({
      error: 'Description must be a string or null'
    });
  }

  if (due_date !== null && typeof due_date !== 'string') {
    return res.status(400).json({
      error: 'Due date must be a string or null'
    });
  }

  db.prepare(`
    UPDATE tasks
    SET title = ?,
        description = ?,
        status = ?,
        priority = ?,
        due_date = ?
    WHERE id = ?
  `).run(
    title.trim(),
    description,
    status,
    priority,
    due_date,
    id
  );

  const updatedTask = db.prepare(
    'SELECT * FROM tasks WHERE id = ?'
  ).get(id);

  res.json({
    message: 'Task replaced successfully',
    task: updatedTask
  });
});

app.patch('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      error: 'Task ID must be a positive integer'
    });
  }

  const existingTask = db.prepare(
    'SELECT * FROM tasks WHERE id = ?'
  ).get(id);

  if (!existingTask) {
    return res.status(404).json({
      error: 'Task not found'
    });
  }

  const { title, description, status, priority, due_date } = req.body;

  const allowedFields = [
    'title',
    'description',
    'status',
    'priority',
    'due_date'
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      error: 'Provide at least one field to update'
    });
  }

  if (
    updates.title !== undefined &&
    (typeof updates.title !== 'string' || updates.title.trim() === '')
  ) {
    return res.status(400).json({
      error: 'Title must be a non-empty string'
    });
  }

  if (
    updates.status !== undefined &&
    (typeof updates.status !== 'string' ||
      !['pending', 'in_progress', 'completed'].includes(updates.status))
  ) {
    return res.status(400).json({
      error: 'Status must be pending, in_progress, or completed'
    });
  }

  if (
    updates.priority !== undefined &&
    (typeof updates.priority !== 'string' ||
      !['low', 'medium', 'high'].includes(updates.priority))
  ) {
    return res.status(400).json({
      error: 'Priority must be low, medium, or high'
    });
  }

  if (
    updates.description !== undefined &&
    updates.description !== null &&
    typeof updates.description !== 'string'
  ) {
    return res.status(400).json({
      error: 'Description must be a string or null'
    });
  }

  if (
    updates.due_date !== undefined &&
    updates.due_date !== null &&
    typeof updates.due_date !== 'string'
  ) {
    return res.status(400).json({
      error: 'Due date must be a string or null'
    });
  }

  if (updates.title !== undefined) {
    updates.title = updates.title.trim();
  }

  const fields = Object.keys(updates);
  const values = Object.values(updates);

  const setClause = fields
    .map(field => `${field} = ?`)
    .join(', ');

  db.prepare(`
    UPDATE tasks
    SET ${setClause}
    WHERE id = ?
  `).run(...values, id);

  const updatedTask = db.prepare(
    'SELECT * FROM tasks WHERE id = ?'
  ).get(id);

  res.json(updatedTask);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      error: 'Task ID must be a positive integer'
    });
  }

  const existingTask = db.prepare(
    'SELECT * FROM tasks WHERE id = ?'
  ).get(id);

  if (!existingTask) {
    return res.status(404).json({
      error: 'Task not found'
    });
  }

  db.prepare(
    'DELETE FROM tasks WHERE id = ?'
  ).run(id);

  res.json({
    message: 'Task deleted successfully',
    taskId: id
  });
});

app.listen(PORT, ()=>{
  console.log(`Task management API is running on port ${PORT}`)
})