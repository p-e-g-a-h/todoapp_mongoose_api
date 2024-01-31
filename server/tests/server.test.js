const mongoose = require('mongoose')
const request = require('supertest')
const assert = require('assert')

const app = require('./../../index')
const Todo = require('./../models/todo')

const todos = [
  { 
    _id: new mongoose.Types.ObjectId,
    text: 'First test todo' 
  },
  { 
    _id: new mongoose.Types.ObjectId,
    text: 'Second test todo',
    completed: true,
    completedAt: 123
  }
]

beforeEach(async () => {
  await Todo.deleteMany({})
  await Todo.insertMany(todos)
})

describe('POST /api/todos', () => {
  it('should create a new todo', async () => {
    const newTodo = { text: 'test todo text' }
    const response = await request(app)
      .post('/api/todos')
      .send(newTodo)
      .expect(200)

    assert.equal(response.body.text, newTodo.text)
    const todos = await Todo.find(newTodo)
    assert.equal(todos.length, 1)
    assert.equal(todos[0].text, newTodo.text)
  })
  
  it('should not create todo with invalid body data', async () => {
    await request(app)
      .post('/api/todos')
      .send({})
      .expect(400)
    
    const todos = await Todo.find()
    assert.equal(todos.length, 2)
  })
})

describe('GET /api/todos', () => {
  it('should get all todos', async () => {
    const response = await request(app)
      .get('/api/todos')
      .expect(200)

    assert.equal(response.body.length, 2)
  })
})

describe('GET /api/todos/:id', () => {
  it('should return todo doc', async () => {
    const response = await request(app)
      .get(`/api/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      
    assert.equal(response.body.text, todos[0].text)
  })

  it('should return 404 if todo not found', async () => {
    await test404('get', `/api/todos/${new mongoose.Types.ObjectId}`)
  })

  it('should return 404 if object id is invalid', async () => {
    await test404('get', '/api/todos/123')
  })
})

describe('DELETE /api/todos/:id', () => {
  it('should remove a todo', async () => {
    const id = todos[0]._id
    const response = await request(app)
      .delete(`/api/todos/${id}`)
      .expect(200)
    
    assert.equal(response.body._id, id)
    const todo = await Todo.findById(id)
    assert.equal(todo, undefined)
  })

  it('should return 404 if todo not found', async () => {
    await test404('delete', `/api/todos/${new mongoose.Types.ObjectId}`)
  })

  it('should return 404 if object id is invalid', async () => {
    await test404('delete', '/api/todos/123')
  })
})

describe('PATCH /api/todos/:id', () => {
  it('should update just text of todo', async () => {
    const id = todos[0]._id
    const update = { text: 'This should be the new text' }
    const response = await request(app)
      .patch(`/api/todos/${id}`)
      .send(update)
      .expect(200)

    assert.equal(response.body._id, id)
    const todo = await Todo.findById(id)
    assert.equal(todo.text, update.text)
    assert.equal(todo.completed, false)
    assert.equal(todo.completedAt, null)
  })

  it('should update just completed, completedAt of todo', async () => {
    const { _id: id, text } = todos[0]
    const update = { completed: true }
    const response = await request(app)
      .patch(`/api/todos/${id}`)
      .send(update)
      .expect(200)

    assert.equal(response.body._id, id)
    const todo = await Todo.findById(id)
    assert.equal(todo.completed, update.completed)
    assert(todo.completedAt)
    assert.equal(todo.text, text)
  })

  it('should update todo completely', async () => {
    const id = todos[1]._id
    const update = {
      text: 'This should be the new text',
      completed: false
    }
    const response = await request(app)
      .patch(`/api/todos/${id}`)
      .send(update)
      .expect(200)
    
    assert.equal(response.body._id, id)
    const todo = await Todo.findById(id)
    assert.equal(todo.text, update.text)
    assert.equal(todo.completed, update.completed)
    assert.equal(todo.completedAt, null)
  })

  it('should return 404 if todo not found', async () => {
    await test404('patch', `/api/todos/${new mongoose.Types.ObjectId}`)
  })

  it('should return 404 if object id is invalid', async () => {
    await test404('patch', '/api/todos/123')
  })
})

async function test404(method, url) {
  await request(app)
    [method](url)
    .expect(404)
}