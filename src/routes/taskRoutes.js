const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const {getAllTasks, createTask} = require('../controllers/taskController')

const router = express.Router()

// semua route dibawah wajib login
router.use(authMiddleware)

// get
router.get('/', getAllTasks)

// post
router.post('/', createTask)

module.exports = router