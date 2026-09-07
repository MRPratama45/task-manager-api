const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const {getAllTasks, createTask, getTaskById, updateTask, deleteTask} = require('../controllers/taskController')

const router = express.Router()

// semua route dibawah wajib login
router.use(authMiddleware)

// get
router.get('/', getAllTasks)

// get by id
router.get('/:id', getTaskById)

// post
router.post('/', createTask)

// put
router.put('/:id', updateTask)

// delete
router.delete('/:id', deleteTask)

module.exports = router