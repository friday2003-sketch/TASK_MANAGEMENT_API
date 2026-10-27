# Task Management API

A RESTful API built with **Node.js, Express.js, and SQLite** for creating, managing, filtering, searching, sorting, and paginating tasks.

This project demonstrates practical backend development skills, including REST API design, database integration, request validation, error handling, and dynamic SQL queries.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation and Setup](#installation-and-setup)
- [Running the API](#running-the-api)
- [API Endpoints](#api-endpoints)
- [Task Data Model](#task-data-model)
- [Filtering and Searching](#filtering-and-searching)
- [Sorting](#sorting)
- [Pagination](#pagination)
- [Example Requests](#example-requests)
- [Validation and Error Handling](#validation-and-error-handling)
- [Future Improvements](#future-improvements)
- [Learning Outcomes](#learning-outcomes)
- [Author](#author)

## Overview

The Task Management API provides a backend service for managing tasks throughout their lifecycle.

Users can create tasks, retrieve existing tasks, update task information, change task status, and delete tasks. The API also supports filtering tasks by status or priority, searching titles, sorting results, and retrieving records in pages.

Task data is stored persistently in an SQLite database.

The project was developed as a practical exercise in building a structured backend application using modern JavaScript and RESTful API principles.

## Features

### Task Management

- Create new tasks.
- Retrieve all tasks.
- Retrieve an individual task by ID.
- Partially update a task using PATCH.
- Replace a task's editable fields using PUT.
- Delete an existing task.

### Filtering and Search

- Filter tasks by status.
- Filter tasks by priority.
- Search task titles using partial text matching.
- Combine multiple filters in a single request.

### Sorting

- Sort by approved fields such as ID, title, status, priority, due date, and creation date.
- Support ascending and descending order.
- Use default sorting when no valid sort field is supplied.

### Pagination

- Select a page using the `page` query parameter.
- Set the number of results using `limit`.
- Use a default page size of 10.
- Restrict page size to a maximum of 100 tasks.
- Combine pagination with filtering and sorting.

### Validation and Error Handling

- Validate required task titles.
- Validate allowed task statuses and priorities.
- Validate task IDs.
- Reject invalid pagination values.
- Return appropriate HTTP status codes for common success and error cases.

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime for the backend |
| Express.js | HTTP server and API routing |
| SQLite | Relational database for persistent storage |
| `node:sqlite` | Built-in Node.js SQLite API |
| JavaScript ES Modules | Organizing and importing application code |
| Fetch API | Sending HTTP requests from the test client |

## Project Structure

```text
Task-Management-API/
├── index.js       # Express server and API routes
├── database.js    # SQLite database connection and table setup
├── client.js      # Client-side API testing functions
├── tasks.db       # SQLite database file, created at runtime
├── package.json   # Project configuration and dependencies
├── package-lock.json
└── README.md      # Project documentation
```

The exact files present may vary depending on your local setup.

### File Responsibilities

**`index.js`**

Initializes the Express application, registers middleware, defines API endpoints, validates requests, and returns responses.

**`database.js`**

Creates the SQLite database connection and ensures that the `tasks` table exists.

**`client.js`**

Contains JavaScript functions that send HTTP requests to the API for testing its functionality.

**`tasks.db`**

Stores task records. This file is generated when the database connection is opened, provided the application has permission to create it.

## Requirements

Before running the project, install or prepare the following:

- Node.js with support for the built-in `node:sqlite` module.
- npm, which comes with Node.js.
- A terminal such as PowerShell, Command Prompt, or a compatible shell.
- An API client or the included JavaScript client for testing requests.

## Installation and Setup

### 1. Clone the repository

If the project is hosted on GitHub:

```bash
git clone YOUR_REPOSITORY_URL
```

Replace `YOUR_REPOSITORY_URL` with the actual repository URL.

Alternatively, open your existing project folder directly in your terminal.

### 2. Navigate to the project directory

```bash
cd "Task Management API"
```

Use the actual folder name if yours differs.

### 3. Install dependencies

```bash
npm install
```

Make sure Express is listed in the project's dependencies.

If the project does not yet have Express installed, run:

```bash
npm install express
```

### 4. Confirm ES module configuration

The `package.json` file should contain:

```json
{
  "type": "module"
}
```

If your existing `package.json` contains other properties, keep them and confirm that `"type": "module"` is included at the top level.

## Running the API

Start the server:

```bash
node index.js
```

The expected startup message is:

```text
Task Management API is running on port 3000
```

The API base URL is:

```text
http://localhost:3000
```

Keep the server terminal running while sending requests.

## API Endpoints

All endpoints use the base URL:

`http://localhost:3000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Retrieve tasks |
| GET | `/tasks/:id` | Retrieve a task by ID |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/:id` | Partially update a task |
| PUT | `/tasks/:id` | Replace editable task fields |
| DELETE | `/tasks/:id` | Delete a task |

### 1. Retrieve All Tasks

**Request**

```http
GET /tasks
```

Returns a list of tasks. Filtering, sorting, and pagination query parameters may also be supplied.

### 2. Retrieve a Task by ID

**Request**

```http
GET /tasks/1
```

Returns the task with ID `1` if it exists.

Possible responses:

- `200 OK` — task found.
- `400 Bad Request` — invalid task ID.
- `404 Not Found` — task does not exist.

### 3. Create a Task

**Request**

```http
POST /tasks
Content-Type: application/json
```

Example request body:

```json
{
  "title": "Learn Express.js",
  "description": "Practice building REST APIs",
  "priority": "high",
  "due_date": "2026-12-15"
}
```

The task title is required. If omitted, status defaults to `pending`, priority defaults to `medium`, and optional fields may be stored as `null`.

A successful creation returns `201 Created` and the new task ID.

### 4. Partially Update a Task

**Request**

```http
PATCH /tasks/1
Content-Type: application/json
```

Example request body:

```json
{
  "status": "completed"
}
```

PATCH updates only the supplied fields, leaving other fields unchanged.

Allowed statuses:

- `pending`
- `in_progress`
- `completed`

Allowed priorities:

- `low`
- `medium`
- `high`

### 5. Replace a Task

**Request**

```http
PUT /tasks/1
Content-Type: application/json
```

Example request body:

```json
{
  "title": "Complete API project",
  "description": "Finish documentation and testing",
  "status": "in_progress",
  "priority": "high",
  "due_date": "2026-12-20"
}
```

PUT requires the title and replaces the task's editable fields. Optional fields omitted from the request use the route's defined defaults rather than retaining their previous values.

### 6. Delete a Task

**Request**

```http
DELETE /tasks/1
```

Deletes the task if it exists.

Possible responses:

- `200 OK` — task deleted.
- `400 Bad Request` — invalid task ID.
- `404 Not Found` — task does not exist.

## Task Data Model

The database uses a `tasks` table with the following fields:

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER | Primary key |
| `title` | TEXT | Required task title |
| `description` | TEXT | Optional task description |
| `status` | TEXT | Task status; defaults to `pending` |
| `priority` | TEXT | Task priority; defaults to `medium` |
| `due_date` | TEXT | Optional due date |
| `created_at` | TEXT | Creation timestamp |

The table is created automatically when `database.js` runs, using `CREATE TABLE IF NOT EXISTS`.

## Filtering and Searching

Filtering lets clients retrieve only the tasks that match specific criteria.

### Filter by Status

```http
GET /tasks?status=pending
```

Returns tasks whose status is `pending`.

### Filter by Priority

```http
GET /tasks?priority=high
```

Returns high-priority tasks.

### Search Task Titles

```http
GET /tasks?search=JavaScript
```

Searches for titles containing the supplied text using SQL `LIKE` matching.

### Combine Filters

```http
GET /tasks?status=pending&priority=high
```

Returns tasks matching both conditions.

Another example:

```http
GET /tasks?status=completed&search=Express
```

Returns completed tasks whose titles contain `Express`.

## Sorting

The API supports sorting through the `sortBy` and `order` query parameters.

### Sort by Title

```http
GET /tasks?sortBy=title&order=asc
```

### Sort by Creation Date

```http
GET /tasks?sortBy=created_at&order=desc
```

### Supported Sort Fields

- `id`
- `title`
- `status`
- `priority`
- `due_date`
- `created_at`

The API uses an allowlist for sort fields rather than inserting arbitrary column names from user input into the SQL query.

The default sort field is `created_at`, and the default order is descending.

## Pagination

Pagination returns a limited number of matching records per request.

### Retrieve the First Page

```http
GET /tasks?page=1&limit=10
```

### Retrieve the Second Page

```http
GET /tasks?page=2&limit=10
```

### Retrieve Five Tasks per Page

```http
GET /tasks?page=1&limit=5
```

### Combine Filtering, Sorting, and Pagination

```http
GET /tasks?status=pending&priority=high&sortBy=title&order=asc&page=1&limit=10
```

This request filters tasks by status and priority, sorts them by title, and returns the first page of up to 10 matching tasks.

### How Pagination Works

- `page` specifies the requested page.
- `limit` specifies the maximum number of tasks returned.
- `LIMIT` controls the number of results returned by SQLite.
- `OFFSET` determines how many matching results to skip.

The offset is calculated using:

```js
const offset = (currentPage - 1) * pageSize;
```

The API defaults to page 1 and a page size of 10. The current implementation accepts positive integer page numbers and limits from 1 through 100.

### Example Paginated Response

```json
{
  "page": 1,
  "limit": 10,
  "tasks": [
    {
      "id": 1,
      "title": "Learn Node.js",
      "description": "Practice backend fundamentals",
      "status": "pending",
      "priority": "high",
      "due_date": "2026-12-15",
      "created_at": "2026-10-27 10:00:00"
    }
  ]
}
```

This is an illustrative response. The actual records and timestamps depend on the database.

The current pagination response includes the requested page, page size, and returned tasks. Total record counts and total page counts are not currently included.

## Example Requests

You can test the API using `client.js`, a REST client, or a tool such as curl.

### Create a Task Using curl

```bash
curl -X POST http://localhost:3000/tasks ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Learn Express\",\"priority\":\"high\"}"
```

The `^` line continuation works in Windows Command Prompt. In PowerShell, use a suitable PowerShell line continuation or run the command on one line.

### Retrieve Tasks Using curl

```bash
curl "http://localhost:3000/tasks?page=1&limit=10"
```

### Update a Task Using curl

```bash
curl -X PATCH http://localhost:3000/tasks/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"status\":\"completed\"}"
```

### Delete a Task Using curl

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## Validation and Error Handling

The API validates incoming data before applying database changes.

Examples include:

- Rejecting missing or empty task titles.
- Rejecting unsupported status values.
- Rejecting unsupported priority values.
- Rejecting invalid task IDs.
- Returning an error when a task does not exist.
- Rejecting empty PATCH requests.
- Rejecting invalid page numbers or page sizes.

Common HTTP status codes include:

| Status | Meaning |
|---|---|
| `200 OK` | Request completed successfully |
| `201 Created` | Resource created successfully |
| `400 Bad Request` | Invalid input |
| `404 Not Found` | Requested task does not exist |

## Future Improvements

Potential improvements for future versions include:

- Include total matching records and total pages in paginated responses.
- Add automated tests using a testing framework.
- Add centralized error-handling middleware.
- Add stricter date validation for `due_date`.
- Add case-insensitive search and escape SQL `LIKE` wildcard characters when literal matching is desired.
- Add API documentation using OpenAPI or Swagger.
- Add authentication and authorization.
- Add database migrations and deployment configuration.
- Deploy the API to a hosting platform.

## Learning Outcomes

Building this project provided practical experience with:

- Designing RESTful endpoints.
- Using Express middleware and route handlers.
- Reading route parameters and query parameters.
- Validating and processing JSON request bodies.
- Using HTTP methods appropriately.
- Integrating SQLite with Node.js.
- Writing parameterized SQL queries.
- Building dynamic filtering and sorting queries.
- Implementing pagination with `LIMIT` and `OFFSET`.
- Returning meaningful HTTP responses.
- Organizing backend code into separate modules.

## Author

**FRIDAY FRIDAY EMMANUEL**

Backend development learner focused on building practical projects with JavaScript, Node.js, Express, and databases.

Replace this section with your preferred name, GitHub profile, and other portfolio links before publishing the project.

---

*This project was built for learning and portfolio development. Test all documented endpoints and query combinations before presenting the repository as production-ready.*
