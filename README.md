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