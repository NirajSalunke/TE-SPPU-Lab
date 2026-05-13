# MERN To-Do List Manager — Requirements

## 1. Overview

Build a simple **To-Do List Manager** as a full-stack **MERN** application (MongoDB, Express, React, Node.js). [web:33][web:34]  
The focus is on basic task CRUD operations, clean architecture, deployment (e.g., on AWS), and a **good, modern UI**. [web:27][web:29][web:32][web:35]

No payment integration (Stripe, Razorpay, etc.) is required.

---

## 2. Tech Stack

- **Frontend:** React (functional components, hooks, React Router). [web:27][web:29]
- **Backend:** Node.js + Express.js. [web:30][web:33]
- **Database:** MongoDB MongoDB Atlas . [web:33][web:34]
- **Styling / UI:** Tailwind CSS or a modern component library (Material UI / Chakra UI / similar) to ensure a polished, consistent interface. [web:27][web:32][web:37]


---

## 3. Core Functional Features

### 3.1 To-Do CRUD

- Create a new to-do item with at least: `title` (required) and optional `description`. [web:27][web:29]
- Read/view the list of all to-dos. [web:27][web:29]
- Update an existing to-do (edit title and description). [web:27][web:30]
- Delete a to-do item. [web:27][web:30]

### 3.2 Completion Status

- Each to-do must have a `completed` status (true/false). [web:27][web:31]
- User can:
  - Mark a to-do as completed / not completed (e.g., via checkbox or toggle). [web:27][web:31]
  - Filter or view to-dos by status (All, Active, Completed). [web:27][web:29]

### 3.3 Optional Enhancements (if time permits)

- Due date field for to-dos. [web:36]
- Simple priority (e.g., Low / Medium / High). [web:36]
- Basic sorting (e.g., by creation date or due date). [web:36]

---

## 4. Good UI Requirements

The UI should look **clean, modern, and user-friendly**, not like a basic unstyled HTML page. [web:32][web:35][web:37][web:38]

- **Layout & Responsiveness**
  - Responsive layout working well on desktop and mobile (using flexbox/grid). [web:32][web:39]
  - Clear structure with a main header and a central content area for the to-do list and input form. [web:27][web:37]

- **Visual Design**
  - Use a consistent color palette (2–3 main colors) and consistent typography. [web:20][web:37]
  - To-dos displayed as cards or neat list items, with visual distinction for completed vs active tasks (e.g., strike-through, faded color, badges). [web:27][web:29]
  - Clear visual hierarchy: titles are prominent, primary actions (Add, Save, Delete) use accent buttons. [web:20][web:32]

- **Interactions & Feedback**
  - Show feedback on actions: loading indicators or disabled buttons during API calls, success/error messages after operations. [web:29][web:32]
  - Form validation with user-friendly error messages (e.g., “Title is required”). [web:30][web:32]
  - Confirmation before deleting a to-do (dialog or modal). [web:30][web:35]

- **Usability**
  - Easy-to-find input area to add new to-dos at the top of the page. [web:27][web:29]
  - Simple filters (All / Active / Completed) as tabs or buttons, clearly highlighted when active. [web:27][web:31]
  - Empty state design: when there are no to-dos, show a friendly message and a call-to-action to add the first item. [web:32][web:26]

Good UI is a **must** for this assignment: the app should feel like a small, production-ready tool rather than a bare demo. [web:32][web:35][web:38]

---

## 5. API Requirements

Implement a RESTful API using Express and MongoDB. [web:27][web:30][web:33]

**Base URL:** `/api/todos`

Endpoints:

- `GET /api/todos`  
  Return a list of all to-dos (optionally support query params like `status=completed`). [web:27][web:30]
- `GET /api/todos/:id`  
  Return a single to-do item by ID. [web:30]
- `POST /api/todos`  
  Create a new to-do. Request body should include at least `title` and optional fields (`description`, `completed`, etc.). [web:27][web:30]
- `PUT /api/todos/:id`  
  Update an existing to-do’s fields (title, description, completed status, etc.). [web:27][web:30]
- `DELETE /api/todos/:id`  
  Delete a to-do item by ID. [web:27][web:30]

Use JSON for all requests and responses and return appropriate HTTP status codes (201 for created, 400 for validation errors, 404 for not found, etc.). [web:30][web:33]

---

## 6. Pages / Views (Frontend)

| View / Page      | Route (example) | Description                                                         |
|------------------|-----------------|---------------------------------------------------------------------|
| To-Do Dashboard  | `/`             | Main view showing add form, filters, and the list of to-dos        |
| (Optional) About | `/about`        | Simple info page about the application/assignment                   |

Routing can be handled with React Router. [web:29][web:36]

Authentication is **not required** for this assignment (single-user, no login).

---

## 7. Non-Functional Requirements

- **Project Structure**
  - Clear separation of frontend and backend, e.g., `client/` (React) and `server/` (Node/Express). [web:28][web:31]
  - Use environment variables for sensitive data (e.g., MongoDB connection URI). [web:30][web:33]

- **Error Handling**
  - Backend should handle errors gracefully and return meaningful messages. [web:30][web:33]
  - Frontend should display user-friendly error/success notifications (e.g., toasts, alerts). [web:29][web:32]


---

## 8. Explicitly Not Required

- No payment gateways (Stripe, Razorpay, PayPal, etc.).
- No complex user authentication or authorization.
- No real-time features (sockets, live updates).
- No multi-project or multi-user workspace support (just a simple single-user to-do list). [web:36]

---

## 9. Deliverables

- **GitHub Repository** containing:
  - `client/` and `server/` code.
  - This `requirements.md` file at the root.
  - `README.md` with:
    - Setup instructions (install, run dev and prod).
    - Environment variable configuration.