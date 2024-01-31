const mongoose = require('mongoose')

const connection = (async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('connected to monogodb')
  } catch (err) { console.log(err) }
})()
