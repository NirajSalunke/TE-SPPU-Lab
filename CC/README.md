# LP-II CC Assignments — Practice Repository

This repository contains dummy/sample applications for practising all **Cloud Computing (CC)** assignments from the LP-II 2025-26 Mock-II and PR Exam problem statements.

***

## 📁 Folder Structure

```
lp2-cc-practice/
│
├── 07-static-website/
├── 08-secure-file-sharing/
├── 09-blog-app/
├── 10-student-record-management/
├── 11-ecommerce-mern/
├── 12-static-website-domain/
├── 13-task-management-mern/
├── 14-todo-list-mern/
├── 15-event-registration-mern/
├── 16-salesforce-student-records/
├── 17-salesforce-employee-management/
├── 18-salesforce-bank-account/
├── 19-salesforce-product-inventory/
├── 20-salesforce-employee-lwc/
├── 21-salesforce-email-console/
├── 22-salesforce-email-visualforce/
└── 23-salesforce-college-management/
```

***

## 📂 Subproject Descriptions

### `07-static-website/`
**Sr. No. 7 — Deploy a Static Website on Cloud VM**

A simple static HTML/CSS/JS website.

- Deploy on a cloud VM (GCP Compute Engine / AWS EC2 / Oracle Cloud)
- Configure Apache or Nginx as the web server
- Open firewall/security group for port 80/443
- Ensure the site is publicly accessible via the VM's public IP
- Enable SSH access for remote updates

**Suggested stack:** HTML + CSS + JS, Apache/Nginx, GCP/AWS/Oracle VM

***

### `08-secure-file-sharing/`
**Sr. No. 8 — Secure File Sharing Between Cloud Instances**

Two cloud VMs communicating over a private Virtual Private Cloud (VPC) network.

- Create two VM instances in the same VPC
- Configure SSH key-based authentication between instances
- Use `scp` or `rsync` to transfer files securely
- Set proper IAM roles and firewall rules for access control

**Suggested stack:** GCP Compute Engine / AWS EC2, VPC networking, SSH/SCP

***

### `09-blog-app/`
**Sr. No. 9 — Online Blog Application Deployment**

Full-stack blog application with frontend, backend, and database.

- Users can create, view, and manage blog posts via a web interface
- Deploy frontend (React/Next.js) and backend (Node.js/Express) on a cloud VM
- Connect to a cloud-hosted database (MongoDB Atlas / MySQL on Cloud SQL)
- Configure reverse proxy (Nginx) and environment variables

**Suggested stack:** MERN (MongoDB, Express, React, Node.js) or any full-stack framework

> **Note:** You may use a GitHub repository or dummy application.

***

### `10-student-record-management/`
**Sr. No. 10 — Cloud-Based Student Record Management System**

Web application for managing student records via a backend API and cloud-hosted database.

- CRUD operations: Add, Update, Retrieve student data
- Deploy frontend (React) and backend (Node.js/Express or Spring Boot)
- Use a relational database (MySQL / PostgreSQL) hosted on the cloud
- Expose a RESTful API for frontend-backend communication

**Suggested stack:** React + Node.js/Express + MySQL/PostgreSQL on GCP Cloud SQL or AWS RDS

> **Note:** You may use a GitHub repository or dummy application.

***

### `11-ecommerce-mern/`
**Sr. No. 11 — Deployment of an E-Commerce Web Application (Full Stack MERN)**

Sample e-commerce application on a cloud VM.

- Users can browse products and simulate basic purchase functionality
- Deploy MERN stack on cloud VM with PM2 for process management
- Configure backend services, MongoDB connection, and environment secrets
- Set up Nginx reverse proxy and open required ports

**Suggested stack:** MongoDB, Express, React, Node.js (MERN), Nginx, PM2

> **Note:** You may use a GitHub repository or dummy application.

***

### `12-static-website-domain/`
**Sr. No. 12 — Static Website with Domain and Public Access**

