
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('tasks.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT  'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP

  )`)

export default db
console.log(db)