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
      query += ' AND status = ?' // artinya query = query + ' AND status = ?'
      params.push(status)
    }

    // sorting 
    if(sort && order){ // cek apakah client mengirimkan params sort dan order
      query += ` ORDER BY ${sort} ${order}`
    } else {
      query += ' ORDER BY created_at DESC'
    }

    const [tasks] = await db.query(query, params) // menjalankan query ke database dengan menunggu hasil. [tasks] = hasil query untuk mengambil array hasil

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

// get task by id
const getTaskById = async (req, res) => {
  try{
    const userId= req.user.userId
    const {id} = req.params

    // Query task dengan id DAN userId. Ini memastikan user hanya bisa akses task miliknya
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    )

    if(tasks.length === 0){
      return res.status(404).json({
        status: 'error',
        message: 'Task tidak ditemukan'
      })
    }

    res.json({
      status: 'success',
      data: tasks[0]
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

    // validasi title (wajib isi)
    if(!title || title.trim() === ''){
      return res.status(400).json({
        status: 'error',
        message: 'Title wajib di isikan'
      })
    }

    // validasi minimal karakter inputan title
    if(title.length < 3){
      return res.status(400).json({
        status: 'error',
        message: 'Title minimal 3 karakter'
      })
    }

    // validasi maximal karakter inputan
    if(title.length > 50){
      return res.status(400).json({
        status: 'error',
        message: 'Title maksimal 50 karakter'
      })
    }

    // validasi description (hanya jika di kirim)
    if(description !== undefined && description !== null){
      if(description.length < 3){
        return res.status(400).json({
          status: 'error',
          message: 'Description minimal 3 karakter'
        })
      }
      
      if(description.length > 255){
        return res.status(400).json({
          status: 'error',
          message: 'Description maksimal 255 karakter'
        })
      }
    }

    // validasi status (hanya jika di kirim)
    const validStatuses = ['pending', 'in_progress', 'completed']

    if(status && !validStatuses.includes(status)){
      return res.status(400).json({
        status: 'error',
        message: 'Status harus salah satu dari: pending, in_progress, atau completed'
      })
    }

    // simpan ke database, Insert task baru. result.insertId berisi ID task baru.
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

    // ambil task yg baru di buat
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

// update tasks
const updateTask = async (req, res) => {
  try{
    const userId = req.user.userId
    const {id} = req.params
    const {title, description, status, due_date} = req.body

    // cek task ada dan dimiliki user? Cek apakah task ada & milik user sebelum update.
    const [existingTask] = await db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    )

    if(existingTask.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Task tidak ditemukan'
      })
    }

    // validasi title jika terkirim
    if(title !== undefined) {
      if(title.trim() === '') {
        return res.status(400).json({
          status: 'error',
          message: 'Title tidak boleh kosong'
        })
      }

      if(title.length < 3) {
        return res.status(400).json({
          status: 'error',
          message: 'Title minimal 3 karakter'
        })
      }

      if(title.length > 50) {
        return res.status(400).json({
          status: 'error',
          message: 'Title maksimal 50 karakter'
        })
      }
    }

    // validasi description jika dikirim (bukan undefined atau null)
      if(description !== undefined && description !== null){
        if(description.length < 3){
          return res.status(400).json({
            status: 'error',
            message: 'Description minimal 3 karakter'
          })
        }
        
        if(description.length > 255){
          return res.status(400).json({
            status: 'error',
            message: 'Description maksimal 255 karakter'
          })
        }
      }

    // validasi status jika dikirim
    const validStatuses = ['pending', 'in_progress', 'completed']
    if(status !== undefined && !validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Status harus salah satu dari: pending, in_progress, atau completed'
      })
    }

    // update task ke database, Update task. Jika field tidak dikirim, pakai nilai lama dari existingTask[0]
    await db.query(
      `UPDATE tasks
      SET title = ?, description = ?, status = ?, due_date = ?
      WHERE id = ? AND user_id = ?`,
      [
        title !== undefined ? title : existingTask[0].title ,
        description !== undefined ? description : existingTask[0].description,
        status !== undefined ? status : existingTask[0].status,
        due_date !== undefined ? due_date : existingTask[0].due_date,
        id,
        userId
      ]
    )

    // ambil task yg sudah di update
    const [updatedTask] = await db.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    )

    res.status(200).json({
      status: 'success',
      message: 'Task berhasil di update',
      data: updatedTask[0]
    })

  }
  catch(error) {
    console.log('update task error: ', error.message)
    res.status(500).json({
      status: 'error',
      message: "terjadi kesalahan server"
    })
  }
}

// delete tasks
const deleteTask = async (req, res) => {
  try{
    const userId = req.user.userId
    const {id} = req.params

    // cek task ada dan dimiliki user?
    const [existingTask] = await db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    )

    if(existingTask.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Task tidak ditemukan'
      })
    }

    // hapus task
    await db.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    )

    res.status(200).json({
      status: 'success',
      message: 'Task berhasil di hapus'
    })
  }
  catch(error) {
    console.log('delete task error: ', error.message)
    res.status(500).json({
      status: 'error',
      message: "terjadi kesalahan server"
    })
  }
}

module.exports = {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask
}