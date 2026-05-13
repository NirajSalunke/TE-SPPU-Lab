![swoc2024 Banner](./swoc.jpg)
![iwoc2025 Banner](./iwoc.png)

# React Blog - Social Winter of Code 2025 & Innogeeks WInter of Code 3.0 2025🌟

Welcome to **React Blog**, an exciting application selected for **Social Winter of Code 2025** (SWOC-2025) alongside with **Innogeeks Winter of Code 3.0 2025**!

This project is an open-source initiative aimed at building a robust and feature-rich blogging platform. We welcome contributors from all backgrounds to collaborate and make this project a success. If you like what you see, please consider giving this repository a **star**! 💥

---

## Features 🔄
- User authentication and authorization
- Create, edit, and delete blog posts
- Search and filter blogs
- Real-time updates with modern React and MongoDB integration

---

## Tools Used 🛠️
| Tool           | 
|----------------|
| TailwindCSS    | 
| ExpressJS      | 
| ReactJS        | 
| MongoDB        | 
| NodeJS         | 
| Vite           | 

---

## Getting Started ⚡
Follow these steps to set up the project locally:

### Prerequisites ⚙
Ensure you have the following installed:
- **Node.js** (version 14.0 or higher recommended)
- **MongoDB** (for the database)

### Installation Steps 🔍
1. Clone the repository:
   ```bash
   git clone https://github.com/OkenHaha/react-blog.git
   ```

2. Navigate into the project directory:
   ```bash
   cd react-blog
   ```

3. Install dependencies for both frontend and backend:
   ```bash
   cd front-end
   npm install
   
   cd ../back-end
   npm install
   ```

4. Set up the `.env` file:
   - Navigate to the `back-end` directory.
   - Create a `.env` file.
   - Add the following environment variables to the `.env` file:
     ```env
     CONNECTION_URL="your-mongodb-connection-url"
     PORT=8080
     JWT_SECRET="your-jwt-secret"
     SECRET_KEY="your-secret-key"
     MAIL_HOST="smtp.gmail.com"
     MAIL_USER="your-email@example.com"
     MAIL_PASS="your-email-passkey"
     ```

   - Example for local testing:
     ```env
     CONNECTION_URL="mongodb://localhost:27017"
     PORT=8080
     JWT_SECRET="test-secret"
     SECRET_KEY="test-secret-key"
     MAIL_HOST="smtp.gmail.com"
     MAIL_USER="test@example.com"
     MAIL_PASS="test-passkey"
     ```

5. Change the baselink for the server
   - Navigate to the **components** directory inside **src** under the front-end folder
   - edit the `baselink.js` file
   - change the backend link to `http://localhost:8080`

6. Start the development server and also for the frontend:
   ```bash
   cd back-end
   npm run dev
   ```

   ```bash
   cd front-end
   npm run dev
   ```

7. Open the application in your browser:
   - Frontend: `http://127.0.0.1:5173/`
   - Backend: `http://localhost:8080`

---

## Contribution Guidelines 🔧
We’re thrilled to have you contribute to this project! Please follow these steps to get started:

1. Star the repo
2. Fork the repository and clone it locally.
3. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b your-branch-name
   ```
4. Make your changes and commit them with clear and concise commit messages.
5. Push your changes to your forked repository:
   ```bash
   git push origin your-branch-name
   ```
6. Make sure the Fork isn't behind any latest commit. (This is to make sure it doesn't have merge conflict and remove new commits being made)
7. Create a pull request (PR) from your branch to the `main` branch of this repository.
8. Wait for review and feedback.

### Pro Tips 💡
- Follow the code style and standards outlined in the repository.
- Check the `CONTRIBUTING.md` file for detailed contribution rules.
- Join discussions on issues and share your ideas!

### Labels
Currently there are few labels being used for SWOC2025 and new commers to this repo needs help in explaining the labels and how they are assigned:-
- `level 1` This label is assigned for issues that mostly handle with frontend and API calls
- `level 2` This label is assigned for issues that requires CRUD operations to be made (e.g. adding new database schema, adding GET, POST, DELETE, etc. request to the database)
- `level 3` This label is assigned for issues that requires system design, understanding the code architecture, etc. This is for high level issue that understands the whole code structure of the project.
- `SWOC` This label is used to track for SWOC2025 contributions being made
- `IWOC2025`This label is used to track for IWOC contributiosn being made
- `Easy` This label is used for easy issues and PR for IWOC2025
- `Medium` This label is used for intermediate issues and PR for IWOC2025
- `Hard` This label is used for advance issues and PR for IWOC2025
- `bug` `enhancement` `documentation` `good first issue` `duplicate` `help wanted` `wontfix` `invalid` are common labels issued by GitHub which will be used according to their label names

My label system might look hard but this is to make sure that my contributors to this project learn and get skilled enough that they will get a well paid job for their careers. I hope this encourages you to learn more, contribute meaningful contribution for yourself and not feel discouraged by others. I'm looking forward to what amazing and exiciting contribution you can make. Cheers!

<h3>Project Contributers❤️: <h3>
<a href="https://github.com/OkenHaha/react-blog/graphs/contributors">
<img src="https://contributors-img.web.app/image?repo=OkenHaha/react-blog"/>

## Repo Stared By:


[![Stargazers repo roster for @OkenHaha/react-blog](https://reporoster.com/stars/dark/OkenHaha/react-blog)](https://github.com/OkenHaha/react-blog/stargazers)


## Repo Forked By:


[![Forkers repo roster for @OkenHaha/react-blog](https://reporoster.com/forks/dark/OkenHaha/react-blog)](https://github.com/OkenHaha/react-blog/network/members)
