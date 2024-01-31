const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")

require('./server/config/config')
require('./server/db/mongooseConnection')
const Todo = require('./server/models/todo')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.route('/api/todos')
  .post(async (req, res) => {
    try {
      const newTodo = new Todo({ text: req.body.text })
      const doc = await newTodo.save()
      res.send(doc)
    } catch (err) {
      res.status(400).send(err)
    }
  })
  .get(async (req, res) => {
    try {
      const todos = await Todo.find({})
      res.send(todos)
    } catch (err) {
      res.status(400).send(err)
    }
  })

app.all('/api/todos/:id', async (req, res) => {
  const id = req.params.id

  if(!mongoose.isValidObjectId(id)) {
    return res.status(404).send()
  }

  try {
    let todo = null
    if(req.method === 'GET') {
      todo = await Todo.findById(id)
    }
    else if(req.method === 'DELETE') {
      todo = await Todo.findByIdAndDelete(id)
    }
    else if(req.method === 'PATCH') {
      const update = req.body
      if(typeof update.completed == 'boolean') {
        update.completedAt = update.completed ? new Date().getTime() : null
      }
      todo = await Todo.findByIdAndUpdate(id, update)
    }

    if(!todo) return res.status(404).send()
    res.send(todo)
  } catch (err) {
    res.status(400).send(err)
  }
})

app.use((req, res, next) => {
  res.status(404).send({ 
    error: 'Not Found', 
    message: 'The requested resource was not found.' 
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send({ 
    error: 'Internal Server Error', 
    message: 'Something went wrong on the server.' 
  })
})

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = app