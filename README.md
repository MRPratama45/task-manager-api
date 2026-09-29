# Task Manager API

## Live Demo
- **Production URL:** https://task-manager-api-production-be.up.railway.app

## Tech Stack
- Node.js
- Express.js
- MySQL
- JWT Authentication

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Tasks (Protected)
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by id
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task


# Task Manager API

Backend API untuk Task Management System - Full Stack Portfolio Project 1

## 🚀 Live Demo

- **API Production:** https://task-manager-api-production-be.up.railway.app
- **Frontend:** https://task-manager-client-xxxx.vercel.app

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Token)
- **Password Hashing:** bcryptjs
- **Deploy:** Railway

## ✨ Fitur

- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Protected Routes (Middleware)
- ✅ CRUD Tasks
- ✅ Input Validation
- ✅ Error Handling
- ✅ Auto-create Tables (initDatabase)

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Register user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |

### Tasks

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/tasks` | Ambil semua task user | ✅ |
| GET | `/api/tasks/:id` | Ambil task by id | ✅ |
| POST | `/api/tasks` | Buat task baru | ✅ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| DELETE | `/api/tasks/:id` | Hapus task | ✅ |

### Contoh Request

**Register:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "rahasia123"
}