
const BASE_URL = 'http://localhost:3000';

// 1. GET — Retrieve all tasks
async function getAllTasks() {
  const response = await fetch(`${BASE_URL}/tasks`);
  const data = await response.json();

  console.log('All tasks:', response.status, data);
}

// 2. GET — Retrieve one task by ID
async function getTaskById(id) {
  const response = await fetch(`${BASE_URL}/tasks/${id}`);
  const data = await response.json();

  console.log('Task by ID:', response.status, data);
}

// 3. POST — Create a task
async function createTask(task) {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });

  const data = await response.json();

  console.log('Create task:', response.status, data);
}

// 4. PATCH — Update selected task fields
async function patchTask(id, updates) {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  const data = await response.json();

  console.log('Patch task:', response.status, data);
}

// 5. PUT — Replace a task's editable fields
async function replaceTask(id, task) {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });

  const data = await response.json();

  console.log('Replace task:', response.status, data);
}

// 6. DELETE — Remove a task
async function deleteTask(id) {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE'
  });

  const data = await response.json();

  console.log('Delete task:', response.status, data);
}

// Choose which function to run by uncommenting its call.

// getAllTasks();
// getTaskById(1);

// createTask({
//   title: 'Learn Node.js',
//   description: 'Practise backend development',
//   priority: 'high',
//   due_date: '2026-11-15'
// });

// patchTask(1, {
//   status: 'completed'
// });

// replaceTask(1, {
//   title: 'Learn Express',
//   description: 'Build a Task Management API',
//   status: 'in_progress',
//   priority: 'medium',
//   due_date: '2026-11-20'
// });

// deleteTask(1);