Static website accessible via the server's public IP or a domain name.

- Deploy static files on a cloud server (Nginx or Apache)
- Configure DNS to point a domain/subdomain to the VM's public IP (optional)
- Ensure the site loads at `http://<public-ip>` or the configured domain

**Suggested stack:** HTML/CSS/JS, Nginx/Apache, GCP/AWS/Oracle VM

***

### `13-task-management-mern/`
**Sr. No. 13 — MERN-Based Task Management Application**

MERN task management system with create, update, and delete functionality.

- Frontend React app communicates with Node.js/Express backend API
- MongoDB used for task storage, hosted on cloud or MongoDB Atlas
- Deploy on cloud VM, configure ports and environment variables

**Suggested stack:** MongoDB, Express, React, Node.js (MERN), Nginx

***

### `14-todo-list-mern/`
**Sr. No. 14 — Cloud-Based To-Do List Manager (Full Stack MERN)**

Task management application storing data in a cloud-hosted backend database.

- Users can create, update, and delete tasks
- Full MERN stack deployment on a cloud virtual machine
- Database hosted in the cloud (MongoDB Atlas or on-VM MongoDB)

**Suggested stack:** MongoDB, Express, React, Node.js (MERN)

***

### `15-event-registration-mern/`
**Sr. No. 15 — Online Event Registration System (Full Stack MERN)**

Web application where users register for events by submitting their details.

- Registration form (name, email, event choice, etc.)
- Backend API stores submissions in a cloud-hosted database
- Deploy full MERN stack on cloud VM

**Suggested stack:** MongoDB, Express, React, Node.js (MERN)

> **Note:** You may use a GitHub repository or dummy application.

***

### `16-salesforce-student-records/`
**Sr. No. 16 — Student Record Management System (Salesforce)**

Salesforce application using Apex and Visualforce to manage student records.

- Custom Object with fields: Name, Roll No, Class, Mobile No
- Apex controller for CRUD logic
- Visualforce page for the UI

**Platform:** Salesforce Developer Org

***

### `17-salesforce-employee-management/`
**Sr. No. 17 — Employee Management System (Salesforce Console)**

Menu-driven Apex program managing employee records via the Salesforce console.

- Fields: Emp ID, Emp Name, Email, Birth Date, Department
- Console-based Apex menu for Add / View / Update / Delete operations

**Platform:** Salesforce Developer Org (Anonymous Apex / Developer Console)

***

### `18-salesforce-bank-account/`
**Sr. No. 18 — Bank Account System (Salesforce Console)**

Menu-driven Apex program managing bank customer records via the Salesforce console.

- Fields: Customer ID, Name, Email, Birth Date, Department
- Console-based Apex menu for account management operations

**Platform:** Salesforce Developer Org (Anonymous Apex / Developer Console)

***

### `19-salesforce-product-inventory/`
**Sr. No. 19 — Product Inventory Management System (Salesforce)**

Salesforce Apex + Visualforce application for managing product inventory records.

- Custom Object with fields: Product Name, Serial No, Manufacture Date, Expiry Date
- Apex controller for business logic
- Visualforce page for inventory UI

**Platform:** Salesforce Developer Org

***

### `20-salesforce-employee-lwc/`
**Sr. No. 20 — Employee Management Lightning Web Component (Salesforce)**

LWC that allows users to add employee records with client-side and server-side validation.

Validation rules enforced:
- Employee Name: non-empty, minimum 3 characters
- Employee ID: greater than 0, unique
- Salary: between 10,000 and 500,000
- Email: valid format
- Department: selected from available list
- Joining Date: cannot be a future date

**Platform:** Salesforce Developer Org (Lightning Web Components)

***

### `21-salesforce-email-console/`
**Sr. No. 21 — Apex Email Notification (Console-Based)**

Console-based Apex program that sends email notifications using Salesforce's built-in messaging class.

