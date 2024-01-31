const env = process.env.NODE_ENV

if(env === 'development' || env === undefined) {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
}
else if(env === 'test') {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
}