# MERN Stack To-Do Management Application  
**Document Type:** PRD + Requirements  
**Frontend:** React  
**Backend:** Node.js + Express  
**Database:** MongoDB  
**Version:** 1.0  

---

## 1. Product Overview

This application is a clean, modern To-Do Management system built with the MERN stack. It focuses on creating, organizing, updating, and tracking to-do items entirely through database-backed workflows.

The product intentionally excludes:
- Cloudinary
- Payment systems
- Any paid workflow or transaction flow
- External media storage services unless required later

For task images or card visuals, the app will use random placeholder images instead of image upload/storage services.

---

## 2. Goals

- Build a visually polished to-do management application.
- Store all task data in MongoDB.
- Keep the backend modular and scalable.
- Make the frontend API base URL configurable through environment variables.
- Provide database seed scripts so the project does not start with an empty database.
- Ensure the UI is modern, responsive, and easy to use.

---

## 3. Non-Goals

This project will **not** include:
- Payments
- Subscriptions
- Cloudinary or file storage integrations
- Marketplace features
- E-commerce features
- Complex third-party dependencies unless needed for core functionality

---

## 4. Target Users

- Individual users managing daily tasks
- Small teams organizing internal work
- Students tracking assignments
- Developers using it as a starter template for task-based apps

---

## 5. Core Features

### 5.1 Task Management
- Create task
- Edit task
- Delete task
- Mark task as completed/incomplete
- View task details
- Filter tasks by status, priority, due date, and category
- Search tasks by title or description
- Sort tasks by date, priority, or status

### 5.2 Task Organization
- Categories or lists
- Priority levels such as Low, Medium, High
- Due date support
- Tags or labels
- Progress tracking

### 5.3 UI/UX
- Modern dashboard layout
- Responsive design for mobile, tablet, and desktop
- Smooth interactions and clear empty states
- Clean cards, badges, buttons, dialogs, and forms
- Placeholder/random images for task cards if visuals are needed

### 5.4 Database and Seeding
- MongoDB collections for tasks and any supporting entities
- Seed scripts for initial data
- Database should not be empty after setup
- Re-seeding support for development environments

---

## 6. Functional Requirements

### 6.1 Task CRUD
The system must allow users to:
- Create a new task with title, description, status, priority, due date, category, tags, and optional image placeholder
- Update existing tasks
- Delete tasks
- Retrieve all tasks
- Retrieve a single task by ID

### 6.2 Search and Filters
The system must support:
- Searching tasks by keywords
- Filtering by status
- Filtering by priority
- Filtering by due date range
- Filtering by category
- Sorting by newest, oldest, priority, or completion status

### 6.3 Placeholder Images
Instead of Cloudinary:
- Use random image URLs from a placeholder image source
- Store only the URL string in MongoDB
- Allow fallback image when no image is available

### 6.4 Seed Data
The application must include seed scripts that:
- Insert sample tasks
- Insert sample categories/tags if needed
- Support development reset and reseed workflows
- Run separately from the main server start process

---

## 7. Non-Functional Requirements

- Responsive and accessible UI
- Fast task loading and smooth interaction
- Clean code structure
- Secure API handling
- Configurable environment-based API base URL
- Maintainable backend architecture
- Minimal but useful dependencies
- Easy local development setup

---

## 8. Tech Stack

### Frontend
- React
- Vite recommended
- React Router
- Axios or Fetch API
- UI library or custom component system for polished design
- Environment variables for API base URL

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- cors
- nodemon for development

### Optional Utilities
- Zod or Joi for validation
- bcrypt/jsonwebtoken only if authentication is added later
- A seed runner such as `mongoose` seed scripts or custom Node scripts

---

## 9. Suggested Project Structure

```bash
todo-app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.jsx
│   ├── .env
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── seed/
│   │   ├── utils/
│   │   └── app.js
│   ├── .env
│   └── package.json
└── README.md
```

---

## 10. Frontend Requirements

### Pages
- Dashboard
- All Tasks
- Task Details
- Add Task
- Edit Task
- Categories or Filters view
- Optional analytics summary section

### Components
- Sidebar or top navigation
- Task cards
- Task form modal or page
- Filter controls
- Search bar
- Status badge
- Priority badge
- Empty state UI
- Loading skeletons
- Confirmation dialog for deletes

### API Configuration
The frontend must use an environment variable for the API base URL.

Example:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

All API calls should use this base URL so the app can be moved between environments without code changes.

---

## 11. Backend Requirements

### Server Responsibilities
- Expose REST APIs for tasks
- Validate request payloads
- Connect to MongoDB
- Support seed scripts
- Handle errors consistently
- Provide CORS support for frontend requests

### API Endpoints
Recommended endpoints:

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `DELETE /api/tasks/:id`
- `GET /api/health`

Optional:
- `GET /api/tasks/stats/summary`
- `GET /api/categories`
- `POST /api/seed` for dev only, if needed

---

## 12. Data Model

### Task
Recommended fields:
- `title` (string, required)
- `description` (string, optional)
- `status` (enum: pending, in-progress, completed)
- `priority` (enum: low, medium, high)
- `dueDate` (date, optional)
- `category` (string or referenced category)
- `tags` (array of strings)
- `imageUrl` (string, optional)
- `createdAt`
- `updatedAt`

### Category
Optional model:
- `name`
- `color`
- `createdAt`
- `updatedAt`

---

## 13. Seeding Requirements

The project must include seed scripts that:
- Drop or clear existing development collections when needed
- Insert sample categories
- Insert sample tasks
- Use random placeholder images for seeded tasks
- Be runnable from the command line

Example scripts:
- `npm run seed`
- `npm run seed:reset`
- `npm run seed:dev`

Seeded data should make the app look populated on first launch.

---

## 14. Environment Variables

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend `.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo_app
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

---

## 15. Random Image Strategy

Since Cloudinary is excluded:
- Use static placeholder image URLs
- Or generate image URLs from a free placeholder provider
- Store only the URL in MongoDB
- Keep fallback image behavior in the frontend

Examples of usage:
- Task card thumbnail
- Board/list visual accents
- Seed data illustrations

---

## 16. Error Handling

The system should return clear API errors for:
- Missing required fields
- Invalid task ID
- Validation errors
- Database connection issues
- Unauthorized routes if auth is added later

Frontend should show:
- Toast notifications
- Inline validation messages
- Friendly fallback UI for API failures

---

## 17. Security Considerations

- Use environment variables for secrets and API URLs
- Validate all incoming payloads
- Enable CORS for only trusted origins
- Sanitize user input where needed
- Avoid exposing internal stack traces in production

---

## 18. Acceptance Criteria

The project is complete when:
- Users can manage tasks fully from the UI
- Task data persists in MongoDB
- API base URL is environment-driven
- Seed scripts populate the database successfully
- The UI looks polished and responsive
- No Cloudinary or payment flow exists
- The app works cleanly in local development

---

## 19. Implementation Notes for Antigravity

- Keep the backend and frontend clearly separated
- Make reusable API service functions
- Keep environment-based configuration for all server URLs
- Add seed scripts early so the app has visible data during development
- Use placeholder images instead of upload logic
- Keep the data model simple and extensible
- Prefer modular routes, controllers, services, and models

---

## 20. Deliverables

- React frontend application
- Express + Node backend
- MongoDB schema/models
- REST API endpoints
- Seed scripts
- Environment configuration files
- Documentation for setup and development

---

## 21. Recommended File Name

Use either:
- `PRD.md`
- `requirements.md`

Both can contain the same content. If only one file is needed, `requirements.md` is a practical choice.