- Define recipient email, subject, and message body in Apex
- Use `Messaging.SingleEmailMessage` to send email
- Optional: include file attachment

**Platform:** Salesforce Developer Org (Anonymous Apex / Developer Console)

***

### `22-salesforce-email-visualforce/`
**Sr. No. 22 — Apex Email Notification with Visualforce Frontend**

Apex program that sends email with a Visualforce page UI.

- Visualforce form for recipient email, subject, and message body input
- Apex controller sends email via `Messaging.SingleEmailMessage`
- Display appropriate error message for invalid email addresses
- Optional: file attachment support

**Platform:** Salesforce Developer Org (Apex + Visualforce)

***

### `23-salesforce-college-management/`
**Sr. No. 23 — College Management Lightning Application (Salesforce)**

Lightning Application managing both student and faculty records with validation rules.

**Student Validations:**
- Marks between 0 and 100
- Roll Number greater than 0
- Email must contain `@` symbol
- Student name cannot be blank

**Faculty Validations:**
- Faculty Name: non-empty, minimum 3 characters
- Faculty ID: greater than 0, unique
- Salary: between 10,000 and 500,000
- Department must be selected from the available list
- Joining Date cannot be a future date

**Platform:** Salesforce Developer Org (Lightning App Builder / LWC / Validation Rules)

***

## 🚀 General Deployment Notes

### For Cloud VM Assignments (Sr. No. 7–15)
- Recommended platforms: **GCP Compute Engine**, **AWS EC2**, or **Oracle Cloud Free Tier**
- Use **Ubuntu 22.04 LTS** as the base OS
- Install required runtimes: Node.js, npm, MongoDB, MySQL/PostgreSQL as needed
- Use **Nginx** as a reverse proxy for MERN apps
- Use **PM2** (`pm2 start`) to keep Node.js servers running
- Open required firewall ports (80, 443, 3000, 5000, 27017 etc.) in the cloud console

### For Salesforce Assignments (Sr. No. 16–23)
- Use a free **Salesforce Developer Org** at [developer.salesforce.com](https://developer.salesforce.com)
- Write and execute Apex code via **Developer Console** or **VS Code + Salesforce Extension Pack**
- Deploy LWC and Visualforce pages using **Salesforce CLI** (`sf deploy`)

***

## 📌 Quick Reference Table

| Sr. No. | Folder | Type | Technology |
|---------|--------|------|------------|
| 7 | `07-static-website/` | Cloud VM | HTML/CSS/JS + Apache/Nginx |
| 8 | `08-secure-file-sharing/` | Cloud VM | VPC + SSH/SCP |
| 9 | `09-blog-app/` | Cloud VM | MERN / Full Stack |
| 10 | `10-student-record-management/` | Cloud VM | MERN / Spring Boot + SQL |
| 11 | `11-ecommerce-mern/` | Cloud VM | MERN |
| 12 | `12-static-website-domain/` | Cloud VM | HTML/CSS/JS + Nginx |
| 13 | `13-task-management-mern/` | Cloud VM | MERN |
| 14 | `14-todo-list-mern/` | Cloud VM | MERN |
| 15 | `15-event-registration-mern/` | Cloud VM | MERN |
| 16 | `16-salesforce-student-records/` | Salesforce | Apex + Visualforce |
| 17 | `17-salesforce-employee-management/` | Salesforce | Apex Console |
| 18 | `18-salesforce-bank-account/` | Salesforce | Apex Console |
| 19 | `19-salesforce-product-inventory/` | Salesforce | Apex + Visualforce |
| 20 | `20-salesforce-employee-lwc/` | Salesforce | LWC + Apex |
| 21 | `21-salesforce-email-console/` | Salesforce | Apex Console |
| 22 | `22-salesforce-email-visualforce/` | Salesforce | Apex + Visualforce |
| 23 | `23-salesforce-college-management/` | Salesforce | Lightning App + LWC |
