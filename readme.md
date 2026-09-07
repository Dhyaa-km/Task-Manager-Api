# Task Manager
 
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=flat&logo=mui&logoColor=white)
 
A full-stack task management application built with React, TypeScript, Node.js, Express, and MongoDB.
 
Task Manager lets users organize work into projects and tasks, track status and priority, monitor progress through a dashboard, and manage their account. It also includes JWT-based authentication, role-based authorization, and an admin dashboard for managing users.
 
🔗 **Live Demo:** [Add deployment URL]
 
## Table of Contents
 
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Authentication & Authorization](#authentication--authorization)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Security](#security)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)
## Features
 
### Authentication & Security
 
- User registration and login
- JWT access tokens and refresh tokens
- Refresh token stored in an HTTP-only cookie
- Protected routes on both frontend and backend
- Role-based authorization (`user` / `admin`)
- Active / inactive account status
- Password hashing with bcrypt
- Password strength validation and current-password verification on change
### Project Management
 
- Create, view, edit, and delete projects
- View project details
- Track project status (`active` / `inactive`)
### Task Management
 
- Create, view, edit, and delete tasks within a project
- View task details
- Track task status (`todo` / `in-progress` / `done`)
- Set task priority (`low` / `medium` / `high`)
- Set and track due dates, including overdue tasks
- Search, filter by status, sort, and paginate tasks within a project
### Dashboard
 
- Total projects and total tasks
- To-do, in-progress, completed, overdue, and high-priority task counts
- Tasks-by-status bar chart and task-completion pie chart (MUI X Charts)
### User Profile
 
- View profile details (username, email, role, status, avatar)
- Update username, email, and avatar
- Change password (requires current password)
### Admin Dashboard
 
- Global stats: total/active/inactive users, total projects, and task breakdowns
- View a paginated list of all users, filterable by status
- View individual user details
- Update a user's role or status
- Delete a user (cascades to their projects and tasks)
- Safeguards against self-lockout and removing the last remaining admin
## Tech Stack
 
### Frontend
 
| Technology | Purpose |
|---|---|
| React + TypeScript | UI and component structure |
| Vite | Dev server and build tooling |
| React Router | Client-side routing and route protection |
| Axios | HTTP client for the REST API |
| Tailwind CSS | Utility-first styling |
| Material UI (MUI) | UI components |
| MUI X Charts | Dashboard bar/pie charts |
| Lucide React | Icons |
 
### Backend
 
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and schema modeling |
| jsonwebtoken (JWT) | Access and refresh token authentication |
| bcrypt | Password hashing |
| cookie-parser | Reading the refresh-token cookie |
| CORS | Cross-origin requests from the frontend |
| dotenv | Environment variable loading |
 
### Database
 
MongoDB, accessed through Mongoose models for `User`, `Project`, and `Task`.
 
### Authentication
 
Custom JWT-based authentication (no third-party auth provider) — see [Authentication & Authorization](#authentication--authorization) below.
 
## Architecture
 
```
React + TypeScript (Vite)
          |
          |  Axios — REST / JSON
          v
     Express.js API
          |
          |  Mongoose ODM
          v
        MongoDB
```
 
- **Client** — a React SPA that handles routing (React Router), auth state (`AuthContext`), and talks to the API through per-resource Axios service modules (`authService`, `userService`, `projectService`, `taskService`, `adminUserService`, `adminDashboardService`, `dashboardService`).
- **Server** — an Express REST API organized into `routes → controllers → models`, with middleware for JWT verification, role checks, and MongoDB ObjectId validation.
- **Database** — MongoDB, with data shaped by the Mongoose schemas described in [Database Models](#database-models).
## Project Structure
 
```
Task-Manager-Api/
├── client/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── components/        # ProtectedRoute, AdminProtectedRoute
│   │   ├── context/           # AuthContext (auth state & tokens)
│   │   ├── layouts/           # MainLayout
│   │   ├── pages/             # Login, Register, Dashboard, Projects,
│   │   │                      # Tasks, Profile, Admin views, ...
│   │   ├── services/          # Axios calls, grouped by resource
│   │   ├── types/             # Shared TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── server/                    # Express + MongoDB backend
│   ├── src/
│   │   ├── config/            # MongoDB connection (dbConn.js)
│   │   ├── controllers/       # auth, user, project, task, dashboards
│   │   ├── middleware/        # verifyJWT, verifyRoles, validateObjectId
│   │   ├── models/            # Mongoose schemas: User, Project, Task
│   │   ├── routes/api/        # auth, users, projects, tasks, admin
│   │   └── server.js
│   └── package.json
│
├── .gitignore
└── readme.md
```
 
## Authentication & Authorization
 
```
User
 |
 | POST /api/auth/login (username or email + password)
 v
Express API  --  bcrypt.compare()  -->  MongoDB (User)
 |
 | credentials valid → issue tokens
 v
Access Token (JWT)              Refresh Token (JWT)
 → returned in response body     → set as an httpOnly cookie ("jwt")
 → sent as "Authorization:       → sent automatically by the
    Bearer <token>"                 browser on future requests
```
 
- Registration (`POST /api/auth/register`) creates a user with a bcrypt-hashed password.
- Login (`POST /api/auth/login`) accepts a username **or** email plus a password, and on success returns an access token and sets the refresh token as an `httpOnly` cookie.
- Access tokens are short-lived (1 hour when first issued at login, 15 minutes when reissued) and carry the user's id, username, and role.
- `GET /api/auth/refresh` reads the refresh-token cookie and issues a new access token, letting the frontend silently restore a session on page load.
- `GET /api/auth/logout` invalidates the stored refresh token and clears the cookie.
- Route middleware enforces access: `verifyJWT` requires a valid access token; `verifyRoles("admin")` additionally requires the `admin` role.
- On the frontend, `ProtectedRoute` and `AdminProtectedRoute` gate access to authenticated and admin-only pages respectively.
- Two roles (`user`, `admin`) and two account statuses (`active`, `inactive`) are supported.
## API Endpoints
 
### Authentication (`/api/auth`)
 
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in and receive an access token + refresh cookie |
| GET | `/api/auth/refresh` | Public | Exchange the refresh cookie for a new access token |
| GET | `/api/auth/logout` | Private | Log out and invalidate the refresh token |
 
### Users (`/api/users`)
 
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users/me` | Private | Get the current user's profile |
| GET | `/api/users/dashboard` | Private | Get the current user's dashboard stats |
| PATCH | `/api/users/me` | Private | Update username, email, or avatar |
| PATCH | `/api/users/password` | Private | Change password (requires current password) |
| GET | `/api/users` | Admin | List all users (paginated, filterable by status) |
| GET | `/api/users/:userId` | Admin | Get a specific user's details |
| PATCH | `/api/users/:userId` | Admin | Update a user's role or status |
| DELETE | `/api/users/:userId` | Admin | Delete a user and their projects/tasks |
 
### Projects (`/api/projects`)
 
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/projects` | Private | Create a project |
| GET | `/api/projects` | Private | List the current user's projects (paginated) |
| GET | `/api/projects/:id` | Private | Get a specific project |
| PATCH | `/api/projects/:id` | Private | Update a project |
| DELETE | `/api/projects/:id` | Private | Delete a project |
 
### Tasks (`/api`)
 
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/projects/:projectId/tasks` | Private | Create a task under a project |
| GET | `/api/projects/:projectId/tasks` | Private | List a project's tasks (search, status filter, sort, pagination) |
| GET | `/api/tasks/:taskId` | Private | Get a specific task |
| PATCH | `/api/tasks/:taskId` | Private | Update a task |
| DELETE | `/api/tasks/:taskId` | Private | Delete a task |
 
### Admin (`/api/admin`)
 
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/dashboard` | Admin | Get platform-wide stats (users, projects, tasks) |
 
## Database Models
 
### User
 
| Field | Type | Notes |
|---|---|---|
| `username` | String | Required, unique |
| `email` | String | Required, unique, lowercased |
| `password` | String | Required, bcrypt-hashed, min. 8 characters |
| `role` | String | `user` \| `admin` (default `user`) |
| `status` | String | `active` \| `inactive` (default `active`) |
| `refreshToken` | String | Current refresh token, if logged in |
| `avatar` | String | Avatar URL |
 
### Project
 
| Field | Type | Notes |
|---|---|---|
| `title` | String | Required |
| `description` | String | Required |
| `status` | String | `active` \| `inactive` (default `active`) |
| `owner` | ObjectId → `User` | Required |
 
### Task
 
| Field | Type | Notes |
|---|---|---|
| `title` | String | Required |
| `description` | String | Required |
| `status` | String | `todo` \| `in-progress` \| `done` (default `todo`) |
| `priority` | String | `low` \| `medium` \| `high` (default `medium`) |
| `dueDate` | Date | Required |
| `user` | ObjectId → `User` | Required |
| `project` | ObjectId → `Project` | Required |
 
All three models use Mongoose `timestamps` (`createdAt`, `updatedAt`).
 
**Relationships:** a `User` owns many `Project`s; a `Project` has many `Task`s; a `Task` also references the `User` who created it.
 
## Getting Started
 
### Prerequisites
 
- Node.js and npm
- A MongoDB instance (local or MongoDB Atlas)
### Clone the Repository
 
```bash
git clone https://github.com/Dhyaa-km/Task-Manager-Api.git
cd Task-Manager-Api
```
 
### Backend Setup
 
```bash
cd server
npm install
```
 
Create a `.env` file inside `server/` (see [Environment Variables](#environment-variables)), then start the API:
 
```bash
npm run dev
```
 
### Frontend Setup
 
```bash
cd client
npm install
npm run dev
```
 
> **Note:** the frontend's Axios base URL and the backend's CORS origin are currently hardcoded to `http://localhost:3000/api` and `http://localhost:5173` respectively, so the app is set up to run both services locally out of the box.
 
## Environment Variables
 
Create a `.env` file in `server/` with the following variables:
 
| Variable | Description |
|---|---|
| `PORT` | Port for the Express server (defaults to `3000` if not set) |
| `MONGO_URI` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | Secret used to sign JWT access tokens |
| `REFRESH_TOKEN_SECRET` | Secret used to sign JWT refresh tokens |
| `NODE_ENV` | `development` or `production` — affects refresh-cookie security settings |
 
## Running the Project
 
| Command | Location | Description |
|---|---|---|
| `npm run dev` | `server/` | Start the API with nodemon (auto-restart) |
| `npm start` | `server/` | Start the API with plain Node |
| `npm run dev` | `client/` | Start the Vite dev server |
| `npm run build` | `client/` | Type-check and build the frontend for production |
| `npm run preview` | `client/` | Preview the production build locally |
 
## Security
 
- Passwords are hashed with bcrypt and are never returned by the API.
- Authentication uses short-lived JWT access tokens plus a separate refresh token kept in an `httpOnly` cookie, so it isn't accessible to client-side JavaScript.
- Private and admin routes are protected by dedicated middleware (`verifyJWT`, `verifyRoles`).
- Ownership checks ensure users can only read or modify their own projects and tasks.
- Admin safeguards prevent an admin from deactivating, demoting, or deleting their own account, and prevent removing the last remaining admin.
- Server-side validation covers required fields, field lengths, allowed status/priority/role values, future-only due dates, email format, and password strength.
### Reporting a Vulnerability
 
If you discover a security vulnerability, please open an issue describing the problem.
 
## Screenshots
 
_Add screenshots or a short demo GIF here showcasing the dashboard, projects, tasks, and admin views._
 
## Future Improvements
 
- Add automated tests (unit and integration) for both frontend and backend
- Add a Swagger / OpenAPI specification for the API
- Move the frontend API base URL and backend CORS origin into environment variables for multi-environment deployments
- Add refresh-token rotation and an Axios interceptor to auto-refresh on token expiry
- Add search and filtering to the projects list (currently available on tasks only)
- Support direct avatar file uploads instead of an avatar URL
- Deploy the app and link a live demo
## Contributing
 
Contributions, issues, and feature requests are welcome.
 
```bash
# Fork the repo, then:
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
# Open a pull request
```
 
## Author
 
**Dhyaa**
GitHub: [@Dhyaa-km](https://github.com/Dhyaa-km)
 
## License
 
This project does not currently include a license file. [Add a license, e.g. MIT, if you plan to open-source this project.]