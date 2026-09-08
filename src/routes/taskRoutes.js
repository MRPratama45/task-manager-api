// import express
const express = require('express')

// import middleware auth (proteksi route)
const authMiddleware = require('../middleware/authMiddleware')

// import controller
const {getAllTasks, createTask, getTaskById, updateTask, deleteTask} = require('../controllers/taskController')

// buat router
const router = express.Router()

// semua route dibawah wajib login
router.use(authMiddleware)

// get all tasks -> /api/tasks
router.get('/', getAllTasks)

// get by id -> /api/tasks/:id
router.get('/:id', getTaskById)

// post (buat task baru) -> /api/tasks
router.post('/', createTask)

// put (update task) -> /api/tasks/:id
router.put('/:id', updateTask)

// delete (hapus task) -> /api/tasks/:id
router.delete('/:id', deleteTask)

// export router
module.exports = router