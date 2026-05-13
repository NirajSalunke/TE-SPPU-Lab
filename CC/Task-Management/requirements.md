# MERN Task Management App — Requirements

## 1. Overview

Build a simple Task Management web application using the **MERN stack** (MongoDB, Express, React, Node.js). [web:22]  
The focus is on a clean architecture, basic CRUD features, and a **good, modern UI** suitable for a deployment-focused assignment. [web:14][web:20]

---

## 2. Tech Stack

- **Frontend:** React (with hooks, React Router) [web:22]
- **Backend:** Node.js + Express.js [web:22]
- **Database:** MongoDB (Atlas or local) [web:22]
- **Styling / UI:** Tailwind CSS or a component library like Material UI / Chakra UI for a polished interface [web:14][web:20]

No payment gateway (Stripe/Razorpay/etc.) is required.

---

## 3. Core Features (Functional)

### 3.1 Task CRUD

- Create a new task with: title (required), description, status, due date, and priority. [web:19]
- View a list of all tasks. [web:14][web:19]
- Update an existing task’s details (title, description, status, due date, priority). [web:14][web:19]
- Delete a task. [web:14][web:19]

### 3.2 Task Status & Filtering

- Support at least three statuses: `Pending`, `In Progress`, `Completed`. [web:19]
- Ability to:
  - Filter tasks by status (All, Pending, In Progress, Completed). [web:14][web:19]
  - Optionally filter or sort by due date or priority. [web:14][web:19]

### 3.3 Task Details

- Clicking on a task should open a detail view/modal with full information. [web:16][web:19]
- Show created/updated timestamps for tasks. [web:19]

---

## 4. User Experience & Good UI Requirements

The UI should not look like a bare-bones form; it must feel like a simple, modern dashboard. [web:14][web:19][web:26]

- **Layout**
  - Responsive layout that works on desktop and mobile (flexbox/grid). [web:14][web:26]
  - Clear separation between sidebar/topbar (navigation) and main content (task list). [web:26]

- **Visual Design**
  - Use a consistent color palette and typography (e.g., 2–3 primary colors, consistent font sizes). [web:20][web:26]
  - Use cards or clean list items for tasks with visual indicators for status (e.g., colored badges). [web:14][web:20]
  - Clear hierarchy: titles stand out, actions are easy to see, primary buttons visually emphasized. [web:20]

- **Interactions**
  - Smooth feedback for actions (loading spinners or disabled buttons while saving, subtle transitions). [web:16][web:26]
  - Validation messages for required fields (e.g., empty title) and error states (API errors). [web:16]
  - Confirmation dialog before deleting a task. [web:16]

- **Usability**
  - Filters and status toggles should be one-click and clearly visible (e.g., tabs, pills, or buttons). [web:14][web:19]
  - Show a small counter for total tasks and completed tasks. [web:14]
  - Empty states: when there are no tasks or no tasks match the filter, show a friendly message instead of a blank screen. [web:26]

Overall, the app should look **clean, modern, and easy to use**, not like a default unstyled HTML app. [web:20][web:26]

---

## 5. API Requirements

Implement a RESTful API for tasks using Express and MongoDB. [web:14][web:19]

**Base URL:** `/api/tasks`

Endpoints:

- `GET /api/tasks` — Get list of tasks, support optional query params for status or sorting. [web:19]
- `GET /api/tasks/:id` — Get a single task by ID. [web:16][web:19]
- `POST /api/tasks` — Create a new task.
- `PUT /api/tasks/:id` — Update an existing task. [web:14][web:19]
- `DELETE /api/tasks/:id` — Delete a task. [web:14][web:19]

Use JSON for request/response and handle basic validation and error responses with proper status codes. [web:16][web:19]

---

## 6. Pages / Views

| Page / View        | Route (example) | Description                                           |
|--------------------|-----------------|-------------------------------------------------------|
| Task Dashboard     | `/`             | Main list with filters and quick actions              |
| Task Detail / Edit | `/tasks/:id`    | View and edit a single task                           |
| New Task           | `/tasks/new`    | Form to create a new task                             |

Routing can be done on the frontend using React Router. [web:13][web:16]

Authentication is **not required** for this assignment, but the structure should allow adding it later.

---

## 7. Non-Functional Requirements

- Use environment variables for configuration (MongoDB connection string, etc.). [web:13][web:19]
- Code should be organized using clear folders:
  - `client/` (React) and `server/` (Node/Express), or similar structure. [web:13][web:14]
- Include basic error handling on both frontend and backend (show user-friendly messages in the UI). [web:16]
- App should be deployed and accessible via a public URL (frontend + backend). [web:15]

---

## 8. What Is Explicitly Not Required

- No payment integration (Stripe, Razorpay, PayPal, etc.).
- No advanced role-based access control.
- No real-time features (websockets, live collaboration).
- No complex project management (just single-user, simple tasks). [web:21][web:24]

---

## 9. Deliverables

- GitHub repository with:
  - `client` and `server` code.
  - This `requirements.md` file in the root.
  - `README.md` with:
    - Setup instructions for local development.
    - Environment variable description.
    - Deployment instructions (brief). [web:13][web:15]
