# Task Manager

A full-stack task management application built with React, TypeScript, Node.js, Express, and MongoDB.

Task Manager allows users to organize projects and tasks, track progress, manage priorities and due dates, and monitor productivity through a dashboard. It also includes authentication, role-based access control, user profile management, and an admin dashboard for managing users.

## Features

### Authentication & Authorization

- User registration and login
- JWT-based authentication
- Access tokens and refresh tokens
- Refresh token stored in an HTTP-only cookie
- Protected routes
- Role-based authorization
- User and admin roles
- Active/inactive user status
- Secure password hashing with bcrypt

### Project Management

- Create projects
- View projects
- Edit projects
- Delete projects
- View project details
- Assign projects to users
- Track project status

### Task Management

- Create tasks
- Edit tasks
- Delete tasks
- View task details
- Assign tasks to users
- Organize tasks by project
- Task status tracking
- Priority levels
- Due dates
- Overdue task tracking

### Dashboard

The dashboard provides an overview of task and project activity, including:

- Total projects
- Total tasks
- To Do tasks
- In Progress tasks
- Completed tasks
- Overdue tasks
- High-priority tasks
- Tasks by status chart
- Task completion chart

### User Profile

Users can manage their account through the profile page:

- Update username
- Update email
- Update avatar
- View account role
- View account status
- Change password
- Password validation
- Current password verification

### Admin Dashboard

Administrators have additional capabilities:

- View all users
- View individual user details
- Update user information
- Change user status
- Manage user roles
- Delete users
- Monitor user accounts

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- Material UI
- MUI X Charts
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- cookie-parser
- CORS
- dotenv

---

## Project Structure

```text
Task-Manager-Api/
│
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── context/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── package.json
│   └── ...
│
├── .gitignore
└── readme.md