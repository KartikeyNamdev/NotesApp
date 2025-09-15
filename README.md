# Multi-Tenant SaaS Notes Application

This project is a full-stack, multi-tenant notes application built to allow different companies (tenants) to securely manage their users and notes. It features a Node.js/Express backend with a PostgreSQL database managed by Prisma, and a React/Vite frontend. The entire application is designed for deployment on Vercel.

---

## Features

- ✅ **Multi-Tenancy** with Strict Data Isolation
- 🔐 **JWT-based Authentication**
- 🛡️ **Role-Based Authorization** (Admin & Member)
- 💎 **Subscription Gating** (Free vs. Pro Plan)
- 📝 **Full CRUD API** for Notes
- 🚀 **Vercel Deployment** for Frontend & Backend
- 🩺 **Health Check** Endpoint

---

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT), Bcrypt

### Frontend

- **Framework**: React
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router

---

## Multi-Tenancy Approach

This application uses a **shared schema with a `tenantId` column** for multi-tenancy.

In this model, all data for all tenants resides in the same database and tables. Strict data isolation is enforced at the application level by including a mandatory `tenantId` on every resource (like `User` and `Note`).

Every single database query in the API is filtered by the `tenantId` of the currently authenticated user. This ensures that a user from one tenant (e.g., Acme) can never access, modify, or even know about the existence of data belonging to another tenant (e.g., Globex).

NOTE : TO ACCESS THE UPGRADE PLAN API, YOU HAVE TO DIRECTLY HIT THE API, IT IS NOT INCLUDED IN FRONTEND

---

## API Endpoints

| Method   | Path                     | Auth       | Description                                                              |
| :------- | :----------------------- | :--------- | :----------------------------------------------------------------------- |
| `GET`    | `/health`                | Public     | Checks the health status of the API.                                     |
| `POST`   | `/auth/login`            | Public     | Authenticates a user and returns a JWT.                                  |
| `POST`   | `/auth/signup`           | Public     | Creates a new user within a specified tenant.                            |
| `GET`    | `/auth/me`               | Protected  | Retrieves details of the currently logged-in user and tenant.            |
| `GET`    | `/notes`                 | Protected  | Lists all notes for the user's tenant.                                   |
| `POST`   | `/notes`                 | Protected  | Creates a new note (enforces subscription limits).                       |
| `GET`    | `/notes/:id`             | Protected  | Retrieves a single note by ID from the user's tenant.                    |
| `PUT`    | `/notes/:id`             | Protected  | Updates a note by ID.                                                    |
| `DELETE` | `/notes/:id`             | Protected  | Deletes a note by ID.                                                    |
| `POST`   | `/tenants/:slug/upgrade` | Admin Only | Upgrades the admin's tenant to the "Pro" plan (Not included in Frontend) |

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm / yarn
- A PostgreSQL database

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file from the example
# e.g., cp .env.example .env

# Add your DATABASE_URL and a JWT_SECRET to the .env file

# Apply database migrations
npx prisma migrate dev

# Seed the database with mandatory test accounts
npx prisma db seed

# Start the development server
npm run dev
```

The backend server will be running on http://localhost:3000.

### 2. Frontend Setup

```bash

# Navigate to the frontend directory
cd fe/notesapp

# Install dependencies
npm install

# Create a .env file in the root of the frontend project
# Add the following line:
# VITE_API_BASE_URL=http://localhost:4000

# Start the development server
npm run dev
```

The frontend will be running on http://localhost:5173.

---

### Mandatory Test Accounts

The database is seeded with the following accounts. The password for all accounts is password.

Email Role Tenant Plan

- admin@acme.test Admin Acme Free
- user@acme.test Member Acme Free
- admin@globex.test Admin Globex Pro
- user@globex.test Member Globex Pro

---

### Deployment

The frontend and backend are hosted on Vercel.

Live Frontend: [https://notes-app-fe.vercel.app/]

Live Backend: [https://notes-app-be-sigma.vercel.app/]

---

### Environment Variables

Backend (.env)

```
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret_key"
```

Frontend (.env)

```
VITE_API_BASE_URL="your_backend_api_url"
```

---

## Project Structure

```
multi-tenant-saas-notes/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   └── .env
├── fe/
│   └── notesapp/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   └── utils/
│       ├── package.json
│       └── .env
└── README.md
```
