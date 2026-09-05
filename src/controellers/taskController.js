const {db} = require('../config/database')

// get all tasks
const getAllTasks = async (req, res) => {
  try {
    // ambil userID dari middleware auth
    const userId = req.user.userId

    // ambil query parameters
    const {status, sort, order} = req.query

    // query dasar 
    let query = 'SELECT * FROM tasks WHERE user_id = ?'
    const params = [userId]

    // filter by status
    if(status){
      query += ' AND status = ?'
      params.push(status)
    }

    // sorting 
    if(sort && order){
      query += ` ORDER BY ${sort} ${order}`
    } else {
      query += ' ORDER BY created_at DESC'
    }

    const [tasks] = await db.query(query, params)

    res.json({
      status: 'success',
      total: tasks.length,
      data: tasks
    })
  }
  catch(error) {
    console.log('ambil task error: ', error.message)
    res.status(500).json({
      status: 'error',
      message: "terjadi kesalahan server"
    })
  }
}

// Buat Task Baru
const createTask = async (req, res) => {
  try{
    // ambil userId dari middleware auth
    const userId = req.user.userId

    // ambil input dari body
    const {title, description, status, due_date} = req.body

    // validasi semua input 
    if(!title || !description || !status || !title.trim() === '' ){
      return res.status(400).json({
        status: 'error',
        message: 'Title, description, status wajib di isikan'
      })
    }

    // validasi minimal karakter inputan
    if(title.length < 3 || description.length < 3){
      return res.status(400).json({
        status: 'error',
        message: 'Title dan description minimal 3 karakter'
      })
    }

    // validasi maximal karakter inputan
    if(title.length > 50 || description.length > 255){
      return res.status(400).json({
        status: 'error',
        message: 'Title maksimal 50 karakter dan description maksimal 255 karakter'
      })
    }

    // validasi status
    const validStatuses = ['pending', 'in_progress', 'completed']

    if(status && !validStatuses.includes(status)){
      return res.status(400).json({
        status: 'error',
        message: 'Status harus salah satu dari: pending, in_progress, atau completed'
      })
    }

    // simpan ke database
    const [result] = await db.query(
      `INSERT INTO tasks (user_id, title, description, status, due_date)
      VALUES (?, ?, ?, ?, ?)`,
      [
        userId, 
        title.trim(), 
        description || null, 
        status || 'pending', 
        due_date || null
      ]
    )

    // ambil task yg di buat
    const [newTask] = await db.query(
      'SELECT * FROM tasks WHERE id = ?',
      [result.insertId]
    )

    res.status(201).json({
      status: 'success',
      message: 'Task berhasil dibuat',
      data: newTask[0]
    })

  }
  catch(error){
    console.log('buat task error: ', error.message)
    res.status(500).json({
      status: 'error',
      message: "terjadi kesalahan server"
    })
  }
}

module.exports = {
  getAllTasks,
  createTask
}