# MERN Blog Application — PRD / Requirements

## 1. Product Overview
Build a modern **MERN stack blog application** with a polished UI, a clean reading experience, and a simple admin/content flow. The app will use:

- **Frontend:** React
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Auth:** Optional, if required for admin/editor access
- **Images:** No Cloudinary. Use random/public image sources or local placeholder images instead.
- **Payments:** Not included

The application should be fully configurable, with the frontend API base URL stored in an environment variable.

---

## 2. Goals
- Create a visually attractive blog platform with a good UX.
- Support blog browsing, reading, searching, categorization, and basic content management.
- Keep the backend simple and scalable.
- Avoid external paid services like Cloudinary and payments.
- Provide seed scripts so the database can be populated after setup, while the fresh database starts empty.

---

## 3. Scope

### In Scope
- Home page with featured posts and latest posts
- Blog listing page with filters and search
- Blog post detail page
- Categories and tags
- Author/admin dashboard for creating and managing posts
- Comments or reactions if needed
- Responsive UI for mobile, tablet, and desktop
- MongoDB schema design
- REST API in Express
- Seed scripts for demo data
- Environment-based API base URL in frontend

### Out of Scope
- Cloudinary integration
- Payment gateway integration
- E-commerce functionality
- Subscription billing
- Advanced analytics/dashboarding beyond basic counts
- Real-time chat

---

## 4. Target Users
- **Readers:** Browse, search, and read blog posts.
- **Admin/Editor:** Create, edit, publish, unpublish, and delete posts.
- **Guest Users:** Read public blog content without logging in.

---

## 5. Core Features

### 5.1 Public Blog Experience
- Home page with featured section
- Recent posts section
- Category-based navigation
- Search by title, tags, or content
- Blog post detail page with cover image, author, publish date, and content
- Related posts section
- Responsive design with modern UI

### 5.2 Content Management
- Create post
- Edit post
- Delete post
- Draft/published status
- Assign categories and tags
- Upload/attach image via URL or local placeholder selection

### 5.3 Optional Engagement Features
- Comments on posts
- Like/reaction counts
- Share buttons

### 5.4 Admin Utilities
- Dashboard overview
- Total posts, categories, comments, views
- Manage drafts and published posts
- Seed/reset database support for development

---

## 6. UI / UX Requirements
- Clean, modern blog layout
- Strong typography
- Card-based post previews
- Attractive hero section on the home page
- Smooth hover states and transitions
- Fully responsive layout
- Dark mode optional but recommended
- Empty states for no results, no posts, and loading states
- Skeleton loaders for better perceived performance

---

## 7. Technical Stack

### Frontend
- React
- React Router
- State management using Context API, Zustand, or Redux Toolkit
- Tailwind CSS or another utility-first styling system
- Axios or Fetch API for backend requests

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication if admin login is required
- Validation middleware
- RESTful API design

### Database
- MongoDB collections for users, posts, categories, tags, and comments

---

## 8. Environment Configuration
The frontend must not hardcode API URLs.

### Frontend env example
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### If using Create React App
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### Backend env example
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_blog
JWT_SECRET=your_secret_here
CLIENT_URL=http://localhost:5173
```

---

## 9. Data Model Requirements

### 9.1 User
- name
- email
- passwordHash
- role: `admin` | `editor` | `reader`
- avatarUrl optional
- createdAt
- updatedAt

### 9.2 Post
- title
- slug
- excerpt
- content
- coverImageUrl
- authorId
- categoryId
- tags
- status: `draft` | `published`
- featured: boolean
- createdAt
- updatedAt
- publishedAt

### 9.3 Category
- name
- slug
- description optional
- createdAt
- updatedAt

### 9.4 Comment (optional)
- postId
- userId or guestName
- message
- createdAt
- updatedAt

---

## 10. Image Strategy
Since Cloudinary is not used:
- Use random/public placeholder images from sources like Picsum or Unsplash source URLs.
- Support a fallback local placeholder image in the frontend/public folder.
- Store image URLs in the database rather than uploading to a media service.
- Ensure broken image fallback handling in the UI.

Recommended approach:
- During seeding, assign random cover image URLs to posts.
- In the create/edit post form, allow image URL input.
- For development, optionally use a fixed local placeholder image.

---

## 11. Seed Script Requirements
The database should start empty after setup.

### Seed scripts must:
- Insert sample categories
- Insert sample users, including at least one admin user
- Insert sample blog posts
- Insert optional sample comments
- Use realistic demo content
- Generate slugs automatically
- Assign random placeholder cover images
- Be runnable multiple times safely by clearing or checking existing data

### Recommended scripts
- `seed.js` or `seed.ts` to populate demo data
- `reset.js` optionally to clear collections before reseeding

### Seed behavior
- Fresh database stays empty by default
- Developer runs the seed command manually when demo data is needed

Example commands:
```bash
npm run seed
npm run seed:reset
```

---

## 12. API Requirements

### Public APIs
- `GET /api/posts`
- `GET /api/posts/:slug`
- `GET /api/categories`
- `GET /api/posts/featured`
- `GET /api/posts/search?q=`

### Admin APIs
- `POST /api/auth/login`
- `POST /api/posts`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Optional comments APIs
- `POST /api/posts/:id/comments`
- `GET /api/posts/:id/comments`

### API Standards
- Use JSON responses consistently
- Return proper HTTP status codes
- Validate request payloads
- Handle errors with a centralized error handler

---

## 13. Frontend Requirements
- Use reusable components
- Use a shared API client file that reads the base URL from env
- Keep routes modular
- Suggested pages:
  - Home
  - Blog listing
  - Blog details
  - Category page
  - Search results
  - Admin dashboard
  - Create/edit post page
  - Login page if auth is enabled

### Suggested frontend structure
```bash
src/
  api/
  components/
  pages/
  routes/
  hooks/
  utils/
  assets/
  layouts/
```

---

## 14. Backend Requirements
- Express server with modular routes
- Mongoose schemas and models
- Controllers and services separated cleanly
- Environment-based configuration
- Security middleware such as CORS, Helmet, and rate limiting where needed
- Image URLs stored as strings, not uploaded files

### Suggested backend structure
```bash
server/
  config/
  controllers/
  routes/
  models/
  middleware/
  services/
  seed/
  utils/
```

---

## 15. Non-Functional Requirements
- Fast page load and API response times
- Mobile responsive design
- Maintainable codebase
- Easy local setup
- Production-ready environment configuration
- Good error handling and loading states
- Accessible color contrast and semantic HTML where possible

---

## 16. Validation Rules
- Post title is required
- Post content is required
- Slug must be unique
- Category must be valid
- Cover image URL should be optional but supported
- Author/admin-only actions must be protected
- Comments, if enabled, should be sanitized/validated

---

## 17. Acceptance Criteria
The project is complete when:
- React frontend is connected to Express backend
- MongoDB stores all blog data
- API base URL is configurable through env variables
- Seed scripts can populate demo data
- Fresh DB is empty unless seed is run
- Blog UI looks modern and works on mobile and desktop
- No Cloudinary is used
- No payments are implemented
- Posts can be created, listed, viewed, edited, and deleted

---

## 18. Suggested Milestones
1. Project setup and folder structure
2. Backend models, routes, and controllers
3. Seed scripts and database population flow
4. Frontend pages and reusable UI components
5. API integration through env-based base URL
6. Admin content management
7. Final UI polish and responsive testing

---

## 19. Notes
- Use random placeholder images or static public URLs instead of image-upload services.
- Keep the first version focused on core blogging features.
- Make sure the database can be seeded cleanly for demos and development.

