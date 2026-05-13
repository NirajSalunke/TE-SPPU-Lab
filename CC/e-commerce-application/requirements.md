# E-Commerce Web App — Assignment Requirements

## Overview
A simple, functional e-commerce web application built for academic/assignment purposes.
No real payment gateway integration required (Stripe, Razorpay, etc.).
Make sure that UI is good and functions (if not orignal just mimic things) 
IMP goal it should be easy to be deployed on AWS!

---

## Tech Stack (Suggested)
- **Frontend:** React + Tailwind CSS
- **Backend:** Node.js / Express
- **Database:** MongoDB Atlas

---

## Core Features

### 1. Product Listing Page
- Display a grid/list of products
- Each product shows: image, name, price, short description
- Basic search bar to filter products by name

### 2. Product Detail Page
- Full product details: image, name, price, description
- "Add to Cart" button

### 3. Shopping Cart
- Add / remove products
- Update quantity
- Display subtotal per item and total price
- Cart stored in localStorage or session (no login required)

### 4. Checkout Page
- Simple form: Name, Email, Address, Phone
- Order summary shown before placing order
- "Place Order" button — no real payment needed
- On submit: show a success page / confirmation message

### 5. Order Confirmation Page
- Display a "Thank you" message
- Show order summary (items, total, delivery address)
- Generate a mock Order ID

---

## Admin Panel (Optional but Recommended)
- Add / Edit / Delete products (name, price, image URL, description, stock)
- View placed orders list
- Simple auth: hardcoded admin username + password (no OAuth needed)

---

## What is NOT Required
- Real payment gateway (Stripe, Razorpay, PayPal, etc.)
- User login / registration (auth system)
- Email notifications
- Inventory/stock management
- Shipping/tracking integration

---

## Pages Summary

| Page | Route | Description |
|---|---|---|
| Home / Product Listing | `/` | All products grid |
| Product Detail | `/product/:id` | Single product view |
| Cart | `/cart` | Cart items + total |
| Checkout | `/checkout` | Address form + order summary |
| Order Confirmation | `/order-success` | Thank you + mock order ID |
| Admin Panel | `/admin` | Manage products & orders |

---

## Deployment Requirements
- App must be live on a public URL
- Frontend and backend should be separately deployable
- Environment variables used for DB credentials (no hardcoded secrets)
- README must include setup and run instructions

---

## Deliverables
- [ ] GitHub repository (public or shared access)
- [ ] Live deployment URL
- [ ] README with setup steps
- [ ] This requirements doc included in repo

---

## Seed Data
Provide at least **8–10 dummy products** with:
- Name, price, description, image URL (can use placeholder images from [picsum.photos](https://picsum.photos))
