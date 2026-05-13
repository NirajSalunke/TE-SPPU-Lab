# Event Registration System — MERN Full Stack App (CC Assignment 15)

## 1. Overview

Build a simple **Event Registration System** as a full-stack **MERN** application
(MongoDB, Express, React, Node.js).
The focus is on event creation, user registration for events, clean architecture,
deployment on AWS, and a **good, modern UI**.

No payment integration (Stripe, Razorpay, etc.) is required.

---

## 2. Tech Stack

- **Frontend:** React (functional components, hooks, React Router)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (MongoDB Atlas recommended)
- **Styling / UI:** Tailwind CSS or a modern component library
  (Material UI / Chakra UI / shadcn/ui) — to ensure a polished, professional interface
- **Deployment Target:** AWS (EC2 / Elastic Beanstalk / Amplify) or equivalent

---

## 3. Core Functional Features

### 3.1 Event Management (Admin / Organizer)

- Create a new event with:
  - Event name (required)
  - Description
  - Date & time
  - Location / Venue
  - Maximum capacity (number of seats)
  - Event banner/image URL (optional)
- View list of all events
- Update an event's details
- Delete an event
- View all registrations for a specific event

### 3.2 Event Registration (User / Attendee)

- Browse all upcoming events on a public listing page
- View individual event details (name, description, date, venue, seats available)
- Register for an event by submitting:
  - Full name (required)
  - Email address (required)
  - Phone number (optional)
- After registering, show a confirmation screen with:
  - Registration details summary
  - A mock registration ID (e.g., `REG-2026-XXXXX`)
- Prevent registering for the same event with the same email twice
- Prevent registration if event has reached max capacity (show "Seats Full" badge)

### 3.3 Seat Availability Tracking

- Show total seats vs remaining seats on the event detail page
- Dynamically update available seats as registrations come in
- Visual indicator: e.g., green badge for available, red badge for full

---

## 4. Good UI Requirements

The UI must look **clean, modern, and professional** — not a bare unstyled HTML page.
This is a hard requirement for this assignment.

### Layout & Responsiveness
- Fully responsive layout for desktop and mobile (flexbox/grid)
- Clear navigation bar with app name/logo and links (Events, Admin Panel)
- Consistent page structure with header, main content, and footer

### Visual Design
- Consistent color palette (2–3 primary colors) and typography throughout
- Event cards with:
  - Banner/placeholder image
  - Event name, date, venue
  - Seats available badge (green/red)
  - "View Details" button
- Use shadows, rounded corners, and spacing — no raw, flat design
- Clear visual hierarchy (prominent headings, accent-colored action buttons)

### Interactions & Feedback
- Loading spinners or skeleton loaders while fetching events/registrations
- Success toast/alert after successful registration
- Error messages for validation (e.g., "Email is required", "Event is full")
- Confirmation modal/dialog before deleting an event (admin side)
- Smooth page transitions and hover effects on cards and buttons

### Usability
- Search or filter events by name or date (at minimum a simple search bar)
- Empty states: friendly message when no events exist or no results found
- Confirmation page after registration is a separate page (not just an alert)

---

## 5. API Requirements

RESTful API using Express + MongoDB.

**Events:**

| Method | Endpoint              | Description                              |
|--------|-----------------------|------------------------------------------|
| GET    | `/api/events`         | Get all events                           |
| GET    | `/api/events/:id`     | Get single event by ID                   |
| POST   | `/api/events`         | Create a new event (admin)               |
| PUT    | `/api/events/:id`     | Update event details (admin)             |
| DELETE | `/api/events/:id`     | Delete an event (admin)                  |

**Registrations:**

| Method | Endpoint                              | Description                              |
|--------|---------------------------------------|------------------------------------------|
| GET    | `/api/events/:id/registrations`       | Get all registrations for an event       |
| POST   | `/api/events/:id/register`            | Register a user for an event             |
| DELETE | `/api/registrations/:regId`           | Cancel/delete a registration (admin)     |

Use JSON for all request/response bodies.
Return proper HTTP status codes (201, 400, 404, 409 for duplicate registration, etc.).

---

## 6. Pages / Views (Frontend)

| Page / View              | Route (example)          | Description                                           |
|--------------------------|--------------------------|-------------------------------------------------------|
| Events Listing           | `/`                      | Public grid of all upcoming events with search        |
| Event Detail             | `/events/:id`            | Full event info, seats left, Register button          |
| Registration Form        | `/events/:id/register`   | Form to fill name, email, phone                       |
| Registration Confirmation| `/events/:id/success`    | Thank you page with mock registration ID              |
| Admin Dashboard          | `/admin`                 | List all events with Add / Edit / Delete actions      |
| Add/Edit Event           | `/admin/events/new`      | Form to create or update an event                     |
|                          | `/admin/events/:id/edit` |                                                       |
| View Registrations       | `/admin/events/:id/registrations` | Table of all registrations for that event   |

---

## 7. Non-Functional Requirements

- **Project Structure:**
  - Clear folder separation: `client/` (React) and `server/` (Node/Express)
  - Use environment variables for MongoDB URI, port, and any config secrets

- **Validation:**
  - Backend: validate required fields, duplicate email per event, capacity check
  - Frontend: form field validation with user-friendly error messages

- **Error Handling:**
  - Backend returns meaningful JSON error messages
  - Frontend displays toast/alert notifications for API errors

- **Deployment on AWS:**
  - Backend: Node.js/Express deployed on AWS EC2 or Elastic Beanstalk
  - Frontend: React build deployed via AWS Amplify, S3 + CloudFront, or served
    from the same EC2 instance
  - MongoDB: Use MongoDB Atlas (cloud-hosted, free tier)
  - All environment variables managed via `.env` (never hardcoded)
  - Document deployment steps briefly in README

---

## 8. Explicitly Not Required

- No payment gateways (Stripe, Razorpay, PayPal, etc.)
- No complex user authentication (no login/signup for attendees)
- No real-time seat updates via WebSockets
- No email confirmation sending (just show confirmation on screen)
- No multi-organizer / multi-role system

---

## 9. Seed Data

Provide at least **5 sample events** pre-seeded (or a seed script) with:
- Event name, description, date, venue, max capacity
- Placeholder image URLs (can use `https://picsum.photos`)

---

## 10. Deliverables

**GitHub Repository** containing:
- `client/` and `server/` source code
- This `requirements.md` at the root
- `README.md` with:
  - Local setup instructions (install + run)
  - `.env` variables explanation